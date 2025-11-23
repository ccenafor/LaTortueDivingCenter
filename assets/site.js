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

  const initializeScrollReveal = () => {
    const sections = document.querySelectorAll('.scroll-reveal');
    if (!sections.length) return;

    document.body.classList.add('reveal-ready');

    const supportsMatchMedia = typeof window.matchMedia === 'function';
    const prefersReducedMotion = supportsMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealImmediately = prefersReducedMotion || !('IntersectionObserver' in window);

    sections.forEach(section => {
      section.querySelectorAll('[data-reveal]').forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${index * 80}ms`);
      });
    });

    if (revealImmediately) {
      sections.forEach(section => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    // Defer observing slightly to allow layout / CSS reflow before computing intersections.
    setTimeout(() => {
      sections.forEach(section => {
        section.classList.remove('is-visible');
        observer.observe(section);
      });
    }, 20);
  };

  let hasInitialized = false;
  let initializing = false;

  const runPageInitialization = async () => {
    if (initializing || hasInitialized) return;
    initializing = true;

    try {
      await Promise.all([
        fetchHTML('menu.html', 'menu-placeholder'),
        fetchHTML('footer.html', 'footer-placeholder')
      ]);

      setupMenu();
      initializeScrollReveal();
      hasInitialized = true;
    } catch (error) {
      console.error('Page initialization failed:', error);
    } finally {
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
