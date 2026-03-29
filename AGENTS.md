# Repository Notes

## Workflow
- Work on `preprod` unless the user explicitly asks for another branch.
- Do not create or push git commits unless explicitly requested by the project owner.
- Do not delete local or remote branches unless explicitly requested by the project owner.
- Do not include `TEMP/` in commits or pushes.
- When a commit is requested, choose a relevant message without asking.
- Preferred release flow:
  - create feature branches from `preprod`
  - merge tested work into `preprod` first
  - promote `preprod` to `main` only after validation

## Coding Standards
- Keep HTML, CSS, and JavaScript separated.
- Prefer semantic HTML and a correct heading hierarchy.
- Avoid duplication; keep code readable, maintainable, and documented where logic is non-obvious.
- Keep assets and pages in their proper folders; do not leave stray files at repo root.
- Use clear, descriptive names for classes, IDs, and functions.

## Performance And SEO
- Optimize every image before integration.
- Prefer WebP for photos and SVG where appropriate for icons.
- Use lazy loading for below-the-fold images and responsive `srcset` when relevant.
- Keep page weight low: remove unused CSS/JS and defer non-critical JavaScript.
- Maintain SEO basics on every page:
  - unique title and meta description
  - one H1 per page
  - descriptive alt text
  - clean URLs
  - structured data and sitemap updates when relevant
  - mobile-friendly layouts

## Verification
- Before committing, verify mobile responsiveness, console cleanliness, and that the page still loads correctly.
- For content and image work, also verify performance, alt text, headings, and metadata.

## Encoding Safety
- Treat all source files as UTF-8. Do not reopen or resave HTML, CSS, JS, JSON, or generated text files as ANSI, Windows-1252, or Latin-1.
- Do not run bulk encoding conversions unless the affected files are first verified individually.
- If text corruption needs repair, test the fix on a small sample first, then apply it only to confirmed affected files.
- After editing French content, scan for common mojibake markers such as `Ã`, `Â`, `â`, and the replacement character `�`.
- If source text changes affect generated artifacts, regenerate them only after the source files are confirmed clean.

## Search Index
- `assets/js/search-index-en.js` and `assets/js/search-index-fr.js` are generated files.
- Regenerate them with `node scripts/generate-search-index.js` after relevant content changes.
