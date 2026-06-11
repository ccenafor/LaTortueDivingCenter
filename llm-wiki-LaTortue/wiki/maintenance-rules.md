# Maintenance Rules

**Summary**: Current operational rules for updating the La Tortue website and this wiki.

**Sources**: AGENTS.md, README.md, llm-wiki-LaTortue/AGENT.md, scripts/generate-search-index.js, scripts/netlify-noindex-guard.js, user instruction 2026-06-10.

**Last updated**: 2026-06-10.

---

Work on `preprod` unless the user explicitly asks for another branch (source: AGENTS.md). Do not create or push commits unless explicitly requested by the project owner (source: AGENTS.md; source: README.md). Do not delete local or remote branches unless explicitly requested by the project owner (source: AGENTS.md; source: README.md).

Do not include `TEMP/` in commits or pushes (source: AGENTS.md). The preferred release flow is feature work from `preprod`, merge tested work into `preprod`, then promote `preprod` to `main` only after validation (source: AGENTS.md; source: README.md).

## Bilingual Update Rule

If an English page, SEO tag, structured-data value, label, generated search summary, or user-visible copy changes, check and update the French equivalent in the same task unless the user explicitly says the change is English-only (source: user instruction, 2026-06-10; source: AGENTS.md). This applies to root HTML pages, `/fr/` HTML pages, shared menu/footer partials, `assets/js/site-content-en.js`, `assets/js/site-content-fr.js`, generated search indexes, and JavaScript-localized labels (source: sitemap.xml; source: menu.html; source: fr/menu.html; source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js; source: scripts/generate-search-index.js; source: assets/site.js).

## Content And SEO

Maintain unique titles and meta descriptions, one H1 per page, descriptive alt text, clean URLs, structured data, sitemap updates when relevant, and mobile-friendly layouts (source: AGENTS.md; source: README.md). Regenerate `assets/js/search-index-en.js` and `assets/js/search-index-fr.js` after relevant content changes with `node scripts/generate-search-index.js` (source: AGENTS.md; source: scripts/generate-search-index.js).

## Encoding Safety

Treat source files as UTF-8 and avoid bulk encoding conversions unless affected files are verified individually (source: AGENTS.md). After editing French content, scan for the mojibake markers listed in `AGENTS.md` without adding those marker characters to normal source or wiki text (source: AGENTS.md).

## Images And Performance

Optimize images before integration, prefer WebP for photos and SVG for icons where appropriate, lazy-load below-the-fold images, and use responsive `srcset` when relevant (source: AGENTS.md; source: README.md).

## Wiki Maintenance

For the wiki, do not modify anything in `llm-wiki-LaTortue/raw/` (source: llm-wiki-LaTortue/AGENT.md). Wiki pages live under `llm-wiki-LaTortue/wiki/`, page names should be lowercase with hyphens, and `wiki/index.md` plus `wiki/log.md` must be updated after wiki changes (source: llm-wiki-LaTortue/AGENT.md).

## Related Pages

- [[seo-and-localization]]
- [[technical-implementation]]
- [[blog-and-search]]
- [[website-overview]]
