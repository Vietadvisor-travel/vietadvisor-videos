/* Poison Pill v4.2 — MODES batch 3: FAST modes. Pure Canvas2D (no WebGL, no per-pixel work, cached sprites), so they render
   in ~40–80 ms a frame on a weak CPU, yet read as depth & motion: isometric pseudo-3D, perspective cards, rollers, liquids,
   boards. at:<word> = when the mode starts (default: the beat start); go:<word> = its payoff. Every mode follows the active LOOK (light or dark) and is timed to spoken words.
   isocity    n:16 · hi:<n> · lab:<label on hi> · grow:<word> · fall:<word>              an isometric city rises… and sinks
   isobars    bars:2019=12~2020=30~2021=80 · pre:$ · unit:B · at:<word>                 isometric 3D bar chart (last drop in red)
   coverflow  img:a,b,c,d,e · lab:A,B,C,D,E · pick:3 · go:<word>                          photo cards in perspective, one comes forward
   spinpaper  head:<headline> · sub:<deck> · img:<photo> · name:THE DAILY · date:<…> · at:<word>   the classic spinning newspaper
   spotlight  img:a,b,c,d · lab:A,B,C,D · pick:2 · go:<word>                              a dark stage, the light sweeps and picks one
   units      n:100 · hit:37 · lab:<what> · icon:person|coin|house · go:<word>             icon array: 37 of 100 turn red
   tank       from:100 · to:12 · lab:CASH · pre:$ · unit:M · go:<word>                      a glass tank of cash drains
   race       years:2018,2019,2020 · rows:A=1,5,9~B=3,4,2~C=2,8,12 · pre:$ · unit:B          bar-chart race over the years
   rollnum    to:1750000000 · pre:$ · lab:RAISED · at:<word>                               mechanical digit rollers spin to a number
   faceoff    left:<img>,<LABEL>,<stat> · right:<img>,<LABEL>,<stat> · win:left|right · go:<word>   split-screen versus
   invoice    items:Rent=2000~Staff=9000~Ads=40000 · pre:$ · total:TOTAL · stamp:UNPAID · go:<word>        a receipt prints, the total gets stamped
   candles    pts:10,12,15,14,20,8,3 · lab:<ticker> · crash:<word>                         candlestick chart + ticker tape
   vault      lab:<whose vault> · open:<word> · inside:empty|gold|<img>                     the vault door spins and swings open
   slots      reels:BUY~SELL~HOLD · lab:<what is gambled> · go:<word>                     a slot machine decides
   outbreak   seeds:3 · lab:USERS · to:<final count> · at:<word>                           a grid of dots catches it from neighbours
   meter      from:20 · to:95 · lab:RISK · at:<word>                                       a gauge needle swings into the red
   calendar   from:2019-03 · n:18 · at:<word>                                              desk-calendar pages tear off, months fly
   papercut   lab:<title> · sub:<line> · rise:<word>                                       layered paper landscape (a breather / chapter card)
   flapboard  title:DEPARTURES · rows:NEW YORK=CANCELLED~LONDON=DELAYED · at:<word>        an airport split-flap board flips */
