/* =====================================================================
   STICKERS — real photos inside the cartoon world (collage / documentary style).
   Images come from tools/sticker.py → engine/library/images.js (data URLs, so canvases stay exportable).
   Layer: { type:'image', img:'pho_hanoi', x, y, h:420 (stage px), style:'sticker'|'polaroid'|'torn'|'plain'|'cover',
            rot, wobble:1, anchor:'center'|'bottom', label:'text', in:{type:'slap'} }
   'cover' fills the frame with a slow Ken-Burns push (documentary plate) — use as a background.
   ===================================================================== */
'use strict';
window.IMAGES = window.IMAGES || {};
// Footage frames (role clip / stream:true in images.json) are NOT embedded: they load from disk the first time a frame
// asks for them. renderReady(t) draws, waits for any frames that were requested, and draws again, so every exported
// frame is complete. A small LRU keeps memory flat however many clips an episode uses.
const _IMG = {}, _ppPend = new Set(), _ppLRU = [];
const IMG = new Proxy(_IMG, { get(o, id) { if (id in o || typeof id !== 'string') return o[id]; const m = window.IMAGES && window.IMAGES[id];
  if (!m || !m.stream || !m.src) return undefined; const im = new Image(); const p = new Promise(res => { im.onload = im.onerror = () => { _ppPend.delete(p); res(); }; }); _ppPend.add(p); im.src = m.src; o[id] = im;
  _ppLRU.push(id); if (_ppLRU.length > 900) { const old = _ppLRU.shift(); delete o[old]; } return im; } });
window.renderReady = async t => { renderEpisode(t); if (!_ppPend.size) return; for (let k = 0; k < 3 && _ppPend.size; k++) await Promise.all([..._ppPend]); renderEpisode(t); };
function loadImages() { // decode a few at a time and retry: hundreds of parallel decodes make Chromium drop some (seen on ep. 4)
  const todo = Object.entries(window.IMAGES).filter(([id, m]) => m.data && !_IMG[id]); // _IMG, not IMG: touching the proxy would start streaming every footage frame
  const one = async ([id, m]) => { for (let k = 0; k < 4; k++) { const im = new Image(); im.src = m.data; try { await im.decode(); IMG[id] = im; return; } catch (e) { await new Promise(r => setTimeout(r, 150 * (k + 1))); } } const im = new Image(); im.src = m.data; IMG[id] = im; console.warn('image failed', id); };
  let i = 0; const worker = async () => { while (i < todo.length) await one(todo[i++]); }; return Promise.all(Array.from({ length: 6 }, worker)); }
