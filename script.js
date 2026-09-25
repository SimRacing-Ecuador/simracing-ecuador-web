const root = document.documentElement;
root.classList.add('js-ready');

const menuToggle = document.querySelector('#menu-toggle');
const siteNav = document.querySelector('#site-nav');
const siteHeader = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link');
const heroVideo = document.querySelector('.hero-video');
const homeHero = document.querySelector('.hero');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileNavQuery = window.matchMedia('(max-width: 680px)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const motionAllowed = () => !reduceMotionQuery.matches;

/* ---------------------------------------------------------------------------
   Deferred section backgrounds: keep below-fold artwork out of first paint
--------------------------------------------------------------------------- */

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

function createElement(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

/* ---------------------------------------------------------------------------
   Navigation
--------------------------------------------------------------------------- */

let menuOpen = false;

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuOpen = open;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.setAttribute('aria-hidden', String(mobileNavQuery.matches && !open));
  siteNav.classList.toggle('is-open', open);
  siteHeader?.classList.toggle('menu-open', open);
  if (open) siteHeader?.classList.remove('is-hidden');
}

if (siteNav) siteNav.setAttribute('aria-hidden', String(mobileNavQuery.matches));

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
mobileNavQuery.addEventListener?.('change', () => setMenu(false));

/* ---------------------------------------------------------------------------
   Hero video: load after first paint, never under reduced motion
--------------------------------------------------------------------------- */

function loadHeroVideo() {
  if (!heroVideo || !motionAllowed()) return;
  const source = heroVideo.querySelector('source[data-src]');
  if (source) {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
    heroVideo.load();
  }
  heroVideo.play().catch(() => {});
}

function scheduleHeroVideoLoad() {
  if (!heroVideo || !motionAllowed() || heroVideo.dataset.loadScheduled === 'true') return;
  heroVideo.dataset.loadScheduled = 'true';
  if ('requestIdleCallback' in window) window.requestIdleCallback(loadHeroVideo, { timeout: 1800 });
  else window.setTimeout(loadHeroVideo, 1200);
}

/* ---------------------------------------------------------------------------
   Intro: race start lights (home page, once per session)
--------------------------------------------------------------------------- */

let introDone = Promise.resolve();

function playIntro() {
  if (!homeHero || !motionAllowed()) return;

  let seen = false;
  try {
    seen = window.sessionStorage.getItem('sre-intro') === '1';
    window.sessionStorage.setItem('sre-intro', '1');
  } catch (error) {
    seen = false;
  }
  if (seen) return;

  const intro = createElement('div', 'intro-lights');
  intro.setAttribute('aria-hidden', 'true');
  const rig = createElement('div', 'intro-rig');
  for (let index = 0; index < 5; index += 1) {
    const light = createElement('span', 'intro-light');
    light.append(createElement('i'), createElement('i'));
    rig.append(light);
  }
  intro.append(rig);

  root.classList.add('intro-playing');
  document.body.append(intro);

  introDone = new Promise((resolve) => {
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      root.classList.remove('intro-playing');
      resolve();
    };
    const remove = () => {
      release();
      intro.remove();
    };
    window.setTimeout(release, 1500);
    window.setTimeout(remove, 3200);
    intro.addEventListener('animationend', (event) => {
      if (event.target === intro) remove();
    });
    intro.addEventListener('click', () => {
      intro.classList.add('is-skipped');
      window.setTimeout(remove, 380);
      release();
    });
  });
}

/* ---------------------------------------------------------------------------
   Split headings into masked words
--------------------------------------------------------------------------- */

function splitWords(element) {
  if (element.dataset.split === 'true') return;
  element.dataset.split = 'true';
  let index = 0;

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent.trim()) return;
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (!part.trim()) {
            fragment.append(document.createTextNode(part));
            return;
          }
          const word = document.createElement('span');
          const inner = document.createElement('span');
          word.className = 'split-word';
          inner.className = 'split-inner';
          inner.textContent = part;
          inner.style.setProperty('--wi', String(index++));
          word.append(inner);
          fragment.append(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };

  walk(element);
  element.classList.add('split-heading');
}

/* ---------------------------------------------------------------------------
   Reveal choreography
--------------------------------------------------------------------------- */

