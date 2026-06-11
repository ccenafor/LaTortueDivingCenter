# Page Inventory

**Summary**: Current public page list, language pairs, and page purposes for the website.

**Sources**: sitemap.xml, index.html, fr/index.html, menu.html, fr/menu.html, search.html, fr/search.html, blog.html, fr/blog.html, blog-post.html, fr/blog-post.html.

**Last updated**: 2026-06-10.

---

The sitemap lists 22 clean public URLs: 11 English URLs and 11 French URLs (source: sitemap.xml). English pages live at root clean URLs such as `/diving`, while French pages live under `/fr/` such as `/fr/diving` (source: sitemap.xml).

## English Pages

- `/` - Homepage for diving, rooms, dining, reviews, and blog highlights (source: index.html; source: sitemap.xml).
- `/about` - Resort story, team, current dive pros Glenn and Charlie, guest review quotes, and resident pets (source: about.html; source: sitemap.xml).
- `/blog` - Blog listing driven by JavaScript content data (source: blog.html; source: assets/js/site-content-en.js).
- `/contact` - Booking.com room widget, Netlify contact form, WhatsApp, email, Instagram, and contact map/transport image (source: contact.html).
- `/contact-success` - Post-submit confirmation page with WhatsApp and email fallback (source: contact-success.html).
- `/cottages` - Room and cottage listing with filters, room galleries, prices, details, policies, and reviews (source: cottages.html).
- `/dining` - Restaurant positioning, PHP 200 day pass, food gallery, and 2026 menu images/lightbox (source: dining.html).
- `/diving` - SSI and FFESSM courses, SSI pro training, and course reviews (source: diving.html).
- `/diving-apo-trips` - Apo Island day trip explanation, inclusions, highlight sites, and reviews (source: diving-apo-trips.html).
- `/diving-fun-dives` - Certified diver price list, guided dive notes, gallery, and reviews (source: diving-fun-dives.html).
- `/diving-sites` - Dauin/Apo dive-site overview with sanctuary, reef, muck, and macro site cards (source: diving-sites.html).

## French Pages

- `/fr/` - French homepage mirroring the main offer and recent FFESSM/SSI positioning (source: fr/index.html; source: sitemap.xml).
- `/fr/about` - French about/team page with Glenn, Charlie, reviews, and resident pets (source: fr/about.html).
- `/fr/blog` - French blog listing from `site-content-fr.js` (source: fr/blog.html; source: assets/js/site-content-fr.js).
- `/fr/contact` - French Booking.com/contact form page (source: fr/contact.html).
- `/fr/contact-success` - French confirmation page (source: fr/contact-success.html).
- `/fr/cottages` - French room and cottage listing (source: fr/cottages.html).
- `/fr/dining` - French restaurant, day-pass, gallery, and menu page (source: fr/dining.html).
- `/fr/diving` - French SSI/FFESSM courses page (source: fr/diving.html).
- `/fr/diving-apo-trips` - French Apo Island day-trip page (source: fr/diving-apo-trips.html).
- `/fr/diving-fun-dives` - French fun-dive price list and gallery (source: fr/diving-fun-dives.html).
- `/fr/diving-sites` - French coastal dive-sites page (source: fr/diving-sites.html).

## Utility Pages And Partials

`search.html` and `fr/search.html` are public search pages, but they are not currently listed in `sitemap.xml` (source: search.html; source: fr/search.html; source: sitemap.xml). `blog-post.html` and `fr/blog-post.html` are dynamic article renderers using query-string slugs and are not listed as individual sitemap URLs (source: blog-post.html; source: fr/blog-post.html; source: sitemap.xml; source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js).

`menu.html`, `fr/menu.html`, `footer.html`, and `fr/footer.html` are shared partials loaded into pages by `assets/site.js` (source: assets/site.js; source: menu.html; source: fr/menu.html; source: footer.html; source: fr/footer.html).

## Related Pages

- [[website-overview]]
- [[seo-and-localization]]
- [[blog-and-search]]
- [[technical-implementation]]

