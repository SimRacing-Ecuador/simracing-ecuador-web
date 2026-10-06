/* Runs before first paint: flags JS + motion so the hero can be choreographed without a flash. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  root.classList.add('motion-pending');

  if (root.getAttribute('data-page') === 'home' && !window.location.hash) {
    try {
      if (window.sessionStorage.getItem('sre-intro') !== '1') root.classList.add('intro-pending');
    } catch (error) {
      /* Storage blocked: skip the intro rather than replaying it on every load. */
    }
  }

  // Failsafe: if the motion engine never boots, reveal everything.
  window.setTimeout(function () {
    if (!root.classList.contains('motion-ready')) {
      root.classList.remove('motion-pending', 'intro-pending');
    }
  }, 4500);
})();
