/* =====================================================================
   CINEMA — the layer that turns "2D with motion" into film language.
   1. MOTION   second-order dynamics on every keyed move (anticipation, overshoot, settle)
   2. SHOTS    auto-framing by shot size (EWS…ECU) on a subject, angles, lead room,
               COVERAGE = edited cuts inside a scene (establishing → medium → close, shot/reverse)
   3. LENS     multiplane background: the place zooms less than the subject (depth), anchored to
               the ground line so feet never slide; depth-of-field blur on close shots
   4. LIGHT    per-scene key light: cast shadows + rim light on characters (time-of-day presets)
   5. FX       film transitions (fgwipe, lightleak, burn, inkbleed, tear, portal, glitch),
               impact frames, exhaust smoke, cinematic title variant
   Research notes: skill/references/research/*.md (cinematography, acting, VFX, pipeline, rendering).
   ===================================================================== */
'use strict';
// ---------------------------------------------------------------- 1. MOTION (Kleaner-style second-order filter)
// f = natural frequency (Hz), z = damping (ζ<1 overshoots), r = response (<0 anticipates)
const MOTION = { char: { f: 1.9, z: .52, r: -.18 }, prop: { f: 2.4, z: .48, r: -.05 }, text: { f: 2.8, z: .45, r: 0 } };
const MOTION_CH = ['x', 'dx', 'dy', 's', 'rot', 'jump'];
const MDEF = { x: .5, dx: 0, dy: 0, s: 1, rot: 0, jump: 0 };
function motionSample(L0, LV, lt) {
  if (!L0.keys || !L0.keys.length || L0.motion === 'rigid' || LV.motion === 'rigid' || !MOTION[LV.type]) return null;
  const key = W + 'x' + H; L0._tr = L0._tr || {}; let tr = L0._tr[key];
  if (!tr) {
    const ks = L0.keys.map(vmerge); const chans = MOTION_CH.filter(c => ks.some(k => typeof k[c] === 'number'));
    if (!chans.length) { L0._tr[key] = { none: 1 }; return null; }
    const P = { ...MOTION[LV.type], ...(typeof LV.motion === 'object' ? LV.motion : {}) };
    const k1 = P.z / (Math.PI * P.f), k2 = 1 / ((2 * Math.PI * P.f) ** 2), k3 = P.r * P.z / (2 * Math.PI * P.f);
    const t0 = sampleKeys(LV, L0.keys, 0); const st = {}; chans.forEach(c => { const v = t0[c] ?? MDEF[c]; st[c] = { y: v, yd: 0, xp: v, out: [v] }; });
    tr = L0._tr[key] = { chans, k1, k2, k3, n: 1, st };
  }
  if (tr.none) return null;
  const dt = 1 / 60, idx = Math.max(0, Math.round(lt * 60));
  while (tr.n <= idx) { const tg = sampleKeys(LV, L0.keys, tr.n * dt);
    for (const c of tr.chans) { const S = tr.st[c], x = tg[c] ?? MDEF[c]; const xd = (x - S.xp) / dt; S.xp = x; const k2s = Math.max(tr.k2, dt * dt / 2 + dt * tr.k1 / 2, dt * tr.k1); S.y += dt * S.yd; S.yd += dt * (x + tr.k3 * xd - S.y - tr.k1 * S.yd) / k2s; S.out.push(S.y); }
    tr.n++; }
  const o = {}; for (const c of tr.chans) o[c] = tr.st[c].out[idx]; return o;
}

