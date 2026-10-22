/* ARTSTYLES — whole-frame art direction. Unlike `charstyle:` (which only changes how characters are drawn)
   these change the look of the ENTIRE picture: line, colour, texture, paper.
     header:  artstyle: comic            (applies to every beat)
     beat:    # moment ... artstyle=riso (overrides for one beat; artstyle=none turns it off)
   Looks: comic · watercolor · riso · papercut · dongho · lacquer · neon · pixel · vhs · chalk · storyb
   Each is a post pass over the finished frame (before captions), built from canvas filters + blends — free, no assets. */
(function () {
  const S = {}; const cv = {};
  const can = (k, w, h) => { let c = cv[k]; if (!c || c.width !== w || c.height !== h) { c = cv[k] = (typeof mkCanvas === 'function' ? mkCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h })); } return c; };
  const snap = (k, s = 1) => { const w = Math.max(1, Math.round(W * s)), h = Math.max(1, Math.round(H * s)); const c = can(k, w, h), g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.filter = 'none'; g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(ctx.canvas, 0, 0, w, h); return c; };
  const paint = (c, o = {}) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (o.op) ctx.globalCompositeOperation = o.op; if (o.a !== undefined) ctx.globalAlpha = o.a; if (o.filter) ctx.filter = o.filter; ctx.drawImage(c, o.dx || 0, o.dy || 0, W, H); ctx.restore(); };
  const fill = (col, o = {}) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (o.op) ctx.globalCompositeOperation = o.op; if (o.a !== undefined) ctx.globalAlpha = o.a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  // cached noise / texture tiles
  const tile = (k, size, draw) => { let c = cv['t_' + k]; if (!c) { c = cv['t_' + k] = (typeof mkCanvas === 'function' ? mkCanvas(size, size) : Object.assign(document.createElement('canvas'), { width: size, height: size })); draw(c.getContext('2d'), size); } return c; };
  const grainTile = (k, amt, px) => tile(k, 256, (g, n) => { const d = g.createImageData(n, n); for (let i = 0; i < n * n; i++) { const v = 128 + (Math.random() * 2 - 1) * amt * 127; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; } g.putImageData(d, 0, 0); });
  const tex = (c, op, a, scale = 1) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; const p = ctx.createPattern(c, 'repeat'); if (scale !== 1) p.setTransform && p.setTransform(new DOMMatrix([scale, 0, 0, scale, 0, 0])); ctx.fillStyle = p; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  // edge map: blurred copy differenced against the original → line art, then multiplied back
  const inkLines = (strength = .85, blur = 2.2, boost = 2.6) => {
    const a = snap('e0'); const c = can('e1', W, H), g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
    g.filter = `blur(${blur * U()}px)`; g.drawImage(a, 0, 0); g.filter = 'none';
    g.globalCompositeOperation = 'difference'; g.drawImage(a, 0, 0);                    // |orig - blur| = edges (bright on black)
    const d = can('e2', W, H), h = d.getContext('2d'); h.setTransform(1, 0, 0, 1, 0, 0); h.globalCompositeOperation = 'source-over'; h.globalAlpha = 1; h.clearRect(0, 0, W, H);
    h.filter = `grayscale(1) brightness(${boost}) contrast(2.2) invert(1)`; h.drawImage(c, 0, 0); h.filter = 'none';   // black lines on white
    paint(d, { op: 'multiply', a: strength });
  };
  // real per-pixel work (quantise / palette map). Costs ~1 pass over the frame — fine for stills and 2–4 fps renders.
  const px = (fn) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const im = ctx.getImageData(0, 0, W, H); fn(im.data); ctx.putImageData(im, 0, 0); ctx.restore(); };
  const quant = (n = 5) => px(d => { const q = 255 / (n - 1); for (let i = 0; i < d.length; i += 4) { d[i] = Math.round(d[i] / q) * q; d[i + 1] = Math.round(d[i + 1] / q) * q; d[i + 2] = Math.round(d[i + 2] / q) * q; } });
  const palette = (cols, mix = 1) => { const P = cols.map(c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]);
    px(d => { for (let i = 0; i < d.length; i += 4) { let b = 0, bd = 1e9; for (let k = 0; k < P.length; k++) { const dr = d[i] - P[k][0], dg = d[i + 1] - P[k][1], db = d[i + 2] - P[k][2]; const q = dr * dr * .3 + dg * dg * .59 + db * db * .11; if (q < bd) { bd = q; b = k; } }
      d[i] += (P[b][0] - d[i]) * mix; d[i + 1] += (P[b][1] - d[i + 1]) * mix; d[i + 2] += (P[b][2] - d[i + 2]) * mix; } }); };
  const halftone = (a = .3, dot = 5, ang = .4) => {
    const t = tile('ht' + dot, 64, (g, n) => { g.fillStyle = '#fff'; g.fillRect(0, 0, n, n); g.fillStyle = '#000'; const step = n / 8; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.beginPath(); g.arc((x + .5) * step, (y + .5) * step, step * .34, 0, 6.3); g.fill(); } });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a;
    const p = ctx.createPattern(t, 'repeat'); const s = dot * U() / 8; p.setTransform && p.setTransform(new DOMMatrix([Math.cos(ang) * s, Math.sin(ang) * s, -Math.sin(ang) * s, Math.cos(ang) * s, 0, 0]));
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, H); ctx.restore();
  };
  const posterize = (levels = 5) => { paint(snap('p0'), { filter: 'saturate(1.3) contrast(1.1)' }); quant(levels); };
  const chroma = (px = 3) => { const a = snap('c0');
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen';
    ctx.filter = 'url(#none)'; ctx.globalAlpha = .5;
    ctx.filter = 'none'; ctx.globalAlpha = .34; ctx.drawImage(a, -px * U(), 0, W, H); ctx.drawImage(a, px * U(), 0, W, H); ctx.restore(); };
  const scanlines = (a = .18, h = 3) => { const t = tile('sl' + h, 8, (g, n) => { g.clearRect(0, 0, n, n); g.fillStyle = '#000'; g.fillRect(0, 0, n, n / 2); });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; const p = ctx.createPattern(t, 'repeat'); const s = h * U() / 8; p.setTransform && p.setTransform(new DOMMatrix([s, 0, 0, s, 0, 0])); ctx.fillStyle = p; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  const vignette = (a = .4, r = .72) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * r * .5, W / 2, H / 2, Math.hypot(W, H) * .55); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); };

  // ---------------------------------------------------------------- the looks
  // the house look: Kurzgesagt-like — deep saturated ground, outline-free soft shapes, glow everywhere, cool shadows
  S.nutshell = () => { const a = snap('nu');
    paint(a, { filter: 'saturate(1.1) contrast(1.06)' });                                      // colour stays natural
    paint(a, { op: 'screen', a: .14, filter: 'brightness(.42) contrast(5) saturate(1.2) blur(13px)' });  // glow ONLY on real highlights (lamps, sun, neon)
    fill('#1b2050', { op: 'multiply', a: .1 });                                                // a touch of indigo in the shadows
    vignette(.22, .8); };

  S.comic = () => { paint(snap('x'), { filter: 'saturate(1.45) contrast(1.22)' }); quant(6); inkLines(1, 2.2, 4.2); halftone(.5, 7, .45);
    fill('#fff0d2', { op: 'multiply', a: .12 }); tex(grainTile('g1', .35), 'overlay', .14); vignette(.34); };
  S.watercolor = () => { const a = snap('w0');
    paint(a, { filter: 'blur(3px) saturate(.8) brightness(1.1)', a: 1 });            // the wash
    paint(a, { a: .45, filter: 'saturate(.7) brightness(1.2)' });
    inkLines(.85, 3.2, 3.4);                                                          // wet dark rim
    fill('#fdf4df', { op: 'multiply', a: .3 }); tex(grainTile('gw', .6), 'multiply', .22, 2.5); vignette(.2, .95); };
  S.riso = () => { paint(snap('r0'), { filter: 'grayscale(.4) saturate(2) contrast(1.35) brightness(1.05)' });
    palette(['#fff6e5', '#ff4d6d', '#2b3dd1', '#1b1b2a', '#ffd23f'], .85);
    paint(snap('r1'), { op: 'multiply', a: .22, dx: 5 * U(), dy: -3 * U() });          // misregistration
    tex(grainTile('gr', .9), 'overlay', .34); fill('#fff8e7', { op: 'screen', a: .06 }); };
  S.papercut = () => { posterize(5); const a = snap('pc');
    paint(a, { op: 'multiply', a: .45, dx: 6 * U(), dy: 7 * U(), filter: 'brightness(.35) blur(3px)' });   // cut-layer shadows
    paint(snap('pc2'), { a: .92, filter: 'saturate(1.15) brightness(1.05)' });
    tex(grainTile('gp', .5), 'overlay', .2, 1.5); fill('#f6ecd8', { op: 'soft-light', a: .25 }); vignette(.3); };
  S.dongho = () => { paint(snap('d0'), { filter: 'saturate(1.6) contrast(1.25)' });
    palette(['#efe0bb', '#2b1a0f', '#c8102e', '#f2b705', '#1f6f4a', '#8c5a2b'], .9);   // Đông Hồ folk palette
    inkLines(1, 2.6, 4.2); fill('#efe0bb', { op: 'multiply', a: .22 });
    tex(tile('diep', 128, (g, n) => { g.fillStyle = '#fff'; g.fillRect(0, 0, n, n); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${190 + Math.random() * 60},${175 + Math.random() * 60},${130 + Math.random() * 70},${Math.random() * .6})`; g.fillRect(Math.random() * n, Math.random() * n, 1 + Math.random() * 3, 1 + Math.random() * 3); } }), 'multiply', .4, 2);
    vignette(.32, .85); };
  S.lacquer = () => { const a = snap('l0');
    paint(a, { filter: 'saturate(1.3) contrast(1.35) brightness(.8)' });
    palette(['#120805', '#3a0d0d', '#c8102e', '#e0a93b', '#f6dfa0', '#0d2b22'], .8);   // sơn mài: son, vàng, then
    fill('#180a05', { op: 'multiply', a: .35 });
    paint(a, { op: 'screen', a: .4, filter: 'grayscale(1) brightness(1.1) contrast(3) sepia(1) saturate(5) hue-rotate(-14deg)' });   // gold leaf on highlights
    tex(tile('crack', 256, (g, n) => { g.clearRect(0, 0, n, n); g.strokeStyle = 'rgba(255,215,140,.55)'; g.lineWidth = .8; for (let i = 0; i < 30; i++) { g.beginPath(); let x = Math.random() * n, y = Math.random() * n; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (Math.random() - .5) * 45; y += (Math.random() - .5) * 45; g.lineTo(x, y); } g.stroke(); } }), 'screen', .22, 1.5);
    vignette(.55, .55); };
  S.neon = () => { const a = snap('n0');
    paint(a, { filter: 'saturate(1.8) contrast(1.55) brightness(.72)' });
    paint(a, { op: 'screen', a: .38, filter: 'blur(11px) saturate(2.6) brightness(1.1)' });   // bloom
    fill('#0b0320', { op: 'multiply', a: .42 }); fill('#ff2fb0', { op: 'soft-light', a: .3 }); fill('#18e7ff', { op: 'soft-light', a: .26 });
    inkLines(.5, 2.2, 3.4);
    chroma(3); scanlines(.14, 3); vignette(.65, .5); };
  S.pixel = () => { const small = snap('px', .05); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.filter = 'saturate(1.6) contrast(1.25)'; ctx.drawImage(small, 0, 0, W, H); ctx.restore();
    quant(4); scanlines(.14, 4); vignette(.32); };
  S.vhs = () => { const a = snap('v0'); paint(a, { filter: 'saturate(1.45) contrast(1.1) brightness(1.05)' });
    chroma(6); scanlines(.3, 3); tex(grainTile('gv', .8), 'overlay', .26);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .1; for (let i = 0; i < 4; i++) { ctx.fillStyle = '#fff'; ctx.fillRect(0, Math.random() * H, W, 1 + Math.random() * 3 * U()); } ctx.restore();
    fill('#2b1a4a', { op: 'soft-light', a: .28 }); vignette(.5, .65); };
  S.chalk = () => { const a = snap('k0');
    fill('#0d2a1c', { op: 'source-over', a: 1 });                                     // slate board
    paint(a, { op: 'screen', a: .62, filter: 'grayscale(1) brightness(1.0) contrast(1.6)' });
    paint(a, { op: 'screen', a: .35, filter: 'grayscale(1) brightness(1.8) contrast(2.2) blur(1.5px)' });  // chalk dust halo
    fill('#0d2a1c', { op: 'multiply', a: .25 }); tex(grainTile('gk', .9), 'overlay', .3, 1.4); vignette(.45, .7); };
  S.storyb = () => { const a = snap('s0');   // pencil storyboard / sketch
    paint(a, { filter: 'grayscale(1) brightness(1.3) contrast(.55)' }); inkLines(1, 1.6, 5.5); inkLines(.7, 3.2, 4);
    fill('#f3ead6', { op: 'multiply', a: .45 }); tex(grainTile('gs', .7), 'multiply', .22, 1.6); vignette(.28, .9); };

  const A = window.ARTSTYLE = { names: Object.keys(S) };
  A.apply = (name, t) => { if (!name || name === 'none' || !S[name]) return false; if (typeof LINT !== 'undefined' && LINT.on) return false; S[name](t || 0); return true; };
})();
