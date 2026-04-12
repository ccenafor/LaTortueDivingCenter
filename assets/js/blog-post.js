(function () {
  function decodeHTML(value) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = value || '';
    return textarea.value;
  }

  function escapeHTML(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHTML(decodeHTML(value || ''));
  }

  function buildTagHref(tag, blogIndexUrl) {
    return blogIndexUrl + '?tag=' + encodeURIComponent(decodeHTML(tag));
  }

  function renderTagList(tags, blogIndexUrl) {
    return (tags || []).map(function (tag) {
      return '<li><a class="blog-chip-link" href="' + escapeAttribute(buildTagHref(tag, blogIndexUrl)) + '" data-tag="' + escapeAttribute(decodeHTML(tag)) + '">' + tag + '</a></li>';
    }).join('');
  }

  function renderImageTag(config) {
    if (!config || !config.src) return '';

    var attributes = [];
    if (config.className) attributes.push('class="' + escapeAttribute(config.className) + '"');
    if (config.loading) attributes.push('loading="' + escapeAttribute(config.loading) + '"');
    if (config.fetchPriority) attributes.push('fetchpriority="' + escapeAttribute(config.fetchPriority) + '"');
    attributes.push('decoding="' + escapeAttribute(config.decoding || 'async') + '"');
    attributes.push('src="' + escapeAttribute(config.src) + '"');
    attributes.push('alt="' + escapeAttribute(config.alt) + '"');
    if (config.srcSet) attributes.push('srcset="' + escapeAttribute(config.srcSet) + '"');
    if (config.sizes) attributes.push('sizes="' + escapeAttribute(config.sizes) + '"');
    if (config.width) attributes.push('width="' + escapeAttribute(config.width) + '"');
    if (config.height) attributes.push('height="' + escapeAttribute(config.height) + '"');

    return '<img ' + attributes.join(' ') + '>';
  }

  function renderFigure(figure) {
    if (!figure || !figure.src) return '';

    return [
      '<figure class="article-figure">',
      '  ' + renderImageTag({
        src: figure.src,
        alt: figure.alt,
        srcSet: figure.srcSet,
        sizes: figure.sizes,
        width: figure.width,
        height: figure.height,
        loading: figure.loading || 'lazy'
      }),
      figure.caption ? '  <figcaption>' + figure.caption + '</figcaption>' : '',
      '</figure>'
    ].join('');
  }

  function renderFigureGroup(figures) {
    var items = (figures || []).filter(function (figure) {
      return figure && figure.src;
    });

    if (!items.length) return '';

    return '<div class="article-figure-grid">' + items.map(function (figure) {
      return renderFigure({
        src: figure.src,
        alt: figure.alt,
        srcSet: figure.srcSet,
        sizes: figure.sizes,
        width: figure.width,
        height: figure.height,
        caption: figure.caption,
        loading: figure.loading || 'lazy'
      });
    }).join('') + '</div>';
  }

  function findPost(slug) {
    var posts = (window.ltSiteContent && window.ltSiteContent.posts) || [];
    return posts.find(function (post) { return post.slug === slug; }) || null;
  }

  function sharedTagScore(source, candidate) {
    var score = 0;
    (source.tags || []).forEach(function (tag) {
      if ((candidate.tags || []).indexOf(tag) !== -1) score += 1;
    });
    return score;
  }

  function renderRelated(post, labels, blogIndexUrl) {
    var posts = (window.ltSiteContent && window.ltSiteContent.posts) || [];
    var related = posts
      .filter(function (item) { return item.slug !== post.slug; })
      .sort(function (a, b) {
        return sharedTagScore(post, b) - sharedTagScore(post, a) || new Date(b.dateISO) - new Date(a.dateISO);
      })
      .slice(0, 3);

    return related.map(function (item) {
      return [
        '<article class="blog-teaser-card blog-teaser-card--compact">',
        '  <a class="blog-teaser-card__media" href="' + item.url + '">',
        '    <img loading="lazy" decoding="async" src="' + item.image + '" alt="' + item.imageAlt + '">',
        '  </a>',
        '  <div class="blog-teaser-card__body">',
        '    <ul class="blog-chip-list">' + renderTagList(item.tags, blogIndexUrl) + '</ul>',
        '    <h3><a href="' + item.url + '">' + item.title + '</a></h3>',
        '    <a class="text-link" href="' + item.url + '">' + labels.readArticle + '</a>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function setMeta(selector, attribute, value) {
    var element = document.querySelector(selector);
    if (!element || !value) return;
    element.setAttribute(attribute, value);
  }

  function injectStructuredData(post, pageTitle, pageDescription, pageUrl) {
    var existing = document.getElementById('blog-post-structured-data');
    if (existing) existing.remove();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-post-structured-data';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: decodeHTML(pageTitle),
      description: decodeHTML(pageDescription),
      datePublished: post.dateISO,
      author: {
        '@type': 'Organization',
        name: decodeHTML(post.author)
      },
      image: [window.location.origin + post.image],
      mainEntityOfPage: pageUrl,
      publisher: {
        '@type': 'Organization',
        name: 'La Tortue Diving Center'
      }
    });
    document.head.appendChild(script);
  }

  function renderPost() {
    if (!window.ltSiteContent || !window.ltSiteContent.posts) return;

    var labels = window.ltSiteContent.labels || {};
    var isFrench = (window.location.pathname || '').indexOf('/fr/') === 0;
    var homeUrl = isFrench ? '/fr/' : '/';
    var blogIndexUrl = isFrench ? '/fr/blog.html' : '/blog.html';
    var homeLabel = isFrench ? 'Accueil' : 'Home';
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var post = findPost(slug);
    var articleRoot = document.getElementById('blog-post-root');
    if (!articleRoot) return;

    if (!post) {
      articleRoot.innerHTML = [
        '<section class="sand"><div class="container article-missing">',
        '  <h1>' + labels.articleMissingTitle + '</h1>',
        '  <p>' + labels.articleMissingText + '</p>',
        '  <a class="btn btn-primary" href="' + blogIndexUrl + '">' + labels.backToBlog + '</a>',
        '</div></section>'
      ].join('');
      return;
    }

    var pageTitle = decodeHTML(post.title) + ' | La Tortue Blog';
    var pageDescription = decodeHTML(post.excerpt);
    var pageUrl = window.location.origin + window.location.pathname + '?slug=' + encodeURIComponent(post.slug);

    document.title = pageTitle;
    setMeta('meta[name="description"]', 'content', pageDescription);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDescription);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:image"]', 'content', window.location.origin + post.image);
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDescription);
    setMeta('meta[name="twitter:image"]', 'content', window.location.origin + post.image);
    setMeta('link[rel="canonical"]', 'href', pageUrl);

    var hreflangEn = document.querySelector('link[hreflang="en"]');
    var hreflangFr = document.querySelector('link[hreflang="fr"]');
    var xDefault = document.querySelector('link[hreflang="x-default"]');
    if (hreflangEn) hreflangEn.setAttribute('href', window.location.origin + '/blog-post.html?slug=' + encodeURIComponent(post.slug));
    if (hreflangFr) hreflangFr.setAttribute('href', window.location.origin + '/fr/blog-post.html?slug=' + encodeURIComponent(post.slug));
    if (xDefault) xDefault.setAttribute('href', window.location.origin + '/blog-post.html?slug=' + encodeURIComponent(post.slug));

    injectStructuredData(post, pageTitle, pageDescription, pageUrl);

    var sharedBanner = {
      src: '/assets/Pictures/Blog/Optimized/blog-post-banner.webp',
      alt: isFrench ? 'Banni&egrave;re du blog La Tortue Diving Center' : 'La Tortue Diving Center blog banner',
      srcSet: '/assets/Pictures/Blog/Optimized/blog-post-banner-960.webp 960w, /assets/Pictures/Blog/Optimized/blog-post-banner.webp 1905w',
      sizes: '100vw',
      width: 1905,
      height: 434,
      className: 'hero-banner-image',
      loading: 'eager',
      fetchPriority: 'high'
    };

    var sectionsHTML = (post.sections || []).map(function (section) {
      return [
        '<section class="article-section">',
        '  <h2>' + section.heading + '</h2>',
        (section.paragraphs || []).map(function (paragraph) { return '<p>' + paragraph + '</p>'; }).join(''),
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
      ].join('');
    }).join('');

    var tagsHTML = renderTagList(post.tags, blogIndexUrl);
    var relatedHTML = renderRelated(post, labels, blogIndexUrl);

    articleRoot.innerHTML = [
      '<section class="hero hero-blog-post">',
      '  <div class="banner article-banner">',
      '    ' + renderImageTag(sharedBanner),
      '    <div class="hero-banner-overlay"></div>',
      '  </div>',
      '  <div class="inner container">',
      '    <div class="article-hero-copy">',
      '      <p class="article-eyebrow">' + labels.articleIntroEyebrow + '</p>',
      '      <h1>' + post.title + '</h1>',
      '      <p class="muted article-hero-excerpt">' + post.excerpt + '</p>',
      '    </div>',
      '  </div>',
      '</section>',
      '<section class="article-breadcrumb-bar blog-post-static-section">',
      '  <div class="container">',
      '    <nav class="breadcrumb-trail" aria-label="' + (isFrench ? 'Fil d&#39;Ariane' : 'Breadcrumb') + '">',
      '      <a href="' + homeUrl + '">' + homeLabel + '</a>',
      '      <span>/</span>',
      '      <a href="' + blogIndexUrl + '">Blog</a>',
      '      <span>/</span>',
      '      <span>' + post.title + '</span>',
      '    </nav>',
      '  </div>',
      '</section>',
      '<section class="sand blog-post-static-section blog-post-body-section">',
      '  <div class="container article-layout">',
      '    <aside class="article-sidebar">',
      '      <div class="article-meta-card">',
      '        <div class="article-meta-row"><span>' + labels.articlePublished + '</span><strong>' + post.dateLabel + '</strong></div>',
      '        <div class="article-meta-row"><span>' + labels.articleBy + '</span><strong>' + post.author + '</strong></div>',
      '        <div class="article-meta-row"><span>' + labels.articleTags + '</span><ul class="blog-chip-list blog-chip-list--stacked">' + tagsHTML + '</ul></div>',
      '      </div>',
      '    </aside>',
      '    <article class="article-content">',
      '      <p class="article-intro">' + post.intro + '</p>',
      renderFigure(post.figureImage ? {
        src: post.figureImage,
        alt: post.figureAlt,
        srcSet: post.figureSrcSet,
        sizes: post.figureSizes,
        width: post.figureWidth,
        height: post.figureHeight,
        caption: post.figureCaption
      } : null),
      sectionsHTML,
      '      <div class="article-cta-box">',
      '        <h2>' + labels.articleCtaTitle + '</h2>',
      '        <p>' + labels.articleCtaText + '</p>',
      '        <div class="article-cta-actions">',
      '          <a class="btn btn-primary" href="' + (isFrench ? '/fr/contact.html' : '/contact.html') + '">' + labels.articleCtaPrimary + '</a>',
      '          <a class="btn btn-outline" href="' + blogIndexUrl + '">' + labels.articleCtaSecondary + '</a>',
      '        </div>',
      '      </div>',
      '    </article>',
      '  </div>',
      '</section>',
      relatedHTML ? [
        '<section class="ocean blog-post-static-section blog-post-related-section">',
        '  <div class="container">',
        '    <div class="section-header section-header--left">',
        '      <h2>' + labels.relatedPosts + '</h2>',
        '    </div>',
        '    <div class="blog-teaser-grid">' + relatedHTML + '</div>',
        '  </div>',
        '</section>'
      ].join('') : ''
    ].join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPost);
  } else {
    renderPost();
  }
})();
