/* =====================================================================
   UI KIT — on-screen graphics. All sizes in stage px × U().
   Brand rules: accent #EE4D2D only for numbers/punchlines; text inside
   the vertical safe zone (middle 60%) on 9:16.
   ===================================================================== */
'use strict';
// vertical safe area = what TikTok / Reels / Shorts leave visible (top bar, right action rail, bottom name + description ≈ 30 %)
const SAFE = () => H > W ? { top: H * .15, bottom: H * .7, left: W * .1, right: W * .88 } : { top: H * .07, bottom: H * .93, left: W * .05, right: W * .95 };
function UIbanner(x, y, text, s = 1, fill = C.yel, tcol = C.ink, size = 44) {
  if (s <= 0) return; s *= Math.min(1, W * .86 / Math.max(1, (textW(text, size) + 120) * s)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = textW(text, size) + 50, h = size * 1.4;
  sPoly([[-w / 2 - 34, -h / 2 + 12], [-w / 2, -h / 2 + 12], [-w / 2, h / 2 + 12], [-w / 2 - 34, h / 2 + 12], [-w / 2 - 20, 12]], shade(fill === C.yel ? C.red : fill, -.2), { lw: 5 });
  sPoly([[w / 2 + 34, -h / 2 + 12], [w / 2, -h / 2 + 12], [w / 2, h / 2 + 12], [w / 2 + 34, h / 2 + 12], [w / 2 + 20, 12]], shade(fill === C.yel ? C.red : fill, -.2), { lw: 5 });
  sRR(-w / 2, -h / 2, w, h, 6, fill, { lw: 6 }); T(text, 0, 0, { size, fill: tcol, lw: 0 }); ctx.restore();
}
UI.banner = (p, o) => UIbanner(o.x, o.y, o.text, p * (o.s || 1), o.fill || C.yel, o.color || C.ink, o.size || 44);
// title card: big chunky title with optional subtitle ribbon
UI.title = (p, o, t) => {
  const u = U(); const lines = Array.isArray(o.text) ? o.text : [o.text]; const size = (o.size || 190) * u;
  lines.forEach((ln, i) => { const pp = clamp((t - (o.at || 0) - i * .14) / .28); if (pp <= 0) return; T(ln, o.x ?? W / 2, (o.y ?? H * .42) + (i - (lines.length - 1) / 2) * size * .95, { size, fill: i === lines.length - 1 && o.accentLast ? C.yel : o.fill || '#fff', scale: lerp(3, 1, E.out5(pp)), alpha: clamp(pp * 3), shadow: 12 * u, rot: o.rot ?? -.03, lw: size * .16 }); });
  if (o.sub) { const rp = E.out(inv((o.at || 0) + .5, (o.at || 0) + .9, t)); if (rp > 0) { ctx.save(); ctx.translate(lerp(-W, 0, rp), 0); UIbanner(o.x ?? W / 2, (o.y ?? H * .42) + lines.length * size * .55 + 40 * u, o.sub, u, '#fffaf0', C.ink, 48); ctx.restore(); } }
};
// stat card: icon disc + big number + small line
UI.stat = (p, o) => {
  if (p <= 0) return; const u = U() * (o.s || 1); ctx.save(); ctx.translate(o.x, o.y); ctx.scale(p * u, p * u); ctx.rotate((1 - clamp(p)) * .2);
  const w = o.w || 560; ctx.save(); ctx.globalAlpha *= .25; rr(-w / 2 + 10, -60, w, 144, 22, '#000', 0); ctx.restore();
  sRR(-w / 2, -72, w, 144, 22, '#fff8e6', { lw: 7 }); sCirc(-w / 2 + 80, 0, 50, o.color || C.brand, { lw: 6 });
  if (o.icon && PROP[o.icon]) { const pr = PROP[o.icon]; drawProp(o.icon, -w / 2 + 80, 30, Math.min(70 / pr.w, 70 / pr.h)); } else if (o.emoji) T(o.emoji, -w / 2 + 80, 2, { size: 54, font: 'body', lw: 0 });
  T(o.big, -w / 2 + 150, o.small ? -18 : 2, { size: 62, fill: C.ink, lw: 0, align: 'left' });
  if (o.small) T(o.small, -w / 2 + 150, 36, { size: 28, fill: '#7a6450', lw: 0, align: 'left', font: 'body' });
  ctx.restore();
};
// PRICE TAG — brand "Price Check" format: VND + USD + checked date stamp
UI.price = (p, o, t) => {
  if (p <= 0) return; const u = U() * (o.s || 1); ctx.save(); ctx.translate(o.x, o.y); ctx.scale(p * u, p * u); ctx.rotate(-.05 + (1 - clamp(p)) * .3 + Math.sin(t * 2) * .01);
  line(-210, -60, -260, -110, 5); circ(-262, -114, 10, null, 5);
  sPoly([[-210, -80], [200, -80], [200, 80], [-210, 80], [-250, 0]], '#fffaf0', { lw: 7 }); circ(-206, 0, 12, C.paper2, 5);
  T(o.item || '', 0, -44, { size: 32, font: 'body', fill: C.inkSoft, lw: 0 });
  T(o.vnd, 0, 4, { size: 66, fill: C.brand, lw: 0 }); T(o.usd ? '≈ ' + o.usd : '', 0, 54, { size: 32, font: 'body', fill: C.ink, lw: 0 });
  if (o.checked) { const sp = clamp((t - (o.at || 0) - .5) / .2); if (sp > 0) { ctx.save(); ctx.translate(110, 104); ctx.rotate(.18); ctx.scale(lerp(2.2, 1, E.out5(sp)), lerp(2.2, 1, E.out5(sp))); ctx.globalAlpha *= sp; rr(-100, -24, 200, 48, 8, null, 5, C.leaf3); T('checked ' + o.checked, 0, 2, { size: 24, font: 'body', fill: C.leaf3, lw: 0 }); ctx.restore(); } }
  ctx.restore();
};
UI.stamp = (p, o, t) => { const tt = t - (o.at || 0); if (tt <= 0) return; const s = lerp(2.6, 1, E.out5(clamp(tt / .18))), a = clamp(tt / .1) * p; const u = U() * (o.s || 1);
  ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot ?? -.2); ctx.scale(s * u, s * u); ctx.globalAlpha *= a; const size = o.size || 74, w = textW(o.text, size) + 50, col = o.color || C.red;
  ctx.beginPath(); ctx.roundRect(-w / 2, -size * .7, w, size * 1.4, 12); ctx.lineWidth = 9; ctx.strokeStyle = col; ctx.stroke(); T(o.text, 0, 0, { size, fill: col, lw: 0 }); ctx.restore(); };
