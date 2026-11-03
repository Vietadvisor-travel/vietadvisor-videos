/* `# moment kind=street3d` — directed shots on the flat-3D Hà Nội street (hanoi_set.js + flat3d.js).
   cam=eye|worm|crane|close|side|high|ots|bird|chase   or   path="x,y,z,yaw,pitch,fov@t|…"  (t in seconds of the beat)
   time=dusk|day · traffic=0..40 (default 26) · speed=1 · ev=yes (electric, green-tinted, quiet)
   dave="x,z" pose= expr= · walk="t0-t1:x0>x1" mode=steady|run|stop · hand=yes (raises a hand) · copho="x,z"
   bus=t (a bus rolls in at t) · near=t (a scooter whips past the lens at t) · flow=yes (traffic bends round Dave)
   title="BIG|small" titleAt=s place=sky|ground  — art-directed lettering set into the shot (not a subtitle) */
(function () {
  function sky(dusk, t) { const g = ctx.createLinearGradient(0, 0, 0, H); if (dusk) { g.addColorStop(0, '#1d1a4a'); g.addColorStop(.45, '#a8467a'); g.addColorStop(.75, '#ff9a5a'); g.addColorStop(1, '#ffd38a'); } else { g.addColorStop(0, '#4fa3e0'); g.addColorStop(.7, '#bfe2f2'); g.addColorStop(1, '#f2f6ee'); } ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const u = U(); for (let i = 0; i < 9; i++) { const x = ((hash(i) * W * 1.6 + t * 6 * u * (1 + i * .15)) % (W * 1.6)) - W * .3, y = H * (.04 + hash(i * 3) * .3), rx = (260 + hash(i * 5) * 380) * u, ry = rx * (.07 + hash(i * 7) * .05);
      ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); const c = dusk ? (i % 3 ? '255,170,150' : '255,220,170') : '255,255,255'; gg.addColorStop(0, `rgba(${c},${dusk ? .55 : .85})`); gg.addColorStop(.6, `rgba(${c},${dusk ? .25 : .45})`); gg.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore(); }
    if (dusk) { const g2 = ctx.createRadialGradient(W * .5, H * .42, 0, W * .5, H * .42, W * .9); g2.addColorStop(0, 'rgba(255,200,140,.5)'); g2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H); } }
  const V = () => H > W;
  const CAMS = () => ({ eye: { pos: [-1.2, 1.6, -9], yaw: 4, pitch: 2, fov: V() ? 62 : 46 }, worm: { pos: [.6, .22, -4], yaw: -3, pitch: 13, fov: V() ? 80 : 60 }, crane: { pos: [0, 18, -16], yaw: 0, pitch: -32, fov: V() ? 58 : 44 },
    close: { pos: [-.4, .9, 4], yaw: 6, pitch: 4, fov: V() ? 55 : 40 }, side: { pos: [-3.9, 1.5, 9], yaw: 62, pitch: 4, fov: V() ? 60 : 44 }, high: { pos: [.5, 10, 1.5], yaw: 0, pitch: -40, fov: V() ? 60 : 45 },
    ots: { pos: [-4.9, 1.75, 11.2], yaw: 78, pitch: -2, fov: V() ? 58 : 42 }, bird: { pos: [0, 30, 15.5], yaw: 0, pitch: -89, fov: V() ? 50 : 38 }, chase: { pos: [0, 1.4, -6], yaw: 0, pitch: 0, fov: V() ? 66 : 50 } });
  function parsePath(s) { return s.split('|').map(k => { const [a, tt] = k.split('@'); const v = a.split(',').map(Number); return { t: +tt || 0, pos: [v[0], v[1], v[2]], yaw: v[3] || 0, pitch: v[4] || 0, fov: v[5] || 55 }; }); }
  function busBB(x, z, t) { F3.billboard([x, 0, z], (sx, sy, sc, fog) => { const k = sc * 1000; ctx.save(); ctx.translate(sx, sy); ctx.globalAlpha = 1 - fog * .5;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0, 0, 1.5 * k, .2 * k, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1f8a5a'; ctx.beginPath(); ctx.roundRect(-1.25 * k, -3.2 * k, 2.5 * k, 3.05 * k, .25 * k); ctx.fill(); ctx.fillStyle = '#16704a'; ctx.fillRect(-1.25 * k, -.9 * k, 2.5 * k, .55 * k);
    ctx.fillStyle = '#9ccbe0'; ctx.beginPath(); ctx.roundRect(-1.1 * k, -3.0 * k, 2.2 * k, 1.45 * k, .12 * k); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(-1.0 * k, -2.9 * k); ctx.lineTo(-.3 * k, -2.9 * k); ctx.lineTo(-.8 * k, -1.65 * k); ctx.lineTo(-1.0 * k, -1.65 * k); ctx.fill();
    ctx.fillStyle = '#ffd34a'; ctx.fillRect(-.8 * k, -3.18 * k, 1.6 * k, .2 * k); ctx.fillStyle = '#1a1a1a'; ctx.font = `900 ${.16 * k}px ${FONT.display}`; ctx.textAlign = 'center'; ctx.fillText('09  HOÀN KIẾM', 0, -3.03 * k);
    for (const d of [-1, 1]) { ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(d * .85 * k, -.65 * k, .17 * k, 0, TAU); ctx.fill(); const g = ctx.createRadialGradient(d * .85 * k, -.65 * k, 0, d * .85 * k, -.65 * k, 1.2 * k); g.addColorStop(0, 'rgba(255,240,200,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(d * .85 * k - 1.2 * k, -.65 * k - 1.2 * k, 2.4 * k, 2.4 * k); }
    ctx.fillStyle = '#111'; for (const d of [-1, 1]) ctx.fillRect(d * .95 * k - .18 * k, -.2 * k, .36 * k, .2 * k); ctx.restore(); }); }
  function groundGlow(x, z, col, r) { F3.billboard([x, .02, z], (sx, sy, sc, fog) => { const k = sc * 1000 * r; ctx.save(); ctx.translate(sx, sy); ctx.scale(1, .28); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, k); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(-k, -k, 2 * k, 2 * k); ctx.restore(); }, 8.5e5); }
  function word(txt, x, y, o = {}) { const u = U(); ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.globalAlpha *= o.a ?? 1; ctx.font = `${o.w || 900} ${(o.size || 100) * u}px ${FONT.display}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = `${o.ls * u}px`;
    const mw = o.maxW ?? W * .86, tw = ctx.measureText(txt).width; if (tw > mw) ctx.scale(mw / tw, mw / tw); if (o.stroke) { ctx.lineWidth = o.stroke * u; ctx.strokeStyle = o.strokeCol || '#14102a'; ctx.lineJoin = 'round'; ctx.strokeText(txt, 0, 0); } if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 30 * u; } ctx.fillStyle = o.fill || '#fff'; ctx.fillText(txt, 0, 0); ctx.restore(); }

  MOMENTS.street3d = { dur: 6, capY: .82, sfx: [[0, 'moto_pass']], render(lt, D, o) {
    const dusk = o.time !== 'day', u = U();
    const keys = o.path ? parsePath(o.path) : null, base = CAMS()[o.cam || 'eye'] || CAMS().eye;
    let cv = keys ? F3.path(keys, lt) : { ...base, pos: [...base.pos] };
    if (!keys && o.push) cv.pos[2] += lt * +o.push; if (!keys && o.rise) cv.pos[1] += lt * +o.rise;
    // camera shake on a near miss / bus horn
    const nearT = o.near !== undefined ? +o.near : null, sh = nearT !== null ? Math.exp(-Math.max(0, lt - nearT) * 5) * (lt > nearT ? 1 : 0) : 0;
    if (sh > .01) { cv.yaw += (hash(Math.floor(lt * 40)) - .5) * 3 * sh; cv.pitch += (hash(Math.floor(lt * 40) + 3) - .5) * 2 * sh; }
    const cam = F3.cam(cv); sky(dusk, lt);
    F3.begin(cam, { fog: dusk ? '#c86a7a' : '#d6e6ee', fogNear: 25, fogFar: 140, sun: dusk ? [-.6, .35, .7] : [-.4, .8, -.3], amb: dusk ? .55 : .72, dif: dusk ? .55 : .45 });
    hanoiStreet({ t: lt, time: dusk ? 'dusk' : 'day', len: 150 });
    // Dave: position, walking across, pose
    let dx = 0, dz = 14, pose = o.pose || 'stand', expr = o.expr || 'neutral', walking = false;
    if (o.dave) { const [a, b] = o.dave.split(',').map(Number); dx = a; dz = b; }
    if (o.walk) { const m = o.walk.match(/([\d.]+)-([\d.]+):(-?[\d.]+)>(-?[\d.]+)/); if (m) { const t0 = +m[1], t1 = +m[2], x0 = +m[3], x1 = +m[4]; let p = Math.max(0, Math.min(1, (lt - t0) / (t1 - t0)));
      if (o.mode === 'run') p = p < 1 ? Math.min(1, p * 1.6) : 1; if (o.mode === 'stop') p = p < .45 ? p : (lt < t0 + (t1 - t0) * .85 ? .45 : Math.min(1, .45 + (lt - (t0 + (t1 - t0) * .85)) / ((t1 - t0) * .15) * .55));
      dx = x0 + (x1 - x0) * p; walking = lt > t0 && lt < t1 && !(o.mode === 'stop' && p === .45); if (walking) pose = o.mode === 'run' ? 'run' : 'walk'; } }
    const showDave = !!(o.dave || o.walk);
    // traffic: two directions; lateral avoidance of Dave when flow=yes; chaos when he runs
    const n = o.traffic !== undefined ? +o.traffic : 26, spd = +(o.speed || 1);
    for (let i = 0; i < n; i++) { const dir = i % 2 ? 1 : -1, laneX = dir > 0 ? 1.9 : -1.9; let x = laneX + (hash(i) - .5) * 2.2; const z = ((i * 7.3 + lt * 8 * spd * dir + 1000) % 120) - 5;
      if (showDave && (o.flow === 'yes' || o.mode === 'run')) { const ddz = z - dz, ddx = x - dx; if (Math.abs(ddz) < 6) { const push = Math.exp(-(ddz * ddz) / 8) * (o.mode === 'run' ? 2.2 * Math.sin(i + lt * 9) : 1.6); x += (ddx >= 0 ? 1 : -1) * push; } }
      scooterBB(x, z, dir, i, lt); if (dusk && dir < 0) groundGlow(x, z - 1.2, 'rgba(255,230,170,.55)', 2.2); if (dusk && dir > 0) groundGlow(x, z + .6, 'rgba(255,60,60,.35)', 1.2); }
    if (o.ev === 'yes') for (let i = 0; i < 8; i++) { const z = ((i * 13 + lt * 6) % 110) + 2; F3.billboard([ -1 + (i % 3), 0, z], (sx, sy, sc) => { const g = ctx.createRadialGradient(sx, sy - 90 * sc * 10, 0, sx, sy - 90 * sc * 10, 120 * sc * 10); g.addColorStop(0, 'rgba(120,255,190,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 1200 * sc, sy - 2100 * sc, 2400 * sc, 2400 * sc); }); }
    if (o.bus !== undefined) { const bt = +o.bus, bz = 42 - Math.max(0, lt - bt) * 13; if (lt > bt - 3) busBB(-1.6, Math.max(dz + 3.2, bz), lt); }
    if (nearT !== null && lt > nearT - .6 && lt < nearT + .6) { const p = (lt - nearT + .6) / 1.2; const zz = cam.pos[2] + 3.2 - p * 1.0; scooterBB(cam.pos[0] + 1.1 - p * .2, cam.pos[2] + 2.5 + (1 - p) * 9, -1, 7, lt); }
    if (o.hand === 'yes' && lt > .6) pose = 'wave';
    if (o.done !== undefined && lt > +o.done) { pose = 'cheer'; expr = 'joy'; }
    if (showDave && CHAR.dave) { F3.billboard([dx, 0, dz], (sx, sy, sc) => { const k = sc * 1000 / 100 * .52; person(sx, sy, k, CHAR.dave.spec, { t: lt, pose, expr, flip: false }); }); }
    if (o.copho && CHAR.copho) { const [a, b] = o.copho.split(',').map(Number); F3.billboard([a, .16, b], (sx, sy, sc) => person(sx, sy, sc * 1000 / 100 * .52, CHAR.copho.spec, { t: lt, pose: o.cophoPose || 'point', expr: 'smug' })); }
    F3.flush();
    // over-the-shoulder foreground (Dave's back, huge, soft)
    if (o.cam === 'ots') { ctx.save(); ctx.filter = `blur(${4 * u}px)`; const bx = W * .16, by = H * 1.02; ctx.fillStyle = '#2b7f7c'; ctx.beginPath(); ctx.ellipse(bx, by, W * .36, H * .18, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#f0c9a0'; ctx.beginPath(); ctx.ellipse(bx + 20 * u, by - H * .24, 110 * u, 130 * u, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#9b6a3a'; ctx.beginPath(); ctx.ellipse(bx + 20 * u, by - H * .31, 210 * u, 54 * u, -.05, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(bx + 20 * u, by - H * .34, 120 * u, 84 * u, 0, Math.PI, 0); ctx.fill(); ctx.restore(); }
    // letterbox for the big shots
    if (o.lb !== 'no') { const h = V() ? H * .055 : H * .08; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); }
    if (o.title) { const [a, b] = o.title.split('|'), at = +(o.titleAt || .4), p = Math.max(0, Math.min(1, (lt - at) / .35)), pop = p < 1 ? 1 + (1 - p) * .4 : 1; const y = H * (o.titleY ? +o.titleY : (V() ? .2 : .2));
      word(a, W / 2, y, { size: (V() ? 128 : 110) * pop, a: p, stroke: 18, rot: -.04 }); if (b) word(b, W / 2, y + (V() ? 105 : 92) * u, { size: V() ? 72 : 62, a: Math.max(0, Math.min(1, (lt - at - .35) / .3)), fill: '#ffd34a', stroke: 13, rot: -.04 }); }
  } };
})();
