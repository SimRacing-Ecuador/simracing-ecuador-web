// Run with Playwright CLI after opening this site on a local static server:
// playwright-cli run-code --filename=tests/verify_advice_navigation.js
// Exercises the real navigation with both cold and warmed home-page assets.
async (page) => {
  const base = new URL(page.url()).origin;
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  const results = [];
  for (const motion of ['no-preference', 'reduce']) {
    await page.goto('about:blank');
    await page.emulateMedia({ reducedMotion: motion });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const origin of ['productos', 'moza-r9-kit']) {
        await page.goto(base + '/' + origin + '.html');
        if (width <= 960) {
          await page.locator('#menu-toggle').click();
          await page.waitForFunction(() => document.activeElement === document.querySelector('#site-nav a'));
        }
        await Promise.all([
          page.waitForURL('**/index.html#comunidad'),
          page.locator('#site-nav a').filter({ hasText: 'Asesoría' }).click()
        ]);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1800);
        const data = await page.evaluate(() => {
          const section = document.querySelector('#comunidad');
          const heading = document.querySelector('#community-title');
          const box = section.getBoundingClientRect();
          const title = heading.getBoundingClientRect();
          return {
            url: location.href,
            scrollY,
            targetTop: box.top,
            targetBottom: box.bottom,
            headingTop: title.top,
            headingBottom: title.bottom,
            headingVisible: getComputedStyle(heading).visibility === 'visible' && Number(getComputedStyle(heading).opacity) > 0.9,
            headerHeight: document.querySelector('[data-header]').offsetHeight,
            menuOpen: document.querySelector('#site-nav').classList.contains('is-open'),
            overflow: document.documentElement.scrollWidth > innerWidth
          };
        });
        if (data.targetTop < -2 || data.targetTop > data.headerHeight + 2 || data.headingTop < 0 || data.headingBottom > 900 || !data.headingVisible || data.menuOpen || data.overflow) throw new Error('Advice destination missed from ' + origin + ' at ' + width + ' with ' + motion + ': ' + JSON.stringify(data));
        results.push({ origin, width, motion, targetTop: data.targetTop, pass: true });
      }
    }
  }
  if (failures.length) throw new Error(failures.join('; '));
  return { checks: results.length, exceptions: failures, results };
}
