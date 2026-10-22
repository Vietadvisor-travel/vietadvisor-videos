/* Ep. 3 — why Việt Nam is an S. `# sshape` beat: OverSimplified-style colour-block map of Việt Nam.
   mode=grow     stages="938;Independence|1069;…" — the red territory (Đại Việt) pushes south one stage per caption;
                 Champa (teal) and Khmer lands (violet) shrink. Stage ids: today 938 1069 1306 1471 1611 1653 1697 1698 1757
   mode=terrain  Trường Sơn mountains rise along the west, the sea on the east, rice arrows follow the coast south
   mode=narrow   zoom on the waist near Đồng Hới — a ruler across the ~50 km
   mode=length   ruler from the northern tip to Cà Mau, then the train line Hà Nội → Sài Gòn draws itself
   Common: face=yes (Đại Việt gets eyes — the OverSimplified "country character"), s=yes (golden S traced at the end),
   label="…" big title, sub="…" small line, k= zoom override. Hoàng Sa & Trường Sa always shown (vnMap). */
(function () {
  // southern border of Đại Việt per stage, as a line through two [lon, lat] points (everything north of it is Đại Việt)
  const LINE = {
    blob: [[100, 19.6], [112, 19.6]], 938: [[100, 18.05], [112, 17.95]], 1069: [[100, 16.95], [112, 16.8]],
    1306: [[100, 15.65], [112, 15.7]], 1471: [[100, 12.9], [112, 12.85]], 1611: [[100, 12.55], [112, 12.5]], 1653: [[100, 11.62], [112, 11.55]],
    1697: [[100, 11.05], [112, 10.95]], 1698: [[103.0, 11.25], [107.6, 10.18]], 1757: [[100, 6], [112, 6]], today: [[100, 6], [112, 6]]
  };
  const KHMER = [[103.0, 11.62], [108.2, 10.88]]; // north edge of the Khmer lands (Mekong Delta, Đồng Nai)
  // rough centre line of the country, for labels and the S trace
  const SPINE = [[105.3, 22.6], [105.6, 21.0], [105.75, 19.4], [106.2, 18.0], [107.0, 16.7], [108.0, 15.6], [108.6, 14.2], [108.7, 12.9], [108.5, 11.9], [107.6, 11.1], [106.4, 10.6], [105.6, 10.0], [105.1, 9.2]];
  const lonAt = lat => { for (let i = 1; i < SPINE.length; i++) { const a = SPINE[i - 1], b = SPINE[i]; if (lat <= a[1] && lat >= b[1]) return lerp(a[0], b[0], (a[1] - lat) / (a[1] - b[1])); } return lat > 20 ? 105.4 : 105.2; };
  const latOn = (L, lon) => lerp(L[0][1], L[1][1], (lon - L[0][0]) / (L[1][0] - L[0][0]));
  const mixL = (A, B, p) => [[lerp(A[0][0], B[0][0], p), lerp(A[0][1], B[0][1], p)], [lerp(A[1][0], B[1][0], p), lerp(A[1][1], B[1][1], p)]];
  const RES = () => Math.min(W, H) / 270; // map zoom k is in device px per degree — scale it with the render size (k values are tuned at qa scale .25)
  const CH = '#2f9e8f', KH = '#8d6cc0', DV = () => C.red;
  // clip to the part of the screen north (or south) of a geo line
  function halfClip(P, L, north) {
    const a = P(L[0][0], L[0][1]), b = P(L[1][0], L[1][1]); const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, ux = dx / n, uy = dy / n, F = 1e5;
    const A = [a[0] - ux * F, a[1] - uy * F], B = [b[0] + ux * F, b[1] + uy * F], s = north ? -1 : 1; // screen y grows downward: north = up
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(B[0], B[1] + s * F); ctx.lineTo(A[0], A[1] + s * F); ctx.closePath(); ctx.clip();
  }
  function vnPath(P) { ctx.beginPath(); for (const rg of GEO.VN) rg.forEach(([lo, la], i) => { const [x, y] = P(lo, la); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); }
  function blocks(P, L, o, lt) {
    const u = U();
    ctx.save(); vnPath(P); ctx.clip('evenodd');
    // Champa band (between Đại Việt and the Khmer lands), Khmer lands, Đại Việt
    ctx.save(); halfClip(P, KHMER, true); ctx.fillStyle = CH; ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); halfClip(P, KHMER, false); ctx.fillStyle = KH; ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); halfClip(P, L, true); ctx.fillStyle = DV(); ctx.fillRect(0, 0, W, H);
    // paper grain on the red so it reads as a printed map
    ctx.globalAlpha = .08; for (let i = 0; i < 70; i++) { ctx.fillStyle = i % 2 ? '#fff' : '#000'; ctx.fillRect(hash(i) * W, hash(i + 9) * H, 3 * u, 3 * u); } ctx.restore();
    // the frontier: a glowing dashed edge
    const a = P(L[0][0], L[0][1]), b = P(L[1][0], L[1][1]);
    ctx.save(); ctx.setLineDash([16 * u, 12 * u]); ctx.lineDashOffset = -lt * 60 * u; line(a[0], a[1], b[0], b[1], 7 * u, '#fff3c4'); ctx.restore();
    ctx.restore();
    vnPath(P); ctx.lineWidth = 5 * u; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  }
  function regionLabel(P, txt, latN, latS, col, size, a = 1) {
    if (latN - latS < .5 || a <= 0) return; const lat = (latN + latS) / 2, [x, y] = P(lonAt(lat), lat); const u = U();
    ctx.save(); ctx.globalAlpha *= a * clamp((latN - latS - .5) / .8); T(txt, x, y, { size: size * u, fill: '#fff', lw: 9 * u, font: 'display' }); ctx.restore();
  }
  // Đại Việt as a character: eyes that look south (OverSimplified's countries have faces)
  function face(P, latN, latS, lt, mood) {
    const lat = 21.35; const [x, y] = P(105.25, lat), u = U(), r = 17 * u;
    const blink = (lt % 3.1) < .12 ? .15 : 1, look = [.25, .7];
    for (const d of [-1, 1]) { ctx.save(); ctx.translate(x + d * r * 1.4, y); ctx.scale(1, blink); circ(0, 0, r, '#fff', 4 * u); circ(look[0] * r * .45, look[1] * r * .45, r * .5, C.ink, 0); ctx.restore(); }
    if (mood === 'shock') { ctx.beginPath(); ctx.ellipse(x, y + r * 1.9, r * .55, r * .75, 0, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); }
    else if (mood === 'sad') { ctx.beginPath(); ctx.arc(x, y + r * 2.6, r * 1.0, 1.15 * Math.PI, 1.85 * Math.PI); ctx.lineWidth = 4 * u; ctx.strokeStyle = C.ink; ctx.stroke(); }
    else if (mood === 'grin') { ctx.beginPath(); ctx.arc(x, y + r * 1.4, r * 1.1, .15 * Math.PI, .85 * Math.PI); ctx.lineWidth = 4 * u; ctx.strokeStyle = C.ink; ctx.stroke(); }
  }
  function mountains(P, p, lt) { const u = U(); const pts = [[103.6, 21.9], [104.3, 20.6], [105.0, 19.5], [105.6, 18.6], [106.2, 17.6], [106.9, 16.6], [107.4, 15.6], [107.8, 14.6], [108.0, 13.5], [107.9, 12.4]];
    pts.forEach(([lo, la], i) => { const q = clamp(p * pts.length - i); if (q <= 0) return; const [x, y] = P(lo, la), s = E.back ? E.back(q) : q;
      for (const dx of [-1, 0, 1]) { const h = (dx ? 34 : 50) * u * s, w = (dx ? 26 : 34) * u; const xx = x + dx * 30 * u; sPoly([[xx - w, y + 10 * u], [xx, y + 10 * u - h], [xx + w, y + 10 * u]], dx ? '#7d6a52' : '#6a5844', { lw: 3 * u }); sPoly([[xx - w * .32, y + 10 * u - h * .68], [xx, y + 10 * u - h], [xx + w * .32, y + 10 * u - h * .68]], '#f4efe2', { lw: 2 * u }); } }); }
  function ruler(x1, y1, x2, y2, p, label, u, col = '#fff') { const x = lerp(x1, x2, p), y = lerp(y1, y2, p); line(x1, y1, x, y, 12 * u, C.ink); line(x1, y1, x, y, 6 * u, col);
    for (const [px, py] of [[x1, y1], [x, y]]) circ(px, py, 9 * u, col, 4 * u); if (p > .95 && label) { const ang = Math.atan2(y2 - y1, x2 - x1); ctx.save(); ctx.translate((x1 + x2) / 2, (y1 + y2) / 2); const flip = Math.abs(ang) > Math.PI / 2; ctx.rotate(flip ? ang + Math.PI : ang); T(label, 0, -34 * u, { size: 54 * u, fill: C.yel, lw: 12 * u, font: 'display' }); ctx.restore(); } }
  function header(txt, sub, lt, at = .1, o = {}) { const u = U(), V = H > W, a = E.back ? E.back(clamp((lt - at) / .45)) : 1; if (a <= 0) return; const y = o.y ?? (V ? H * .33 : H * .3), x = o.x ?? (V ? W * .7 : W * .76);
    if (txt) T(txt, x, y, { size: (V ? 104 : 92) * u * a, fill: '#fff', lw: 16 * u, font: 'display' }); if (sub) T(sub, x, y + (V ? 82 : 74) * u, { size: Math.min((V ? 44 : 40) * u, Math.min(x, W - x) * 2 * .9 / (String(sub).length * .58)), fill: C.yel, lw: 10 * u, font: 'body', scale: a }); }

  SB.recipes.sshape = (o, b) => {
    const mode = o.mode || 'grow', V = () => H > W;
    const st = (o.stages || '938').split('|').map(s => { const [id, label] = s.split(';'); return { id: id.trim(), label: (label || '').trim() }; });
    const { caps, end } = timeCaps(b.caps, num(o.capAt, .35), .05, b.capStyle);
    const dur = Math.max(num(o.dur, 0), end + .5, mode === 'grow' ? 3 : 5);
    // stage k starts with caption k (stage 0 from the start); with more stages than captions, spread the rest
    const tk = st.map((s, k) => k === 0 ? -1 : (caps[k] ? caps[k][0] : (caps.length ? caps[caps.length - 1][0] : 0) + (k - caps.length + 1) * 1.6));
    const view = () => { const vv = V(); const base = { lon: vv ? 108.2 : 107.4, lat: vv ? 15.5 : 15.9, k: num(o.k, vv ? 24.5 : 13.8) * RES() }; return base; };
    const render = lt => {
      const u = U(), vv = V();
      if (mode === 'grow' || mode === 'terrain') {
        let k = 0; for (let i = 0; i < st.length; i++) if (lt >= tk[i]) k = i;
        const prev = LINE[st[Math.max(0, k - 1)].id] || LINE[938], cur = LINE[st[k].id] || LINE[938], p = k === 0 ? 1 : SMs(clamp((lt - tk[k]) / 1.1));
        const L = mixL(prev, cur, p);
        const v0 = view(), drift = Math.sin(lt * .5) * .08; const latFront = latOn(L, 106.5);
        // camera leans toward the frontier while it moves
        const kick = k > 0 ? Math.exp(-(lt - tk[k]) * 3.2) * clamp((lt - tk[k]) / .06) : 0; // punch-in on every new stage (reads as a cut)
        const v = mode === 'grow' ? { lon: v0.lon + drift, lat: lerp(v0.lat, clamp(latFront, 11, 19), .18 + .1 * kick), k: v0.k * (1 + .04 * Math.sin(lt * .4) + .09 * kick) } : { ...v0, k: v0.k * (1 + .03 * Math.sin(lt * .5)) };
        const P = vnMap({ ...v, t: lt, vnFill: 0, labels: 1 });
        blocks(P, L, o, lt);
        const champaN = Math.min(latFront, 17.5), khN = latOn(KHMER, 106.5);
        { const fl = Math.max(latFront, 9), lab = o.face === 'yes' ? Math.max(fl + .6, Math.min((21.0 + fl) / 2, 20.4)) : (22.2 + fl) / 2; regionLabel(P, 'ĐẠI VIỆT', lab + .5, lab - .5, C.red, vv ? 40 : 34); }
        regionLabel(P, 'CHAMPA', champaN, Math.max(khN, 9), CH, vv ? 36 : 30);
        regionLabel(P, 'KHMER', Math.min(khN, latFront), 8.9, KH, vv ? 34 : 28);
        if (o.face === 'yes') face(P, 22.4, Math.max(latFront, 9), lt, o.mood || 'grin');
        if (mode === 'terrain') { mountains(P, clamp((lt - .3) / 1.6), lt); const [mx, my] = P(104.3, 17.4); if (lt > 1.4) T('TRƯỜNG SƠN', mx - 10 * u, my, { size: 34 * u, fill: '#fff', lw: 9 * u, font: 'display', scale: E.back ? E.back(clamp((lt - 1.4) / .4)) : 1 });
          const [sx, sy] = P(110.6, 13.6); if (lt > 2.0) T('BIỂN ĐÔNG', sx, sy, { size: 34 * u, fill: '#ffffff', lw: 9 * u, font: 'display', scale: E.back ? E.back(clamp((lt - 2) / .4)) : 1 });
          // rice farmers' arrows down the coast
          const q = clamp((lt - 2.6) / 2.2); if (q > 0) { const path = SPINE.slice(2).map(([lo, la]) => P(lo + .35, la)); ctx.save(); ctx.setLineDash([22 * u, 14 * u]); ctx.lineDashOffset = -lt * 80 * u; ctx.beginPath(); const n = Math.max(2, Math.floor(path.length * q)); path.slice(0, n).forEach((pt, i) => i ? ctx.lineTo(...pt) : ctx.moveTo(...pt)); ctx.lineWidth = 10 * u; ctx.strokeStyle = C.yel; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); const hd = path[n - 1]; star(hd[0], hd[1], 16 * u, C.yel, 4 * u); } }
        const s = st[k]; const yr = s.id === 'today' ? 'TODAY' : s.id === 'blob' ? '' : s.id;
        header(o.label || (/^\d/.test(yr) ? yr : yr), o.label ? o.sub : s.label, lt - (k ? tk[k] : 0), .05);
        if (o.s === 'yes' && st[k].id === 'today') { const q = clamp((lt - tk[k] - .4) / 1.6); if (q > 0) { const path = SPINE.map(([lo, la]) => P(lo, la)); ctx.save(); ctx.beginPath(); const n = Math.max(2, Math.ceil(path.length * q)); path.slice(0, n).forEach((pt, i) => i ? ctx.lineTo(...pt) : ctx.moveTo(...pt)); ctx.lineWidth = 22 * u; ctx.strokeStyle = 'rgba(255,214,90,.85)'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = 'rgba(255,214,90,.9)'; ctx.shadowBlur = 30 * u; ctx.stroke(); ctx.restore(); } }
      } else if (mode === 'narrow') {
        const p = SMs(clamp(lt / 1.6)); const a = view(), bb = { lon: 106.35, lat: 17.4, k: (vv ? 230 : 200) * RES() }; const v = mapCamLerp(a, bb, p);
        const P = vnMap({ ...v, t: lt, vnFill: 1, labels: 1 }); const [x1, y1] = P(106.02, 17.52), [x2, y2] = P(106.64, 17.45);
        if (lt > 1.6) ruler(x1, y1, x2, y2, SMs(clamp((lt - 1.6) / .9)), o.ruler || '≈ 50 km', u);
        const [cx, cy] = P(106.6, 17.47); if (lt > 1.2) mapPin(cx, cy, lt - 1.2, 'ĐỒNG HỚI', u);
        header(o.label, o.sub, lt, 2.6, { x: W / 2, y: H * (H > W ? .21 : .16) });
      } else if (mode === 'length') {
        const v = view(); const P = vnMap({ ...v, t: lt, vnFill: 1, labels: 1, cities: ['hanoi', 'hue', 'danang', 'nhatrang', 'hcmc'], cityAt: { hanoi: 2.2, hue: 3.0, danang: 3.4, nhatrang: 4.0, hcmc: 4.6 },
          route: ['hanoi', 'hue', 'danang', 'nhatrang', 'hcmc'].map(c => [CITY[c][1] + .25, CITY[c][2]]), routeP: SMs(clamp((lt - 2.2) / 2.6)), routeColor: C.yel });
        const [x1, y1] = P(105.32, 23.36), [x2, y2] = P(104.72, 8.6), xr = Math.min(x1, x2) - 70 * u; ruler(xr, y1, xr, y2, SMs(clamp(lt / 1.4)), o.ruler || '1,650 km', u);
        header(o.label, o.sub, lt, .4, { x: W * (H > W ? .66 : .74), y: H * (H > W ? .2 : .2) });
      }
    };
    const sfx = mode === 'grow' ? st.slice(1).map((s, k) => [Math.max(0, tk[k + 1]), 'whoosh']).filter(s => s[0] < dur) : mode === 'narrow' ? [[.1, 'map_whoosh'], [1.2, 'pin_drop']] : [[.1, 'map_whoosh']];
    return { dur, render, captions: caps, sfx, capY: { v: .69, h: .86 } };
  };
})();
