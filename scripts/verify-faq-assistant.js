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
assert.match(content.version, /^draft-drive-/, 'Imported content must retain its draft provenance');
assert.equal(content.source.status, 'work-in-progress');

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
    ['Do I need a coastal dive before Apo Island?', 'apo_requirements'],
    ["What if we don't have time to do a dive prior to Apo Island?", 'apo_no_prior_dive'],
    ['How do I get there from Moalboal?', 'arrival_contact'],
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
    ['Faut-il faire une plongée côtière avant Apo Island ?', 'apo_requirements'],
    ['Je n’ai pas le temps de plonger avant Apo Island', 'apo_no_prior_dive'],
    ['Comment venir depuis Siquijor ?', 'arrival_contact'],
    ['Quels sont les sites de plongée macro ?', 'dive_sites'],
    ['Je voudrais un devis', 'quote_booking']
  ]
};

const noMatchCases = {
  en: ['Can I arrive with my dog?'],
  fr: ['Puis-je venir avec mon chien ?']
};

const broadRouteCases = {
  en: [
    ['diving', 'diving_overview'],
    ['dive', 'diving_overview'],
    ['I would like information about diving', 'diving_overview']
  ],
  fr: [
    ['plongée', 'diving_overview'],
    ['plonger', 'diving_overview'],
    ['Je voudrais des informations sur la plongée', 'diving_overview']
  ]
};

const detailedCases = [
  ['How much is a fun dive?', 'dive_prices'],
  ['What is the price of a fun dive?', 'dive_prices'],
  ['How much does diving cost?', 'dive_prices'],
  ['What does the Apo Island trip include?', 'apo_inclusions'],
  ['Do you offer snorkeling at Apo Island?', 'non_divers'],
  ['What age can children learn to dive?', 'children_diving'],
  ['Do I need to rent equipment for fun dives?', 'dive_equipment'],
  ['Quel est le prix des plongées loisirs ?', 'dive_prices'],
  ['Le matériel est-il inclus dans les plongées loisirs ?', 'dive_equipment'],
  ['Que comprend le voyage à Apo Island ?', 'apo_inclusions'],
  ['What are the requirements for Apo Island?', 'apo_requirements'],
  ['Quelles sont les conditions pour Apo Island ?', 'apo_requirements'],
  ['I have no time for a dive before Apo Island', 'apo_no_prior_dive'],
  ['Et si je n’ai pas le temps de plonger avant Apo Island ?', 'apo_no_prior_dive'],
  ['Can I have a private guide at Apo Island?', 'private_guide'],
  ['Combien de plongées par jour ?', 'dive_schedule'],
  ['Do I need a refresher?', 'refresher'],
  ['Quels sont les moyens de paiement ?', 'quote_booking']
];
for (const locale of ['en', 'fr']) {
  for (const [question, expected] of detailedCases) {
    assert.equal(assistant.matchQuery(question, content.locales[locale].entries)?.id, expected, `${locale}: ${question}`);
  }
}

