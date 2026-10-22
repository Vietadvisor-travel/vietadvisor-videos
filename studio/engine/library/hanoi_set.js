/* HÀ NỘI OLD QUARTER — a full flat-3D street set for FLAT3D: tube houses with shopfronts, shutters, balconies, plants,
   vertical signs, AC units, tangled wires, trees, street lamps, a zebra crossing, and billboard traffic. Day or dusk.
   hanoiStreet({ t, time:'dusk'|'day', len }) queues the set; then add billboards and call F3.flush(). */
(function () {
  const SIGNS = ['PHỞ BÒ', 'CÀ PHÊ', 'BÁNH MÌ', 'TẠP HOÁ', 'BÚN CHẢ', 'SỬA XE', 'NHÀ NGHỈ', 'TRÀ ĐÁ', 'BÚN BÒ', 'CƠM', 'KEM', 'BIA HƠI', 'LẨU', 'XÔI'];
  const WALLS = ['#e8c167', '#e59b6b', '#a7d3c4', '#f1e4c8', '#e48a8a', '#c9d98a', '#f2b98f', '#9fc3d8', '#efd9a0', '#d7a6c9'];
  const SIGNC = ['#d6332b', '#1f6fb8', '#f2b81f', '#2a9b5f', '#f2f2f2', '#7a2fb8', '#e4572e'];
  const R = (i, k) => hash(i * 12.9898 + k * 78.233);
  // facade floor art (drawn in a w×h box, origin top-left), mapped onto the floor quad
  function floorArt(w, h, fl, seed, dusk, col) {
    const winC = dusk ? (R(seed, fl) > .35 ? '#ffcf7a' : '#3b3150') : '#3d5560';
    if (fl === 0) { // shopfront: open interior, half-rolled shutter
      ctx.fillStyle = dusk ? '#ffb85a' : '#3a2a26'; ctx.fillRect(w * .06, h * .18, w * .88, h * .82);
      ctx.fillStyle = dusk ? 'rgba(90,40,20,.55)' : 'rgba(0,0,0,.25)'; for (let k = 0; k < 4; k++) ctx.fillRect(w * (.12 + k * .2), h * .55, w * .1, h * .45);   // shelves / people silhouettes
      ctx.fillStyle = '#b9b4ad'; ctx.fillRect(w * .06, h * .18, w * .88, h * .16); ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let k = 0; k < 6; k++) ctx.fillRect(w * .06, h * (.19 + k * .026), w * .88, h * .008);
      return; }
    // upper floors: two tall shuttered windows
    for (const cx of [.28, .72]) { const x0 = w * (cx - .14), ww = w * .28, y0 = h * .18, hh = h * .62;
      ctx.fillStyle = winC; ctx.fillRect(x0, y0, ww, hh); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x0, y0, ww * .5, hh);
      ctx.fillStyle = col === '#a7d3c4' ? '#3f8f6a' : '#2f7a5a'; ctx.fillRect(x0 - ww * .22, y0, ww * .2, hh); ctx.fillRect(x0 + ww * 1.02, y0, ww * .2, hh);   // green shutters
      ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let k = 0; k < 6; k++) { ctx.fillRect(x0 - ww * .22, y0 + k * hh / 6, ww * .2, hh * .02); ctx.fillRect(x0 + ww * 1.02, y0 + k * hh / 6, ww * .2, hh * .02); }
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x0 - ww * .25, y0 - h * .05, ww * 1.5, h * .04); }
    ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(0, h * .92, w, h * .08);
  }
  function signArt(w, h, txt, c, dusk) { ctx.fillStyle = c; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = h * .06; ctx.strokeRect(h * .08, h * .08, w - h * .16, h - h * .16);
    ctx.fillStyle = c === '#f2f2f2' || c === '#f2b81f' ? '#c0201a' : '#fff'; ctx.font = `900 ${h * .62}px ${FONT.display}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(txt).width; ctx.save(); ctx.translate(w / 2, h * .54); if (tw > w * .9) ctx.scale(w * .9 / tw, 1); ctx.fillText(txt, 0, 0); ctx.restore(); }
  function vsignArt(w, h, txt, c) { ctx.fillStyle = c; ctx.fillRect(0, 0, w, h); ctx.fillStyle = c === '#f2f2f2' || c === '#f2b81f' ? '#c0201a' : '#fff'; ctx.font = `900 ${w * .62}px ${FONT.display}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const ch = [...txt.replace(' ', '')].slice(0, 6); ch.forEach((k, i) => ctx.fillText(k, w / 2, (i + .6) * h / (ch.length + .2))); }

  window.hanoiStreet = function (o = {}) {
    const dusk = o.time !== 'day', len = o.len || 150, t = o.t || 0;
    const ROAD = dusk ? '#3a3846' : '#57545e', WALK = dusk ? '#8f8478' : '#c7b9a3';
    F3.quad([[-4.2, 0, -12], [4.2, 0, -12], [4.2, 0, len], [-4.2, 0, len]], ROAD, { key: 9e5 });
    for (let z = -10; z < len; z += 6) F3.quad([[-.08, .01, z], [.08, .01, z], [.08, .01, z + 3], [-.08, .01, z + 3]], '#e9dfb5', { key: 8e5, emissive: 1 });
    const zc = o.cross ?? 14; for (let k = -3.6; k < 3.7; k += .9) F3.quad([[k, .012, zc], [k + .5, .012, zc], [k + .5, .012, zc + 3.2], [k, .012, zc + 3.2]], '#f1ede0', { key: 7e5, emissive: 1 });
    for (const s of [-1, 1]) { F3.box(s * 4.2, 0, -12, s * 6.6, .16, len, WALK, { top: WALK, key: 6e5 }); }
    // houses
    for (const s of [-1, 1]) { let z = -12, i = s > 0 ? 100 : 0;
      while (z < len) { i++; const w = 3.4 + R(i, 1) * 1.8, fl = 3 + Math.floor(R(i, 2) * 3.4), fh = 3.1, ht = fl * fh + .6, col = WALLS[Math.floor(R(i, 3) * WALLS.length)], x0 = s * 6.6, x1 = s * 20, z0 = z, z1 = z + w;
        const roofC = ['#b5533c', '#8a6a5a', '#7a8a94', '#c98a5a', '#6a5a6a'][Math.floor(R(i, 12) * 5)]; F3.box(Math.min(x0, x1), 0, z0, Math.max(x0, x1), ht, z1, col, { side: col, top: dusk ? shade(roofC, -.25) : roofC });
        F3.box(Math.min(x0, x0 + s * .4), ht, z0 + .1, Math.max(x0, x0 + s * .4), ht + .7, z1 - .1, col);   // parapet
        if (R(i, 13) > .45) F3.billboard([x0 + s * (3 + R(i, 14) * 4), ht, z0 + w / 2], (sx, sy, sc, fog) => { const k = sc * 1000; ctx.fillStyle = fog > .5 ? '#9aa' : '#d9dde2'; ctx.beginPath(); ctx.roundRect(sx - .6 * k, sy - 1.4 * k, 1.2 * k, 1.1 * k, .2 * k); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(sx - .6 * k, sy - .9 * k, 1.2 * k, .08 * k); ctx.fillStyle = '#6a6a70'; ctx.fillRect(sx - .5 * k, sy - .3 * k, .08 * k, .3 * k); ctx.fillRect(sx + .42 * k, sy - .3 * k, .08 * k, .3 * k); });   // rooftop water tank
        for (let f = 0; f < fl; f++) { const y0 = f * fh, y1 = y0 + fh, seed = i * 10 + f;
          const za = s > 0 ? z1 : z0, zb = s > 0 ? z0 : z1; F3.quad([[x0 - s * .01, y1, za], [x0 - s * .01, y1, zb], [x0 - s * .01, y0, zb], [x0 - s * .01, y0, za]], col, { after: it => F3.onQuad(it, 100, 90, () => floorArt(100, 90, f, seed, dusk, col)), glow: dusk && f === 0 ? 'rgba(255,170,80,.35)' : null });
          if (f > 0 && R(i, 10 + f) > .45) { // balcony + railing + plants
            const bz0 = z0 + .3, bz1 = z1 - .3, bx = x0 - s * .9; F3.box(Math.min(x0, bx), y0 - .05, bz0, Math.max(x0, bx), y0 + .15, bz1, '#e9e2d4');
            F3.quad([[bx, y0 + .15, bz0], [bx, y0 + .15, bz1], [bx, y0 + 1.1, bz1], [bx, y0 + 1.1, bz0]], '#30343a', { after: it => F3.onQuad(it, 100, 30, () => { ctx.clearRect(0, 0, 0, 0); ctx.fillStyle = 'rgba(0,0,0,0)'; }) });
            for (let p = 0; p < 3; p++) F3.billboard([bx + s * .2, y0 + 1.15, bz0 + (p + .5) * (bz1 - bz0) / 3], (sx, sy, sc, fog) => { const r = 380 * sc * (.8 + R(seed, p) * .5); ctx.fillStyle = fog > .5 ? '#5a6a5a' : ['#3f9a4a', '#5bb35a', '#2f7f3f'][p]; ctx.beginPath(); ctx.arc(sx, sy - r * .6, r, 0, TAU); ctx.arc(sx - r * .7, sy - r * .2, r * .7, 0, TAU); ctx.arc(sx + r * .7, sy - r * .2, r * .7, 0, TAU); ctx.fill(); if (R(seed, p + 5) > .5) { ctx.fillStyle = '#e04a6a'; ctx.beginPath(); ctx.arc(sx + r * .3, sy - r * .9, r * .25, 0, TAU); ctx.fill(); } });
          }
          if (f > 0 && R(i, 30 + f) > .6) F3.box(x0 - s * .55, y0 + 1.9, z1 - 1.1, x0, y0 + 2.5, z1 - .3, '#e6e6e6');   // AC unit
        }
        // shop sign band on the ground floor
        const sc = SIGNC[Math.floor(R(i, 4) * SIGNC.length)], txt = SIGNS[Math.floor(R(i, 5) * SIGNS.length)];
        const sa = s > 0 ? z1 - .15 : z0 + .15, sb = s > 0 ? z0 + .15 : z1 - .15; F3.quad([[x0 - s * .06, 3.0, sa], [x0 - s * .06, 3.0, sb], [x0 - s * .06, 2.45, sb], [x0 - s * .06, 2.45, sa]], sc, { emissive: dusk, after: it => F3.onQuad(it, 240, 60, () => signArt(240, 60, txt, sc, dusk)) });
        // vertical sign sticking out into the street
        if (R(i, 6) > .45) { const vz = z0 + .4, vc = SIGNC[Math.floor(R(i, 7) * SIGNC.length)], vt = SIGNS[Math.floor(R(i, 8) * SIGNS.length)];
          const va = s > 0 ? x0 - s * 1.2 : x0, vb = s > 0 ? x0 : x0 - s * 1.2; F3.quad([[va, 8.2, vz], [vb, 8.2, vz], [vb, 3.8, vz], [va, 3.8, vz]], vc, { emissive: dusk, glow: dusk ? 'rgba(255,120,120,.35)' : null, after: it => F3.onQuad(it, 60, 220, () => vsignArt(60, 220, vt, vc)) }); }
        if (R(i, 9) > .55) { const fy = 3.6 + Math.floor(R(i, 11) * 2) * 3.1, fz = z0 + w * .5, fx = x0 - s * .1; // national flag on a pole off the facade
          F3.line([[fx, fy, fz], [fx - s * 1.0, fy + .5, fz]], .03, '#6a6a6a');
          F3.billboard([fx - s * 1.0, fy + .5, fz], (sx, sy, sc, fog) => { const k = sc * 1000, wv = Math.sin(t * 4 + i) * .08; ctx.save(); ctx.translate(sx, sy); ctx.fillStyle = fog > .6 ? '#a86060' : '#da251d'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(.45 * k, (.05 + wv) * k, .9 * k, 0); ctx.lineTo(.9 * k, .6 * k); ctx.quadraticCurveTo(.45 * k, (.65 - wv) * k, 0, .6 * k); ctx.fill(); ctx.fillStyle = '#ffde00'; star(.45 * k, .3 * k, .16 * k, '#ffde00', 0); ctx.restore(); });
        }
        for (let p = 0; p < 2; p++) if (R(i, 40 + p) > .35) { const pz = z0 + (p + .5) * w / 2, px = s * (5.6 + R(i, 50 + p) * .6), col2 = SIGNC[Math.floor(R(i, 60 + p) * SIGNC.length)];
          F3.billboard([px, .16, pz], (sx, sy, sc, fog) => { const k = sc * 1000 / 100; ctx.globalAlpha = 1 - fog * .5; drawProp('scooter', sx, sy, k * .55, { color: col2, flip: (i + p) % 2, spin: 0 }, 0); }); }
        if (R(i, 70) > .6) { const pz = z0 + w * .5, px = s * 5.2; // plastic stools + a customer
          F3.billboard([px, .16, pz], (sx, sy, sc, fog) => { const k = sc * 1000; ctx.globalAlpha = 1 - fog * .5; for (const dx of [-.5, .5]) { ctx.fillStyle = dx < 0 ? '#e23b3b' : '#2f7fd1'; ctx.fillRect(sx + dx * k - .18 * k, sy - .42 * k, .36 * k, .1 * k); ctx.fillRect(sx + dx * k - .16 * k, sy - .42 * k, .05 * k, .42 * k); ctx.fillRect(sx + dx * k + .11 * k, sy - .42 * k, .05 * k, .42 * k); }
            ctx.fillStyle = '#3a8fd1'; ctx.fillRect(sx - .2 * k, sy - .55 * k, .4 * k, .08 * k); if (CHAR.grandma && (i % 2)) person(sx - .5 * k, sy - .3 * k, k / 260, CHAR[(i % 4) ? 'grandma' : 'xeom'].spec, { t, pose: 'sit', expr: 'happy' }); }); }
        z += w; } }
    // poles, wires, lamps, trees
    for (let z = -6; z < len; z += 12) for (const s of [-1, 1]) { const x = s * 4.5; F3.box(x - .12, 0, z - .12, x + .12, 8.6, z + .12, '#6a6a70');
      if (dusk) F3.quad([[x - .3, 6.4, z], [x + .3, 6.4, z], [x + .3, 6.2, z], [x - .3, 6.2, z]], '#fff2c8', { emissive: 1, glow: 'rgba(255,220,150,.6)' }); }
    for (let z = -6; z < len - 12; z += 12) { for (let k = 0; k < 7; k++) { const sag = .5 + k * .12, y = 7.8 - k * .18, pts = []; for (let q = 0; q <= 12; q++) { const u = q / 12; pts.push([-4.5 + 9 * u, y - sag * Math.sin(u * Math.PI), z + (k % 2) * .3]); } F3.line(pts, .025, 'rgba(25,20,30,.9)'); }
      for (const s of [-1, 1]) for (let k = 0; k < 5; k++) { const pts = []; for (let q = 0; q <= 8; q++) { const u = q / 8; pts.push([s * (4.5 - k * .05), 8.0 - k * .2 - .6 * Math.sin(u * Math.PI), z + 12 * u]); } F3.line(pts, .03, 'rgba(25,20,30,.9)'); } }
    for (let z = 2; z < len; z += 17) for (const s of [-1, 1]) F3.billboard([s * 5.4, 0, z + (s > 0 ? 6 : 0)], (sx, sy, sc, fog) => { const k = sc * 1000; ctx.fillStyle = '#5a4030'; ctx.fillRect(sx - .12 * k, sy - 3 * k, .24 * k, 3 * k); ctx.fillStyle = fog > .4 ? mix('#3f7a45', '#8a8a8a', fog) : (dusk ? '#2f5a3a' : '#3f8a45'); for (const [dx, dy, r] of [[0, -4.2, 1.6], [-1.1, -3.6, 1.1], [1.1, -3.7, 1.2], [0, -3.2, 1.2]]) { ctx.beginPath(); ctx.arc(sx + dx * k, sy + dy * k, r * k, 0, TAU); ctx.fill(); } });
  };
  // traffic billboards
  window.scooterBB = function (x, z, dir, i, t) { // dir +1 = driving away (+z), -1 = toward camera (-z); side view if lateral
    F3.billboard([x, 0, z], (sx, sy, sc, fog) => { const k = sc * 1000 / 100; ctx.globalAlpha = 1 - fog * .6;
      if (typeof scooterFrontPublic === 'function') scooterFrontPublic(sx, sy, k * .55, ['#d23b3b', '#2f7fd1', '#f0f0f0', '#2c2c35', '#e88a2e', '#3aa37a', '#8c55c9', '#e2c43c'][i % 8], t, { back: dir > 0, helmet: ['#e8c33a', '#f2f2f2', '#d23b3b', '#2c6fd1', '#1f1f26', '#ff8fc0'][i % 6], shirt: ['#3b6fb0', '#c94a4a', '#3aa37a', '#e8e0d0', '#6a4ab0', '#f2a03a'][i % 6], mask: i % 3 ? ['#7fb3d9', '#2a2a2a', '#e9e2d4'][i % 3] : null, passenger: i % 5 === 2 ? '#e8708a' : null, plate: String(100 + (i * 37) % 900) + '.' + String(10 + (i * 13) % 89) }); });
  };
})();
