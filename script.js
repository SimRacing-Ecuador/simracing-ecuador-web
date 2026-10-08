/* Sim Racing Ecuador — interaction layer + GSAP ScrollTrigger scrollytelling.
   Progressive: navigation works without GSAP; all choreography is skipped under
   prefers-reduced-motion, leaving a calm, fully visible page. */
(() => {
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const pad = (value, length) => String(Math.round(value)).padStart(length, '0');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const mobileNav = window.matchMedia('(max-width: 960px)');
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGsap && !reduceMotion.matches;
  const isHome = root.dataset.page === 'home';

  const header = $('[data-header]');
  const menuToggle = $('#menu-toggle');
  const nav = $('#site-nav');
  const progressFill = $('.scroll-progress span');
  let lenis = null;
  let menuOpen = false;

  function createElement(tag, className = '', text = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  /* ------------------------------------------------------------------------
     Navigation
  ------------------------------------------------------------------------ */
  function setMenu(open, { restoreFocus = false } = {}) {
    if (!menuToggle || !nav) return;
    menuOpen = open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-toggle-label').textContent = open ? 'Cerrar' : 'Menú';
    nav.classList.toggle('is-open', open);
    header?.classList.toggle('menu-open', open);
    root.classList.toggle('menu-locked', open);
    if (open) {
      header?.classList.remove('is-hidden');
      lenis?.stop();
      window.setTimeout(() => nav.querySelector('a')?.focus({ preventScroll: true }), 120);
    } else {
      lenis?.start();
      if (restoreFocus) menuToggle.focus({ preventScroll: true });
    }
  }

  menuToggle?.addEventListener('click', () => setMenu(!menuOpen));
  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false, { restoreFocus: true });
  });
  mobileNav.addEventListener?.('change', () => setMenu(false));

  /* ------------------------------------------------------------------------
     Header chrome: solid / hidden / light-on-light + reading progress
  ------------------------------------------------------------------------ */
  const surfaces = $$('main > section, .site-footer');
  surfaces.forEach((surface) => {
    const match = getComputedStyle(surface).backgroundColor.match(/[\d.]+/g);
    if (!match) return;
    const [r, g, b] = match.map(Number);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    surface.dataset.surface = luminance > 0.55 ? 'light' : 'dark';
  });

  let lastY = window.scrollY;
  let chromeFrame = 0;

  function updateChrome() {
    chromeFrame = 0;
    const y = window.scrollY;
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    if (progressFill) progressFill.style.transform = `scaleX(${clamp(y / max, 0, 1).toFixed(4)})`;
    if (!header) return;

    header.classList.toggle('is-solid', y > 24);
    if (Math.abs(y - lastY) > 4) {
      header.classList.toggle('is-hidden', y > lastY && y > 320 && !menuOpen);
      lastY = y;
    }

    const probe = (header.offsetHeight || 70) / 2;
    let light = false;
    for (const surface of surfaces) {
      const rect = surface.getBoundingClientRect();
      if (rect.top <= probe && rect.bottom > probe) {
        light = surface.dataset.surface === 'light';
        break;
      }
    }
    header.classList.toggle('is-light', light && !menuOpen);
  }

  const requestChrome = () => {
    if (!chromeFrame) chromeFrame = window.requestAnimationFrame(updateChrome);
  };
  window.addEventListener('scroll', requestChrome, { passive: true });
  window.addEventListener('resize', requestChrome);
  updateChrome();

  /* ------------------------------------------------------------------------
     Deferred card artwork (inner pages)
  ------------------------------------------------------------------------ */
  const deferredBackgrounds = [
    ['.moza-kit-parts article', 'optimized/kit-components-bg.webp'],
    ['.accessories-card-mods', 'optimized/accessories-mods-bg.webp'],
    ['.accessories-card-track', 'optimized/accessories-track-bg.webp'],
    ['.accessories-card-next', 'optimized/accessories-next-bg.webp'],
  ];
  const deferredTargets = [];
  deferredBackgrounds.forEach(([selector, source]) => {
    $$(selector).forEach((element) => {
      element.dataset.deferredBackground = source;
      deferredTargets.push(element);
    });
  });
  const applyBackground = (element) => {
    const source = element.dataset.deferredBackground;
    const image = new Image();
    image.decoding = 'async';
    image.src = source;
    image.decode().catch(() => undefined).then(() => {
      element.style.setProperty('--deferred-bg-image', `url("${source}")`);
    });
  };
  if (deferredTargets.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          applyBackground(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '600px 0px' });
      deferredTargets.forEach((element) => observer.observe(element));
    } else {
      deferredTargets.forEach(applyBackground);
    }
  }

  /* ------------------------------------------------------------------------
     Static fallback: no GSAP or reduced motion
  ------------------------------------------------------------------------ */
  if (!motion) {
    root.classList.remove('motion-pending', 'intro-pending');
    $('.intro')?.remove();
    reduceMotion.addEventListener?.('change', () => window.location.reload());
    return;
  }

  /* ========================================================================
     Motion engine
  ======================================================================== */
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: 'expo.out', duration: 1.2 });
  root.classList.add('motion-ready');
  reduceMotion.addEventListener?.('change', () => window.location.reload());

  if (typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Smooth in-page anchors (also for index.html#... links while on the home page).
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const url = new URL(link.href, window.location.href);
    const samePage = (path) => path.replace(/index\.html$/, '');
    if (samePage(url.pathname) !== samePage(window.location.pathname) || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else target.scrollIntoView({ behavior: 'smooth' });
    if (link.classList.contains('skip-link') || target.id === 'contenido') {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    history.replaceState(null, '', url.hash);
  });

  /* ------------------------------------------------------------------------
     Text splitting (DOM-only, keeps accessible text intact)
  ------------------------------------------------------------------------ */
  function splitLines(element) {
    if (element.dataset.split) return $$('.split-line-inner', element);
    element.dataset.split = 'lines';
    const groups = [[]];
    [...element.childNodes].forEach((node) => {
      if (node.nodeName === 'BR') {
        groups.push([]);
        node.remove();
      } else {
        groups[groups.length - 1].push(node);
      }
    });
    const inners = [];
    groups.filter((group) => group.some((node) => node.textContent.trim())).forEach((group, index, all) => {
      const line = createElement('span', 'split-line');
      const inner = createElement('span', 'split-line-inner');
      group.forEach((node) => inner.append(node));
      if (index < all.length - 1) inner.append(document.createTextNode(' '));
      line.append(inner);
      element.append(line);
      inners.push(inner);
    });
    return inners;
  }

  function splitWords(element) {
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (!part.trim()) {
              fragment.append(document.createTextNode(part));
              return;
            }
            const word = createElement('span', 'word', part);
            words.push(word);
            fragment.append(word);
          });
          child.replaceWith(fragment);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    };
    walk(element);
    return words;
  }

  function splitChars(element) {
    const chars = [];
    const text = element.textContent;
    element.textContent = '';
    element.setAttribute('aria-label', text);
    [...text].forEach((character) => {
      if (character === ' ') {
        element.append(document.createTextNode(' '));
        return;
      }
      const char = createElement('span', 'char', character);
      char.setAttribute('aria-hidden', 'true');
      chars.push(char);
      element.append(char);
    });
    return chars;
  }

  /* ------------------------------------------------------------------------
     Number helpers: count-ups that land exactly on the original text
  ------------------------------------------------------------------------ */
  function parseFigure(text) {
    const match = text.match(/(\d[\d.,]*)/);
    if (!match) return null;
    const raw = match[1];
    const decimalComma = /,\d{1,2}$/.test(raw);
    const thousandsDot = /\.\d{3}(?!\d)/.test(raw) && !decimalComma;
    const value = Number(raw.replace(thousandsDot ? /\./g : /(?!)/g, '').replace(',', '.'));
    const decimals = decimalComma ? raw.split(',')[1].length : 0;
    return { prefix: text.slice(0, match.index), suffix: text.slice(match.index + raw.length), value, decimals, thousandsDot };
  }

  function formatFigure(figure, value) {
    let body = value.toFixed(figure.decimals);
    if (figure.decimals) body = body.replace('.', ',');
    if (figure.thousandsDot) body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${figure.prefix}${body}${figure.suffix}`;
  }

  function countUp(element, { scrollTrigger, delay = 0, duration = 1.8 } = {}) {
    const figure = parseFigure(element.textContent);
    if (!figure || !figure.value) return;
    const original = element.textContent;
    const state = { value: 0 };
    element.textContent = formatFigure(figure, 0);
    gsap.to(state, {
      value: figure.value,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger,
      onUpdate: () => { element.textContent = formatFigure(figure, state.value); },
      onComplete: () => { element.textContent = original; },
    });
  }

  /* ------------------------------------------------------------------------
     Cursor + magnetic buttons (fine pointers)
  ------------------------------------------------------------------------ */
  function initPointer() {
    if (!finePointer.matches) return;

    const cursor = createElement('div', 'cursor');
    const ring = createElement('div', 'cursor-ring');
    const label = createElement('span', 'cursor-label');
    cursor.setAttribute('aria-hidden', 'true');
    ring.append(label);
    cursor.append(ring);
    document.body.append(cursor);

    const xSet = gsap.quickSetter(cursor, 'x', 'px');
    const ySet = gsap.quickSetter(cursor, 'y', 'px');
    window.addEventListener('pointermove', (event) => {
      xSet(event.clientX);
      ySet(event.clientY);
      cursor.classList.add('is-visible');
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('pointerover', (event) => {
      const target = event.target.closest('a, button, [data-cursor]');
      const labelled = target?.closest('[data-cursor]');
      cursor.classList.toggle('is-link', Boolean(target) && !labelled);
      cursor.classList.toggle('has-label', Boolean(labelled));
      label.textContent = labelled ? labelled.dataset.cursor : '';
      cursor.classList.toggle('is-light', Boolean(event.target.closest('[data-surface="light"]')));
    });

    $$('.button').forEach((button) => {
      const bx = gsap.quickTo(button, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
      const by = gsap.quickTo(button, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        bx(clamp((event.clientX - rect.left - rect.width / 2) * 0.22, -12, 12));
        by(clamp((event.clientY - rect.top - rect.height / 2) * 0.3, -8, 8));
      });
      button.addEventListener('pointerleave', () => { bx(0); by(0); });
    });
  }

  /* ------------------------------------------------------------------------
     Home · intro (race start lights, once per session)
  ------------------------------------------------------------------------ */
  function playIntro() {
    const intro = $('.intro');
    if (!intro || !root.classList.contains('intro-pending')) {
      intro?.remove();
      root.classList.remove('intro-pending');
      return Promise.resolve();
    }
    try { window.sessionStorage.setItem('sre-intro', '1'); } catch (error) { /* ignore */ }
    lenis?.stop();

    const lights = $$('.intro-light', intro);
    const status = $('.intro-status-text', intro);

    return new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        intro.remove();
        root.classList.remove('intro-pending');
        lenis?.start();
      };
      const tl = gsap.timeline({ onComplete: finish });
      tl.from('.intro-rig', { y: -36, autoAlpha: 0, duration: 0.8 })
        .from('.intro-kicker, .intro-status', { y: 12, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.1)
        .to('.intro-flag', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0);
      lights.forEach((light, index) => tl.call(() => light.classList.add('is-on'), null, 0.5 + index * 0.32));
      const out = 0.5 + lights.length * 0.32 + 0.35;
      tl.call(() => {
        lights.forEach((light) => light.classList.remove('is-on'));
        if (status) status.textContent = '¡Luces fuera!';
      }, null, out);
      tl.to(intro, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, out + 0.3);
      tl.call(resolve, null, out + 0.65);
      const skip = () => {
        tl.timeScale(4);
        window.removeEventListener('keydown', skip);
      };
      intro.addEventListener('click', skip, { once: true });
      window.addEventListener('keydown', skip);
    });
  }

  /* ------------------------------------------------------------------------
     Home · hero entrance
  ------------------------------------------------------------------------ */
  function heroEntrance() {
    const tl = gsap.timeline();
    tl.fromTo('.hero-title .line-inner', { yPercent: 112 }, { yPercent: 0, duration: 1.5, stagger: 0.11 }, 0)
      .fromTo('.hero-eyebrow', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.1)
      .fromTo('.hero-screen', { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
      .fromTo('.hero-lede, .hero-actions', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.55)
      .fromTo('.hero-cue', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.1)
      .fromTo('.screen-dash, .screen-top', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.9);
    root.classList.remove('motion-pending');
    return tl;
  }

  /* ------------------------------------------------------------------------
     Home · scroll-scrubbed frame sequence + HUD
  ------------------------------------------------------------------------ */
  const sequence = (() => {
    const hero = $('.hero');
    const canvas = $('.hero-canvas');
    if (!hero || !canvas) return null;
    const context = canvas.getContext('2d');
    const total = 121;
    const frames = new Array(total);
    const loaded = new Array(total).fill(false);
    let target = 0;
    let drawn = -1;
    let ready = false;

    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const order = [];
    const seen = new Set();
    const queue = (index) => {
      if (index < total && !seen.has(index)) {
        seen.add(index);
        order.push(index);
      }
    };
    queue(0);
    queue(total - 1);
    for (let step = 64; step >= (saveData ? 4 : 1); step /= 2) {
      for (let index = 0; index < total; index += step) queue(index);
    }

    function nearest(index) {
      if (loaded[index]) return index;
      for (let distance = 1; distance < total; distance += 1) {
        if (index - distance >= 0 && loaded[index - distance]) return index - distance;
        if (index + distance < total && loaded[index + distance]) return index + distance;
      }
      return -1;
    }

    function draw(force = false) {
      const index = nearest(target);
      if (index < 0 || (index === drawn && !force)) return;
      const image = frames[index];
      const width = canvas.width;
      const height = canvas.height;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
      drawn = index;
      if (!ready) {
        ready = true;
        hero.classList.add('canvas-ready');
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.imageSmoothingQuality = 'high';
      draw(true);
    }

    let cursor = 0;
    function loadNext() {
      if (cursor >= order.length) return;
      const index = order[cursor];
      cursor += 1;
      const image = new Image();
      image.decoding = 'async';
      image.src = `sequence/f${pad(index + 1, 3)}.webp`;
      image.decode().then(() => {
        frames[index] = image;
        loaded[index] = true;
        draw();
      }).catch(() => undefined).then(loadNext);
    }

    return {
      start() {
        resize();
        for (let lane = 0; lane < 6; lane += 1) loadNext();
      },
      resize,
      seek(progress) {
        target = clamp(Math.round(progress * (total - 1)), 0, total - 1);
        draw();
      },
    };
  })();

  function heroScroll(isDesktop) {
    const hero = $('.hero');
    if (!hero) return;
    const steps = $$('.hero-step');
    const speed = $('[data-speed]');
    const gear = $('[data-gear]');
    const revBar = $('.rev-lights');
    const leds = $$('.rev-lights i');
    const hud = { speed: '', gear: '', lit: -1, shift: null };

    function updateHud(progress) {
      const kmh = pad(312 * Math.pow(progress, 0.85), 3);
      const gears = 7;
      const geared = progress * gears;
      const currentGear = progress < 0.015 ? 'N' : String(Math.min(gears, Math.floor(geared) + 1));
      const within = progress < 0.015 ? 0 : (progress >= 0.999 ? 1 : geared - Math.floor(geared));
      const lit = Math.round(within * 10);
      const shift = within > 0.92;
      hero.style.setProperty('--speed', progress.toFixed(3));
      if (kmh !== hud.speed) { speed.textContent = kmh; hud.speed = kmh; }
      if (currentGear !== hud.gear) { gear.textContent = currentGear; hud.gear = currentGear; }
      if (lit !== hud.lit) {
        leds.forEach((led, index) => led.classList.toggle('is-on', index < lit));
        hud.lit = lit;
      }
      if (shift !== hud.shift) { revBar.classList.toggle('is-shift', shift); hud.shift = shift; }
    }

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (isDesktop ? 2.6 : 2.1))}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => sequence?.resize(),
      },
      // Driven by the smoothed timeline (not raw scroll) so frames and HUD glide with the scrub.
      onUpdate() {
        const progress = this.progress();
        sequence?.seek(progress);
        updateHud(progress);
      },
    });

    tl.to('.hero-cue', { autoAlpha: 0, duration: 0.04 }, 0)
      .to('.hero-intro', { autoAlpha: 0, y: -26, duration: 0.07 }, 0.03)
      .to('.hero-title .line:nth-child(1)', { x: () => -window.innerWidth * 0.02, duration: 1 }, 0)
      .to('.hero-title .line:nth-child(3)', { x: () => window.innerWidth * 0.03, duration: 1 }, 0)
      .to('.hero-screen', { scale: isDesktop ? 1.05 : 1.02, duration: 0.6 }, 0.35)
      .to('.hero-glow', { scale: 1.25, opacity: 0.7, duration: 1 }, 0);

    const windows = [[0.1, 0.36], [0.42, 0.66], [0.72, 1.2]];
    steps.forEach((step, index) => {
      const [enter, leave] = windows[index];
      tl.fromTo(step, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, enter);
      if (leave < 1) tl.to(step, { autoAlpha: 0, y: -24, duration: 0.05, ease: 'power2.in' }, leave);
    });
    tl.to({}, { duration: 0.001 }, 1);
  }

  /* ------------------------------------------------------------------------
     Home · velocity marquee
  ------------------------------------------------------------------------ */
  function initMarquee() {
    const band = $('.marquee-band');
    if (!band) return;
    const rows = $$('[data-marquee]', band).map((element) => {
      const track = $('.marquee-track', element);
      const originals = [...track.children];
      return { element, track, originals, direction: Number(element.dataset.direction) || 1, x: 0, half: 1 };
    });

    function build() {
      rows.forEach((row) => {
        row.track.replaceChildren(...row.originals);
        let guard = 0;
        while (row.track.scrollWidth < window.innerWidth * 1.4 && guard < 12) {
          row.originals.forEach((node) => {
            const clone = node.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            row.track.append(clone);
          });
          guard += 1;
        }
        [...row.track.children].forEach((node) => {
          const clone = node.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          row.track.append(clone);
        });
        row.half = row.track.scrollWidth / 2;
      });
    }
    build();

    let active = false;
    let direction = 1;
    let velocity = 0;
    let measured = 0;
    ScrollTrigger.create({
      trigger: band,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { active = self.isActive; },
      onUpdate: (self) => {
        direction = self.direction;
        measured = self.getVelocity() / 60;
      },
    });

    gsap.ticker.add((time, delta) => {
      if (!active) return;
      const raw = lenis ? lenis.velocity : measured;
      measured *= 0.9;
      velocity += (raw - velocity) * 0.12;
      const boost = 1 + Math.min(Math.abs(velocity) * 0.09, 7);
      const skew = clamp(velocity * -0.25, -9, 9);
      rows.forEach((row) => {
        row.x -= row.direction * direction * boost * delta * 0.055;
        if (row.x <= -row.half) row.x += row.half;
        if (row.x > 0) row.x -= row.half;
        row.track.style.transform = `translate3d(${row.x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
      });
    });

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 200);
    });
  }

  /* ------------------------------------------------------------------------
     Home · setups (horizontal pin on desktop, stacked reveals on mobile)
  ------------------------------------------------------------------------ */
  function setupsScroll(isDesktop) {
    const section = $('.setups');
    if (!section) return;
    const track = $('.setups-track', section);
    const panels = $$('.setup-panel', section);

    if (!isDesktop) {
      panels.forEach((panel) => {
        gsap.from(panel, { y: 80, autoAlpha: 0, duration: 1.3, scrollTrigger: { trigger: panel, start: 'top 88%', once: true } });
        gsap.fromTo($('.setup-media img', panel), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
        const product = $('.setup-product', panel);
        if (product) gsap.fromTo(product, { yPercent: 10 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      return;
    }

    const count = $('[data-setups-count]', section);
    const bar = $('.setups-bar span', section);
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    let current = '';

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          const centre = window.innerWidth / 2;
          let best = 0;
          let bestDistance = Infinity;
          panels.forEach((panel, index) => {
            const rect = panel.getBoundingClientRect();
            const gap = Math.abs(rect.left + rect.width / 2 - centre);
            if (gap < bestDistance) { bestDistance = gap; best = index; }
          });
          const label = pad(best + 1, 2);
          if (label !== current) { count.textContent = label; current = label; }
        },
      },
    });

    panels.forEach((panel) => {
      const along = { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true };
      gsap.fromTo($('.setup-media img', panel), { xPercent: -9 }, { xPercent: 9, ease: 'none', scrollTrigger: along });
      const product = $('.setup-product', panel);
      if (product) gsap.fromTo(product, { xPercent: 22, rotate: 4 }, { xPercent: -16, rotate: -3, ease: 'none', scrollTrigger: { ...along } });
      gsap.from($$('.setup-body > *, .setup-index', panel), {
        y: 46,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.07,
        scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 78%', toggleActions: 'play none none reverse' },
      });
    });
  }

  /* ------------------------------------------------------------------------
     Home · manifesto (word-by-word reading scrub)
  ------------------------------------------------------------------------ */
  function manifestoScroll() {
    const text = $('[data-words]');
    if (!text) return;
    const words = splitWords(text);
    gsap.fromTo(words, { opacity: 0.12 }, {
      opacity: 1,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: { trigger: text, start: 'top 82%', end: 'bottom 50%', scrub: 0.6 },
    });
    $$('.pillar').forEach((pillar, index) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: pillar, start: 'top 88%', once: true }, delay: index * 0.1 });
      tl.fromTo(pillar, { '--line': 0 }, { '--line': 1, duration: 1.4 })
        .from(pillar.children, { y: 34, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.1);
    });
  }

  /* ------------------------------------------------------------------------
     Home · MOZA R3 assembly
  ------------------------------------------------------------------------ */
  function assemblyScroll(isDesktop) {
    const section = $('.assembly');
    if (!section) return;
    const stage = $('.assembly-stage', section);
    const base = $('.part-base', stage);
    const wheel = $('.part-wheel', stage);
    const pedals = $('.part-pedals', stage);
    const bundle = $('.part-bundle', stage);
    const tags = [$('.stage-tag-base', stage), $('.stage-tag-wheel', stage), $('.stage-tag-pedals', stage)];
    const steps = $$('.assembly-step', section);
    const status = $('.stage-status', stage);
    const statusText = $('[data-stage-status]', stage);
    const price = $('.assembly-price b', section);
    const priceState = { value: 0 };

    // Where each part sits inside the real bundle photo (fractions of its box).
    const fit = {
      base: { cx: 0.87, cy: 0.45, w: 0.3 },
      wheel: { cx: 0.615, cy: 0.36, w: 0.37 },
      pedals: { cx: 0.285, cy: 0.49, w: 0.56 },
    };
    const converge = (element, box) => ({
      x: () => bundle.offsetLeft + box.cx * bundle.offsetWidth - (element.offsetLeft + element.offsetWidth / 2),
      y: () => bundle.offsetTop + box.cy * bundle.offsetHeight - (element.offsetTop + element.offsetHeight / 2),
      scale: () => (box.w * bundle.offsetWidth) / element.offsetWidth,
    });

    let currentStep = -1;
    const setStep = (step) => {
      if (step === currentStep) return;
      currentStep = step;
      steps.forEach((item, index) => {
        item.classList.toggle('is-active', index === step || (step === 3 && index === 2));
        item.classList.toggle('is-done', index < step);
      });
      const assembled = step === 3;
      status.classList.toggle('is-ready', assembled);
      statusText.textContent = assembled ? 'Listo para correr' : 'Ensamblando';
    };

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1 },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (isDesktop ? 2.8 : 2.2))}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate() {
        const time = this.time();
        const { wheel, pedals, assemble } = this.labels;
        if (assemble === undefined) return;
        setStep(time < wheel ? 0 : time < pedals ? 1 : time < assemble ? 2 : 3);
      },
    });

    tl.addLabel('base', 0)
      .fromTo(base, { autoAlpha: 0, xPercent: 70, yPercent: -10, rotate: 16, scale: 0.8 }, { autoAlpha: 1, xPercent: 0, yPercent: 0, rotate: 0, scale: 1 }, 'base')
      .fromTo(tags[0], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 'base+=0.6')
      .addLabel('wheel', '+=0.3')
      .fromTo(wheel, { autoAlpha: 0, yPercent: -80, rotate: -50, scale: 0.7 }, { autoAlpha: 1, yPercent: 0, rotate: 0, scale: 1 }, 'wheel')
      .fromTo(tags[1], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 'wheel+=0.6')
      .addLabel('pedals', '+=0.3')
      .fromTo(pedals, { autoAlpha: 0, xPercent: -70, yPercent: 30, rotate: -10, scale: 0.85 }, { autoAlpha: 1, xPercent: 0, yPercent: 0, rotate: 0, scale: 1 }, 'pedals')
      .fromTo(tags[2], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 'pedals+=0.6')
      .addLabel('assemble', '+=0.45')
      .to(tags, { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power2.in' }, 'assemble')
      .to(base, { ...converge(base, fit.base), duration: 0.9, ease: 'power3.inOut' }, 'assemble')
      .to(wheel, { ...converge(wheel, fit.wheel), duration: 0.9, ease: 'power3.inOut' }, 'assemble')
      .to(pedals, { ...converge(pedals, fit.pedals), duration: 0.9, ease: 'power3.inOut' }, 'assemble')
      .fromTo(bundle, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'none' }, 'assemble+=0.75')
      .to([base, wheel, pedals], { autoAlpha: 0, duration: 0.25, ease: 'none' }, 'assemble+=0.85')
      .fromTo('.assembly-price', { autoAlpha: 0.0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 'assemble+=0.1')
      .fromTo(priceState, { value: 0 }, {
        value: 580,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => { price.textContent = String(Math.round(priceState.value)); },
      }, 'assemble+=0.2')
      .to('.stage-ring-b', { rotate: 180, duration: tl.duration(), ease: 'none' }, 0)
      .to({}, { duration: 0.5 });

    setStep(0);
  }

  /* ------------------------------------------------------------------------
     Home · telemetry trace
  ------------------------------------------------------------------------ */
  function telemetryScroll(isDesktop) {
    const section = $('.telemetry');
    if (!section) return;
    const chart = $('.telemetry-chart', section);
    const svg = $('.chart-svg', chart);
    const reveal = $('#chart-reveal rect', svg);
    const path = $('.chart-speed', svg);
    const car = $('.chart-car', chart);
    const speedOut = $('[data-tele-speed]', chart);
    const timeOut = $('[data-tele-time]', chart);
    const items = $$('.tech-item', section);
    const length = path.getTotalLength();
    const samples = Array.from({ length: 301 }, (_, index) => path.getPointAtLength((length * index) / 300));
    const pointAt = (x) => {
      let best = samples[0];
      for (const sample of samples) {
        if (Math.abs(sample.x - x) < Math.abs(best.x - x)) best = sample;
      }
      return best;
    };

    gsap.set(car, { xPercent: -50, yPercent: -50 });
    reveal.setAttribute('width', '0');

    const update = (progress) => {
      const point = pointAt(progress * 1200);
      const box = chart.getBoundingClientRect();
      const plot = svg.getBoundingClientRect();
      gsap.set(car, {
        x: plot.left - box.left + (point.x / 1200) * plot.width,
        y: plot.top - box.top + (point.y / 260) * plot.height,
        autoAlpha: progress > 0.002 ? 1 : 0,
      });
      speedOut.textContent = pad(clamp(48 + (1 - (point.y - 30) / 180) * 262, 0, 330), 3);
      timeOut.textContent = (progress * 84.318).toFixed(3).padStart(6, '0');
      items.forEach((item, index) => item.classList.toggle('is-active', progress >= 0.08 + index * 0.24));
    };

    if (isDesktop) {
      section.classList.add('telemetry-pinned');
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 1.9)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate() { update(this.progress()); },
      })
        .to(reveal, { attr: { width: 1220 }, duration: 1 }, 0)
        .fromTo('.telemetry-bg img', { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1, duration: 1 }, 0);
      update(0);
      return () => section.classList.remove('telemetry-pinned');
    }

    gsap.to(reveal, {
      attr: { width: 1220 },
      ease: 'none',
      scrollTrigger: { trigger: chart, start: 'top 85%', end: 'bottom 35%', scrub: 0.6 },
      onUpdate() { update(this.progress()); },
    });
    update(0);
    return undefined;
  }

  /* ------------------------------------------------------------------------
     Home · community (expanding frame + start lights)
  ------------------------------------------------------------------------ */
  function communityScroll(isDesktop) {
    const section = $('.community');
    if (!section) return;
    const frame = $('.community-frame', section);
    const lights = $$('.start-lights span', section);

    gsap.fromTo(frame,
      { clipPath: isDesktop ? 'inset(10% 3% 10% 3% round 28px)' : 'inset(5% 3% 5% 3% round 18px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true } });
    gsap.fromTo($('.community-media img', section), { scale: 1.3, yPercent: -5 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });

    gsap.from($$('.start-lights, .community-content > .eyebrow, .community-content > .lead, .community-actions', section), {
      y: 44,
      autoAlpha: 0,
      duration: 1.3,
      stagger: 0.08,
      scrollTrigger: { trigger: section, start: 'top 40%', once: true },
    });

    let lit = -1;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      end: 'center 42%',
      onUpdate: (self) => {
        const go = self.progress >= 0.97;
        const count = go ? 0 : Math.min(lights.length, Math.floor(self.progress * (lights.length + 1)));
        if (count !== lit) {
          lights.forEach((light, index) => light.classList.toggle('is-on', index < count));
          lit = count;
        }
        section.classList.toggle('is-go', go);
      },
    });
  }

  /* ------------------------------------------------------------------------
     Home · flight + footer wordmark
  ------------------------------------------------------------------------ */
  function flightScroll() {
    const section = $('.flight');
    if (!section) return;
    gsap.fromTo('.flight-word', { xPercent: 4 }, { xPercent: -34, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
    const art = $('.flight-art', section);
    gsap.fromTo(art, { clipPath: 'inset(100% 0% 0% 0% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: art, start: 'top 82%', once: true } });
    gsap.fromTo($('img', art), { yPercent: 0, scale: 1.12 }, { yPercent: -12, scale: 1, ease: 'none', scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($$('figcaption span', art), { y: 20, autoAlpha: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: art, start: 'top 60%', once: true } });
  }

  function footerScroll() {
    const footer = $('.site-footer');
    if (footer) {
      gsap.from($$('.footer-top .eyebrow, .footer-grid > *, .footer-bottom > *', footer), {
        y: 30,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.06,
        scrollTrigger: { trigger: footer, start: 'top 70%', once: true },
      });
    }
    const wordmark = $('.footer-wordmark');
    if (wordmark) {
      const chars = $$('.footer-wordmark > span').flatMap((part) => splitChars(part));
      gsap.fromTo(chars, { yPercent: 105 }, {
        yPercent: 0,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: { trigger: wordmark, start: 'top bottom', end: 'bottom 92%', scrub: 0.8 },
      });
    }
  }

  /* ------------------------------------------------------------------------
     Shared reveals (every page)
  ------------------------------------------------------------------------ */
  function sharedReveals() {
    const productHero = $('.catalog-hero, .tripod-hero, .chair-hero, .r3-product-hero, .moza-hero');

    // Headlines: masked line rise.
    $$('main h2, main h1, .footer-cta > span:first-child').forEach((heading) => {
      if (heading.closest('.hero')) return;
      const inners = splitLines(heading);
      if (!inners.length) return;
      const inHero = productHero && productHero.contains(heading);
      gsap.fromTo(inners, { yPercent: 112 }, {
        yPercent: 0,
        duration: 1.4,
        stagger: 0.1,
        delay: inHero ? 0.15 : 0,
        scrollTrigger: inHero ? undefined : { trigger: heading, start: 'top 90%', once: true },
      });
    });

    // Soft rise for supporting copy.
    const fadeSelector = [
      'main .eyebrow', 'main .lead', '.catalog-route', '.r3-platform', '.product-price-line', '.moza-buy-line', '.catalog-jump',
      '.catalog-hero-copy > p', '.tripod-hero-copy > p', '.chair-hero-copy > p', '.r3-hero-copy > p', '.moza-hero h1 + p',
      '.catalog-heading p', '.kit-intro p', '.moza-kit-heading p', '.moza-kit-heading .product-code',
      '.tripod-intro-grid > p', '.chair-intro-grid > p', '.r3-intro-grid > div', '.r3-intro-grid > .product-code',
      '.product-section-heading .product-code', '.tripod-specs-title > p', '.chair-specs-title > p', '.r3-spec-heading > p',
      '.moza-spec-grid > div > p', '.r3-compatibility-grid > div > p', '.r3-compatibility-grid .button',
      '.catalog-close p', '.catalog-close a', '.tripod-close .product-code', '.tripod-close .button', '.chair-close .product-code',
      '.chair-close .button', '.moza-close .product-code', '.moza-close .button', '.manifesto-link', '.flight-copy .text-link',
      '.setups-hint', '.catalog-hero-index span',
    ].join(', ');
    const fades = $$(fadeSelector).filter((element) => !element.closest('.hero, .community'));
    if (fades.length) gsap.set(fades, { autoAlpha: 0, y: 34 });
    ScrollTrigger.batch(fades, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.07, overwrite: true, delay: productHero && batch.some((el) => productHero.contains(el)) ? 0.35 : 0 }),
    });

    // Cards and rows.
    const cards = $$([
      '.cockpit-feature', '.control-row', '.accessories-card', '.tripod-feature-card', '.chair-feature-card', '.r3-component-card',
      '.moza-kit-parts article', '.r3-spec-block', '.tripod-compatibility', '.chair-compatibility', '.r3-game-list', '.tripod-video-frame',
      '.chair-gallery-grid figure', '.chair-dimensions', '.spec-table-wrap', '.chair-spec-table-wrap',
    ].join(', '));
    if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 70 });
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.1, overwrite: true }),
    });

    const rows = $$('main tbody tr');
    if (rows.length) gsap.set(rows, { autoAlpha: 0, x: -24 });
    ScrollTrigger.batch(rows, {
      start: 'top 94%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.04, overwrite: true }),
    });

    $$('.r3-game-columns li').forEach((item, index) => {
      gsap.from(item, { autoAlpha: 0, x: -16, duration: 0.8, delay: (index % 10) * 0.03, scrollTrigger: { trigger: item, start: 'top 95%', once: true } });
    });

    // Imagery parallax inside framed media.
    $$('.cockpit-visual img, .chair-gallery-scene img, .tripod-feature-card figure img').forEach((image) => {
      gsap.fromTo(image, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Count-ups for prices and torque.
    $$('.cockpit-price, .catalog-price').forEach((element) => countUp(element, { scrollTrigger: { trigger: element, start: 'top 92%', once: true } }));
    $$('.product-price-line strong, .moza-buy-line strong').forEach((element) => countUp(element, { delay: 0.5 }));
    $$('.moza-power-value').forEach((element) => countUp(element, { delay: 0.35, duration: 2.2 }));
    $$('[data-torque]').forEach((gauge) => gsap.fromTo(gauge, { '--torque': 0 }, { '--torque': Number(gauge.dataset.torque), duration: 2.2, delay: 0.35, ease: 'power3.out' }));
  }

  /* ------------------------------------------------------------------------
     Inner page heroes
  ------------------------------------------------------------------------ */
  function productHero() {
    const hero = $('.catalog-hero, .tripod-hero, .chair-hero, .r3-product-hero, .moza-hero');
    if (!hero) return;
    const stage = $('.catalog-hero-art, .tripod-hero-product, .chair-hero-product, .r3-bundle-visual, .moza-power', hero);
    const image = stage && $('img', stage);
    const copy = $('.catalog-hero-copy, .tripod-hero-copy, .chair-hero-copy, .r3-hero-copy, .moza-hero-grid > div:first-child', hero);

    if (stage) {
      gsap.fromTo(stage, { clipPath: 'inset(0% 0% 0% 100% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.8, ease: 'expo.inOut', delay: 0.1 });
      if (image) {
        gsap.fromTo(image, { scale: 1.25, autoAlpha: 0, rotate: -4 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 2, delay: 0.5 });
        gsap.to(image, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }
      const value = $('.moza-power-inner', stage);
      if (value) gsap.to(value, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo(stage, { '--spin': 0 }, { '--spin': 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }
    if (copy) gsap.to(copy, { yPercent: -8, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true } });
  }

  /* ------------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------------ */
  initPointer();

  if (isHome) {
    if (document.readyState === 'complete') sequence?.start();
    else window.addEventListener('load', () => sequence?.start(), { once: true });
    const mm = gsap.matchMedia();
    mm.add({ isDesktop: '(min-width: 961px)', isMobile: '(max-width: 960px)' }, (context) => {
      const { isDesktop } = context.conditions;
      heroScroll(isDesktop);
      setupsScroll(isDesktop);
      assemblyScroll(isDesktop);
      const cleanupTelemetry = telemetryScroll(isDesktop);
      communityScroll(isDesktop);
      ScrollTrigger.sort();
      return () => cleanupTelemetry?.();
    });
    initMarquee();
    manifestoScroll();
    flightScroll();
    sharedReveals();
    footerScroll();
    ScrollTrigger.sort();

    // Hold the hero hidden until the intro releases it.
    gsap.set('.hero-title .line-inner', { y: 0, yPercent: 112 });
    gsap.set('[data-hero-in]', { autoAlpha: 0 });
    root.classList.remove('motion-pending');
    playIntro().then(heroEntrance);
  } else {
    productHero();
    sharedReveals();
    footerScroll();
    root.classList.remove('motion-pending');
  }

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', () => {
    refresh();
    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) {
        window.setTimeout(() => {
          if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
          else target.scrollIntoView();
          window.setTimeout(() => {
            lastY = window.scrollY;
            header?.classList.remove('is-hidden');
          }, 120);
        }, 60);
      }
    }
  });
})();
