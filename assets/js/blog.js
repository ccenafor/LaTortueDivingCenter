(function () {
  var PREVIEW_POST_FLOOR = 18;

  function byNewest(a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  }

  function clonePost(post) {
    return Object.assign({}, post);
  }

  function buildListingPosts(posts) {
    var listingPosts = posts.slice();

    // Keep the scroll experience meaningful while the listing still uses dummy content.
    if (posts.length && posts.length <= 6) {
      while (listingPosts.length < PREVIEW_POST_FLOOR) {
        posts.forEach(function (post) {
          if (listingPosts.length >= PREVIEW_POST_FLOOR) return;
          listingPosts.push(clonePost(post));
        });
      }
    }

    return listingPosts;
  }

  function renderTags(tags) {
    return (tags || [])
      .map(function (tag) { return '<li><span>' + tag + '</span></li>'; })
      .join('');
  }

  function escapeAttribute(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function renderPostImage(post, loading) {
    var attributes = [
      'loading="' + (loading || 'lazy') + '"',
      'decoding="async"',
      'src="' + escapeAttribute(post.image) + '"',
      'alt="' + escapeAttribute(post.imageAlt) + '"'
    ];

    if (post.imageSrcSet) attributes.push('srcset="' + escapeAttribute(post.imageSrcSet) + '"');
    if (post.imageSizes) attributes.push('sizes="' + escapeAttribute(post.imageSizes) + '"');
    if (post.imageWidth) attributes.push('width="' + escapeAttribute(post.imageWidth) + '"');
    if (post.imageHeight) attributes.push('height="' + escapeAttribute(post.imageHeight) + '"');

    return '<img ' + attributes.join(' ') + '>';
  }

  function renderListingCard(post, index, labels) {
    return [
      '<article class="blog-card blog-card--' + (post.listingClass || 'standard') + '">',
      '  <a class="blog-card__link" href="' + post.url + '">',
      '    <div class="blog-card__media">',
      '      ' + renderPostImage(post, 'lazy'),
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

  function getInitialBatchSize() {
    if (window.matchMedia('(max-width: 640px)').matches) return 4;
    if (window.matchMedia('(max-width: 1100px)').matches) return 5;
    return 4;
  }

  function getScrollBatchSize() {
    if (window.matchMedia('(max-width: 640px)').matches) return 2;
    if (window.matchMedia('(max-width: 1100px)').matches) return 3;
    return 3;
  }

  function initInfiniteBlogListing(grid, posts, labels) {
    var listingPosts = buildListingPosts(posts);
    var cursor = 0;
    var observer = null;
    var sentinel = null;
    var isAppending = false;
    var scrollFallbackBound = false;

    function ensureSentinel() {
      if (sentinel && sentinel.isConnected) return sentinel;

      sentinel = document.createElement('div');
      sentinel.className = 'blog-feed-sentinel';
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.innerHTML = '<span class="blog-feed-sentinel__line"></span>';
      grid.parentNode.appendChild(sentinel);
      return sentinel;
    }

    function setSentinelState(state) {
      var currentSentinel = ensureSentinel();
      currentSentinel.classList.toggle('is-loading', state === 'loading');
      currentSentinel.classList.toggle('is-finished', state === 'finished');
    }

    function revealCards(cards) {
      if (!cards.length) return;

      cards.forEach(function (card, index) {
        card.style.setProperty('--blog-card-delay', Math.min(index * 120, 420) + 'ms');
      });

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          cards.forEach(function (card) {
            card.classList.add('is-visible');
          });
          isAppending = false;
          if (cursor >= listingPosts.length) {
            setSentinelState('finished');
          } else {
            setSentinelState('idle');
            maybeLoadMoreFromScroll();
          }
        });
      });
    }

    function appendBatch(size) {
      if (isAppending || cursor >= listingPosts.length) return;

      var nextPosts = listingPosts.slice(cursor, cursor + size);
      if (!nextPosts.length) return;

      isAppending = true;
      setSentinelState('loading');

      var startIndex = cursor;
      grid.insertAdjacentHTML('beforeend', nextPosts.map(function (post, index) {
        return renderListingCard(post, startIndex + index, labels);
      }).join(''));

      cursor += nextPosts.length;

      var cards = Array.prototype.slice.call(grid.querySelectorAll('.blog-card')).slice(-nextPosts.length);
      cards.forEach(function (card) {
        card.classList.add('blog-card--enter');
      });

      revealCards(cards);
    }

    function maybeLoadMoreFromScroll() {
      if (isAppending || cursor >= listingPosts.length) return;

      var currentSentinel = ensureSentinel();
      var rect = currentSentinel.getBoundingClientRect();
      if (rect.top - window.innerHeight < 180) {
        appendBatch(getScrollBatchSize());
      }
    }

    if ('IntersectionObserver' in window) {
      ensureSentinel();
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          appendBatch(getScrollBatchSize());
        });
      }, {
        rootMargin: '0px 0px 140px 0px',
        threshold: 0
      });

      observer.observe(ensureSentinel());
    } else if (!scrollFallbackBound) {
      scrollFallbackBound = true;
      window.addEventListener('scroll', maybeLoadMoreFromScroll, { passive: true });
      window.addEventListener('resize', maybeLoadMoreFromScroll, { passive: true });
    }

    appendBatch(getInitialBatchSize());
  }

  function renderTeaserCard(post, labels) {
    return [
      '<article class="blog-teaser-card">',
      '  <a class="blog-teaser-card__media" href="' + post.url + '">',
      '    ' + renderPostImage(post, 'lazy'),
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
      grid.innerHTML = '';
      initInfiniteBlogListing(grid, posts, labels);
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