// ---------------------------------------------------------------- 2. SHOTS & COVERAGE
// Shot sizes for big-head cartoon proportions (head ≈ 44% of body height), not live-action anatomy:
// h = frame height as a multiple of the character height (or of head diameter for CU/ECU), top = head top / eyes position
const SHOTS = { EWS: { subj: .1, feet: .8 }, WS: { subj: .42, feet: .86 }, FS: { body: 1.24, top: .1 }, MLS: { body: 1.06, top: .11 }, MS: { body: .9, top: .12 }, MCU: { body: .74, top: .13 }, CU: { head: 1.8, eye: .52 }, ECU: { head: 1.15, eye: .52 } };
const SHOT_W = { FS: 2.6, MLS: 2.25, MS: 1.95, MCU: 1.55, CU: 1.25, ECU: .9 }; // vertical frames are width-limited: chibi heads need room for shoulders, hands and props // minimum frame width in head-widths (9:16 is width-limited)
const SHOT_ORDER = ['EWS', 'WS', 'FS', 'MLS', 'MS', 'MCU', 'CU', 'ECU'];
const DOF_PX = { MS: 1.5, MCU: 3, CU: 5, ECU: 8 };
function subjectGeom(S, id, lt, place) {
  const L0 = (S.layers || []).find(l => l.type === 'char' && (l.id === id || l.key === id)) || (S.layers || []).find(l => l.type === 'char');
  if (!L0) return null; const LV = vmerge(L0); const L = sampleKeys(LV, L0.keys, lt); const ms = motionSample(L0, LV, lt); if (ms) Object.assign(L, ms);
  const u = U(), ch = CHAR[L.id], b = bodyOf(ch && ch.spec), s = (L.s || 1) * u;
  const x = (L.x ?? .5) * W + (L.dx || 0) * u; let feet = resolveY(L.y, place, L.dy || 0);
  const sit = ['sit', 'sitHold'].includes(L.pose) ? .82 : 1; let k = s * sit;
  let hc = feet - k * (b.leg + b.torso + b.head * .95);
  if (L.ride) { k = s * .92; hc = feet - 36 * s - k * (b.leg * .5 + b.torso + b.head * .95); }
  const hw = L.headwear !== undefined ? L.headwear : ch && ch.spec.headwear; const hwT = hw && (hw.type || hw); const extra = !hwT ? 0 : ['nonla', 'chef', 'daoturban', 'hmongwrap', 'flowerhmong', 'conehat_mini', 'crown', 'mandarin'].includes(hwT) ? .55 : .25;
  const hs = ch && ch.spec.hair && ch.spec.hair.style; const hair = ['bun', 'topknot', 'afro', 'spiky', 'curly', 'twin', 'longwavy', 'ponytail'].includes(hs) ? .3 : .12;
  return { x, feet, eyes: hc, top: hc - b.head * k * (1 + Math.max(extra, hair) + .06), headD: b.head * 2 * k, w: L.ride ? 230 * s : b.head * 2.3 * k, face: L.flip ? -1 : 1, hands: !!(L.hold || (L.pose && /stir|sip|eat|chopsticks|slurp|phone|selfie|wipe|bargain|count|pray|toast|paddle|row|pole|hold/.test(String(L.pose)))) };
}
function frameShot(g, size, opt = {}) {
  const V = H > W, sh = SHOTS[size] || SHOTS.MS; let frameH, camY; const bodyH = g.feet - g.top;
  const ang = opt.angle === 'low' ? -.04 : opt.angle === 'high' ? .05 : 0;
  if (sh.subj) { frameH = Math.max(H, bodyH / (V ? sh.subj * .8 : sh.subj)); camY = g.feet - sh.feet * frameH + frameH / 2; }
  else { frameH = sh.body ? bodyH * sh.body : g.headD * sh.head; const minW = g.w * (SHOT_W[size] || 1.4); frameH = Math.max(frameH, minW * H / W);
    camY = sh.body ? g.top - (sh.top + ang) * frameH + frameH / 2 : g.eyes - (sh.eye + ang) * frameH + frameH / 2; }
  const z = Math.max(1, H / frameH), frameW = W / z; const lead = (opt.lead ?? (V ? .03 : .1)) * (opt.face ?? g.face);
  return { x: (g.x + lead * frameW) / W, y: camY / H, z, rot: opt.angle === 'dutch' ? (opt.dutch ?? 9) * Math.PI / 180 * (opt.face ?? 1) : 0 };
}
function coverCam(S, lt, place, base) {
  const cov = S.coverage || (S.shot ? [{ t: 0, ...S.shot }] : null); if (!cov || !cov.length) return base;
  let c = cov[0]; for (const e of cov) if (lt >= e.t) c = vmerge(e);
  const g = subjectGeom(S, c.on, lt, place); if (!g) return base; S._shotSize = c.size;
  let size = c.size || 'MS'; if ((g.hands || S._hasProp) && ['MCU', 'CU', 'ECU'].includes(size) && !c.force) size = 'MS'; S._shotSize = size;
  // a talk with a prop: alternate a two-shot that shows host + prop with a medium on the host (prop established first)
  const kIdx = cov.filter(e => lt >= e.t).length - 1, twoShot = S._hasProp && !c.force && kIdx % 2 === 0;
  if (twoShot && ['MLS', 'MS', 'MCU', 'CU', 'ECU'].includes(size)) { size = H > W ? 'WS' : 'MLS'; S._shotSize = size; }
  else if (S._hasProp && ['MCU', 'CU', 'ECU'].includes(size)) { size = 'MS'; S._shotSize = size; }
  const f = frameShot(g, size, c); if (twoShot) f.x = H > W ? .51 : lerp(f.x, .5, .65); const creep = 1 + (c.creep ?? .02) * clamp((lt - (c.t || 0)) / 4);
  return { x: f.x, y: f.y, z: f.z * creep, rot: (base.rot || 0) + f.rot };
}

