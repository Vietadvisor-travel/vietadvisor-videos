/* =====================================================================
   LOOK — the "premium finish" layer.
   • line boil (hand-drawn wobble on outlines)      LOOK.boil = { amp: 1.1, fps: 8 } | null
   • stepped animation "on twos" for characters    LOOK.step = 1 | 2
   • smear / multiples on fast moves                LOOK.smear = true
   • colour grade + bloom                           LOOK.grade = 'warm' | 'teal' | 'golden' | 'night' | 'clean' | {…}
   • kinetic captions                               captionStyle 'line' | 'karaoke' | 'punch'
   • trauma camera shake (translation + rotation)
   • god rays, light glows
   • extra transitions: stripes, circles, push
   Episode-level: EPISODE.look = { boil, step, smear, grade, captionStyle }  (scene.look overrides grade/captionStyle)
   ===================================================================== */
'use strict';
const LOOK = { boil: null, step: 1, smear: true, grade: 'warm', captionStyle: 'line', _bf: 0, _n: 0 };
const GRADES = {
  clean: { sat: 1.0, con: 1.0, bri: 1.0, bloom: 0 },
  sepia: { sat: .62, con: 1.08, bri: 1.0, tint: '#c8945a', tintA: .16, bloom: .18 },
  warm: { sat: 1.08, con: 1.04, bri: 1.0, tint: '#ffb070', tintA: .06, bloom: .14 },
  golden: { sat: 1.12, con: 1.05, bri: 1.02, tint: '#ffb347', tintA: .12, bloom: .22 },
  teal: { sat: 1.1, con: 1.08, bri: 1.0, tint: '#3fa3b8', tintA: .06, bloom: .12 },
  night: { sat: 1.15, con: 1.1, bri: .98, tint: '#3a4fa0', tintA: .1, bloom: .3 },
  punchy: { sat: 1.2, con: 1.1, bri: 1.02, bloom: .1 },
};
function lookFrame(t, ep) { const L = (ep && ep.look) || {}; LOOK.boil = L.boil === undefined ? null : (L.boil === true ? { amp: 1.1, fps: 8 } : L.boil); LOOK.step = L.step || 1; LOOK.smear = L.smear !== false; LOOK.grade = L.grade || 'warm'; LOOK.captionStyle = L.captionStyle || 'line'; LOOK._bf = LOOK.boil ? Math.floor(t * LOOK.boil.fps) : 0; LOOK._n = 0; }

// ---------------------------------------------------------------- line boil
function _boilOff() { const m = ctx.getTransform(), s = Math.hypot(m.a, m.b) || 1, n = LOOK._n++, a = LOOK.boil.amp / s; return [(hash(LOOK._bf * 97.31 + n * 1.371) - .5) * 2 * a, (hash(LOOK._bf * 53.17 + n * 2.113 + 7) - .5) * 2 * a]; }
const _fs0 = fs;
fs = function (fill, lw = LW, stroke = C.ink) {
  if (!LOOK.boil || !lw) return _fs0(fill, lw, stroke);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  const [ox, oy] = _boilOff(); ctx.save(); ctx.translate(ox, oy); ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
};
const _limb0 = limb;
limb = function (pts, w, col, lw = LW) {
  if (!LOOK.boil) return _limb0(pts, w, col, lw);
  const [ox, oy] = _boilOff(); _limb0(pts.map(p => [p[0] + ox * .6, p[1] + oy * .6]), w, col, lw);
};
// stepped ("on twos") character animation: quantise the character's clock
const _person0 = person;
person = function (x, y, s, spec, o = {}) { if (LOOK.step > 1 && o.t !== undefined) o = { ...o, t: Math.floor(o.t * 30 / LOOK.step) * LOOK.step / 30 }; return _person0(x, y, s, spec, o); };

