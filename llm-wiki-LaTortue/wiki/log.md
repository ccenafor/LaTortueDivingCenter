# Wiki Log

**Summary**: Append-only record of wiki maintenance operations.

**Sources**: llm-wiki-LaTortue/AGENT.md.

**Last updated**: 2026-06-23.

---

## 2026-06-10 - Initial Website Inventory

Created the first wiki population by inspecting the current tracked website files on `preprod`, including English and French HTML pages, sitemap, robots, Netlify settings, scripts, shared JavaScript, CSS surfaces, generated search indexes, and site-content data (source: index.html; source: fr/index.html; source: sitemap.xml; source: robots.txt; source: netlify.toml; source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js; source: scripts/generate-search-index.js; source: scripts/netlify-noindex-guard.js).

Added wiki pages for overview, page inventory, SEO/localization, diving courses, fun dives/Apo trips, dive sites, rooms/dining, team/contact, blog/search, technical implementation, and maintenance rules (source: llm-wiki-LaTortue/AGENT.md).

Recorded the durable bilingual rule that English website updates must be checked and mirrored in French unless explicitly scoped otherwise (source: user instruction, 2026-06-10; source: AGENTS.md).

## 2026-06-23 - Price Freshness Fix

Refreshed stale room, fun-dive, SSI course, and FFESSM Level 1 prices after the published website rate update (source: cottages.html; source: fr/cottages.html; source: diving-fun-dives.html; source: fr/diving-fun-dives.html; source: diving.html; source: fr/diving.html; source: index.html; source: fr/index.html).

Updated About page search keywords from the previous staff keyword to Charlie in both language content files and regenerated the English and French search indexes (source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js; source: scripts/generate-search-index.js).

Added the Apo Island snorkeler rate to the fun-dives pricing page and documented it in the fun-dives/Apo wiki page: PHP 2,500 including food, marine fees, and snorkel gear, with the snorkeling guide excluded (source: diving-fun-dives.html; source: fr/diving-fun-dives.html; source: llm-wiki-LaTortue/wiki/fun-dives-and-apo.md).

Updated the wiki table of contents timestamp and kept the existing page links unchanged because the affected knowledge pages already existed (source: llm-wiki-LaTortue/AGENT.md; source: llm-wiki-LaTortue/wiki/index.md).
