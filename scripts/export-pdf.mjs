// Saves /paper as a PDF: builds if needed, starts `astro preview`, prints with Playwright.
// Usage: npm run pdf   (first time: npx playwright install chromium; add -- --no-build to skip rebuilding)
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4329;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = 'dist/country-briefing-politics-risk.pdf';

if (!process.argv.includes('--no-build') || !existsSync('dist/paper/index.html')) {
  console.log('Building site…');
  const build = spawnSync('npx', ['astro', 'build'], { stdio: 'inherit' });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

// Astro 7 runs `astro preview` as a background daemon; stop any old one so we serve this build,
// and stop ours when done.
const stopPreview = () => spawnSync('npx', ['astro', 'preview', 'stop'], { stdio: 'ignore' });
stopPreview();
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], { stdio: 'ignore' });
const stop = () => {
  server.kill('SIGTERM');
  stopPreview();
};

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/paper/`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not start on ${BASE} within ${timeoutMs / 1000}s`);
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${BASE}/paper/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%;font-size:8px;color:#5d6873;padding:0 1in;display:flex;justify-content:space-between;font-family:Georgia,serif"><span>Singapore and Vietnam: Politics and Risk</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
  });
  await browser.close();
  console.log(`PDF saved to ${OUT}`);
} catch (err) {
  console.error(err.message);
  if (/Executable doesn't exist/.test(err.message)) console.error('Run: npx playwright install chromium');
  process.exitCode = 1;
} finally {
  stop();
}