const revealGroups = [
  ['media', '.product-art, .flight-art, .catalog-hero-art, .cockpit-visual, .tripod-hero-product, .chair-hero-product, .r3-bundle-visual, .moza-power, .tripod-video-frame, .chair-gallery-grid figure, .chair-dimensions figure, .r3-game-list'],
  ['item', '.setup-choice, .tech-item, .about-stats > div, .control-row, .cockpit-feature, .kit-offer, .tripod-feature-card, .chair-feature-card, .r3-component-card, .moza-kit-parts article, .accessories-preview article, .r3-spec-block'],
  ['row', 'main tbody tr, .r3-game-columns li, .spec-list li'],
  ['up', [
    '.section-heading p', '.catalog-heading p', '.kit-intro p', '.section-tag', '.lead-copy', '.about-copy .text-link',
    '.product-copy-actions', '.flight-copy p', '.flight-copy .text-link', '.community-copy p', '.community-copy .button',
    '.community-sequence', '.catalog-route', '.catalog-hero-copy > p', '.catalog-jump', '.catalog-close p',
    '.catalog-close a', '.catalog-hero-index', '.product-section-heading .product-code', '.product-code:not(.control-row .product-code):not(.cockpit-feature .product-code):not(article .product-code)',
    '.tripod-hero-copy > :not(h1)', '.chair-hero-copy > :not(h1)', '.r3-hero-copy > :not(h1)', '.moza-hero-grid > div:first-child > :not(h1)',
    '.tripod-intro-grid > p', '.chair-intro-grid > p', '.r3-intro-grid > div', '.moza-spec-grid > div > p', '.moza-kit-heading > p',
    '.tripod-specs-title > p', '.chair-specs-title > p', '.r3-spec-heading > p', '.r3-compatibility p', '.moza-close .button', '.tripod-close .button',
    '.chair-close .button', '.tripod-compatibility', '.chair-compatibility', '.chair-dimensions p',
    '.footer-grid > *', '.footer-bottom',
  ].join(', ')],
];

const revealElements = new Set();
const splitHeadings = [...document.querySelectorAll('main h1, main h2, .choice-title')];

function prepareReveals() {
  revealGroups.forEach(([type, selector]) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.dataset.reveal || element.closest('.hero') || element.matches('h1, h2')) return;
      element.dataset.reveal = type;
      revealElements.add(element);
    });
  });

  revealElements.forEach((element) => {
    const siblings = [...(element.parentElement?.children || [])].filter((sibling) => revealElements.has(sibling));
    const index = Math.max(0, siblings.indexOf(element));
    const step = element.dataset.reveal === 'row' ? 45 : 95;
    element.style.setProperty('--rd', `${Math.min(index, 8) * step}ms`);
  });
}

let revealObserver = null;
// Fully clipped media reports as non-intersecting to IntersectionObserver, so wipes are checked by position.
const pendingMedia = new Set();

function revealNow(element) {
  element.classList.add('is-in');
}

function checkPendingMedia() {
  if (!pendingMedia.size) return;
  const limit = window.innerHeight * 0.9;
  pendingMedia.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < limit && rect.bottom > 0) {
      pendingMedia.delete(element);
      revealNow(element);
    }
  });
}