// speech / thought bubble. tail: [dx,dy] from centre to the speaker's mouth
UI.bubble = (p, o) => {
  if (p <= 0) return; const u = U() * (o.s || 1); const size = o.size || 52; const lines = String(o.text).split('\n');
  const w = Math.max(...lines.map(l => textW(l, size, o.font || 'display'))) + 90, h = lines.length * size * 1.15 + 60;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(p * u, p * u); ctx.rotate(o.rot || 0);
  const tl = o.tail || [-w * .3, h * .9];
  if (o.thought) { for (let i = 1; i <= 3; i++) sCirc(tl[0] * i / 3.4, tl[1] * i / 3.4 + h * .2, 22 - i * 5, '#fff', { lw: 6 }); sEll(0, 0, w / 2 + 20, h / 2 + 10, '#fff', { lw: 7 }); }
  else { ctx.beginPath(); ctx.ellipse(0, 0, w / 2 + 20, h / 2 + 10, 0, 0, TAU); ctx.moveTo(tl[0] * .25 - 30, h * .3); ctx.lineTo(tl[0], tl[1]); ctx.lineTo(tl[0] * .25 + 40, h * .32); fs('#fff', 7); ctx.beginPath(); ctx.ellipse(0, 0, w / 2 + 16, h / 2 + 6, 0, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill(); }
  lines.forEach((ln, i) => T(ln, 0, (i - (lines.length - 1) / 2) * size * 1.15, { size, fill: o.color || C.ink, lw: 0, font: o.font || 'display' }));
  ctx.restore();
};
// lower third: name + role
UI.lower = (p, o) => { if (p <= 0) return; const u = U(); const sf = SAFE(); const x = sf.left + 20 * u, y = H > W ? sf.top + 60 * u : sf.bottom - 300 * u; ctx.save(); ctx.translate(lerp(-700 * u, 0, E.out5(p)), 0);
  const w = Math.max(textW(o.name, 56), textW(o.role || '', 30, 'body')) + 80; sRR(x, y, w * u, 76 * u, 10 * u, C.brand, { lw: 6 * u }); T(o.name, x + 30 * u, y + 38 * u, { size: 56 * u, align: 'left', fill: '#fff', lw: 0 });
  if (o.role) { sRR(x + 20 * u, y + 70 * u, (textW(o.role, 30, 'body') + 40) * u, 46 * u, 8 * u, '#fffaf0', { lw: 5 * u }); T(o.role, x + 40 * u, y + 93 * u, { size: 30 * u, align: 'left', font: 'body', fill: C.ink, lw: 0 }); } ctx.restore(); };
// checklist with ticks appearing at item times
UI.checklist = (p, o, t) => { const mw = Math.max(...o.items.map(it => textW(it.text || it, 46, 'body'))) + 90; const u = Math.min(U() * (o.s || 1), (W * .95 - o.x) / mw); ctx.save(); ctx.translate(o.x, o.y); ctx.scale(u, u);
  o.items.forEach((it, i) => { const at = (o.at || 0) + i * (o.step || .6); const a = pop(t, at, .35); if (a <= 0) return; ctx.save(); ctx.translate(lerp(-80, 0, E.out(clamp((t - at) / .35))), i * 96); ctx.globalAlpha *= clamp(a);
    sRR(-30, -30, 60, 60, 12, '#fff', { lw: 6 }); const tk = clamp((t - at - .2) / .2); if (tk > 0) { if (it.no) { line(-16, -16, -16 + 32 * tk, -16 + 32 * tk, 9, C.red); if (tk > .5) line(16, -16, 16 - 32 * (tk - .5) * 2, -16 + 32 * (tk - .5) * 2, 9, C.red); } else pline([[-16, 0], [-4, 14 * tk], [4 + 18 * tk, -16 * tk]], 9, C.leaf3); }
    T(it.text || it, 56, 2, { size: 46, align: 'left', font: 'body', fill: '#fff', lw: 10 }); ctx.restore(); }); ctx.restore(); };
// split screen SKIP / INSTEAD (brand format C)
UI.skipInstead = (p, o, t) => { const u = U(); const vert = H > W; const sp = E.inOut(clamp(p));
  if (vert) { rr(0, H * .5 - 4 * u, W, 8 * u, 0, '#fff', 0); } else { rr(W * .5 - 4 * u, 0, 8 * u, H, 0, '#fff', 0); }
  const a = [vert ? W / 2 : W * .25, vert ? H * .28 : H * .14], b = [vert ? W / 2 : W * .75, vert ? H * .56 : H * .14];
  UIbanner(a[0], a[1], o.skip || 'Everyone goes here', u * pop(t, o.at || 0), '#9aa1a8', '#fff', 48);
  UIbanner(b[0], b[1], o.instead || 'Go here instead', u * pop(t, (o.at || 0) + (o.gap || 1.2)), C.brand, '#fff', 48);
  if (o.cross) { const cp = clamp((t - (o.at || 0) - .5) / .3); if (cp > 0) { pline([[a[0] - 160 * u, a[1] - 40 * u], [lerp(a[0] - 160 * u, a[0] + 160 * u, cp), lerp(a[1] - 40 * u, a[1] + 40 * u, cp)]], 12 * u, C.red); } }
};
// animated number counter
UI.counter = (p, o, t) => { const v = lerp(o.from || 0, o.to, E.out(clamp((t - (o.at || 0)) / (o.dur || 1.2)))); const s = (o.prefix || '') + (o.decimals ? v.toFixed(o.decimals) : Math.round(v).toLocaleString('en-US')) + (o.suffix || ''); T(s, o.x, o.y, { size: (o.size || 120) * U(), fill: o.fill || C.yel, scale: p, shadow: 8 * U() }); };
// chapter marker (long-form YouTube)
UI.chapter = (p, o) => { if (p <= 0) return; const u = U(); ctx.save(); ctx.globalAlpha *= clamp(p); ctx.fillStyle = 'rgba(20,10,5,.55)'; ctx.fillRect(0, 0, W, H); T(o.num ? 'CHAPTER ' + o.num : '', W / 2, H * .4, { size: 54 * u, font: 'body', fill: C.yel, lw: 0, ls: 12 * u }); T(o.text, W / 2, H * .5, { size: 140 * u, fill: '#fff', scale: lerp(1.3, 1, E.out(clamp(p))), shadow: 10 * u }); ctx.restore(); };
// arrow + label pointing at something
UI.arrow = (p, o) => { if (p <= 0) return; const u = U(); ctx.save(); ctx.globalAlpha *= clamp(p * 2); const fr = v => v.map((q, i) => q <= 2 ? q * (i % 2 ? H : W) : q); const [x1, y1, x2, y2] = fr(o.from).concat(fr(o.to)); const bend = o.bend || [0, -60 * u];
  const mx = (x1 + x2) / 2 + bend[0], my = (y1 + y2) / 2 + bend[1]; const pts = []; for (let i = 0; i <= 30 * clamp(p); i++) { const q = i / 30; pts.push([(1 - q) * (1 - q) * x1 + 2 * (1 - q) * q * mx + q * q * x2, (1 - q) * (1 - q) * y1 + 2 * (1 - q) * q * my + q * q * y2]); }
  if (pts.length > 1) { pline(pts, 12 * u, '#fff'); pline(pts, 6 * u, C.ink); const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]); poly([[b[0] + Math.cos(ang) * 10 * u, b[1] + Math.sin(ang) * 10 * u], [b[0] + Math.cos(ang + 2.5) * 30 * u, b[1] + Math.sin(ang + 2.5) * 30 * u], [b[0] + Math.cos(ang - 2.5) * 30 * u, b[1] + Math.sin(ang - 2.5) * 30 * u]], C.ink, 3 * u); }
  if (o.label) T(o.label, x1, y1 - 40 * u, { size: (o.size || 64) * u, fill: o.fill || C.yel, scale: E.back(clamp(p * 1.5)), rot: o.rot || .05 }); ctx.restore(); };
