/* =====================================================================
   VIETADVISOR STUDIO — ENGINE CORE
   Canvas-2D vector toolkit: math, easing, colour, shaded shapes, text.
   Every drawing function draws into the global `ctx` (swap it to render
   into offscreen buffers).
   ===================================================================== */
'use strict';
let W = 1920, H = 1080;           // current stage size (set by format)
let ctx = null;                   // current drawing context
const VA = { version: '2.0.0' };  // namespace for registries

// ---------------------------------------------------------------- palette
// Brand tokens. Change here → whole universe updates.
const C = {
  ink: '#2b1d16',        // outline colour (never pure black)
  inkSoft: '#5a4636',
  paper: '#f3e6c4', paper2: '#e6d3a4', cream: '#fff8ea', white: '#fffdf7',
  brand: '#ee4d2d',      // Vietadvisor accent — numbers, punchlines, CTA
  brandDark: '#b8341b',
  red: '#da251d',        // Vietnam flag red
  gold: '#ffcd00',       // flag star yellow
  yel: '#f8c848', yel2: '#eaa52a', orange: '#f08a3c',
  sky: '#8fd3f0', sky2: '#c9ecf6', sea: '#5cc0cf', sea2: '#2f9fb3', river: '#2fbfa6',
  leaf: '#7cb85c', leaf2: '#4f8f4a', leaf3: '#2f6b45', rice: '#b8d66a', karst: '#5f8f5a',
  rock: '#8f9c7c', soil: '#b77b4a', wood: '#9a6338', wood2: '#6e4325',
  blue: '#3a7bd5', indigo: '#2f3e7a', teal: '#2fa59d', purple: '#7a4fa0', pink: '#f08aa0',
  grey: '#9aa1a8', dark: '#3a3330',
  night: '#14234a', dusk: '#ff7e5f'
};
// skin tones (diverse, no caricature)
const SKIN = { s1: '#ffe0c7', s2: '#f6c9a3', s3: '#eab288', s4: '#d99a6c', s5: '#b9784c', s6: '#8d5634', s7: '#62391f' };
const HAIR = { black: '#1f1a1c', dark: '#3b2a22', brown: '#7a4a2a', chestnut: '#9c5a30', blonde: '#e8c26a', red: '#c4552c', grey: '#b9b4ad', white: '#eeeae2' };

// ---------------------------------------------------------------- math
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => (b === a ? (x >= b ? 1 : 0) : clamp((x - a) / (b - a)));
const TAU = Math.PI * 2;
const E = {
  lin: t => t,
  in: t => t * t * t, out: t => 1 - Math.pow(1 - t, 3), out5: t => 1 - Math.pow(1 - t, 5),
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  back: t => { const c1 = 2.0, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  backIn: t => { const c1 = 1.8, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; },
  elastic: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
  bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
  step: t => t < 1 ? 0 : 1
};
const ease = (name) => typeof name === 'function' ? name : (E[name] || E.inOut);
const pop = (t, a, d = .35, e = E.back) => e(inv(a, a + d, t));
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }
function fbm(x, o = 3) { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += noise1(x * f + i * 17) * a; a *= .5; f *= 2; } return s; }
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// damped wobble for squash/stretch after an impact at time a
const wob = (t, a, k = 7, f = 26) => t < a ? 0 : Math.exp(-(t - a) * k) * Math.sin((t - a) * f);