// ---------------------------------------------------------------- grade + bloom (applied to the finished scene, before captions)
let _gq = null, _gf = null;
function applyGrade(g) {
  if (!g || g === 'clean') return; const G = typeof g === 'string' ? GRADES[g] : g; if (!G) return;
  if (!_gf || _gf.width !== W || _gf.height !== H) _gf = mkCanvas(W, H);
  const f = _gf.getContext('2d'); f.setTransform(1, 0, 0, 1, 0, 0); f.clearRect(0, 0, W, H); f.drawImage(ctx.canvas, 0, 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if ((G.sat ?? 1) !== 1 || (G.con ?? 1) !== 1 || (G.bri ?? 1) !== 1) { ctx.filter = `saturate(${G.sat ?? 1}) contrast(${G.con ?? 1}) brightness(${G.bri ?? 1})`; ctx.drawImage(_gf, 0, 0); ctx.filter = 'none'; }
  if (G.tint) { ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = G.tintA * 3; ctx.fillStyle = G.tint; ctx.fillRect(0, 0, W, H); }
  if (G.bloom) { const w = Math.ceil(W / 4), h = Math.ceil(H / 4); if (!_gq || _gq.width !== w || _gq.height !== h) _gq = mkCanvas(w, h); const q = _gq.getContext('2d'); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, w, h); q.filter = 'brightness(1.15) contrast(2.4) saturate(1.2) blur(5px)'; q.drawImage(ctx.canvas, 0, 0, w, h); q.filter = 'none';
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = G.bloom; ctx.drawImage(_gq, 0, 0, W, H); }
  ctx.restore();
}
// ---------------------------------------------------------------- light helpers
function godRays(x, y, t, o = {}) { const n = o.n || 14, len = o.len || Math.hypot(W, H), spread = o.spread || .17, w = o.w || .045, dir = o.dir ?? -Math.PI / 2;
  ctx.save(); ctx.globalAlpha *= o.a ?? .5; ctx.translate(x, y); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < n; i++) { const a = dir + (i - (n - 1) / 2) * spread + Math.sin(t * .8 + i) * .02; const ww = w * (.6 + .8 * hash(i)); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - ww) * len, Math.sin(a - ww) * len); ctx.lineTo(Math.cos(a + ww) * len, Math.sin(a + ww) * len); ctx.closePath(); const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len); g.addColorStop(0, o.color || 'rgba(255,246,196,.9)'); g.addColorStop(1, 'rgba(255,246,196,0)'); ctx.fillStyle = g; ctx.fill(); }
  ctx.restore(); }
function glow(x, y, r, col = '#ffd36a', a = .6) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }

// ---------------------------------------------------------------- extra transitions
FX.stripes = (A, B, p) => { const n = 7, cols = [C.brand, C.yel, C.ink]; ctx.drawImage(p < .5 ? A : B, 0, 0); const D = Math.hypot(W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.5); for (let i = 0; i < n; i++) { const q = clamp(p * 2.2 - i * .06), e = p < .5 ? E.inOut(clamp(q * 2)) : 1 - E.inOut(clamp((p - .5) * 2.2 - i * .04) * 1.4); const bw = D / n; ctx.fillStyle = cols[i % 3]; const x = -D / 2 + i * bw; ctx.fillRect(x, -D / 2, bw + 2, D * e); } ctx.restore(); };
FX.circles = (A, B, p) => { ctx.drawImage(p < .5 ? A : B, 0, 0); const cell = Math.min(W, H) / 6, cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1, maxd = Math.hypot(cols, rows) / 2;
  ctx.save(); ctx.fillStyle = C.brand; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const d = Math.hypot(i - cols / 2, j - rows / 2) / maxd; const e = p < .5 ? E.out(clamp(p * 3.2 - d * .6)) : 1 - E.in(clamp((p - .5) * 3.2 - (1 - d) * .6)); if (e > 0) { ctx.beginPath(); ctx.arc(i * cell, j * cell, cell * .75 * e, 0, TAU); ctx.fill(); } } ctx.restore(); };
FX.push = (A, B, p) => { const e = E.inOut(p); ctx.drawImage(A, -e * W, 0); ctx.drawImage(B, W - e * W, 0); line(W - e * W, 0, W - e * W, H, 10, C.ink); };

