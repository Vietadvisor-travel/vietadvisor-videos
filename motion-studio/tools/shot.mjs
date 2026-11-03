// usage: node tools/shot.mjs out.png W H "js expression drawing to ctx" [bg]
import { launch } from './browser.mjs'; import fs from 'fs';
const [out, w, h, code, bg] = process.argv.slice(2);
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('console', m => console.log('PAGE:', m.text())); page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const d = await page.evaluate(([w, h, code, bg]) => { const c = document.getElementById('c'); c.width = +w; c.height = +h; W = +w; H = +h; ctx = c.getContext('2d'); if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); } (new Function(code))(); return c.toDataURL(out_fmt()); function out_fmt(){return 'image/png'} }, [w, h, code, bg || '']);
fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); await browser.close();