// ---------------------------------------------------------------- 3. LENS (multiplane background) & DOF
const LENS = { wide: .35, normal: .6, tele: .88, flat: 1 };
function bgCam(cam, place, lens) { const pb = LENS[lens] ?? LENS.normal; const zb = 1 + (cam.z - 1) * pb; if (!place || pb === 1) return { x: cam.x, y: cam.y, z: cam.z, rot: cam.rot };
  const g = place.ground(); // anchor: the ground line lands at the same screen y in both transforms
  let yb = (g - (g - cam.y * H) * cam.z / zb) / H; const hy = .5 / zb, hx = .5 / zb;
  yb = clamp(yb, hy, 1 - hy); const xb = clamp(cam.x, hx, 1 - hx); return { x: xb, y: yb, z: zb, rot: cam.rot }; }

// ---------------------------------------------------------------- 4. LIGHT (cast shadow + rim) on characters
const LIGHTS = {
  day: { a: .62, col: '#fff3d1', rim: .32, sh: .2, len: .55, sy: .28 },
  sunset: { a: .18, col: '#ffb35c', rim: .8, sh: .28, len: 1.6, sy: .22 },
  night: { a: 1.25, col: '#9fb4ff', rim: .55, sh: .16, len: .35, sy: .3 },
  studio: { a: .9, col: '#fffaf0', rim: .18, sh: .12, len: .25, sy: .3 },
};
let _lb = null;
function litBuffers() { if (!_lb || _lb[0].width !== W || _lb[0].height !== H) _lb = [mkCanvas(W, H), mkCanvas(W, H)]; return _lb; }
function drawLit(body, L, place, S, x, feetY, s) {
  const lk = S.light === 'none' || L.light === 'none' || L.screen ? null : (typeof S.light === 'object' ? { ...LIGHTS.day, ...S.light } : LIGHTS[S.light || (S.placeOpts && S.placeOpts.time) || (place && place.id === 'studio' ? 'studio' : place && place.night ? 'night' : 'day')] || LIGHTS.day);
  if (!lk || LINT.on) { body(); return; }
  const m = ctx.getTransform(); const pts = [[x - 330 * s, feetY - 560 * s], [x + 330 * s, feetY - 560 * s], [x - 330 * s, feetY + 40 * s], [x + 330 * s, feetY + 40 * s]].map(([a, b]) => [m.a * a + m.c * b + m.e, m.b * a + m.d * b + m.f]);
  let bx = Math.floor(Math.max(0, Math.min(...pts.map(p => p[0])))), by = Math.floor(Math.max(0, Math.min(...pts.map(p => p[1])))), bx1 = Math.ceil(Math.min(W, Math.max(...pts.map(p => p[0])))), by1 = Math.ceil(Math.min(H, Math.max(...pts.map(p => p[1]))));
  const bw = bx1 - bx, bh = by1 - by; if (bw < 8 || bh < 8) { body(); return; }
  const [A, B] = litBuffers(), ac = A.getContext('2d'), bc = B.getContext('2d');
  ac.setTransform(1, 0, 0, 1, 0, 0); ac.clearRect(bx, by, bw, bh); ac.setTransform(m); ac.globalAlpha = 1;
  const main = ctx, alpha = ctx.globalAlpha, lw = LW; ctx = ac; try { body(); } finally { ctx = main; LW = lw; }
  const lx = Math.cos(lk.a), ly = Math.sin(lk.a); // direction the light travels (0 = to the right, π/2 = down)
  const fs_ = [m.a * x + m.c * feetY + m.e, m.b * x + m.d * feetY + m.f]; const zs = Math.hypot(m.a, m.b);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha;
  // cast shadow: silhouette sheared along the light, flattened onto the ground
  if (!L.air && !L.noShadow && L.stage !== 'boat' && lk.sh > 0) {
    bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(bx, by, bw, bh); bc.globalCompositeOperation = 'source-over'; bc.drawImage(A, bx, by, bw, bh, bx, by, bw, bh); bc.globalCompositeOperation = 'source-in'; bc.fillStyle = '#1e1630'; bc.fillRect(bx, by, bw, bh); bc.globalCompositeOperation = 'source-over';
    const shx = lx * lk.len, sy = lk.sy, fy = fs_[1]; ctx.save(); ctx.globalAlpha = alpha * lk.sh; ctx.setTransform(1, 0, -shx, sy, shx * fy, fy * (1 - sy)); ctx.drawImage(B, bx, by, bw, bh, bx, by, bw, bh); ctx.restore(); }
  ctx.drawImage(A, bx, by, bw, bh, bx, by, bw, bh);
  // rim light: the silhouette minus itself shifted away from the light = a crescent on the lit edge
  if (lk.rim > 0) { const w = Math.max(2, 5 * zs * (U() / 1)); bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(bx, by, bw, bh); bc.globalCompositeOperation = 'source-over'; bc.drawImage(A, bx, by, bw, bh, bx, by, bw, bh); bc.globalCompositeOperation = 'destination-out'; bc.drawImage(A, bx, by, bw, bh, bx + lx * w, by + ly * w, bw, bh); bc.globalCompositeOperation = 'source-in'; bc.fillStyle = lk.col; bc.fillRect(bx, by, bw, bh); bc.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = alpha * lk.rim; ctx.drawImage(B, bx, by, bw, bh, bx, by, bw, bh); }
  ctx.restore();
}

