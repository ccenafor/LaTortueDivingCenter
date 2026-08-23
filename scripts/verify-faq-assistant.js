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
    ['Do you have accommodations?', 'rooms'],
    ['Can we see the restaurant menu?', 'restaurant'],
    ['Are there restaurants nearby?', 'restaurant'],
    ['Where can I eat?', 'restaurant'],
    ['Where can I stay?', 'rooms'],
    ['Where are you located?', 'arrival_contact'],
    ['How do I get there?', 'arrival_contact'],
    ['How to get there?', 'arrival_contact'],
    ['When can I arrive?', 'arrival_contact'],
    ['What time can I arrive?', 'arrival_contact'],
    ['I have a late arrival', 'arrival_contact'],
    ['What is the arrival time?', 'arrival_contact'],
    ['How do I get there from Dumaguete airport?', 'arrival_contact'],
    ['I want an Open Water course', 'courses'],
    ['guided shore dives for a certified diver', 'fun_dives'],
    ['I am certified and want guided shore dives', 'fun_dives'],
    ['Do you offer shore dives?', 'fun_dives'],
    ['How much is an Apo Island trip?', 'apo_island'],
    ['Where can I see muck dive sites?', 'dive_sites'],
    ['Can I get a quote?', 'quote_booking']
  ],
  fr: [
    ['Avez-vous un dortoir ?', 'rooms'],
    ['Proposez-vous des hébergements ?', 'rooms'],
    ['Je voudrais voir le menu du restaurant', 'restaurant'],
    ['Y a-t-il des restaurants à proximité ?', 'restaurant'],
    ['Où puis-je séjourner ?', 'rooms'],
    ['Où êtes-vous situés ?', 'arrival_contact'],
    ['Comment venir chez vous ?', 'arrival_contact'],
    ['Comment arriver chez vous ?', 'arrival_contact'],
    ['Comment se rendre chez vous ?', 'arrival_contact'],
    ['À quelle heure puis-je arriver ?', 'arrival_contact'],
    ['J’ai une arrivée tardive', 'arrival_contact'],
    ['Quelle est l’heure d’arrivée ?', 'arrival_contact'],
    ['Proposez-vous un transfert depuis l’aéroport ?', 'arrival_contact'],
    ['Je cherche un cours Open Water', 'courses'],
    ['Je veux faire des plongées loisirs guidées', 'fun_dives'],
    ['Je veux des plongées guidées du bord', 'fun_dives'],
    ['Proposez-vous des plongées du bord ?', 'fun_dives'],
    ['Quel est le prix d’une sortie Apo Island ?', 'apo_island'],
    ['Quels sont les sites de plongée macro ?', 'dive_sites'],
    ['Je voudrais un devis', 'quote_booking']
  ]
};

const noMatchCases = {
  en: ['Can I arrive with my dog?'],
  fr: ['Puis-je venir avec mon chien ?']
};

Object.entries(cases).forEach(([locale, localeCases]) => {
  const localeContent = content.locales[locale];
  assert.equal(localeContent.topics.length, 2, `${locale} must expose two topic shortcuts`);
  ['eyebrow', 'intro', 'questionPlaceholder', 'privacy', 'resultLabel', 'provisionalNote'].forEach(key => {
    assert.equal(key in localeContent.ui, false, `${locale} removed UI copy must stay absent: ${key}`);
  });
  assert.equal(localeContent.ui.title, 'FAQ', `${locale} must use the compact FAQ header title`);
  assert.equal(
    localeContent.ui.questionLabel,
    locale === 'fr' ? 'Posez votre question' : 'Ask anything',
    `${locale} must use the concise question label`
  );

  localeCases.forEach(([question, expectedId]) => {
    const match = assistant.matchQuery(question, localeContent.entries);
    assert.equal(match && match.id, expectedId, `${locale} query should match ${expectedId}: ${question}`);
  });

  noMatchCases[locale].forEach(question => {
    assert.equal(
      assistant.matchQuery(question, localeContent.entries),
      null,
      `${locale} unsupported policy question must use the no-match fallback: ${question}`
    );
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

const enKeywordsById = Object.fromEntries(
  content.locales.en.entries.map(entry => [entry.id, entry.keywords])
);
content.locales.fr.entries.forEach(entry => {
  assert.deepEqual(
    entry.keywords,
    enKeywordsById[entry.id],
    `Mirrored EN/FR keyword lists must stay aligned for ${entry.id}`
  );
});

const partial = fs.readFileSync(path.join(root, 'assets/partials/faq-assistant.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'assets/css/faq-assistant.css'), 'utf8');
const behavior = fs.readFileSync(path.join(root, 'assets/js/faq-assistant.js'), 'utf8');
const siteScript = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');

assert.match(partial, /role="dialog"/, 'FAQ partial must expose a dialog landmark');
assert.match(partial, /aria-live="polite"/, 'FAQ result must be announced politely');
assert.doesNotMatch(partial, /data-faq-(?:eyebrow|intro|privacy)/, 'Removed helper copy must not remain in the FAQ markup');
assert.match(styles, /prefers-reduced-motion/, 'FAQ styles must respect reduced motion');
assert.match(styles, /\.faq-assistant__panel\s*\{[^}]*padding:\s*0;/s, 'FAQ panel must override global section padding');
assert.match(styles, /\.faq-assistant__input,\s*\.faq-assistant__submit\s*\{[^}]*height:\s*2\.85rem;/s, 'FAQ input and submit button must share an explicit height');
assert.doesNotMatch(behavior, /ui\.(?:intro|questionPlaceholder|privacy|resultLabel|provisionalNote)/, 'Removed helper copy must not be rendered');
assert.doesNotMatch(behavior, /faq_(?:question|query|input|text)\s*:/, 'Tracking must not include typed text');
assert.match(siteScript, /setupFaqAssistant\(\)/, 'Shared site initialization must load the FAQ');

console.log('FAQ assistant verification passed.');
