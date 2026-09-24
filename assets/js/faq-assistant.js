(function (global) {
  'use strict';

  const normalizeText = (value) => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const scoreKeyword = (query, keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) return 0;
    if (query === normalizedKeyword) return 100 + normalizedKeyword.length;
    if (` ${query} `.includes(` ${normalizedKeyword} `)) {
      const wordCount = normalizedKeyword.split(' ').length;
      return (wordCount * 10) + Math.min(normalizedKeyword.length, 20);
    }
    return 0;
  };

  const matchQuery = (question, entries, searchRoutes) => {
    const query = normalizeText(question);
    if (!query || !Array.isArray(entries)) return null;

    // Full editorial questions win before keyword routing (in either language).
    const exact = entries.find(entry => (entry.questions || []).some(value => normalizeText(value) === query));
    if (exact) return exact;

    let bestMatch = null;
    let bestScore = 0;
    entries.forEach(entry => {
      if ((entry.excludeKeywords || []).some(word => scoreKeyword(query, word))) return;
      // Each rule is an AND of synonym groups. Specific intent beats broad routing.
      const intent = (entry.matchRules || []).some(rule =>
        rule.every(group => group.some(word => scoreKeyword(query, word)))
      );
      const score = (intent ? 1000 : 0) + (entry.keywords || []).reduce((total, keyword) => {
        return total + scoreKeyword(query, keyword);
      }, 0);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    if (bestScore > 0) return bestMatch;

    // Broad category terms should offer guided choices instead of pretending
    // that one detailed answer is the only possible intent.
    return (searchRoutes || []).find(route =>
      (route.keywords || []).some(keyword => scoreKeyword(query, keyword))
    ) || null;
  };

  const getLocale = () => {
    const documentLanguage = (document.documentElement.lang || '').toLowerCase();
    return documentLanguage.startsWith('fr') || /^\/fr(?:\/|$)/.test(global.location.pathname)
      ? 'fr'
      : 'en';
  };

  const localizePath = (path, locale) => {
    if (!path || !path.startsWith('/')) return path || '/';
    if (locale !== 'fr') return path;
    if (path === '/') return '/fr/';
    if (path.startsWith('/fr/')) return path;
    return `/fr${path}`;
  };

  const track = (eventName, locale, contentVersion, details) => {
    const payload = Object.assign({
      event: eventName,
      faq_content_version: contentVersion,
      page_language: locale,
      page_path: global.location.pathname
    }, details || {});

    // Deliberately excludes the typed question, link text, names, contact details and all other PII.
    if (!global.dataLayer) global.dataLayer = [];
    if (typeof global.dataLayer.push === 'function') global.dataLayer.push(payload);
    if (typeof global.CustomEvent === 'function') {
      global.dispatchEvent(new global.CustomEvent('lt:faq-assistant', { detail: payload }));
    }
  };

  let removeGlobalListeners = null;

  const init = () => {
    const content = global.ltFaqAssistantContent;
    const root = document.querySelector('[data-faq-assistant]');
    if (!content || !root) return false;
    if (root.dataset.faqInitialized === 'true') return true;

    if (removeGlobalListeners) removeGlobalListeners();

    const locale = getLocale();
    const localeContent = content.locales[locale] || content.locales.en;
    const ui = localeContent.ui;
    const panel = root.querySelector('#faq-assistant-panel');
    const trigger = root.querySelector('[data-faq-trigger]');
    const closeButton = root.querySelector('[data-faq-close]');
    const form = root.querySelector('[data-faq-form]');
    const input = root.querySelector('[data-faq-input]');
    const result = root.querySelector('[data-faq-result]');
    const topicsContainer = root.querySelector('[data-faq-topics]');
    const panelBody = root.querySelector('.faq-assistant__body');

    if (!panel || !trigger || !closeButton || !form || !input || !result || !topicsContainer || !panelBody) {
      return false;
    }

    root.dataset.faqInitialized = 'true';

    const setText = (selector, value) => {
      const element = root.querySelector(selector);
      if (element) element.textContent = value;
    };

    setText('[data-faq-trigger-label]', ui.triggerLabel);
    setText('[data-faq-title]', ui.title);
    setText('[data-faq-topics-label]', ui.topicsLabel);
    setText('[data-faq-question-label]', ui.questionLabel);
    setText('[data-faq-submit]', ui.submitLabel);
    closeButton.setAttribute('aria-label', ui.closeLabel);

    const whatsappUrl = () => {
      const message = encodeURIComponent(ui.whatsappMessage);
      return `https://wa.me/${content.whatsappNumber}?text=${message}`;
    };

    const renderLinks = (links, sourceId) => {
      const linksContainer = document.createElement('div');
      linksContainer.className = 'faq-assistant__links';

      links.forEach(link => {
        const anchor = document.createElement('a');
        const isWhatsApp = link.id === 'whatsapp';
        anchor.className = `faq-assistant__link${isWhatsApp ? ' faq-assistant__link--whatsapp' : ''}`;
        anchor.href = isWhatsApp ? whatsappUrl() : localizePath(link.path, locale);
        anchor.textContent = link.label;
        if (isWhatsApp) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
        anchor.addEventListener('click', () => {
          track('faq_assistant_link_click', locale, content.version, {
            faq_source_id: sourceId,
            faq_destination_id: link.id,
            faq_destination_type: isWhatsApp ? 'whatsapp' : 'internal'
          });
        });
        linksContainer.appendChild(anchor);
      });

      return linksContainer;
    };

    const renderResult = (entry, options) => {
      const settings = options || {};
      const fragment = document.createDocumentFragment();
      const title = document.createElement('h3');
      const answer = document.createElement('p');

      title.className = 'faq-assistant__result-title';
      title.textContent = entry.title;
      answer.className = 'faq-assistant__result-text';
      answer.textContent = entry.answer || '';

      fragment.append(title, answer);
      if (entry.entryIds) {
        const questions = document.createElement('div');
        questions.className = 'faq-assistant__questions';
        entry.entryIds.forEach(id => {
          const item = localeContent.entries.find(candidate => candidate.id === id);
          if (!item) return;
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'faq-assistant__topic';
          button.textContent = item.title;
          button.addEventListener('click', () => {
            renderResult(item, { activeTopic: entry.id, focusResult: true });
            track('faq_assistant_match', locale, content.version, { faq_result_id: item.id });
          });
          questions.appendChild(button);
        });
        fragment.appendChild(questions);
      }
      if (entry.topicIds) {
        const topicChoices = document.createElement('div');
        topicChoices.className = 'faq-assistant__questions';
        entry.topicIds.forEach(id => {
          const topic = localeContent.topics.find(candidate => candidate.id === id);
          if (!topic) return;
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'faq-assistant__topic';
          button.textContent = topic.label;
          button.addEventListener('click', () => {
            renderResult(topic, { activeTopic: topic.id, focusResult: true });
            track('faq_assistant_topic_select', locale, content.version, { faq_topic_id: topic.id });
          });
          topicChoices.appendChild(button);
        });
        fragment.appendChild(topicChoices);
      }
      if (entry.links && entry.links.length) {
        fragment.appendChild(renderLinks(entry.links, entry.id));
      }
      result.replaceChildren(fragment);
      result.hidden = false;

      topicsContainer.querySelectorAll('[data-faq-topic]').forEach(button => {
        button.setAttribute('aria-pressed', button.dataset.faqTopic === settings.activeTopic ? 'true' : 'false');
      });

      if (settings.focusResult) result.focus({ preventScroll: false });
    };

    const renderValidation = () => {
      const message = document.createElement('p');
      message.className = 'faq-assistant__validation';
      message.textContent = ui.emptyQuestion;
      result.replaceChildren(message);
      result.hidden = false;
      input.focus();
    };

    localeContent.topics.forEach(topic => {
      const button = document.createElement('button');
      button.className = 'faq-assistant__topic';
      button.type = 'button';
      button.textContent = topic.label;
      button.dataset.faqTopic = topic.id;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        renderResult(topic, { activeTopic: topic.id, focusResult: true });
        track('faq_assistant_topic_select', locale, content.version, { faq_topic_id: topic.id });
      });
      topicsContainer.appendChild(button);
    });

    let returnFocusTarget = trigger;

    const openPanel = opener => {
      if (opener) returnFocusTarget = opener;
      if (!panel.hidden) return;
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      track('faq_assistant_open', locale, content.version);
      panelBody.scrollTop = 0;
      global.requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
    };

    const closePanel = (returnFocus) => {
      if (panel.hidden) return;
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) {
        const focusTarget = returnFocusTarget && returnFocusTarget.isConnected
          ? returnFocusTarget
          : trigger;
        focusTarget.focus();
      }
    };

    trigger.addEventListener('click', () => {
      if (panel.hidden) openPanel(trigger);
      else closePanel(false);
    });
    closeButton.addEventListener('click', () => closePanel(true));

    form.addEventListener('submit', event => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) {
        renderValidation();
        return;
      }

      const match = matchQuery(question, localeContent.entries, localeContent.searchRoutes);
      input.value = '';

      if (match) {
        renderResult(match, { focusResult: true });
        track('faq_assistant_match', locale, content.version, { faq_result_id: match.id });
        return;
      }

      const noMatch = {
        id: 'no_match',
        title: ui.noMatchTitle,
        answer: ui.noMatchText,
        links: [{ id: 'whatsapp', label: ui.whatsappLabel }]
      };
      renderResult(noMatch, { focusResult: true });
      track('faq_assistant_no_match', locale, content.version, { faq_result_id: 'no_match' });
    });

    const handleDocumentClick = event => {
      const footerTrigger = event.target.closest && event.target.closest('[data-faq-open]');
      if (footerTrigger) {
        event.preventDefault();
        openPanel(footerTrigger);
        return;
      }
      // A question click replaces its button before bubbling to document.
      // The event path still identifies that click as originating inside the widget.
      const inside = event.composedPath().includes(root);
      if (!panel.hidden && !inside) closePanel(false);
    };
    const handleDocumentKeydown = event => {
      if (event.key === 'Escape' && !panel.hidden) closePanel(true);
    };
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeydown);
    removeGlobalListeners = () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeydown);
    };

    return true;
  };

  global.ltFaqAssistant = {
    init,
    matchQuery,
    normalizeText
  };
})(typeof window !== 'undefined' ? window : globalThis);
