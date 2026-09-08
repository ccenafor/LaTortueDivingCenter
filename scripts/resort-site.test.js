const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {isResortProduction} = require('./resort-3d-context');
const {locales} = require('./build-resort-pages');
const dist = path.join(__dirname, '..', 'dist');
const read = file => fs.readFileSync(path.join(dist, file), 'utf8');
const production = isResortProduction();
for (const [locale, c] of Object.entries(locales)) {
  const prefix = locale === 'fr' ? 'fr/' : '';
  const html = read(prefix + 'resort-3d/index.html');
  assert.ok(html.includes(`<html lang="${locale}">`));
  assert.ok(html.includes(`<title>${c.title}</title>`));
  assert.ok(html.includes('<base href="/resort-3d/">'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="https://latortuediving.com${c.url}"`));
  for (const language of ['fr', 'en', 'x-default']) assert.ok(html.includes(`hreflang="${language}"`));
  assert.ok(html.includes(production ? 'index, follow, max-image-preview:large' : 'noindex, nofollow, noarchive'));
  assert.equal(html.includes('noindex'), !production);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema.inLanguage, locale);
  assert.equal(schema.url, 'https://latortuediving.com' + c.url);
  assert.ok(html.includes(c.pageHeading));
  const home = read(prefix + 'index.html');
  assert.ok(home.includes(c.cta));
  assert.ok(home.includes('loading="lazy" decoding="async"'));
  assert.ok(home.indexOf('resort-promo sand') > home.indexOf('</section>'));
  assert.ok(!/resort\.glb|viewer\.js|three\.module/.test(home), 'Home must not load the 3D engine or model');
  assert.ok(read(prefix + 'footer.html').includes(`href="${c.url}"`));
  assert.ok(read(prefix + 'cottages.html').includes(`href="${c.url}?stop=rooms"`));
  assert.ok(read(prefix + 'diving.html').includes(`href="${c.url}?stop=reef"`));
  assert.ok(!read(prefix + 'menu.html').includes('resort-3d'), 'No extra top-menu entry');
  assert.equal(read('sitemap.xml').includes('https://latortuediving.com' + c.url), production);
}
assert.equal(read('robots.txt').includes('Disallow: /'), !production);
const headers = fs.existsSync(path.join(dist, '_headers')) ? read('_headers') : '';
assert.equal(/X-Robots-Tag: noindex/i.test(headers), !production);
for (const file of ['preview.webp', 'preview-600.webp']) {
  assert.ok(fs.statSync(path.join(dist, 'resort-3d/assets', file)).size < 180000, 'Preview must stay lightweight');
}
assert.ok(!fs.existsSync(path.join(dist, 'resort-3d/preview-capture.html')));
console.log(`PASS: FR/EN links, lightweight home preview, metadata, sitemap and ${production ? 'production indexing (local simulation)' : 'preprod noindex'} protections.`);