// ---------------------------------------------------------------- 5. FX: transitions
const _fxc = []; function fxCanvas(i) { if (!_fxc[i] || _fxc[i].width !== W || _fxc[i].height !== H) _fxc[i] = mkCanvas(W, H); return _fxc[i]; }
// foreground element sweeps across and hides the cut (the most cinematic transition)
FX.fgwipe = (A, B, p, t) => { const e = E.inOut(p), u = U(); ctx.drawImage(p < .5 ? A : B, 0, 0); const x = lerp(W * 1.3, -W * .9, e);
  ctx.save(); ctx.translate(x, 0); ctx.filter = 'blur(' + (6 * Math.sin(p * Math.PI) * u).toFixed(1) + 'px)';
  const g = ctx.createLinearGradient(-W * .5, 0, W * .6, 0); g.addColorStop(0, '#2a1d14'); g.addColorStop(1, '#130d09'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-W * .45, -20); for (let y = 0; y <= H + 40; y += 40) ctx.lineTo(-W * .45 + Math.sin(y * .01) * 30 * u, y); ctx.lineTo(W * .6 + Math.sin(H * .01) * 30 * u, H + 40); for (let y = H + 40; y >= -20; y -= 40) ctx.lineTo(W * .6 + Math.sin(y * .013 + 1) * 40 * u, y); ctx.closePath(); ctx.fill();
  ctx.filter = 'none'; ctx.globalAlpha = .5; line(W * .6 - 8 * u, 0, W * .6 - 8 * u, H, 10 * u, '#ffcf8a'); ctx.restore(); };
