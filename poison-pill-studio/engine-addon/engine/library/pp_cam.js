/* Poison Pill v4 — THE CAMERA RIG (load after pp_cine3).
   A real 2.5D virtual camera for `# cine` beats: shot sizes framed on a subject, moves keyed to spoken words, true
   per-plane parallax, dutch roll, low/high angle, rack focus, dolly-zoom, whip/crash with motion blur, handheld.

   # cine … shot="ws|mcu:1@dealmaker/dolly|ecu:fg1@billion/crash;dutch:-6|ws:2@but/whip" focus="auto"
   Keyframe = <size>[:<target>][@<word>][/<move>][;key:val…]   (the first keyframe is the opening frame, at 0)
     size    ews · ws · ms · mcu · cu · ecu · insert (= ecu on the target centre)  · or a number = zoom (1.6)
     target  1..n (mid layer) · <image id> · fg1..n · hero · pt:.3,.4 (frame point)       default: the frame centre
     move    cut (punch-in, 0 s) · dolly (1.1 s power3) · glide (eases over the whole gap) · whip (.28 s + motion blur)
             crash (.16 s snap zoom, overshoot, shake) · rack (.6 s, focus pull with a small push) · vertigo (dolly-zoom)
             truck (lateral, strong parallax) · drop (pedestal down) · rise (pedestal up)
     keys    dutch:<deg> roll · angle:low|high|eye · hand:<0..2> handheld · breathe:<%> slow push after landing (default 3)
             dur:<s> move length · ox/oy:<-.5..5> nudge framing in screen fractions (lead room: look-space ahead of a face)
   focus=auto (focus follows the subject; planes away from it soften) · off · or explicit "bg@0|1@deal|fg1@billion"
   Without shot= the beat keeps its v3 single-move `cam=`. */
