const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

const configs = [
  {
    siteContentPath: path.join(root, 'assets', 'js', 'site-content-en.js'),
    outputPath: path.join(root, 'assets', 'js', 'search-index-en.js')
  },
  {
    siteContentPath: path.join(root, 'assets', 'js', 'site-content-fr.js'),
    outputPath: path.join(root, 'assets', 'js', 'search-index-fr.js')
  }
];

const blockIndexedPageUrls = new Set([
  '/diving.html',
  '/fr/diving.html',
  '/diving-sites.html',
  '/fr/diving-sites.html',
  '/diving-apo-trips.html',
  '/fr/diving-apo-trips.html'
]);

function loadSiteContent(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: filePath });

  if (!sandbox.window.ltSiteContent) {
    throw new Error(`Unable to read site content from ${filePath}`);
  }

  return sandbox.window.ltSiteContent;
}

function urlToFilePath(url) {
  const cleanUrl = String(url || '').replace(/^https?:\/\/[^/]+/i, '');
  const relativeUrl = cleanUrl.replace(/^\//, '');

  if (!relativeUrl) {
    return path.join(root, 'index.html');
  }

  if (cleanUrl.endsWith('/')) {
    return path.join(root, relativeUrl, 'index.html');
  }

  return path.join(root, relativeUrl);
}

function cleanUrlPath(url) {
  const cleanUrl = String(url || '').replace(/^https?:\/\/[^/]+/i, '');
  return cleanUrl || '/';
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

function stripHtml(html) {
  return extractBody(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<img\b[^>]*\balt=(['"])(.*?)\1[^>]*>/gi, ' $2 ')
    .replace(/<(input|textarea)\b[^>]*\bplaceholder=(['"])(.*?)\2[^>]*>/gi, ' $3 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return Array.from(new Set((values || []).filter(Boolean)));
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractAttribute(html, attribute) {
  const regex = new RegExp(`${attribute}=(['"])(.*?)\\1`, 'i');
  const match = html.match(regex);
  return match ? match[2] : '';
}

function firstParagraph(html) {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return stripHtml(match ? match[1] : html);
}

function courseTagsForId(page, id) {
  const courseLabel = (page.tags || [])[0] || 'Courses';
  const ssiLabel = (page.tags || []).find((tag) => /ssi/i.test(tag)) || 'SSI';
  const ffessmLabel = (page.tags || []).find((tag) => /ffessm/i.test(tag)) || 'FFESSM';
  const proLabel = 'SSI Pro';

  if (id.includes('ffessm')) {
    return unique([courseLabel, ffessmLabel]);
  }

  if (id.includes('divemaster') || id.includes('instructor') || id.includes('itc')) {
    return unique([courseLabel, proLabel]);
  }

  return unique([courseLabel, ssiLabel]);
}

function buildBlockEntry(page, data) {
  const contentText = [data.title, data.meta, data.excerpt, data.body, data.imageAlt].filter(Boolean).join(' ');

  return {
    type: 'block',
    anchorId: data.id,
    parentUrl: page.url,
    url: `${page.url}#${data.id}`,
    title: data.title,
    excerpt: data.excerpt || page.excerpt,
    tags: unique(data.tags),
    image: data.image || page.image,
    imageAlt: data.imageAlt || page.imageAlt,
    contentText,
    searchText: [contentText, data.searchText || ''].filter(Boolean).join(' ')
  };
}

function extractFeatureBlocks(page, html) {
  const regex = /<div class="feature-card" id="([^"]+)">[\s\S]*?<div class="media">([\s\S]*?)<\/div>\s*<div class="feature-content">[\s\S]*?<span class="badge">([\s\S]*?)<\/span>\s*<h3>([\s\S]*?)<\/h3>\s*<p class="feature-meta">([\s\S]*?)<\/p>\s*<p class="muted">([\s\S]*?)<\/p>\s*<ul class="feature-list">([\s\S]*?)<\/ul>\s*<\/div>\s*<\/div>/gi;
  const blocks = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [, id, mediaHtml, badgeHtml, titleHtml, metaHtml, excerptHtml, listHtml] = match;
    blocks.push(buildBlockEntry(page, {
      id,
      title: stripHtml(titleHtml),
      meta: stripHtml(metaHtml),
      excerpt: stripHtml(excerptHtml),
      body: stripHtml(listHtml),
      image: extractAttribute(mediaHtml, 'src'),
      imageAlt: extractAttribute(mediaHtml, 'alt'),
      tags: unique([stripHtml(badgeHtml)]),
      searchText: [stripHtml(badgeHtml), stripHtml(metaHtml), stripHtml(listHtml)].join(' ')
    }));
  }

  return blocks;
}

function extractCourseBlocks(page, html) {
  const regex = /<div class="card" id="([^"]+)">[\s\S]*?<img\b([^>]*?)>\s*<strong>([\s\S]*?)<\/strong>\s*<div class="muted">([\s\S]*?)<\/div>\s*<div class="course-details">([\s\S]*?)<\/div>\s*<button class="btn btn-outline course-toggle"/gi;
  const blocks = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [, id, imgAttrs, titleHtml, metaHtml, detailsHtml] = match;
    blocks.push(buildBlockEntry(page, {
      id,
      title: stripHtml(titleHtml),
      meta: stripHtml(metaHtml),
      excerpt: firstParagraph(detailsHtml),
      body: stripHtml(detailsHtml),
      image: extractAttribute(imgAttrs, 'src'),
      imageAlt: extractAttribute(imgAttrs, 'alt'),
      tags: courseTagsForId(page, id),
      searchText: stripHtml(detailsHtml)
    }));
  }

  return blocks;
}

function extractItcCallout(page, html) {
  const regex = /<div class="itc-callout" id="([^"]+)"[^>]*>\s*<div class="itc-media">\s*<img\b([^>]*?)>\s*<\/div>\s*<div class="itc-content">\s*<h4>([\s\S]*?)<\/h4>\s*<p>([\s\S]*?)<\/p>/i;
  const match = html.match(regex);
  if (!match) return [];

  const [, id, imgAttrs, titleHtml, bodyHtml] = match;
  return [buildBlockEntry(page, {
    id,
    title: stripHtml(titleHtml),
    excerpt: stripHtml(bodyHtml),
    body: stripHtml(bodyHtml),
    image: extractAttribute(imgAttrs, 'src'),
    imageAlt: extractAttribute(imgAttrs, 'alt'),
    tags: courseTagsForId(page, id),
    searchText: stripHtml(bodyHtml)
  })];
}

function extractHeadingBlock(page, html, config) {
  const pattern = new RegExp(
    `<h[1-6][^>]*id="${escapeRegExp(config.id)}"[^>]*>([\\s\\S]*?)<\\/h[1-6]>(?:\\s*<p[^>]*>([\\s\\S]*?)<\\/p>)?`,
    'i'
  );
  const match = html.match(pattern);
  if (!match) return [];

  const [, titleHtml, excerptHtml = ''] = match;
  return [buildBlockEntry(page, {
    id: config.id,
    title: stripHtml(titleHtml),
    excerpt: stripHtml(excerptHtml) || config.excerpt || page.excerpt,
    body: stripHtml(excerptHtml),
    image: config.image || page.image,
    imageAlt: config.imageAlt || page.imageAlt,
    tags: unique(config.tags || []),
    searchText: [config.searchText || '', stripHtml(excerptHtml)].filter(Boolean).join(' ')
  })];
}

function extractHeadingBlocks(page, html) {
  const pageUrl = cleanUrlPath(page.url);
  const configsByPage = {
    '/diving.html': [
      { id: 'ssi-courses', tags: ['Courses', 'SSI'] },
      { id: 'ssi-pro-training', tags: ['Courses', 'SSI Pro'], searchText: 'professional training divemaster instructor' },
      { id: 'ffessm-courses', tags: ['Courses', 'FFESSM'] }
    ],
    '/fr/diving.html': [
      { id: 'ssi-courses', tags: ['Cours', 'SSI'] },
      { id: 'ssi-pro-training', tags: ['Cours', 'SSI Pro'], searchText: 'formation professionnelle divemaster instructeur' },
      { id: 'ffessm-courses', tags: ['Cours', 'FFESSM'] }
    ],
    '/diving-apo-trips.html': [
      { id: 'apo-highlights', tags: ['Apo Island', 'Highlights'], searchText: 'apo island highlights reef sites' }
    ],
    '/fr/diving-apo-trips.html': [
      { id: 'apo-highlights', tags: ['Apo Island', 'Incontournables'], searchText: 'apo island incontournables sites recif' }
    ]
  };

  return (configsByPage[pageUrl] || []).flatMap((config) => extractHeadingBlock(page, html, config));
}

function extractBlockEntries(page, html) {
  const pageUrl = cleanUrlPath(page.url);

  if (pageUrl === '/diving-sites.html' || pageUrl === '/fr/diving-sites.html') {
    return extractFeatureBlocks(page, html);
  }

  if (pageUrl === '/diving-apo-trips.html' || pageUrl === '/fr/diving-apo-trips.html') {
    return extractHeadingBlocks(page, html).concat(extractFeatureBlocks(page, html));
  }

  if (pageUrl === '/diving.html' || pageUrl === '/fr/diving.html') {
    return extractHeadingBlocks(page, html)
      .concat(extractCourseBlocks(page, html))
      .concat(extractItcCallout(page, html));
  }

  return [];
}

function buildPageEntry(page) {
  const filePath = urlToFilePath(page.url);
  const html = fs.readFileSync(filePath, 'utf8');
  const pageText = stripHtml(html);
  const pageUrl = cleanUrlPath(page.url);
  const contentText = blockIndexedPageUrls.has(pageUrl)
    ? [page.title, page.excerpt, ...(page.tags || [])].filter(Boolean).join(' ')
    : pageText;
  const searchText = blockIndexedPageUrls.has(pageUrl)
    ? [page.title, page.excerpt, ...(page.tags || []), page.searchText || ''].filter(Boolean).join(' ')
    : [pageText, page.searchText || ''].filter(Boolean).join(' ');

  return {
    type: 'page',
    url: page.url,
    title: page.title,
    excerpt: page.excerpt,
    tags: page.tags || [],
    image: page.image,
    imageAlt: page.imageAlt,
    contentText,
    searchText
  };
}

function buildPostEntry(post) {
  const sectionText = (post.sections || [])
    .map((section) => [section.heading, ...(section.paragraphs || [])].filter(Boolean).join(' '))
    .join(' ');
  const contentText = [
    post.title,
    post.excerpt,
    post.author,
    post.dateLabel,
    (post.tags || []).join(' '),
    post.intro,
    sectionText,
    post.figureCaption
  ].filter(Boolean).join(' ');

  return {
    type: 'blog',
    url: post.url,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags || [],
    image: post.image,
    imageAlt: post.imageAlt,
    dateISO: post.dateISO,
    contentText: contentText,
    searchText: [contentText, post.searchText || ''].filter(Boolean).join(' ')
  };
}

function writeIndex(outputPath, siteContent) {
  const pageEntries = (siteContent.pages || []).map((page) => {
    const filePath = urlToFilePath(page.url);
    const html = fs.readFileSync(filePath, 'utf8');

    return {
      page: buildPageEntry(page),
      blocks: extractBlockEntries(page, html)
    };
  });

  const payload = {
    pages: pageEntries.map((entry) => entry.page),
    blocks: pageEntries.flatMap((entry) => entry.blocks),
    posts: (siteContent.posts || []).map(buildPostEntry)
  };

  const output = [
    '(function () {',
    `  window.ltSearchIndex = ${JSON.stringify(payload, null, 2)};`,
    '})();',
    ''
  ].join('\n');

  fs.writeFileSync(outputPath, output, 'utf8');
}

function generateSearchIndex() {
  configs.forEach((config) => {
    const siteContent = loadSiteContent(config.siteContentPath);
    writeIndex(config.outputPath, siteContent);
  });
}

if (require.main === module) {
  try {
    generateSearchIndex();
    console.log('Search indexes generated.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = {
  generateSearchIndex
};
