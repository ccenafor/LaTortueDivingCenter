(() => {
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
    document.querySelectorAll('.nav-links a, .mpanel .links a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentPage);
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

    const header = document.querySelector('header.nav');
    if (header) {
      const updateNavState = () => header.classList.toggle('nav-transparent', window.scrollY <= 90);
      updateNavState();
      window.addEventListener('scroll', updateNavState, { passive: true });
    }
  };

  const setupCourseToggles = () => {
    document.querySelectorAll('.course-toggle').forEach(button => {
      const details = button.closest('.card')?.querySelector('.course-details');
      if (!details) return;
      button.addEventListener('click', () => {
        const isOpen = details.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));
        button.textContent = isOpen ? 'Hide details' : 'More about this course';
      });
    });
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
    }, { threshold: 0.2, rootMargin: '0px 0px -10%' });

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

    try {
      setupRevealAnimations();

      await Promise.all([
        fetchHTML('menu.html', 'menu-placeholder'),
        fetchHTML('footer.html', 'footer-placeholder')
      ]);

      setupMenu();
      setupCourseToggles();
      setupReviewSliders();
      setupMenuLightbox();
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
