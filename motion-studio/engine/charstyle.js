/* =====================================================================
   CHARACTER ART DIRECTION — the same cast, redesigned per video.
   Header:  charstyle: storybook          (or per character in cast: style=anime)
   Each style changes proportions, line (weight + colour), eyes, nose, blush,
   shading, palette treatment and surface (paper cut-out shadows, clay sheen).
   Formats pick a default (story → storybook, history → ink, guide → flat …);
   the variety check warns when two videos in a row share a style.
   ===================================================================== */
'use strict';
const CHAR_STYLES = {
  //          proportions                                      line                         face                                   surface / colour
  chibi:     { head: 1, leg: 1, torso: 1, tw: 1, limb: 1, arm: 1, lw: 1, ink: null, eye: 'big', nose: 'dot', blush: 1, hi: 1, sh: 1, pal: null, label: 'big-head cartoon (house default)' },
  storybook: { head: .8, leg: 1.22, torso: 1.06, tw: .96, limb: .9, arm: 1.12, lw: .55, ink: '#4a3226', eye: 'dot', nose: 'dot', blush: 1.3, hi: .6, sh: .55, pal: 'warm', face: 'oval', label: 'picture-book: softer, taller, fine brown line, dot eyes' },
  flat:      { head: .66, leg: 1.46, torso: 1.14, tw: .9, limb: .84, arm: 1.24, lw: .0001, faceLw: .8, ink: '#1d2440', eye: 'bean', nose: 'none', blush: .5, hi: 0, sh: 0, pal: 'vivid', face: 'oval', label: 'modern flat explainer: long limbs, no shading, bean eyes' },
  paper:     { head: .86, leg: 1.12, torso: 1.02, tw: 1, limb: 1, arm: 1.06, lw: .3, ink: '#3a2c24', eye: 'dot', nose: 'none', blush: 1, hi: 0, sh: .35, pal: 'muted', cut: 1, label: 'paper cut-out: layered shadows, hairline edges' },
  ink:       { head: .72, leg: 1.34, torso: 1.12, tw: .94, limb: .86, arm: 1.2, lw: 1.15, ink: '#14100c', eye: 'line', nose: 'line', blush: .2, hi: 0, sh: .4, pal: 'sepia', face: 'oval', label: 'woodblock / ink-wash: bold black line, sepia, calm line eyes' },
  anime:     { head: .64, leg: 1.62, torso: 1.2, tw: .88, limb: .78, arm: 1.32, lw: .6, ink: '#2a1c2a', eye: 'anime', nose: 'line', blush: 1.2, hi: .8, sh: .9, pal: 'pastel', face: 'oval', label: 'tall anime-style proportions, large sparkling eyes' },
  toy:       { head: .92, leg: .9, torso: .96, tw: 1.12, limb: 1.32, arm: .96, lw: 0.0001, faceLw: .85, ink: '#2a1a14', eye: 'dot', nose: 'none', blush: .9, hi: 1.6, sh: 1.5, pal: 'vivid', clay: 1, label: 'clay / vinyl toy: chunky, no outline, glossy light' },
  noir:      { head: .78, leg: 1.3, torso: 1.1, tw: .95, limb: .88, arm: 1.16, lw: .7, ink: '#06070c', eye: 'dot', nose: 'none', blush: 0, hi: .3, sh: 1.6, pal: 'night', face: 'oval', label: 'after-dark graphic: deep shadows, cool palette' },
  retro:     { head: .9, leg: 1.08, torso: 1, tw: 1.04, limb: .95, arm: 1.02, lw: .85, ink: '#2b1a12', eye: 'pie', nose: 'dot', blush: 1, hi: .4, sh: .5, pal: 'retro', label: '1930s rubber-hose: pie eyes, warm print colours' },
};
const CHAR_STYLE_BY_FORMAT = { explainer: 'chibi', countdown: 'toy', myth: 'flat', food: 'storybook', history: 'ink', guide: 'flat', versus: 'paper', story: 'storybook', night: 'noir', quiz: 'toy' };
let CSTYLE = 'chibi';
function styleOf(spec) { return CHAR_STYLES[(spec && spec.style) || CSTYLE] || CHAR_STYLES.chibi; }
// styled body metrics — used by the rig AND by framing / lint / physics so shots stay correct
function bodyOf(spec) { const st = styleOf(spec), b = { ...BODY[(spec && spec.age) || 'adult'] };
  b.head *= st.head; b.leg *= st.leg; b.torso *= st.torso; b.tw *= st.tw; b.armW *= st.limb; b.legW *= st.limb; b.arm *= st.arm; b.fore *= st.arm; b.hand *= Math.sqrt(st.limb); return b; }
// palette treatments
function _hx(h) { return /^#[0-9a-f]{6}$/i.test(h); }
const _rgb = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), _hex = a => '#' + a.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
const _tint = (c, t, k, dl = 0) => { const a = _rgb(c), b = _rgb(t), L = (a[0] * .3 + a[1] * .59 + a[2] * .11); return _hex(a.map((v, i) => lerp(v, L * b[i] / 160, k) + dl)); };
const PAL = {
  warm: c => _tint(c, '#c89060', .18, 4),
  vivid: c => { const [h, s, l] = hexToHsl(c); return hslToHex(h, Math.min(1, s * 1.18 + .04), l); },
  muted: c => { const [h, s, l] = hexToHsl(c); return hslToHex(h, s * .62, l * .96 + .03); },
  sepia: c => _tint(c, '#b48a5a', .62, 6),
  pastel: c => { const [h, s, l] = hexToHsl(c); return hslToHex(h, s * .8, lerp(l, .86, .32)); },
  night: c => _tint(c, '#6a80c0', .35, -18),
  retro: c => _tint(c, '#d09a60', .25, 0),
};
const _palCache = new WeakMap();
function styledSpec(spec, st) { if (!st.pal || !PAL[st.pal]) return spec; let m = _palCache.get(spec); if (!m) _palCache.set(spec, m = {}); if (m[st.pal]) return m[st.pal];
  const f = PAL[st.pal], walk = v => typeof v === 'string' && _hx(v) ? f(v) : Array.isArray(v) ? v.map(walk) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v;
  const out = walk(spec); if (_hx(spec.skin || '')) out.skin = mix(spec.skin, out.skin, st.pal === 'sepia' ? .5 : .3); return (m[st.pal] = out); }
// run the rig with a style applied (line weight/colour, shading strength, cut-out shadows)
const _LWD = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'lineWidth');
function withCharStyle(st, fn) { if (st === CHAR_STYLES.chibi) return fn(); const c = ctx, ink0 = C.ink, hi0 = window.CS_HI, sh0 = window.CS_SH;
  Object.defineProperty(c, 'lineWidth', { configurable: true, get() { return _LWD.get.call(c); }, set(v) { _LWD.set.call(c, Math.max(.0001, v * (window._CSFACE ? (st.faceLw ?? Math.max(st.lw, .6)) : st.lw))); } });
  if (st.ink) C.ink = st.ink; window.CS_HI = st.hi; window.CS_SH = st.sh; window.CS_LW = st.lw;
  if (st.cut) { c.save(); c.shadowColor = 'rgba(40,24,10,.32)'; c.shadowOffsetX = 2.5 * U(); c.shadowOffsetY = 3.5 * U(); c.shadowBlur = 1.5 * U(); }
  try { fn(); } finally { if (st.cut) c.restore(); delete c.lineWidth; C.ink = ink0; window.CS_HI = hi0; window.CS_SH = sh0; window.CS_LW = 1; } }
const CHAR_STYLE_NAMES = Object.keys(CHAR_STYLES);
