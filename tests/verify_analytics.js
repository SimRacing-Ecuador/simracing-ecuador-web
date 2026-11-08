/* Exercises consent and payloads without loading Google or sending real traffic. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('analytics.js', 'utf8');
const catalog = fs.readFileSync('analytics-catalog.js', 'utf8');
const measurement = fs.readFileSync('measurement-config.js', 'utf8');

function setup({ host = 'simracingec.com', path = '/moza-r3', query = '', stored = null, blocked = false,
  stores = { local: new Map(), session: new Map() }, localWriteBlocked = false, preferenceCookie = null,
  referrer = 'https://www.google.com/search?q=person%40example.com', productionConfig = false } = {}) {
  const listeners = {}, windowListeners = {}, requests = [], writes = [];
  if (stored) {
    const record = JSON.stringify({ value: stored, expires: Date.now() + 100000 });
    stores.local.set('sre-consent-v1', record);
    stores.session.set('sre-consent-v1', record);
  }
  const button = { focus() {} };
  const panel = { hidden: true, querySelector: () => button, contains: () => false, querySelectorAll: () => [] };
  const document = {
    referrer,
    activeElement: button,
    documentElement: { scrollHeight: 3000 },
    head: { appendChild: script => requests.push(script.src) },
    getElementById: () => panel,
    createElement: () => ({}),
    querySelectorAll: () => [],
    addEventListener: (name, fn) => { listeners[name] = fn; }
  };
  Object.defineProperty(document, 'cookie', {
    get: () => ['_ga=old; _ga_TEST=old; required_cookie=keep', preferenceCookie?.value].filter(Boolean).join('; '),
    set: value => {
      writes.push(value);
      if (preferenceCookie && value.startsWith('sre-consent-v1=')) preferenceCookie.value = value.split(';')[0];
    }
  });
  const storage = (saved, writeBlocked) => ({
    getItem: name => { if (blocked) throw Error('blocked'); return saved.get(name) || null; },
    setItem: (name, value) => { if (blocked || writeBlocked) throw Error('blocked'); saved.set(name, value); }
  });
  const location = { hostname: host, protocol: host === 'localhost' ? 'http:' : 'https:', port: '', pathname: path, href: 'https://' + host + path + query, reload: () => { location.reloaded = true; } };
  const context = { document, location, sessionStorage: storage(stores.session), localStorage: storage(stores.local, localWriteBlocked), URL, URLSearchParams, Date,
    SRE_MEASUREMENT: { measurementId: 'G-TESTONLY', hosts: ['simracingec.com'], campaignValues: ['google', 'social'] },
    addEventListener: (name, fn) => { windowListeners[name] = fn; }, scrollY: 0, innerHeight: 800 };
  context.window = context;
  vm.createContext(context);
  if (productionConfig) vm.runInContext(measurement, context);
  vm.runInContext(catalog, context); vm.runInContext(source, context);
  const click = attribute => listeners.click({ target: { closest: () => ({ hasAttribute: name => name === attribute }) } });
  const event = href => listeners.click({ target: { closest: () => ({ hasAttribute: () => false, matches: () => false, tagName: 'A', href, closest: selector => selector === 'header' ? {} : null }) } });
  const commands = () => Array.from(context.dataLayer, args => Array.from(args));
  const events = () => commands().filter(args => args[0] === 'event');
  return { context, location, click, event, requests, writes, events, commands, panel, windowListeners };
}

const late = setup({ query: '?email=private%40example.com&utm_source=google&utm_term=0989019836#secret' });
assert.equal(late.requests.length, 0, 'no Google download before consent');
assert.equal(late.events().length, 0, 'no queued historical interactions');
late.event('https://wa.me/593989019836?text=private-message');
late.click('data-consent-accept');
assert.equal(late.requests.length, 1);
assert.deepEqual(late.events().map(row => row[1]), ['page_view', 'view_item']);
late.click('data-consent-accept');
assert.equal(late.events().length, 2, 'repeat acceptance does not duplicate views');
late.event('https://wa.me/593989019836?text=private-message');
late.event('tel:+593989019836');
assert.deepEqual(late.events().slice(2).map(row => row[1]), ['whatsapp_click', 'phone_call_click']);
const payload = JSON.stringify(late.commands());
assert(!/private|example.com|0989019836|secret/.test(payload), 'personal URL/query/contact text never enters payloads');
assert(payload.includes('utm_source=google'), 'approved attribution preserved');
assert.equal(late.events()[1][2].value, 580);
assert.equal(late.events()[1][2].currency, 'USD');
late.click('data-consent-reject');
assert.equal(late.context['ga-disable-G-TESTONLY'], true);
assert.equal(late.events().length, 0);
assert.equal(late.location.reloaded, true, 'unload running client on withdrawal');
assert(late.writes.some(value => value.includes('Domain=simracingec.com')));
assert(!late.writes.some(value => value.startsWith('required_cookie=')));
late.event('tel:+593989019836');
assert.equal(late.events().length, 0, 'no events after withdrawal');

const rejected = setup({ stored: 'rejected' });
assert.equal(rejected.requests.length, 0);
assert.equal(rejected.panel.hidden, true);
const accepted = setup({ stored: 'accepted' });
assert.equal(accepted.events().filter(row => row[1] === 'page_view').length, 1);
accepted.windowListeners.pageshow({ persisted: true });
assert.equal(accepted.events().filter(row => row[1] === 'page_view').length, 2, 'back/forward restore is a real page view');
for (const host of ['localhost', '127.0.0.1', 'preview.simracing-ecuador-web.pages.dev', 'simracingec.com.evil.invalid']) {
  const preview = setup({ host, stored: 'accepted' });
  assert.equal(preview.requests.length, 0, host + ' excluded');
  assert.equal(preview.events().length, 0);
}
const unknown = setup({ path: '/not-found', stored: 'accepted' });
assert.equal(unknown.requests.length, 0, 'unknown paths cannot leak personal URLs');
const subdomain = setup({ host: 'www.simracingec.com', stored: 'rejected' });
assert(subdomain.writes.some(value => value.includes('Domain=simracingec.com')));
assert(subdomain.writes.some(value => value.includes('Domain=www.simracingec.com')));
const blocked = setup({ blocked: true });
blocked.click('data-consent-accept'); blocked.click('data-consent-reject');
assert.equal(blocked.context['ga-disable-G-TESTONLY'], true);
assert.equal(blocked.location.reloaded, undefined, 'retain in-memory denial when storage fails');
blocked.windowListeners.pageshow({ persisted: true });
assert.equal(blocked.location.reloaded, undefined, 'back/forward restore retains in-memory denial');
blocked.event('tel:+593989019836'); assert.equal(blocked.events().length, 0);

const partialStores = { local: new Map(), session: new Map() };
const partial = setup({ stored: 'accepted', stores: partialStores, localWriteBlocked: true });
assert.equal(partial.requests.length, 1);
partial.click('data-consent-reject');
assert.equal(partial.location.reloaded, true);
const afterPartial = setup({ path: '/productos', stores: partialStores, localWriteBlocked: true });
assert.equal(afterPartial.requests.length, 0, 'an older readable acceptance cannot override a saved rejection');
assert.equal(afterPartial.panel.hidden, true);

const sharedStores = { local: new Map(), session: new Map() };
const firstTab = setup({ stored: 'accepted', stores: sharedStores });
const secondTab = setup({ stores: { local: sharedStores.local, session: new Map(sharedStores.session) } });
firstTab.click('data-consent-reject');
secondTab.windowListeners.storage({ key: 'sre-consent-v1' });
assert.equal(secondTab.context['ga-disable-G-TESTONLY'], true, 'a rejection in another tab supersedes an older session record');
assert.equal(secondTab.location.reloaded, true);

const fallbackCookie = {};
const fallback = setup({ blocked: true, preferenceCookie: fallbackCookie });
fallback.click('data-consent-accept');
assert.equal(fallback.requests.length, 1);
assert(fallback.writes.some(value => value.startsWith('sre-consent-v1=') && !/Domain=|Max-Age=|Expires=/i.test(value)));
const fallbackNext = setup({ path: '/productos', blocked: true, preferenceCookie: fallbackCookie });
assert.equal(fallbackNext.requests.length, 1, 'session cookie preserves acceptance across navigation');
fallbackNext.click('data-consent-reject');
assert.equal(fallbackNext.location.reloaded, true);
const fallbackRejected = setup({ blocked: true, preferenceCookie: fallbackCookie });
assert.equal(fallbackRejected.requests.length, 0, 'session cookie preserves withdrawal across navigation');
assert.equal(fallbackRejected.panel.hidden, true);

// Removing an approved origin loses AI referrals; permissive matching leaks private URLs.
for (const host of ['chatgpt.com', 'www.perplexity.ai', 'perplexity.ai', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com']) {
  const referral = setup({ stored: 'accepted', referrer: `https://${host}/c/private-conversation?email=private%40example.com#secret` });
  assert.equal(referral.events()[0][2].page_referrer, `https://${host}/`, host + ': origin-only attribution');
}
for (const referrer of ['https://chatgpt.com.evil.invalid/c/private', 'https://chatgpt.com:8443/private', 'http://chatgpt.com/private', 'https://not-approved.invalid/private', 'not a URL']) {
  const unknownReferrer = setup({ stored: 'accepted', referrer });
  assert.equal(unknownReferrer.events()[0][2].page_referrer, '', 'unapproved or malformed origin is dropped');
}
for (const host of ['chatgpt.com', 'perplexity.ai', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com']) {
  const campaign = setup({ stored: 'accepted', referrer: '', productionConfig: true,
    query: `?utm_source=${host}&utm_medium=referral&utm_content=private%40example.com&email=private%40example.com#secret` });
  assert.equal(campaign.events()[0][2].page_location, `https://simracingec.com/moza-r3?utm_source=${host}&utm_medium=referral`);
  assert(!JSON.stringify(campaign.commands()).includes('private'), 'AI campaigns never admit arbitrary identifiers');
  const unconsented = setup({ referrer: `https://${host}/private`, productionConfig: true });
  assert.equal(unconsented.requests.length, 0, 'AI traffic still requires consent');
  assert.equal(unconsented.events().length, 0);
}
console.log('PASS: consent, late views, host gating, withdrawal, payload privacy and real catalogue amounts (no network)');
