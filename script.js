document.documentElement.classList.add('js-ready');

const menuToggle = document.querySelector('#menu-toggle');
const siteNav = document.querySelector('#site-nav');
const siteHeader = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link');
const heroVideo = document.querySelector('.hero-video');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileNavQuery = window.matchMedia('(max-width: 680px)');
const motionTargets = [
  ['main > section', 'section'],
  ['main > .event-band', 'panel'],
  ['.section-heading, .catalog-heading, .product-section-heading, .kit-intro, .moza-kit-heading', 'content'],
  ['.community-copy, .community-meta, .product-copy, .flight-copy, .catalog-hero-copy, .tripod-hero-copy, .r3-hero-copy', 'content'],
  ['figure, .product-art, .flight-art, .catalog-hero-art, .tripod-hero-product, .tripod-video-frame, .r3-bundle-visual, .moza-power, .cockpit-visual', 'media'],
  ['.setup-choice, .tech-item, .spec-list li, .control-row, .cockpit-feature, .tripod-feature-card, .moza-kit-parts article, .accessories-preview article, .r3-component-card', 'item'],
  ['.about-stats, .community-panel, .catalog-close-inner, .tripod-compatibility, .r3-game-list, .r3-spec-block', 'panel'],
  ['footer', 'section'],
];

const motionElements = new Set();
const structuralMotionTargets = document.querySelectorAll('main > section > .shell > *, main article, main figure, main li, footer > .shell > *');
const imageMotionTargets = [...document.querySelectorAll('img')]
  .filter((element) => !element.closest('.brand'));
imageMotionTargets.forEach((element, index) => {
  element.dataset.scrollImage = 'true';
  element.style.setProperty('--image-depth', `${0.42 + (index % 3) * 0.08}`);
});
const parallaxTargets = [...new Set([
  ...document.querySelectorAll('.hero-video, .hero-grid, .choice-media img, .flight-art img, .catalog-hero-art img, .product-art img, .tripod-hero-product img, .r3-bundle-visual img'),
  ...imageMotionTargets,
])];
const kineticTargets = document.querySelectorAll('.setup-choice, .tech-item, .control-row, .tripod-feature-card, .r3-component-card, .moza-kit-parts article, .accessories-preview article, .cockpit-feature, .community-panel');
const visibleParallaxTargets = new Set(parallaxTargets);
let parallaxVisibilityObserver = null;
let lastScrollY = window.scrollY;
let lastFrameY = window.scrollY;
let scrollFrame = 0;
let pageScrollRange = 0;

const deferredBackgroundDefinitions = [
  ['.about-stats', 'optimized/setup-garage-bg.png'],
  ['.tech-item', 'optimized/telemetry-tech-bg.png'],
  ['.community-panel', 'optimized/pitlane-community-bg.png'],
  ['.moza-kit-parts article', 'optimized/kit-components-bg.png'],
  ['.choice-media-accessories', 'optimized/accessories-track-bg.png'],
  ['.accessories-card-mods', 'optimized/accessories-mods-bg.png'],
  ['.accessories-card-track', 'optimized/accessories-track-bg.png'],
  ['.accessories-card-next', 'optimized/accessories-next-bg.png'],
];
const deferredBackgroundTargets = [];
const deferredBackgroundPromises = new Map();

deferredBackgroundDefinitions.forEach(([selector, source]) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.dataset.deferredBackground = source;
    deferredBackgroundTargets.push(element);
  });
});

function getDeferredBackground(source) {
  if (deferredBackgroundPromises.has(source)) return deferredBackgroundPromises.get(source);

  const image = new Image();
  image.decoding = 'async';
  image.src = source;
  const promise = typeof image.decode === 'function'
    ? image.decode().catch(() => undefined)
    : new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
  deferredBackgroundPromises.set(source, promise);
  return promise;
}

