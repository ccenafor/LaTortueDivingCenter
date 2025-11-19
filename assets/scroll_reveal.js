(function(){
  const sections=document.querySelectorAll('.scroll-reveal');
  if(!sections.length)return;
  document.body.classList.add('reveal-ready');
  const supportsMatchMedia=typeof window.matchMedia==='function';
  const prefersReducedMotion=supportsMatchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealImmediately=prefersReducedMotion||!('IntersectionObserver'in window);
  sections.forEach(section=>{
    const items=section.querySelectorAll('[data-reveal]');
    items.forEach((el,index)=>{
      el.style.setProperty('--reveal-delay',`${index*80}ms`);
    });
  });
  if(revealImmediately){
    sections.forEach(section=>section.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -5% 0px'});
  sections.forEach(section=>observer.observe(section));
})();
