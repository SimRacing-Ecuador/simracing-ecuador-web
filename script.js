const menuToggle = document.querySelector('#menu-toggle');
const siteNav = document.querySelector('#site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const heroVideo = document.querySelector('.hero-video');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionTargets = [
  ['main > section', 'section'],
  ['main > .event-band', 'panel'],
  ['.section-heading, .catalog-heading, .product-section-heading, .kit-intro, .moza-kit-heading', 'content'],
  ['.hero-copy, .hero-readout, .community-copy, .community-meta, .product-copy, .support-copy, .flight-copy, .catalog-hero-copy, .tripod-hero-copy, .r3-hero-copy', 'content'],
  ['figure, .product-art, .support-art, .flight-art, .catalog-hero-art, .tripod-hero-product, .tripod-video-frame, .r3-bundle-visual, .moza-power, .cockpit-visual', 'media'],
  ['.setup-choice, .tech-item, .spec-list li, .control-row, .cockpit-feature, .tripod-feature-card, .moza-kit-parts article, .accessories-preview article, .r3-component-card', 'item'],
  ['.about-stats, .community-panel, .catalog-close-inner, .tripod-compatibility, .r3-game-list, .r3-spec-block', 'panel'],
  ['footer', 'section'],
];

const motionElements = new Set();

motionTargets.forEach(([selector, type]) => {
  document.querySelectorAll(selector).forEach((element) => {
    if (!motionElements.has(element)) element.dataset.motion = type;
    motionElements.add(element);
  });
});

function setMotionDelays() {
  motionElements.forEach((element) => {
    const siblings = [...(element.parentElement?.children || [])]
      .filter((sibling) => motionElements.has(sibling));
    const siblingIndex = Math.max(0, siblings.indexOf(element));
    element.style.setProperty('--motion-delay', `${Math.min(siblingIndex, 3) * 70}ms`);
  });
}

function showMotionContent() {
  document.documentElement.classList.remove('motion-ready');
  motionElements.forEach((element) => element.classList.add('is-visible'));
}

function initScrollMotion() {
  if (!motionElements.size || reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
    showMotionContent();
    return null;
  }

  motionElements.forEach((element) => element.classList.remove('is-visible'));
  setMotionDelays();
  document.documentElement.classList.add('motion-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '-8% 0px -8% 0px' });

  motionElements.forEach((element) => observer.observe(element));
  return observer;
}

let motionObserver = initScrollMotion();

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
  if (heroVideo) {
    if (event.matches) {
      heroVideo.pause();
    } else {
      heroVideo.play().catch(() => {});
    }
  }

  if (event.matches) {
    motionObserver?.disconnect();
    motionObserver = null;
    showMotionContent();
  } else if (!motionObserver) {
    motionObserver = initScrollMotion();
  }
}

syncMotionPreference(reduceMotionQuery);
reduceMotionQuery.addEventListener?.('change', syncMotionPreference);
