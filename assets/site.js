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
      setupCourseToggles();
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
