/* =====================================================================
   TIMELINE — turns an EPISODE description into frames.
   An episode is plain data (JSON-compatible) + optional custom functions.

   EPISODE = {
     title, fps: 30, finish: { grain, vignette },
     scenes: [{
       id, dur,                                  // seconds
       transition: { type: 'whip'|'ink'|'iris'|'flash'|'fade'|'slide'|'zoom'|'paper'|'brand'|'cut', dur: .5 },
       place: 'hagiang', placeOpts: { time: 'day' }, scroll: [{ t: 0, v: 0 }, { t: 5, v: 2000 }],
       cam: [{ t: 0, x: .5, y: .5, z: 1 }, { t: 4, z: 1.3, ease: 'out' }],
       layers: [ { type: 'char', id: 'dave', x: .4, y: 'ground', s: 1, pose: 'wave', expr: 'happy',
                   keys: [{ t: 2, x: .6, pose: 'walk' }], in: { type: 'drop', at: 0 } },
                 { type: 'prop', name: 'pho', x: .6, y: 'ground', s: .8 },
                 { type: 'ui', name: 'price', at: 1, o: { x: .7, y: .3, vnd: '40.000₫', usd: '$1.60' } },
                 { type: 'map', view: [{ t: 0, lon: 106, lat: 16, k: 46 }, { t: 3, lon: 105, lat: 23, k: 600 }], o: {...} },
                 { type: 'fn', draw: (lt, S) => {} } ],
       captions: [[0.2, 2.5, 'This is *Vietnam*.']],
       shakes: [[1.2, 14, .4]], particles: [{ type: 'confetti', t0: 1, t1: 3 }],
       sfx: [[1.2, 'whoosh']],                  // cue sheet for the sound editor
       v: { ...overrides for 9:16 }
     }]
   }
   Positions: x,y are fractions of the stage (0..1). y: 'ground' = place ground line; dy in units.
   Every object may carry `v: {...}` with vertical-only overrides.
   ===================================================================== */
