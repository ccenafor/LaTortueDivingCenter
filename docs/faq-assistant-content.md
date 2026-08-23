# Guided FAQ assistant content

The website-wide FAQ assistant is a small, non-AI routing guide. Its current answers are deliberately marked as provisional in both languages. They point visitors to existing pages and ask the La Tortue team to confirm details that can change.

## Files and responsibilities

- `assets/js/faq-assistant-content.js`: editable English and French labels, topics, answers, keywords, links, and generic WhatsApp fallback message.
- `assets/js/faq-assistant.js`: matching, rendering, accessibility, localization, and anonymous event logic. Content editors should not need to change this file.
- `assets/partials/faq-assistant.html`: shared semantic structure.
- `assets/css/faq-assistant.css`: widget layout and responsive styling.
- `assets/site.js`: shared loader used by every actual English and French page.

## Update an existing answer

1. Open `assets/js/faq-assistant-content.js` as UTF-8.
2. Find the same entry `id` under `locales.en.entries` and `locales.fr.entries`.
3. Update `title`, `answer`, `keywords`, or `links` in both languages.
4. Keep claims conservative. Availability, schedules, prices, conditions, wildlife sightings, prerequisites, and final quotes should be confirmed by the team unless the owners have approved exact wording.
5. Keep internal `path` values in their English root form, such as `/cottages.html`. The behavior script automatically adds `/fr` on French URLs.
6. Increment the top-level `version` value so analytics can distinguish the revised content without recording a visitor’s question.
7. Run `npm run verify-faq-assistant` and `npm run build`.
8. Review both `/` and `/fr/` locally at desktop and mobile widths. Also check keyboard opening, topic buttons, typed matches, no-match WhatsApp fallback, Escape-to-close, and visible focus states.

## Add an answer

Add an object with the same unique `id` to both locale `entries` arrays:

```js
{
  id: 'stable_machine_name',
  title: 'Visitor-facing result title',
  answer: 'Short, cautious guidance with no unapproved operational claim.',
  keywords: ['specific phrase', 'useful synonym'],
  links: [
    { id: 'analytics_destination_name', label: 'Visitor-facing link', path: '/relevant-page.html' }
  ]
}
```

Use specific keywords before broad ones. Matching ignores capitalization, punctuation, and accents. Keywords may be phrases. Add both English and French synonyms to both versions so either language can still find the topic.

## Update topic shortcuts

The two `topics` arrays control the visible Resort and Diving shortcut buttons. Keep the `id` aligned between English and French. Each topic can show several relevant internal links.

## Privacy-safe usage events

The assistant pushes only structured IDs and page context to `dataLayer`, and also dispatches the same payload in the `lt:faq-assistant` custom event. Events are:

- `faq_assistant_open`
- `faq_assistant_topic_select`
- `faq_assistant_match`
- `faq_assistant_no_match`
- `faq_assistant_link_click`

Typed questions, visible answer text, names, phone numbers, email addresses, and other visitor-entered content are never included. The typed question is cleared after matching and is not persisted. Do not add raw input to tracking payloads.

The no-match WhatsApp link contains only the generic localized message stored in `ui.whatsappMessage`; it deliberately does not copy the visitor’s typed question.
