(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider, { once: true });
  } else {
    initSlider();
  }

  function initSlider() {
    var slider = document.querySelector('.slides');
    var dots = Array.from(document.querySelectorAll('.dot'));
    if (!slider) return;

    var idx = 0;
    var total = slider.children.length || dots.length || 4;
    var timer;

    function render() {
      slider.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function(dot, i) { dot.classList.toggle('active', i === idx); });
    }

    function schedule(delay) {
      clearTimeout(timer);
      timer = setTimeout(function next() { idx = (idx + 1) % total; render(); schedule(6000); }, delay || 6000);
    }

    function go(step, pause) {
      idx = (idx + step + total) % total;
      render();
      schedule(pause || 6000);
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { idx = i; render(); schedule(5000); });
    });
    var prev = document.querySelector('.prev');
    var next = document.querySelector('.next');
    if (prev) prev.addEventListener('click', function() { go(-1, 5000); });
    if (next) next.addEventListener('click', function() { go(1, 5000); });

    render();
    schedule(6000);
  }
})();
