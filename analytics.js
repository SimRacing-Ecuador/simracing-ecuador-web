/* Basic consent mode: no Google client or requests until explicit acceptance.
   The event API accepts only known catalogue data and fixed interaction labels. */
(() => {
  'use strict';
  const config = window.SRE_MEASUREMENT || {};
  const pages = window.SRE_PAGES || {};
  const key = 'sre-consent-v1';
  const preferenceLifetime = 180 * 86400000;
  const preferenceStores = ['localStorage', 'sessionStorage'];
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  const id = config.measurementId || '';
  const production = location.protocol === 'https:' && (config.hosts || []).includes(location.hostname) && !location.port;
  const path = location.pathname === '/index.html' ? '/' : location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const page = pages[path];
  let choice = null;
  let memoryPreference = null;
  let loaded = false;
  let viewed = false;
  let lastFocus = null;
  let sessionCampaign = {};
  const seenItems = new Set();
  let listObserver = null;

  function cookies() {
    try { return document.cookie.split(';').map(cookie => cookie.trim()); }
    catch (_) { return []; }
  }

  function readPreference() {
    const candidates = [];
    for (const name of preferenceStores) {
      try {
        candidates.push(window[name].getItem(key));
      } catch (_) { /* Storage can be unavailable. */ }
    }
    const cookie = cookies().find(value => value.startsWith(key + '='));
    if (cookie) {
      try { candidates.push(decodeURIComponent(cookie.slice(key.length + 1))); }
      catch (_) { /* Ignore an invalid preference cookie. */ }
    }
    const now = Date.now();
    let latest = memoryPreference?.expires > now ? memoryPreference : null;
    for (const candidate of candidates) {
      try {
        const record = JSON.parse(candidate);
        if (!record || !Number.isFinite(record.expires) || record.expires <= now ||
            !['accepted', 'rejected'].includes(record.value)) continue;
        const savedAt = Number.isFinite(record.savedAt) ? record.savedAt : record.expires - preferenceLifetime;
        if (!latest || savedAt > latest.savedAt || (savedAt === latest.savedAt && record.value === 'rejected')) {
          latest = { value: record.value, expires: record.expires, savedAt };
        }
      } catch (_) { /* Ignore an invalid storage record. */ }
    }
    return latest;
  }

  function saveChoice(value) {
    choice = value;
    const now = Date.now();
    const previous = readPreference();
    const record = {
      value,
      expires: now + preferenceLifetime,
      savedAt: Math.max(now, (previous?.savedAt ?? 0) + 1)
    };
    const encoded = JSON.stringify(record);
    memoryPreference = null;
    let persisted = false;
    for (const name of preferenceStores) {
      try { window[name].setItem(key, encoded); persisted = true; }
      catch (_) {
        try { window[name].removeItem(key); } catch (_) { /* A read-only store may also block removal. */ }
      }
    }
    if (!persisted) {
      try {
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${key}=${encodeURIComponent(encoded)}; Path=/; SameSite=Lax${secure}`;
      } catch (_) { /* A blocked cookie leaves the choice in memory. */ }
    }
    if (readPreference()?.value === value) return true;
    memoryPreference = record;
    return false;
  }

  function campaignFrom(input) {
    const campaign = {};
    try {
      const url = new URL(input);
      for (const name of campaignKeys) {
        const value = url.searchParams.get(name);
        if ((config.campaignValues || []).includes(value)) campaign[name] = value;
      }
    } catch (_) { /* Drop malformed URLs. */ }
    return campaign;
  }

  try { sessionCampaign = JSON.parse(sessionStorage.getItem('sre-campaign-v1')) || {}; } catch (_) { /* Optional attribution. */ }
  sessionCampaign = { ...campaignFrom('https://simracingec.com/?' + new URLSearchParams(sessionCampaign)), ...campaignFrom(location.href) };
  try { sessionStorage.setItem('sre-campaign-v1', JSON.stringify(sessionCampaign)); } catch (_) { /* In-memory attribution still works. */ }

  function pageLocation() {
    const url = new URL(page.url);
    for (const [name, value] of Object.entries(sessionCampaign)) url.searchParams.set(name, value);
    return url.href;
  }

  function referrer() {
    try {
      const url = new URL(document.referrer);
      if (url.hostname === 'simracingec.com') {
        const route = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
        return pages[route]?.url || '';
      }
      // External paths and arbitrary hosts can contain personal identifiers.
      const origins = [
        'https://www.google.com', 'https://www.google.com.ec', 'https://www.instagram.com',
        'https://l.instagram.com', 'https://www.facebook.com', 'https://l.facebook.com',
        'https://www.tiktok.com', 'https://www.bing.com', 'https://chatgpt.com',
        'https://www.perplexity.ai', 'https://perplexity.ai', 'https://claude.ai',
        'https://gemini.google.com', 'https://copilot.microsoft.com'
      ];
      return origins.includes(url.origin) ? url.origin + '/' : '';
    } catch (_) { return ''; }
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', denied);
  window['ga-disable-' + id] = choice !== 'accepted';

  function emit(name, params = {}) {
    if (!production || !page || !loaded || choice !== 'accepted') return;
    gtag('event', name, { ...params, page_title: page.title, page_location: pageLocation(), page_referrer: referrer(), send_to: id });
  }

  function item(data) {
    const result = { item_id: data.item_id, item_name: data.name, item_category: data.category, quantity: 1 };
    if (data.brand) result.item_brand = data.brand;
    if (Number.isFinite(data.price) && data.price > 0) result.price = data.price;
    return result;
  }

  function currentView() {
    if (viewed || !loaded || choice !== 'accepted') return;
    viewed = true;
    emit('page_view');
    if (page.item_id) emit('view_item', { currency: 'USD', value: page.price, items: [item(page)] });
    if (path === '/productos' && typeof IntersectionObserver !== 'undefined') {
      listObserver = new IntersectionObserver(entries => {
        if (choice !== 'accepted') return;
        const groups = new Map();
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const product = Object.values(pages).find(data => data.item_id === entry.target.dataset.analyticsItem);
          if (!product || seenItems.has(product.item_id)) continue;
          seenItems.add(product.item_id);
          if (!groups.has(product.category)) groups.set(product.category, []);
          groups.get(product.category).push(item(product));
          listObserver.unobserve(entry.target);
        }
        for (const [name, items] of groups) emit('view_item_list', { item_list_name: name, items });
      }, { threshold: 0.1 });
      document.querySelectorAll('[data-analytics-item]').forEach(element => listObserver.observe(element));
    }
  }

  function start() {
    if (!production || !page || !/^G-[A-Z0-9]+$/.test(id) || choice !== 'accepted') return;
    window['ga-disable-' + id] = false;
    if (loaded) { currentView(); return; }
    loaded = true;
    gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_title: page.title, page_location: pageLocation(), page_referrer: referrer(),
      cookie_expires: 15552000, cookie_update: false
    });
    const client = document.createElement('script');
    client.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    client.async = true;
    client.id = 'sre-google-client';
    document.head.appendChild(client);
    currentView();
  }

  function clearCookies() {
    const names = cookies().map(cookie => cookie.split('=')[0].trim()).filter(name => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
    const labels = location.hostname.split('.');
    const domains = ['', ...labels.map((_, index) => labels.slice(index).join('.')).filter(value => value.includes('.'))];
    const segments = location.pathname.split('/').filter(Boolean);
    const paths = new Set(['/']);
    for (let i = 1; i <= segments.length; i++) {
      paths.add('/' + segments.slice(0, i).join('/'));
      paths.add('/' + segments.slice(0, i).join('/') + '/');
    }
    try {
      for (const name of names) for (const domain of domains) for (const cookiePath of paths) {
        document.cookie = `${name}=; Max-Age=0; Path=${cookiePath}; SameSite=Lax${domain ? '; Domain=' + domain : ''}${location.protocol === 'https:' ? '; Secure' : ''}`;
      }
    } catch (_) { /* Cookie writes can be blocked. */ }
  }

  const panel = document.getElementById('consent-panel');
  function openPanel() {
    if (!panel) return;
    lastFocus = document.activeElement;
    panel.hidden = false;
    panel.querySelector('button')?.focus({ preventScroll: true });
  }
  function closePanel() {
    if (panel) panel.hidden = true;
    lastFocus?.focus({ preventScroll: true });
  }

  function choose(value) {
    const hadClient = loaded;
    const persisted = saveChoice(value);
    closePanel();
    if (value === 'accepted') { start(); return; }
    window['ga-disable-' + id] = true;
    listObserver?.disconnect();
    // Discard unsent events; no denied-state pings are sent on withdrawal.
    window.dataLayer.length = 0;
    clearCookies();
    if (hadClient && persisted) location.reload();
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.hasAttribute('data-consent-open')) { openPanel(); return; }
    if (target.hasAttribute('data-consent-accept')) { choose('accepted'); return; }
    if (target.hasAttribute('data-consent-reject')) { choose('rejected'); return; }
    if (target.hasAttribute('data-consent-close')) { closePanel(); return; }
    if (target.matches('[data-load-video]')) {
      const frame = document.querySelector('iframe[data-video-src]');
      if (frame && !frame.src) { frame.src = frame.dataset.videoSrc; target.hidden = true; }
      return;
    }
    if (target.tagName !== 'A') return;
    let url;
    try { url = new URL(target.href, location.href); } catch (_) { return; }
    const cta_location = target.closest('header') ? 'header' : target.closest('footer') ? 'footer' : target.closest('section[id]')?.id || 'product';
    if (url.hostname === 'wa.me') emit('whatsapp_click', { method: 'whatsapp', cta_location });
    else if (url.protocol === 'tel:') emit('phone_call_click', { method: 'phone', cta_location });
    else if (target.hasAttribute('data-analytics-item')) {
      const product = Object.values(pages).find(data => data.item_id === target.dataset.analyticsItem);
      if (product) emit('select_item', { item_list_name: product.category, items: [item(product)] });
    }
  });

  // Scroll is explicit so the long pinned animation cannot generate duplicate auto events.
  let scrolled = false;
  window.addEventListener('scroll', () => {
    if (scrolled || choice !== 'accepted' || !loaded) return;
    if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight >= 0.9) {
      scrolled = true; emit('scroll', { percent_scrolled: 90 });
    }
  }, { passive: true });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    const previous = choice;
    choice = readPreference()?.value ?? null;
    if (choice === 'accepted') start();
    else if (previous === 'accepted') {
      window['ga-disable-' + id] = true; window.dataLayer.length = 0; clearCookies();
      if (!memoryPreference) location.reload();
    }
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    choice = readPreference()?.value ?? null;
    if (choice === 'accepted') {
      viewed = false; scrolled = false; seenItems.clear(); listObserver?.disconnect(); start();
    } else {
      window['ga-disable-' + id] = true; window.dataLayer.length = 0; clearCookies();
      if (loaded && !memoryPreference) location.reload();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && choice) closePanel();
    if (event.key !== 'Tab' || !panel || panel.hidden || !panel.contains(document.activeElement)) return;
    const focusables = [...panel.querySelectorAll('button, a')];
    if (event.shiftKey && document.activeElement === focusables[0]) { event.preventDefault(); focusables.at(-1)?.focus(); }
    else if (!event.shiftKey && document.activeElement === focusables.at(-1)) { event.preventDefault(); focusables[0]?.focus(); }
  });
  choice = readPreference()?.value ?? null;
  if (choice === 'accepted') start();
  else { clearCookies(); if (!choice) openPanel(); }
})();
