const menuToggle = document.querySelector('#menu-toggle');
const siteNav = document.querySelector('#site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const heroVideo = document.querySelector('.hero-video');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('is-open', open);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

function syncMotionPreference(event) {
  if (!heroVideo) return;
  if (event.matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {});
  }
}

syncMotionPreference(reduceMotionQuery);
reduceMotionQuery.addEventListener?.('change', syncMotionPreference);