function loadDeferredBackground(element) {
  const source = element.dataset.deferredBackground;
  if (!source || element.dataset.backgroundLoaded === 'true') return;

  element.dataset.backgroundLoaded = 'loading';
  getDeferredBackground(source).then(() => {
    element.style.setProperty('--deferred-bg-image', `url("${source}")`);
    element.dataset.backgroundLoaded = 'true';
  });
}

function initDeferredBackgrounds() {
  if (!deferredBackgroundTargets.length) return;

  if (!('IntersectionObserver' in window)) {
    deferredBackgroundTargets.forEach(loadDeferredBackground);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadDeferredBackground(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '400px 0px' });

  deferredBackgroundTargets.forEach((element) => observer.observe(element));
}

motionTargets.forEach(([selector, type]) => {
  document.querySelectorAll(selector).forEach((element) => {
    if (!motionElements.has(element)) element.dataset.motion = type;
    motionElements.add(element);
  });
});

structuralMotionTargets.forEach((element) => {
  if (!motionElements.has(element)) element.dataset.motion = 'structure';
  motionElements.add(element);
});

kineticTargets.forEach((element) => element.dataset.kinetic = 'true');

function initParallaxVisibility() {
  if (!parallaxTargets.length || !('IntersectionObserver' in window)) return;

  parallaxVisibilityObserver?.disconnect();
  visibleParallaxTargets.clear();
  parallaxVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleParallaxTargets.add(entry.target);
      else visibleParallaxTargets.delete(entry.target);
    });
  }, { rootMargin: '240px 0px' });

  parallaxTargets.forEach((element) => parallaxVisibilityObserver.observe(element));
}

function loadHeroVideo() {
  if (!heroVideo || reduceMotionQuery.matches) return;

  const source = heroVideo.querySelector('source[data-src]');
  if (!source) {
    heroVideo.play().catch(() => {});
    return;
  }

  source.src = source.dataset.src;
  source.removeAttribute('data-src');
  heroVideo.load();
  heroVideo.play().catch(() => {});
}

function scheduleHeroVideoLoad() {
  if (!heroVideo || reduceMotionQuery.matches || heroVideo.dataset.loadScheduled === 'true') return;
  heroVideo.dataset.loadScheduled = 'true';

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadHeroVideo, { timeout: 1800 });
  } else {
    window.setTimeout(loadHeroVideo, 1200);
  }
}

if (!reduceMotionQuery.matches) initParallaxVisibility();

function setMotionDelays() {
  let heroDelayIndex = 0;

  motionElements.forEach((element) => {
    const siblings = [...(element.parentElement?.children || [])]
      .filter((sibling) => motionElements.has(sibling));
    const siblingIndex = Math.max(0, siblings.indexOf(element));
    const delay = element.dataset.motion === 'hero'
      ? Math.min(heroDelayIndex++, 5) * 110
      : Math.min(siblingIndex, 3) * 70;
    element.style.setProperty('--motion-delay', `${delay}ms`);
  });
}

