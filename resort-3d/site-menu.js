// Load the matching site menu fragment, without adding a Resort 3D link.
const placeholder = document.getElementById('menu-placeholder');
const viewer = document.getElementById('resort-viewer');
const english=document.documentElement.lang.toLowerCase().startsWith('en');
const menuPath=english?'/menu.html':'/fr/menu.html';
const tourPath=english?'/resort-3d/':'/fr/resort-3d/';
async function loadSiteMenu() {
  const response = await fetch(menuPath);
  if (!response.ok) throw new Error('The site menu could not be loaded.');
  const template = document.createElement('template');
  template.innerHTML = await response.text();
  const base = new URL(menuPath, location.origin);
  template.content.querySelectorAll('[href], [src]').forEach(element => {
    for (const attribute of ['href', 'src']) {
      const value = element.getAttribute(attribute);
      if (value && !/^(#|mailto:|tel:|data:)/i.test(value)) element.setAttribute(attribute, new URL(value, base).href);
    }
  });
  template.content.querySelectorAll('[srcset]').forEach(element => {
    element.setAttribute('srcset', element.getAttribute('srcset').split(',').map(candidate => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [new URL(url, base).href, ...descriptor].join(' ');
    }).join(', '));
  });
  placeholder.replaceChildren(template.content);
  const header = placeholder.querySelector('header');
  header.classList.remove('nav-transparent');
  placeholder.querySelectorAll('a.active').forEach(link => link.classList.remove('active'));
  placeholder.querySelectorAll('[data-lang-switch]').forEach(link => {
    link.href = english?'/fr/resort-3d/':'/resort-3d/';
    link.setAttribute('aria-label', english?'French site':'English site');
  });
  const toggle = document.getElementById('menuToggle');
  const panel = document.getElementById('mpanel');
  toggle.setAttribute('aria-controls', 'mpanel');
  function setOpen(open) {
    panel.classList.toggle('open', open);
    panel.inert = !open;
    viewer.inert = open;
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  }
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  panel.querySelectorAll('.mpanel-toggle').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('.mpanel-group');
    group.classList.toggle('open');
    button.setAttribute('aria-expanded', String(group.classList.contains('open')));
  }));
  document.addEventListener('keydown', event => {
    if (!panel.classList.contains('open')) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); toggle.focus(); }
    if (event.key === 'Tab') {
      const items = [...placeholder.querySelectorAll('a[href], button')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  new ResizeObserver(() => {
    const height = header.getBoundingClientRect().height;
    document.body.style.setProperty('--viewer-nav-height', `${height}px`);
    document.body.style.paddingTop = `${height}px`;
    if (getComputedStyle(toggle).display === 'none') setOpen(false);
  }).observe(header);
}
loadSiteMenu().catch(error => {
  console.error(error);
  const link = document.createElement('a'); link.href = english?'/':'/fr/'; link.textContent = english?'La Tortue — Home':'La Tortue — Accueil';
  placeholder.replaceChildren(link);
});
