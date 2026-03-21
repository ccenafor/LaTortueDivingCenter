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

  function normalize(value) {
    return decodeHTML(String(value || ''))
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildEntries() {
    if (window.ltSearchIndex) {
      return []
        .concat(window.ltSearchIndex.pages || [])
        .concat(window.ltSearchIndex.posts || []);
    }

    if (!window.ltSiteContent) return [];
    var pageEntries = (window.ltSiteContent.pages || []).map(function (page) {
      return {
        type: 'page',
        title: page.title,
        excerpt: page.excerpt,
        tags: page.tags || [],
        url: page.url,
        image: page.image,
        imageAlt: page.imageAlt,
        searchText: page.searchText || ''
      };
    });

    var postEntries = (window.ltSiteContent.posts || []).map(function (post) {
      return {
        type: 'blog',
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags || [],
        url: post.url,
        image: post.image,
        imageAlt: post.imageAlt,
        searchText: (post.searchText || '') + ' ' + (post.intro || ''),
        dateISO: post.dateISO
      };
    });

    return pageEntries.concat(postEntries);
  }

  function scoreEntry(entry, terms) {
    var title = normalize(entry.title);
    var excerpt = normalize(entry.excerpt);
    var tags = normalize((entry.tags || []).join(' '));
    var text = normalize(entry.searchText);
    var score = 0;

    terms.forEach(function (term) {
      if (title.indexOf(term) !== -1) score += 20;
      if (tags.indexOf(term) !== -1) score += 14;
      if (excerpt.indexOf(term) !== -1) score += 8;
      if (text.indexOf(term) !== -1) score += 6;
    });

    if (title === terms.join(' ')) score += 40;
    return score;
  }

  function resultTypeLabel(entry, labels) {
    return entry.type === 'blog' ? labels.blog : labels.page;
  }

  function renderSuggestions(labels) {
    return (window.ltSiteContent.searchSuggestions || []).map(function (term) {
      return '<a class="search-suggestion" href="?q=' + encodeURIComponent(term) + '">' + term + '</a>';
    }).join('');
  }

  function renderResult(entry, labels) {
    return [
      '<article class="search-result-card">',
      '  <a class="search-result-card__media" href="' + entry.url + '">',
      '    <img loading="lazy" decoding="async" src="' + entry.image + '" alt="' + entry.imageAlt + '">',
      '  </a>',
      '  <div class="search-result-card__body">',
      '    <span class="search-result-card__type">' + resultTypeLabel(entry, labels) + '</span>',
      '    <h2><a href="' + entry.url + '">' + entry.title + '</a></h2>',
      '    <p>' + entry.excerpt + '</p>',
      '    <ul class="blog-chip-list">' + (entry.tags || []).map(function (tag) { return '<li><span>' + tag + '</span></li>'; }).join('') + '</ul>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function initSearch() {
    if (!window.ltSiteContent) return;

    var labels = window.ltSiteContent.labels || {};
    var form = document.getElementById('site-search-form');
    var input = document.getElementById('site-search-input');
    var results = document.getElementById('search-results');
    var summary = document.getElementById('search-summary');
    var emptyState = document.getElementById('search-empty');
    var suggestionBox = document.getElementById('search-suggestions');
    if (!form || !input || !results || !summary || !emptyState || !suggestionBox) return;

    suggestionBox.innerHTML = renderSuggestions(labels);

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    input.value = query;

    if (!query.trim()) {
      summary.innerHTML = '';
      results.innerHTML = '';
      emptyState.innerHTML = '<h2>' + labels.searchEmptyTitle + '</h2><p>' + labels.searchEmptyText + '</p>';
      emptyState.hidden = false;
      return;
    }

    var terms = normalize(query).split(' ').filter(Boolean);
    var matches = buildEntries()
      .map(function (entry) {
        return { entry: entry, score: scoreEntry(entry, terms) };
      })
      .filter(function (item) { return item.score > 0; })
      .sort(function (a, b) {
        return b.score - a.score || new Date(b.entry.dateISO || '1970-01-01') - new Date(a.entry.dateISO || '1970-01-01');
      })
      .map(function (item) { return item.entry; });

    summary.innerHTML = '<strong>' + labels.resultsFor + '</strong> &ldquo;' + escapeHTML(decodeHTML(query)) + '&rdquo; &middot; ' + (matches.length === 1 ? labels.resultsCountOne : matches.length + ' ' + labels.resultsCountMany);

    if (!matches.length) {
      results.innerHTML = '';
      emptyState.innerHTML = '<h2>' + labels.searchNoResultsTitle + '</h2><p>' + labels.searchNoResultsText + '</p>';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    results.innerHTML = matches.map(function (entry) {
      return renderResult(entry, labels);
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
