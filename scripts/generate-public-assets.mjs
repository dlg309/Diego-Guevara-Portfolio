import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH && { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }),
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const [source, output] of [
    ['docs/resume-one-page.html', 'public/Diego_Guevara_Resume_One_Page.pdf'],
    ['docs/resume.html', 'public/Diego_Guevara_Resume.pdf'],
  ]) {
    await page.goto(pathToFileURL(resolve(source)).href);
    await page.pdf({ path: output, format: 'Letter', preferCSSPageSize: true, printBackground: true, tagged: true });
    console.log(`Generated ${output}`);
  }
  await page.goto(pathToFileURL(resolve('docs/share-preview.html')).href);
  await page.screenshot({ path: 'public/visuals/portfolio-social.png' });
  console.log('Generated public/visuals/portfolio-social.png (1200 × 630)');
} finally {
  await browser.close();
}
