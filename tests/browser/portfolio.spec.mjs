import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync('src/content/site.json', 'utf8'));
const assetPath = path => path.replace('./assets/', './');

test('homepage assets, project navigation, and accessibility', async ({ page, request }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Practical software.');
  await expect(page.locator('.project-card')).toHaveCount(site.projectOrder.length);
  await expect(page.locator('.project-card').filter({ hasText: 'Echo Mountain' }).getByRole('link', { name: 'Play Echo Mountain' })).toHaveAttribute('href', 'https://dlg309.github.io/Echo-Mountain/');
  for (const image of await page.locator('.project-card img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  for (const path of [site.resume, site.resumeDetailed]) {
    const response = await request.get(assetPath(path));
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  }
  const icon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect((await request.get(icon)).ok()).toBe(true);
  expect((await request.get('./visuals/portfolio-social.png')).ok()).toBe(true);
  if (testInfo.project.name === 'desktop') {
    await page.locator('.landscape-project[href="#tempo"]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#tempo .case-trigger')).toHaveAttribute('aria-expanded', 'true');
  } else {
    await expect(page.locator('.project-landscape')).toHaveCount(0);
  }
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(errors).toEqual([]);
});

for (const reducedMotion of ['no-preference', 'reduce']) {
  test(`accordion visibly interpolates open and closed heights (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('./');
    const trigger = page.locator('#alpfa .case-trigger');
    await trigger.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('/CaseDetails-')));
    const opening = await trigger.evaluate(async button => {
      button.click();
      await new Promise(requestAnimationFrame);
      const panel = document.querySelector('#alpfa .case-panel');
      const animation = panel.getAnimations().find(item => item.animationName === 'case-study-open');
      if (!animation) return null;
      const duration = animation.effect.getTiming().duration;
      animation.pause();
      animation.currentTime = duration / 3;
      await new Promise(requestAnimationFrame);
      const height = panel.getBoundingClientRect().height;
      const natural = panel.querySelector('.case-measure').getBoundingClientRect().height;
      animation.play();
      return { duration, height, natural };
    });
    expect(opening).not.toBeNull();
    expect(opening.duration).toBe(reducedMotion === 'reduce' ? 300 : 480);
    expect(opening.height).toBeGreaterThan(0);
    expect(opening.height).toBeLessThan(opening.natural * .9);
    const panel = page.locator('#alpfa .case-panel');
    await expect.poll(() => panel.evaluate(node => Math.abs(node.getBoundingClientRect().height - node.querySelector('.case-measure').getBoundingClientRect().height))).toBeLessThan(2);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  });
}

test('cold lazy load and gallery stay measured across scrolling and rapid toggles', async ({ page }) => {
  await page.route('**/CaseDetails-*.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 550));
    await route.continue();
  });
  await page.goto('./');
  const trigger = page.locator('#alpfa .case-trigger');
  await trigger.evaluate(node => node.click());
  await expect(page.locator('#alpfa .case-body')).toBeAttached();
  const panel = page.locator('#alpfa .case-panel');
  const measured = () => panel.evaluate(node => Math.abs(node.getBoundingClientRect().height - node.querySelector('.case-measure').getBoundingClientRect().height));
  await expect.poll(measured).toBeLessThan(2);
  await page.locator('#alpfa .more-screens > summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#alpfa .more-screens')).toHaveAttribute('open', '');
  await expect.poll(measured).toBeLessThan(2);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('#alpfa .more-screens')).toHaveAttribute('open', '');
  await trigger.evaluate(node => node.click());
  await expect(panel).toBeHidden();
  await trigger.evaluate(node => node.click());
  await page.waitForTimeout(80);
  await trigger.evaluate(node => node.click());
  await expect(panel).toBeHidden();
  await trigger.evaluate(node => node.click());
  await expect.poll(measured).toBeLessThan(2);
});

test('contact actions copy the email and explain clipboard failure', async ({ page, context }) => {
  await page.goto('./');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.locator('.contact-actions__status')).toHaveText('Email address copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email);
  await expect(page.getByRole('link', { name: 'Email Diego' })).toHaveAttribute('href', `mailto:${site.email}`);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async () => { throw new Error('Clipboard unavailable in test'); } },
  }));
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.locator('.contact-actions__status')).toContainText(`Email me at ${site.email}`);
});

test('keyboard navigation, compact header, and mobile focus return', async ({ page }, testInfo) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.locator('.brand').focus();
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
  await expect(page.locator('.site-header')).toHaveClass(/site-header--scrolled/);
  await page.locator('.menu-toggle').evaluate(async menu => {
    await Promise.all(menu.getAnimations().map(animation => animation.finished.catch(() => undefined)));
  });
  if (testInfo.project.name === 'desktop') {
    const resume = await page.locator('.header-resume').boundingBox();
    const menu = await page.getByRole('button', { name: 'Open navigation menu' }).boundingBox();
    expect(resume.x + resume.width + 8).toBeLessThanOrEqual(menu.x);
  }
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
