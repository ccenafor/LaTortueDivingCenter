const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

require(path.join(root, 'assets/js/faq-assistant-content.js'));
require(path.join(root, 'assets/js/faq-assistant.js'));

const content = globalThis.ltFaqAssistantContent;
const assistant = globalThis.ltFaqAssistant;

assert.ok(content, 'FAQ content must load');
assert.ok(assistant, 'FAQ behavior must load');
assert.match(content.version, /^provisional-/, 'MVP content must be marked provisional');

const cases = {
  en: [
    ['Do you have a dorm?', 'rooms'],
    ['Can we see the restaurant menu?', 'restaurant'],
    ['Where can I eat?', 'restaurant'],
    ['Where can I stay?', 'rooms'],
    ['Where are you located?', 'arrival_contact'],
    ['How do I get there from Dumaguete airport?', 'arrival_contact'],
    ['I want an Open Water course', 'courses'],
    ['guided shore dives for a certified diver', 'fun_dives'],
    ['How much is an Apo Island trip?', 'apo_island'],
    ['Where can I see muck dive sites?', 'dive_sites'],
    ['Can I get a quote?', 'quote_booking']
  ],
  fr: [
    ['Avez-vous un dortoir ?', 'rooms'],
    ['Je voudrais voir le menu du restaurant', 'restaurant'],
    ['Où puis-je séjourner ?', 'rooms'],
    ['Où êtes-vous situés ?', 'arrival_contact'],
    ['Proposez-vous un transfert depuis l’aéroport ?', 'arrival_contact'],
    ['Je cherche un cours Open Water', 'courses'],
    ['Je veux faire des plongées loisirs guidées', 'fun_dives'],
    ['Quel est le prix d’une sortie Apo Island ?', 'apo_island'],
    ['Quels sont les sites de plongée macro ?', 'dive_sites'],
    ['Je voudrais un devis', 'quote_booking']
  ]
};

Object.entries(cases).forEach(([locale, localeCases]) => {
  const localeContent = content.locales[locale];
  assert.equal(localeContent.topics.length, 2, `${locale} must expose two topic shortcuts`);

  localeCases.forEach(([question, expectedId]) => {
    const match = assistant.matchQuery(question, localeContent.entries);
    assert.equal(match && match.id, expectedId, `${locale} query should match ${expectedId}: ${question}`);
  });

  assert.equal(
    assistant.matchQuery('quantum submarine insurance', localeContent.entries),
    null,
    `${locale} unknown query must use the no-match fallback`
  );

  const boundaryRegression = locale === 'fr'
    ? 'Quelle qualité de service proposez-vous ?'
    : 'What quality standards do you follow?';
  assert.equal(
    assistant.matchQuery(boundaryRegression, localeContent.entries),
    null,
    `${locale} short keywords must not match inside unrelated words`
  );

  [...localeContent.topics, ...localeContent.entries].forEach(entry => {
    (entry.links || []).forEach(link => {
      const localFile = path.join(root, link.path.replace(/^\//, ''));
      assert.ok(fs.existsSync(localFile), `Missing internal FAQ destination: ${link.path}`);
    });
  });
});

const partial = fs.readFileSync(path.join(root, 'assets/partials/faq-assistant.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'assets/css/faq-assistant.css'), 'utf8');
const behavior = fs.readFileSync(path.join(root, 'assets/js/faq-assistant.js'), 'utf8');
const siteScript = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');

assert.match(partial, /role="dialog"/, 'FAQ partial must expose a dialog landmark');
assert.match(partial, /aria-live="polite"/, 'FAQ result must be announced politely');
assert.match(styles, /prefers-reduced-motion/, 'FAQ styles must respect reduced motion');
assert.doesNotMatch(behavior, /faq_(?:question|query|input|text)\s*:/, 'Tracking must not include typed text');
assert.match(siteScript, /setupFaqAssistant\(\)/, 'Shared site initialization must load the FAQ');

console.log('FAQ assistant verification passed.');