// ---------------------------------------------------------------- colour
const _cc = new Map();
function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  return [h, s, l];
}
function hslToHex(h, s, l) {
  const f = n => { const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(c * 255).toString(16).padStart(2, '0'); };
  return '#' + f(0) + f(8) + f(4);
}
// shade: dl = lightness delta (-1..1), ds = saturation delta, dh = hue shift (deg)
function shade(hex, dl, ds = 0, dh = 0) {
  if (!hex || hex[0] !== '#' || hex.length !== 7) return hex;
  const key = hex + dl + ',' + ds + ',' + dh; if (_cc.has(key)) return _cc.get(key);
  let [h, s, l] = hexToHsl(hex); h = (h + dh / 360 + 1) % 1; s = clamp(s + ds); l = clamp(l + dl);
  const out = hslToHex(h, s, l); _cc.set(key, out); return out;
}
// cel-shadow colour: darker, a touch more saturated, hue shifted toward purple (nicer than grey)
const shadowOf = c => shade(c, -.13, .06, -8);
const lightOf = c => shade(c, .1, -.02, 6);
function rgba(hex, a) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgba(${r},${g},${b},${a})`; }
function mix(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], t)).toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------- strokes / fills
let LW = 6;                     // base outline width (world units)
function fs(fill, lw = LW, stroke = C.ink) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function circ(x, y, r, fill, lw = LW, stroke) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); fs(fill, lw, stroke); }
function ell(x, y, rx, ry, fill, lw = LW, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, TAU); fs(fill, lw); }
function rr(x, y, w, h, r, fill, lw = LW, stroke) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); fs(fill, lw, stroke); }
function poly(pts, fill, lw = LW, close = true) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); if (close) ctx.closePath(); fs(fill, lw); }
function line(x1, y1, x2, y2, lw = LW, col = C.ink) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); }
function pline(pts, lw = LW, col = C.ink) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
// smooth closed blob through points (Catmull-Rom → bezier)
function smoothPath(pts, closed = true) {
  const n = pts.length; ctx.beginPath();
  const P = i => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
}
// thick limb with ink outline (two passes)
function limb(pts, w, col, lw = LW) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const K = window.CS_LW ?? 1;
  for (const [ww, c] of [[w + lw * 1.7 * K, C.ink], [w, col]]) {
    if (c === C.ink && K < .05) continue;
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.lineWidth = ww / K; ctx.strokeStyle = c; ctx.stroke();
  }
  // soft shadow stripe on the limb
  ctx.save(); ctx.globalAlpha *= .25 * Math.min(1, window.CS_SH ?? 1); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0] + w * .18, p[1] + w * .1) : ctx.moveTo(p[0] + w * .18, p[1] + w * .1));
  ctx.lineWidth = w * .4 / K; ctx.strokeStyle = shadowOf(col); ctx.stroke(); ctx.restore();
}
/* SHADED SHAPE — the core of the "more beautiful" look.
   build(): adds a path to ctx (must NOT call beginPath itself).
   Draws: base fill → top-left highlight crescent → bottom-right cel shadow → outline. */
function shaded(build, base, o = {}) {
  const sx = o.sx ?? 10, sy = o.sy ?? 8, hx = o.hx ?? -6, hy = o.hy ?? -6;
  const sh = o.shadow || shadowOf(base), hi = o.hi === undefined ? lightOf(base) : o.hi;
  ctx.beginPath(); build(); ctx.fillStyle = base; ctx.fill();
  ctx.save(); ctx.beginPath(); build(); ctx.clip();
  if (hi) { // highlight = region of path NOT covered by path shifted (+|hx|,+|hy|)
    ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 2e5); ctx.translate(-hx, -hy); build(); ctx.translate(hx, hy); ctx.clip('evenodd');
    ctx.globalAlpha *= (o.hiA ?? .55) * (window.CS_HI ?? 1); ctx.fillStyle = hi; ctx.fillRect(-1e5, -1e5, 2e5, 2e5); ctx.restore();
  }
  if (sh) {
    ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 2e5); ctx.translate(-sx, -sy); build(); ctx.translate(sx, sy); ctx.clip('evenodd');
    ctx.globalAlpha *= Math.min(1, (o.shA ?? 1) * (window.CS_SH ?? 1)); ctx.fillStyle = sh; ctx.fillRect(-1e5, -1e5, 2e5, 2e5); ctx.restore();
  }
  if (o.inner) o.inner();
  ctx.restore();
  if ((o.lw ?? LW) > 0) { ctx.beginPath(); build(); fs(null, o.lw ?? LW, o.stroke || C.ink); }
}
const sCirc = (x, y, r, col, o) => shaded(() => ctx.arc(x, y, Math.max(.1, r), 0, TAU), col, { sx: r * .22, sy: r * .2, hx: -r * .12, hy: -r * .14, ...o });
const sEll = (x, y, rx, ry, col, o, rot = 0) => shaded(() => ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU), col, { sx: rx * .2, sy: ry * .2, hx: -rx * .1, hy: -ry * .12, ...o });
const sRR = (x, y, w, h, r, col, o) => shaded(() => ctx.roundRect(x, y, w, h, r), col, { sx: Math.min(w, h) * .14, sy: Math.min(w, h) * .12, ...o });
const sPoly = (pts, col, o) => shaded(() => { pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); }, col, o);
const sSmooth = (pts, col, o) => shaded(() => { const n = pts.length, P = i => pts[(i + n) % n]; ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 0; i < n; i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2); ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); } ctx.closePath(); }, col, o);

function star(x, y, r, fill, lw = LW, rot = 0, pts = 5, inner = .45) {
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) { const a = rot - Math.PI / 2 + i * Math.PI / pts, q = i % 2 ? r * inner : r; ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); }
  ctx.closePath(); fs(fill, lw);
}
function heart(x, y, s, fill, lw = 4) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath();
  ctx.moveTo(0, 8); ctx.bezierCurveTo(-26, -8, -14, -30, 0, -16); ctx.bezierCurveTo(14, -30, 26, -8, 0, 8); ctx.closePath(); ctx.restore(); fs(fill, lw);
}
function sparkle(x, y, s, rot = 0, col = '#fff', lw = 3) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? 6 : 26; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath();
  fs(col, lw / Math.max(.2, s)); ctx.restore();
}
function shadowBlob(x, y, rx, a = .2) { ctx.save(); ctx.globalAlpha *= a; ell(x, y, rx, rx * .18, '#1a0f08', 0); ctx.restore(); }

// ---------------------------------------------------------------- text
// Font roles. The family stacks give automatic per-glyph fallback for all 8 languages.
const FONT = {
  display: `"Baloo 2", "Kanit", "Noto Sans KR", "Noto Sans JP", "Noto Sans SC", sans-serif`,
  body: `"Be Vietnam Pro", "Kanit", "Noto Sans KR", "Noto Sans JP", "Noto Sans SC", sans-serif`,
  // art-directed type roles (all OFL, all carry Vietnamese diacritics) — used by engine/library/typekit.js
  impact: `"Anton", "Be Vietnam Pro", sans-serif`, cond: `"Oswald", "Be Vietnam Pro", sans-serif`, serif: `"Playfair Display", "Be Vietnam Pro", serif`,
  comic: `"Bangers", "Baloo 2", sans-serif`, toon: `"Paytone One", "Baloo 2", sans-serif`, round: `"Coiny", "Baloo 2", sans-serif`, heavy: `"Paytone One", "Baloo 2", sans-serif`, script: `"Pacifico", "Baloo 2", cursive`, hand: `"Patrick Hand", "Be Vietnam Pro", sans-serif`, sign: `"Bungee", "Baloo 2", sans-serif`,
};
const FW = { toon: 400, round: 400, heavy: 400, display: 800, body: 800, impact: 400, cond: 700, serif: 900, comic: 400, script: 400, hand: 400, sign: 400 };
function setFont(size, role = 'display', weight) { ctx.font = `${weight || FW[role] || 800} ${size}px ${FONT[role] || role}`; }
// lint hooks: when LINT.on, every text draw and face records its device-space box
const LINT = { on: false, tag: 'text', boxes: [] };
function lintText(s, size, align) { const w = ctx.measureText(s).width, h = size * 1.05; const x0 = align === 'left' ? 0 : align === 'right' ? -w : -w / 2; const y0 = -h / 2; const m = ctx.getTransform(); const pts = [[x0, y0], [x0 + w, y0], [x0, y0 + h], [x0 + w, y0 + h]].map(([px, py]) => [m.a * px + m.c * py + m.e, m.b * px + m.d * py + m.f]); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); LINT.boxes.push({ k: LINT.tag, s: String(s).slice(0, 40), x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }); }
function T(s, x, y, o = {}) {
  s = String(s);
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  const sc = o.scale ?? 1; if (sc <= 0.001) { ctx.restore(); return; } ctx.scale(sc, sc);
  ctx.globalAlpha *= (o.alpha ?? 1);
  const size = o.size || 60; setFont(size, o.font || 'display', o.weight);
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'middle';
  if (o.ls) ctx.letterSpacing = o.ls + 'px';
  const lw = o.lw ?? size * .2;
  const yo = (o.font || 'display') === 'display' ? size * .08 : 0; // Baloo sits high
  if (o.shadow) { ctx.fillStyle = o.shadowCol || 'rgba(20,10,5,.35)'; if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = o.shadowCol || 'rgba(20,10,5,.35)'; ctx.lineJoin = 'round'; ctx.strokeText(s, o.shadow * .6, o.shadow + yo); } ctx.fillText(s, o.shadow * .6, o.shadow + yo); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = o.stroke || C.ink; ctx.lineJoin = 'round'; ctx.strokeText(s, 0, yo); }
  if (o.grad) { const g = ctx.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, o.grad[0]); g.addColorStop(1, o.grad[1]); ctx.fillStyle = g; } else ctx.fillStyle = o.fill || C.white;
  ctx.fillText(s, 0, yo);
  if (LINT.on && ctx.globalAlpha > .3 && sc > .5) lintText(s, size, ctx.textAlign);
  ctx.restore();
}
function textW(s, size, role = 'display', weight) { ctx.save(); setFont(size, role, weight); const w = ctx.measureText(String(s)).width; ctx.restore(); return w; }
// word-wrap helper → array of lines
function wrap(s, size, maxW, role = 'body') {
  ctx.save(); setFont(size, role); const words = String(s).split(' '), lines = []; let cur = '';
  for (const w of words) { const test = cur ? cur + ' ' + w : w; if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test; }
  if (cur) lines.push(cur); ctx.restore(); return lines;
}

// ---------------------------------------------------------------- camera
function camera(cx, cy, z, rot, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rot || 0); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function withCtx(c2, fn) { const p = ctx; ctx = c2; try { fn(); } finally { ctx = p; } }

// registries
const CHAR = {};   // character presets
const PROP = {};   // props: PROP[name] = { draw(x,y,s,o,t), cat, label, w, h }
const PLACE = {};  // backgrounds: PLACE[name] = { draw(t, o), label }
const UI = {};     // ui components
const FX = {};     // transitions & effects
function defProp(name, cat, label, w, h, draw, extra = {}) { PROP[name] = { name, cat, label, w, h, draw, ...extra }; }
function drawProp(name, x, y, s = 1, o = {}, t = 0) { const p = PROP[name]; if (!p) { console.warn('no prop', name); return; } ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); if (o.rot) ctx.rotate(o.rot); p.draw(o, t); ctx.restore(); }
