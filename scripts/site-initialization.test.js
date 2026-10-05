const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Exercise the shared initializer without network or a browser dependency.
const source = fs.readFileSync(path.join(__dirname, '../assets/site.js'), 'utf8')
  .replace(/\}\)\(\);\s*$/, 'window.testSite = { setupFaqAssistant, setupFloatingWhatsApp, setupRevealAnimations };})();');

class Element {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.className = '';
    this.events = {};
    this.style = {
      setProperty: (key, value) => { this.style[key] = value; },
      removeProperty: key => { delete this.style[key]; }
    };
    this.classList = {
      contains: value => this.className.split(' ').includes(value),
      add: value => { if (!this.classList.contains(value)) this.className += ` ${value}`; },
      remove: value => { this.className = this.className.split(' ').filter(x => x !== value).join(' '); }
    };
  }
  appendChild(child) {
    if (child.parentElement) child.parentElement.children.splice(child.parentElement.children.indexOf(child), 1);
    this.children.push(child);
    child.parentElement = this;
    return child;
  }
  replaceChildren(child) {
    this.children.forEach(x => { x.parentElement = null; });
    this.children = [];
    this.appendChild(child);
  }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key] || null; }
  removeAttribute(key) { delete this.attributes[key]; }
  matches(selector) {
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    if (selector === '[data-faq-assistant]') return this.faqRoot;
    if (selector === '[data-faq-trigger]') return Object.hasOwn(this.attributes, 'data-faq-trigger');
    if (selector === '.reveal') return this.classList.contains('reveal');
    return false;
  }
  querySelectorAll(selector) {
    return this.children.flatMap(x => [...(x.matches(selector) ? [x] : []), ...x.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector); }
  addEventListener(type, callback, capture = false) { (this.events[type] ||= []).push({ callback, capture }); }
  emit(type, values = {}) {
    const event = { type, target: this, detail: 1, isPrimary: true, button: 0, pointerId: 1, clientX: 0, clientY: 0,
      preventDefault() { this.prevented = true; }, stopPropagation() { this.stopped = true; },
      stopImmediatePropagation() { this.stopped = true; this.immediateStopped = true; }, ...values };
    const path = [];
    for (let element = this; element; element = element.parentElement) path.push(element);
    const run = (element, capture) => {
      for (const listener of element.events[type] || []) {
        if (listener.capture === capture && !event.immediateStopped) listener.callback(event);
      }
    };
    for (const element of [...path].reverse()) { run(element, true); if (event.stopped) break; }
    if (!event.stopped) for (const element of path) { run(element, false); if (event.stopped) break; }
    return event;
  }
  setPointerCapture(id) { this.capture = id; }
  hasPointerCapture(id) { return this.capture === id; }
  releasePointerCapture() { this.capture = null; }
  getBoundingClientRect() {
    if (this.classList.contains('floating-actions')) {
      const viewport = this.viewport();
      const positioned = this.classList.contains('is-positioned');
      const left = positioned ? parseFloat(this.style['--floating-actions-x']) : viewport.innerWidth - 270 - 12;
      const top = positioned ? parseFloat(this.style['--floating-actions-y']) : viewport.innerHeight - 53 - 12 - (viewport.bottomClearance || 0);
      return { left, top, width: 270, height: 53, right: left + 270, bottom: top + 53 };
    }
    return this.rect || { top: 20000, bottom: 20100, height: 100 };
  }
}

const fakeAssistant = () => {
  const assistant = new Element('aside');
  assistant.faqRoot = true;
  assistant.className = 'faq-assistant';
  const trigger = new Element('button');
  trigger.className = 'faq-assistant__trigger';
  trigger.setAttribute('data-faq-trigger', '');
  trigger.setAttribute('aria-expanded', 'false');
  assistant.appendChild(trigger);
  return assistant;
};