(function () {
  if (!window.PPCINE) { console.warn('pp_cam: load after pp_cine'); return; }
  const { num, split, item } = window.PPCINE;
  // fraction of frame height the framed part of the subject should fill, and which part of a figure (from its top)
  const SIZE = { ews: { z: 1, f: 0 }, ws: { z: 1, f: 0 }, ms: { f: .9, top: 0, part: 1 }, mcu: { f: .92, top: 0, part: .62 },
    cu: { f: .95, top: 0, part: .42 }, ecu: { f: 1, top: .08, part: .22 }, insert: { f: .9, top: .5, part: .35, centre: 1 } };
  const MOVE = { cut: { d: 0 }, dolly: { d: 1.1, e: 'p3' }, glide: { d: -1, e: 'sine' }, whip: { d: .28, e: 'expo', blur: 1 },
    crash: { d: .16, e: 'over', blur: .6, shake: .9 }, rack: { d: .6, e: 'p3' }, vertigo: { d: -1, e: 'sine', vert: 1 },
    truck: { d: 1.4, e: 'p3' }, drop: { d: 1, e: 'p3' }, rise: { d: 1.2, e: 'p3' } };
  const EZ = { p3: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    expo: t => t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    over: t => { const c1 = 1.1, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); } };
  const PF = d => d / 2; // parallax factor: mid plane (depth 2) moves exactly with the camera, bg (1) half, fg (3) 1.5×

  function parseKf(s) {
    s = String(s).trim(); if (!s) return null; const semi = s.indexOf(';'); const head = semi < 0 ? s : s.slice(0, semi); const rest = semi < 0 ? '' : s.slice(semi);
    const m = head.match(/^([a-z]+|\d*\.?\d+)(?::([^@\/]+))?(?:@([^\/]+))?(?:\/(\w+))?$/i); if (!m) { console.warn('pp_cam: bad keyframe', s); return null; }
    const o = item('x' + rest); delete o.id; return { ...o, size: m[1].toLowerCase(), target: m[2] || o.target, at: m[3] || o.at, move: (m[4] || o.move || '').toLowerCase() };
  }

  // targets → { x, y (centre), top, h (frame fractions), d (depth) }; resolved per format because mid/fg have v* variants
  function targetBox(tg, S, v) {
    if (!tg) return null; tg = String(tg);
    if (/^pt:/.test(tg)) { const [x, y] = tg.slice(3).split(',').map(Number); return { x, y, top: y - .1, h: .2, d: 2 }; }
    if (tg === 'hero' && S.hero) { const h = S.hero; const x = v ? h.vx : h.x, y = v ? h.vy : h.y; return { x, y, top: y - .08, h: .16, d: 2.4 }; }
    const fm = tg.match(/^fg(\d+)$/); if (fm) { const f = S.fgs[+fm[1] - 1]; if (!f) return null; const x = v ? f.vx : f.x, y = v ? f.vy : f.y, h = v ? f.vh : f.h; return { x, y: y - h / 2, top: y - h, h, d: 3 + (+fm[1] - 1) * .3 }; }
    const i = /^\d+$/.test(tg) ? +tg - 1 : S.mids.findIndex(m => m.id === tg); const m = S.mids[i]; if (!m) return null;
    const x = v ? m.vx : m.x, y = v ? m.vy + m.vh / 2 : m.y, h = v ? m.vh : m.h; return { x, y, top: y - h / 2, h, d: 2 + (i % 3) * .35 };
  }

  // a keyframe → camera state { cx, cy (frame point at screen centre, on the mid plane), z, roll, ang, fd (focal depth) }
  function frame(k, S, v) {
    const b = targetBox(k.target, S, v); const sz = SIZE[k.size]; let z, cx = .5, cy = .5;
    if (!isNaN(+k.size)) { z = +k.size; if (b) { cx = b.x; cy = b.y; } }
    else if (!sz || sz.z === 1 || !b) { z = k.size === 'ews' ? 1 : 1.04; if (b && k.size !== 'ews') { cx = lerp(.5, b.x, .25); cy = lerp(.5, b.y, .15); } }
    else { const part = b.h * sz.part; z = sz.f / Math.max(.04, part); cx = b.x; cy = sz.centre ? b.y : b.top + b.h * sz.top + part / 2; }
    // the target lives on its own plane: convert "centre this plane point at this plane zoom" into mid-plane camera values
    const pf = b ? PF(b.d) : 1; z = clamp(z, 1, 4.5); z = 1 + (z - 1) / pf; cx = .5 + (cx - .5) / pf; cy = .5 + (cy - .5) / pf;
    cx += num(k.ox, 0) / z; cy += num(k.oy, 0) / z;
    return { cx, cy, z, roll: num(k.dutch, 0) * Math.PI / 180, ang: k.angle === 'low' ? 1 : k.angle === 'high' ? -1 : 0, fd: b ? b.d : 2, hand: num(k.hand, 0), breathe: num(k.breathe, 3) / 100 };
  }
  const mix = (a, b, t) => ({ cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), z: a.z * Math.pow(b.z / a.z, t), roll: lerp(a.roll, b.roll, t), ang: lerp(a.ang, b.ang, t), fd: lerp(a.fd, b.fd, t), hand: lerp(a.hand, b.hand, t), breathe: b.breathe });

  function build(o, at, dur, S) {
    const kfs = split(o.shot).map(parseKf).filter(Boolean); if (!kfs.length) return null;
    kfs.forEach((k, i) => { k.t = i === 0 ? 0 : at(k.at, i * dur / kfs.length); });
    for (let i = 1; i < kfs.length; i++) if (kfs[i].t < kfs[i - 1].t) kfs[i].t = kfs[i - 1].t; // keep order even if a word is missing
    kfs.forEach((k, i) => { const M = MOVE[k.move] || (i === 0 ? MOVE.cut : MOVE.dolly); const gap = (i + 1 < kfs.length ? kfs[i + 1].t : dur) - k.t; k.M = M; k.d = num(k.dur, M.d < 0 ? Math.max(.4, gap) : M.d); });
    const shakes = kfs.filter(k => k.M.shake).map(k => [k.t + k.d * .8, k.M.shake]);
    const focusK = !o.focus || o.focus === 'auto' ? null : o.focus === 'off' ? [] : split(o.focus).map(s => { const [tg, w] = s.split('@'); return { tg: tg.trim(), t: w === undefined ? 0 : at(w.trim(), 0) }; });
    const cache = {};
    const states = v => cache[v] || (cache[v] = kfs.map(k => frame(k, S, v)));
    function state(lt, v) {
      const F = states(v); let i = 0; while (i + 1 < kfs.length && lt >= kfs[i + 1].t) i++; const k = kfs[i];
      const prev = i === 0 ? F[0] : (function settle(j) { return F[j]; })(i - 1);
      const p = k.d > 0 ? clamp((lt - k.t) / k.d) : 1; const e = EZ[k.M.e] || EZ.p3; let s = i === 0 ? { ...F[0] } : mix(prev, F[i], e(p));
      if (k.M.vert) s.vert = (i === 0 ? clamp(lt / Math.max(.4, k.d)) : EZ.sine(p)); // dolly-zoom amount 0..1
      // after landing: a slow push (reading hold) + a tiny lateral drift, so the frame never freezes
      const land = k.t + k.d, gap = Math.max(.5, (i + 1 < kfs.length ? kfs[i + 1].t : dur) - land); const q = clamp((lt - land) / gap);
      if (lt > land || i === 0) { const qq = i === 0 ? clamp(lt / Math.max(.5, (kfs[1] ? kfs[1].t : dur))) : q; s.z *= 1 + s.breathe * EZ.sine(qq); s.cx += (qq - .5) * .006 * (i % 2 ? 1 : -1); }
      s.mblur = k.M.blur && p > 0 && p < 1 ? k.M.blur * Math.sin(p * Math.PI) : 0; s.move = k.M; s.k = i;
      let sh = 0; shakes.forEach(([t, a]) => { const d = lt - t; if (d >= 0 && d < .35) sh = Math.max(sh, a * (1 - d / .35)); }); s.shake = sh;
      if (focusK && focusK.length) { let j = 0; while (j + 1 < focusK.length && lt >= focusK[j + 1].t) j++; const fdOf = f => f.tg === 'bg' ? 1 : f.tg === 'fg' ? 3 : ((targetBox(f.tg, S, v) || {}).d || 2); const a = fdOf(focusK[Math.max(0, j - (lt < focusK[j].t + .6 && j > 0 ? 1 : 0))]), b = fdOf(focusK[j]); s.fd = j > 0 ? lerp(fdOf(focusK[j - 1]), b, EZ.p3(clamp((lt - focusK[j].t) / .6))) : b; void a; }
      s.focusOff = focusK && !focusK.length; return s;
    }
    // per-plane transform; returns the blur (px) the plane should get from depth of field
    function apply(s, depth, lt, u) {
      const pf = PF(depth); let z = 1 + (s.z - 1) * pf; if (s.vert !== undefined && depth < 1.9) z *= 1 + .22 * (1 - s.vert) - .05; if (s.vert !== undefined && depth >= 1.9) z *= 1 + .06 * s.vert;
      const rollFill = Math.abs(s.roll) > 1e-4 ? Math.cos(Math.abs(s.roll)) + Math.sin(Math.abs(s.roll)) * Math.max(W / H, H / W) : 1; const zz = z * rollFill;
      let px = (.5 + (s.cx - .5) * pf) * W, py = (.5 + (s.cy - .5) * pf) * H; py += s.ang * H * .035 * (pf - 1);
      const hw = W / (2 * zz), hh = H / (2 * zz); if (depth < 1.9) { px = clamp(px, Math.min(W / 2, hw), Math.max(W / 2, W - hw)); py = clamp(py, Math.min(H / 2, hh), Math.max(H / 2, H - hh)); }
      let hx = 0, hy = 0, hr = 0; const hand = s.hand + (s.shake || 0) * 2.2; if (hand > 0) { hx = fbm(lt * 1.3 + 3) * 7 * u * hand; hy = fbm(lt * 1.1 + 9) * 6 * u * hand; hr = fbm(lt * .7 + 21) * .004 * hand; }
      ctx.translate(W / 2 + hx * pf, H / 2 + hy * pf); ctx.rotate(s.roll * (.85 + .15 * pf) + hr); const angS = 1 + s.ang * .04 * (pf - 1); ctx.scale(zz, zz * angS); ctx.translate(-px, -py);
      if (s.focusOff) return 0; const dd = Math.abs(depth - s.fd); return dd < .35 ? 0 : Math.min(9, (dd - .35) * 4.2 * Math.min(2, .7 + (s.z - 1) * .5)) * u;
    }
    // directional motion blur for whips/crashes: accumulate shifted copies of the finished frame
    let SNAP = null; function post(s, s0) { if (!s.mblur) return; const dx = (s.cx - s0.cx) * W * s.z, dy = (s.cy - s0.cy) * H * s.z, dz = Math.log(s.z / s0.z); const amt = Math.hypot(dx, dy) + Math.abs(dz) * W * .5; if (amt < 2) return;
      if (!SNAP || SNAP.width !== W || SNAP.height !== H) SNAP = mkCanvas(W, H); const g = SNAP.getContext('2d'); g.clearRect(0, 0, W, H); g.drawImage(ctx.canvas, 0, 0);
      const n = 7; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (let i = 1; i <= n; i++) { const f = i / n * s.mblur * 1.6; ctx.globalAlpha = .5 / i + .08; if (Math.abs(dz) * W > Math.hypot(dx, dy)) { const sc = 1 + dz * f * .5; ctx.drawImage(SNAP, W / 2 - W * sc / 2, H / 2 - H * sc / 2, W * sc, H * sc); } else ctx.drawImage(SNAP, -dx * f, -dy * f); } ctx.restore(); }
    return { kfs, state, apply, post, shots: kfs.length };
  }
  window.PPCAM = { build, SIZE, MOVE, parseKf };
})();
