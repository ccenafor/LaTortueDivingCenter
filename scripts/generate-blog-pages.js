const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const origin = 'https://latortuediving.com';

const configs = [
  {
    lang: 'en',
    sourcePath: path.join(root, 'assets', 'js', 'site-content-en.js'),
    homeUrl: '/',
    blogUrl: '/blog',
    contactUrl: '/contact',
    homeLabel: 'Home',
    breadcrumbLabel: 'Breadcrumb',
    siteName: 'La Tortue Diving Center',
    titleSuffix: 'La Tortue',
    bannerAlt: 'La Tortue Diving Center blog banner'
  },
  {
    lang: 'fr',
    sourcePath: path.join(root, 'assets', 'js', 'site-content-fr.js'),
    homeUrl: '/fr/',
    blogUrl: '/fr/blog',
    contactUrl: '/fr/contact',
    homeLabel: 'Accueil',
    breadcrumbLabel: 'Fil d\'Ariane',
    siteName: 'La Tortue Diving Center',
    titleSuffix: 'La Tortue',
    bannerAlt: 'Banni&egrave;re du blog La Tortue Diving Center'
  }
];

const entityMap = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: '\u00a0',
  quot: '"',
  agrave: '\u00e0',
  ccedil: '\u00e7',
  eacute: '\u00e9',
  ecirc: '\u00ea',
  egrave: '\u00e8',
  icirc: '\u00ee',
  mdash: '\u2014',
  ocirc: '\u00f4',
  oelig: '\u0153',
  rsquo: '\u2019',
  ucirc: '\u00fb',
  ugrave: '\u00f9'
};

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => {
      const decoded = entityMap[name.toLowerCase()];
      if (!decoded) return entity;
      return /^[A-Z]/.test(name) ? decoded.toUpperCase() : decoded;
    });
}