// warm light leak: the cut hides under a bloom of orange/magenta light
FX.lightleak = (A, B, p, t) => { ctx.drawImage(A, 0, 0); ctx.save(); ctx.globalAlpha = E.inOut(clamp((p - .2) / .6)); ctx.drawImage(B, 0, 0); ctx.restore(); const a = Math.sin(p * Math.PI) * .6; ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (const [cx, cy, r, c] of [[.2 + p * .6, .3, .9, '255,138,61'], [.85 - p * .5, .7, .8, '255,61,127'], [.5, .5 + (p - .5) * .4, .7, '255,220,140']]) { const g = ctx.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, r * Math.max(W, H)); g.addColorStop(0, `rgba(${c},${.95 * a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } ctx.restore(); };
// film burn: a noisy luma threshold eats the frame, glowing edge
const _NM = {}; function noiseMap(seed, kind) { const k = 'nm' + seed + kind; if (_NM[k]) return _NM[k]; const w = 160, h = 90, c = mkCanvas(w, h), g = c.getContext('2d'), im = g.createImageData(w, h), r = rng(seed);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v; if (kind === 'blobs') { v = 0; for (let i = 0; i < 5; i++) { const bx = (hash(seed * 7 + i) * w), by = (hash(seed * 13 + i) * h); v = Math.max(v, 1 - Math.hypot(x - bx, (y - by) * 1.6) / (w * .45)); } v = v * .75 + .25 * (fbm(x * .08 + seed) * .5 + .5); } else v = fbm(x * .05 + seed) * .5 + .5 + fbm(y * .06 + seed * 3) * .3 + fbm((x + y) * .03) * .25; const q = (y * w + x) * 4; const b = clamp(v) * 255; im.data[q] = im.data[q + 1] = im.data[q + 2] = b; im.data[q + 3] = 255; }
  g.putImageData(im, 0, 0); const d = g.getImageData(0, 0, w, h).data; const lum = new Float32Array(w * h); for (let i = 0; i < w * h; i++) lum[i] = d[i * 4] / 255; return (_NM[k] = { w, h, lum }); }
function lumaMask(nm, thr, soft) { const sc = mkLumaCanvas(nm); const im = sc.g.createImageData(nm.w, nm.h);
  for (let i = 0; i < nm.lum.length; i++) { const a = clamp((thr - nm.lum[i]) / soft + .5); im.data[i * 4 + 3] = a * 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = 255; }
  sc.g.putImageData(im, 0, 0); return sc.c; }
let _lc = null; function mkLumaCanvas(nm) { if (!_lc || _lc.c.width !== nm.w) { const c = mkCanvas(nm.w, nm.h); _lc = { c, g: c.getContext('2d') }; } return _lc; }
function lumaWipe(A, B, p, seed, kind, soft, edge) { const nm = noiseMap(seed, kind); const thr = lerp(-soft, 1 + soft, E.inOut(p)); ctx.drawImage(A, 0, 0);
  const M = fxCanvas(2), mg = M.getContext('2d'); mg.setTransform(1, 0, 0, 1, 0, 0); mg.clearRect(0, 0, W, H); mg.imageSmoothingQuality = 'high'; mg.drawImage(lumaMask(nm, thr, soft), 0, 0, W, H); mg.globalCompositeOperation = 'source-in'; mg.drawImage(B, 0, 0); mg.globalCompositeOperation = 'source-over'; ctx.drawImage(M, 0, 0);
  if (edge) { mg.clearRect(0, 0, W, H); mg.drawImage(lumaMask(nm, thr + soft * .9, soft * .5), 0, 0, W, H); mg.globalCompositeOperation = 'destination-out'; mg.drawImage(lumaMask(nm, thr, soft * .5), 0, 0, W, H); mg.globalCompositeOperation = 'source-in'; mg.fillStyle = edge; mg.fillRect(0, 0, W, H); mg.globalCompositeOperation = 'source-over'; ctx.save(); ctx.globalCompositeOperation = edge === C.ink ? 'source-over' : 'lighter'; ctx.drawImage(M, 0, 0); ctx.restore(); } }
FX.burn = (A, B, p) => lumaWipe(A, B, p, 4, 'noise', .07, '#ffb347');
FX.inkbleed = (A, B, p) => lumaWipe(A, B, p, 9, 'blobs', .05, C.ink);
FX.watercolor = (A, B, p) => { lumaWipe(A, B, p, 12, 'noise', .14, null); };
// torn paper: A rips apart along a jagged line and the halves fall away
FX.tear = (A, B, p) => { const e = E.in(p), u = U(); ctx.drawImage(B, 0, 0); const r = rng(5), pts = []; for (let y = -20; y <= H + 20; y += 28 * u) pts.push([W * .5 + (r() - .5) * 70 * u, y]);
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * e * W * .6, e * e * H * .3); ctx.rotate(sd * e * .12); ctx.beginPath(); ctx.moveTo(sd < 0 ? -40 : W + 40, -40); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(sd < 0 ? -40 : W + 40, H + 40); ctx.closePath(); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#fff8ea'; ctx.fill(); ctx.restore(); ctx.clip(); ctx.drawImage(A, 0, 0); ctx.restore(); } };
// portal / zoom-through: the camera flies into a circle on the subject (window, bowl, eye)
FX.portal = (A, B, p, t, c) => { const cx = c ? c[0] : W / 2, cy = c ? c[1] : H * .45; const e = E.in(p), s = 1 + 26 * e * e * e; ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); ctx.drawImage(A, 0, 0);
  const r = Math.min(W, H) * .09; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); const bs = r * 2 / Math.min(W, H) * 1.2; ctx.translate(cx, cy); ctx.scale(bs, bs); ctx.drawImage(B, -W / 2, -H / 2); ctx.restore();
  if (p > .85) { ctx.save(); ctx.globalAlpha = (p - .85) / .15; ctx.drawImage(B, 0, 0); ctx.restore(); } ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI) * .5; zoomStreaks(cx, cy, p); ctx.restore(); };
function zoomStreaks(cx, cy, p) { const r = rng(Math.floor(p * 30)), u = U(); for (let i = 0; i < 40; i++) { const a = r() * TAU, d0 = (200 + r() * 600) * u; line(cx + Math.cos(a) * d0, cy + Math.sin(a) * d0, cx + Math.cos(a) * (d0 + 300 * u), cy + Math.sin(a) * (d0 + 300 * u), 3 * u, 'rgba(255,255,255,.8)'); } }
// glitch: band displacement + RGB split
FX.glitch = (A, B, p, t) => { const src = (p < .5) ^ (Math.floor(p * 18) % 3 === 0) ? A : B, r = rng(Math.floor(p * 40) + 1), u = U(); const amt = Math.sin(p * Math.PI);
  for (let y = 0; y < H;) { const h = (10 + r() * 60) * u, dx = (r() < .35 ? (r() - .5) * 120 * u * amt : 0); ctx.drawImage(src, 0, y, W, h, dx, y, W, h); y += h; }
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .35 * amt; ctx.drawImage(src, 8 * u * amt, 0); ctx.fillStyle = 'rgba(255,0,60,.0)'; ctx.restore(); };
TRANSITIONS.push('fgwipe', 'lightleak', 'burn', 'inkbleed', 'watercolor', 'tear', 'portal', 'glitch');

// ---------------------------------------------------------------- FX: impact frame & exhaust
// impact: 1 frame inverted + 2 frames high-contrast, then shake (pair with a shake entry)
function impactFrame(lt, at) { const d = lt - at; if (d < 0 || d > 3 / 30) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (d < 1 / 30) { ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); } else { ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#888'; ctx.globalAlpha = .9; ctx.fillRect(0, 0, W, H); } ctx.restore(); }
// toon exhaust puffs behind a riding character (world space, on 2s)
function exhaust(x, y, s, t, speed = 1) { const tq = Math.floor(t * 15) / 15; const r = rng(7); for (let i = 0; i < 7; i++) { const life = ((tq * 1.6 + i / 7) % 1); const px = x - (40 + life * 420 * speed) * s, py = y - (30 + life * 40 + r() * 20) * s; const rad = (10 + life * 34) * s; ctx.save(); ctx.globalAlpha *= (1 - life) * .55; sCirc(px, py, rad, '#d9d6cf', { lw: 3 * s }); ctx.restore(); } }

// ---------------------------------------------------------------- cinematic title (tracking settle + light sweep)
var SB_TITLE_FILM = (lt, lines0, o) => { const u = U(), V = H > W; const lines = lines0.flatMap(l => { if (!V || l.length <= 14 || !l.includes(' ')) return [l]; const m = l.length / 2; let best = -1; for (let i = 0; i < l.length; i++) if (l[i] === ' ' && (best < 0 || Math.abs(i - m) < Math.abs(best - m))) best = i; return [l.slice(0, best), l.slice(best + 1)]; }); ctx.fillStyle = o.bg || '#140f0c'; ctx.fillRect(0, 0, W, H);
  if (o.place && PLACE[o.place]) { ctx.save(); ctx.globalAlpha = .55; const z = 1.05 + lt * .015; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); PLACE[o.place].draw(lt, { t: lt, time: o.time || 'sunset' }); ctx.restore(); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(10,6,4,.7)'); g.addColorStop(.5, 'rgba(10,6,4,.25)'); g.addColorStop(1, 'rgba(10,6,4,.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const size = Math.min(V ? 130 : 170, (W * .8) / (Math.max(...lines.map(l => l.length)) * .62 * u)) * u;
  lines.forEach((l, i) => { const p = E.out5(clamp((lt - .2 - i * .35) / 1.4)); const ls = lerp(.45, .08, p) * size; const y = H * .44 + (i - (lines.length - 1) / 2) * size * 1.05;
    const oc = fxCanvas(4), og = oc.getContext('2d'); og.setTransform(1, 0, 0, 1, 0, 0); og.clearRect(0, y - size, W, size * 2); const main = ctx; ctx = og; T(l, W / 2, y + (1 - p) * 30 * u, { size, fill: i === lines.length - 1 && lines.length > 1 ? C.yel : '#fff6e6', lw: 0, ls, shadow: 0 });
    const sw = clamp((lt - 1.2 - i * .25) / .9); if (sw > 0 && sw < 1) { og.globalCompositeOperation = 'source-atop'; const sx = lerp(W * .1, W * .9, sw), g = og.createLinearGradient(sx - 120 * u, 0, sx + 120 * u, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); og.fillStyle = g; og.fillRect(0, y - size, W, size * 2); og.globalCompositeOperation = 'source-over'; }
    ctx = main; ctx.save(); ctx.globalAlpha = clamp(p * 1.5); ctx.drawImage(oc, 0, y - size, W, size * 2, 0, y - size, W, size * 2); ctx.restore(); });
  if (o.sub) T(o.sub.toUpperCase(), W / 2, H * .44 + lines.length * size * .62 + 40 * u, { size: 34 * u, font: 'body', weight: 800, fill: '#e8d8bc', lw: 0, ls: 10 * u, alpha: clamp((lt - 1.6) * 2) });
  ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = '#000'; const bar = (V ? .06 : .1) * H * E.out(clamp(lt / .8)); ctx.fillRect(0, 0, W, bar); ctx.fillRect(0, H - bar, W, bar); ctx.restore(); };

// speech bubbles that follow the speaker through every cut: above the head, or beside it on close shots
function followAnchor(o, S, lt, place) { const g = subjectGeom(S, o.follow, lt, place); if (!g) return; const c = S._cam, u = U(); const sx = W / 2 + (g.x - c.x * W) * c.z, top = H / 2 + (g.top - c.y * H) * c.z, mouth = H / 2 + (g.eyes + g.headD * .3 - c.y * H) * c.z, hd = g.headD * c.z;
  const size = o.size || 46, lines = String(o.text).split('\n'); const bw = (Math.max(...lines.map(l => textW(l, size))) + 130) * u, bh = (lines.length * size * 1.15 + 80) * u; const V = H > W, mt = V ? H * .17 : H * .06;
  const fx0 = sx - hd * .5, fx1 = sx + hd * .5, fy0 = top + hd * .1, fy1 = top + hd * 1.05; const fitX = x => clamp(x, bw / 2 + 20 * u, W - bw / 2 - 20 * u), fitY = y => clamp(y, mt + bh / 2, H * .72);
  const hits = (x, y) => !(x + bw / 2 < fx0 || x - bw / 2 > fx1 || y + bh / 2 < fy0 || y - bh / 2 > fy1); const side = sx > W / 2 ? -1 : 1;
  const cands = [[sx, top - bh * .62], [sx + side * (hd * .55 + bw * .55), top + hd * .15], [sx, fy1 + bh * .62], [W / 2, mt + bh / 2]].map(([x, y]) => [fitX(x), fitY(y)]);
  let [x, y] = cands.find(([x, y]) => !hits(x, y)) || cands[3]; o.x = x; o.y = y; let tx = (sx - x) / u, ty = (mouth - y) / u; const tl = Math.hypot(tx, ty), mx = (bh / u) * .5 + 90; if (tl > mx) { tx *= mx / tl; ty *= mx / tl; } o.tail = [tx, ty]; }

// lip sync: mouth openness from the real voice-over envelope (tools/voice.py → envs.json), on 2s like hand-drawn mouths
function mouthAt(L, lt) { if (!(L.talk > .5) || L.talkVo === undefined || !window.VOENV) return undefined; const e = window.VOENV[Math.round(L.talkVo)]; if (!e) return undefined; const f = Math.floor((lt - (L.talkT0 || 0)) * 15) * 2; return f >= 0 && f < e.length ? e[f] : 0; }
function visemeAt(L, lt) { if (!(L.talk > .5) || L.talkVo === undefined || !window.VOVIS) return undefined; const v = window.VOVIS[Math.round(L.talkVo)]; if (!v) return undefined; const f = Math.floor((lt - (L.talkT0 || 0)) * 15); return f >= 0 && f < v.length ? v[f] : 'X'; }
