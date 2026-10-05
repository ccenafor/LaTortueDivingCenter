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
    this.style = { setProperty() {}, removeProperty() {} };
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
  addEventListener() {}
  getBoundingClientRect() { return this.rect || { top: 20000, bottom: 20100, height: 100 }; }
}

const createHarness = ({ mobile = true, tallSection = false } = {}) => {
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
    body, head, readyState: 'loading', documentElement: { lang: 'en', clientHeight: 844 },
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
    innerHeight: 844, matchMedia: () => ({ matches: mobile }), addEventListener() {},
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
  return { window, document, section, observers, getFaqFetches: () => faqFetches };
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
});
