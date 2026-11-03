/* EP.6 — Hà Nội Train Street. Nutshell close-ups:
   trainst (the street, cafés, a train squeezing through) · corridor (1.5 m vs the 8.6 m legal corridor) · railtime (history
   along a rail line) · phonehit (the phone the train took) · railmap (north stretch vs south stretch, 2026 diversions) ·
   bridge (Long Biên at sunset) · window (the street seen from inside a train). Same layout contract as vis.js. */
'use strict';
(function () {
  if (!window.VIS || !VIS.K) return; const K = VIS.K, h = VIS.h; const { st, field, fgBokeh, fmt } = h;
  const head = (t, lt, at, acc) => VIS.headline(t, lt, at, acc), tag = (x, y, a, b, q, acc, lt) => VIS.tag(x, y, a, b, q, acc, lt);
  const T0 = (c, k, d) => c[k] ? c[k][0] + .05 : d;
  const HC = ['#ff7a59', '#ffb84d', '#4fc3a1', '#ff8fab', '#5aa9e6', '#9b7bd6', '#f6a04d', '#ffd98a'];
  const nz = (x) => Math.sin(x * 12.9898) * 43758.5453 % 1;
  const sky = (top, bot) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  function person(x, y, s, col, sit, lt, k) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const b = Math.sin(lt * 3 + k) * 2;
    if (sit) { rr(-16, -40 + b, 32, 40, 14, col, 0); circ(0, -56 + b, 14, ['#ffd0a8', '#e8b080', '#c98a5a', '#f2c6a0'][k % 4], 0); } else { rr(-15, -70 + b, 30, 56, 14, col, 0); rr(-12, -16, 9, 18, 4, '#2a2350', 0); rr(3, -16, 9, 18, 4, '#2a2350', 0); circ(0, -86 + b, 15, ['#ffd0a8', '#e8b080', '#c98a5a', '#f2c6a0'][k % 4], 0); }
    ctx.restore(); }
  // ---------- TRAINST: one-point street, lantern strings, cafés each side; train squeezes through, people flatten to the walls
  K.trainst = (o, c, P, dur, i) => { const tT = +(o.trainAt ?? T0(c, 1, dur * .45)), night = o.time === 'night', noTrain = o.notrain === '1';
    return { sfx: noTrain ? [[0, 'wind']] : [[tT - 1.2, 'vn_bell_small'], [tT, 'train_horn'], [tT + .5, 'train_pass'], [tT + .6, 'whoosh_by']], draw: lt => { const s = st(), u = U(); sky(night ? '#141650' : '#ffb070', night ? '#3b2b7b' : '#c96b9a');
      const vx = W / 2, vy = s.y0 + s.h * .38, q = noTrain ? 0 : clamp((lt - tT) / 2.4), shake = q > .45 && q < .95 ? Math.sin(lt * 60) * 8 * u * (1 - q) : 0;
      const push = 1 + .08 * E.sine(clamp(lt / dur)); ctx.save(); ctx.translate(W / 2 + shake, vy); ctx.scale(push, push); ctx.translate(-W / 2, -vy);
      const D = 9, Z = k => Math.pow(1 - k / D, 1.6); // depth slices
      for (const sd of [-1, 1]) for (let k = D - 1; k >= 0; k--) { const z0 = Z(k), z1 = Z(k + 1); const xo = (z) => vx + sd * (W * .16 + W * .7 * z), yt = (z) => vy - H * .72 * z, yb = (z) => vy + H * .5 * z; const col = mix(shade(HC[(k * 3 + (sd > 0 ? 1 : 0)) % 8], -.08 - (1 - z0) * .15), night ? '#2a2a7a' : '#c96b9a', .28);
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(xo(z0), yt(z0)); ctx.lineTo(xo(z1), yt(z1)); ctx.lineTo(xo(z1), yb(z1)); ctx.lineTo(xo(z0), yb(z0)); ctx.fill();
        const wl = (f) => lerp(yt(z0), yb(z0), f), wl1 = (f) => lerp(yt(z1), yb(z1), f); for (const f of [.25, .52]) { ctx.fillStyle = night ? 'rgba(255,210,130,.85)' : 'rgba(60,50,120,.45)'; ctx.beginPath(); ctx.moveTo(lerp(xo(z0), xo(z1), .25), lerp(wl(f), wl1(f), .25)); ctx.lineTo(lerp(xo(z0), xo(z1), .75), lerp(wl(f), wl1(f), .75)); ctx.lineTo(lerp(xo(z0), xo(z1), .75), lerp(wl(f + .1), wl1(f + .1), .75)); ctx.lineTo(lerp(xo(z0), xo(z1), .25), lerp(wl(f + .1), wl1(f + .1), .25)); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(xo(z0) - sd * 3 * u, yt(z0), 3 * u, yb(z0) - yt(z0)); }
      // ground + rails + sleepers
      ctx.fillStyle = '#4a3f8a'; ctx.beginPath(); ctx.moveTo(vx - W * .86, vy + H * .5); ctx.lineTo(vx - W * .16 * .0, vy); ctx.lineTo(vx + W * .86, vy + H * .5); ctx.fill();
      for (let k = 1; k < 26; k++) { const z = Math.pow(k / 26, 1.7); line(vx - W * .3 * z, vy + H * .5 * z, vx + W * .3 * z, vy + H * .5 * z, 6 * u * (.3 + z), '#7a5a3a'); }
      for (const r of [-.2, .2]) line(vx, vy, vx + r * W * 1.25, vy + H * .5, 7 * u, '#d9d4f5');
      // lantern strings
      for (let k = 1; k < 7; k++) { const z = Math.pow(1 - k / 7, 1.6), y = vy - H * .5 * z, xl = vx - W * .62 * z - W * .1, xr = vx + W * .62 * z + W * .1; const sway = Math.sin(lt * 2 + k) * 4 * u + (q > .3 && q < 1 ? Math.sin(lt * 18) * 14 * u * z : 0);
        ctx.beginPath(); ctx.moveTo(xl, y); ctx.quadraticCurveTo(vx, y + 40 * u * z, xr, y); ctx.lineWidth = 2 * u; ctx.strokeStyle = 'rgba(30,25,70,.8)'; ctx.stroke(); for (let m = 1; m < 6; m++) { const f = m / 6, x = lerp(xl, xr, f), yy = y + Math.sin(f * Math.PI) * 30 * u * z + 14 * u * z; const cl = ['#e2452e', '#ffd34a', '#ff7a59'][(m + k) % 3]; if (night) glow(x + sway, yy, 40 * u * z, cl, .3); ell(x + sway, yy, 10 * u * z + 2, 12 * u * z + 2, cl, 0); } }
      // cafés: stools + people each side (they flatten to the walls when the train comes)
      const flee = noTrain ? 0 : E.out(clamp((lt - tT + 1.4) / .8)) * (1 - E.in(clamp((lt - tT - 2.6) / 1)));
      for (let k = 6; k >= 1; k--) for (const sd of [-1, 1]) { const z = Math.pow(1 - k / 7.5, 1.6); const x = vx + sd * (W * .2 + W * .26 * z) + sd * flee * W * .14 * z, y = vy + H * .5 * z; const sc = z * 1.6 * u;
        sRR(x - 18 * sc, y - 34 * sc, 36 * sc, 8 * sc, 3, ['#3a7ae8', '#e2452e'][k % 2], { lw: 0 }); person(x, y - 30 * sc * (flee > .5 ? 0 : 1), sc, ['#ffffff', '#ffb84d', '#4fc3a1', '#ff8fab', '#5aa9e6'][(k + (sd > 0 ? 2 : 0)) % 5], flee < .5, lt, k + (sd > 0 ? 3 : 0)); }
      // the train
      if (q > 0) { const zmax = Math.max(.4, (vy - H * .22) / (H * .31)), z = Math.min(zmax, Math.pow(q, 1.9) * 1.25), tw = W * .44 * z, th = H * .5 * z; ctx.save(); ctx.translate(vx, vy + th * .02); sRR(-tw / 2, -th * .62, tw, th, 34 * u * z + 1, '#2f6fd0', { lw: 0 }); rr(-tw * .36, -th * .48, tw * .72, th * .28, 10 * u * z + 1, '#bfe3ff', 0); rr(-tw / 2, th * .02, tw, th * .07, 3, '#ffd34a', 0); rr(-tw / 2, th * .12, tw, th * .04, 3, '#e2452e', 0);
          circ(-tw * .3, th * .24, tw * .065, '#fff6c0', 0); circ(tw * .3, th * .24, tw * .065, '#fff6c0', 0); ctx.restore(); glow(vx, vy + th * .25, (160 + 700 * q) * u, '#fff2c0', .45 * q); }
      ctx.restore(); if (o.measure === '1') { const m = E.out(clamp((lt - T0(c, 0, .5)) / .6)); if (m > 0) { const y = s.y0 + s.h * .8, x0 = W * .2, x1 = W * .36; line(x0, y, lerp(x0, x1, m), y, 6 * u, '#ffd34a'); line(x0, y - 14 * u, x0, y + 14 * u, 5 * u, '#ffd34a'); if (m > .9) { line(x1, y - 14 * u, x1, y + 14 * u, 5 * u, '#ffd34a'); T('1.5 m', (x0 + x1) / 2, y - 34 * u, { size: 44 * u, font: 'impact', fill: '#ffd34a', lw: 0, shadow: 4 * u }); } } }
      head(o.head, lt, .2, '#ffcf4a'); fgBokeh(lt, i, night ? '#ffcf7a' : '#ffffff'); } }; };
  // ---------- CORRIDOR: top-down plan — the track, the 8.6 m legal corridor each side sweeping out, houses that sit inside it
  K.corridor = (o, c, P, dur, i) => { const tC = +(o.corridorAt ?? T0(c, 1, 1.4)), tH = T0(c, 2, tC + 1.6);
    return { sfx: [[.3, 'pop'], [tC, 'whoosh'], [tH, 'buzzer']], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i); const cx = s.cx, kpx = Math.min(s.w / 26, s.h / 30); // px per metre
      const y0 = s.y0 + s.h * .02, y1 = s.y1 - s.h * .02; ctx.save(); ctx.beginPath(); ctx.rect(s.x0, y0, s.w, y1 - y0); ctx.clip();
      // houses each side at 3–4 m
      for (const sd of [-1, 1]) for (let k = 0; k < 7; k++) { const y = y0 + k * (y1 - y0) / 7, hx = cx + sd * (3.2 * kpx); const w = 9 * kpx; const bad = lt > tH && Math.floor(lt * 3 + k) % 2; sRR(sd > 0 ? hx : hx - w, y + 4 * u, w, (y1 - y0) / 7 - 8 * u, 8 * u, bad ? '#ff6a6a' : HC[(k + (sd > 0 ? 3 : 0)) % 8], { lw: 0 }); }
      // corridor sweep
      const cw = 8.6 * kpx * E.out(clamp((lt - tC) / .9)); if (cw > 0) { ctx.save(); ctx.globalAlpha = .38; ctx.fillStyle = '#ffd34a'; ctx.fillRect(cx - cw, y0, cw * 2, y1 - y0); ctx.restore(); for (const sd of [-1, 1]) { ctx.save(); ctx.setLineDash([16 * u, 12 * u]); line(cx + sd * cw, y0, cx + sd * cw, y1, 4 * u, '#ffd34a'); ctx.restore(); } }
      // track
      ctx.fillStyle = '#4a3f8a'; ctx.fillRect(cx - 1.6 * kpx, y0, 3.2 * kpx, y1 - y0); for (let y = y0; y < y1; y += 1.2 * kpx) rr(cx - 1.4 * kpx, y, 2.8 * kpx, .35 * kpx, 3, '#7a5a3a', 0); for (const r of [-.72, .72]) rr(cx + r * kpx - 3 * u, y0, 6 * u, y1 - y0, 3, '#d9d4f5', 0);
      ctx.restore(); const cwF = 8.6 * kpx; if (lt > tC + .9) { T('8.6 m', cx + cwF * .55, y0 + 60 * u, { size: 46 * u, font: 'impact', fill: '#ffd34a', lw: 0, shadow: 4 * u }); T('LEGAL CORRIDOR', cx + cwF * .55, y0 + 100 * u, { size: 22 * u, font: 'cond', fill: '#fff', lw: 0, ls: 2 * u }); }
      if (lt > .5) { T('3–4 m', cx - 3.2 * kpx - 4.5 * kpx, y1 - 70 * u, { size: 36 * u, font: 'impact', fill: '#fff', lw: 0, shadow: 4 * u }); }
      head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };
  // ---------- RAILTIME: history along a rail line — a small train rides from year to year, each stop pops an icon card
  K.railtime = (o, c, P, dur, i) => { const ev = (o.events || '').split('|').filter(Boolean).map(x => x.split(';')); const n = ev.length; const ats = ev.map((_, k) => c[k] ? c[k][0] + .05 : .5 + k * 1.2);
    return { sfx: ats.map(a => [a, 'tick']), draw: lt => { const s = st(), u = U(); field(P.bg, lt, i); const v = H > W; let cur = 0; ats.forEach((a, k) => { if (lt >= a) cur = k; });
      const pos = k => v ? [s.x0 + s.w * (k % 2 ? .72 : .28), s.y0 + s.h * (.08 + .84 * k / Math.max(1, n - 1))] : [s.x0 + s.w * (.06 + .88 * k / Math.max(1, n - 1)), s.cy + (k % 2 ? -1 : 1) * s.h * .05];
      ctx.beginPath(); ev.forEach((_, k) => { const [x, y] = pos(k); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.lineWidth = 22 * u; ctx.strokeStyle = '#3b3f8a'; ctx.stroke(); ctx.setLineDash([8 * u, 10 * u]); ctx.lineWidth = 10 * u; ctx.strokeStyle = '#d9d4f5'; ctx.stroke(); ctx.setLineDash([]);
      ev.forEach(([yr, txt], k) => { const [x, y] = pos(k), p = E.back(clamp((lt - ats[k]) / .4)); circ(x, y, 18 * u, lt >= ats[k] ? P.acc : '#5a5a9a', 0); if (p <= 0) return; const left = v ? (k % 2 ? -1 : 1) : 0; const bx = v ? x + left * 40 * u : x, by = v ? y : y + (k % 2 ? -1 : 1) * 110 * u;
        ctx.save(); ctx.translate(bx, by); ctx.scale(p, p); const w = Math.max(textW(txt, 28 * u, 'cond'), textW(yr, 46 * u, 'impact')) + 40 * u; const ax = v ? (left > 0 ? 0 : -w) : -w / 2; sRR(ax, -52 * u, w, 104 * u, 18 * u, k === cur ? '#ffffff' : 'rgba(255,255,255,.85)', { lw: 0 }); T(yr, ax + w / 2, -16 * u, { size: 46 * u, font: 'impact', fill: '#1b1530', lw: 0 }); T(txt, ax + w / 2, 26 * u, { size: 26 * u, font: 'cond', fill: '#4a3f8a', lw: 0 }); ctx.restore(); });
      // the little train travels to the current stop
      const k0 = Math.max(0, cur - 1), pp = E.inOut(clamp((lt - ats[cur]) / .6)), [ax, ay] = pos(k0), [bx2, by2] = pos(cur), tx = cur === 0 ? ax : lerp(ax, bx2, pp), ty = cur === 0 ? ay : lerp(ay, by2, pp); sRR(tx - 34 * u, ty - 22 * u, 68 * u, 44 * u, 12 * u, '#2f6fd0', { lw: 0 }); rr(tx - 22 * u, ty - 14 * u, 44 * u, 14 * u, 5 * u, '#bfe3ff', 0); glow(tx, ty, 70 * u, '#fff2c0', .25);
      head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };
  // ---------- PHONEHIT: an arm holds a phone out over the rail; the train's edge clips it; the phone spins away
  K.phonehit = (o, c, P, dur, i) => { const tH = +(o.hitAt ?? T0(c, 1, 1.6));
    return { sfx: [[tH - .8, 'train_horn'], [tH, 'impact'], [tH + .05, 'impact_glass'], [tH + .1, 'whoosh_by']], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i); const k = Math.min(s.w / 600, s.h / 700); ctx.save(); ctx.translate(s.cx, s.cy + s.h * .1); ctx.scale(k, k);
      rr(-400, 60, 800, 30, 8, '#d9d4f5', 0); rr(-400, 120, 800, 30, 8, '#d9d4f5', 0); for (let x = -400; x < 400; x += 70) rr(x, 40, 30, 130, 6, '#7a5a3a', 0);
      const q = clamp((lt - tH + .6) / 1.4); if (q > 0) { const x = lerp(900, -1400, q); sRR(x, -420, 1100, 460, 40, '#2f6fd0', { lw: 0 }); rr(x + 60, -360, 980, 120, 20, '#bfe3ff', 0); rr(x, -40, 1100, 26, 6, '#ffd34a', 0); for (let w = 0; w < 4; w++) circ(x + 120 + w * 260, 30, 40, '#211c48', 0); for (let l = 0; l < 6; l++) { ctx.save(); ctx.globalAlpha = .5; rr(x + 1150 + l * 60, -300 + l * 50, 200, 8, 4, '#fff', 0); ctx.restore(); } }
      const hit = lt > tH; if (!hit) { line(-420, -140, -150, -170, 46, '#e8b080'); ctx.save(); ctx.translate(-130, -180); ctx.rotate(-.15); sRR(-36, -64, 72, 128, 14, '#1b1530', { lw: 0 }); rr(-28, -54, 56, 100, 8, '#7fd0ff', 0); circ(0, -30, 10, '#ffffff', 0); ctx.restore(); }
      else { const e = clamp((lt - tH) / 1.2); line(-420, -140, -260, -150, 46, '#e8b080'); ctx.save(); ctx.translate(-130 - e * 520, -180 - Math.sin(e * Math.PI) * 300 + e * e * 380); ctx.rotate(e * 14); sRR(-36, -64, 72, 128, 14, '#1b1530', { lw: 0 }); rr(-28, -54, 56, 100, 8, '#7fd0ff', 0); line(-20, -40, 18, 30, 4, '#ffffff'); line(10, -50, -14, 10, 3, '#ffffff'); ctx.restore(); if (e < .2) { ctx.save(); ctx.globalAlpha = 1 - e * 5; star(-130, -180, 120, '#ffffff', 0, 0, 8, .3); ctx.restore(); } }
      ctx.restore(); head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };
  // ---------- RAILMAP: stylised map — Hà Nội station, north stretch to Long Biên bridge, south stretch; 2026 diversions animate
  K.railmap = (o, c, P, dur, i) => { const tN = T0(c, 0, .5), tD = +(o.divertAt ?? T0(c, 1, 2)), tS = T0(c, 2, tD + 2);
    return { sfx: [[tN, 'pop'], [tD, 'whoosh'], [tS, 'ding']], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i); const k = Math.min(s.w / 920, s.h / 980); ctx.save(); ctx.translate(s.cx - 200 * k, s.cy); ctx.scale(k, k);
      ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = '#3f6fc0'; ctx.beginPath(); ctx.moveTo(150, -460); ctx.bezierCurveTo(260, -300, 200, -150, 330, 0); ctx.bezierCurveTo(420, 120, 300, 300, 380, 460); ctx.lineTo(480, 460); ctx.bezierCurveTo(400, 300, 520, 120, 430, 0); ctx.bezierCurveTo(300, -150, 360, -300, 250, -460); ctx.fill(); ctx.restore(); T('SÔNG HỒNG', 410, 260, { size: 22, font: 'cond', fill: '#bfe3ff', lw: 0, rot: 1.2 });
      const drawRail = (pts, col, w, prog = 1) => { ctx.beginPath(); pts.forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.setLineDash([]); ctx.stroke(); };
      const north = [[-40, 120], [-30, -60], [40, -200], [180, -240], [300, -230], [520, -230]], south = [[-40, 120], [-60, 300], [-80, 460]];
      drawRail(north, '#2a2b66', 26); drawRail(south, '#2a2b66', 26); drawRail(north, '#d9d4f5', 8); drawRail(south, '#d9d4f5', 8);
      for (let a = 0; a < 7; a++) { ctx.save(); ctx.beginPath(); ctx.arc(250 + a * 34, -212, 16, Math.PI, 0); ctx.lineWidth = 6; ctx.strokeStyle = '#c9a070'; ctx.stroke(); ctx.restore(); } T('CẦU LONG BIÊN', 330, -280, { size: 24, font: 'cond', fill: '#fff', lw: 0 });
      sRR(-90, 90, 100, 60, 14, '#ff7a59', { lw: 0 }); T('GA HÀ NỘI', -40, 172, { size: 24, font: 'cond', fill: '#fff', lw: 0 }); circ(560, -230, 22, '#4fc3a1', 0); T('GIA LÂM', 560, -190, { size: 22, font: 'cond', fill: '#fff', lw: 0 });
      const pn = E.back(clamp((lt - tN) / .4)); if (pn > 0) { ctx.save(); ctx.translate(20, -110); ctx.scale(pn, pn); sRR(-150, -30, 190, 56, 14, '#ffd34a', { lw: 0 }); T('PHÙNG HƯNG', -55, 0, { size: 24, font: 'impact', fill: '#1b1530', lw: 0 }); ctx.restore(); }
      const ps = E.back(clamp((lt - tS) / .4)); if (ps > 0) { ctx.save(); ctx.translate(-70, 330); ctx.scale(ps, ps); sRR(-210, -30, 200, 56, 14, '#4fc3a1', { lw: 0 }); T('LÊ DUẨN · KHÂM THIÊN', -110, 0, { size: 18, font: 'impact', fill: '#1b1530', lw: 0 }); ctx.restore(); const q = (lt * .4) % 1; const y = lerp(460, 120, q); sRR(-86, y - 30, 40, 60, 10, '#2f6fd0', { lw: 0 }); }
      if (lt > tD) { const d = clamp((lt - tD) / 1.2); ctx.save(); ctx.globalAlpha = d; ctx.setLineDash([14, 12]); drawRail(north, '#ff4a3a', 10); ctx.setLineDash([]); ctx.restore(); if (d > .6) { ctx.save(); ctx.translate(140, -150); ctx.rotate(-.15); ctx.lineWidth = 8; ctx.strokeStyle = '#ff4a3a'; ctx.beginPath(); ctx.roundRect(-150, -36, 300, 72, 12); ctx.stroke(); T('NO PASSENGER TRAINS', 0, 4, { size: 26, font: 'impact', fill: '#ff4a3a', lw: 0 }); ctx.restore(); }
        const hp = E.inOut(clamp((lt - tD - .4) / 1)); sRR(lerp(560, 640, hp) - 24, -230 - 20, 48, 40, 10, '#2f6fd0', { lw: 0 }); T('→ HẢI PHÒNG', 600, -150, { size: 20, font: 'cond', fill: '#4fc3a1', lw: 0, alpha: hp }); }
      ctx.restore(); head(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };
  // ---------- BRIDGE: Long Biên at sunset — iron trusses, red river, people walking, scooters on the side lane
  K.bridge = (o, c, P, dur, i) => ({ sfx: [[0, 'wind'], [.5, 'vehicle_moto_pass']], draw: lt => { const s = st(), u = U(); sky('#3b2b7b', '#ff9a6a'); glow(W * .7, s.y0 + s.h * .35, 360 * u, '#ffd98a', .4); circ(W * .7, s.y0 + s.h * .35, 70 * u, '#ffe9b0', 0);
    const wy = s.y0 + s.h * .62; const g = ctx.createLinearGradient(0, wy, 0, H); g.addColorStop(0, '#d97a6a'); g.addColorStop(1, '#7a3a5a'); ctx.fillStyle = g; ctx.fillRect(0, wy, W, H); for (let k = 0; k < 8; k++) { ctx.save(); ctx.globalAlpha = .25; rr(((lt * 30 + k * 170) * u) % (W + 200 * u) - 100 * u, wy + 30 * u + k * 28 * u, 120 * u, 5 * u, 3, '#ffe0c0', 0); ctx.restore(); }
    const by = s.y0 + s.h * .5, off = (lt * 40 * u) % (260 * u); ctx.fillStyle = '#3a2a5a'; ctx.fillRect(0, by, W, 30 * u); for (let x = -off - 260 * u; x < W + 260 * u; x += 260 * u) { ctx.lineWidth = 9 * u; ctx.strokeStyle = '#4a3a6a'; ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + 130 * u, by - 150 * u); ctx.lineTo(x + 260 * u, by); ctx.moveTo(x, by - 150 * u); ctx.lineTo(x + 260 * u, by - 150 * u); ctx.stroke(); rr(x + 120 * u, by + 30 * u, 22 * u, wy - by + 40 * u, 4, '#3a2a5a', 0); }
    for (let k = 0; k < 6; k++) { const x = ((k * 230 * u - lt * 25 * u) % (W + 200 * u) + W + 200 * u) % (W + 200 * u) - 100 * u; person(x, by - 2 * u, u * 1.1, ['#ffffff', '#ffb84d', '#4fc3a1', '#ff8fab'][k % 4], false, lt, k); }
    head(o.head, lt, .15, '#ffcf4a'); fgBokeh(lt, i, '#ffe0c0'); } });
  // ---------- WINDOW: inside a carriage, the street rushes past the window (balconies, plants, waving kids, lanterns)
  K.window = (o, c, P, dur, i) => ({ sfx: [[0, 'train_pass'], [0, 'engine_loop']], draw: lt => { const s = st(), u = U(); ctx.fillStyle = '#2a2b66'; ctx.fillRect(0, 0, W, H); const wx = s.x0, wy = s.y0 + s.h * .08, ww = s.w, wh = s.h * .62;
    ctx.save(); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 40 * u); ctx.clip(); sky('#ffb070', '#c96b9a'); const sp = lt * 700 * u; for (let k = -1; k < 8; k++) { const w = 260 * u, x = k * w - (sp % w); const id = Math.floor((sp) / w) + k; const col = HC[((id % 8) + 8) % 8]; rr(x, wy - 40 * u, w - 6 * u, wh + 80 * u, 0, col, 0); rr(x + w * .2, wy + wh * .2, w * .5, wh * .22, 12 * u, 'rgba(60,50,120,.5)', 0); rr(x + 10 * u, wy + wh * .5, w - 26 * u, 14 * u, 4, '#ffffff', 0); circ(x + w * .3, wy + wh * .48, 22 * u, '#3f9a4a', 0); if (id % 3 === 0) person(x + w * .6, wy + wh * .9, u * 1.6, '#ff8fab', false, lt * 4, id); }
    for (let l = 0; l < 6; l++) { ctx.save(); ctx.globalAlpha = .35; rr(((l * 300 - sp * 1.6) % (W + 300 * u) + W + 300 * u) % (W + 300 * u) - 150 * u, wy + 40 * u + l * 70 * u, 160 * u, 5 * u, 3, '#fff', 0); ctx.restore(); } ctx.restore();
    ctx.lineWidth = 26 * u; ctx.strokeStyle = '#e8e4f8'; ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 40 * u); ctx.stroke(); rr(wx, wy + wh + 30 * u, ww, 40 * u, 12 * u, '#5a4fb0', 0); sRR(wx + ww * .1, wy + wh + 80 * u, ww * .8, s.h * .18, 20 * u, '#2f6fd0', { lw: 0 });
    head(o.head, lt, .15, '#ffcf4a'); } });
})();
