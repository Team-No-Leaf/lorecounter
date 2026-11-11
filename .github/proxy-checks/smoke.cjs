const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const site = path.resolve(process.argv.find(value => value.startsWith('--site='))?.slice(7) || '../../_site');
const results = path.join(__dirname, 'results');
const mounts = ['/proxy-printer/', '/lorecounter/proxies/'];
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpeg': 'image/jpeg' };
const fixture = {
  id: 'smoke-card', name: 'Deployment Test Card', version: 'Loading Check',
  type: ['Character'], classifications: ['Hero'], cost: 2, inkwell: true,
  ink: 'Amber', strength: 2, willpower: 3, lore: 1, rarity: 'Common',
  text: 'Gain 1 lore.', illustrators: ['Deployment Test'],
  set: { code: '9', name: 'Test Set', released_at: '2025-01-01' }
};

async function checkPage(browser, origin, mount, fault) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  page.setDefaultTimeout(fault ? 2000 : 15000);
  const errors = [];
  const assetResponses = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().includes(`${mount}assets/`)) {
      assetResponses.push(response);
      if (!response.ok()) errors.push(`Asset HTTP ${response.status()}: ${response.url()}`);
    }
  });
  page.on('requestfailed', request => {
    if (request.url().includes(`${mount}assets/`)) errors.push(`Asset request failed: ${request.url()}`);
  });
  try {
    // External services cannot make a deployment pass or fail unpredictably.
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.pathname.startsWith('/api/catalog/')) return route.fulfill({ status: 404, json: {} });
      if (url.hostname === 'api.lorcast.com') return route.fulfill({ json: { results: url.pathname.endsWith('/sets') ? [] : [fixture] } });
      if (url.origin !== origin) return route.abort();
      if (url.pathname.startsWith('/brand/')) return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"/>' });
      if (fault && url.pathname.startsWith(`${mount}assets/index-`) && url.pathname.endsWith('.js')) {
        return route.fulfill(fault === 'mime'
          ? { contentType: 'text/html', body: '<html>Wrong asset route</html>' }
          : { contentType: 'application/javascript', body: 'throw new Error("Injected startup failure");' });
      }
      return route.continue();
    });
    await page.goto(`${origin}${mount}`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Proxy Printer', exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Selection', exact: true }).waitFor();
    assert.equal(await page.locator('.previewCard.empty').count(), 9);
    await page.getByRole('button', { name: 'Lorcast', exact: true }).click();
    await page.getByPlaceholder('Search cards, text, set, ink...').fill('Deployment Test Card');
    await page.getByRole('button', { name: 'Search', exact: true }).click();
    await page.locator('.cardRow').filter({ hasText: 'Deployment Test Card' }).getByTitle('Add card', { exact: true }).click();
    await page.getByText('1 cards across 1 pages', { exact: true }).waitFor();
    assert.equal(await page.locator('.previewCard:not(.empty)').count(), 1);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'PDF', exact: true }).click();
    const download = await downloadPromise;
    const pdf = await download.path();
    assert.equal(fs.readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');
    assert.ok(assetResponses.some(response => /\.js$/.test(new URL(response.url()).pathname)), 'No JavaScript bundle loaded');
    assert.ok(assetResponses.some(response => /\.css$/.test(new URL(response.url()).pathname)), 'No stylesheet loaded');
    for (const response of assetResponses) {
      const extension = path.extname(new URL(response.url()).pathname);
      if (extension === '.js') assert.match(response.headers()['content-type'] || '', /javascript/);
      if (extension === '.css') assert.match(response.headers()['content-type'] || '', /text\/css/);
    }
    assert.deepEqual(errors, [], 'Browser runtime or asset errors');
    await page.screenshot({ path: path.join(results, `${mount.includes('lorecounter') ? 'pages' : 'custom-domain'}.png`), fullPage: true });
  } catch (error) {
    await page.screenshot({ path: path.join(results, `failure-${fault || 'unexpected'}.png`), fullPage: true }).catch(() => {});
    throw new Error(`Proxy smoke test failed at ${mount}: ${error.message}; runtime: ${errors.join('; ')}`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(results, { recursive: true });
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const mount = mounts.find(prefix => pathname.startsWith(prefix));
    const relative = mount ? `proxies/${pathname.slice(mount.length) || 'index.html'}` : pathname.slice(1) || 'index.html';
    const file = path.resolve(site, relative);
    if (!file.startsWith(site + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch();
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const mount of mounts) await checkPage(browser, origin, mount);
    if (process.argv.includes('--self-test')) {
      for (const fault of ['mime', 'crash']) {
        await assert.rejects(checkPage(browser, origin, mounts[0], fault), /Proxy smoke test failed/);
        console.log(`Confirmed deployment gate rejects injected ${fault} failure.`);
      }
    }
    console.log('Passed both hosting paths: startup, asset MIME types, search, selection, nine preview slots, PDF download.');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exit(1); });
