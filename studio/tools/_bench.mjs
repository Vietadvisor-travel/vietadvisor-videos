import { launch } from '/home/claude/work/va-studio/tools/browser.mjs'; import fs from 'fs';
const browser = await launch(); const page = await browser.newPage();
await page.goto('file:///home/claude/work/va-studio/studio.html'); await page.evaluate(() => window.READY);
const r = await page.evaluate((txt) => { const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = 1080; c.height = 1920; W = 1080; H = 1920; ctx = c.getContext('2d'); loadEpisode(ep);
  window.W3_NODOF = true; const out = []; for (const t of [8, 9, 27, 28, 52, 53]) { const t0 = performance.now(); renderEpisode(t); out.push([t, Math.round(performance.now() - t0)]); } return out; }, fs.readFileSync("stories/_b.story", "utf8"));
console.log(JSON.stringify(r)); await browser.close();