function initReveals() {
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(revealNow);
    splitHeadings.forEach(revealNow);
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      revealObserver.unobserve(target);
      if (target.closest('.hero')) introDone.then(() => revealNow(target));
      else revealNow(target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  revealElements.forEach((element) => {
    if (element.dataset.reveal === 'media') pendingMedia.add(element);
    else revealObserver.observe(element);
  });
  splitHeadings.forEach((element) => revealObserver.observe(element));
  checkPendingMedia();
}

/* ---------------------------------------------------------------------------
   Decorative injections: progress bar and card glare
--------------------------------------------------------------------------- */

const progressBar = createElement('div', 'scroll-progress');
const progressFill = createElement('span');
progressBar.setAttribute('aria-hidden', 'true');
progressBar.append(progressFill);
document.body.prepend(progressBar);

const tiltSelector = '.setup-choice, .tech-item, .kit-offer, .tripod-feature-card, .chair-feature-card, .r3-component-card, .moza-kit-parts article, .accessories-preview article, .about-stats';
const tiltCards = [...document.querySelectorAll(tiltSelector)];
tiltCards.forEach((card) => {
  card.dataset.tilt = 'true';
  const glare = createElement('span', 'card-glare');
  glare.setAttribute('aria-hidden', 'true');
  card.append(glare);
});

/* ---------------------------------------------------------------------------
   Scroll engine: per-element progress variables + velocity
--------------------------------------------------------------------------- */

const scrubSelector = [
  '.hero', '.catalog-hero', '.tripod-hero', '.chair-hero', '.r3-product-hero', '.moza-hero',
  '.community-panel', '.bg-word-host', '.site-footer', '.choice-media', '.product-art', '.flight-art',
  '.catalog-hero-art', '.cockpit-visual', '.tripod-hero-product', '.chair-hero-product', '.r3-bundle-visual',
  '.moza-power', '.chair-gallery-grid figure', '.tripod-feature-card figure', '.chair-feature-card figure', '.r3-component-card figure',
].join(', ');

const scrubElements = [...document.querySelectorAll(scrubSelector)];
document.querySelectorAll([
  '.choice-media img', '.flight-art img', '.catalog-hero-art img', '.cockpit-visual img', '.tripod-hero-product img',
  '.chair-hero-product img', '.r3-bundle-visual img', '.chair-gallery-grid img', '.tripod-feature-card figure img',
  '.chair-feature-card figure img', '.r3-component-card figure img', '.chair-dimensions img',
].join(', ')).forEach((image) => {
  image.dataset.scrollImg = 'true';
});
const visibleScrub = new Set();
const scrubCache = new WeakMap();
let scrubObserver = null;

function setVar(element, name, value) {
  let cache = scrubCache.get(element);
  if (!cache) {
    cache = {};
    scrubCache.set(element, cache);
  }
  const rounded = Math.round(value * 1000) / 1000;
  if (cache[name] === rounded) return;
  cache[name] = rounded;
  element.style.setProperty(name, String(rounded));
}

function initScrubVisibility() {
  if (!('IntersectionObserver' in window)) {
    scrubElements.forEach((element) => visibleScrub.add(element));
    return;
  }
  scrubObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleScrub.add(entry.target);
      else visibleScrub.delete(entry.target);
    });
    requestTick();
  }, { rootMargin: '25% 0px' });
  scrubElements.forEach((element) => scrubObserver.observe(element));

}

let frame = 0;
let lastTime = 0;
let lastScrollY = window.scrollY;
let lastDirectionY = window.scrollY;
let scrollDirection = 1;
let velocity = 0;
let lastScrollEvent = 0;
let maxScrollRange = 1;
const heroPointer = { x: 0, y: 0, tx: 0, ty: 0 };

function refreshScrollRange() {
  maxScrollRange = Math.max(1, root.scrollHeight - window.innerHeight);
}

function updateChrome(scrollY) {
  progressFill.style.transform = `scaleX(${clamp(scrollY / maxScrollRange, 0, 1).toFixed(4)})`;

  if (!siteHeader) return;
  siteHeader.classList.toggle('is-stuck', scrollY > 120);
  if (Math.abs(scrollY - lastDirectionY) > 6) {
    const goingDown = scrollY > lastDirectionY;
    siteHeader.classList.toggle('is-hidden', goingDown && scrollY > 420 && !menuOpen);
    lastDirectionY = scrollY;
  }
}

function updateScrub() {
  const viewport = window.innerHeight;
  const measurements = [];
  visibleScrub.forEach((element) => measurements.push([element, element.getBoundingClientRect()]));
  measurements.forEach(([element, rect]) => {
    const height = Math.max(rect.height, 1);
    setVar(element, '--pe', clamp((viewport - rect.top) / viewport, 0, 1));
    setVar(element, '--pv', clamp((viewport - rect.top) / Math.min(height, viewport), 0, 1));
    setVar(element, '--px', clamp(-rect.top / height, 0, 1));
    setVar(element, '--pc', clamp((rect.top + height / 2 - viewport / 2) / (viewport / 2 + height / 2), -1, 1));
  });
}