Object.entries(cases).forEach(([locale, localeCases]) => {
  const localeContent = content.locales[locale];
  assert.equal(localeContent.topics.length, 6, `${locale} must expose the six source categories`);
  assert.deepEqual(
    localeContent.topics.map(topic => topic.id),
    ['fun_dives', 'courses', 'apo_island', 'rooms', 'resort', 'arrival'],
    `${locale} editorial list must keep Getting Here last`
  );
  assert.equal(localeContent.entries.filter(entry => entry.sourceRow).length, 15, 'All completed source answers must be included');
  localeContent.entries.forEach(entry => {
    assert.ok(localeContent.topics.some(topic => topic.id === entry.topicId), `Unknown topic for ${entry.id}`);
    for (const question of entry.questions || []) {
      assert.equal(assistant.matchQuery(question, localeContent.entries)?.id, entry.id, `Editorial question: ${question}`);
    }
  });
  localeContent.topics.forEach(topic => {
    assert.ok(topic.entryIds.length);
    topic.entryIds.forEach(id => assert.ok(localeContent.entries.some(entry => entry.id === id && entry.topicId === topic.id)));
  });
  assert.deepEqual(
    localeContent.topics.find(topic => topic.id === 'apo_island').entryIds,
    ['apo_island', 'apo_inclusions', 'apo_requirements', 'apo_no_prior_dive'],
    `${locale} Apo Island topic must expose exactly four questions`
  );
  assert.match(
    localeContent.entries.find(entry => entry.id === 'apo_requirements').answer,
    /1[ ,]900/,
    `${locale} Apo requirements must include the coastal-dive price`
  );
  assert.match(
    localeContent.entries.find(entry => entry.id === 'apo_no_prior_dive').answer,
    /2[ ,]500/,
    `${locale} Apo alternative must include the private-guide price`
  );
  assert.equal(localeContent.searchRoutes.length, 1, `${locale} must expose the broad diving route`);
  localeContent.searchRoutes.forEach(route => {
    route.topicIds.forEach(id => assert.ok(localeContent.topics.some(topic => topic.id === id)));
  });
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

  broadRouteCases[locale].forEach(([question, expectedId]) => {
    const match = assistant.matchQuery(question, localeContent.entries, localeContent.searchRoutes);
    assert.equal(match && match.id, expectedId, `${locale} broad query should route to choices: ${question}`);
  });

  for (const dayVisitQuery of ['day use', 'day visit', 'visite à la journée', 'accès journée']) {
    assert.equal(
      assistant.matchQuery(dayVisitQuery, localeContent.entries, localeContent.searchRoutes)?.id,
      'restaurant',
      `${locale} day-visit query should match restaurant: ${dayVisitQuery}`
    );
  }

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
      assert.ok(fs.existsSync(path.join(root, 'fr', link.path.replace(/^\//, ''))), `Missing French FAQ destination: ${link.path}`);
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
const siteStyles = fs.readFileSync(path.join(root, 'new_styles.css'), 'utf8');
const footerEn = fs.readFileSync(path.join(root, 'footer.html'), 'utf8');
const footerFr = fs.readFileSync(path.join(root, 'fr/footer.html'), 'utf8');

assert.match(partial, /role="dialog"/, 'FAQ partial must expose a dialog landmark');
assert.match(partial, /aria-live="polite"/, 'FAQ result must be announced politely');
assert.doesNotMatch(partial, /data-faq-whatsapp/, 'The persistent WhatsApp action must stay outside the FAQ dialog');
assert.doesNotMatch(partial, /data-faq-(?:eyebrow|intro|privacy)/, 'Removed helper copy must not remain in the FAQ markup');
assert.match(styles, /prefers-reduced-motion/, 'FAQ styles must respect reduced motion');
assert.match(styles, /\.faq-assistant__panel\s*\{[^}]*padding:\s*0;/s, 'FAQ panel must override global section padding');
assert.match(styles, /\.faq-assistant__input,\s*\.faq-assistant__submit\s*\{[^}]*height:\s*2\.85rem;/s, 'FAQ input and submit button must share an explicit height');
assert.match(styles, /\.faq-assistant__topics\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s, 'FAQ topics must use the editorial list layout');
assert.match(styles, /\.faq-assistant__topic--navigation\s*\{[^}]*grid-template-columns:/s, 'Editorial list rows must align icon, label and chevron');
assert.doesNotMatch(behavior, /ui\.(?:intro|questionPlaceholder|privacy|resultLabel|provisionalNote)/, 'Removed helper copy must not be rendered');
assert.match(behavior, /className = 'faq-assistant__topic faq-assistant__topic--navigation'/, 'Top-level topics must use editorial navigation rows');
assert.match(behavior, /svg\.setAttribute\('aria-hidden', 'true'\)/, 'Editorial topic icons must stay decorative for assistive technology');
assert.match(behavior, /links:\s*\[\{ id: 'whatsapp', label: ui\.whatsappLabel \}\]/, 'FAQ no-match result must keep its contextual WhatsApp fallback');
assert.match(behavior, /closest\('\[data-faq-open\]'\)/, 'Delegated footer FAQ control must open the assistant after async footer loading');
assert.match(behavior, /openPanel\(footerTrigger\)/, 'Footer FAQ control must be recorded as the dialog opener');
assert.match(behavior, /returnFocusTarget\.isConnected/, 'Closing the FAQ must return focus to the active opener when it remains available');
assert.match(footerEn, /<a href="#faq-assistant-panel" data-faq-open>FAQ<\/a>/, 'English footer must expose the FAQ control');
assert.match(footerFr, /<a href="#faq-assistant-panel" data-faq-open>FAQ<\/a>/, 'French footer must expose the FAQ control');
assert.doesNotMatch(behavior, /faq_(?:question|query|input|text)\s*:/, 'Tracking must not include typed text');
assert.match(siteScript, /setupFaqAssistant\(\)/, 'Shared site initialization must load the FAQ');
assert.match(siteScript, /setupFloatingWhatsApp\(\)/, 'Shared site initialization must restore the site-level WhatsApp action');
assert.match(siteScript, /className = 'floating-whatsapp'/, 'Site-level WhatsApp action must use the expected hook');
assert.match(siteScript, /className = 'floating-actions'/, 'Site-level actions must share a responsive layout container');
assert.match(siteStyles, /\.floating-whatsapp\s*\{/, 'Site styles must include the floating WhatsApp action');
assert.match(siteStyles, /\.floating-actions \.faq-assistant\s*\{/, 'The FAQ and WhatsApp actions must share the same responsive positioning context');

console.log('FAQ assistant verification passed.');