const _stk = {};
function stickerCanvas(id, style) {
  const key = id + '|' + style; if (_stk[key]) return _stk[key]; const im = IMG[id]; if (!im || !im.naturalWidth) return null;
  const meta = window.IMAGES[id] || {}; const w = im.naturalWidth, h = im.naturalHeight, cut = meta.cut !== false;
  const b = Math.round(Math.max(w, h) * .028) + 4; // white border width
  let c, g;
  if (style === 'polaroid' || ((style === 'sticker' || style === 'torn') && !cut)) {
    const pad = Math.round(Math.max(w, h) * .05), bot = style === 'polaroid' ? pad * 3.2 : pad; c = mkCanvas(w + pad * 2, h + pad + bot); g = c.getContext('2d');
    if (style === 'torn' || (style === 'sticker' && !cut)) { const r = rng(id.length * 7); g.beginPath(); const N = 40; const pt = (x, y) => g.lineTo(x, y);
      g.moveTo(0, r() * 6); for (let i = 1; i <= N; i++) pt(i / N * c.width, r() * 8); for (let i = 1; i <= N; i++) pt(c.width - r() * 8, i / N * c.height); for (let i = N - 1; i >= 0; i--) pt(i / N * c.width, c.height - r() * 8); for (let i = N - 1; i > 0; i--) pt(r() * 8, i / N * c.height); g.closePath(); g.fillStyle = '#fbf6ea'; g.fill(); g.save(); g.clip(); }
    else { g.fillStyle = '#fbf8f1'; g.fillRect(0, 0, c.width, c.height); }
    g.drawImage(im, pad, pad, w, h); g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 2; g.strokeRect(pad, pad, w, h); if (style === 'torn' || (style === 'sticker' && !cut)) g.restore();
  } else if (style === 'sticker' || style === 'torn') {
    c = mkCanvas(w + b * 2 + 4, h + b * 2 + 4); g = c.getContext('2d'); const sil = mkCanvas(w, h), sg = sil.getContext('2d'); sg.drawImage(im, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#fffdf7'; sg.fillRect(0, 0, w, h);
    for (let a = 0; a < TAU; a += TAU / 24) g.drawImage(sil, b + 2 + Math.cos(a) * b, b + 2 + Math.sin(a) * b); g.drawImage(sil, b + 2, b + 2);
    // thin ink edge outside the white border (matches the cartoon outline)
    const edge = mkCanvas(c.width, c.height), eg = edge.getContext('2d'); eg.drawImage(c, 0, 0); eg.globalCompositeOperation = 'source-in'; eg.fillStyle = C.ink; eg.fillRect(0, 0, c.width, c.height);
    const out = mkCanvas(c.width + 6, c.height + 6), og = out.getContext('2d'); for (let a = 0; a < TAU; a += TAU / 12) og.drawImage(edge, 3 + Math.cos(a) * 2.5, 3 + Math.sin(a) * 2.5); og.drawImage(c, 3, 3); og.drawImage(im, b + 5, b + 5); c = out;
  } else { c = mkCanvas(w, h); c.getContext('2d').drawImage(im, 0, 0); }
  return (_stk[key] = c);
}
function drawSticker(id, x, y, hPx, o = {}, t = 0) {
  const style = o.style || 'sticker'; const u = U();
  if (style === 'cover') { const im = IMG[id]; if (!im || !im.naturalWidth) return; const p = clamp(t / (o.dur || 6)); const z = (o.z0 ?? 1.04) + ((o.z1 ?? 1.14) - (o.z0 ?? 1.04)) * E.inOut(p); const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight) * z;
    const fx = o.focus ? o.focus[0] : .5, fy = o.focus ? o.focus[1] : .5; ctx.save(); ctx.translate(W / 2, H / 2); ctx.drawImage(im, -im.naturalWidth * sc * fx + (fx - .5) * W * .0, -im.naturalHeight * sc * fy, im.naturalWidth * sc, im.naturalHeight * sc); ctx.restore();
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.hypot(W, H) * .6); g.addColorStop(0, 'rgba(20,10,5,0)'); g.addColorStop(1, 'rgba(20,10,5,.45)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); return; }
  const c = stickerCanvas(id, style); if (!c) { // missing image: draw a labelled placeholder so the layout still reads
    sRR(x - hPx * .4, y - hPx * .5, hPx * .8, hPx, 16 * u, '#e9dcc0', { lw: 5 * u }); T(id, x, y, { size: 30 * u, font: 'body', fill: C.inkSoft, lw: 0 }); return; }
  const s = hPx / c.height, wob = o.wobble === false ? 0 : Math.sin(Math.floor(t * 8) * 1.7 + id.length) * .012;
  ctx.save(); ctx.translate(x, y); ctx.rotate((o.rot || 0) + wob); const ay = o.anchor === 'bottom' ? -c.height * s : -c.height * s / 2;
  ctx.save(); ctx.globalAlpha *= .28; ctx.filter = `blur(${(6 * u).toFixed(1)}px)`; ctx.drawImage(c, -c.width * s / 2 + 10 * u, ay + 14 * u, c.width * s, c.height * s); ctx.restore();
  ctx.drawImage(c, -c.width * s / 2, ay, c.width * s, c.height * s);
  if (o.label) { const ls = clamp(hPx / u / 9, 30, 46); UIbanner(0, ay + c.height * s + (style === 'polaroid' ? -c.height * s * .07 : 6 * u), o.label, u, '#fffaf0', C.ink, ls); }
  if (LINT.on) { const m = ctx.getTransform(); LINT.boxes.push({ k: 'prop', s: id, x0: m.e - c.width * s / 2 * m.a, x1: m.e + c.width * s / 2 * m.a, y0: m.f + ay * m.d, y1: m.f + (ay + c.height * s) * m.d }); }
  ctx.restore();
}

// a photo plate as a place: the photo (stylised by `sticker.py plate`, or raw) fills the stage; actors stand at groundFrac
function photoPlace(id, gf = .86) { const pid = 'photo_' + id; if (PLACE[pid]) return pid;
  defPlace(pid, 'Photo plate ' + id, 'photo background', 0, (t, o) => { const im = IMG[id]; ctx.fillStyle = '#2a2420'; ctx.fillRect(0, 0, W, H); if (!im || !im.naturalWidth) return; const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight) * 1.02; ctx.drawImage(im, (W - im.naturalWidth * sc) / 2, (H - im.naturalHeight * sc) / 2, im.naturalWidth * sc, im.naturalHeight * sc);
    const g = ctx.createLinearGradient(0, H * .55, 0, H); g.addColorStop(0, 'rgba(20,12,6,0)'); g.addColorStop(1, 'rgba(20,12,6,.35)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); if (o.time === 'night') { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(70,90,170,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore(); } },
    { ground: () => H * gf - (H > W ? H * .1 : 0), surface: 'pavement' }); return pid; }
