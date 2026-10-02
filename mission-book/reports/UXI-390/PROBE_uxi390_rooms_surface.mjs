// UXI-390: drive the Rooms SURFACE in a real browser, on a real hub, and open at least three rooms.
//
// Rounds 167-171 drove the Rooms data endpoints and the room UI modules by HTTP. What was still owed was
// the assembled surface: the hub page painting a room list and opening rooms. This does that.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const root = 'D:\\utopia-uxi390';
const hub = spawn(process.execPath, ['apps/rooms/hub/server.mjs'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let banner = '';
hub.stdout.on('data', (d) => { banner += d.toString(); });
hub.stderr.on('data', (d) => { banner += d.toString(); });

try {
  let port = null;
  for (let i = 0; i < 40 && !port; i++) {
    await sleep(500);
    const m = banner.match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    if (m) port = m[1];
  }
  if (!port) throw new Error(`could not read the hub port from its banner: ${banner.slice(0, 300)}`);
  console.log(`hub port from its own banner: ${port}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ locale: 'en-US' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 120)));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  // What the assembled surface actually contains, reported rather than assumed.
  const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  console.log(`SURFACE TEXT (${bodyText.length} chars): ${bodyText.slice(0, 600)}`);
  console.log(`page errors: ${errors.length}${errors.length ? ' -> ' + errors.join(' | ') : ''}`);

  // Candidate room controls: anything that looks like a room entry, by class or by nav role.
  const candidates = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('a,button,[role="button"],[data-room],li')) {
      const label = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!label || label.length > 60) continue;
      out.push({ tag: el.tagName.toLowerCase(), cls: el.className || '', room: el.getAttribute('data-room') || '', label });
    }
    return out;
  });
  console.log(`candidate room controls: ${candidates.length}`);
  for (const c of candidates.slice(0, 14)) console.log(`  <${c.tag} class="${String(c.cls).slice(0, 30)}" data-room="${c.room}"> ${c.label}`);

  // Open rooms: prefer data-room entries, else labelled controls, and require the surface to CHANGE.
  const opened = [];
  const seen = new Set();
  for (const c of candidates) {
    if (opened.length >= 3) break;
    const key = c.room || c.label;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const before = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    try {
      const sel = c.room ? `[data-room="${c.room}"]` : null;
      if (sel) await page.locator(sel).first().click({ timeout: 4000 });
      else await page.getByText(c.label, { exact: true }).first().click({ timeout: 4000 });
    } catch { continue; }
    await sleep(1200);
    const after = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    if (after !== before) { opened.push(`${key} (surface changed, ${after.length} chars)`); }
  }
  console.log(`ROOMS OPENED WITH A SURFACE CHANGE: ${opened.length}`);
  for (const o of opened) console.log(`  ${o}`);
  console.log(`MEETS >=3: ${opened.length >= 3}`);
  const finalText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  console.log(`FINAL SURFACE TEXT: ${finalText.slice(0, 400)}`);
  await browser.close();
} finally {
  hub.kill();
}