// big punch text (onomatopoeia / reaction)
UI.punch = (p, o, t) => { const tt = t - (o.at || 0); if (tt < 0) return; const life = o.life || 1.2; const out = clamp((tt - life + .2) / .2); T(o.text, o.x, o.y - tt * 20 * U(), { size: (o.size || 110) * U(), fill: o.fill || C.yel, scale: E.back(clamp(tt / .22)) * (o.s || 1), rot: o.rot || -.08, alpha: (1 - out) * p, shadow: 8 * U(), font: o.font || 'display' }); };
// notes / music (choir gag)
UI.choir = (p, o, t) => { if (p <= 0) return; const u = U(); T(o.text || 'AAAAAAH', o.x, o.y - (t - (o.at || 0)) * 10 * u, { size: 84 * u, fill: '#fff4b0', alpha: p, scale: .9 + .1 * Math.sin(t * 5) }); for (let i = 0; i < 4; i++) { const a = t * 1.5 + i * 1.6; musicNote(o.x - 340 * u + i * 220 * u, o.y - 70 * u - ((t * 60 + i * 40) % 160) * u, .9 * u, Math.sin(a) * .3, '#fff4b0', p); } };
function musicNote(x, y, s, rot, col, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ell(-14, 20, 15, 11, col, 5, -.4); ell(30, 10, 15, 11, col, 5, -.4); line(-1, 16, -1, -40, 6); line(43, 6, 43, -50, 6); ctx.beginPath(); ctx.moveTo(-1, -40); ctx.lineTo(43, -50); ctx.lineTo(43, -36); ctx.lineTo(-1, -26); ctx.closePath(); fs(C.ink, 3); ctx.restore(); }

