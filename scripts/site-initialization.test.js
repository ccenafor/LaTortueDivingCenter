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
  matches(selector) {
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    if (selector === '[data-faq-assistant]') return this.faqRoot;
    if (selector === '.reveal') return this.classList.contains('reveal');
    return false;
  }
  querySelectorAll(selector) {
    return this.children.flatMap(x => [...(x.matches(selector) ? [x] : []), ...x.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  addEventListener(type, callback) { (this.events[type] ||= []).push(callback); }
  emit(type, values = {}) {
    const event = { type, isPrimary: true, button: 0, pointerId: 1, clientX: 0, clientY: 0,
      preventDefault() { this.prevented = true; }, stopPropagation() { this.stopped = true; }, ...values };
    (this.events[type] || []).forEach(callback => callback(event));
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

const createHarness = ({ mobile = true, tallSection = false, lang = 'en' } = {}) => {
  const body = new Element('body');
  const head = new Element('head');
  const roots = [head, body];
  let faqFetches = 0;
  const observers = [];
  const section = new Element('section');
  section.rect = { top: 1100, bottom: 12304, height: 11204 };
  if (tallSection) {
    const room = new Element();
    room.className = 'room-section';
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
          const assistant = new Element('aside');
          assistant.faqRoot = true;
          return assistant;
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
    takeRecords() { return []; }
  }
  const window = {
    location: { origin: 'https://latortuediving.com', pathname: '/cottages' },
    innerHeight: 844, innerWidth: 390, events: {},
    matchMedia: () => ({ get matches() { return mobile; } }),
    addEventListener(type, callback) { (this.events[type] ||= []).push(callback); },
    IntersectionObserver, ltFaqAssistantContent: { locales: { en: {} } },
    ltFaqAssistant: { init: () => {
      const assistant = document.querySelector('[data-faq-assistant]');
      if (assistant) { assistant.dataset.faqInitialized = 'true'; assistant.label = 'Need help?'; }
    } }
  };
  vm.runInNewContext(source, {
    window, document, URL, IntersectionObserver,
    requestAnimationFrame: callback => callback(), setTimeout: () => {},
    console: { error: error => { throw error; } },
    fetch: async () => { faqFetches++; return { ok: true, text: async () => '<aside data-faq-assistant></aside>' }; }
  });
  return { window, document, section, observers, getFaqFetches: () => faqFetches,
    resize(width, height) {
      window.innerWidth = width;
      window.innerHeight = height;
      mobile = width <= 768;
      (window.events.resize || []).forEach(callback => callback());
    } };
};

test('mobile rooms remain visible below the hero without an observer callback', () => {
  const h = createHarness({ tallSection: true });
  h.window.testSite.setupRevealAnimations();
  const observer = h.observers[0];
  // The 11,204px room list starts below the 844px viewport. No callback is fired.
  assert.equal(h.section.classList.contains('reveal'), false, 'The room list must not receive the transparent animation state');
  assert.equal(h.section.classList.contains('is-visible'), true, 'Rooms must be visible without an animation callback');
  assert.equal(observer.targets.has(h.section), false, 'Room visibility must not depend on the observer');
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
  assert.equal(h.document.querySelectorAll('.floating-actions__move').length, 1);
  assert.equal(h.window.events.resize.length, 1, 'Cached-page initialization must not add drag listeners again');
});

const movableActions = options => {
  const h = createHarness(options);
  h.window.testSite.setupFloatingWhatsApp();
  return { ...h, actions: h.document.querySelector('.floating-actions'), handle: h.document.querySelector('.floating-actions__move') };
};

test('a tap moves help actions away from the footer; arrows and Home work without dragging', () => {
  const h = movableActions({ lang: 'fr' });
  assert.equal(h.handle.getAttribute('aria-label'), 'Déplacer les boutons d’aide');
  assert.ok(h.document.getElementById(h.handle.getAttribute('aria-describedby')).textContent.includes('flèches'));
  h.handle.emit('click');
  assert.equal(h.actions.getBoundingClientRect().top, 88);
  assert.equal(h.actions.getBoundingClientRect().right, 378);
  assert.equal(h.handle.emit('keydown', { key: 'ArrowLeft' }).prevented, true);
  assert.equal(h.actions.getBoundingClientRect().left, 84);
  h.handle.emit('keydown', { key: 'Home' });
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  h.handle.emit('click');
  h.handle.emit('click');
  assert.equal(h.actions.getBoundingClientRect().left, 12, 'The next tap selects the opposite top corner');
});

test('dragging is clamped, captures the pointer and does not also change corner on release', () => {
  const h = movableActions();
  h.handle.emit('pointerdown', { clientX: 130, clientY: 800 });
  assert.equal(h.handle.capture, 1);
  h.handle.emit('pointermove', { clientX: -1000, clientY: 300 });
  const dragged = h.actions.getBoundingClientRect();
  assert.equal(dragged.left, 12);
  assert.equal(dragged.top, 279);
  h.handle.emit('pointerup');
  h.handle.emit('click');
  assert.deepEqual(h.actions.getBoundingClientRect(), dragged, 'The click generated by a drag must not trigger the tap shortcut');
  assert.equal(h.handle.capture, null);
  assert.equal(h.actions.classList.contains('is-dragging'), false);
  h.handle.emit('pointerdown');
  h.handle.emit('pointermove', { clientX: 2000, clientY: -2000 });
  assert.equal(h.actions.getBoundingClientRect().top, 88);
  assert.equal(h.actions.getBoundingClientRect().right, 378);
  h.handle.emit('pointercancel');
  assert.equal(h.actions.classList.contains('is-dragging'), false);
  h.handle.emit('click');
  assert.equal(h.actions.getBoundingClientRect().top, 88, 'A cancelled gesture does not disable subsequent taps');
});

test('resizing keeps actions in view, above bottom banners, and restores the desktop dock', () => {
  const h = movableActions();
  for (let i = 0; i < 4; i++) h.handle.emit('click');
  h.window.bottomClearance = 96;
  h.resize(320, 360);
  const rect = h.actions.getBoundingClientRect();
  assert.equal(rect.right, 308);
  assert.equal(rect.bottom, 252, 'The booking/cookie bar clearance must be preserved after a move');
  h.window.visualViewport = { offsetLeft: 0, offsetTop: 0, width: 320, height: 220 };
  h.resize(320, 360);
  assert.ok(h.actions.getBoundingClientRect().bottom <= 208, 'The keyboard-reduced visual viewport must also bound movement');
  h.resize(1280, 720);
  assert.equal(h.actions.classList.contains('is-positioned'), false);
  assert.equal(h.actions.style['--floating-actions-x'], undefined);
  h.handle.emit('click');
  assert.equal(h.actions.classList.contains('is-positioned'), false, 'Mobile movement must not activate on desktop');
});
