const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { decodeHtml } = require('./generate-blog-pages');

const root = path.resolve(__dirname, '..');
const origin = 'https://latortuediving.com';
const sourcePaths = [
  path.join(root, 'assets', 'js', 'site-content-en.js'),
  path.join(root, 'assets', 'js', 'site-content-fr.js')
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadContent(filePath) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox, { filename: filePath });
  return sandbox.window.ltSiteContent;
}

function extract(html, pattern, label, filePath) {
  const match = html.match(pattern);
  assert(match, `${label} missing from ${path.relative(root, filePath)}`);
  return match[1];
}

function visibleWordCount(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function verifyPage(post) {
  const filePath = path.join(root, `${post.url.replace(/^\//, '')}.html`);
  assert(fs.existsSync(filePath), `Generated page missing for ${post.url}`);

  const html = fs.readFileSync(filePath, 'utf8');
  const canonical = `${origin}${post.url}`;
  const title = decodeHtml(extract(html, /<title>([\s\S]*?)<\/title>/i, 'Title', filePath));
  const description = decodeHtml(extract(
    html,
    /<meta\s+name="description"\s+content="([^"]*)">/i,
    'Meta description',
    filePath
  ));

  assert(title.length >= 40 && title.length <= 60, `Title length ${title.length} outside 40-60 for ${post.url}`);
  assert(description.length >= 120 && description.length <= 160, `Description length ${description.length} outside 120-160 for ${post.url}`);
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), `Canonical mismatch for ${post.url}`);
  assert(html.includes(`hreflang="${post.url.startsWith('/fr/') ? 'fr' : 'en'}" href="${canonical}"`), `Self hreflang missing for ${post.url}`);
  assert(html.includes(`href="${origin}${post.alternateUrl}"`), `Alternate hreflang missing for ${post.url}`);
  assert((html.match(/<h1\b/gi) || []).length === 1, `Expected one H1 for ${post.url}`);
  assert(html.includes('<article class="article-content">'), `Static article markup missing for ${post.url}`);
  assert(!html.includes('blog-post.html?slug='), `Legacy query URL leaked into ${post.url}`);

  const articleHtml = extract(
    html,
    /<article class="article-content">([\s\S]*?)<\/article>/i,
    'Article body',
    filePath
  );
  assert(visibleWordCount(articleHtml) >= 350, `Article content is unexpectedly thin for ${post.url}`);
  assert((articleHtml.match(/<a\s+[^>]*href="\/(?:fr\/)?diving/gi) || []).length >= 1, `Contextual diving link missing for ${post.url}`);

  const images = html.match(/<img\b[^>]*>/gi) || [];
  assert(images.length > 0, `No images found for ${post.url}`);
  images.forEach((image) => assert(/\salt="[^"]*"/i.test(image), `Image alt attribute missing for ${post.url}`));

  const jsonLd = JSON.parse(extract(
    html,
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i,
    'JSON-LD',
    filePath
  ));
  const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  const articleSchema = blocks.find((block) => block['@type'] === 'BlogPosting');
  assert(articleSchema, `BlogPosting schema missing for ${post.url}`);
  assert(articleSchema.headline && articleSchema.datePublished && articleSchema.author && articleSchema.image, `BlogPosting required fields missing for ${post.url}`);
  assert(articleSchema.mainEntityOfPage['@id'] === canonical, `BlogPosting mainEntityOfPage mismatch for ${post.url}`);

  return { filePath, canonical };
}

function main() {
  const contents = sourcePaths.map(loadContent);
  const posts = contents.flatMap((content) => content.posts || []);
  assert(posts.length > 0, 'No published blog posts found');
  assert(new Set(posts.map((post) => post.url)).size === posts.length, 'Duplicate published blog URL found');

  const verifiedPages = posts.map(verifyPage);
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  verifiedPages.forEach(({ canonical }) => assert(sitemap.includes(`<loc>${canonical}</loc>`), `Sitemap entry missing for ${canonical}`));
  const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  assert(
    sitemapUrls.every((url) => !/contact-success|blog-post|\.html|\?/.test(url)),
    'Sitemap contains a non-canonical or non-indexable URL'
  );

  const searchIndexes = [
    fs.readFileSync(path.join(root, 'assets', 'js', 'search-index-en.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'assets', 'js', 'search-index-fr.js'), 'utf8')
  ].join('\n');
  posts.forEach((post) => assert(searchIndexes.includes(`"url": "${post.url}"`), `Search index missing ${post.url}`));
  assert(!searchIndexes.includes('blog-post.html?slug='), 'Legacy query URL remains in a generated search index');

  const redirects = fs.readFileSync(path.join(root, '_redirects'), 'utf8');
  posts.forEach((post) => assert(redirects.includes(post.url), `Redirect coverage missing for ${post.url}`));

  const encodingFiles = [
    ...sourcePaths,
    path.join(root, 'sitemap.xml'),
    ...verifiedPages.map(({ filePath }) => filePath)
  ];
  encodingFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    assert(!/[ÃÂâ�]/.test(content), `Possible mojibake in ${path.relative(root, filePath)}`);
  });

  console.log(`Blog SEO verification passed for ${posts.length} generated pages.`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
