# Blog And Search

**Summary**: Current blog data model, article inventory, search index generation, and search page behavior.

**Sources**: blog.html, fr/blog.html, blog-post.html, fr/blog-post.html, assets/js/blog.js, assets/js/site-content-en.js, assets/js/site-content-fr.js, assets/js/search.js, scripts/generate-search-index.js, assets/js/search-index-en.js, assets/js/search-index-fr.js.

**Last updated**: 2026-06-10.

---

The blog listing and article pages are driven by `assets/js/blog.js` and language-specific content objects in `assets/js/site-content-en.js` and `assets/js/site-content-fr.js` (source: blog.html; source: blog-post.html; source: assets/js/blog.js; source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js).

## Current Blog Posts

Current English blog posts include: "Dauin Macro Notes: 7 Small Critters Guests Keep Asking About" dated 2026-03-12, "Planning a Smooth Apo Island Day Trip from Dauin" dated 2026-03-02, "Which La Tortue Room Fits Your Dive Schedule?" dated 2026-02-20, "After-Dive Beachfront Dining: The Pace We Like Best" dated 2026-02-08, "Turning Passion into a Global Career: My Instructor Training Experience with La Tortue" dated 2026-04-01, "The Dauin vs. Apo Island Debate: What You Need to Know" dated 2026-04-13, and "Getting from Dumaguete to Dauin Without Losing a Dive Day" dated 2026-01-10 (source: assets/js/site-content-en.js).

The French content file contains French equivalents for these post slugs and topics (source: assets/js/site-content-fr.js). Blog tags cover Dauin, macro, Apo Island, boat-day planning, rooms, resort, restaurant, beachfront, SSI, instructor training, muck diving, travel, Dumaguete, and arrival (source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js).

## Blog UI Behavior

The blog listing supports tag filtering through query parameters, infinite loading batches, featured labels, tag chips, and listing cards with images (source: assets/js/blog.js). The article renderer reads the slug from `blog-post.html?slug=...` or `/fr/blog-post.html?slug=...` and renders the matching post from the language content object (source: blog-post.html; source: fr/blog-post.html; source: assets/js/blog.js).

## Search Indexes

Search is generated from `site-content-en.js` and `site-content-fr.js` into `assets/js/search-index-en.js` and `assets/js/search-index-fr.js` (source: scripts/generate-search-index.js). The generator builds page, block, and blog entries, and specifically block-indexes diving courses, diving sites, and Apo trip highlights (source: scripts/generate-search-index.js).

The search UI reads query parameters, renders suggestions, labels result types, builds snippets, and provides direct jump links to results (source: assets/js/search.js). The English and French search pages load their corresponding content and index files (source: search.html; source: fr/search.html).

## Maintenance Note

When content changes affect pages, blog posts, course cards, dive-site feature cards, or page summaries, regenerate search indexes with `node scripts/generate-search-index.js` (source: scripts/generate-search-index.js; source: AGENTS.md).

## Related Pages

- [[seo-and-localization]]
- [[technical-implementation]]
- [[diving-courses]]
- [[dive-sites]]

