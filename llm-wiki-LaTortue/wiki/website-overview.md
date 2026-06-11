# Website Overview

**Summary**: Current high-level map of the La Tortue Diving Center website, its offer, and its bilingual structure.

**Sources**: index.html, fr/index.html, about.html, fr/about.html, diving.html, fr/diving.html, cottages.html, dining.html, contact.html, sitemap.xml.

**Last updated**: 2026-06-10.

---

La Tortue is presented as a Dauin dive resort with SSI and FFESSM courses, Apo Island trips, beachfront cottages, and beach dining in Negros Oriental (source: index.html; source: fr/index.html). The homepage headline positions the diving around "World-class Dauin muck & Apo Island" in English and "Muck de Dauin & Apo Island de classe mondiale" in French (source: index.html; source: fr/index.html).

The core user journeys are diving, rooms, restaurant, about/team, blog, and contact/booking (source: menu.html; source: fr/menu.html). The site is bilingual, with English root pages and French `/fr/` equivalents for the main public pages (source: sitemap.xml; source: index.html; source: fr/index.html).

The homepage packages four first-screen/near-first-screen offers: Dauin/Apo diving and courses, bamboo rooms by the beach, access from airport or seaport, and beach dining with fresh shakes (source: index.html; source: fr/index.html). It also surfaces reviews, room summaries, restaurant/day-pass information, and latest blog posts (source: index.html; source: fr/index.html).

The diving offer is broad: beginner discovery, SSI recreational courses, SSI pro training, FFESSM courses, guided fun dives, night dives, Apo Island boat days, and coastal dive-site information (source: diving.html; source: diving-fun-dives.html; source: diving-apo-trips.html; source: diving-sites.html).

The accommodation offer is beachfront/bamboo-focused, with Seaview Cottage, Garden Cottage, Family Seaview Cottage, Shared Dormitory, and Deluxe Room options (source: cottages.html; source: fr/cottages.html). The dining offer is a beach restaurant with breakfast classics, Filipino favorites, pasta, burgers, fruit shakes, cocktails, a PHP 200 day pass, and a 2026 menu surface (source: dining.html; source: fr/dining.html).

## Current Site Shape

- Public pages are static HTML files at repository root and under `/fr/` (source: sitemap.xml).
- Shared navigation and footer are loaded from `menu.html`/`footer.html` or `fr/menu.html`/`fr/footer.html` based on page language (source: assets/site.js; source: menu.html; source: fr/menu.html).
- Blog pages are rendered from JavaScript content objects rather than one HTML file per article (source: blog.html; source: blog-post.html; source: assets/js/site-content-en.js; source: assets/js/site-content-fr.js).
- Search uses generated English and French search indexes from the site-content files and selected HTML pages (source: search.html; source: fr/search.html; source: scripts/generate-search-index.js).

## Related Pages

- [[page-inventory]]
- [[seo-and-localization]]
- [[diving-courses]]
- [[rooms-and-dining]]
- [[technical-implementation]]