// ---------------------------------------------------------------- kinetic captions (replaces caption())
const _caption0 = caption;
caption = function (text, t0, t1, t, o = {}) {
  const style = o.style || LOOK.captionStyle || 'line';
  if (true) return _caption0(text, t0, t1, t, o); // house rule (Oct 2026): one caption style only — small, fixed, bottom band
  if (t < t0 || t > t1) return; const u = U(), vert = H > W, sf = SAFE();
  const toks = []; let mode = 0; String(text).split(/(\*|\[|\])/).forEach(seg => { if (seg === '*') { mode = mode === 1 ? 0 : 1; return; } if (seg === '[') { mode = 2; return; } if (seg === ']') { mode = 0; return; } seg.split(/\s+/).forEach(w => { if (!w) return; if (/^[.,!?…:;)]+$/.test(w) && toks.length) toks[toks.length - 1][0] += w; else toks.push([w, mode]); }); });
  const n = toks.length, span = Math.max(.3, (t1 - t0) * .82), out = clamp((t1 - t) / .15);
  const wt = toks.map(([w]) => Math.max(1, w.replace(/[^\p{L}\p{N}]/gu, '').length * .12 + .6)); const tot = wt.reduce((a, b) => a + b, 0); const starts = []; let acc = 0; wt.forEach(w => { starts.push(t0 + acc / tot * span); acc += w; });
  const col = m => m === 1 ? C.yel : m === 2 ? '#ff8a6a' : '#fff';
  if (style === 'punch') { // 1–3 words at a time, big, centred, popping
    const groups = []; let g = []; toks.forEach((tk, i) => { g.push(i); const end = /[.,!?…:;—]$/.test(tk[0]); if (g.length === 3 || end || i === n - 1) { groups.push(g); g = []; } });
    let gi = 0; groups.forEach((gr, k) => { if (t >= starts[gr[0]]) gi = k; }); const gr = groups[gi]; const gt = t - starts[gr[0]];
    let size = (vert ? 96 : 104) * u; const y = o.y ?? (vert ? H * .66 : H * .8); setFont(size, 'display'); const words = gr.map(i => toks[i]); let tw = words.reduce((s, [w]) => s + ctx.measureText(w + ' ').width, 0); if (tw > W * .86) { size *= W * .86 / tw; tw = W * .86; setFont(size, 'display'); }
    let x = W / 2 - tw / 2; const sc = E.back(clamp(gt / .18)) * out; ctx.save(); ctx.translate(W / 2, y); ctx.rotate((gi % 2 ? 1 : -1) * .025); ctx.scale(sc, sc); ctx.translate(-W / 2, -y);
    for (const [w, m] of words) { T(w, x, y, { size, align: 'left', fill: col(m), lw: size * .2, shadow: 7 * u }); setFont(size, 'display'); x += ctx.measureText(w + ' ').width; } ctx.restore(); return;
  }
  // karaoke: whole line visible, words light up in sequence with a pop
  const size = (o.size || (vert ? 58 : 52)) * u, maxW = vert ? W * .84 : W * .8; setFont(size, 'body', 800);
  const lines = [[]]; let lw = 0; const sp = ctx.measureText(' ').width + size * .12;
  toks.forEach((tk, i) => { const w = ctx.measureText(tk[0]).width; if (lw + w > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += w + sp; });
  const lh = size * 1.3, yBase = o.y ?? (vert ? sf.bottom - 40 * u : H - 80 * u), y0 = yBase - (lines.length - 1) * lh; const pin = E.out(clamp((t - t0) / .2));
  ctx.save(); ctx.globalAlpha *= out * pin;
  lines.forEach((ln, li) => { setFont(size, 'body', 800); const tw = ln.reduce((s, i) => s + ctx.measureText(toks[i][0]).width + sp, -sp); let x = W / 2 - tw / 2; const y = y0 + li * lh;
    for (const i of ln) { const [w, m] = toks[i]; setFont(size, 'body', 800); const ww = ctx.measureText(w).width; const on = t >= starts[i], cur = on && (i === n - 1 || t < starts[i + 1]); const pp = on ? E.back(clamp((t - starts[i]) / .16)) : 0;
      const sc = cur ? 1 + .12 * pp : 1; const fill = cur ? C.yel : on ? (m ? col(m) : '#fff') : 'rgba(255,255,255,.55)';
      ctx.save(); ctx.translate(x + ww / 2, y - (cur ? 4 * u * pp : 0)); ctx.scale(sc, sc); T(w, 0, 0, { size, font: 'body', weight: 800, fill, lw: size * .26, shadow: 5 * u, alpha: on ? 1 : .8 }); ctx.restore(); x += ww + sp; } });
  ctx.restore();
};
