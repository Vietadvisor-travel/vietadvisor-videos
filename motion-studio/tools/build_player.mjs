// Build player.html: a single self-contained page that previews any episode in 16:9 / 9:16 / 1:1
// and exports MP4 in the browser (WebCodecs + mp4-muxer). Usage: node tools/build_player.mjs out/player.html
import fs from 'fs';
const out = process.argv[2] || 'pkg/player.html';
const ENGINE = ['geo_data', 'core', 'rig','acting','charstyle', 'presets', 'props_food', 'props_objects', 'props_vehicles', 'props_nature', 'places', 'physics', 'map', 'ui', 'fx', 'look', 'camera', 'timeline', 'cinema', 'stickers', 'generators', 'post', 'storyboard', 'beats', 'world','setpieces','framing', 'sheets'];
const eng = ENGINE.map(f => `/* ===== engine/${f}.js ===== */\n` + fs.readFileSync(`engine/${f}.js`, 'utf8')).join('\n');
const libList = (fs.readFileSync('engine/library/index.js', 'utf8').match(/\[([^\]]*)\]/) || [, ''])[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
const imagesJs = fs.existsSync('engine/library/images.js') ? fs.readFileSync('engine/library/images.js', 'utf8') : '';
const lib = imagesJs + '\n' + libList.map(f => `/* ===== engine/library/${f}.js ===== */\n` + fs.readFileSync(`engine/library/${f}.js`, 'utf8')).join('\n');
const eps = [...fs.readdirSync('stories').filter(f => f.endsWith('.story')).map(f => ({ id: f, src: fs.readFileSync(`stories/${f}`, 'utf8') })), ...['ha-giang-loop', 'camera-reel', '_template'].map(f => ({ id: f + '.js', src: fs.readFileSync(`episodes/${f}.js`, 'utf8') }))];
const ff = (pkg, file, fam, w) => { const d = fs.readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`).toString('base64'); return `@font-face{font-family:"${fam}";font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${d}) format("woff2")}`; };
const embedded = ['latin', 'latin-ext', 'vietnamese'].flatMap(sub => [ff('baloo-2', `baloo-2-${sub}-800-normal.woff2`, 'Baloo 2', 800), ff('baloo-2', `baloo-2-${sub}-700-normal.woff2`, 'Baloo 2', 700), ff('be-vietnam-pro', `be-vietnam-pro-${sub}-800-normal.woff2`, 'Be Vietnam Pro', 800), ff('be-vietnam-pro', `be-vietnam-pro-${sub}-900-normal.woff2`, 'Be Vietnam Pro', 900), ff('be-vietnam-pro', `be-vietnam-pro-${sub}-600-normal.woff2`, 'Be Vietnam Pro', 600)]).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vietadvisor Motion Studio</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>${embedded}</style>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@800&family=Noto+Sans+JP:wght@900&family=Noto+Sans+KR:wght@900&family=Noto+Sans+SC:wght@900&display=block" rel="stylesheet">
<style>
:root{--bg:#f3e6c4;--ink:#2b1d16;--brand:#ee4d2d;--card:#fff8ea;--muted:#7a6450}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1f1814;--ink:#f3e6c4;--card:#2b221c;--muted:#bfa98f}}
:root[data-theme="dark"]{--bg:#1f1814;--ink:#f3e6c4;--card:#2b221c;--muted:#bfa98f}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:600 15px "Be Vietnam Pro",system-ui,sans-serif}
header{display:flex;align-items:center;gap:12px;padding:14px 16px;flex-wrap:wrap}h1{font:800 22px "Baloo 2",sans-serif;margin:0}h1 b{color:var(--brand)}
.wrap{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;padding:0 16px 24px}@media(max-width:860px){.wrap{grid-template-columns:1fr}}
.stage{background:#111;border-radius:14px;display:flex;align-items:center;justify-content:center;min-height:200px;overflow:hidden}
canvas{max-width:100%;max-height:78vh;display:block}
.panel{background:var(--card);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px}
label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
select,button,input[type=file]{font:inherit;color:var(--ink);background:var(--bg);border:2px solid var(--ink);border-radius:10px;padding:8px 10px;width:100%}
button{cursor:pointer;font-weight:800}button.primary{background:var(--brand);color:#fff;border-color:var(--brand)}
.row{display:flex;gap:8px}.row>*{flex:1}input[type=range]{width:100%;accent-color:var(--brand)}
.time{font-variant-numeric:tabular-nums;font-size:13px;color:var(--muted)}#status{font-size:13px;color:var(--muted);min-height:18px}
</style></head><body>
<header><h1><b>●</b> Vietadvisor Motion Studio</h1><span class="time" id="info"></span></header>
<div class="wrap"><div><div class="stage"><canvas id="c" width="1920" height="1080"></canvas></div>
<input type="range" id="scrub" min="0" max="1000" value="0"><div class="time" id="tm">0.00 / 0.00 s</div></div>
<div class="panel">
<label>Episode</label><select id="ep"></select>
<label>Load episode (.js) or storyboard (.story)</label><input type="file" id="file" accept=".js,.story,.txt">
<label>Format</label><select id="fmt"><option value="1920x1080">16:9 — YouTube</option><option value="1080x1920">9:16 — Reels / TikTok / Shorts</option><option value="1080x1080">1:1</option><option value="1080x1350">4:5</option></select>
<div class="row"><button id="play" class="primary">▶ Play</button><button id="restart">⏮</button></div>
<label>Export</label><button id="export">⬇ Export MP4 (frame-accurate)</button><button id="png">🖼 Save current frame (PNG)</button>
<div id="status"></div>
<label>Preview quality</label><select id="q"><option value="1">Full</option><option value="0.5" selected>Half (smoother preview)</option></select>
</div></div>
<script>${eng}
${lib}</script>
<script>
const EPISODES = ${JSON.stringify(eps)};
const cv = document.getElementById('c'); ctx = cv.getContext('2d');
let cur = null, t = 0, playing = false, last = 0, fullW = 1920, fullH = 1080, scale = .5;
const $ = id => document.getElementById(id);
function loadSrc(src) { window.EPISODE = null; try { if (/^\s*(title|look|sources)\s*:|^\s*#\s*\w+/m.test(src) && !/window\.EPISODE/.test(src)) window.EPISODE = SB.compile(src); else (new Function(src))(); } catch (e) { $('status').textContent = 'Episode error: ' + e.message; return; } cur = window.EPISODE; setFormat(); }
function setFormat() { [fullW, fullH] = $('fmt').value.split('x').map(Number); scale = +$('q').value; cv.width = Math.round(fullW * scale); cv.height = Math.round(fullH * scale); W = fullW; H = fullH; loadEpisode(cur); $('info').textContent = (cur.title || '') + ' · ' + episodeDuration().toFixed(1) + ' s'; draw(); }
function draw() { ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); W = fullW; H = fullH; const s = scale; const main = ctx; const off = draw._off && draw._off.width === fullW && draw._off.height === fullH ? draw._off : (draw._off = mkCanvas(fullW, fullH)); if (s !== 1) { ctx = off.getContext('2d'); renderEpisode(t); ctx = main; main.drawImage(off, 0, 0, cv.width, cv.height); } else renderEpisode(t); const d = episodeDuration(); $('tm').textContent = t.toFixed(2) + ' / ' + d.toFixed(2) + ' s'; $('scrub').value = Math.round(t / d * 1000); }
function loop(ts) { if (!playing) return; const dt = last ? (ts - last) / 1000 : 0; last = ts; t += dt; if (t >= episodeDuration()) { t = 0; } draw(); requestAnimationFrame(loop); }
$('play').onclick = () => { playing = !playing; $('play').textContent = playing ? '⏸ Pause' : '▶ Play'; last = 0; if (playing) requestAnimationFrame(loop); };
$('restart').onclick = () => { t = 0; draw(); };
$('scrub').oninput = e => { t = e.target.value / 1000 * episodeDuration(); draw(); };
$('fmt').onchange = setFormat; $('q').onchange = setFormat;
$('ep').onchange = () => loadSrc(EPISODES.find(e => e.id === $('ep').value).src);
$('file').onchange = async e => { const f = e.target.files[0]; if (f) loadSrc(await f.text()); };
$('png').onclick = () => { const c = mkCanvas(fullW, fullH); const m = ctx; ctx = c.getContext('2d'); W = fullW; H = fullH; renderEpisode(t); ctx = m; const a = document.createElement('a'); a.download = 'frame_' + t.toFixed(2) + '.png'; a.href = c.toDataURL('image/png'); a.click(); };
$('export').onclick = async () => {
  if (!('VideoEncoder' in window)) { $('status').textContent = 'This browser lacks WebCodecs — use Chrome/Edge, or tools/render.mjs.'; return; }
  playing = false; $('play').textContent = '▶ Play';
  const { Muxer, ArrayBufferTarget } = await import('https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/+esm');
  const fps = cur.fps || 30, dur = episodeDuration(), N = Math.round(dur * fps);
  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: 'avc', width: fullW, height: fullH }, fastStart: 'in-memory' });
  const enc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: e => $('status').textContent = e.message });
  enc.configure({ codec: fullW * fullH > 1920 * 1088 ? 'avc1.640033' : 'avc1.640028', width: fullW, height: fullH, bitrate: 12e6, framerate: fps });
  const c = mkCanvas(fullW, fullH); const m = ctx;
  for (let f = 0; f < N; f++) { ctx = c.getContext('2d'); W = fullW; H = fullH; renderEpisode(f / fps); ctx = m;
    const vf = new VideoFrame(c, { timestamp: Math.round(f * 1e6 / fps), duration: Math.round(1e6 / fps) }); enc.encode(vf, { keyFrame: f % (fps * 2) === 0 }); vf.close();
    if (enc.encodeQueueSize > 8) await new Promise(r => setTimeout(r, 0)); if (f % 15 === 0) { $('status').textContent = 'Encoding ' + Math.round(f / N * 100) + '%'; await new Promise(r => setTimeout(r, 0)); } }
  await enc.flush(); muxer.finalize(); const blob = new Blob([muxer.target.buffer], { type: 'video/mp4' });
  const a = document.createElement('a'); a.download = (cur.title || 'episode').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '_' + $('fmt').value + '.mp4'; a.href = URL.createObjectURL(blob); a.click(); $('status').textContent = 'Done — ' + (blob.size / 1e6).toFixed(1) + ' MB';
};
EPISODES.forEach(e => { const o = document.createElement('option'); o.value = e.id; o.textContent = e.id; $('ep').appendChild(o); });
document.fonts.ready.then(() => loadImages()).then(() => Promise.all(['800 40px "Baloo 2"', '800 40px "Be Vietnam Pro"', '900 40px "Be Vietnam Pro"'].map(f => document.fonts.load(f, 'Hà Giang')))).then(() => loadSrc(EPISODES[0].src));
</script></body></html>`;
let page = html;
if (process.argv.includes('--fragment')) { // Artifact-hosted version: no document skeleton; downloads are disabled in the viewer
  page = html.replace(/^<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport"[^>]*>\n?/, '').replace('</head><body>', '').replace(/<\/body><\/html>\s*$/, '')
    .replace("a.href = c.toDataURL('image/png'); a.click();", "c.toBlob(b => saveFile(a.download, b), 'image/png');")
    .replace("a.href = URL.createObjectURL(blob); a.click();", "saveFile(a.download, blob);")
    .replace('<label>Export</label>', '<label>Export</label><p class="time" id="dlnote" style="margin:0">Saving asks for confirmation in the viewer.</p>')
    .replace(/<\/script>\s*$/, `
let DL = null; (async () => { try { DL = await (window.claude && claude.use ? claude.use('downloads') : null); } catch (e) {} if (!DL) document.getElementById('dlnote').textContent = 'Saving is unavailable in this view — use player.html from the package.'; })();
async function saveFile(name, blob) { if (!DL) { document.getElementById('dlnote').textContent = 'Saving unavailable here — use player.html from the package.'; return; }
  try { await DL.save({ filename: name, data: blob }); } catch (e) { document.getElementById('dlnote').textContent = 'Not saved (' + (e.code || e.message || e) + ').'; } }
</script>`); }
fs.writeFileSync(out, page); console.log('wrote', out, (page.length / 1024).toFixed(0) + ' KB');
