(() => {
  const isFrench = () => window.location.pathname.startsWith('/fr/');
  const normalizePath = (path) => {
    if (!path) return '/index.html';
    if (path === '/') return '/index.html';
    return path.replace(/^\/fr/, '') || '/index.html';
  };

  const fetchHTML = async (url, placeholderId) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      const html = await response.text();
      const target = document.getElementById(placeholderId);
      if (target) {
        target.innerHTML = html;
      }
    } catch (error) {
      console.error(`Error loading content for ${placeholderId}:`, error);
    }
  };

  const setupMenu = () => {
    document.body.classList.add('has-fixed-nav');

    const menuToggle = document.getElementById('menuToggle');
    const mobilePanel = document.getElementById('mpanel');
    if (menuToggle && mobilePanel) {
      menuToggle.addEventListener('click', () => mobilePanel.classList.toggle('open'));
      mobilePanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobilePanel.classList.remove('open'));
      });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const normalizedCurrent = normalizePath(window.location.pathname);
    document.querySelectorAll('.nav-links a, .mpanel .links a').forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname.replace(/^\/fr/, '') || '/index.html';
      const isIndex = normalizedCurrent === '/index.html' && (linkPath === '/' || linkPath === '/index.html');
      link.classList.toggle('active', isIndex || linkPath === normalizedCurrent);
    });

    document.querySelectorAll('.mpanel-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const group = button.closest('.mpanel-group');
        if (group) {
          group.classList.toggle('open');
          button.setAttribute('aria-expanded', group.classList.contains('open'));
        }
      });
    });

    const langSwitches = document.querySelectorAll('[data-lang-switch]');
    const currentPath = normalizePath(window.location.pathname);
    const englishPath = currentPath;
    const frenchPath = `/fr${currentPath}`;

    langSwitches.forEach(langSwitch => {
      if (isFrench()) {
        langSwitch.href = englishPath;
        langSwitch.setAttribute('hreflang', 'en');
        langSwitch.setAttribute('aria-label', 'English version');
        langSwitch.dataset.targetLang = 'en';
      } else {
        langSwitch.href = frenchPath;
        langSwitch.setAttribute('hreflang', 'fr');
        langSwitch.setAttribute('aria-label', 'Version française');
        langSwitch.dataset.targetLang = 'fr';
      }
    });

    const header = document.querySelector('header.nav');
    if (header) {
      const updateNavState = () => header.classList.toggle('nav-transparent', window.scrollY <= 90);
      updateNavState();
      window.addEventListener('scroll', updateNavState, { passive: true });
    }
  };

  const gtmId = 'GTM-NKSBQWHS';
  let gtmLoaded = false;
  let openCookieSettingsModal = null;
  let cookieSettingsBound = false;
  let consentInitialized = false;

  const ensureDataLayer = () => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    if (!window.gtag) {
      window.gtag = function() { window.dataLayer.push(arguments); };
    }
  };

  const initConsentDefaults = () => {
    if (consentInitialized) return;
    consentInitialized = true;
    ensureDataLayer();
    window.gtag('consent', 'default', { 'analytics_storage': 'denied' });
  };

  const updateConsent = (allowAnalytics) => {
    ensureDataLayer();
    const state = allowAnalytics ? 'granted' : 'denied';
    window.gtag('consent', 'update', { 'analytics_storage': state });
  };

  const loadGtm = () => {
    if (gtmLoaded || !gtmId) return;
    gtmLoaded = true;
    ensureDataLayer();
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  };

  const setupCookieBanner = () => {
    const storageKey = 'lt_cookie_consent';
    const prefsKey = 'lt_cookie_prefs';
    const defaultPrefs = { analytics: true };
    const getStoredConsent = () => {
      try {
        return window.localStorage.getItem(storageKey);
      } catch (error) {
        return null;
      }
    };
    const setStoredConsent = (value) => {
      try {
        window.localStorage.setItem(storageKey, value);
      } catch (error) {
        // Ignore storage failures and keep showing the banner.
      }
    };
    const getStoredPrefs = () => {
      try {
        const raw = window.localStorage.getItem(prefsKey);
        if (!raw) return { ...defaultPrefs };
        const parsed = JSON.parse(raw);
        return { ...defaultPrefs, ...parsed };
      } catch (error) {
        return { ...defaultPrefs };
      }
    };
    const setStoredPrefs = (prefs) => {
      try {
        window.localStorage.setItem(prefsKey, JSON.stringify(prefs));
      } catch (error) {
        // Ignore storage failures and keep showing the banner.
      }
    };
    const applyConsent = (value, prefs) => {
      setStoredConsent(value);
      if (prefs) {
        setStoredPrefs(prefs);
      }
      const allowAnalytics = value === 'accepted' || (value === 'custom' && prefs && prefs.analytics);
      updateConsent(allowAnalytics);
      if (allowAnalytics) {
        loadGtm();
      }
    };

    initConsentDefaults();
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    const isFrench = lang.startsWith('fr');
    const copy = isFrench ? {
      label: 'Banniere de consentement aux cookies',
      text: 'Nous utilisons des cookies pour am&eacute;liorer votre navigation et mesurer la fr&eacute;quentation du site. Merci d&#39;accepter !',
      accept: 'Accepter',
      params: 'Param&egrave;tres',
      modalTitle: 'G&eacute;rer mes pr&eacute;f&eacute;rences',
      modalIntro: 'Vous pouvez ajuster vos pr&eacute;f&eacute;rences de cookies. Les cookies essentiels sont toujours activ&eacute;s.',
      essentialTitle: 'Cookies essentiels (obligatoires)',
      essentialDesc: 'Indispensables au bon fonctionnement du site (navigation, s&eacute;curit&eacute; et chargement des pages).',
      essentialCookieName: 'Fonctionnement du site',
      essentialCookieDesc: 'Navigation, s&eacute;curit&eacute; et pr&eacute;f&eacute;rences de base.',
      essentialStatus: 'Toujours actifs',
      analyticsTitle: 'Cookies statistiques (optionnels)',
      analyticsDesc: 'Aident &agrave; mesurer la fr&eacute;quentation et &agrave; am&eacute;liorer le site via Google Tag Manager.',
      analyticsCookieName: 'Google Tag Manager',
      analyticsCookieDesc: 'Mesure de l&#39;audience et des interactions du site.',
      toggleOn: 'Oui',
      toggleOff: 'Non',
      save: 'Sauvegarder',
      close: 'Fermer',
      closeLabel: 'Fermer la fenetre',
      requiredTag: 'Requis'
    } : {
      label: 'Cookie consent banner',
      text: 'We use cookies to improve your experience and measure site traffic. Thank you for accepting!',
      accept: 'Accept',
      params: 'Settings',
      modalTitle: 'Manage Cookie Settings',
      modalIntro: 'You can adjust your cookie preferences. Essential cookies are always on.',
      essentialTitle: 'Essential cookies (required)',
      essentialDesc: 'Required for site navigation, security, and page loading.',
      essentialCookieName: 'Site functionality',
      essentialCookieDesc: 'Navigation, security, and core preferences.',
      essentialStatus: 'Always on',
      analyticsTitle: 'Analytics cookies',
      analyticsDesc: 'Help us measure traffic and improve the site via Google Tag Manager.',
      analyticsCookieName: 'Google Tag Manager',
      analyticsCookieDesc: 'Measures site usage and interactions.',
      toggleOn: 'On',
      toggleOff: 'Off',
      save: 'Save settings',
      close: 'Close',
      closeLabel: 'Close settings',
      requiredTag: 'Required'
    };

    let banner = null;
    const dismissBanner = () => {
      if (!banner || !banner.isConnected) return;
      banner.remove();
      document.body.classList.remove('has-cookie-banner');
    };

    const openModal = () => {
      if (document.querySelector('.cookie-modal')) return;
      const prefs = getStoredPrefs();
      let analyticsEnabled = Boolean(prefs.analytics);
      const modal = document.createElement('div');
      modal.className = 'cookie-modal';
      modal.innerHTML = `
        <div class="cookie-modal__overlay" data-cookie-modal="close"></div>
        <div class="cookie-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
          <div class="cookie-modal__header">
            <h3 class="cookie-modal__title" id="cookie-modal-title">${copy.modalTitle}</h3>
            <button class="cookie-modal__close" type="button" aria-label="${copy.closeLabel}" data-cookie-modal="close">&times;</button>
          </div>
          <div class="cookie-modal__body">
            <p class="cookie-modal__intro">${copy.modalIntro}</p>
            <div class="cookie-modal__section cookie-modal__section--essential">
              <div class="cookie-modal__section-header">
                <h4 class="cookie-modal__section-title">${copy.essentialTitle}</h4>
                <span class="cookie-modal__pill">${copy.requiredTag}</span>
              </div>
              <p class="cookie-modal__section-text">${copy.essentialDesc}</p>
              <div class="cookie-modal__row">
                <div class="cookie-modal__row-info">
                  <strong>${copy.essentialCookieName}</strong>
                  <span>${copy.essentialCookieDesc}</span>
                </div>
                <span class="cookie-modal__status">${copy.essentialStatus}</span>
              </div>
            </div>
            <div class="cookie-modal__section">
              <div class="cookie-modal__section-header">
                <h4 class="cookie-modal__section-title">${copy.analyticsTitle}</h4>
                <button class="cookie-toggle" type="button" data-cookie-toggle="analytics" aria-pressed="false">
                  <span class="cookie-toggle__track"><span class="cookie-toggle__thumb"></span></span>
                  <span class="cookie-toggle__label" data-cookie-toggle-label="analytics">${copy.toggleOff}</span>
                </button>
              </div>
              <p class="cookie-modal__section-text">${copy.analyticsDesc}</p>
              <div class="cookie-modal__row">
                <div class="cookie-modal__row-info">
                  <strong>${copy.analyticsCookieName}</strong>
                  <span>${copy.analyticsCookieDesc}</span>
                </div>
              </div>
            </div>
            <div class="cookie-modal__actions">
              <button class="btn btn-outline" type="button" data-cookie-action="close">${copy.close}</button>
              <button class="btn btn-primary" type="button" data-cookie-action="save">${copy.save}</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('no-scroll');

      const closeButtons = modal.querySelectorAll('[data-cookie-modal="close"], [data-cookie-action="close"]');
      const toggleBtn = modal.querySelector('[data-cookie-toggle="analytics"]');
      const toggleLabel = modal.querySelector('[data-cookie-toggle-label="analytics"]');
      const saveBtn = modal.querySelector('[data-cookie-action="save"]');

      const syncToggle = () => {
        if (!toggleBtn) return;
        toggleBtn.setAttribute('aria-pressed', analyticsEnabled ? 'true' : 'false');
        toggleBtn.classList.toggle('is-on', analyticsEnabled);
        if (toggleLabel) {
          toggleLabel.textContent = analyticsEnabled ? copy.toggleOn : copy.toggleOff;
        }
      };

      const closeModal = () => {
        modal.remove();
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleKeyDown);
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };

      closeButtons.forEach(button => button.addEventListener('click', closeModal));
      toggleBtn?.addEventListener('click', () => {
        analyticsEnabled = !analyticsEnabled;
        syncToggle();
      });
      saveBtn?.addEventListener('click', () => {
        const nextPrefs = { analytics: analyticsEnabled };
        applyConsent('custom', nextPrefs);
        closeModal();
        dismissBanner();
      });

      syncToggle();
      document.addEventListener('keydown', handleKeyDown);
      modal.querySelector('.cookie-modal__close')?.focus();
    };

    openCookieSettingsModal = openModal;
    if (!cookieSettingsBound) {
      document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-cookie-settings]');
        if (!trigger) return;
        event.preventDefault();
        openCookieSettingsModal?.();
      });
      cookieSettingsBound = true;
    }

    const existing = getStoredConsent();
    if (existing === 'accepted') {
      updateConsent(true);
      loadGtm();
      return;
    }
    if (existing === 'custom') {
      const prefs = getStoredPrefs();
      updateConsent(Boolean(prefs.analytics));
      if (prefs.analytics) {
        loadGtm();
      }
      return;
    }
    if (existing === 'rejected') {
      updateConsent(false);
      return;
    }

    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', copy.label);
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">${copy.text}</p>
        <div class="cookie-banner__actions">
          <button class="btn btn-outline cookie-banner__btn cookie-banner__btn--accept" type="button" data-cookie-action="accept">${copy.accept}</button>
          <button class="btn btn-primary cookie-banner__btn cookie-banner__btn--params" type="button" data-cookie-action="params">${copy.params}</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.classList.add('has-cookie-banner');

    const acceptBtn = banner.querySelector('[data-cookie-action="accept"]');
    const paramsBtn = banner.querySelector('[data-cookie-action="params"]');
    acceptBtn?.addEventListener('click', () => {
      applyConsent('accepted', { analytics: true });
      dismissBanner();
    });
    paramsBtn?.addEventListener('click', openModal);
  };

  const setupCourseToggles = () => {
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    const moreLabel = lang === 'fr' ? 'Plus sur ce cours' : 'More about this course';
    const hideLabel = lang === 'fr' ? 'Masquer les détails' : 'Hide details';
    const cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach(card => {
      const button = card.querySelector('.course-toggle');
      const details = card.querySelector('.course-details');
      if (!button || !details) return;

      button.setAttribute('aria-expanded', 'false');
      if (!button.textContent.trim()) {
        button.textContent = moreLabel;
      }

      button.addEventListener('click', () => {
        const isOpening = !details.classList.contains('open');
        details.classList.toggle('open', isOpening);
        button.setAttribute('aria-expanded', String(isOpening));
        button.textContent = isOpening ? hideLabel : moreLabel;

        if (!isOpening) {
          const headerOffset = 90;
          const top = card.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        }
      });
    });
  };

  const setupMobileDiveBar = () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isDivingPage = /^diving(?:[-.]|$)/.test(page);
    if (!isDivingPage) return;

    const lang = (document.documentElement.lang || 'en').toLowerCase();
    const bookLabel = lang === 'fr' ? 'Réserver une plongée' : 'Book a Dive';
    const whatsappLabel = 'WhatsApp';

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    const removeBar = () => {
      const existing = document.querySelector('.mobile-dive-bar');
      if (existing) existing.remove();
      document.body.classList.remove('has-mobile-dive-bar');
    };

    const buildBar = () => {
      if (document.querySelector('.mobile-dive-bar')) return;
      const bar = document.createElement('div');
      bar.className = 'mobile-dive-bar';
      bar.innerHTML = `
        <a class="btn btn-primary" href="contact.html">${bookLabel}</a>
        <a class="btn btn-whatsapp" href="https://wa.me/639695291297" target="_blank" rel="noreferrer" aria-label="WhatsApp chat">${whatsappLabel}</a>
      `;
      document.body.appendChild(bar);
      document.body.classList.add('has-mobile-dive-bar');
    };

    const evaluate = () => {
      if (isMobile()) {
        buildBar();
      } else {
        removeBar();
      }
    };

    evaluate();
    window.addEventListener('resize', evaluate, { passive: true });
  };

  const setupReviewSliders = () => {
    document.querySelectorAll('.review-slider').forEach(slider => {
      const track = slider.querySelector('.review-track');
      const slides = Array.from(slider.querySelectorAll('.review-slide'));
      const dots = Array.from(slider.querySelectorAll('.review-dot'));
      if (!track || !slides.length) return;

      let index = 0;
      const autoplayMs = Number(slider.dataset.autoplay || 0);
      let timer;

      const goTo = (idx) => {
        index = (idx + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      };

      const startAuto = () => {
        if (!autoplayMs) return;
        clearInterval(timer);
        timer = setInterval(() => goTo(index + 1), autoplayMs);
      };

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goTo(i);
          startAuto();
        });
      });

      slider.addEventListener('pointerenter', () => clearInterval(timer));
      slider.addEventListener('pointerleave', startAuto);

      goTo(0);
      startAuto();
    });
  };

  const setupMenuLightbox = () => {
    const gallery = document.querySelector('[data-menu-gallery]');
    const lightbox = document.getElementById('menu-lightbox');
    if (!gallery || !lightbox) return;

    const items = Array.from(gallery.querySelectorAll('[data-menu-item]'));
    const img = lightbox.querySelector('.menu-lightbox-img');
    const closeBtns = lightbox.querySelectorAll('[data-menu-close]');
    const prevBtn = lightbox.querySelector('[data-menu-prev]');
    const nextBtn = lightbox.querySelector('[data-menu-next]');
    let index = 0;

    const open = (idx) => {
      index = (idx + items.length) % items.length;
      const full = items[index].dataset.full || items[index].querySelector('img')?.src;
      const alt = items[index].querySelector('img')?.alt || 'Menu page';
      if (img) {
        img.src = full;
        img.alt = alt;
      }
      lightbox.removeAttribute('hidden');
      document.body.classList.add('no-scroll');
    };

    const close = () => {
      lightbox.setAttribute('hidden', '');
      document.body.classList.remove('no-scroll');
    };

    const go = (delta) => {
      open(index + delta);
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') open(i);
      });
    });

    closeBtns.forEach(btn => btn.addEventListener('click', close));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('menu-lightbox-backdrop')) close();
    });
    prevBtn?.addEventListener('click', () => go(-1));
    nextBtn?.addEventListener('click', () => go(1));

    window.addEventListener('keydown', (e) => {
      if (lightbox.hasAttribute('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  };

  const setupDiningGallery = () => {
    const gallery = document.querySelector('.dining-grid');
    const lightbox = document.getElementById('dining-lightbox');
    if (!gallery || !lightbox) return;

    const items = Array.from(gallery.querySelectorAll('[data-dining-item]'));
    const img = lightbox.querySelector('.menu-lightbox-img');
    const closeBtns = lightbox.querySelectorAll('[data-dining-close]');
    const prevBtn = lightbox.querySelector('[data-dining-prev]');
    const nextBtn = lightbox.querySelector('[data-dining-next]');
    let index = 0;

    const open = (idx) => {
      index = (idx + items.length) % items.length;
      const full = items[index].dataset.full || items[index].querySelector('img')?.src;
      const alt = items[index].querySelector('img')?.alt || 'Dining photo';
      if (img) {
        img.src = full;
        img.alt = alt;
      }
      lightbox.removeAttribute('hidden');
      document.body.classList.add('no-scroll');
    };

    const close = () => {
      lightbox.setAttribute('hidden', '');
      document.body.classList.remove('no-scroll');
    };

    const go = (delta) => open(index + delta);

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') open(i);
      });
    });

    closeBtns.forEach(btn => btn.addEventListener('click', close));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('menu-lightbox-backdrop')) close();
    });
    prevBtn?.addEventListener('click', () => go(-1));
    nextBtn?.addEventListener('click', () => go(1));

    window.addEventListener('keydown', (e) => {
      if (lightbox.hasAttribute('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  };

  const setupFunGallery = () => {
    const gallery = document.querySelector('.fun-gallery');
    const lightbox = document.getElementById('fun-lightbox');
    if (!gallery || !lightbox) return;

    const items = Array.from(gallery.querySelectorAll('[data-fun-item]'));
    if (!items.length) return;

    const img = lightbox.querySelector('.menu-lightbox-img');
    const title = lightbox.querySelector('.fun-lightbox-title');
    const subtitle = lightbox.querySelector('.fun-lightbox-subtitle');
    const closeBtns = lightbox.querySelectorAll('[data-fun-close]');
    const prevBtn = lightbox.querySelector('[data-fun-prev]');
    const nextBtn = lightbox.querySelector('[data-fun-next]');
    let index = 0;

    const setCaption = (item) => {
      const line1 = item.dataset.captionLine1 || '';
      const line2 = item.dataset.captionLine2 || '';
      if (title) title.textContent = line1;
      if (subtitle) {
        subtitle.textContent = line2;
        subtitle.classList.toggle('is-empty', !line2);
      }
    };

    const open = (idx) => {
      index = (idx + items.length) % items.length;
      const item = items[index];
      const full = item.dataset.full || item.querySelector('img')?.src;
      const alt = item.querySelector('img')?.alt || item.getAttribute('aria-label') || 'Fun dive photo';
      if (img) {
        img.src = full;
        img.alt = alt;
      }
      setCaption(item);
      lightbox.removeAttribute('hidden');
      document.body.classList.add('no-scroll');
    };

    const close = () => {
      lightbox.setAttribute('hidden', '');
      document.body.classList.remove('no-scroll');
    };

    const go = (delta) => open(index + delta);

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.addEventListener('keyup', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') open(i);
      });
    });

    closeBtns.forEach(btn => btn.addEventListener('click', close));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('menu-lightbox-backdrop')) close();
    });
    prevBtn?.addEventListener('click', () => go(-1));
    nextBtn?.addEventListener('click', () => go(1));

    window.addEventListener('keydown', (e) => {
      if (lightbox.hasAttribute('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
  };

  const setupRevealAnimations = () => {
    if (!('IntersectionObserver' in window)) return;

    const revealNow = (el) => {
      if (!el || el.classList.contains('is-visible')) return;
      requestAnimationFrame(() => {
        el.classList.add('is-visible');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '20% 0px -5%' });

    const tagTargets = (elements, { stagger = false } = {}) => {
      elements.forEach((el, idx) => {
        if (!el || el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        if (stagger) {
          const delay = Math.min(idx * 80, 480);
          el.style.setProperty('--reveal-delay', `${delay}ms`);
        }
        observer.observe(el);
      });
    };

    const runInitialPass = () => {
      observer.takeRecords().forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.classList.contains('is-visible')) return;
        const rect = el.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < viewHeight && rect.bottom > 0) {
          revealNow(el);
          observer.unobserve(el);
        }
      });
    };

    tagTargets(document.querySelectorAll('section:not(.slider)'), { stagger: true });
    tagTargets(document.querySelectorAll('.card, .card-wide, .feature-card, .day-pass-card'), { stagger: true });
    tagTargets(document.querySelectorAll('.row.row-4.dining-gallery .ph.tile'), { stagger: true });
    tagTargets(document.querySelectorAll('.hero .inner.container'), { stagger: false });
    tagTargets(document.querySelectorAll('.slider .caption .box, .slider .slider-dots, .slider .slider-nav'), { stagger: true });
    tagTargets(document.querySelectorAll('footer .footer-grid, footer .footer-bottom'), { stagger: true });
    const funGalleryTiles = document.querySelectorAll('.fun-gallery .fun-tile');
    if (funGalleryTiles.length) {
      tagTargets(funGalleryTiles, { stagger: true });
      const funSection = document.querySelector('.fun-gallery')?.closest('section');
      if (funSection) {
        funSection.classList.remove('reveal');
        funSection.classList.add('is-visible');
        funSection.style.removeProperty('--reveal-delay');
        observer.unobserve(funSection);
      }
    }

    runInitialPass();
    requestAnimationFrame(runInitialPass);
    setTimeout(runInitialPass, 220);
    window.addEventListener('load', runInitialPass, { once: true });
  };

  let hasInitialized = false;
  let initializing = false;

  const runPageInitialization = async () => {
    if (initializing || hasInitialized) return;
    initializing = true;

    const menuPath = isFrench() ? '/fr/menu.html' : '/menu.html';
    const footerPath = isFrench() ? '/fr/footer.html' : '/footer.html';

    try {
      setupRevealAnimations();
      setupCookieBanner();

      await Promise.all([
        fetchHTML(menuPath, 'menu-placeholder'),
        fetchHTML(footerPath, 'footer-placeholder')
      ]);

      setupMenu();
      setupCourseToggles();
      setupMobileDiveBar();
      setupReviewSliders();
      setupMenuLightbox();
      setupDiningGallery();
      setupFunGallery();
    } catch (error) {
      console.error('Page initialization failed:', error);
    } finally {
      hasInitialized = true;
      initializing = false;
    }
  };

  const start = () => {
    runPageInitialization();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      hasInitialized = false;
      start();
    }
  });
})();
