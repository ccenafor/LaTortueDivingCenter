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

  const setupRevealAnimations = () => {
    if (!('IntersectionObserver' in window)) return;

    const revealNow = (el) => {
      el.classList.remove('is-visible');
      void el.offsetWidth; // force reflow so transition triggers
      setTimeout(() => el.classList.add('is-visible'), 24);
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