(function () {
  if (!window.PPCINE) return; const { EXT, num, split, toned, HAS, PP, LOOK } = window.PPCINE;
  let INK = '#14213d', RED = '#c0392b', CARD = '#f6efdf', SH = 'rgba(40,25,10,.38)', DK = 0, CREAM = '#efe5d0';
  const thm = () => { const t = window.PPCINE.THEME(); INK = t.ink; RED = t.red; CARD = t.card; SH = t.sh; DK = t.dark; CREAM = t.cream; };
  const IA = a => DK ? `rgba(232,238,248,${a})` : `rgba(20,33,61,${a})`;
  const cut = (fn, u, k = 1) => { ctx.save(); ctx.shadowColor = SH; ctx.shadowBlur = 16 * u * k; ctx.shadowOffsetY = 9 * u * k; ctx.shadowOffsetX = 3 * u * k; fn(); ctx.restore(); };
  const tone = () => (LOOK.cur && LOOK.cur.mid && LOOK.cur.mid.tone) || 'aged';
  const img = (id, t) => { id = String(id || '').replace(/^@/, '').trim(); return id && HAS(id) ? toned(id, t || tone(), 0, 'print').c : null; };
  function cover(c, x, y, w, h, fx = .5, fy = .3) { if (!c) { ctx.fillStyle = IA(.14); ctx.fillRect(x, y, w, h); return; } const s = Math.max(w / c.width, h / c.height); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(c, x + (w - c.width * s) * fx, y + (h - c.height * s) * fy, c.width * s, c.height * s); ctx.restore(); }
  const lab = (s, x, y, size, col = INK, o = {}) => T(String(s).toUpperCase(), x, y, { size, font: o.font || 'cond', weight: o.weight || 700, fill: col, lw: 0, ls: (o.ls ?? 2) * U(), align: o.align || 'center', alpha: o.alpha });
  const big = (v, pre = '', unit = '') => { const a = Math.abs(v); return pre + (a >= 1e9 ? (v / 1e9).toFixed(a % 1e9 ? 1 : 0) + 'B' : a >= 1e6 ? (v / 1e6).toFixed(a % 1e6 ? 1 : 0) + 'M' : a >= 1e4 ? Math.round(v / 1e3) + 'K' : (Math.round(v * 10) / 10).toLocaleString('en-US')) + unit; };
  const P = (e, lt) => lt - e.t; const mode = (draw, sfx) => ({ world: true, sfx, draw: (e, lt, X) => { thm(); draw(e, lt, X); } });
  const kv = (s, sep = '~') => split(s, sep).map(x => { const i = x.lastIndexOf('='); return i < 0 ? [x.trim(), 0] : [x.slice(0, i).trim(), x.slice(i + 1).trim()]; });
  const spring = (x, k = 9, d = 4.2) => x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(k * x);
  // isometric helpers
  const C30 = Math.cos(Math.PI / 6), S30 = .5; const isoP = (cx, cy, s) => (x, y, z) => [cx + (x - y) * C30 * s, cy + (x + y) * S30 * s - z * s];
  const shade = () => DK ? ['#4a5d80', '#2c3a55', '#1d2740'] : ['#f6efdf', '#d9cbb0', '#b5a483'];
  const accent = () => [PP.gold, PP.gold2];
  function box(pj, x, y, w, d, h, cols, o = {}) { const p = (a, b, c) => pj(a, b, c); const [top, left, right] = cols; ctx.lineJoin = 'round';
    const poly = (pts, f) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = f; ctx.fill(); if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = o.lw || 1; ctx.stroke(); } };
    poly([p(x, y + d, 0), p(x + w, y + d, 0), p(x + w, y + d, h), p(x, y + d, h)], left); poly([p(x + w, y, 0), p(x + w, y + d, 0), p(x + w, y + d, h), p(x + w, y, h)], right); poly([p(x, y, h), p(x + w, y, h), p(x + w, y + d, h), p(x, y + d, h)], top);
    if (o.win && h > .6) { ctx.fillStyle = o.win; for (let zz = .35; zz < h - .2; zz += .42) for (let k = 1; k <= 3; k++) { const a = p(x + w * k / 4 - .06, y + d, zz), b = p(x + w * k / 4 + .06, y + d, zz + .18); ctx.fillRect(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]) + 1, Math.abs(b[1] - a[1]) + 1); } } }

  // ---------------------------------------------------------------- ISOCITY: the empire, block by block — and the fall
  EXT.isocity = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const n = Math.min(36, num(e.n, 16)); const g = Math.ceil(Math.sqrt(n)); const tg = X.at(e.grow, e.t + .2), tf = e.fall ? X.at(e.fall, 1e9) : 1e9; const hi = num(e.hi, 0) - 1; const r = rng(91 + n);
    const hs = [...Array(n)].map((_, i) => .8 + r() * 3.2 + (i === hi ? 1.6 : 0)); const s = W * .5 / (g * 1.6 * 2 * C30); const pj0 = isoP(0, 0, s); const [ox, oy] = pj0(g * .8, g * .8, 0); const pj = isoP(W / 2 - ox, H * .66 - oy, s);
    X.layer(2, () => { const [tc, lc, rc] = shade(); ctx.fillStyle = IA(.08); ctx.beginPath(); [pj(-.4, -.4, 0), pj(g * 1.6, -.4, 0), pj(g * 1.6, g * 1.6, 0), pj(-.4, g * 1.6, 0)].forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q)); ctx.closePath(); ctx.fill();
      const order = [...Array(n).keys()].sort((a, b) => ((a % g) + Math.floor(a / g)) - ((b % g) + Math.floor(b / g)));
      order.forEach(i => { const gx = (i % g) * 1.6, gy = Math.floor(i / g) * 1.6; const t0 = tg + ((i % g) + Math.floor(i / g)) * .07; const k = spring(clamp((lt - t0) / .9) * 1.4, 8, 5); if (k <= 0) return;
        const df = (g * 2 - ((i % g) + Math.floor(i / g))) * .06; const sink = lt > tf + df ? E.in(clamp((lt - tf - df) / .8)) : 0; const h = Math.max(.02, hs[i] * k * (1 - sink)); const isH = i === hi; const cols = isH ? [accent()[1], accent()[0], DK ? '#7a5a10' : '#8a6200'] : sink > 0 ? [RED, '#8e2a1b', '#5a1a10'] : [tc, lc, rc];
        ctx.save(); if (sink > 0 && sink < 1) ctx.translate(Math.sin(lt * 60 + i) * 2 * u, 0); box(pj, gx, gy, 1.1, 1.1, h, cols, { win: isH ? 'rgba(255,255,255,.35)' : IA(.18), line: IA(.25), lw: 1 * u }); ctx.restore();
        if (isH && e.lab && k > .7 && !sink) { const [x, y] = pj(gx + .55, gy + .55, h); ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(x, y - 6 * u); ctx.lineTo(x, y - 60 * u); ctx.stroke(); const tw = Math.max(120 * u, String(e.lab).length * 19 * u); cut(() => { ctx.fillStyle = CARD; ctx.fillRect(x - tw / 2, y - 112 * u, tw, 52 * u); }, u, .6); lab(e.lab, x, y - 86 * u, 32 * u, INK); ctx.restore(); } }); });
  }, (e, at) => [[at(e.grow, e.t + .2), 'riser_short', .45], ...(e.fall ? [[at(e.fall, 1e9), 'impact_heavy', .8], [at(e.fall, 1e9) + .3, 'battle_rock_break', .5]] : [])]);

  // ---------------------------------------------------------------- ISOBARS: an isometric 3D bar chart
  EXT.isobars = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const bars = kv(e.bars).map(([a, b]) => [a, parseFloat(b)]); const n = bars.length; const mx = Math.max(...bars.map(b => b[1]), 1); const t0 = X.at(e.at, e.t + .2);
    const s = Math.min(W / (n * 2.3 + 3), H / 9); const pj = isoP(W * .5 - (n * 1.5) * C30 * s * .5 + n * .2 * s, H * .74 - n * 1.5 * S30 * s * .5, s); const hmax = 5.2;
    X.layer(2, () => { const [tc, lc, rc] = shade(); ctx.strokeStyle = IA(.25); ctx.lineWidth = 1.5 * u; for (let z = 0; z <= 4; z++) { const a = pj(-.3, 1.6, z * hmax / 4), b = pj(n * 1.5, 1.6, z * hmax / 4); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
      bars.forEach(([name, v], i) => { const k = E.out5(clamp((lt - t0 - i * .35) / .7)); const h = Math.max(.02, v / mx * hmax * k); const drop = i && v < bars[i - 1][1]; const last = i === n - 1; const cols = last && drop ? [RED, '#a8321f', '#7a2014'] : last ? [accent()[1], accent()[0], DK ? '#7a5a10' : '#8a6200'] : [tc, lc, rc];
        box(pj, i * 1.5, 0, 1, 1, h, cols, { line: IA(.3), lw: 1 * u }); }); bars.forEach(([name, v], i) => { const k = E.out5(clamp((lt - t0 - i * .35) / .7)); const h = Math.max(.02, v / mx * hmax * k); const drop = i && v < bars[i - 1][1]; const last = i === n - 1; const [x, y] = pj(i * 1.5 + .5, .5, h); if (k > .1) T(big(v * k, e.pre || '', e.unit || ''), x, y - 40 * u, { size: 44 * u, font: 'impact', fill: last && drop ? RED : INK, stroke: DK ? '#000' : '#fff', lw: 6 * u, alpha: clamp(k * 2) }); const [lx, ly] = pj(i * 1.5 + .5, 1.3, 0); lab(name, lx, ly + 28 * u, 26 * u, INK); }); });
  }, (e, at) => kv(e.bars).map((_, i) => [at(e.at, e.t + .2) + i * .35, 'impact_soft', .45]));

  // ---------------------------------------------------------------- COVERFLOW: the lineup in perspective; one steps forward
  function persp(c, cx, cy, w, h, ang, strips = 22) { const cos = Math.cos(ang), sin = Math.sin(ang); const pw = w * Math.abs(cos); if (pw < 2) return; const f = 2.2;
    for (let i = 0; i < strips; i++) { const a = i / strips, b = (i + 1) / strips; const xa = (a - .5) * w, xb = (b - .5) * w; const za = xa * sin / (w * f), zb = xb * sin / (w * f); const sa = 1 / (1 + za), sb = 1 / (1 + zb);
      const X0 = cx + xa * cos * sa, X1 = cx + xb * cos * sb; const hh = h * (sa + sb) / 2; if (c) ctx.drawImage(c, a * c.width, 0, c.width / strips + .5, c.height, Math.min(X0, X1), cy - hh / 2, Math.abs(X1 - X0) + .8, hh); else { ctx.fillRect(Math.min(X0, X1), cy - hh / 2, Math.abs(X1 - X0) + .8, hh); } } }
  const CFC = {}; function cardSprite(id, name, w, h) { const key = [id, name, w, h, LOOK.name].join('|'); if (CFC[key]) return CFC[key]; const c = mkCanvas(Math.round(w), Math.round(h)), g = c.getContext('2d'); const u = U();
    withCtx(g, () => { ctx.fillStyle = CARD; ctx.fillRect(0, 0, w, h); cover(img(id), 10 * u, 10 * u, w - 20 * u, h - (name ? 70 : 20) * u); if (name) lab(name, w / 2, h - 34 * u, 30 * u, INK); ctx.strokeStyle = IA(.25); ctx.lineWidth = 2 * u; ctx.strokeRect(1, 1, w - 2, h - 2); }); return (CFC[key] = c); }
  EXT.coverflow = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const ids = split(e.img, ','), names = split(e.lab, ','); const n = ids.length; const pick = clamp(num(e.pick, Math.ceil(n / 2)) - 1, 0, n - 1); const tg = X.at(e.go, e.t + 1.2);
    const k = E.inOut(clamp((lt - tg) / 1)); const scroll = lerp(-1.2, pick, E.out(clamp(p / 1.6)) * (1 - k) + k) ; const cw = W * .2, ch = cw * 1.3;
    X.layer(2, () => { const items = ids.map((id, i) => ({ i, d: i - scroll })); items.sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).forEach(({ i, d }) => { const ad = Math.abs(d); const sel = i === pick ? k : 0; const ang = clamp(d, -1, 1) * -1.0 * (1 - sel);
      const x = W / 2 + Math.sign(d) * (Math.min(ad, 1) * W * .2 + Math.max(0, ad - 1) * W * .1); const y = H * .47; const sc = (ad < 1 ? lerp(1.15, .9, ad) : .9) * (1 + sel * .25); const c = cardSprite(ids[i], names[i], cw, ch);
      ctx.save(); ctx.globalAlpha *= clamp(1.6 - ad * .35) * (i !== pick && k > 0 ? 1 - k * .6 : 1); persp(c, x, y, cw * sc, ch * sc, ang); ctx.globalAlpha *= .18; ctx.scale(1, -1); ctx.translate(0, -2 * (y + ch * sc / 2)); persp(c, x, y - 0, cw * sc, ch * sc * .5, ang, 10); ctx.restore(); });
      if (k > .5 && names[pick]) { lab('▲', W / 2, H * .9, 22 * u, RED, { alpha: (k - .5) * 2 }); } });
  }, (e, at) => [[e.t + .1, 'trans_swipe', .4], [at(e.go, e.t + 1.2), 'whoosh_by', .5], [at(e.go, e.t + 1.2) + .9, 'impact_soft', .5]]);

  // ---------------------------------------------------------------- SPINPAPER: the spinning newspaper lands
  const SPC = {}; function paperSprite(e) { const key = [e.head, e.sub, e.img, e.name, e.date, W].join('|'); if (SPC[key]) return SPC[key]; const pw = Math.round(W * .5), ph = Math.round(pw * 1.25); const c = mkCanvas(pw, ph), g = c.getContext('2d'); const u = U(); const ink = '#16120e';
    withCtx(g, () => { ctx.fillStyle = '#efe9db'; ctx.fillRect(0, 0, pw, ph); const r = rng(5); for (let i = 0; i < 500; i++) { ctx.fillStyle = r() > .5 ? 'rgba(80,60,30,.05)' : 'rgba(255,255,255,.1)'; ctx.fillRect(r() * pw, r() * ph, (5 + r() * 40) * u, 1.2 * u); }
      T(String(e.name || 'THE DAILY RECORD').toUpperCase(), pw / 2, 64 * u, { size: 62 * u, font: 'serif', fill: ink, lw: 0 }); ctx.fillStyle = ink; ctx.fillRect(30 * u, 106 * u, pw - 60 * u, 3 * u); ctx.fillRect(30 * u, 132 * u, pw - 60 * u, 1.5 * u); lab(e.date || '', pw / 2, 119 * u, 16 * u, ink, { ls: 4 });
      const lines = wrap(String(e.head || 'HEADLINE').toUpperCase(), 76 * u, pw - 70 * u, 'impact'); lines.slice(0, 3).forEach((l, i) => T(l, pw / 2, 190 * u + i * 80 * u, { size: 76 * u, font: 'impact', fill: ink, lw: 0 })); let y = 190 * u + Math.min(3, lines.length) * 80 * u - 20 * u;
      if (e.sub) { T(e.sub, pw / 2, y + 26 * u, { size: 24 * u, font: 'serif', weight: 700, fill: '#3a332a', lw: 0 }); y += 50 * u; } const im = img(e.img, 'bw'); const ih = ph - y - 150 * u; if (ih > 60 * u) { cover(im, 30 * u, y + 10 * u, pw * .58, ih); ctx.strokeStyle = ink; ctx.lineWidth = 1.5 * u; ctx.strokeRect(30 * u, y + 10 * u, pw * .58, ih); }
      ctx.fillStyle = 'rgba(22,18,14,.55)'; for (let col = 0; col < 2; col++) for (let l = 0; l < 30; l++) { const x0 = col ? 30 * u + pw * .58 + 20 * u : 30 * u; const wcol = col ? pw - x0 - 30 * u : pw * .58; const yy = col ? y + 14 * u + l * 15 * u : ph - 130 * u + l * 14 * u; if (yy > ph - 20 * u || (col && yy > y + ih)) continue; ctx.fillRect(x0, yy, wcol * (.7 + r() * .3), 5 * u); } });
    return (SPC[key] = c); }
  EXT.spinpaper = mode((e, lt, X) => { const u = X.u; const t0 = X.at(e.at, e.t + .1); const p = lt - t0; if (p < 0) return; const c = paperSprite(e); const k = E.out(clamp(p / 1.1));
    X.layer(2, () => { ctx.save(); ctx.translate(W / 2, H * .5); ctx.rotate((1 - k) * 6 * Math.PI + (-.04) * k); const s = lerp(.05, 1, k) * (H * .92 / c.height) * (1 + Math.max(0, p - 1.1) * .02); ctx.scale(s, s); cut(() => ctx.drawImage(c, -c.width / 2, -c.height / 2), u / s * 1.5); ctx.restore();
      if (p > 1.1 && p < 1.35) { ctx.fillStyle = `rgba(255,255,255,${(1.35 - p) * 1.2})`; ctx.fillRect(0, 0, W, H); } });
  }, (e, at) => [[at(e.at, e.t + .1), 'riser_short', .5], [at(e.at, e.t + .1) + 1.1, 'impact_stamp', .8], [at(e.at, e.t + .1) + 1.12, 'foley_paper_flutter', .5]]);

  // ---------------------------------------------------------------- SPOTLIGHT: a dark stage, the light picks the one
  EXT.spotlight = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const ids = split(e.img, ','), names = split(e.lab, ','); const n = Math.max(1, ids.length); const pick = clamp(num(e.pick, 1) - 1, 0, n - 1); const tp = X.at(e.go, e.t + 1.8);
    const cw = Math.min(W * .17, W * .8 / n), ch = cw * 1.35; const xs = ids.map((_, i) => W / 2 + (i - (n - 1) / 2) * cw * 1.18);
    let sx; if (lt < tp) { const q = (lt - e.t) / Math.max(.5, tp - e.t); sx = W / 2 + Math.sin(q * Math.PI * 2.2) * W * .33; } else sx = lerp(W / 2 + Math.sin(2.2 * Math.PI) * W * .33, xs[pick], E.out(clamp((lt - tp) / .5)));
    X.layer(2, () => { ctx.fillStyle = DK ? '#0b0f18' : '#2a2a2e'; ctx.fillRect(0, H * .8, W, H * .2); ids.forEach((id, i) => { const x = xs[i], y = H * .44; cut(() => { ctx.fillStyle = CARD; ctx.fillRect(x - cw / 2, y - ch / 2, cw, ch); }, u, .7); cover(img(id, 'bw'), x - cw / 2 + 8 * u, y - ch / 2 + 8 * u, cw - 16 * u, ch - 60 * u); if (names[i]) lab(names[i], x, y + ch / 2 - 26 * u, Math.min(28 * u, cw / Math.max(4, names[i].length) * 1.7), INK); }); });
    X.layer(2.2, () => { const lit = lt >= tp ? 1 : 0; const R = lerp(W * .16, cw * .85, lit * E.out(clamp((lt - tp) / .5))); const g = ctx.createRadialGradient(sx, H * .5, R * .55, sx, H * .5, R * 1.25); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(4,6,10,.86)'); ctx.fillStyle = g; ctx.fillRect(-W * .1, -H * .1, W * 1.2, H * 1.2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cone = ctx.createLinearGradient(sx, 0, sx, H * .8); cone.addColorStop(0, 'rgba(255,240,200,.16)'); cone.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(sx - 20 * u, -10); ctx.lineTo(sx + 20 * u, -10); ctx.lineTo(sx + R, H * .8); ctx.lineTo(sx - R, H * .8); ctx.closePath(); ctx.fill(); ctx.restore(); });
  }, (e, at) => [[e.t + .1, 'foley_click_mech', .6], [at(e.go, e.t + 1.8), 'impact_cinematic', .6]]);

  // ---------------------------------------------------------------- UNITS: an icon array — how many out of 100
  function icon(kind, x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); if (kind === 'coin') { ctx.arc(x, y, s * .42, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.arc(x, y, s * .28, 0, TAU); ctx.fill(); }
    else if (kind === 'house') { ctx.moveTo(x - s * .4, y); ctx.lineTo(x, y - s * .42); ctx.lineTo(x + s * .4, y); ctx.lineTo(x + s * .3, y); ctx.lineTo(x + s * .3, y + s * .4); ctx.lineTo(x - s * .3, y + s * .4); ctx.lineTo(x - s * .3, y); ctx.closePath(); ctx.fill(); }
    else { ctx.arc(x, y - s * .25, s * .17, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - s * .3, y + s * .45); ctx.quadraticCurveTo(x - s * .3, y - s * .05, x, y - s * .03); ctx.quadraticCurveTo(x + s * .3, y - s * .05, x + s * .3, y + s * .45); ctx.closePath(); ctx.fill(); } }
  EXT.units = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const n = Math.min(400, num(e.n, 100)), hit = num(e.hit, 37); const th = X.at(e.go, e.t + 1.4); const cols = n <= 100 ? 10 : 20, rows = Math.ceil(n / cols); const s = Math.min(H * .66 / rows, W * .5 / cols);
    const x0 = W * .3 - cols * s / 2, y0 = H * .46 - rows * s / 2 + s / 2; const rank = [...Array(n).keys()];
    X.layer(2, () => { for (let i = 0; i < n; i++) { const c = i % cols, rr = Math.floor(i / cols); const a = clamp((lt - e.t - (c + rr) * .025) / .3); if (a <= 0) continue; const isHit = rank[i] < hit && lt > th + rank[i] * (1.2 / Math.max(1, hit)); ctx.save(); ctx.globalAlpha *= a; icon(e.icon || 'person', x0 + c * s + s / 2, y0 + rr * s, s * (isHit ? 1.08 : .92) * E.back(a), isHit ? RED : IA(.35)); ctx.restore(); }
      const shown = Math.round(hit * clamp((lt - th) / 1.2)); if (lt > th) { T(e.pct === '0' ? String(shown) : `${Math.round(shown / n * 100)}%`, W * .72, H * .4, { size: 190 * u, font: 'impact', fill: RED, lw: 0 }); lab(e.lab || '', W * .72, H * .58, 38 * u, INK); lab(`${shown} OUT OF ${n}`, W * .72, H * .66, 26 * u, IA(.7)); } });
  }, (e, at) => [[e.t + .1, 'pop_cascade', .35], [at(e.go, e.t + 1.4), 'tick_roll', .5]]);

  // ---------------------------------------------------------------- TANK: the cash drains
  EXT.tank = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const a = num(e.from, 100), b = num(e.to, 10); const t0 = X.at(e.go, e.t + .6); const k = E.inOut(clamp((lt - t0) / num(e.dur, 2.2))); const v = lerp(a, b, k); const lvl = v / Math.max(a, b);
    const tw = W * .24, th = H * .62, tx = W * .36 - tw / 2, ty = H * .14; const low = lvl < .25; const liq = low ? RED : (DK ? '#2bb39a' : '#3f8f6b');
    X.layer(2, () => { cut(() => { ctx.fillStyle = IA(.08); ctx.fillRect(tx, ty, tw, th); }, u, .5); const top = ty + th * (1 - lvl * .94); ctx.save(); ctx.beginPath(); ctx.rect(tx, ty, tw, th); ctx.clip(); ctx.fillStyle = liq; ctx.globalAlpha *= .88; ctx.beginPath(); ctx.moveTo(tx, ty + th);
      for (let i = 0; i <= 30; i++) { const x = tx + tw * i / 30; ctx.lineTo(x, top + Math.sin(i * .6 + lt * 5) * 5 * u + Math.sin(i * .23 - lt * 3) * 4 * u); } ctx.lineTo(tx + tw, ty + th); ctx.closePath(); ctx.fill(); ctx.globalAlpha = .35; ctx.fillStyle = '#fff'; const rb = rng(3); for (let i = 0; i < 14; i++) { const by = ty + th - ((lt * 60 * u + rb() * th) % (th * Math.max(.05, lvl))); ctx.beginPath(); ctx.arc(tx + rb() * tw, by, (2 + rb() * 4) * u, 0, TAU); ctx.fill(); } ctx.restore();
      if (k > 0 && k < 1) { ctx.fillStyle = liq; ctx.fillRect(tx + tw * .5 - 6 * u, ty + th, 12 * u, H - ty - th); }
      ctx.strokeStyle = INK; ctx.lineWidth = 4 * u; ctx.strokeRect(tx, ty, tw, th); ctx.lineWidth = 2 * u; for (let i = 1; i < 4; i++) { const y = ty + th * i / 4; ctx.beginPath(); ctx.moveTo(tx + tw, y); ctx.lineTo(tx + tw - 22 * u, y); ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(tx + 12 * u, ty + 8 * u, 10 * u, th - 16 * u);
      T(big(v, e.pre || '$', e.unit || ''), W * .7, H * .4, { size: 150 * u, font: 'impact', fill: low ? RED : INK, lw: 0 }); lab(e.lab || 'CASH', W * .7, H * .56, 40 * u, INK); });
  }, (e, at) => [[at(e.go, e.t + .6), 'nature_bubble', .5], [at(e.go, e.t + .6) + .2, 'riser_downer', .4]]);

  // ---------------------------------------------------------------- RACE: a bar-chart race across the years
  EXT.race = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const yrs = split(e.years, ','); const rows = kv(e.rows).map(([a, b]) => [a, String(b).split(',').map(Number)]); const ny = yrs.length; const dur = num(e.dur, Math.max(2, X.dur - (e.t - 0) - .6));
    const q = clamp(p / dur) * (ny - 1); const i0 = Math.floor(q), f = E.inOut(q - i0), i1 = Math.min(ny - 1, i0 + 1); const vals = rows.map(([n, v]) => [n, lerp(v[i0] || 0, v[i1] || 0, f)]); const sorted = [...vals].sort((a, b) => b[1] - a[1]); const mx = Math.max(...vals.map(v => v[1]), 1);
    const rankOf = (yi) => { const s = rows.map(([n, v]) => [n, v[yi] || 0]).sort((a, b) => b[1] - a[1]); return Object.fromEntries(s.map((x, i) => [x[0], i])); }; const r0 = rankOf(i0), r1 = rankOf(i1); const bh = Math.min(H * .1, H * .66 / rows.length);
    const palette = [PP.gold, RED, DK ? '#5aa9ff' : '#1d4ed8', DK ? '#2bb39a' : '#2a6b5e', DK ? '#c4b5fd' : '#7c3aed', IA(.6)];
    X.layer(2, () => { vals.forEach(([n, v], k) => { const rk = lerp(r0[n], r1[n], f); const y = H * .14 + rk * bh * 1.2; const w = W * .62 * v / mx * clamp(p / .6); const x = W * .2; cut(() => { ctx.fillStyle = palette[k % palette.length]; ctx.fillRect(x, y, Math.max(2, w), bh); }, u, .4);
      lab(n, x - 14 * u, y + bh / 2, Math.min(32 * u, bh * .5), INK, { align: 'right' }); T(big(v, e.pre || '', e.unit || ''), x + w + 12 * u, y + bh / 2, { size: Math.min(34 * u, bh * .55), font: 'impact', fill: INK, lw: 0, align: 'left' }); });
      T(yrs[f > .5 ? i1 : i0], W * .86, H * .74, { size: 150 * u, font: 'impact', fill: IA(.25), lw: 0 }); });
  }, (e) => split(e.years, ',').map((_, i) => [e.t + i * .9, 'ui_data_blip', .3]));

  // ---------------------------------------------------------------- ROLLNUM: mechanical rollers spin to the number
  EXT.rollnum = mode((e, lt, X) => { const u = X.u; const t0 = X.at(e.at, e.t + .2); const p = lt - t0; if (lt < e.t) return; const v = Math.round(num(e.to, 1000000)); const str = (e.pre || '') + v.toLocaleString('en-US') + (e.unit || ''); const n = str.length;
    const cw = Math.min(W * .8 / n, 120 * u), ch = cw * 1.6; const x0 = W / 2 - n * cw / 2; const y = H * .45; let di = 0; const nd = str.replace(/\D/g, '').length;
    X.layer(2, () => { cut(() => { ctx.fillStyle = DK ? '#0b0f18' : '#1a1a1e'; ctx.fillRect(x0 - 20 * u, y - ch / 2 - 20 * u, n * cw + 40 * u, ch + 40 * u); }, u);
      [...str].forEach((ch_, i) => { const x = x0 + i * cw; const isD = /\d/.test(ch_); ctx.fillStyle = isD ? '#f4f1ea' : 'transparent'; if (isD) ctx.fillRect(x + 4 * u, y - ch / 2, cw - 8 * u, ch);
        ctx.save(); ctx.beginPath(); ctx.rect(x, y - ch / 2, cw, ch); ctx.clip(); if (isD) { const d = +ch_; const delay = (nd - 1 - di) * .12; const spins = 2 + (nd - 1 - di) * .6; const k = E.out(clamp((p - delay) / (1.6 + di * .05))); const pos = (d + 10 * Math.floor(spins)) * k; di++;
          for (let j = Math.floor(pos) - 1; j <= Math.floor(pos) + 1; j++) { const dy = (j - pos) * ch; T(String(((j % 10) + 10) % 10), x + cw / 2, y + dy, { size: ch * .72, font: 'impact', fill: '#16120e', lw: 0 }); } ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x, y - ch / 2, cw, ch * .18); ctx.fillRect(x, y + ch * .32, cw, ch * .18); }
        else T(ch_, x + cw / 2, y, { size: ch * .62, font: 'impact', fill: PP.gold, lw: 0 }); ctx.restore(); });
      if (e.lab) lab(e.lab, W / 2, y + ch / 2 + 70 * u, 40 * u, INK, { alpha: clamp((p - 1.2) / .4) }); });
  }, (e, at) => [[at(e.at, e.t + .2), 'foley_ratchet', .6], [at(e.at, e.t + .2) + 1.8, 'impact_metal', .5]]);

  // ---------------------------------------------------------------- FACEOFF: split-screen versus
  EXT.faceoff = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const L = String(e.left || '').split(/[,|]/), R = String(e.right || '').split(/[,|]/); const tw = e.win ? X.at(e.go, e.t + 1.6) : 1e9; const k = E.out5(clamp(p / .6)); const lose = e.win === 'left' ? 'R' : e.win === 'right' ? 'L' : '';
    const side = (S, isL) => { const sl = isL ? -1 : 1; const off = (1 - k) * W * .6 * sl; const lost = lose === (isL ? 'L' : 'R') && lt > tw; ctx.save(); ctx.translate(off, 0); ctx.beginPath(); if (isL) { ctx.moveTo(0, 0); ctx.lineTo(W * .56, 0); ctx.lineTo(W * .44, H); ctx.lineTo(0, H); } else { ctx.moveTo(W * .56, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(W * .44, H); } ctx.closePath(); ctx.clip();
      ctx.fillStyle = isL ? (DK ? '#121a2a' : '#e9e1cf') : (DK ? '#1d1414' : '#efe0d8'); ctx.fillRect(0, 0, W, H); cover(img(S[0], lost ? 'bw' : undefined), isL ? 0 : W * .44, 0, W * .56, H, .5, .25); if (lost) { ctx.fillStyle = 'rgba(10,10,14,.55)'; ctx.fillRect(0, 0, W, H); }
      const g = ctx.createLinearGradient(0, H * .55, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
      const cx = isL ? W * .22 : W * .78; ctx.save(); ctx.translate(off, 0); lab(S[1] || '', cx, H * .72, 54 * u, '#ffffff'); if (S[2]) T(S[2], cx, H * .82, { size: 44 * u, font: 'impact', fill: lost ? '#999' : PP.gold, lw: 0 }); ctx.restore(); };
    X.layer(2, () => { side(L, true); side(R, false); ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.moveTo(W * .56, 0); ctx.lineTo(W * .44, H); ctx.stroke(); ctx.restore();
      const kb = E.back(clamp((p - .45) / .35)); if (kb > 0) { ctx.save(); ctx.translate(W / 2, H * .45); ctx.scale(kb, kb); ctx.rotate(-.08); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, 0, 78 * u, 0, TAU); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6 * u; ctx.stroke(); T('VS', 0, 4 * u, { size: 74 * u, font: 'impact', fill: '#fff', lw: 0 }); ctx.restore(); } });
  }, (e, at) => [[e.t, 'trans_swipe', .6], [e.t + .45, 'hit_slam', .7], ...(e.win ? [[at(e.go, e.t + 1.6), 'impact_stamp', .6]] : [])]);

  // ---------------------------------------------------------------- INVOICE: the receipt prints, the total gets stamped
  EXT.invoice = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const items = kv(e.items).map(([a, b]) => [a, parseFloat(b)]); const total = items.reduce((s, x) => s + x[1], 0); const tt = X.at(e.go, e.t + .5 + items.length * .45 + .3); const pre = e.pre ?? '$';
    const rw = W * .3, lh = 46 * u; const rh = (items.length + 6) * lh; const shown = clamp(p / (.5 + items.length * .45 + .4)); const vis = rh * E.out(shown); const sx = W * .5 - rw / 2, slot = H * .08;
    X.layer(2, () => { ctx.fillStyle = DK ? '#0b0f18' : '#2b2b30'; ctx.fillRect(sx - 30 * u, slot - 34 * u, rw + 60 * u, 40 * u); ctx.save(); ctx.beginPath(); ctx.rect(sx - 10 * u, slot, rw + 20 * u, H); ctx.clip(); const y0 = slot + vis - rh;
      cut(() => { ctx.fillStyle = '#fbf8f1'; ctx.beginPath(); ctx.moveTo(sx, y0); ctx.lineTo(sx + rw, y0); for (let i = 0; i <= 20; i++) ctx.lineTo(sx + rw - rw * i / 20, y0 + rh + (i % 2 ? 8 : 0) * u); ctx.closePath(); ctx.fill(); }, u, .6);
      const ink = '#1a1712'; lab(e.title || 'RECEIPT', sx + rw / 2, y0 + lh, 30 * u, ink, { ls: 6 }); ctx.fillStyle = ink; ctx.setLineDash([6 * u, 6 * u]); ctx.strokeStyle = ink; ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.moveTo(sx + 20 * u, y0 + lh * 1.7); ctx.lineTo(sx + rw - 20 * u, y0 + lh * 1.7); ctx.stroke();
      items.forEach(([n, v], i) => { const y = y0 + lh * (2.5 + i); T(String(n).toUpperCase(), sx + 24 * u, y, { size: 26 * u, font: '"Courier New", monospace', weight: 700, fill: ink, lw: 0, align: 'left' }); T(pre + v.toLocaleString('en-US'), sx + rw - 24 * u, y, { size: 26 * u, font: '"Courier New", monospace', weight: 700, fill: ink, lw: 0, align: 'right' }); });
      const yt = y0 + lh * (2.8 + items.length); ctx.beginPath(); ctx.moveTo(sx + 20 * u, yt - lh * .5); ctx.lineTo(sx + rw - 20 * u, yt - lh * .5); ctx.stroke(); ctx.setLineDash([]); T(String(e.total || 'TOTAL'), sx + 24 * u, yt + 6 * u, { size: 34 * u, font: 'impact', fill: ink, lw: 0, align: 'left' }); T(pre + total.toLocaleString('en-US'), sx + rw - 24 * u, yt + 6 * u, { size: 34 * u, font: 'impact', fill: ink, lw: 0, align: 'right' }); ctx.restore();
      if (lt > tt) { const q = clamp((lt - tt) / .2); ctx.save(); ctx.translate(sx + rw * .55, Math.min(H * .7, y0 + rh * .62)); ctx.rotate(-.18); ctx.scale(lerp(2.2, 1, q), lerp(2.2, 1, q)); ctx.globalAlpha *= q * .9; ctx.strokeStyle = RED; ctx.lineWidth = 6 * u; ctx.strokeRect(-150 * u, -46 * u, 300 * u, 92 * u); T(String(e.stamp || 'UNPAID').toUpperCase(), 0, 4 * u, { size: 64 * u, font: 'impact', fill: RED, lw: 0 }); ctx.restore(); } });
  }, (e, at) => [[e.t + .1, 'foley_ratchet', .5], [at(e.go, e.t + .5 + kv(e.items).length * .45 + .3), 'impact_stamp', .8]]);

  // ---------------------------------------------------------------- CANDLES: candlestick chart with a ticker
  EXT.candles = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const pts = split(e.pts, ',').map(Number); const n = pts.length; const tc = e.crash ? X.at(e.crash, 1e9) : 1e9; const r = rng(23); const mn = Math.min(...pts) * .85, mx = Math.max(...pts) * 1.1; const Y = v => lerp(H * .78, H * .12, (v - mn) / (mx - mn || 1));
    const x0 = W * .1, cw = W * .78 / n; const dur = Math.max(1, (tc < 1e9 ? tc - e.t : X.dur * .7)); const wick = pts.map((v, i) => [r(), r()]);
    X.layer(2, () => { ctx.strokeStyle = IA(.12); ctx.lineWidth = 1 * u; for (let i = 0; i <= 5; i++) { const y = H * .12 + i * H * .132; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(W * .9, y); ctx.stroke(); }
      pts.forEach((v, i) => { const prev = i ? pts[i - 1] : v; const ti = e.t + (i / n) * dur * (v < prev && lt > tc ? .6 : 1); const q = clamp((lt - (i / n < .999 && v < prev && tc < 1e9 && i >= n * .6 ? tc + (i - n * .6) * .25 : e.t + i / n * dur)) / .25); if (q <= 0) return; const up = v >= prev; const col = up ? (DK ? '#2bd69a' : '#2a8a5e') : RED; const cx = x0 + i * cw + cw / 2; const o = Y(prev), c = Y(lerp(prev, v, q)); const hi = Math.min(o, c) - wick[i][0] * 18 * u, lo = Math.max(o, c) + wick[i][1] * 18 * u;
        ctx.strokeStyle = col; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(cx, hi); ctx.lineTo(cx, lo); ctx.stroke(); ctx.fillStyle = col; ctx.fillRect(cx - cw * .32, Math.min(o, c), cw * .64, Math.max(3 * u, Math.abs(c - o))); });
      const last = pts.find((v, i) => false); if (e.lab) { ctx.fillStyle = DK ? '#0b0f18' : '#16120e'; ctx.fillRect(0, H * .03, W, 50 * u); const tx = String(e.lab).toUpperCase() + '   ' + pts.map((v, i) => i ? (v >= pts[i - 1] ? '▲ ' : '▼ ') + v : v).join('   ') + '   '; ctx.save(); ctx.beginPath(); ctx.rect(0, H * .03, W, 50 * u); ctx.clip(); const tw = textW(tx, 28 * u, 'cond', 700) + 40 * u; const off = (lt * 160 * u) % tw; for (let k = -1; k < W / tw + 1; k++) T(tx, k * tw - off, H * .03 + 25 * u, { size: 28 * u, font: 'cond', weight: 700, fill: lt > tc ? RED : PP.gold, lw: 0, align: 'left' }); ctx.restore(); } });
  }, (e, at) => [[e.t + .1, 'ui_data_blip', .4], ...(e.crash ? [[at(e.crash, 1e9), 'riser_downer_sub', .7]] : [])]);

  // ---------------------------------------------------------------- VAULT: the door spins, swings open — empty?
  EXT.vault = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const to = X.at(e.open, e.t + 1.6); const spin = E.inOut(clamp((lt - e.t - .2) / Math.max(.4, to - e.t - .3))); const sw = E.inOut(clamp((lt - to) / .9)); const R = H * .34; const cx = W / 2, cy = H * .47;
    X.layer(1.9, () => { ctx.fillStyle = DK ? '#0d1119' : '#2e2b28'; ctx.beginPath(); ctx.arc(cx, cy, R * 1.04, 0, TAU); ctx.fill(); const inside = e.inside || 'empty';
      if (inside === 'gold') { const r = rng(4); for (let i = 0; i < 40; i++) { const x = cx + (r() - .5) * R * 1.4, y = cy + R * .2 + (r() - .2) * R * .6; ctx.fillStyle = r() > .5 ? PP.gold : PP.gold2; ctx.fillRect(x - 30 * u, y - 10 * u, 60 * u, 20 * u); } }
      else if (inside !== 'empty' && HAS(inside)) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * .98, 0, TAU); ctx.clip(); cover(img(inside), cx - R, cy - R, R * 2, R * 2); ctx.restore(); }
      else { ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(cx - R * .6, cy - R * .2, R * 1.2, 6 * u); ctx.fillRect(cx - R * .6, cy + R * .3, R * 1.2, 6 * u); if (sw > .8) T('EMPTY', cx, cy, { size: 80 * u, font: 'impact', fill: RED, lw: 0, alpha: (sw - .8) * 5 }); } });
    X.layer(2.1, () => { ctx.save(); ctx.translate(cx - R * sw * 1.05, cy); ctx.scale(Math.max(.05, 1 - sw * .85), 1); const g = ctx.createRadialGradient(-R * .3, -R * .3, R * .1, 0, 0, R); g.addColorStop(0, '#d9dde3'); g.addColorStop(1, '#7c8590'); cut(() => { ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); }, u);
      ctx.strokeStyle = 'rgba(40,45,55,.5)'; ctx.lineWidth = 4 * u; for (const rr of [.92, .62, .3]) { ctx.beginPath(); ctx.arc(0, 0, R * rr, 0, TAU); ctx.stroke(); } ctx.fillStyle = '#5b636e'; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * R * .78, Math.sin(a) * R * .78, 9 * u, 0, TAU); ctx.fill(); }
      ctx.rotate(spin * Math.PI * 3); ctx.strokeStyle = '#3d444e'; ctx.lineWidth = 16 * u; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R * .52, Math.sin(a) * R * .52); ctx.stroke(); } ctx.fillStyle = '#3d444e'; ctx.beginPath(); ctx.arc(0, 0, R * .12, 0, TAU); ctx.fill(); ctx.restore();
      if (e.lab) lab(e.lab, cx, H * .07, 36 * u, INK); });
  }, (e, at) => [[e.t + .2, 'foley_ratchet', .6], [at(e.open, e.t + 1.6), 'foley_lock', .7], [at(e.open, e.t + 1.6) + .1, 'foley_creak', .6]]);

  // ---------------------------------------------------------------- SLOTS: a slot machine decides
  EXT.slots = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const reels = split(e.reels, '~'); const n = reels.length || 3; const ts = X.at(e.go, e.t + 1.4); const sym = ['$', '7', '★', '♦', 'X', '%']; const rw = Math.min(W * .2, W * .7 / n), rh = H * .36; const x0 = W / 2 - n * rw / 2, y = H * .44;
    X.layer(2, () => { cut(() => { ctx.fillStyle = RED; ctx.fillRect(x0 - 40 * u, y - rh / 2 - 90 * u, n * rw + 80 * u, rh + 160 * u); }, u); ctx.fillStyle = PP.gold; ctx.fillRect(x0 - 40 * u, y - rh / 2 - 90 * u, n * rw + 80 * u, 12 * u); lab(e.lab || 'JACKPOT?', W / 2, y - rh / 2 - 46 * u, 40 * u, '#fff');
      reels.forEach((word, i) => { const x = x0 + i * rw; const stop = ts + i * .45; const spinning = lt < stop; ctx.save(); ctx.beginPath(); ctx.rect(x + 6 * u, y - rh / 2, rw - 12 * u, rh); ctx.clip(); ctx.fillStyle = '#fbf8f1'; ctx.fillRect(x, y - rh / 2, rw, rh);
        if (spinning) { const off = ((lt - e.t) * 9 * (1 + i * .2)) % sym.length; for (let j = -2; j <= 2; j++) { const k = Math.floor(off) + j; T(sym[((k % sym.length) + sym.length) % sym.length], x + rw / 2, y + (j - (off % 1)) * rh * .45, { size: rh * .3, font: 'impact', fill: '#16120e', lw: 0, alpha: .75 }); } }
        else { const q = E.back(clamp((lt - stop) / .3)); T(String(word).toUpperCase(), x + rw / 2, y + (1 - q) * -rh * .3, { size: Math.min(rh * .26, (rw - 30 * u) / Math.max(3, word.length) * 1.7), font: 'impact', fill: '#16120e', lw: 0 }); }
        const g = ctx.createLinearGradient(0, y - rh / 2, 0, y + rh / 2); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(.3, 'rgba(0,0,0,0)'); g.addColorStop(.7, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = g; ctx.fillRect(x, y - rh / 2, rw, rh); ctx.restore(); });
      ctx.strokeStyle = PP.gold; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + n * rw, y); ctx.globalAlpha *= .4; ctx.stroke(); });
  }, (e, at) => [[e.t + .1, 'tick_roll', .5], ...split(e.reels, '~').map((_, i) => [at(e.go, e.t + 1.4) + i * .45, 'foley_click_mech', .7])]);

  // ---------------------------------------------------------------- OUTBREAK: it spreads from neighbour to neighbour
  EXT.outbreak = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const ts = X.at(e.at, e.t + .6); const cols = 40, rows = 20; const sp = Math.min(W * .62 / cols, H * .5 / rows); const x0 = W * .42 - cols * sp / 2 + sp / 2, y0 = H * .44 - rows * sp / 2 + sp / 2; const r = rng(7 + num(e.seeds, 3));
    const seeds = [...Array(num(e.seeds, 3))].map(() => [r() * cols, r() * rows]); const speed = num(e.speed, 9); const q = Math.max(0, lt - ts); let on = 0;
    X.layer(2, () => { for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const d = Math.min(...seeds.map(([a, b]) => Math.hypot(a - i, b - j))) + hash(i * 31 + j * 17) * 3; const hit = q * speed > d; if (hit) on++; const fresh = hit ? clamp(1 - (q * speed - d) / 6) : 0; ctx.fillStyle = hit ? RED : IA(.22); ctx.beginPath(); ctx.arc(x0 + i * sp, y0 + j * sp, sp * (hit ? .32 + fresh * .2 : .22), 0, TAU); ctx.fill(); }
      const to = num(e.to, cols * rows); const shown = Math.round(to * on / (cols * rows)); T(big(shown), W * .86, H * .4, { size: 110 * u, font: 'impact', fill: RED, lw: 0 }); if (e.lab) lab(e.lab, W * .86, H * .5, 32 * u, INK); });
  }, (e, at) => [[at(e.at, e.t + .6), 'glitch_data', .35], [at(e.at, e.t + .6) + .2, 'riser_tension', .4]]);

  // ---------------------------------------------------------------- METER: the needle swings into the red
  EXT.meter = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const a = num(e.from, 20), b = num(e.to, 95); const t0 = X.at(e.at, e.t + .5); const k = spring(clamp((lt - t0) / 1.4) * 1.4, 7, 3.2); const v = lerp(a, b, k) + (lt > t0 + 1 && b > 85 ? Math.sin(lt * 40) * 1.2 : 0);
    const cx = W / 2, cy = H * .7, R = H * .48; const ang = v2 => Math.PI + v2 / 100 * Math.PI;
    X.layer(2, () => { ctx.lineWidth = 46 * u; ctx.lineCap = 'butt'; [[0, 50, DK ? '#2bb39a' : '#3f8f6b'], [50, 75, PP.gold], [75, 100, RED]].forEach(([s, f2, c]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(cx, cy, R, ang(s), ang(f2)); ctx.stroke(); });
      ctx.strokeStyle = INK; ctx.lineWidth = 3 * u; for (let i = 0; i <= 10; i++) { const an = ang(i * 10); ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * (R - 34 * u), cy + Math.sin(an) * (R - 34 * u)); ctx.lineTo(cx + Math.cos(an) * (R - 54 * u), cy + Math.sin(an) * (R - 54 * u)); ctx.stroke(); }
      const an = ang(clamp(v, 0, 100)); cut(() => { ctx.strokeStyle = INK; ctx.lineWidth = 10 * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * R * .86, cy + Math.sin(an) * R * .86); ctx.stroke(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, 26 * u, 0, TAU); ctx.fill(); }, u, .6);
      T(String(Math.round(clamp(v, 0, 100))), cx, cy + 80 * u, { size: 90 * u, font: 'impact', fill: v > 75 ? RED : INK, lw: 0 }); if (e.lab) lab(e.lab, cx, cy - R * .4, 44 * u, INK); });
  }, (e, at) => [[at(e.at, e.t + .5), 'riser_short', .5], [at(e.at, e.t + .5) + .6, 'glitch_beep_error', .4]]);

  // ---------------------------------------------------------------- CALENDAR: months tear away
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  EXT.calendar = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const [y0, m0] = String(e.from || '2020-01').split('-').map(Number); const n = num(e.n, 12); const ts = X.at(e.at, e.t + .3); const dur = num(e.dur, Math.max(1.2, X.dur - (ts - e.t) - .8)); const q = clamp((lt - ts) / dur) * n; const cur = Math.floor(q);
    const pw = H * .5, ph = H * .58, cx = W / 2, cy = H * .48; const md = k => { const m = (m0 - 1 + k); return [MON[((m % 12) + 12) % 12], y0 + Math.floor(m / 12)]; };
    const page = (k, x, y, rot, a) => { const [mm, yy] = md(k); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a; cut(() => { ctx.fillStyle = '#fbf8f1'; ctx.fillRect(-pw / 2, -ph / 2, pw, ph); }, u, .6); ctx.fillStyle = RED; ctx.fillRect(-pw / 2, -ph / 2, pw, ph * .22); T(String(yy), 0, -ph / 2 + ph * .11, { size: ph * .12, font: 'impact', fill: '#fff', lw: 0 }); T(mm, 0, ph * .1, { size: ph * .32, font: 'impact', fill: '#16120e', lw: 0 }); ctx.restore(); };
    X.layer(2, () => { ctx.fillStyle = DK ? '#3a3f4a' : '#4a3a28'; ctx.fillRect(cx - pw / 2 - 10 * u, cy - ph / 2 - 26 * u, pw + 20 * u, 30 * u); page(Math.min(n, cur + 1), cx, cy, 0, 1); if (cur < n) { const f = q - cur; page(cur, cx + f * W * .5, cy - Math.sin(f * Math.PI) * H * .2 + f * H * .2, f * 1.4, 1 - f * .8); } });
  }, (e, at) => [...Array(Math.min(12, num(e.n, 12)))].map((_, i) => [at(e.at, e.t + .3) + i * (num(e.dur, 2) / Math.min(12, num(e.n, 12))), 'foley_page_turn', .35]));

  // ---------------------------------------------------------------- PAPERCUT: layered paper landscape (breather / chapter card)
  const PCC = {}; function hillLayer(i, n, col) { const key = [i, n, col, W, H].join('|'); if (PCC[key]) return PCC[key]; const c = mkCanvas(Math.round(W * 1.3), H), g = c.getContext('2d'); const r = rng(11 + i * 7); const base = H * (.42 + i * .12);
    g.fillStyle = col; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 18 * U(); g.shadowOffsetY = -4 * U(); g.beginPath(); g.moveTo(0, H); const ph = r() * 6, amp = H * (.06 + r() * .05); for (let x = 0; x <= c.width; x += 20) g.lineTo(x, base + Math.sin(x / c.width * (3 + i) * Math.PI + ph) * amp + Math.sin(x / 90 + ph) * amp * .15); g.lineTo(c.width, H); g.closePath(); g.fill(); return (PCC[key] = c); }
  EXT.papercut = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const n = 5; const tr = X.at(e.rise, e.t + .1); const L = LOOK.cur || {}; const [g1] = [PP.gold];
    const pal = DK ? ['#1b2540', '#16203a', '#111a30', '#0c1426', '#080e1c'] : (L.dossier ? ['#e9d9b8', '#d9c39b', '#c4a878', '#a88a5c', '#7d6442'] : L.family === 'light' ? ['#e8e4dc', '#cfc9bd', '#b0a899', '#8d8475', '#665e52'] : ['#e9d9b8', '#d9c39b', '#c4a878', '#a88a5c', '#7d6442']);
    X.layer(1.4, () => { ctx.fillStyle = DK ? '#f0e6c8' : PP.gold; ctx.globalAlpha *= .85; ctx.beginPath(); ctx.arc(W * .68, H * .3 + (1 - E.out(clamp((lt - tr) / 1.6))) * H * .3, H * .12, 0, TAU); ctx.fill(); });
    for (let i = 0; i < n; i++) X.layer(1.5 + i * .15, () => { const k = E.out5(clamp((lt - tr - i * .12) / 1.1)); const c = hillLayer(i, n, pal[i]); ctx.drawImage(c, -W * .15 + Math.sin(lt * .2 + i) * 10 * u, (1 - k) * H * .5); });
    X.layer(2.3, () => { if (e.lab) { const k = clamp((lt - tr - .8) / .5); T(String(e.lab).toUpperCase(), W / 2, H * .2, { size: 96 * u, font: 'impact', fill: DK ? '#f4ead2' : '#1a1712', lw: 0, alpha: k, ls: 4 * u }); if (e.sub) lab(e.sub, W / 2, H * .3, 30 * u, DK ? '#d8cdb0' : '#3a332a', { alpha: k, ls: 6 }); } });
  }, (e, at) => [[at(e.rise, e.t + .1), 'foley_paper_flutter', .5], [at(e.rise, e.t + .1) + .3, 'magic_reveal', .35]]);

  // ---------------------------------------------------------------- FLAPBOARD: the split-flap board flips
  const FLAP = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%.-:';
  EXT.flapboard = mode((e, lt, X) => { const u = X.u; const p = P(e, lt); if (p < 0) return; const rows = kv(e.rows).map(([a, b]) => [String(a).toUpperCase(), String(b).toUpperCase()]); const t0 = X.at(e.at, e.t + .2); const cols = Math.max(...rows.map(r => r[0].length + r[1].length + 2), 14);
    const cw = Math.min(W * .86 / cols, 56 * u), ch = cw * 1.45; const x0 = W / 2 - cols * cw / 2, y0 = H * .5 - (rows.length * ch * 1.2) / 2 + ch * .4;
    X.layer(2, () => { cut(() => { ctx.fillStyle = '#121418'; ctx.fillRect(x0 - 30 * u, y0 - ch * 1.6, cols * cw + 60 * u, rows.length * ch * 1.2 + ch * 2); }, u); lab(e.title || 'DEPARTURES', x0, y0 - ch * .9, 30 * u, PP.gold, { align: 'left', ls: 6 });
      rows.forEach(([a, b], ri) => { const line = (a + ' '.repeat(Math.max(1, cols - a.length - b.length)) + b).padEnd(cols).slice(0, cols); [...line].forEach((chr, ci) => { const x = x0 + ci * cw, y = y0 + ri * ch * 1.2; const tgt = Math.max(0, FLAP.indexOf(chr)); const st = t0 + ri * .25 + ci * .03; const steps = Math.floor(clamp((lt - st) / .9) * (tgt + 8)); const idx = lt < st ? 0 : steps >= tgt + 8 ? tgt : (steps % FLAP.length);
        ctx.fillStyle = '#1e2127'; ctx.fillRect(x + 2 * u, y, cw - 4 * u, ch); const isB = ci >= cols - b.length; T(FLAP[idx], x + cw / 2, y + ch / 2, { size: ch * .7, font: 'cond', weight: 700, fill: isB && /CANCEL|FAIL|BANKRUPT|CLOSED|DEAD/.test(b) && idx === tgt ? RED : '#f2efe6', lw: 0 }); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x + 2 * u, y + ch / 2 - 1 * u, cw - 4 * u, 2 * u); }); }); });
  }, (e, at) => [[at(e.at, e.t + .2), 'foley_riffle', .6], [at(e.at, e.t + .2) + .6, 'foley_riffle', .4]]);
})();
