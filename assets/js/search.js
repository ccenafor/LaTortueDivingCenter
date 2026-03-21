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

  function buildSearchMap(value) {
    var original = decodeHTML(String(value || ''))
      .replace(/\s+/g, ' ')
      .trim();
    var normalized = '';
    var map = [];
    var lastWasSpace = true;

    for (var i = 0; i < original.length; i += 1) {
      var chunk = original.charAt(i)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      if (!chunk) continue;

      var appendedWordChar = false;
      for (var j = 0; j < chunk.length; j += 1) {
        var char = chunk.charAt(j);
        if (/[a-z0-9]/.test(char)) {
          normalized += char;
          map.push(i);
          lastWasSpace = false;
          appendedWordChar = true;
        }
      }

      if (!appendedWordChar && !lastWasSpace) {
        normalized += ' ';
        map.push(i);
        lastWasSpace = true;
      }
    }

    if (normalized.charAt(normalized.length - 1) === ' ') {
      normalized = normalized.slice(0, -1);
      map.pop();
    }

    return {
      original: original,
      normalized: normalized,
      map: map
    };
  }

  function isWordChar(char) {
    return /[a-z0-9]/.test(char || '');
  }

  function findPhraseIndex(normalizedText, phrase) {
    if (!normalizedText || !phrase) return -1;

    var index = normalizedText.indexOf(phrase);
    while (index !== -1) {
      var before = index === 0 ? ' ' : normalizedText.charAt(index - 1);
      var afterIndex = index + phrase.length;
      var after = afterIndex >= normalizedText.length ? ' ' : normalizedText.charAt(afterIndex);
      if (!isWordChar(before) && !isWordChar(after)) {
        return index;
      }
      index = normalizedText.indexOf(phrase, index + 1);
    }

    return -1;
  }

  function findTermRanges(normalizedText, term) {
    var ranges = [];
    if (!normalizedText || !term) return ranges;

    var index = normalizedText.indexOf(term);
    while (index !== -1) {
      var before = index === 0 ? ' ' : normalizedText.charAt(index - 1);
      var afterIndex = index + term.length;
      var after = afterIndex >= normalizedText.length ? ' ' : normalizedText.charAt(afterIndex);

      if (!isWordChar(before) && !isWordChar(after)) {
        ranges.push([index, afterIndex]);
      }

      index = normalizedText.indexOf(term, index + term.length);
    }

    return ranges;
  }

  function mergeRanges(ranges) {
    if (!ranges.length) return ranges;

    var merged = [ranges[0].slice()];
    for (var i = 1; i < ranges.length; i += 1) {
      var current = ranges[i];
      var last = merged[merged.length - 1];
      if (current[0] <= last[1]) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current.slice());
      }
    }
    return merged;
  }

  function escapeWithHighlights(text, ranges) {
    if (!ranges.length) return escapeHTML(text);

    var parts = [];
    var cursor = 0;

    ranges.forEach(function (range) {
      var start = Math.max(cursor, range[0]);
      var end = Math.max(start, range[1]);
      if (start > cursor) {
        parts.push(escapeHTML(text.slice(cursor, start)));
      }
      parts.push('<mark>' + escapeHTML(text.slice(start, end)) + '</mark>');
      cursor = end;
    });

    if (cursor < text.length) {
      parts.push(escapeHTML(text.slice(cursor)));
    }

    return parts.join('');
  }

  function buildSnippetData(entry, terms) {
    var source = entry.contentText || entry.searchText || entry.excerpt || '';
    var mapped = buildSearchMap(source);
    if (!mapped.original || !mapped.normalized) {
      return {
        html: escapeHTML(decodeHTML(entry.excerpt || '')),
        fragmentText: ''
      };
    }

    var queryPhrase = terms.join(' ');
    var matchIndex = findPhraseIndex(mapped.normalized, queryPhrase);
    if (matchIndex === -1) {
      matchIndex = mapped.normalized.length;
      terms.forEach(function (term) {
        var termIndex = findPhraseIndex(mapped.normalized, term);
        if (termIndex !== -1 && termIndex < matchIndex) {
          matchIndex = termIndex;
        }
      });
      if (matchIndex === mapped.normalized.length) {
        matchIndex = 0;
      }
    }

    var contextBefore = 72;
    var contextAfter = 148;
    var matchLength = queryPhrase ? queryPhrase.length : (terms[0] || '').length;
    var startNorm = Math.max(0, matchIndex - contextBefore);
    var endNorm = Math.min(mapped.normalized.length - 1, matchIndex + matchLength + contextAfter);
    var startOriginal = mapped.map[startNorm] || 0;
    var endOriginal = (mapped.map[endNorm] || mapped.original.length - 1) + 1;

    while (startOriginal > 0 && /\S/.test(mapped.original.charAt(startOriginal - 1))) {
      startOriginal -= 1;
    }
    while (endOriginal < mapped.original.length && /\S/.test(mapped.original.charAt(endOriginal))) {
      endOriginal += 1;
    }

    var snippetText = mapped.original.slice(startOriginal, endOriginal).trim();
    if (!snippetText) {
      snippetText = mapped.original.slice(0, 220).trim();
    }

    var prefix = startOriginal > 0 ? '... ' : '';
    var suffix = endOriginal < mapped.original.length ? ' ...' : '';
    var snippetMap = buildSearchMap(snippetText);
    var ranges = [];

    terms.forEach(function (term) {
      ranges = ranges.concat(findTermRanges(snippetMap.normalized, term));
    });

    var originalRanges = mergeRanges(ranges).map(function (range) {
      var start = snippetMap.map[range[0]] || 0;
      var end = (snippetMap.map[range[1] - 1] || start) + 1;
      return [start, end];
    });

    return {
      html: prefix + escapeWithHighlights(snippetText, originalRanges) + suffix,
      fragmentText: snippetText
    };
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

  function entryHasAllTerms(entry, terms) {
    var combined = normalize([
      entry.title,
      entry.excerpt,
      (entry.tags || []).join(' '),
      entry.searchText
    ].join(' '));

    if (!combined) return false;

    if (terms.length <= 1) {
      return combined.indexOf(terms[0] || '') !== -1;
    }

    var tokens = combined.split(' ').filter(Boolean);
    if (!tokens.length) return false;

    var tokenSet = new Set(tokens);
    return terms.every(function (term) {
      return tokenSet.has(term);
    });
  }

  function resultTypeLabel(entry, labels) {
    return entry.type === 'blog' ? labels.blog : labels.page;
  }

  function renderSuggestions(labels) {
    return (window.ltSiteContent.searchSuggestions || []).map(function (term) {
      return '<a class="search-suggestion" href="?q=' + encodeURIComponent(term) + '">' + term + '</a>';
    }).join('');
  }

  function buildDirectResultUrl(entry, fragmentText) {
    if (!fragmentText) return entry.url;
    return entry.url + '#:~:text=' + encodeURIComponent(fragmentText);
  }

  function renderResult(entry, labels, terms) {
    var snippet = buildSnippetData(entry, terms);
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    var jumpLabel = labels.searchJumpToResult || (lang.indexOf('fr') === 0 ? 'Aller au r&eacute;sultat' : 'Go to result');

    return [
      '<article class="search-result-card">',
      '  <a class="search-result-card__media" href="' + entry.url + '">',
      '    <img loading="lazy" decoding="async" src="' + entry.image + '" alt="' + entry.imageAlt + '">',
      '  </a>',
      '  <div class="search-result-card__body">',
      '    <span class="search-result-card__type">' + resultTypeLabel(entry, labels) + '</span>',
      '    <h2><a href="' + entry.url + '">' + entry.title + '</a></h2>',
      '    <p class="search-result-card__snippet">' + snippet.html + '</p>',
      '    <div class="search-result-card__footer">',
      '      <ul class="blog-chip-list">' + (entry.tags || []).map(function (tag) { return '<li><span>' + tag + '</span></li>'; }).join('') + '</ul>',
      '      <a class="search-result-card__jump" href="' + buildDirectResultUrl(entry, snippet.fragmentText) + '">' + jumpLabel + '</a>',
      '    </div>',
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
      .filter(function (item) {
        return item.score > 0 && entryHasAllTerms(item.entry, terms);
      })
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
      return renderResult(entry, labels, terms);
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