const createHarness = ({ mobile = true, tallSection = false, lang = 'en' } = {}) => {
  const body = new Element('body');
  const head = new Element('head');
  const roots = [head, body];
  let faqFetches = 0;
  const observers = [];
  let now = 0;
  let timerId = 0;
  const timers = new Map();
  const section = new Element('section');
  section.rect = { top: 1100, bottom: 12304, height: 11204 };
  if (tallSection) {
    const room = new Element();
    room.className = 'room-section';
    room.rect = { top: 1100, bottom: 5100, height: 4000 };
    section.appendChild(room);
    body.appendChild(section);
  }
  const document = {
    body, head, readyState: 'loading', documentElement: { lang, clientHeight: 844 },
    addEventListener() {},
    getElementById: id => {
      const find = el => el.id === id ? el : el.children.map(find).find(Boolean);
      return roots.map(find).find(Boolean) || null;
    },
    querySelector: selector => document.querySelectorAll(selector)[0] || null,
    querySelectorAll: selector => {
      if (selector === 'section:not(.slider)') return tallSection ? [section] : [];
      return roots.flatMap(x => x.querySelectorAll(selector));
    },
    createElement: tag => {
      const el = new Element(tag);
      el.viewport = () => window;
      if (tag === 'template') {
        // fetchHTML clones the assistant partial into its placeholder.
        el.content = { querySelectorAll: () => [], cloneNode: () => {
          return fakeAssistant();
        } };
      }
      return el;
    }
  };
  class IntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.targets = new Set();
      observers.push(this);
    }
    observe(el) { this.targets.add(el); }
    unobserve(el) { this.targets.delete(el); }
    disconnect() { this.targets.clear(); }
    takeRecords() { return []; }
  }
  const window = {
    location: { origin: 'https://latortuediving.com', pathname: '/cottages' },
    innerHeight: 844, innerWidth: 390, events: {},
    matchMedia: () => ({ get matches() { return mobile; } }),
    addEventListener(type, callback) { (this.events[type] ||= []).push(callback); },
    removeEventListener(type, callback) { this.events[type] = (this.events[type] || []).filter(listener => listener !== callback); },
    IntersectionObserver, ltFaqAssistantContent: { locales: { en: {} } },
    ltFaqAssistant: { init: () => {
      const assistant = document.querySelector('[data-faq-assistant]');
      if (assistant) { assistant.dataset.faqInitialized = 'true'; assistant.label = 'Need help?'; }
    } }
  };
  vm.runInNewContext(source, {
    window, document, URL, IntersectionObserver,
    requestAnimationFrame: callback => callback(),
    setTimeout: (callback, delay) => { const id = ++timerId; timers.set(id, { callback, due: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    console: { error: error => { throw error; } },
    fetch: async () => { faqFetches++; return { ok: true, text: async () => '<aside data-faq-assistant></aside>' }; }
  });
  return { window, document, section, observers, getFaqFetches: () => faqFetches,
    advance(milliseconds) {
      now += milliseconds;
      for (const [id, timer] of timers) if (timer.due <= now) { timers.delete(id); timer.callback(); }
    },
    resize(width, height) {
      window.innerWidth = width;
      window.innerHeight = height;
      mobile = width <= 768;
      (window.events.resize || []).forEach(callback => callback());
    } };
};

test('the tall room list stays visible while each room gets its own scroll animation', () => {
  const h = createHarness({ tallSection: true });
  h.window.testSite.setupRevealAnimations();
  const observer = h.observers[0];
  // The 11,204px room list starts below the 844px viewport. No callback is fired.
  assert.equal(h.section.classList.contains('reveal'), false, 'The room list must not receive the transparent animation state');
  assert.equal(h.section.classList.contains('is-visible'), true, 'Rooms must be visible without an animation callback');
  assert.equal(observer.targets.has(h.section), false, 'Room visibility must not depend on the observer');
  const room = h.section.querySelector('.room-section');
  const roomObserver = h.observers[1];
  assert.equal(room.classList.contains('reveal'), true, 'Keep the requested animation on each room');
  assert.equal(roomObserver.targets.has(room), true);
  assert.equal(roomObserver.options.threshold, 0, 'A tall room must reveal on entry even in a short viewport');
  roomObserver.callback([{ target: room, isIntersecting: true, intersectionRatio: 0.01 }]);
  assert.equal(room.classList.contains('is-visible'), true);
});

test('scroll still reveals a room if the observer callback is delayed or absent', () => {
  const h = createHarness({ tallSection: true });
  h.window.testSite.setupRevealAnimations();
  const room = h.section.querySelector('.room-section');
  assert.equal(room.classList.contains('is-visible'), false, 'A room below the fold waits for scrolling');
  room.rect = { top: 300, bottom: 4300, height: 4000 };
  h.window.innerHeight = 390;
  h.window.events.scroll.slice().forEach(callback => callback());
  assert.equal(room.classList.contains('is-visible'), true, 'Entering a short landscape viewport must reveal the room without IO');
  assert.equal(h.window.events.scroll.length, 0, 'Remove the fallback listener after all rooms are revealed');
});

test('restoring a cached page does not duplicate room scroll watchers', () => {
  const h = createHarness({ tallSection: true });
  h.window.testSite.setupRevealAnimations();
  h.window.testSite.setupRevealAnimations();
  assert.equal(h.window.events.scroll.length, 1);
  assert.equal(h.observers[1].targets.size, 0, 'Disconnect the prior room observer on reinitialization');
  assert.equal(h.observers[3].targets.has(h.section.querySelector('.room-section')), true);
});

test('rooms remain visible if the browser has no IntersectionObserver', () => {
  const h = createHarness({ tallSection: true });
  delete h.window.IntersectionObserver;
  h.window.testSite.setupRevealAnimations();
  assert.equal(h.section.querySelector('.room-section').classList.contains('reveal'), false);
});

test('reinitialization reuses the FAQ after it has moved into floating actions', async () => {
  const h = createHarness();
  for (let i = 0; i < 3; i++) {
    await h.window.testSite.setupFaqAssistant();
    h.window.testSite.setupFloatingWhatsApp();
  }
  const assistants = h.document.querySelectorAll('[data-faq-assistant]');
  assert.equal(assistants.length, 1, 'Returning to a cached page must not add a second Need help button');
  assert.equal(h.document.querySelectorAll('.floating-whatsapp').length, 1);
  assert.equal(assistants[0].label, 'Need help?');
  assert.equal(h.getFaqFetches(), 1, 'An already mounted assistant must not fetch another partial');
  assert.equal(h.document.querySelectorAll('.floating-actions__move').length, 0, 'The separate move handle is removed');
  assert.equal(h.window.events.resize.length, 1, 'Cached-page initialization must not add drag listeners again');
});

const movableActions = options => {
  const h = createHarness(options);
  h.document.body.appendChild(fakeAssistant());
  h.window.testSite.setupFloatingWhatsApp();
  return { ...h, actions: h.document.querySelector('.floating-actions'), whatsapp: h.document.querySelector('.floating-whatsapp'), faq: h.document.querySelector('[data-faq-trigger]') };
};

const hold = (h, control, values = {}) => {
  control.emit('pointerdown', values);
  h.advance(450);
};

test('normal taps keep their original action; holding either button can reposition without dragging', () => {
  const h = movableActions({ lang: 'fr' });
  assert.ok(h.document.getElementById(h.faq.getAttribute('aria-describedby')).textContent.includes('Maintenez'));
  for (const control of [h.faq, h.whatsapp]) {
    control.emit('pointerdown');
    h.advance(200);
    control.emit('pointerup');
    assert.equal(control.emit('click').prevented, undefined, 'Quick taps must still open help or navigate to WhatsApp');
    assert.equal(h.actions.classList.contains('is-positioned'), false);
  }
  hold(h, h.whatsapp);
  h.whatsapp.emit('pointerup');
  assert.equal(h.whatsapp.emit('click').prevented, true, 'Holding to move must not navigate to WhatsApp');
  assert.equal(h.actions.getBoundingClientRect().top, 88);
  assert.equal(h.actions.getBoundingClientRect().right, 378);
  assert.equal(h.faq.emit('keydown', { key: 'ArrowLeft' }).prevented, true);
  assert.equal(h.actions.getBoundingClientRect().left, 84);
  h.faq.emit('keydown', { key: 'Home' });
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  hold(h, h.faq);
  h.faq.emit('pointerup');
  assert.equal(h.faq.emit('click').immediateStopped, true, 'Capture must suppress the FAQ click after a hold');
  assert.equal(h.actions.getBoundingClientRect().top, 88);
});

test('long-press dragging is clamped and does not open FAQ on release', () => {
  const h = movableActions();
  hold(h, h.faq, { clientX: 130, clientY: 800, pointerType: 'touch' });
  assert.equal(h.faq.capture, 1);
  h.faq.emit('pointermove', { clientX: -1000, clientY: 300 });
  const dragged = h.actions.getBoundingClientRect();
  assert.equal(dragged.left, 12);
  assert.equal(dragged.top, 279);
  h.faq.emit('pointerup');
  let faqClicks = 0;
  h.faq.addEventListener('click', () => { faqClicks++; });
  assert.equal(h.faq.emit('click').prevented, true);
  assert.equal(faqClicks, 0, 'The capture handler must run before the FAQ bubble handler');
  assert.deepEqual(h.actions.getBoundingClientRect(), dragged, 'The click generated by a drag must not trigger the tap shortcut');
  assert.equal(h.faq.capture, null);
  assert.equal(h.actions.classList.contains('is-dragging'), false);
  hold(h, h.whatsapp);
  h.whatsapp.emit('pointermove', { clientX: 2000, clientY: -2000 });
  assert.equal(h.actions.getBoundingClientRect().top, 88);
  assert.equal(h.actions.getBoundingClientRect().right, 378);
  h.whatsapp.emit('pointercancel');
  assert.equal(h.actions.classList.contains('is-dragging'), false);
  h.whatsapp.emit('pointerdown');
  h.whatsapp.emit('pointerup');
  assert.equal(h.whatsapp.emit('click').prevented, undefined, 'A cancelled gesture must not disable subsequent taps');
});

test('moving before the hold delay cancels both repositioning and accidental navigation', () => {
  const h = movableActions();
  h.whatsapp.emit('pointerdown');
  h.advance(100);
  h.whatsapp.emit('pointermove', { clientY: -100 });
  h.advance(500);
  h.whatsapp.emit('pointerup');
  assert.equal(h.whatsapp.emit('click').prevented, true);
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  assert.equal(h.actions.classList.contains('is-dragging'), false);
});

test('opening the FAQ returns actions to the bottom and locks movement until it closes', () => {
  const h = movableActions();
  h.faq.emit('keydown', { key: 'ArrowUp' });
  assert.equal(h.actions.classList.contains('is-positioned'), true);
  h.faq.setAttribute('aria-expanded', 'true');
  h.faq.emit('faq-assistant-open');
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  hold(h, h.whatsapp);
  h.whatsapp.emit('pointermove', { clientY: -200 });
  h.whatsapp.emit('pointerup');
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  h.faq.setAttribute('aria-expanded', 'false');
  assert.equal(h.faq.emit('click', { detail: 0 }).prevented, undefined, 'Keyboard activation must always be available');
});

test('resizing keeps actions in view, above bottom banners, and restores the desktop dock', () => {
  const h = movableActions();
  h.faq.emit('keydown', { key: 'ArrowUp' });
  h.window.bottomClearance = 96;
  h.resize(320, 360);
  const rect = h.actions.getBoundingClientRect();
  assert.equal(rect.right, 308);
  assert.equal(rect.bottom, 252, 'The booking/cookie bar clearance must be preserved after a move');
  h.window.visualViewport = { offsetLeft: 0, offsetTop: 0, width: 320, height: 220 };
  h.resize(320, 360);
  assert.ok(h.actions.getBoundingClientRect().bottom <= 208, 'The keyboard-reduced visual viewport must also bound movement');
  h.resize(1280, 720);
  assert.equal(h.faq.getAttribute('aria-describedby'), null, 'Desktop controls must not announce unavailable mobile gestures');
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  assert.equal(h.actions.style['--floating-actions-x'], undefined);
  h.faq.emit('keydown', { key: 'ArrowUp' });
  assert.equal(h.actions.classList.contains('is-positioned'), false, 'Mobile movement must not activate on desktop');
});
