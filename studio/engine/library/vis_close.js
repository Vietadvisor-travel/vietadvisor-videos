/* VIS CLOSE-UPS — hand-built nutshell close-up scenes, each a little animated film of one moment (Oct 2026).
   # vis kind=coffee|ride|ticket|cheers|bed|hagiang|trainstreet  (+ build set=buncha)  head="MAIN|sub" price="…" sub="…"
   Same layout contract as vis.js (HEAD / STAGE / CAPTION band), same palette, no outlines, everything moving. */
'use strict';
(function () {
  if (!window.VIS || !VIS.K) { console.warn('vis.js missing'); return; }
  const K = VIS.K, h = VIS.h, BUILD = VIS.BUILD; const { st, field, rim, fgBokeh, fmt } = h;
  const T0 = (c, k, d) => c[k] ? c[k][0] + .05 : d;
  const frame = (bw, bh) => { const s = st(); const k = Math.min(s.w / bw, s.h / bh); return { s, k, u: U() }; };
  const shine = (x, y, w, hh) => { ctx.save(); ctx.globalAlpha *= .35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x, y, w, hh, hh / 2); ctx.fill(); ctx.restore(); };
  const softShadow = (x, y, rx, ry, a = .25) => { ctx.save(); ctx.globalAlpha *= a; ell(x, y, rx, ry, '#140f3a', 0); ctx.restore(); };
  const tag = (x, y, text, sub, q, acc, lt) => VIS.tag && VIS.tag(x, y, text, sub, q, acc, lt);
  const head = (t, lt, at, acc) => VIS.headline(t, lt, at, acc);

  // ---------- COFFEE: phin drips into a glass, ice drops with a splash, phin lifts away, milk swirls
  K.coffee = (o, c, P, dur, i) => { const tIce = +(o.iceAt ?? T0(c, 1, dur * .55)), tTag = +(o.tagAt ?? T0(c, 0, .8) + .6);
    return { sfx: [[.2, 'pour'], [tIce, 'clink'], [tIce + .15, 'splash'], [tTag, 'register']], draw: lt => { const { s, k, u } = frame(400, 600); field(P.bg, lt, i); const cx = s.cx, by = s.y1 - s.h * .06;
      ctx.save(); ctx.translate(cx, by); ctx.scale(k, k); rim(0, -260, 300, P.acc);
      sRR(-300, -10, 600, 40, 20, '#ff6a4a', { lw: 0 }); shine(-280, -6, 300, 8); softShadow(0, -12, 130, 16);
      const fill = clamp((lt - .3) / Math.max(1.5, tIce - .3)); const gw = 92, gh = 230, gy = -12;
      // coffee + condensed milk inside the glass
      ctx.save(); ctx.beginPath(); ctx.moveTo(-gw, gy - gh); ctx.lineTo(gw, gy - gh); ctx.lineTo(gw * .82, gy); ctx.lineTo(-gw * .82, gy); ctx.closePath(); ctx.clip();
      ctx.fillStyle = '#f3e3c3'; ctx.fillRect(-gw, gy - 34, gw * 2, 34); const lvl = gy - 34 - fill * 150; const g = ctx.createLinearGradient(0, lvl, 0, gy - 34); g.addColorStop(0, '#7a4424'); g.addColorStop(1, '#3d1f10'); ctx.fillStyle = g; ctx.fillRect(-gw, lvl, gw * 2, gy - 34 - lvl);
      if (lt > tIce) { const sw = clamp((lt - tIce - .3) / 1.5); ctx.globalAlpha = .7 * sw; for (let k2 = 0; k2 < 3; k2++) { ctx.beginPath(); ctx.ellipse(0, gy - 60 - k2 * 22, 40 + k2 * 10, 8, Math.sin(lt * 2 + k2) * .3, 0, Math.PI * 1.4); ctx.lineWidth = 6; ctx.strokeStyle = '#f3e3c3'; ctx.stroke(); } ctx.globalAlpha = 1; }
      // ice cubes
      for (let k2 = 0; k2 < 4; k2++) { const q = lt - tIce - k2 * .1; if (q < 0) continue; const e = E.bounce(clamp(q / .5)); const y = lerp(-520, lvl + 10 + (k2 % 2) * 26, e), x = (k2 - 1.5) * 34; ctx.save(); ctx.translate(x, y); ctx.rotate(k2 + q * (1 - e) * 4); ctx.globalAlpha = .85; sRR(-22, -22, 44, 44, 9, '#e9f6ff', { lw: 0 }); ctx.globalAlpha = .6; rr(-14, -16, 14, 8, 4, '#fff', 0); ctx.restore(); }
      ctx.restore();
      // glass body (translucent) + highlights
      ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = '#dff2ff'; ctx.beginPath(); ctx.moveTo(-gw, gy - gh); ctx.lineTo(gw, gy - gh); ctx.lineTo(gw * .82, gy); ctx.lineTo(-gw * .82, gy); ctx.closePath(); ctx.fill(); ctx.restore(); shine(-gw + 14, gy - gh + 20, 12, gh - 40);
      // splash
      if (lt > tIce && lt < tIce + .7) { const q = (lt - tIce) / .7; for (let k2 = 0; k2 < 10; k2++) { const a = -Math.PI * (.15 + k2 / 12), v = 120 + (k2 % 3) * 60; circ(Math.cos(a) * v * q, lvl + Math.sin(a) * v * q + 260 * q * q, 7 * (1 - q), '#7a4424', 0); } }
      // phin filter: drips, then lifts away when ice arrives
      const lift = E.inOut(clamp((lt - tIce + .4) / .6)); ctx.save(); ctx.translate(lift * 260, -gh - 12 - lift * 420); ctx.rotate(lift * .5);
      sRR(-104, -14, 208, 22, 11, '#c9cfdc', { lw: 0 }); sRR(-62, -120, 124, 108, 14, '#dfe4ee', { lw: 0 }); shine(-50, -112, 16, 90); sRR(-70, -142, 140, 26, 12, '#b9c0cf', { lw: 0 }); sRR(-16, -168, 32, 30, 10, '#9aa3b6', { lw: 0 }); ctx.restore();
      if (lift < .1) for (let k2 = 0; k2 < 3; k2++) { const q = (lt * 1.4 + k2 / 3) % 1; ell(0, lerp(-gh - 4, lvl, q), 6, 9, '#4a2614', 0); }
      ctx.restore();
      if (o.price) tag(s.x1 - s.w * .2, s.y0 + s.h * .2, o.price, o.sub, (lt - tTag) / .45, P.acc, lt); head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };

  // ---------- RIDE: GrabBike crossing town — rider, wheels, speed lines, parallax skyline, app card
  K.ride = (o, c, P, dur, i) => { const tTag = +(o.tagAt ?? T0(c, 0, .6) + .5);
    return { sfx: [[0, 'engine_loop'], [.4, 'whoosh_by'], [tTag, 'register']], draw: lt => { const { s, k, u } = frame(720, 560); field(P.bg, lt, i); const v = lt * 900;
      // parallax city strip
      [[.25, .42, '#3b3f8a', 160], [.5, .3, '#5a4fb0', 120]].forEach(([z, yy, col, hh]) => { ctx.save(); ctx.fillStyle = mix(col, P.bg, .3); const off = (v * z * u) % (220 * u); for (let x = -off - 220 * u; x < W + 220 * u; x += 110 * u) { const bh = (hh + ((Math.floor((x + off) / (110 * u)) * 37) % 90)) * u; ctx.fillRect(x, s.y0 + s.h * (yy + .25) - bh, 100 * u, bh + s.h * .4); } ctx.restore(); });
      const ry = s.y0 + s.h * .78; ctx.fillStyle = '#2a2b66'; ctx.fillRect(0, ry, W, s.h * .3); ctx.fillStyle = '#ffd98a'; for (let x = -(v * u) % (240 * u); x < W; x += 240 * u) ctx.fillRect(x, ry + 40 * u, 120 * u, 10 * u);
      for (let q = 0; q < 10; q++) { const y = s.y0 + s.h * (.3 + (q * .061) % .45), l = (200 + (q * 97) % 300) * u, x = W - ((v * 2.2 * u + q * 400 * u) % (W + l)); ctx.save(); ctx.globalAlpha = .35; rr(x, y, l, 5 * u, 3 * u, '#fff', 0); ctx.restore(); }
      ctx.save(); ctx.translate(s.cx - s.w * .05, ry); ctx.scale(k, k); const b = Math.sin(lt * 18) * 3; softShadow(0, 6, 220, 18, .3);
      for (const wx of [-150, 160]) { ctx.save(); ctx.translate(wx, -56); circ(0, 0, 58, '#211c48', 0); circ(0, 0, 24, '#c9c3f0', 0); ctx.rotate(lt * 20); for (let a = 0; a < 3; a++) { ctx.rotate(TAU / 3); rr(-3, -22, 6, 22, 3, '#8a84c8', 0); } ctx.restore(); }
      ctx.translate(0, b); ctx.fillStyle = '#2fbf71'; ctx.beginPath(); ctx.moveTo(-220, -90); ctx.quadraticCurveTo(-200, -210, -40, -200); ctx.lineTo(90, -200); ctx.quadraticCurveTo(150, -300, 200, -330); ctx.lineTo(228, -310); ctx.quadraticCurveTo(212, -160, 222, -90); ctx.closePath(); ctx.fill(); shine(-190, -196, 220, 14); rr(-170, -244, 200, 46, 22, '#211c48', 0); circ(226, -280, 18, '#fff6c0', 0); glow(240, -280, 90 * 1, '#fff2a0', .3);
      rr(-120, -470, 150, 220, 70, '#2fbf71', 0); shine(-104, -456, 20, 160); circ(-36, -520, 62, '#e8b080', 0); ctx.fillStyle = '#2fbf71'; ctx.beginPath(); ctx.arc(-40, -532, 70, Math.PI, 0); ctx.fill(); rr(-110, -540, 140, 18, 9, '#1f9a5a', 0); line(10, -380, 190, -320, 30, '#e8b080');
      rr(-210, -380, 110, 130, 18, '#2fbf71', 0); T('GRAB', -155, -315, { size: 30, font: 'impact', fill: '#fff', lw: 0, rot: -.1 }); ctx.restore();
      // app card
      const q = (lt - tTag) / .45; if (q > 0) { const e = E.back(clamp(q)); const cw = 340 * u, ch = 170 * u, x = s.x1 - cw - 10 * u, y = s.y0 + 20 * u; ctx.save(); ctx.translate(x + cw / 2, y + ch / 2); ctx.scale(e, e); sRR(-cw / 2, -ch / 2, cw, ch, 26 * u, '#ffffff', { lw: 0 }); rr(-cw / 2 + 20 * u, -ch / 2 + 22 * u, 60 * u, 60 * u, 16 * u, '#2fbf71', 0); T('GrabBike', -cw / 2 + 100 * u, -ch / 2 + 52 * u, { size: 34 * u, font: 'cond', fill: '#1b1530', lw: 0, align: 'left' }); T(o.price || '30.000 ₫', 0, ch / 2 - 46 * u, { size: 56 * u, font: 'impact', fill: '#1f9a5a', lw: 0 }); ctx.restore(); }
      head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };

  // ---------- TICKET: museum facade, ticket slides out of a slot, red stamp
  K.ticket = (o, c, P, dur, i) => { const tOut = +(o.outAt ?? .6), tSt = +(o.stampAt ?? T0(c, 0, 1.2) + .7);
    return { sfx: [[tOut, 'print'], [tSt, 'stamp']], draw: lt => { const { s, k, u } = frame(700, 860); field(P.bg, lt, i); ctx.save(); ctx.translate(s.cx, s.y1 - s.h * .04); ctx.scale(k, k);
      ctx.save(); ctx.globalAlpha = .9; sPoly([[-300, -470], [0, -600], [300, -470]], '#f3e3c3', { lw: 0 }); rr(-300, -470, 600, 30, 4, '#e8d3a8', 0); for (let k2 = 0; k2 < 6; k2++) { rr(-270 + k2 * 104, -440, 40, 330, 8, '#f6ecd6', 0); shine(-264 + k2 * 104, -436, 8, 300); } rr(-320, -110, 640, 40, 6, '#e0c79a', 0); ctx.restore();
      for (const fx2 of [-260, 260]) { line(fx2, -600, fx2, -760, 5, '#7a5a3a'); ctx.fillStyle = '#e2452e'; ctx.beginPath(); ctx.moveTo(fx2, -760); for (let q = 0; q <= 10; q++) ctx.lineTo(fx2 + q * 9, -760 + Math.sin(q * .7 + lt * 6) * 8 + q * 1); for (let q = 10; q >= 0; q--) ctx.lineTo(fx2 + q * 9, -705 + Math.sin(q * .7 + lt * 6) * 8 + q * 1); ctx.fill(); star(fx2 + 45, -732, 10, '#ffd34a', 0); }
      sRR(-200, -70, 400, 70, 18, '#3b3f8a', { lw: 0 }); rr(-150, -40, 300, 10, 5, '#151640', 0);
      const e = E.out5(clamp((lt - tOut) / .8)); ctx.save(); ctx.beginPath(); ctx.rect(-300, -900, 600, 865); ctx.clip(); ctx.translate(0, lerp(260, 0, e) - 40); ctx.rotate(-.04);
      sRR(-140, -300, 280, 260, 14, '#fff8ea', { lw: 0 }); for (let y = -290; y < -50; y += 22) circ(-140, y, 6, P.bg, 0); line(-90, -300, -90, -40, 3, 'rgba(60,40,90,.25)'); T('BẢO TÀNG', 25, -250, { size: 34, font: 'impact', fill: '#3b3f8a', lw: 0 }); T('MUSEUM · VÉ VÀO CỬA', 25, -212, { size: 18, font: 'cond', fill: '#6a5aa0', lw: 0 }); T(o.price || '40.000 ₫', 25, -140, { size: 52, font: 'impact', fill: '#1b1530', lw: 0 });
      if (lt > tSt) { const q = clamp((lt - tSt) / .3), sc = lerp(2.2, 1, E.out5(q)); ctx.save(); ctx.translate(40, -110); ctx.rotate(-.22); ctx.scale(sc, sc); ctx.globalAlpha = clamp(q * 3); ctx.lineWidth = 6; ctx.strokeStyle = '#e2452e'; ctx.beginPath(); ctx.roundRect(-80, -26, 160, 52, 8); ctx.stroke(); T('PAID', 0, 3, { size: 40, font: 'impact', fill: '#e2452e', lw: 0 }); ctx.restore(); }
      ctx.restore(); ctx.restore(); head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };

  // ---------- CHEERS: two bia hơi glasses rise, clink, foam bursts, bubbles; counter doubles
  K.cheers = (o, c, P, dur, i) => { const tc = +(o.clinkAt ?? T0(c, 0, .5) + 1.0), t2 = T0(c, 1, tc + 1.2);
    return { sfx: [[tc, 'clink'], [tc + .05, 'splash'], [t2, 'register']], draw: lt => { const { s, k, u } = frame(470, 560); field(P.bg, lt, i); ctx.save(); ctx.translate(s.cx, s.y1 - s.h * .05); ctx.scale(k, k);
      for (let q = 0; q < 14; q++) { const x = -300 + (q * 47) % 600, y = -80 - (q * 71) % 420; ctx.save(); ctx.globalAlpha = .25; ctx.translate(x, y); circ(0, 0, 30 + (q % 3) * 14, ['#ffcf7a', '#ff9a6a', '#ffe0a0'][q % 3], 0); ctx.restore(); } // bokeh of string lights
      sRR(-320, -20, 640, 36, 18, '#3a7ae8', { lw: 0 }); shine(-300, -16, 320, 7);
      const p = E.inOut(clamp((lt - tc + .7) / .7)), back = E.out(clamp((lt - tc) / .45));
      [-1, 1].forEach(sd => { ctx.save(); const x = sd * lerp(170, 64, p) + sd * back * 24, y = -26 - lerp(0, 120, p) + back * 50; ctx.translate(x, y); ctx.rotate(-sd * lerp(0, .32, p) * (1 - back * .6));
        const gw = 70, gh = 220; ctx.save(); ctx.beginPath(); ctx.moveTo(-gw, -gh); ctx.lineTo(gw, -gh); ctx.lineTo(gw * .85, 0); ctx.lineTo(-gw * .85, 0); ctx.closePath(); ctx.clip(); const g = ctx.createLinearGradient(0, -gh, 0, 0); g.addColorStop(0, '#ffd84a'); g.addColorStop(1, '#f2a020'); ctx.fillStyle = g; ctx.fillRect(-gw, -gh + 40, gw * 2, gh);
          for (let b = 0; b < 8; b++) { const q = (lt * .7 + b / 8) % 1; circ(-40 + (b * 23) % 80, lerp(-10, -gh + 40, q), 4, 'rgba(255,255,255,.7)', 0); } ctx.restore();
        ell(0, -gh + 30, gw * 1.02, 30, '#fffaf0', 0); circ(-30, -gh + 14, 22, '#fffaf0', 0); circ(18, -gh + 8, 26, '#fffaf0', 0); shine(-gw + 12, -gh + 50, 12, gh - 80); ctx.restore(); });
      if (lt > tc && lt < tc + .8) { const q = (lt - tc) / .8; for (let f = 0; f < 16; f++) { const a = -Math.PI / 2 + (f - 7.5) * .18, v = 140 + (f % 4) * 50; circ(Math.cos(a) * v * q, -260 + Math.sin(a) * v * q + 300 * q * q, 12 * (1 - q), '#fffaf0', 0); } }
      ctx.restore(); const n = lt > t2 ? 2 : 1; head((fmt(10000 * n)) + ' ₫|' + (n > 1 ? 'two glasses' : (o.sub || 'a glass of bia hơi')), lt, lt > t2 ? t2 : .15, P.acc); fgBokeh(lt, i, '#ffcf7a'); } }; };

  // ---------- BED: dorm bunk assembles — mattress drops, pillow bounces, blanket unrolls, moon, zzz
  K.bed = (o, c, P, dur, i) => { const tTag = +(o.tagAt ?? T0(c, 0, .6) + .8);
    return { sfx: [[.3, 'thud'], [.7, 'pop'], [1.1, 'whoosh'], [tTag, 'register']], draw: lt => { const { s, k, u } = frame(620, 640); field(P.bg, lt, i); ctx.save(); ctx.translate(s.cx, s.y1 - s.h * .04); ctx.scale(k, k);
      sRR(140, -620, 160, 200, 20, '#1b1f5a', { lw: 0 }); circ(220, -540, 46, '#fff6d8', 0); circ(240, -556, 40, '#1b1f5a', 0); for (let q = 0; q < 5; q++) star(160 + q * 30, -600 + (q % 2) * 40, 4, '#fff', 0);
      const post = (x) => rr(x - 14, -560, 28, 560, 10, '#c98a5a', 0); post(-260); post(200); rr(-260, -300, 460, 26, 10, '#b5784a', 0); rr(-260, -40, 460, 26, 10, '#b5784a', 0); rr(-260, -560, 460, 22, 10, '#b5784a', 0); for (let r = 0; r < 6; r++) rr(170, -520 + r * 70, 60, 12, 6, '#d9a070', 0);
      const mat = (y, t0) => { const e = E.bounce(clamp((lt - t0) / .55)); if (lt < t0) return; sRR(-240, lerp(-900, y, e), 420, 50, 22, '#f3f0ff', { lw: 0 }); };
      mat(-90, .2); mat(-350, .45); const pl = E.bounce(clamp((lt - .7) / .5)); if (lt > .7) { sRR(-230, lerp(-900, -130, pl), 120, 50, 24, '#ffd98a', { lw: 0 }); sRR(-230, lerp(-900, -390, pl), 120, 50, 24, '#ff9ab0', { lw: 0 }); }
      const bl = E.out5(clamp((lt - 1.0) / .7)); if (bl > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-100, -150, 280 * bl, 70); ctx.clip(); sRR(-100, -128, 280, 44, 18, '#5aa9e6', { lw: 0 }); for (let q = 0; q < 6; q++) rr(-90 + q * 46, -124, 20, 36, 8, 'rgba(255,255,255,.25)', 0); ctx.restore(); }
      for (let z = 0; z < 3; z++) { const q = (lt * .45 + z / 3) % 1; T('z', -60 + q * 120, -190 - q * 200, { size: 34 + z * 10, font: 'impact', fill: '#fff', lw: 0, alpha: (1 - q) * .8 }); }
      ctx.restore(); if (o.price) tag(s.x0 + s.w * .2, s.y0 + s.h * .22, o.price, o.sub, (lt - tTag) / .45, P.acc, lt); head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };

  // ---------- HÀ GIANG: layered karst mountains, drifting mist, stilt house with warm window, rice terraces
  K.hagiang = (o, c, P, dur, i) => { const tTag = +(o.tagAt ?? T0(c, 0, .6) + .8);
    return { sfx: [[0, 'wind'], [tTag, 'register']], draw: lt => { const s = st(), u = U(); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3b2b7b'); g.addColorStop(.5, '#d9708a'); g.addColorStop(.8, '#ffb070'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      glow(W * .7, s.y0 + s.h * .35, 300 * u, '#ffd98a', .35); circ(W * .7, s.y0 + s.h * .35, 60 * u, '#ffe9b0', 0);
      const ridge = (y, amp, col, seed, z) => { const off = lt * 20 * z * u; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, H); for (let x = -50; x <= W + 50; x += 30 * u) { const n = Math.sin((x + off) / (120 * u) + seed) * .5 + Math.sin((x + off) / (47 * u) + seed * 2) * .35 + Math.max(0, Math.sin((x + off) / (230 * u) + seed * 3)) * .9; ctx.lineTo(x, y - n * amp); } ctx.lineTo(W + 50, H); ctx.closePath(); ctx.fill(); };
      ridge(s.y0 + s.h * .55, 220 * u, '#8a5aa0', 1, .2); ridge(s.y0 + s.h * .65, 200 * u, '#6a4a9a', 2, .4);
      ctx.save(); ctx.globalAlpha = .45; for (let m = 0; m < 3; m++) { const x = ((lt * 30 + m * 400) * u) % (W + 600 * u) - 300 * u; ell(x, s.y0 + s.h * (.6 + m * .05), 300 * u, 30 * u, '#ffe0e8', 0); } ctx.restore();
      ridge(s.y0 + s.h * .78, 160 * u, '#4a3a8a', 3, .7); ctx.fillStyle = '#3f8a5a'; for (let t2 = 0; t2 < 6; t2++) { ctx.beginPath(); ctx.ellipse(W * .3, s.y1 + t2 * 30 * u, W * (.5 - t2 * .04), 40 * u, -.08, Math.PI, TAU); ctx.lineWidth = 16 * u; ctx.strokeStyle = shade('#5fb36a', -t2 * .06); ctx.stroke(); }
      // stilt house
      const hx = W * .62, hy = s.y0 + s.h * .74; ctx.save(); ctx.translate(hx, hy); const kk = u * 1.1; ctx.scale(kk, kk); for (const x of [-90, -30, 30, 90]) rr(x - 5, 0, 10, 60, 3, '#5a3a2a', 0); rr(-110, -90, 220, 90, 6, '#c98a5a', 0); rr(-30, -70, 60, 50, 6, '#ffd27a', 0); glow(0, -45, 80, '#ffcf7a', .45); sPoly([[-140, -86], [0, -170], [140, -86]], '#7a4a3a', { lw: 0 }); ctx.restore();
      if (o.price) tag(s.x0 + s.w * .25, s.y0 + s.h * .25, o.price, o.sub, (lt - tTag) / .45, '#ffcf4a', lt); head(o.head, lt, .15, '#ffcf4a'); fgBokeh(lt, i, '#ffe0e8'); } }; };

  // ---------- TRAIN STREET (tease): narrow street, train rushes toward the lens, headlight bloom, shake
  K.trainstreet = (o, c, P, dur, i) => { const tT = +(o.trainAt ?? .6);
    return { sfx: [[tT, 'train_horn'], [tT + .8, 'train_pass']], draw: lt => { const s = st(), u = U(); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#141650'); g.addColorStop(1, '#3b2b7b'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const vx = W / 2, vy = s.y0 + s.h * .42, q = clamp((lt - tT) / 2.2), sh = q > .6 && q < 1 ? (Math.random() - .5) * 18 * u * (1 - q) : 0; ctx.save(); ctx.translate(sh, sh * .6);
      const side = (sd) => { for (let k2 = 0; k2 < 7; k2++) { const z = 1 - k2 / 7, z2 = 1 - (k2 + 1) / 7; const x0 = vx + sd * W * .9 * z, x1 = vx + sd * W * .9 * z2, y0t = vy - H * .7 * z, y1t = vy - H * .7 * z2, yb0 = vy + H * .55 * z, yb1 = vy + H * .55 * z2; ctx.fillStyle = shade(['#ff7a59', '#ffb84d', '#4fc3a1', '#ff8fab', '#5aa9e6', '#9b7bd6', '#f6a04d'][k2], -.15 - k2 * .05); ctx.beginPath(); ctx.moveTo(x0, y0t); ctx.lineTo(x1, y1t); ctx.lineTo(x1, yb1); ctx.lineTo(x0, yb0); ctx.closePath(); ctx.fill();
        const wy = lerp(y0t, yb0, .45), wy1 = lerp(y1t, yb1, .45); ctx.fillStyle = 'rgba(255,210,120,.8)'; ctx.beginPath(); ctx.moveTo(lerp(x0, x1, .3), wy); ctx.lineTo(lerp(x0, x1, .7), lerp(wy, wy1, .7)); ctx.lineTo(lerp(x0, x1, .7), lerp(wy, wy1, .7) + 40 * u * z); ctx.lineTo(lerp(x0, x1, .3), wy + 40 * u * z); ctx.fill(); } };
      side(-1); side(1); ctx.fillStyle = '#2a2b66'; ctx.beginPath(); ctx.moveTo(vx - W * .9, vy + H * .55); ctx.lineTo(vx, vy); ctx.lineTo(vx + W * .9, vy + H * .55); ctx.fill();
      for (const r of [-.18, .18]) line(vx, vy, vx + r * W * 3, vy + H * .55 * 1.4, 6 * u, '#c9c3f0'); for (let k2 = 1; k2 < 12; k2++) { const z = Math.pow(k2 / 12, 1.8); line(vx - W * .55 * z * .6, vy + H * .55 * z, vx + W * .55 * z * .6, vy + H * .55 * z, 5 * u, '#5a4a8a'); }
      if (q > 0) { const z = Math.pow(q, 2.2) * 1.4, tw = W * .5 * z, th = H * .45 * z; ctx.save(); ctx.translate(vx, vy + th * .1); sRR(-tw / 2, -th / 2, tw, th, 30 * u * z + 1, '#2f6fd0', { lw: 0 }); rr(-tw * .35, -th * .35, tw * .7, th * .3, 10 * u * z + 1, '#bfe3ff', 0); rr(-tw / 2, th * .05, tw, th * .08, 4, '#ffd34a', 0); circ(-tw * .3, th * .28, tw * .07, '#fff6c0', 0); circ(tw * .3, th * .28, tw * .07, '#fff6c0', 0); ctx.restore(); glow(vx, vy + th * .3, (200 + 900 * q) * u, '#fff2c0', .5 * q); }
      ctx.restore(); head(o.head, lt, .2, '#ffcf4a'); fgBokeh(lt, i); } }; };

  // ---------- build set: BÚN CHẢ (dipping bowl + patties + noodles + herbs)
  if (BUILD) BUILD.buncha = {
    base(q) { const y = (1 - E.back(clamp(q / .5))) * 260; ctx.save(); ctx.translate(0, y); ell(0, -60, 130, 44, '#e9eef8', 0); ell(0, -62, 120, 38, '#c9864a', 0); ctx.restore(); },
    front(q) { const y = (1 - E.back(clamp(q / .5))) * 260; ctx.save(); ctx.translate(0, y); ctx.beginPath(); ctx.moveTo(-130, -60); ctx.ellipse(0, -60, 130, 44, 0, Math.PI, 0, true); ctx.lineTo(90, 30); ctx.lineTo(-90, 30); ctx.closePath(); ctx.fillStyle = '#f3f6fc'; ctx.fill(); for (let k2 = -3; k2 <= 3; k2++) circ(k2 * 30, -4, 6, '#5aa9e6', 0); ctx.restore(); },
    layers: {
      patties(q) { for (let k2 = 0; k2 < 4; k2++) { const e = q - k2 * .08; if (e <= 0) continue; const y = (1 - E.bounce(clamp(e / .55))) * -320; const x = -60 + k2 * 40, yy = -70 + (k2 % 2 ? 12 : -10) + y; ell(x, yy, 30, 18, '#7a3e22', 0); ell(x - 6, yy - 6, 14, 6, '#a5603a', 0); } if (q > .2 && q < 2.5) for (let k2 = 0; k2 < 3; k2++) { const s2 = ((q * .6 + k2 / 3) % 1); ctx.save(); ctx.globalAlpha = (1 - s2) * .35; circ(-20 + k2 * 25, -110 - s2 * 160, 18 + s2 * 30, '#ffffff', 0); ctx.restore(); } },
      pork(q) { for (let k2 = 0; k2 < 3; k2++) { const e = q - k2 * .1; if (e <= 0) continue; const y = (1 - E.bounce(clamp(e / .55))) * -300; ctx.save(); ctx.translate(-40 + k2 * 50, -84 + y); ctx.rotate(.3 - k2 * .2); ell(0, 0, 34, 12, '#b5643c', 0); line(-20, -3, 20, 3, 3, '#6a2f18'); ctx.restore(); } },
      papaya(q) { for (let k2 = 0; k2 < 8; k2++) { const e = q - k2 * .03; if (e <= 0) continue; const y = (1 - E.bounce(clamp(e / .5))) * -280; ctx.save(); ctx.translate(-80 + (k2 * 23) % 160, -70 + (k2 % 3 - 1) * 14 + y); ctx.rotate(k2); rr(-12, -4, 24, 8, 4, k2 % 2 ? '#ffb066' : '#f6efe0', 0); ctx.restore(); } },
      noodles(q) { const e = E.back(clamp(q / .4)); if (q <= 0) return; ctx.save(); ctx.translate(92, 62); ctx.scale(e * .65, e * .65); ell(0, 0, 70, 30, '#f0eadc', 0); for (let k2 = 0; k2 < 6; k2++) { ctx.beginPath(); ctx.ellipse(-30 + k2 * 12, -6, 22, 12, 0, Math.PI, TAU); ctx.lineWidth = 4; ctx.strokeStyle = '#ffffff'; ctx.stroke(); } ctx.restore(); },
      herbs(q) { const e = E.back(clamp(q / .4)); if (q <= 0) return; ctx.save(); ctx.translate(-96, 62); ctx.scale(e * .65, e * .65); ell(0, 0, 60, 26, '#8a5a3a', 0); for (let k2 = 0; k2 < 8; k2++) circ(-40 + k2 * 11, -14 - (k2 % 3) * 8, 14, k2 % 2 ? '#3f9a3a' : '#57b04a', 0); ctx.restore(); },
      chili(q) { for (let k2 = 0; k2 < 5; k2++) { const e = q - k2 * .05; if (e <= 0) continue; const y = (1 - E.bounce(clamp(e / .5))) * -260; circ(-50 + k2 * 26, -92 + (k2 % 2) * 10 + y, 6, '#e1352a', 0); circ(-50 + k2 * 26, -92 + (k2 % 2) * 10 + y, 2.5, '#ffd9a0', 0); } }
    }, order: ['patties', 'pork', 'papaya', 'noodles', 'herbs', 'chili'], steam: true };
})();
