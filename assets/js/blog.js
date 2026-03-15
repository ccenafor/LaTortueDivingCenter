(function () {
  function byNewest(a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  }

  function renderTags(tags) {
    return (tags || [])
      .map(function (tag) { return '<li><span>' + tag + '</span></li>'; })
      .join('');
  }

  function renderListingCard(post, index, labels) {
    return [
      '<article class="blog-card blog-card--' + (post.listingClass || 'standard') + '">',
      '  <a class="blog-card__link" href="' + post.url + '">',
      '    <div class="blog-card__media">',
      '      <img loading="lazy" decoding="async" src="' + post.image + '" alt="' + post.imageAlt + '">',
      '    </div>',
      '    <div class="blog-card__overlay">',
      index === 0 ? '      <span class="blog-card__flag">' + labels.featuredLabel + '</span>' : '',
      '      <ul class="blog-chip-list">' + renderTags(post.tags) + '</ul>',
      '      <h3>' + post.title + '</h3>',
      '      <div class="blog-card__meta">' + post.dateLabel + '</div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function renderTeaserCard(post, labels) {
    return [
      '<article class="blog-teaser-card">',
      '  <a class="blog-teaser-card__media" href="' + post.url + '">',
      '    <img loading="lazy" decoding="async" src="' + post.image + '" alt="' + post.imageAlt + '">',
      '  </a>',
      '  <div class="blog-teaser-card__body">',
      '    <ul class="blog-chip-list">' + renderTags(post.tags) + '</ul>',
      '    <h3><a href="' + post.url + '">' + post.title + '</a></h3>',
      '    <p>' + post.excerpt + '</p>',
      '    <a class="text-link" href="' + post.url + '">' + labels.readArticle + '</a>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function initBlogScreens() {
    if (!window.ltSiteContent || !window.ltSiteContent.posts) return;

    var labels = window.ltSiteContent.labels || {};
    var posts = window.ltSiteContent.posts.slice().sort(byNewest);
    var grid = document.getElementById('blog-grid');
    if (grid) {
      var listingPosts = posts.concat(posts.map(function (post) {
        return Object.assign({}, post);
      }));
      grid.innerHTML = listingPosts.map(function (post, index) {
        return renderListingCard(post, index, labels);
      }).join('');
    }

    var count = document.getElementById('blog-count');
    if (count) {
      count.textContent = posts.length + ((window.location.pathname || '').indexOf('/fr/') === 0 ? ' articles' : ' posts');
    }

    var teaser = document.querySelector('[data-blog-teaser-grid]');
    if (teaser) {
      teaser.innerHTML = posts.slice(0, 3).map(function (post) {
        return renderTeaserCard(post, labels);
      }).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogScreens);
  } else {
    initBlogScreens();
  }
})();