function tick(time) {
  frame = 0;
  const delta = lastTime ? clamp((time - lastTime) / 16.667, 0.2, 3) : 1;
  lastTime = time;

  const scrollY = window.scrollY;
  const rawVelocity = scrollY - lastScrollY;
  if (Math.abs(rawVelocity) > 0.5) scrollDirection = rawVelocity > 0 ? 1 : -1;
  lastScrollY = scrollY;
  velocity = lerp(velocity, rawVelocity, 0.2);
  if (Math.abs(velocity) < 0.01) velocity = 0;

  updateChrome(scrollY);

  if (motionAllowed()) {
    root.style.setProperty('--vel-abs', Math.min(Math.abs(velocity), 60).toFixed(2));
    checkPendingMedia();
    updateScrub();
    if (homeHero) {
      heroPointer.x = lerp(heroPointer.x, heroPointer.tx, 0.08);
      heroPointer.y = lerp(heroPointer.y, heroPointer.ty, 0.08);
      homeHero.style.setProperty('--hx', heroPointer.x.toFixed(3));
      homeHero.style.setProperty('--hy', heroPointer.y.toFixed(3));
    }
  }

  const heroSettling = Math.abs(heroPointer.x - heroPointer.tx) > 0.002 || Math.abs(heroPointer.y - heroPointer.ty) > 0.002;
  const scrolling = time - lastScrollEvent < 180 || Math.abs(velocity) > 0.05;
  if (scrolling || heroSettling) requestTick();
  else lastTime = 0;
}

function requestTick() {
  if (!frame) frame = window.requestAnimationFrame(tick);
}

window.addEventListener('scroll', () => {
  lastScrollEvent = performance.now();
  requestTick();
}, { passive: true });

let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    buildMarquees();
    refreshScrollRange();
    checkPendingMedia();
    requestTick();
  }, 150);
});

/* ---------------------------------------------------------------------------
   Pointer: 3D tilt with glare, magnetic buttons, hero depth
--------------------------------------------------------------------------- */

function bindPointerEffects() {
  tiltCards.forEach((card) => {
    let rect = null;
    card.addEventListener('pointerenter', () => {
      if (!finePointerQuery.matches || !motionAllowed()) return;
      rect = card.getBoundingClientRect();
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointermove', (event) => {
      if (!rect) return;
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const strength = card.matches('.about-stats') ? 3 : 7;
      card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      card.style.setProperty('--rx', `${((0.5 - y) * strength).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${((x - 0.5) * strength * 1.3).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      rect = null;
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  document.querySelectorAll('.button, .social-chip, .catalog-jump, .choice-arrow').forEach((element) => {
    const target = element.matches('.choice-arrow') ? element.closest('.setup-choice') : element;
    if (!target) return;
    target.addEventListener('pointermove', (event) => {
      if (!finePointerQuery.matches || !motionAllowed()) return;
      const rect = element.getBoundingClientRect();
      const pull = element.matches('.choice-arrow') ? 0.18 : 0.28;
      const dx = (event.clientX - (rect.left + rect.width / 2)) * pull;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * pull;
      element.style.setProperty('--mgx', `${clamp(dx, -14, 14).toFixed(1)}px`);
      element.style.setProperty('--mgy', `${clamp(dy, -10, 10).toFixed(1)}px`);
      element.classList.add('is-magnetic');
    });
    target.addEventListener('pointerleave', () => {
      element.style.setProperty('--mgx', '0px');
      element.style.setProperty('--mgy', '0px');
      element.classList.remove('is-magnetic');
    });
  });

  homeHero?.addEventListener('pointermove', (event) => {
    if (!finePointerQuery.matches || !motionAllowed()) return;
    const rect = homeHero.getBoundingClientRect();
    heroPointer.tx = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
    heroPointer.ty = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
    requestTick();
  });
  homeHero?.addEventListener('pointerleave', () => {
    heroPointer.tx = 0;
    heroPointer.ty = 0;
    requestTick();
  });
}

/* ---------------------------------------------------------------------------
   Boot + reduced-motion handling
--------------------------------------------------------------------------- */

function showEverything() {
  revealElements.forEach(revealNow);
  splitHeadings.forEach(revealNow);
}

function enableMotion() {
  root.classList.add('motion-ready');
  initReveals();
  initScrubVisibility();
  scheduleHeroVideoLoad();
  requestTick();
}

function disableMotion() {
  revealObserver?.disconnect();
  scrubObserver?.disconnect();
  heroVideo?.pause();
  showEverything();
  root.classList.remove('motion-ready');
}

splitHeadings.forEach(splitWords);
prepareReveals();
refreshScrollRange();
bindPointerEffects();
initDeferredBackgrounds();

if (motionAllowed() && 'IntersectionObserver' in window) {
  playIntro();
  enableMotion();
} else {
  showEverything();
  updateChrome(window.scrollY);
}

reduceMotionQuery.addEventListener?.('change', (event) => {
  if (event.matches) disableMotion();
  else {
    root.classList.add('motion-ready');
    scheduleHeroVideoLoad();
    heroVideo?.play().catch(() => {});
    initScrubVisibility();
    requestTick();
  }
});
