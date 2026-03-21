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

function buildPageEntry(page) {
  const filePath = urlToFilePath(page.url);
  const html = fs.readFileSync(filePath, 'utf8');
  const pageText = stripHtml(html);

  return {
    type: 'page',
    url: page.url,
    title: page.title,
    excerpt: page.excerpt,
    tags: page.tags || [],
    image: page.image,
    imageAlt: page.imageAlt,
    searchText: [pageText, page.searchText || ''].filter(Boolean).join(' ')
  };
}

function buildPostEntry(post) {
  const sectionText = (post.sections || [])
    .map((section) => [section.heading, ...(section.paragraphs || [])].filter(Boolean).join(' '))
    .join(' ');

  return {
    type: 'blog',
    url: post.url,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags || [],
    image: post.image,
    imageAlt: post.imageAlt,
    dateISO: post.dateISO,
    searchText: [
      post.title,
      post.excerpt,
      post.author,
      post.dateLabel,
      (post.tags || []).join(' '),
      post.intro,
      sectionText,
      post.figureCaption,
      post.searchText || ''
    ].filter(Boolean).join(' ')
  };
}

function writeIndex(outputPath, siteContent) {
  const payload = {
    pages: (siteContent.pages || []).map(buildPageEntry),
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