function updateScrollEffects() {
  const currentScrollY = window.scrollY;
  const scrollVelocity = Math.max(-32, Math.min(32, currentScrollY - lastFrameY));
  const nextScrollDirection = currentScrollY >= lastScrollY ? 'down' : 'up';
  const nextHeaderScrolled = currentScrollY > 28;
  const progress = pageScrollRange > 0 ? (currentScrollY / pageScrollRange) * 100 : 0;
  const parallaxUpdates = [];

  // Read all geometry before changing styles so scrolling does not force a layout
  // between each measurement and paint.
  if (!reduceMotionQuery.matches) {
    const viewportCenter = window.innerHeight / 2;
    visibleParallaxTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const distance = (viewportCenter - (rect.top + rect.height / 2)) * 0.055;
      const offset = Math.max(-52, Math.min(52, distance));
      parallaxUpdates.push([element, `${offset.toFixed(2)}px`]);
    });
  }

  if (Math.abs(currentScrollY - lastScrollY) > 1) {
    if (document.documentElement.dataset.scrollDirection !== nextScrollDirection) {
      document.documentElement.dataset.scrollDirection = nextScrollDirection;
    }
    lastScrollY = currentScrollY;
  }
  lastFrameY = currentScrollY;
  const headerChanged = siteHeader && siteHeader.classList.contains('is-scrolled') !== nextHeaderScrolled;
  if (headerChanged) siteHeader.classList.toggle('is-scrolled', nextHeaderScrolled);
  document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
  document.documentElement.style.setProperty('--scroll-velocity', `${scrollVelocity.toFixed(2)}px`);
  document.documentElement.style.setProperty('--scroll-skew', `${(-scrollVelocity * 0.08).toFixed(2)}deg`);
  document.documentElement.style.setProperty('--scroll-tilt', `${(scrollVelocity * 0.14).toFixed(2)}deg`);

  parallaxUpdates.forEach(([element, offset]) => element.style.setProperty('--scroll-parallax', offset));

  if (headerChanged) pageScrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  scrollFrame = 0;
}

function requestScrollEffects() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollEffects);
}

document.documentElement.dataset.scrollDirection = 'down';
window.addEventListener('scroll', requestScrollEffects, { passive: true });
function refreshScrollMetrics() {
  pageScrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  requestScrollEffects();
}

window.addEventListener('resize', refreshScrollMetrics, { passive: true });
window.addEventListener('orientationchange', refreshScrollMetrics, { passive: true });
refreshScrollMetrics();
requestScrollEffects();

function showMotionContent() {
  document.documentElement.classList.remove('motion-ready');
  motionElements.forEach((element) => {
    element.classList.remove('motion-pending');
    element.classList.add('is-visible');
  });
}

function revealMotionElement(element) {
  element.classList.add('motion-pending', 'is-visible');
  window.setTimeout(() => element.classList.remove('motion-pending'), 1400);
}

function toggleMotionVisibility(element, visible) {
  if (!visible) return;
  revealMotionElement(element);
  let parent = element.parentElement;
  while (parent) {
    if (motionElements.has(parent)) revealMotionElement(parent);
    parent = parent.parentElement;
  }
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
      if (!entry.isIntersecting) return;
      toggleMotionVisibility(entry.target, true);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '-8% 0px -8% 0px' });

  motionElements.forEach((element) => observer.observe(element));

  requestAnimationFrame(() => {
    const hero = document.querySelector('.hero');
    const heroIsVisible = hero && hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < window.innerHeight;
    if (!heroIsVisible) return;
    revealMotionElement(hero);
    hero.querySelectorAll('[data-motion="hero"]').forEach(revealMotionElement);
  });

  return observer;
}

let motionObserver = initScrollMotion();
initDeferredBackgrounds();

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.setAttribute('aria-hidden', String(mobileNavQuery.matches && !open));
  siteNav.classList.toggle('is-open', open);
}

if (siteNav) siteNav.setAttribute('aria-hidden', String(mobileNavQuery.matches));

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

mobileNavQuery.addEventListener?.('change', () => setMenu(false));

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
    document.documentElement.style.setProperty('--scroll-velocity', '0px');
    document.documentElement.style.setProperty('--scroll-skew', '0deg');
    document.documentElement.style.setProperty('--scroll-tilt', '0deg');
    parallaxTargets.forEach((element) => element.style.setProperty('--scroll-parallax', '0px'));
    parallaxVisibilityObserver?.disconnect();
    parallaxVisibilityObserver = null;
    showMotionContent();
  } else if (!motionObserver) {
    initParallaxVisibility();
    requestScrollEffects();
    motionObserver = initScrollMotion();
    scheduleHeroVideoLoad();
  }
}

syncMotionPreference(reduceMotionQuery);
reduceMotionQuery.addEventListener?.('change', syncMotionPreference);
scheduleHeroVideoLoad();