function escapeAttribute(value) {
  return decodeHtml(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeText(value) {
  return decodeHtml(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(value) {
  return new URL(String(value || '/'), origin).href;
}

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

function validatePost(post, config) {
  const expectedPrefix = config.lang === 'fr' ? '/fr/blog/' : '/blog/';
  const validUrl = new RegExp(`^${expectedPrefix.replace(/\//g, '\\/')}[a-z0-9]+(?:-[a-z0-9]+)*$`);

  if (!post.slug || !post.title || !post.excerpt || !post.dateISO || !post.author || !post.image) {
    throw new Error(`Published ${config.lang} post is missing a required field: ${post.slug || '(unknown slug)'}`);
  }

  if (!validUrl.test(post.url || '')) {
    throw new Error(`Published ${config.lang} post must use a clean ${expectedPrefix} URL: ${post.slug}`);
  }

  if (!post.alternateUrl) {
    throw new Error(`Published ${config.lang} post is missing alternateUrl: ${post.slug}`);
  }
}

function outputPathForUrl(url) {
  return path.join(root, `${String(url).replace(/^\//, '')}.html`);
}

function renderImage(config) {
  if (!config || !config.src) return '';

  const attributes = [];
  if (config.className) attributes.push(`class="${escapeAttribute(config.className)}"`);
  if (config.loading) attributes.push(`loading="${escapeAttribute(config.loading)}"`);
  if (config.fetchPriority) attributes.push(`fetchpriority="${escapeAttribute(config.fetchPriority)}"`);
  attributes.push(`decoding="${escapeAttribute(config.decoding || 'async')}"`);
  attributes.push(`src="${escapeAttribute(config.src)}"`);
  attributes.push(`alt="${escapeAttribute(config.alt || '')}"`);
  if (config.srcSet) attributes.push(`srcset="${escapeAttribute(config.srcSet)}"`);
  if (config.sizes) attributes.push(`sizes="${escapeAttribute(config.sizes)}"`);
  if (config.width) attributes.push(`width="${escapeAttribute(config.width)}"`);
  if (config.height) attributes.push(`height="${escapeAttribute(config.height)}"`);

  return `<img ${attributes.join(' ')}>`;
}

function renderFigure(figure) {
  if (!figure || !figure.src) return '';

  return [
    '<figure class="article-figure">',
    renderImage({
      src: figure.src,
      alt: figure.alt,
      srcSet: figure.srcSet,
      sizes: figure.sizes,
      width: figure.width,
      height: figure.height,
      loading: figure.loading || 'lazy'
    }),
    figure.caption ? `<figcaption>${figure.caption}</figcaption>` : '',
    '</figure>'
  ].filter(Boolean).join('\n');
}

function renderFigureGroup(figures) {
  const items = (figures || []).filter((figure) => figure && figure.src);
  if (!items.length) return '';
  return `<div class="article-figure-grid">\n${items.map(renderFigure).join('\n')}\n</div>`;
}

function renderBulletList(section) {
  if (!section || !(section.bulletItems || []).length) return '';

  return [
    '<div class="article-list-block">',
    section.bulletTitle ? `<p class="article-list-block__title">${section.bulletTitle}</p>` : '',
    '<ul class="article-bullet-list">',
    section.bulletItems.map((item) => `<li>${item}</li>`).join('\n'),
    '</ul>',
    '</div>'
  ].filter(Boolean).join('\n');
}

function tagUrl(tag, blogUrl) {
  return `${blogUrl}?tag=${encodeURIComponent(decodeHtml(tag))}`;
}

function renderTagList(tags, blogUrl) {
  return (tags || []).map((tag) => (
    `<li><a class="blog-chip-link" href="${escapeAttribute(tagUrl(tag, blogUrl))}">${tag}</a></li>`
  )).join('\n');
}

function sharedTagScore(source, candidate) {
  return (source.tags || []).reduce((score, tag) => (
    score + ((candidate.tags || []).includes(tag) ? 1 : 0)
  ), 0);
}

function renderRelated(post, posts, labels, blogUrl) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => (
      sharedTagScore(post, b) - sharedTagScore(post, a) || new Date(b.dateISO) - new Date(a.dateISO)
    ))
    .slice(0, 3)
    .map((item) => [
      '<article class="blog-teaser-card blog-teaser-card--compact">',
      `<a class="blog-teaser-card__media" href="${escapeAttribute(item.url)}">`,
      renderImage({ src: item.image, alt: item.imageAlt, loading: 'lazy' }),
      '</a>',
      '<div class="blog-teaser-card__body">',
      `<ul class="blog-chip-list">${renderTagList(item.tags, blogUrl)}</ul>`,
      `<h3><a href="${escapeAttribute(item.url)}">${item.title}</a></h3>`,
      `<a class="text-link" href="${escapeAttribute(item.url)}">${labels.readArticle}</a>`,
      '</div>',
      '</article>'
    ].join('\n'))
    .join('\n');
}

function renderSections(sections) {
  return (sections || []).map((section) => [
    '<section class="article-section">',
    `<h2>${section.heading}</h2>`,
    (section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('\n'),
    renderBulletList(section),
    renderFigure(section.figureImage ? {
      src: section.figureImage,
      alt: section.figureAlt,
      srcSet: section.figureSrcSet,
      sizes: section.figureSizes,
      width: section.figureWidth,
      height: section.figureHeight,
      caption: section.figureCaption
    } : null),
    renderFigureGroup(section.figures),
    '</section>'
  ].filter(Boolean).join('\n')).join('\n');
}

function jsonLdForPost(post, config) {
  const pageDescription = post.seoDescription || post.excerpt;
  const authorType = /team|equipe|\u00e9quipe/i.test(decodeHtml(post.author)) ? 'Organization' : 'Person';
  const payload = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: decodeHtml(post.title),
      description: decodeHtml(pageDescription),
      datePublished: post.dateISO,
      inLanguage: config.lang,
      author: {
        '@type': authorType,
        name: decodeHtml(post.author)
      },
      image: [absoluteUrl(post.image)],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': absoluteUrl(post.url)
      },
      publisher: {
        '@type': 'Organization',
        name: config.siteName,
        url: origin,
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/assets/Pictures/logo/Latorture-colored-v2-400.png`
        }
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: config.homeLabel, item: absoluteUrl(config.homeUrl) },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl(config.blogUrl) },
        { '@type': 'ListItem', position: 3, name: decodeHtml(post.title), item: absoluteUrl(post.url) }
      ]
    }
  ];

  return JSON.stringify(payload).replace(/</g, '\\u003c');
}

function renderPostPage(post, posts, config, labels) {
  const pageTitle = post.seoTitle || `${decodeHtml(post.title)} | ${config.titleSuffix}`;
  const pageDescription = post.seoDescription || post.excerpt;
  const canonicalUrl = absoluteUrl(post.url);
  const alternateUrl = absoluteUrl(post.alternateUrl);
  const englishUrl = config.lang === 'en' ? canonicalUrl : alternateUrl;
  const frenchUrl = config.lang === 'fr' ? canonicalUrl : alternateUrl;
  const relatedHtml = renderRelated(post, posts, labels, config.blogUrl);
  const tagsHtml = renderTagList(post.tags, config.blogUrl);
  const sharedBanner = {
    src: '/assets/Pictures/Blog/Optimized/blog-post-banner.webp',
    alt: config.bannerAlt,
    srcSet: '/assets/Pictures/Blog/Optimized/blog-post-banner-960.webp 960w, /assets/Pictures/Blog/Optimized/blog-post-banner.webp 1905w',
    sizes: '100vw',
    width: 1905,
    height: 434,
    className: 'hero-banner-image',
    loading: 'eager',
    fetchPriority: 'high'
  };

  return `<!doctype html>
<html lang="${config.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeText(pageTitle)}</title>
<meta name="description" content="${escapeAttribute(pageDescription)}">
<link rel="canonical" href="${escapeAttribute(canonicalUrl)}">
<link rel="alternate" hreflang="en" href="${escapeAttribute(englishUrl)}">
<link rel="alternate" hreflang="fr" href="${escapeAttribute(frenchUrl)}">
<link rel="alternate" hreflang="x-default" href="${escapeAttribute(englishUrl)}">
<link rel="icon" href="/assets/Pictures/logo/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Manrope:wght@500;600;700&display=swap">
<link rel="stylesheet" href="/new_styles.css?v=20260721">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeAttribute(pageTitle)}">
<meta property="og:description" content="${escapeAttribute(pageDescription)}">
<meta property="og:url" content="${escapeAttribute(canonicalUrl)}">
<meta property="og:site_name" content="${escapeAttribute(config.siteName)}">
<meta property="og:image" content="${escapeAttribute(absoluteUrl(post.image))}">
<meta property="article:published_time" content="${escapeAttribute(post.dateISO)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttribute(pageTitle)}">
<meta name="twitter:description" content="${escapeAttribute(pageDescription)}">
<meta name="twitter:image" content="${escapeAttribute(absoluteUrl(post.image))}">
<script src="/assets/js/cookie-pending.js"></script>
<script type="application/ld+json">${jsonLdForPost(post, config)}</script>
</head>
<body>
<div id="menu-placeholder"></div>

<main>
  <section class="hero hero-blog-post">
    <div class="banner article-banner">
      ${renderImage(sharedBanner)}
      <div class="hero-banner-overlay"></div>
    </div>
    <div class="inner container">
      <div class="article-hero-copy">
        <p class="article-eyebrow">${labels.articleIntroEyebrow}</p>
        <h1>${post.title}</h1>
        <p class="muted article-hero-excerpt">${post.excerpt}</p>
      </div>
    </div>
  </section>

  <section class="article-breadcrumb-bar blog-post-static-section">
    <div class="container">
      <nav class="breadcrumb-trail" aria-label="${escapeAttribute(config.breadcrumbLabel)}">
        <a href="${escapeAttribute(config.homeUrl)}">${config.homeLabel}</a>
        <span>/</span>
        <a href="${escapeAttribute(config.blogUrl)}">Blog</a>
        <span>/</span>
        <span aria-current="page">${post.title}</span>
      </nav>
    </div>
  </section>

  <section class="sand blog-post-static-section blog-post-body-section">
    <div class="container article-layout">
      <aside class="article-sidebar">
        <div class="article-meta-card">
          <div class="article-meta-row"><span>${labels.articlePublished}</span><strong><time datetime="${escapeAttribute(post.dateISO)}">${post.dateLabel}</time></strong></div>
          <div class="article-meta-row"><span>${labels.articleBy}</span><strong>${post.author}</strong></div>
          <div class="article-meta-row"><span>${labels.articleTags}</span><ul class="blog-chip-list blog-chip-list--stacked">${tagsHtml}</ul></div>
        </div>
      </aside>
      <article class="article-content">
        <p class="article-intro">${post.intro}</p>
        ${renderFigureGroup(post.figures)}
        ${renderFigure(post.figureImage ? {
          src: post.figureImage,
          alt: post.figureAlt,
          srcSet: post.figureSrcSet,
          sizes: post.figureSizes,
          width: post.figureWidth,
          height: post.figureHeight,
          caption: post.figureCaption
        } : null)}
        ${renderSections(post.sections)}
        <div class="article-cta-box">
          <h2>${labels.articleCtaTitle}</h2>
          <p>${labels.articleCtaText}</p>
          <div class="article-cta-actions">
            <a class="btn btn-primary" href="${escapeAttribute(config.contactUrl)}">${labels.articleCtaPrimary}</a>
            <a class="btn btn-outline" href="${escapeAttribute(config.blogUrl)}">${labels.articleCtaSecondary}</a>
          </div>
        </div>
      </article>
    </div>
  </section>

  ${relatedHtml ? `<section class="ocean blog-post-static-section blog-post-related-section">
    <div class="container">
      <div class="section-header section-header--left"><h2>${labels.relatedPosts}</h2></div>
      <div class="blog-teaser-grid">${relatedHtml}</div>
    </div>
  </section>` : ''}
</main>

<div id="footer-placeholder"></div>
<script src="/assets/site.js?v=20260721"></script>
</body>
</html>
`.replace(/[ \t]+$/gm, '');
}

function canonicalizePageUrl(url) {
  const clean = String(url || '/').replace(/\.html$/, '');
  return clean === '/index' ? '/' : clean;
}

function renderSitemap(siteContents) {
  const urls = new Set();

  siteContents.forEach(({ content }) => {
    (content.pages || []).forEach((page) => urls.add(absoluteUrl(canonicalizePageUrl(page.url))));
    (content.posts || []).forEach((post) => urls.add(absoluteUrl(post.url)));
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(urls).map((url) => `  <url><loc>${escapeText(url)}</loc></url>`),
    '</urlset>',
    ''
  ].join('\n');
}

function generateBlogPages() {
  const siteContents = configs.map((config) => ({ config, content: loadSiteContent(config.sourcePath) }));
  const seenUrls = new Set();
  let generated = 0;

  siteContents.forEach(({ config, content }) => {
    const posts = content.posts || [];

    posts.forEach((post) => {
      validatePost(post, config);
      if (seenUrls.has(post.url)) throw new Error(`Duplicate published blog URL: ${post.url}`);
      seenUrls.add(post.url);

      const outputPath = outputPathForUrl(post.url);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, renderPostPage(post, posts, config, content.labels || {}), 'utf8');
      generated += 1;
    });
  });

  fs.writeFileSync(path.join(root, 'sitemap.xml'), renderSitemap(siteContents), 'utf8');
  console.log(`Generated ${generated} static blog pages and sitemap.xml.`);
}

if (require.main === module) {
  try {
    generateBlogPages();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = {
  decodeHtml,
  generateBlogPages
};
