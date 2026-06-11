# SEO And Localization

**Summary**: Current SEO, structured data, sitemap, robots, hreflang, and bilingual-update expectations.

**Sources**: index.html, fr/index.html, about.html, fr/about.html, diving.html, fr/diving.html, sitemap.xml, robots.txt, scripts/netlify-noindex-guard.js, scripts/generate-search-index.js, AGENTS.md.

**Last updated**: 2026-06-10.

---

The current English homepage meta description says La Tortue is a Dauin dive resort offering SSI and FFESSM courses, Apo Island trips, beachfront cottages, and beach dining in Negros Oriental (source: index.html). The French homepage meta description mirrors this offer with "cours SSI et FFESSM" (source: fr/index.html).

Most page templates include unique titles, meta descriptions, canonical links, Open Graph metadata, Twitter metadata, JSON-LD `LocalBusiness`, and JSON-LD breadcrumbs (source: index.html; source: about.html; source: diving.html; source: fr/index.html; source: fr/about.html; source: fr/diving.html).

The shared `LocalBusiness` structured-data description now includes SSI and FFESSM in English and French across core pages (source: index.html; source: about.html; source: diving.html; source: fr/index.html; source: fr/about.html; source: fr/diving.html).

Language alternates are declared with `hreflang="en"`, `hreflang="fr"`, and `hreflang="x-default"` on core pages (source: index.html; source: fr/index.html; source: contact.html; source: fr/contact.html). The runtime language switch preserves query strings and hashes while switching between `/fr/` and English paths (source: assets/site.js).

`sitemap.xml` lists the clean English and French public URLs for homepage, about, blog, contact, contact-success, cottages, dining, diving, Apo trips, fun dives, and dive sites (source: sitemap.xml). `robots.txt` allows crawling and points to the sitemap (source: robots.txt).

Preprod indexing protection is handled at Netlify build time: non-production contexts, `preprod`, and deploy URLs containing `preprod.latortuediving.com` receive disallow/noindex behavior (source: scripts/netlify-noindex-guard.js; source: NETLIFY.md).

## Localization Rule

When English content, metadata, labels, generated search copy, or page behavior changes, check and update the corresponding French page or content source in the same change unless the user explicitly scopes the work to English only (source: user instruction, 2026-06-10; source: AGENTS.md).

Generated search indexes must be regenerated after relevant content updates with `node scripts/generate-search-index.js` (source: AGENTS.md; source: scripts/generate-search-index.js).

## Current Localization Surfaces

- HTML page pairs at root and `/fr/` (source: sitemap.xml).
- Shared navigation/footer pairs in `menu.html`/`fr/menu.html` and `footer.html`/`fr/footer.html` (source: menu.html; source: fr/menu.html; source: footer.html; source: fr/footer.html).
- Blog/search content in `assets/js/site-content-en.js` and `assets/js/site-content-fr.js` (source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js).
- Generated indexes in `assets/js/search-index-en.js` and `assets/js/search-index-fr.js` (source: scripts/generate-search-index.js).
- Runtime UI labels for cookie consent, course toggles, mobile dive bar, and search/contact behavior in JavaScript (source: assets/site.js; source: assets/js/search.js; source: assets/js/contact.js).

## Related Pages

- [[maintenance-rules]]
- [[page-inventory]]
- [[blog-and-search]]
- [[technical-implementation]]

