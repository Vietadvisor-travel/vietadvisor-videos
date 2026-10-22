/* NUTWORLD — the street, drawn in the house nutshell style (flat vector, soft gradients, rim light, no outlines),
   staged as a multiplane: sky · far skyline · street of tube houses · road & traffic · foreground — each layer moves
   at its own depth, so camera trucks / pushes / tilts read as real space while every pixel stays 2D illustration.
   # nw focus=cart|cafe|pho|biahoi|hotel|x=<0..1> cam=truck|truckL|push|pull|tilt|rise|drift time=dawn|day|sunset|night
        head="MAIN|sub" tags="poi:TEXT:sub:at|…" traffic=1 zoom=1.2
   Pair with transitions2 (zoomthru into the cart, match bowl→sun, liquid coffee flood…). */
'use strict';
(function () {
  const SKY = { dawn: ['#ff9a76', '#c96b9a', '#4b3f95'], day: ['#bfeaff', '#7fc8f5', '#3a7ad8'], sunset: ['#ffb070', '#ff6f6f', '#3b2b7b'], night: ['#2a2a7a', '#141650', '#070a26'] };
  const FOG = { dawn: '#e8869a', day: '#a9d8f5', sunset: '#d9708a', night: '#1d1f5a' };
  const HOUSE = ['#ffb84d', '#ff7a59', '#4fc3a1', '#ffd98a', '#ff8fab', '#5aa9e6', '#f6a04d', '#9be07a', '#b79be8', '#ffe0b8'];
  const SIGNS = [['PHO', '#e2452e'], ['BANH MI', '#f2b632'], ['COFFEE', '#2e7d5b'], ['FRESH BEER', '#2f6fd0'], ['GROCERY', '#d6336c'], ['NOODLES', '#e2452e'], ['ICED TEA', '#2e7d5b'], ['SIM 4G', '#7a4fd0'], ['RICE', '#f2b632'], ['ROLLS', '#2f6fd0']];
  const NIGHT = { dawn: .15, day: 0, sunset: .35, night: 1 };
  const SPAN = 3.2; // world width in frame-widths
  const cache = {};
  const gy = () => window._NW_GY != null ? window._NW_GY : H * (H > W ? .63 : .7); // kerb line (9:16 sits higher so the near pavement carries the captions)
  // ---------- painters (draw in world px, u = U())
  function vgrad(x, y, w, h, top, bot) { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
  function sky(time, u) { const c = SKY[time]; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c[2]); g.addColorStop(.55, c[1]); g.addColorStop(.85, c[0]); ctx.fillStyle = g; ctx.fillRect(0, 0, ctx.canvas.width, H);
    const r = rng(5); if (time === 'night') { for (let i = 0; i < 160; i++) { ctx.globalAlpha = .3 + r() * .6; circ(r() * ctx.canvas.width, r() * H * .55, (1 + r() * 2.2) * u, '#fff', 0); } ctx.globalAlpha = 1; }
    ctx.save(); ctx.globalAlpha = time === 'night' ? .08 : .35; for (let i = 0; i < 9; i++) { const x = r() * ctx.canvas.width, y = H * (.08 + r() * .3), w = (220 + r() * 380) * u; ell(x, y, w, w * .18, '#ffffff', 0); ell(x + w * .3, y - w * .06, w * .5, w * .14, '#ffffff', 0); } ctx.restore(); }
  function skyline(time, u) { const fog = FOG[time], r = rng(11), base = gy() - 80 * u; let x = 0; const cw = ctx.canvas.width;
    while (x < cw) { const w = (90 + r() * 160) * u, h = (300 + r() * 650) * u; const col = mix(fog, '#3b2f7a', time === 'night' ? .55 : .25); ctx.fillStyle = col; ctx.fillRect(x, base - h, w - 6 * u, h + 200 * u);
      if (r() < .3) { ctx.fillRect(x + w * .3, base - h - 60 * u, 8 * u, 60 * u); }
      if (NIGHT[time] > .3) { ctx.fillStyle = 'rgba(255,210,140,.55)'; for (let k = 0; k < 10; k++) if (r() < .5) ctx.fillRect(x + (10 + r() * (w - 30 * u)), base - h + 30 * u + r() * (h - 60 * u), 8 * u, 10 * u); }
      x += w; }
    ctx.fillStyle = rgba(fog, .35); ctx.fillRect(0, 0, cw, H); }
  function tubeHouse(x, w, h, i, time, u) { const top = gy() - h, col = mix(HOUSE[i % HOUSE.length], FOG[time], time === 'night' ? .45 : .2), night = NIGHT[time];
    const lit = shade(col, .1), deep = shade(col, -.16); vgrad(x, top, w, h, lit, deep); // body with soft gradient
    ctx.fillStyle = shade(col, -.25); ctx.fillRect(x + w - 10 * u, top, 10 * u, h); // side depth strip
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x, top, 4 * u, h); // rim light
    // roof: parapet + tank / tiles
    ctx.fillStyle = shade(col, -.08); ctx.fillRect(x - 6 * u, top - 18 * u, w + 12 * u, 22 * u); if (i % 3 === 0) { sRR(x + w * .6, top - 70 * u, 46 * u, 52 * u, 10 * u, '#dfe4f0', { lw: 0 }); } if (i % 4 === 1) { ctx.fillStyle = '#c95a3a'; ctx.beginPath(); ctx.moveTo(x - 8 * u, top - 16 * u); ctx.lineTo(x + w / 2, top - 70 * u); ctx.lineTo(x + w + 8 * u, top - 16 * u); ctx.fill(); }
    const fh = 150 * u, floors = Math.floor((h - 190 * u) / fh);
    for (let f = 0; f < floors; f++) { const y = top + 30 * u + f * fh; const ww = w * .5, wx = x + (w - ww) / 2;
      const glow = night > .3 && ((i * 7 + f * 3) % 5 < 3); rr(wx, y + 20 * u, ww, 82 * u, 10 * u, glow ? '#ffd27a' : mix('#2a3f7a', col, .25), 0); if (glow) glowRect(wx, y + 20 * u, ww, 82 * u, u);
      ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(wx + 6 * u, y + 26 * u, ww * .3, 6 * u);
      const sh = ['#2e8b6a', '#2f6fd0', '#d65a3a', '#6a4fd0'][i % 4]; rr(wx - 26 * u, y + 18 * u, 22 * u, 86 * u, 4 * u, sh, 0); rr(wx + ww + 4 * u, y + 18 * u, 22 * u, 86 * u, 4 * u, sh, 0);
      if (f % 2 === 0) { ctx.fillStyle = shade(col, .22); ctx.fillRect(x + 8 * u, y + 108 * u, w - 16 * u, 12 * u); ctx.fillStyle = 'rgba(30,25,70,.55)'; for (let k = 0; k < 9; k++) ctx.fillRect(x + 14 * u + k * (w - 28 * u) / 8, y + 70 * u, 4 * u, 38 * u); ctx.fillRect(x + 12 * u, y + 68 * u, w - 24 * u, 4 * u);
        if ((i + f) % 2) { circ(x + 26 * u, y + 92 * u, 16 * u, '#3f9a4a', 0); circ(x + 40 * u, y + 84 * u, 12 * u, '#57b04a', 0); } }
      if ((i + f) % 3 === 1) { sRR(x + w - 74 * u, y + 52 * u, 54 * u, 34 * u, 5 * u, '#eef1f6', { lw: 0 }); } }
    // shopfront: warm interior, awning, sign
    const sy = gy() - 170 * u; vgrad(x + 10 * u, sy + 40 * u, w - 20 * u, 130 * u, '#ffcf8a', '#b8643a'); for (let k = 0; k < 3; k++) { ctx.fillStyle = ['#ff8a5a', '#ffd34a', '#7fd0ff'][(i + k) % 3]; ctx.fillRect(x + 22 * u + k * (w - 44 * u) / 3, sy + 100 * u, (w - 60 * u) / 3, 50 * u); }
    const aw = ['#2e8b6a', '#e2452e', '#2f6fd0', '#f2b632'][(i + 1) % 4]; ctx.fillStyle = aw; ctx.beginPath(); ctx.moveTo(x, sy + 30 * u); ctx.lineTo(x + w, sy + 30 * u); ctx.lineTo(x + w + 14 * u, sy + 70 * u); for (let k = 8; k >= 0; k--) ctx.arc(x - 14 * u + k * (w + 28 * u) / 8 + (w + 28 * u) / 16, sy + 70 * u, (w + 28 * u) / 16, 0, Math.PI); ctx.lineTo(x - 14 * u, sy + 70 * u); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.28)'; for (let k = 0; k < 8; k += 2) ctx.fillRect(x + k * w / 8, sy + 30 * u, w / 8, 40 * u);
    const [st, sc] = SIGNS[i % SIGNS.length]; sRR(x + 8 * u, sy - 34 * u, w - 16 * u, 60 * u, 8 * u, sc, { lw: 0 }); T(st, x + w / 2, sy - 4 * u, { size: Math.min(40 * u, (w - 40 * u) / Math.max(1, textW(st, 40 * u, 'body')) * 40 * u), font: 'body', weight: 900, fill: sc === '#f2b632' ? '#4a1d0a' : '#fff', lw: 0 });
    if (night > .3) glowRect(x + 8 * u, sy - 34 * u, w - 16 * u, 60 * u, u, sc);
    ctx.fillStyle = 'rgba(40,20,80,.18)'; ctx.fillRect(x, gy() - 30 * u, w, 30 * u); }
  function glowRect(x, y, w, h, u, col = '#ffcf7a') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h)); g.addColorStop(0, rgba(col, .35)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - w, y - h, w * 3, h * 3); ctx.restore(); }
  function tree(x, s, u, time) { const y = gy(); rr(x - 9 * u * s, y - 260 * u * s, 18 * u * s, 260 * u * s, 6 * u, '#7a4f3a', 0); const g = NIGHT[time] > .5 ? .55 : 1;
    [[0, -300, 95], [-70, -250, 70], [70, -255, 72], [-30, -360, 70], [40, -350, 66]].forEach(([dx, dy, r], k) => circ(x + dx * u * s, y + dy * u * s, r * u * s, shade(k % 2 ? '#3fa35a' : '#2e8b4a', g < 1 ? -.25 : 0), 0));
    [[-30, -330, 30], [50, -290, 24]].forEach(([dx, dy, r]) => circ(x + dx * u * s, y + dy * u * s, r * u * s, 'rgba(255,255,255,.18)', 0)); }
  function wires(cw, u, time) { const y0 = gy() - 520 * u; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(0, y0 + k * 22 * u); for (let x = 0; x <= cw; x += 600 * u) ctx.quadraticCurveTo(x + 300 * u, y0 + k * 22 * u + 70 * u, x + 600 * u, y0 + k * 22 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = 'rgba(30,25,70,.7)'; ctx.stroke(); }
    for (let x = 150 * u; x < cw; x += 300 * u) { const yy = y0 + 22 * u + Math.sin((x % (600 * u)) / (600 * u) * Math.PI) * 55 * u; line(x, yy, x, yy + 26 * u, 2 * u, 'rgba(30,25,70,.7)'); const c = ['#e2452e', '#ffb84d', '#ff7a59'][Math.floor(x / u) % 3]; if (NIGHT[time] > .3) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; circ(x, yy + 48 * u, 50 * u, rgba(c, .25), 0); ctx.restore(); } ell(x, yy + 48 * u, 18 * u, 22 * u, c, 0); ctx.fillStyle = '#ffd34a'; ctx.fillRect(x - 8 * u, yy + 24 * u, 16 * u, 4 * u); ctx.fillRect(x - 8 * u, yy + 68 * u, 16 * u, 4 * u); } }
  // POI props (street layer, world px)
  const POI_X = { cart: .24, cafe: .42, pho: .6, biahoi: .76, hotel: .88 };
  function cart(x, u) { const y = gy() + 34 * u; circ(x - 70 * u, y - 18 * u, 22 * u, '#2a2350', 0); circ(x + 70 * u, y - 18 * u, 22 * u, '#2a2350', 0); sRR(x - 120 * u, y - 170 * u, 240 * u, 140 * u, 14 * u, '#2fae7a', { lw: 0 }); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x - 120 * u, y - 170 * u, 240 * u, 10 * u);
    rr(x - 110 * u, y - 270 * u, 220 * u, 96 * u, 10 * u, 'rgba(210,240,255,.55)', 0); for (let k = 0; k < 5; k++) { const bx = x - 90 * u + k * 42 * u; sRR(bx, y - 230 * u - (k % 2) * 14 * u, 40 * u, 18 * u, 9 * u, '#f0a64a', { lw: 0 }); }
    sRR(x - 125 * u, y - 300 * u, 250 * u, 34 * u, 8 * u, '#f2b632', { lw: 0 }); T('BANH MI', x, y - 283 * u, { size: 26 * u, font: 'body', weight: 900, fill: '#b8261d', lw: 0 });
    line(x + 100 * u, y - 300 * u, x + 100 * u, y - 470 * u, 6 * u, '#7a5a3a'); ctx.fillStyle = '#ff7a59'; ctx.beginPath(); ctx.moveTo(x + 100 * u - 150 * u, y - 440 * u); ctx.quadraticCurveTo(x + 100 * u, y - 560 * u, x + 100 * u + 150 * u, y - 440 * u); ctx.closePath(); ctx.fill(); }
  function stool(x, y, u, c) { sRR(x - 26 * u, y - 56 * u, 52 * u, 12 * u, 4 * u, c, { lw: 0 }); ctx.fillStyle = shade(c, -.2); ctx.fillRect(x - 22 * u, y - 46 * u, 8 * u, 46 * u); ctx.fillRect(x + 14 * u, y - 46 * u, 8 * u, 46 * u); }
  function table(x, y, u, c) { sRR(x - 70 * u, y - 90 * u, 140 * u, 14 * u, 5 * u, c, { lw: 0 }); ctx.fillStyle = '#9aa0b8'; ctx.fillRect(x - 60 * u, y - 78 * u, 8 * u, 78 * u); ctx.fillRect(x + 52 * u, y - 78 * u, 8 * u, 78 * u); }
  function cafe(x, u) { const y = gy() + 40 * u; for (let k = 0; k < 2; k++) { const tx = x + (k - .5) * 220 * u; table(tx, y, u, '#ff6a4a'); stool(tx - 90 * u, y, u, '#3a7ae8'); stool(tx + 90 * u, y, u, '#e2452e'); sRR(tx - 12 * u, y - 126 * u, 24 * u, 34 * u, 5 * u, 'rgba(120,70,40,.9)', { lw: 0 }); } }
  function pho(x, u, t) { const y = gy() + 40 * u; sRR(x - 150 * u, y - 150 * u, 120 * u, 150 * u, 16 * u, '#c9d0e0', { lw: 0 }); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(x - 150 * u, y - 150 * u, 120 * u, 10 * u); table(x + 60 * u, y, u, '#3a7ae8'); stool(x + 150 * u, y, u, '#e2452e'); ell(x + 60 * u, y - 100 * u, 40 * u, 12 * u, '#fff', 0); }
  function biahoi(x, u) { const y = gy() + 40 * u; for (let k = 0; k < 3; k++) { const tx = x + (k - 1) * 190 * u; table(tx, y, u, '#3a7ae8'); for (const d of [-1, 1]) stool(tx + d * 80 * u, y, u, '#e2452e'); for (const d of [-1, 1]) { sRR(tx + d * 24 * u - 11 * u, y - 132 * u, 22 * u, 40 * u, 4 * u, 'rgba(255,200,60,.95)', { lw: 0 }); ctx.fillStyle = '#fffaf0'; ctx.fillRect(tx + d * 24 * u - 11 * u, y - 136 * u, 22 * u, 8 * u); } } }
  function hotel(x, u, time) { const top = gy() - 1100 * u, w = 420 * u; vgrad(x - w / 2, top, w, 1100 * u, '#3a3f6a', '#1c1f3e'); for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) rr(x - w / 2 + 30 * u + k * 95 * u, top + 60 * u + f * 150 * u, 70 * u, 100 * u, 6 * u, NIGHT[time] > .3 ? '#ffd98a' : '#6a76b8', 0);
    vgrad(x - w / 2 + 20 * u, gy() - 220 * u, w - 40 * u, 220 * u, '#ffe6a8', '#d4a84a'); sRR(x - 170 * u, gy() - 280 * u, 340 * u, 46 * u, 6 * u, '#1a1d28', { lw: 0 }); T('GRAND LOBBY CAFÉ', x, gy() - 257 * u, { size: 24 * u, font: 'serif', fill: '#e8c46a', lw: 0 }); }
  function scooter(x, y, s, dir, col, t, u, k) { ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); const b = Math.abs(Math.sin(t * 14 + k)) * 2 * u;
    ell(0, 4 * u, 120 * u, 14 * u, 'rgba(30,20,70,.3)', 0); for (const wx of [-66, 70]) { circ(wx * u, -26 * u, 28 * u, '#2a2350', 0); circ(wx * u, -26 * u, 11 * u, '#c9c3f0', 0); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-96 * u, -40 * u); ctx.quadraticCurveTo(-90 * u, -96 * u, -20 * u, -92 * u); ctx.lineTo(40 * u, -92 * u); ctx.quadraticCurveTo(70 * u, -140 * u, 92 * u, -150 * u); ctx.lineTo(104 * u, -140 * u); ctx.quadraticCurveTo(96 * u, -70 * u, 100 * u, -40 * u); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-80 * u, -90 * u, 100 * u, 6 * u); rr(-70 * u, -112 * u, 90 * u, 22 * u, 10 * u, '#2a2350', 0); circ(102 * u, -128 * u, 9 * u, '#fff6c0', 0);
    ctx.translate(0, -b); const sk = ['#ffd0a8', '#e8b080', '#c98a5a'][k % 3], sh = ['#3a7ae8', '#ffffff', '#e2452e', '#2fae7a', '#9b7bd6'][k % 5]; rr(-50 * u, -210 * u, 70 * u, 100 * u, 30 * u, sh, 0); circ(-12 * u, -236 * u, 30 * u, sk, 0); ctx.fillStyle = ['#ffd34a', '#e2452e', '#ffffff', '#3a7ae8'][k % 4]; ctx.beginPath(); ctx.arc(-14 * u, -242 * u, 34 * u, Math.PI, 0); ctx.fill(); line(10 * u, -170 * u, 82 * u, -146 * u, 14 * u, sk); ctx.restore(); }
  function buildLayers(time) { const key = time + W + 'x' + H; if (cache[key]) return cache[key]; const u = U(), cw = Math.ceil(W * SPAN);
    const mk = (fn, f = 1) => { const c = mkCanvas(Math.ceil(cw * f), H); const prev = ctx; ctx = c.getContext('2d'); try { fn(u, Math.ceil(cw * f)); } finally { ctx = prev; } return c; };
    const L = { sky: mk(u => sky(time, u), .5), far: mk(u => skyline(time, u), .7),
      mid: mk((u, w) => { let x = -40 * u, i = 0; const r = rng(3); while (x < w) { const hw = (230 + r() * 120) * u, hh = (H > W ? 980 : 760) * u + r() * 380 * u; tubeHouse(x, hw, hh, i++, time, u); x += hw + 4 * u; } for (let tx = 260 * u; tx < w; tx += 760 * u) tree(tx, 1.15, u, time); wires(w, u, time); }),
      ground: mk((u, w) => { vgrad(0, gy(), w, 60 * u, '#a59ee0', '#8a82d0'); ctx.fillStyle = 'rgba(255,255,255,.18)'; for (let x = 0; x < w; x += 70 * u) ctx.fillRect(x, gy() + 4 * u, 3 * u, 52 * u); ctx.fillStyle = '#c9c3f0'; ctx.fillRect(0, gy() + 56 * u, w, 10 * u); vgrad(0, gy() + 66 * u, w, H, '#3f418a', '#2a2b66'); ctx.fillStyle = '#ffd98a'; for (let x = 0; x < w; x += 220 * u) ctx.fillRect(x, gy() + (H > W ? 160 : 190) * u, 110 * u, 10 * u);
        { const ny = gy() + (H > W ? 290 : 300) * u; ctx.fillStyle = '#c9c3f0'; ctx.fillRect(0, ny, w, 12 * u); vgrad(0, ny + 12 * u, w, H, '#6a63b8', '#2a2466'); ctx.fillStyle = 'rgba(255,255,255,.08)'; for (let x = 0; x < w; x += 90 * u) ctx.fillRect(x, ny + 12 * u, 3 * u, H); }
        cart(w * POI_X.cart, u); cafe(w * POI_X.cafe, u); pho(w * POI_X.pho, u, 0); biahoi(w * POI_X.biahoi, u); hotel(w * POI_X.hotel, u, time); }),
      fg: mk((u, w) => { const r = rng(9); for (let x = 600 * u; x < w; x += (1600 + r() * 900) * u) { circ(x, H * .04, 200 * u, 'rgba(40,90,70,.85)', 0); circ(x + 160 * u, H * .0, 150 * u, 'rgba(50,110,80,.85)', 0); circ(x - 140 * u, H * .02, 130 * u, 'rgba(36,80,64,.85)', 0); } }, 1.3) };
    // pre-blurred foreground (depth of field on the nearest plane)
    const b = mkCanvas(L.fg.width, H); const bg = b.getContext('2d'); bg.filter = `blur(${10 * u}px)`; bg.drawImage(L.fg, 0, 0); L.fg = b; return (cache[key] = L); }
  // ---------- beat
  SB.recipes.nw = (o, b) => { const { caps, end } = timeCaps(b.caps, .3, .06, b.capStyle); const dur = Math.max(+(o.dur || 0), end + .35, 3); const time = o.time || 'day';
    const fx = POI_X[o.focus] ?? +(o.x ?? .3); const cam = o.cam || 'truck'; const z0 = +(o.zoom || 1);
    const tags = (o.tags || '').split('|').filter(Boolean).map(s => { const [poi, txt, sub, tt] = s.split(':'); return { poi, txt, sub, at: +(tt ?? .8) }; });
    o._i = (SB._nwN = (SB._nwN || 0) + 1);
    const draw = lt => { const L = buildLayers(time), u = U(), cw = W * SPAN, p = clamp(lt / dur), e = E.inOut(p), sn = E.sine(p);
      let cx = fx * cw, zoom = z0, ty = 0, rot = 0;
      if (cam === 'truck') cx += lerp(-.35, .35, sn) * W; if (cam === 'truckL') cx += lerp(.35, -.35, sn) * W; if (cam === 'push') zoom *= lerp(1, 1.45, e); if (cam === 'pull') zoom *= lerp(1.6, 1, e);
      if (cam === 'tilt') ty = lerp(-H * .35, 0, e); if (cam === 'rise') { ty = lerp(H * .25, -H * .1, e); zoom *= lerp(1.3, 1, e); } if (cam === 'drift') { cx += lerp(-.1, .1, sn) * W; zoom *= lerp(1.05, 1.12, sn); rot = lerp(-.01, .01, sn); }
      { const half = W / 2 / zoom + 40 * u; cx = clamp(cx, half, cw - half); } const fy = gy() - 60 * u; const sy0 = lerp(fy, H * (H > W ? .56 : .6), clamp((zoom - 1) / .5)); // world focus (street level) → screen anchor rises as we move in
      const layer = (img, z, f = 1) => { ctx.save(); ctx.translate(W / 2, fy + ty * z); ctx.rotate(rot * z); const k = 1 + (zoom - 1) * z; ctx.scale(k, k); ctx.translate(-cx * z * f + (z === 0 ? 0 : 0), -fy); ctx.drawImage(img, z === 0 ? -W / 2 : 0, 0); ctx.restore(); };
      // sky (very slow), far (slow), mid, ground + traffic, foreground (fast, blurred)
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1 + (zoom - 1) * .1, 1 + (zoom - 1) * .1); ctx.translate(-W / 2 - (cx * .1) % (L.sky.width - W), -H / 2 + ty * .1); ctx.drawImage(L.sky, 0, 0); ctx.restore();
      const plane = (img, z) => { ctx.save(); const k = 1 + (zoom - 1) * z; ctx.translate(W / 2, lerp(fy, sy0, z) + ty * z); ctx.rotate(rot * z); ctx.scale(k, k); ctx.translate(-cx * (img.width / cw), -fy); ctx.drawImage(img, 0, 0); ctx.restore(); return k; };
      plane(L.far, .35); const km = plane(L.mid, 1); plane(L.ground, 1);
      // traffic on the road (same plane as ground)
      if (o.traffic !== '0') { ctx.save(); ctx.translate(W / 2, sy0 + ty); ctx.rotate(rot); ctx.scale(km, km); ctx.translate(-cx, -fy); const cols = ['#e2452e', '#ffffff', '#3a7ae8', '#ffd34a', '#2fae7a', '#9b7bd6', '#ff8fab'];
        const close = zoom > 1.2; for (let k = 0; k < (close ? 0 : 9); k++) { const lane = k % 3, dir = lane === 1 ? -1 : 1, v = (380 + (k * 53) % 260) * u, x = ((k * 997 * u + dir * v * (lt + (o._i || 0) * 3)) % cw + cw) % cw; const y = gy() + (H > W ? [120, 185, 250] : [110, 170, 230])[lane] * u; scooter(x, y, .62 + lane * .08, dir, cols[k % cols.length], lt, u, k); } ctx.restore(); }
      // close shots: a scooter whips past the lens every ~2.4 s (motion-blurred foreground) instead of traffic hiding the subject
      if (zoom > 1.2 && o.traffic !== '0') { const per = 2.4, q = ((lt + (o._i || 0) * .7) % per) / .55; if (q < 1) { ctx.save(); ctx.filter = `blur(${8 * u}px)`; scooter(lerp(-W * .4, W * 1.4, q), H * .97, 2.6, 1, ['#e2452e', '#3a7ae8', '#ffd34a'][Math.floor(lt / per) % 3], lt, u, 3); ctx.restore(); } }
      // steam over the phở pot
      { ctx.save(); ctx.translate(W / 2, sy0 + ty); ctx.scale(km, km); ctx.translate(-cx, -fy); const px = cw * POI_X.pho - 90 * u, py = gy() - 120 * u; for (let k = 0; k < 4; k++) { const q = (lt * .45 + k / 4) % 1; ctx.globalAlpha = (1 - q) * .45; circ(px + Math.sin(q * 6 + k) * 20 * u, py - q * 260 * u, (20 + q * 50) * u, '#ffffff', 0); } ctx.restore(); }
      ctx.save(); ctx.globalAlpha = .9; plane(L.fg, 1.6); ctx.restore();
      // drifting motes + price chips pinned to POIs
      { const r = rng(17); for (let i = 0; i < 18; i++) { ctx.globalAlpha = .15 + r() * .25; circ((r() * W + lt * (8 + r() * 14) * u) % W, (r() * H - lt * (5 + r() * 8) * u + H * 4) % H, (1.5 + r() * 3.5) * u, '#fff6e0', 0); } ctx.globalAlpha = 1; }
      tags.forEach(tg => { const X = POI_X[tg.poi]; if (X === undefined) return; const sx = W / 2 + (X * cw - cx) * km, sy = Math.max(H * .3, Math.min(H * .62, sy0 - (380 * u) * km)); if (window.VIS && VIS.tag) VIS.tag(sx, sy, tg.txt, tg.sub, (lt - tg.at) / .45, '#ffcf4a', lt); });
      { const g0 = ctx.createLinearGradient(0, 0, 0, H * .28); g0.addColorStop(0, 'rgba(8,10,40,.45)'); g0.addColorStop(1, 'rgba(8,10,40,0)'); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H * .28); }
      if (window.VIS && VIS.headline) VIS.headline(o.head, lt, .2, o.acc || '#ffcf4a'); };
    return { dur, place: 'studio', placeOpts: { color: '#111', floor: false }, light: 'none', layers: [{ type: 'fn', screen: true, draw }], captions: caps, sfx: [...tags.map(t => [t.at, 'register']), ...(z0 * (cam === 'push' ? 1.45 : 1) > 1.2 ? Array.from({ length: Math.ceil(dur / 2.4) }, (_, k) => [k * 2.4 + .2, 'whoosh_by']) : [[.3, 'city_bed']])].filter(x => x[0] < dur), nw: 1 };
  };
  window.NUTWORLD = { POI_X, tubeHouse, tree, glowRect, wires, stool, table, scooter, cart, SKY, FOG };
})();
