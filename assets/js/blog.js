(function () {
  var PREVIEW_POST_FLOOR = 18;

  function decodeHTML(value) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = value || '';
    return textarea.value;
  }

  function byNewest(a, b) {
    return new Date(b.dateISO) - new Date(a.dateISO);
  }

  function clonePost(post) {
    return Object.assign({}, post);
  }

  function buildListingPosts(posts, options) {
    var listingPosts = posts.slice();
    var allowPreviewDuplication = !options || options.allowPreviewDuplication !== false;

    // Keep the scroll experience meaningful while the listing still uses dummy content.
    if (allowPreviewDuplication && posts.length && posts.length <= 6) {
      while (listingPosts.length < PREVIEW_POST_FLOOR) {
        posts.forEach(function (post) {
          if (listingPosts.length >= PREVIEW_POST_FLOOR) return;
          listingPosts.push(clonePost(post));
        });
      }
    }

    return listingPosts;
  }

  function escapeHTML(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeTag(value) {
    return decodeHTML(value || '').trim().toLowerCase();
  }

  function buildTagHref(tag, blogIndexUrl) {
    return blogIndexUrl + '?tag=' + encodeURIComponent(decodeHTML(tag));
  }

  function renderTags(tags, blogIndexUrl) {
    return (tags || [])
      .map(function (tag) {
        return '<li><a class="blog-chip-link" href="' + escapeAttribute(buildTagHref(tag, blogIndexUrl)) + '" data-tag="' + escapeAttribute(decodeHTML(tag)) + '">' + tag + '</a></li>';
      })
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

  function renderListingCard(post, index, labels, blogIndexUrl) {
    var readArticleLabel = decodeHTML(labels.readArticle || 'Read article') + ': ' + decodeHTML(post.title);

    return [
      '<article class="blog-card blog-card--' + (post.listingClass || 'standard') + '">',
      '  <a class="blog-card__stretched-link" href="' + post.url + '" aria-label="' + escapeAttribute(readArticleLabel) + '"></a>',
      '  <div class="blog-card__link">',
      '    <div class="blog-card__media">',
      '      ' + renderPostImage(post, 'lazy'),
      '    </div>',
      '    <div class="blog-card__overlay">',
      index === 0 ? '      <span class="blog-card__flag">' + labels.featuredLabel + '</span>' : '',
      '      <ul class="blog-chip-list">' + renderTags(post.tags, blogIndexUrl) + '</ul>',
      '      <h3>' + post.title + '</h3>',
      '      <div class="blog-card__meta">' + post.dateLabel + '</div>',
      '    </div>',
      '  </div>',
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

  function initInfiniteBlogListing(grid, posts, labels, blogIndexUrl, options) {
    var listingPosts = buildListingPosts(posts, options);
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
        return renderListingCard(post, startIndex + index, labels, blogIndexUrl);
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

  function renderTeaserCard(post, labels, blogIndexUrl) {
    return [
      '<article class="blog-teaser-card">',
      '  <a class="blog-teaser-card__media" href="' + post.url + '">',
      '    ' + renderPostImage(post, 'lazy'),
      '  </a>',
      '  <div class="blog-teaser-card__body">',
      '    <ul class="blog-chip-list">' + renderTags(post.tags, blogIndexUrl) + '</ul>',
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
    var isFrench = (window.location.pathname || '').indexOf('/fr/') === 0;
    var blogIndexUrl = isFrench ? '/fr/blog.html' : '/blog.html';
    var params = new URLSearchParams(window.location.search);
    var selectedTag = decodeHTML(params.get('tag') || '').trim();
    var posts = window.ltSiteContent.posts.slice().sort(byNewest);
    var filteredPosts = selectedTag
      ? posts.filter(function (post) {
          return (post.tags || []).some(function (tag) {
            return normalizeTag(tag) === normalizeTag(selectedTag);
          });
        })
      : posts;
    var grid = document.getElementById('blog-grid');
    if (grid) {
      grid.innerHTML = '';

      var filterState = document.getElementById('blog-filter-state');
      if (!filterState) {
        filterState = document.createElement('div');
        filterState.id = 'blog-filter-state';
        filterState.className = 'blog-filter-state';
        grid.parentNode.insertBefore(filterState, grid);
      }

      if (selectedTag) {
        filterState.hidden = false;
        filterState.innerHTML = [
          '<span class="blog-filter-state__label">' + (labels.filteredByTag || 'Filtered by tag') + '</span>',
          '<strong class="blog-filter-state__tag">' + escapeHTML(selectedTag) + '</strong>',
          '<a class="text-link blog-filter-state__clear" href="' + blogIndexUrl + '">' + (labels.clearTagFilter || 'Show all posts') + '</a>'
        ].join('');
      } else {
        filterState.hidden = true;
        filterState.innerHTML = '';
      }

      if (!filteredPosts.length) {
        grid.innerHTML = '<div class="blog-empty-state">' + escapeHTML(labels.noTaggedPosts || 'No posts match this tag yet.') + '</div>';
      } else {
        initInfiniteBlogListing(grid, filteredPosts, labels, blogIndexUrl, {
          allowPreviewDuplication: !selectedTag
        });
      }
    }

    var count = document.getElementById('blog-count');
    if (count) {
      count.textContent = filteredPosts.length + (isFrench ? ' articles' : ' posts');
    }

    var teaser = document.querySelector('[data-blog-teaser-grid]');
    if (teaser) {
      teaser.innerHTML = posts.slice(0, 3).map(function (post) {
        return renderTeaserCard(post, labels, blogIndexUrl);
      }).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogScreens);
  } else {
    initBlogScreens();
  }
})();