'use strict';
const VERT = () => H > W;
const isObj = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v !== 'function';
function deepMerge(a, b) { const out = { ...a }; for (const k of Object.keys(b)) out[k] = isObj(a[k]) && isObj(b[k]) ? deepMerge(a[k], b[k]) : b[k]; return out; }
function vmerge(o) { if (!isObj(o)) return o; let out = { ...o }; if (VERT() && o.v) out = deepMerge(out, o.v); delete out.v; return out; }
function sampleKeys(base, keys, t) {
  const out = { ...base }; if (!keys || !keys.length) return out;
  const ks = keys.map(vmerge).sort((a, b) => a.t - b.t);
  const props = new Set(); ks.forEach(k => Object.keys(k).forEach(p => { if (p !== 't' && p !== 'ease') props.add(p); }));
  for (const p of props) {
    let prev = { t: 0, [p]: base[p] }, next = null;
    for (const k of ks) { if (!(p in k)) continue; if (k.t <= t) prev = k; else { next = k; break; } }
    const a = prev[p];
    if (next && typeof a === 'number' && typeof next[p] === 'number') { const t0 = Math.max(prev.t, next.t - (next.dur ?? 1e9)); const f = inv(t0, next.t, t); out[p] = lerp(a, next[p], ease(next.ease || 'inOut')(f)); }
    else out[p] = a;
  }
  return out;
}
function resolveY(y, place, dy = 0) { const u = U(); let v; if (y === 'ground' || y === undefined) v = place ? place.ground() : H * .85; else if (typeof y === 'string' && y.startsWith('ground')) v = (place ? place.ground() : H * .85) + parseFloat(y.slice(6) || 0) * H; else v = y * H; return v + dy * u; }
// entrance / exit modifiers → { dx, dy, sc, a, sq }
function inOut(L, lt) {
  const m = { dx: 0, dy: 0, sc: 1, a: 1, sq: 0 }; const u = U();
  const apply = (spec, entering) => { if (!spec) return; const s = vmerge(spec); const at = s.at ?? (entering ? 0 : 1e9), d = s.dur ?? (s.type === 'drop' ? .45 : .35);
    let p = entering ? inv(at, at + d, lt) : 1 - inv(at, at + d, lt); if (entering && lt < at) p = 0; if (!entering && lt < at) return;
    switch (s.type) {
      case 'pop': m.sc *= entering ? E.back(p) : E.in(p) ; break;
      case 'fade': m.a *= p; break;
      case 'drop': if (entering) { m.dy += lerp(-H * 1.1, 0, E.in(p)); m.sq += wob(lt, at + d, 7, 26) * .9; } else m.dy += lerp(H, 0, E.in(p)); break;
      case 'up': m.dy += lerp(H * .7, 0, E.out5(p)); break;
      case 'slideL': m.dx += lerp(-W * .8, 0, E.out5(p)); break;
      case 'slideR': m.dx += lerp(W * .8, 0, E.out5(p)); break;
      case 'zoom': m.sc *= lerp(3, 1, E.out5(p)); m.a *= clamp(p * 3); break;
      case 'slap': m.sc *= entering ? lerp(1.45, 1, E.out5(p)) : 1; m.a *= clamp(p * 4); break;
    }
    if (entering && s.type === 'drop' && p >= 1 && lt - at - d < .7) m.dust = (lt - at - d) / .6;
  };
  apply(L.in, true); apply(L.out, false); return m;
}
function drawLayer(L0, lt, S, place) {
  const LV0 = vmerge(L0); const L = sampleKeys(LV0, L0.keys, lt); { const ms = motionSample(L0, LV0, lt); if (ms) Object.assign(L, ms); } const u = U(); const io = inOut(L0, lt);
  if (L.hide || io.a <= 0) return;
  let x = (L.x ?? .5) * W + io.dx + (L.dx || 0) * u, y = resolveY(L.y, place, L.dy || 0) + io.dy;
  // depth: parallax against camera pans/orbits, dolly spread, depth-of-field blur
  const depth = L.depth; let dscale = 1;
  if (depth !== undefined && S._cam && !L.screen) { x += (S._cam.x - .5) * W * (1 - depth) * .9 + (S._orbit || 0) * W * (depth - 1) * 2.2; y += (S._cam.y - .5) * H * (1 - depth) * .9;
    if (S._dolly) { x += (x - W / 2) * S._dolly * (depth - 1) * .8; dscale = 1 + S._dolly * (depth - 1) * .5; } }
  // automatic secondary motion for characters: lean into movement, auto-walk when travelling
  let autoRot = 0, autoPose = null;
  if (L.type === 'char' && L0.keys && !L.ride) { const pr = sampleKeys(vmerge(L0), L0.keys, Math.max(0, lt - .05)); const vx = ((L.x ?? .5) - (pr.x ?? .5)) * W / .05 / u; autoRot = clamp(vx * .00012, -.12, .12) * (L.flip ? -1 : 1); if (L.autoWalk !== false && Math.abs(vx) > 60 && ['stand', undefined].includes(L.pose)) autoPose = Math.abs(vx) > 900 ? 'run' : 'walk'; }
  ctx.save(); ctx.globalAlpha *= (L.alpha ?? 1) * io.a;
  let blurPx = 0; if ((depth !== undefined || L.blur) && !L.screen) blurPx = (L.blur || 0) * u + (depth !== undefined ? dofBlur(depth, S._focus ?? 1) : 0);
  if (dscale !== 1) { ctx.translate(x, y); ctx.scale(dscale, dscale); ctx.translate(-x, -y); }
  const y0 = y;
  const body = () => {
  switch (L.type) {
    case 'char': { const ch = CHAR[L.id]; if (!ch) break; const spec = L.spec ? { ...ch.spec, ...L.spec } : ch.spec;
      LINT.entering = Math.abs(io.dx) + Math.abs(io.dy) > 1 || io.sc < .9; const stg = stageUnder(L, place, x, y0, (L.s || 1) * u * io.sc, lt); const y = y0 + stg.dy; if (LINT.on) lintFeet(L, place, x, y, io, stg.stage);
      if (L.ride) { // on a motorbike
        const bs = (L.s || 1) * u * io.sc, sp = L.spin ?? lt * (L.speed ?? 1) * 14, bump = Math.abs(Math.sin(lt * 9)) * 4 * (L.speed ?? 1) * bs;
        ctx.save(); if (L.flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); } if (L.lean) { ctx.translate(x, y); ctx.rotate(L.lean); ctx.translate(-x, -y); }
        if ((L.speed ?? 1) > .2 && L.exhaust !== false) exhaust(x - 150 * bs, y, bs, lt, L.speed ?? 1);
        drawProp(L.vehicle || 'moto', x, y, bs, { spin: sp, color: L.bikeColor, rack: L.rack }, lt);
        person(x - 40 * bs, y - 36 * bs - bump, bs * .92, spec, { t: lt, pose: 'ride', expr: L.expr, look: L.look || [1, 0], headwear: L.headwear, wind: L.wind ?? 1, noShadow: 1, shades: L.shades, talk: L.talk, mouthOpen: mouthAt(L, lt), viseme: visemeAt(L, lt) });
        ctx.restore(); }
      else person(x, y, (L.s || 1) * u * io.sc, spec, { t: lt + (L.tOff || 0), pose: autoPose || L.pose, expr: L.expr, look: L.look, flip: L.flip, hold: L.hold, holdScale: L.holdScale, holdOpts: L.holdOpts, squash: (L.squash || 0) + io.sq, rot: (L.rot || 0) + autoRot, headwear: L.headwear, shades: L.shades, wind: L.wind, jump: L.jump ? -L.jump : 0, headRot: (L.headRot || 0) + ((L.talk > .5 && window.VOENV) ? ((mouthAt(L, lt) ?? .4) - .4) * .07 : 0), noShadow: L.noShadow, eyeScale: L.eyeScale, talk: L.talk, mouthOpen: mouthAt(L, lt), viseme: visemeAt(L, lt), yaw: L.yaw, view: L.view });
      if (io.dust !== undefined) dustPuff(x, y, io.dust, (L.s || 1) * u * 1.3);
      break; }
    case 'image': drawSticker(L.img, x, y, (L.h || 420) * u * (L.s || 1) * io.sc, { style: L.style, rot: L.rot, wobble: L.wobble, anchor: L.anchor, label: L.label, dur: S.dur, z0: L.z0, z1: L.z1, focus: L.focus }, lt); break;
    case 'prop': if (LINT.on) lintProp(L, place, x, y, io); drawProp(L.name, x, y, (L.s || 1) * u * io.sc, { ...(L.opts || {}), flip: L.flip, rot: L.rot }, lt); break;
    case 'ui': { const o = { ...(L.o || {}) }; if (typeof o.x === 'number' && o.x <= 2) o.x = o.x * W; if (typeof o.y === 'number' && o.y <= 2) o.y = o.y * H; o.at = o.at ?? L.at ?? 0;
      if (o.follow && S._cam) followAnchor(o, S, lt, place);
      let p = L.in ? io.sc : pop(lt, o.at, .35); if (L.until !== undefined) p *= 1 - E.in(inv(L.until, L.until + .25, lt)); if ((p > 0 || L.always) && UI[L.name]) UI[L.name](p, o, lt); break; }
    case 'map': { const v = sampleKeys(L.view[0], L.view.slice(1), lt); const o = { ...(L.o || {}), ...v, t: lt }; if (L.camLerp) { const p = ease(L.camLerp.ease || 'inOut')(inv(L.camLerp.t0, L.camLerp.t1, lt)); Object.assign(o, mapCamLerp(L.camLerp.a, L.camLerp.b, p)); } if (L.routeP) o.routeP = sampleKeys({ p: L.routeP[0].p }, L.routeP.slice(1), lt).p; S._map = vnMap(o); S._mapO = o; break; }
    case 'particles': PARTICLES[L.name] && PARTICLES[L.name](lt, L.a ?? 1, L.seed || 1); break;
    case 'text': T(L.text, x, y, { size: (L.size || 80) * u, fill: L.fill || '#fff', scale: io.sc * (L.scale ?? 1), rot: L.rot, font: L.font || 'display', shadow: (L.shadow ?? 6) * u, lw: L.lw !== undefined ? L.lw * u : undefined, align: L.align }); break;
    case 'fn': L.draw(lt, S, { x, y, u, io }); break;
  }
  };
  // smear / multiples: fast-moving characters & props leave 2 fading copies along their path
  let gx = 0, gy = 0; if (LOOK.smear && (L.type === 'char' || L.type === 'prop') && (L0.keys || L0.in)) { const pr = sampleKeys(vmerge(L0), L0.keys, Math.max(0, lt - 1 / 30)); const io2 = inOut(L0, Math.max(0, lt - 1 / 30)); const px = (pr.x ?? .5) * W + io2.dx + (pr.dx || 0) * u, py = resolveY(pr.y, place, pr.dy || 0) + io2.dy; gx = x - px; gy = y - py; }
  const sp = Math.hypot(gx, gy); if (sp > 26 * u && sp < W * .5) { for (const [k, a] of [[1.6, .16], [.8, .3]]) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(-gx * k, -gy * k); body(); ctx.restore(); } }
  if (blurPx > .6) blurred(body, blurPx); else if (L.type === 'char' && !L.screen && CHAR[L.id]) drawLit(body, L, place, S, x, y0, (L.s || 1) * u * io.sc); else body();
  ctx.restore();
}
// fast depth-of-field: draw the layer at quarter resolution, blur that small image, upscale
let _bq = null;
function blurred(body, px) {
  const q = .25, w = Math.ceil(W * q), h = Math.ceil(H * q);
  if (!_bq || _bq[0].width !== w || _bq[0].height !== h) _bq = [mkCanvas(w, h), mkCanvas(w, h)];
  const [a, b] = _bq, ac = a.getContext('2d'), bc = b.getContext('2d'); const m = ctx.getTransform(), alpha = ctx.globalAlpha;
  ac.setTransform(1, 0, 0, 1, 0, 0); ac.clearRect(0, 0, w, h); ac.setTransform(m.a * q, m.b * q, m.c * q, m.d * q, m.e * q, m.f * q);
  const main = ctx; ctx = ac; const lw = LW; try { body(); } finally { ctx = main; LW = lw; }
  bc.setTransform(1, 0, 0, 1, 0, 0); bc.clearRect(0, 0, w, h); bc.filter = `blur(${(px * q).toFixed(2)}px)`; bc.drawImage(a, 0, 0); bc.filter = 'none';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(b, 0, 0, W, H); ctx.restore();
}
function drawSceneContent(S0, lt) {
  const S = vmerge(S0); S._lt = lt; LW = 6;
  if (S.render) { LINT.tag = 'world'; S.render(lt, S); if (S.fg && typeof drawFg === 'function') drawFg(S.fg, lt, { x: .5, y: .5, z: 1 + lt * .01, rot: 0 }, S, null); LINT.tag = 'text'; if (S.post) S.post(lt, S); return; }
  const place = S.place ? PLACE[S.place] : null;
  S._shotSize = undefined; const base = coverCam(S, lt, place, sampleKeys({ x: .5, y: .5, z: 1, rot: 0 }, S.cam, lt));
  const cam = applyMoves(S, base, lt, place); S._cam = cam;
  const fill = c => { const r = Math.abs(c.rot); if (r > 0) c.z = Math.max(c.z, Math.cos(r) + Math.sin(r) * Math.max(W / H, H / W)); c.z = Math.max(c.z, 1); const hx = .5 / c.z, hy = .5 / c.z; c.x = clamp(c.x, hx, 1 - hx); c.y = clamp(c.y, hy, 1 - hy); };
  if (!S.freeCam) fill(cam); // keep the frame filled: zoom enough to hide rotated corners, then clamp the centre inside the stage
  const camT = c => { ctx.translate(W / 2, H / 2); ctx.rotate(c.rot); ctx.scale(c.z, c.z); ctx.translate(-c.x * W, -c.y * H); };
  // background plate: multiplane lens (zooms less than the subject, anchored at the ground line) + depth of field on close shots
  if (place) { const bc = bgCam(cam, place, S.lens || 'normal'); if (S._vert) { const [va, vp] = S._vert; bc.z *= (1 + va * (1 - vp)) / (1 + va * vp) * 1.0; bc.z = Math.max(1, bc.z); } if (!S.freeCam) fill(bc); ctx.save(); camT(bc);
    const sc = S.scroll ? sampleKeys({ v: S.scroll[0].v }, S.scroll.slice(1), lt).v * U() : 0;
    const plate = () => { LINT.tag = 'bg'; place.draw(lt, { ...(S.placeOpts || {}), t: lt, scroll: sc }); if (sceneNeedsRoad(S, place)) drawRoadBand(place.ground(), sc); LINT.tag = 'text'; };
    const dof = S.dof === false ? 0 : (S.dof ?? DOF_PX[S._shotSize] ?? 0) * U(); if (dof > .6 && !LINT.on) blurred(plate, dof); else plate(); ctx.restore(); }
  ctx.save(); camT(cam);
  if (S.bg) S.bg(lt, S);
  drawExtras(S, place, lt);
  const layers = (S.layers || []).filter(l => !vmerge(l).screen).sort((a, b) => (a.z || 0) - (b.z || 0));
  for (const L of layers) { LINT.tag = L.type === 'map' ? 'bg' : 'world'; drawLayer(L, lt, S, place); }
  ctx.restore();
  if (S.weather) drawWeather(S.weather, lt, place);
  if (S.rays && typeof drawRaysFx === 'function') drawRaysFx(S, lt, place);
  if (S.fg && typeof drawFg === 'function') drawFg(S.fg, lt, cam, S, place);
  for (const L of (S.layers || []).filter(l => vmerge(l).screen).sort((a, b) => (a.z || 0) - (b.z || 0))) { LINT.tag = 'ui'; drawLayer(L, lt, S, place); }
  LINT.tag = 'text';
  for (const pt of (S.particles || [])) if (lt >= (pt.t0 || 0) && lt <= (pt.t1 ?? 1e9)) PARTICLES[pt.type] && PARTICLES[pt.type](lt, pt.a ?? 1, pt.seed || 1);
  for (const it of (S.impacts || [])) impactFrame(lt, it);
  if (S.post) S.post(lt, S);
}
// ---------------------------------------------------------------- episode runner
let EP = null, _starts = [], _buf = null;
function loadEpisode(ep) { EP = ep; _starts = []; let t = 0; for (const s of ep.scenes) { _starts.push(t); t += s.dur; } EP._dur = t; return t; }
function episodeDuration() { return EP ? EP._dur : 0; }
function renderEpisode(t) {
  const main = ctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  if (!_buf || _buf[0].canvas.width !== W || _buf[0].canvas.height !== H) _buf = [mkCanvas(W, H), mkCanvas(W, H)].map(c => c.getContext('2d'));
  let i = 0; while (i < EP.scenes.length - 1 && t >= _starts[i + 1]) i++;
  CSTYLE = (EP && EP.charStyle) || 'chibi'; lookFrame(t, EP);
  // trauma shake: translation + a little rotation, squared falloff
  let sx = 0, sy = 0, sr = 0;
  EP.scenes.forEach((s, k) => (vmerge(s).shakes || []).forEach(([st, amp, d]) => { const p = (t - _starts[k] - st) / d; if (p >= 0 && p < 1) { const a = amp * Math.pow(1 - p, 2) * U(); sx += noise1(t * 45 + st) * a; sy += noise1(t * 45 + st + 50) * a; sr += noise1(t * 38 + st + 90) * a * .0016; } }));
  ctx.save(); if (sx || sy) { ctx.translate(W / 2 + sx, H / 2 + sy); ctx.rotate(sr); ctx.scale(1.03, 1.03); ctx.translate(-W / 2, -H / 2); }
  let done = false;
  for (let j = 1; j < EP.scenes.length; j++) {
    const tr = vmerge(EP.scenes[j].transition || { type: 'cut', dur: 0 }); const d = tr.dur ?? .5; const at = _starts[j];
    if (tr.type !== 'cut' && d > 0 && t >= at - d / 2 && t < at + d / 2) {
      const p = (t - (at - d / 2)) / d;
      for (const [k, b] of [[j - 1, _buf[0]], [j, _buf[1]]]) { ctx = b; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); drawSceneContent(EP.scenes[k], Math.max(0, t - _starts[k])); ctx.restore(); }
      ctx = main; (FX[tr.type] || FX.fade)(_buf[0].canvas, _buf[1].canvas, p, t, tr.center ? [tr.center[0] * W, tr.center[1] * H] : undefined, tr); done = true; break;
    }
  }
  ctx = main;
  if (!done) { ctx.save(); drawSceneContent(EP.scenes[i], t - _starts[i]); ctx.restore(); }
  ctx.restore();
  let posted = false; { const S = vmerge(EP.scenes[i]); const g = (S.look && S.look.grade) || S.grade || LOOK.grade; posted = postFrame(g, t); if (!posted) applyGrade(g);
    const as = S.artstyle !== undefined ? S.artstyle : (EP.look && EP.look.artstyle); if (window.ARTSTYLE) ARTSTYLE.apply(as, t); }
  // captions (episode-level so they survive transitions)
  EP.scenes.forEach((s, k) => { const S = vmerge(s); const cy = S.capY ? (VERT() ? S.capY.v : S.capY.h) : undefined; const cs = S.capStyle || (S.look && S.look.captionStyle); (S.hideCaps ? [] : S.captions || []).filter(c => !(c[3] && c[3].hide)).forEach(c => caption(c[2], _starts[k] + c[0], _starts[k] + c[1], t, { ...(cy ? { y: cy * H } : {}), ...(cs ? { style: cs } : {}), ...(c[3] || {}) })); });
  if (!posted) finish(t, EP.finish || {});
}
// visual EVENTS for tools/sound_design.py (event list -> rule table -> scheduler): what happens on screen, when, where.
// { t (abs s), ev: 'trans.whip' | 'char.enter' | 'char.exit' | 'char.expr' | 'char.pose' | 'char.move' | 'char.ride' | 'prop.enter' | 'text.enter'
//   | 'ui.<name>' | 'ui.out' | 'ui.checklist.item' | 'cam.<move>' | 'cam.shake' | 'art.<fx>', scene (index), a: {...} }
function episodeEvents() {
  const evs = [], ev = (t, kind, k, a) => evs.push({ t: +(+t).toFixed(3), ev: kind, scene: k, a: a || {} });
  const fx = v => (typeof v === 'number' && v <= 2 ? v : .5);
  EP.scenes.forEach((s, k) => { const S = vmerge(s), st = _starts[k], dur = s.dur;
    if (k > 0) { const tr = vmerge(s.transition || { type: 'cut', dur: 0 }); ev(st, 'trans.' + (tr.type || 'cut'), k, { dur: tr.type === 'cut' ? 0 : (tr.dur ?? .5) }); }
    (S.shakes || []).forEach(([t, amp, d]) => ev(st + t, 'cam.shake', k, { amp, dur: d }));
    (S.moves || []).forEach(m => { if (m && m.type) ev(st + (m.t0 || 0), 'cam.' + m.type, k, { t1: +(st + (m.t1 ?? dur)).toFixed(3), amt: m.amt }); });
    if (s.art) ev(st + (s.art.at || 0), 'art.' + (s.art.fx || 'slam'), k, {});
    (S.layers || []).forEach(L0 => { const L = vmerge(L0); const x = fx(L.x), who = L.id || L.name || L.type;
      if (L.in && ['char', 'prop', 'text', 'image'].includes(L.type)) { const i = vmerge(L.in); const d = i.dur ?? (i.type === 'drop' ? .45 : .35); ev(st + (i.at ?? 0), L.type + '.enter', k, { type: i.type, dur: d, x, who }); }
      if (L.out && ['char', 'prop', 'text', 'image'].includes(L.type)) { const o = vmerge(L.out); ev(st + (o.at ?? 0), L.type + '.exit', k, { type: o.type, x, who }); }
      if (L.type === 'ui') { const o = L.o || {}; const at = o.at ?? L.at ?? 0, ux = fx(o.x);
        ev(st + at, 'ui.' + L.name, k, { x: ux, checked: o.checked ? 1 : 0, n: (o.items || []).length, step: o.step });
        if (L.name === 'checklist') (o.items || []).forEach((it, i) => ev(st + at + i * (o.step || .6) + .2, 'ui.checklist.item', k, { i, no: it.no ? 1 : 0, x: ux }));
        if (L.until !== undefined) ev(st + L.until, 'ui.out', k, { name: L.name, x: ux }); }
      if (L.type === 'char') { let px = x, pexpr = L.expr, ppose = L.pose, ptx = 0;
        if (L.ride) ev(st, 'char.ride', k, { dur, x, who });
        (L0.keys || []).map(vmerge).sort((a, b) => a.t - b.t).forEach(kk => {
          if (kk.expr && kk.expr !== pexpr) { ev(st + kk.t, 'char.expr', k, { val: kk.expr, x: px, who }); pexpr = kk.expr; }
          if (kk.pose && kk.pose !== ppose) { ev(st + kk.t, 'char.pose', k, { val: kk.pose, x: px, who }); ppose = kk.pose; }
          if (typeof kk.x === 'number') { if (Math.abs(kk.x - px) > .04) { const t0 = Math.max(ptx, kk.t - (kk.dur ?? 1e9)); ev(st + t0, 'char.move', k, { x0: px, x1: kk.x, t1: +(st + kk.t).toFixed(3), who, pose: ppose, ride: L.ride ? 1 : 0 }); } px = kk.x; ptx = kk.t; } }); } }); });
  return evs.sort((a, b) => a.t - b.t);
}
// cue sheet & subtitles for the editor / voice-over
function episodeCues() {
  const cues = [], subs = [], auto = EP.autoSfx !== false;
  const TR_SFX = { fgwipe: 'whoosh', lightleak: 'sparkle', burn: 'whoosh_down', inkbleed: 'whoosh_down', watercolor: null, tear: 'slide', portal: 'whoosh_up', glitch: 'buzzer', whip: 'whoosh', whipUp: 'whoosh_up', ink: 'whoosh_down', iris: 'whoosh', flash: 'impact', zoom: 'whoosh_up', paper: 'slide', slide: 'slide', push: 'slide', stripes: 'whoosh', circles: 'pop_cascade', brand: 'whoosh', fade: null, cut: null };
  const UI_SFX = { price: 'ding', stamp: 'stamp', stat: 'pop', bubble: 'pop', title: 'impact', banner: 'pop', checklist: 'tick', punch: 'pop', cta: 'ding', lower: 'slide', arrow: 'pen_draw', counter: 'tick', chapter: 'impact', choir: 'choir' };
  EP.scenes.forEach((s, k) => { const S = vmerge(s), st = _starts[k];
    (S.sfx || []).forEach(([t, name, gain]) => cues.push({ t: +(t + st).toFixed(2), sfx: name, gain: gain ?? 1, scene: s.id }));
    if (auto) {
      const tr = vmerge(s.transition || {}); if (k > 0 && TR_SFX[tr.type]) cues.push({ t: +(st - (tr.dur ?? .5) / 2).toFixed(2), sfx: TR_SFX[tr.type], gain: .8, scene: s.id, auto: 1 });
      (S.shakes || []).forEach(([t, amp]) => cues.push({ t: +(st + t).toFixed(2), sfx: amp >= 14 ? 'impact' : 'thud', gain: Math.min(1, amp / 18), scene: s.id, auto: 1 }));
      (S.layers || []).forEach(L0 => { const L = vmerge(L0); if (L.type === 'ui' && UI_SFX[L.name]) { const at = (L.o && L.o.at) ?? L.at ?? 0; cues.push({ t: +(st + at).toFixed(2), sfx: UI_SFX[L.name], gain: .7, scene: s.id, auto: 1 }); if (L.name === 'checklist') (L.o.items || []).forEach((it, i) => cues.push({ t: +(st + at + i * (L.o.step || .6) + .2).toFixed(2), sfx: it.no ? 'buzzer' : 'tick', gain: .7, scene: s.id, auto: 1 })); if (L.name === 'price' && L.o.checked) cues.push({ t: +(st + at + .5).toFixed(2), sfx: 'stamp', gain: .5, scene: s.id, auto: 1 }); }
        if ((L.type === 'char' || L.type === 'prop') && L.in) { const i = vmerge(L.in); const at = i.at ?? 0; if (i.type === 'drop') { cues.push({ t: +(st + at).toFixed(2), sfx: 'fall', gain: .5, scene: s.id, auto: 1 }); cues.push({ t: +(st + at + (i.dur ?? .45)).toFixed(2), sfx: 'thud', gain: .9, scene: s.id, auto: 1 }); } else cues.push({ t: +(st + at).toFixed(2), sfx: i.type === 'pop' ? 'pop' : 'slide', gain: .6, scene: s.id, auto: 1 }); }
        if (L.type === 'char' && L.ride) cues.push({ t: +st.toFixed(2), sfx: 'engine_loop', gain: .5, scene: s.id, auto: 1 }); });
      (S.moves || []).forEach(m => { if (m.type === 'crashZoom') cues.push({ t: +(st + (m.t0 || 0)).toFixed(2), sfx: 'whoosh_up', gain: .7, scene: s.id, auto: 1 }); if (m.type === 'reveal') cues.push({ t: +(st + (m.t0 || 0)).toFixed(2), sfx: 'whoosh_down', gain: .5, scene: s.id, auto: 1 }); });
    }
    (S.captions || []).forEach(c => { const m = c[3] || {}; subs.push({ t0: +(c[0] + st).toFixed(2), t1: +(c[1] + st).toFixed(2), text: c[2].replace(/[\*\[\]]/g, ''), ...(m.vo !== undefined ? { vo: m.vo } : {}), ...(m.speaker ? { spk: m.speaker, who: m.who } : {}) }); }); });
  // de-duplicate cues of the same sound within 80 ms (explicit cues win)
  cues.sort((a, b) => a.t - b.t || (a.auto || 0) - (b.auto || 0)); const out = []; for (const c of cues) { if (!out.some(o => o.sfx === c.sfx && Math.abs(o.t - c.t) < .08)) out.push(c); }
  return { cues: out, events: episodeEvents(), subs, duration: +EP._dur.toFixed(2), music: EP.music, voice: EP.voice, format: EP.format, scenes: EP.scenes.map((s, k) => { const V = vmerge(s); return { id: s.id, start: +_starts[k].toFixed(2), dur: s.dur, beat: String(s.id).replace(/^\d+_/, ''), place: V.place, moment: V.moment || null, art: s.art || null, trans: (vmerge(s.transition || {}).type) || null, placeDesc: V.place && PLACE[V.place] ? PLACE[V.place].desc : '', time: V.placeOpts && V.placeOpts.time, weather: V.weather }; }) };
}
