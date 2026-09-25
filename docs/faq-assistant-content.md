# Guided FAQ assistant content

## Source and editorial status

Snapshot imported on 2026-09-12 from [FAQ Question Answers](https://docs.google.com/spreadsheets/d/1jrasLdj2Zv3f7qAdtyGM0n4YgkTASdZFCsJHoIHZcBA/edit), modified 2026-09-11.
Folder: Latortue Website 2.0 with Micka / Website / 2026-08 Evolutions.

The 15 completed English answers are preserved from the source (paragraph whitespace normalized). French questions and answers are translations prepared for this preview and still need owner review. The source is a work in progress, not a claim of final approval. Draft/source status is kept in data and this document, without adding extra disclaimers to the widget.

The unanswered payment row still uses the existing contact/page guidance; no payment policy has been invented. “How to get to Dauin” now follows the client-supplied `La_Tortue_How_to_Get_Here.pdf`: routes from Manila, Cebu City, South Cebu, Siquijor and Bohol; road times; vehicle types; and one-way transfer prices in Philippine pesos. The internal-links row is an editorial reminder, not a visitor question.

Two client-supplied Apo Island answers were added on 2026-09-25 with `status: "client-draft"`: the required prior coastal dive (₱1,900 including equipment and marine fees) and the ₱2,500 full-day private-guide alternative when that dive is not possible. These additions remain draft content until owner approval.

## Categories

The second source tab already proposes six categories, now assigned through `topicId`:

- Fun Dives: Dauin marine life, prices, daily schedule, equipment, experience, private guides.
- Courses & Try Scuba: certification validity, beginners, children, refresher.
- Apo Island Trips: trip schedule, inclusions, minimum requirements and the private-guide alternative.
- Rooms & Booking: accommodation and separate room/diving booking.
- Getting Here: routes from Manila, Cebu City, South Cebu, Siquijor and Bohol, with the client-supplied vehicle options and one-way transfer prices in Philippine pesos.
- Resort & Restaurant: non-divers/snorkeling and restaurant-page guidance.

Each category opens a list of questions, then a single answer. The English and French footers also include a keyboard-accessible FAQ link that opens the same dialog. WhatsApp remains available as a site-level action and an unmatched-question fallback.

The compact launcher opens an editorial navigation list with one full-width row per category. The presentation order is Fun Dives, Courses & Try Scuba, Apo Island Trips, Rooms & Booking, Resort & Restaurant, then Getting Here. Each row includes a decorative line icon and chevron; Getting Here intentionally remains last in both languages.

## Editable files

- `assets/js/faq-assistant-content.js`: bilingual labels, topics, answers, matching terms, internal links and source provenance.
- `assets/js/faq-assistant.js`: search and rendering.
- `assets/partials/faq-assistant.html`: shared markup.
- `assets/css/faq-assistant.css`: responsive layout.
- `scripts/verify-faq-assistant.js`: source-question, intent, localization and integration regression checks.

## Update or extend answers

1. Edit the content file as UTF-8. Find the same stable entry `id` in both `locales.en.entries` and `locales.fr.entries`.
2. Update `title`, `answer` and `questions` in both languages. Keep prices, inclusions, ages and schedules faithful to the source. Paragraphs and lists use `\n\n` and `\n`.
3. Set `topicId` to one of the six category IDs and add the entry ID to that category’s `entryIds` in both locales.
4. Keep `sourceRow` tied to the source spreadsheet row (header is row 1); use `status: "source-draft"` while still in progress.
5. Keep English-root internal paths such as `/cottages.html`; the widget adds `/fr` automatically.
6. Keep keyword, question and matching-rule lists mirrored across locales so either language can find the answer.
7. Increment `version` and the FAQ cache suffix in `assets/site.js`. Update the source revision/date after re-reading Drive.
8. Run `npm run verify-faq-assistant`, `npm run build` and `npm run verify-blog-seo`. Review both locales on desktop and mobile.

## Matching

Exact editorial questions are checked first. `keywords` provide bounded phrase matching, insensitive to punctuation, case and accents.
For detailed intents, `matchRules` is an OR of rules; each rule is an AND of synonym groups. Example: price terms AND dive terms.
`excludeKeywords` prevents general dive pricing from overriding Apo, snorkeling or refresher requests.
`searchRoutes` handles broad category wording only when no precise answer matched. The broad `diving`/`dive`/`plongée`/`plonger` route offers the Fun Dives and Courses topic choices instead of forcing one answer. Day-visit phrases such as `day use`, `day visit`, `visite à la journée` and `accès journée` route to the restaurant/day-visit entry.
Add natural paraphrases to the verifier whenever adding an intent. Avoid generic interrogatives and standalone arrival verbs.

## Local preview with the updated resort tour

The upstream build includes the resort tour only in an eligible environment. To preview it locally without changing any Git branch, run in PowerShell:

```powershell
$env:BRANCH = 'preprod'
$env:CONTEXT = 'branch-deploy'
$env:NETLIFY = 'true'
npm.cmd run build
node scripts/netlify-noindex-guard.js dist
node scripts/resort-site.test.js
```

These environment variables affect only the build; Git stays on `feature/faq-assistant`. The preview uses upstream noindex protections. Serve `dist/` on loopback, not the repository root.

## Usage data

Existing events contain only stable FAQ IDs and page context. Typed questions are cleared after matching, never persisted and never included in analytics or WhatsApp URLs. Category question selection uses the existing match event. No new external tracking service is added.