// ---------------------------------------------------------------- BRAND
// Vietadvisor mark: map pin holding a star + wordmark (placeholder lockup — swap for the official logo file if needed)
function vaMark(x, y, s = 1, col = C.brand) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); shaded(() => { ctx.moveTo(0, 60); ctx.bezierCurveTo(-14, 30, -46, 6, -46, -26); ctx.arc(0, -26, 46, Math.PI, 0); ctx.bezierCurveTo(46, 6, 14, 30, 0, 60); ctx.closePath(); }, col, { lw: 6 }); star(0, -26, 26, C.gold, 4); ctx.restore(); }
function vaLogo(x, y, s = 1, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); vaMark(-textW('vietadvisor', 96) / 2 - 46, -6, 1, o.mark || C.brand); T('vietadvisor', 20, 0, { size: 96, fill: o.color || '#fff', lw: o.lw ?? 16, stroke: o.stroke || C.ink }); if (o.tag) T(o.tag, 20, 76, { size: 30, font: 'body', fill: o.tagColor || '#fff', lw: o.lw === 0 ? 0 : 8, ls: 3 }); ctx.restore(); }
UI.logo = (p, o) => vaLogo(o.x ?? W / 2, o.y ?? H / 2, (o.s || 1) * U() * p, o);
// end frame — required on every video by the brand guide ("— Vietadvisor")
UI.endFrame = (p, o, t) => { if (p <= 0) return; const u = U(); ctx.save(); ctx.globalAlpha *= clamp(p * 2);
  { const g = ctx.createRadialGradient(W / 2, H * .46, 10, W / 2, H * .46, Math.max(W, H) * .75); g.addColorStop(0, '#3a2a7a'); g.addColorStop(.6, '#1b1a4f'); g.addColorStop(1, '#0b0c2a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } // nutshell end frame: deep ground, soft rings, one warm glow
  ctx.save(); ctx.globalAlpha *= .08; for (let k = 1; k <= 6; k++) { ctx.beginPath(); ctx.arc(W / 2, H * .46, (k * 150 + (t * 20) % 150) * u, 0, TAU); ctx.lineWidth = 3 * u; ctx.strokeStyle = '#fff'; ctx.stroke(); } ctx.restore();
  glow(W / 2, H * .46, 380 * u, C.brand, .28); { const r = rng(4); ctx.save(); for (let i = 0; i < 40; i++) { ctx.globalAlpha = .15 + r() * .3; circ((r() * W + t * 10 * u) % W, (r() * H - t * 8 * u + H * 3) % H, (1.5 + r() * 3.5) * u, '#fff6e0', 0); } ctx.restore(); }
  T('— Vietadvisor', W / 2, H * .46, { size: Math.min(120 * u, W * .8 / textW('— Vietadvisor', 100) * 100), fill: '#fff', lw: 0, scale: lerp(.85, 1, E.back(clamp(p))) });
  T(o.url || 'vietadvisor.travel', W / 2, H * .46 + 110 * u, { size: 44 * u, font: 'body', fill: '#ffb38a', lw: 0 }); ctx.restore(); };
// CTA pill
UI.cta = (p, o, t) => { if (p <= 0) return; const u = U() * (o.s || 1); const pul = 1 + Math.sin(t * 6) * .025; ctx.save(); ctx.translate(o.x ?? W / 2, o.y ?? H * .8); ctx.scale(p * pul * u, p * pul * u);
  const w = Math.max(textW(o.text || 'vietadvisor.travel', 56), textW(o.top || '', 34, 'body')) + 120; ctx.save(); ctx.globalAlpha *= .3; rr(-w / 2 + 10, -50, w, 124, 62, '#000', 0); ctx.restore();
  sRR(-w / 2, -62, w, 124, 62, C.brand, { lw: 8 }); if (o.top) T(o.top, 0, -18, { size: 34, fill: '#ffe4d8', lw: 0, font: 'body' }); T(o.text || 'vietadvisor.travel', 0, o.top ? 26 : 0, { size: 56, fill: '#fff', lw: 0 }); ctx.restore(); };

// ---------------------------------------------------------------- CAPTIONS (narration subtitles)
// *word* = highlighted in yellow, [word] = brand accent (prices / punchlines)
function caption(text, t0, t1, t, o = {}) {
  if (t < t0 || t > t1) return; const u = U(); const vert = H > W; const sf = SAFE();
  const pin = E.back(clamp((t - t0) / .2)), out = clamp((t1 - t) / .15);
  const size = (vert ? 34 : 30) * u; const maxW = (vert ? W * .8 : W * .7); // FIXED caption: small, one place, never moves (house rule Oct 2026) // smaller, out of the way: the picture is the star
  const toks = []; let mode = 0; String(text).split(/(\*|\[|\])/).forEach(seg => { if (seg === '*') { mode = mode === 1 ? 0 : 1; return; } if (seg === '[') { mode = 2; return; } if (seg === ']') { mode = 0; return; } seg.split(/(\s+)/).forEach(w => { if (w) toks.push([w, mode]); }); });
  if (!/[\*\[]/.test(String(text))) toks.forEach(tk => { if (/\d/.test(tk[0])) tk[1] = 1; }); // one accent colour, automatic: numbers, years, prices (manual *marks* switch this off)
  setFont(size, 'body', 800); const lines = [[]]; let lw = 0;
  for (const tk of toks) { const w = ctx.measureText(tk[0]).width; if (lw + w > maxW && tk[0].trim()) { lines.push([]); lw = 0; } if (!lines[lines.length - 1].length && !tk[0].trim()) continue; lines[lines.length - 1].push(tk); lw += w; }
  const lh = size * 1.25; const yBase = vert ? H * .815 : H - 48 * u; const y0 = yBase - (lines.length - 1) * lh; // fixed baseline: 81.5 % on 9:16, 48 u from the bottom on 16:9 — capY is ignored
  ctx.save(); ctx.globalAlpha *= out; ctx.translate(W / 2, y0); ctx.scale(.96 + .04 * pin, .96 + .04 * pin); ctx.translate(-W / 2, -y0);
  lines.forEach((ln, li) => { setFont(size, 'body', 800); const tw = ln.reduce((s, tk) => s + ctx.measureText(tk[0]).width, 0); let x = W / 2 - tw / 2; const y = y0 + li * lh;
    for (const [w, m] of ln) { T(w, x, y, { size, font: 'body', weight: 800, align: 'left', fill: m === 1 ? C.yel : m === 2 ? '#ff8a6a' : '#fff', lw: size * .22, shadow: 4 * u }); setFont(size, 'body', 800); x += ctx.measureText(w).width; } });
  ctx.restore();
}
