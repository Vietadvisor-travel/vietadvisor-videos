/* Poison Pill v6 — CUSTOM SCENES: the director writes the animation of a beat as code, like a motion designer would in
   Remotion or After Effects expressions. No template: anything the sentence needs. The code lives in the story file:

     #! scene money_river
     ({ t, at, p, W, H, u, layer, img, draw, text, icon, air, line, ease, lerp, clamp, rng, noise, col, num, params }) => {
       layer(1, () => draw(img('t_coins'), W / 2, H / 2, H * 1.1, { a: .5 }));          // background plate, dimmed
       const k = p('raised', 1.2);                                                        // 0→1 eased progress after "raised"
       for (let i = 0; i < 60; i++) { const r = rng(i); layer(2, () => icon('coin', lerp(-.1, 1.1, (r() + t * .2) % 1) * W, H * (.4 + .3 * Math.sin(i + t)), 40 * u * k)); }
       text('$1.75B', W / 2, H * .25, { size: 140 * u * ease.back(p('billion', .5)), col: col.red });
     }
     #! end
     # cine act=rise fx="code:money_river;sfx:whoosh_up@raised~impact_heavy@billion"
     They raised one point seven five billion dollars.

   RULES: the function is called every frame and must be a pure function of time (t, at(), p()) — no state kept between
   frames, no randomness without rng(seed). Errors are drawn on the frame in red and printed by pp_sheet / render. */
(function () {
  if (!window.PPCINE) return; const { EXT, num, split, toned, HAS, PP, LOOK } = window.PPCINE;
  const REG = window.PPCINE.CUSTOM = window.PPCINE.CUSTOM || {};
  const lookTone = () => (LOOK.cur && LOOK.cur.mid && LOOK.cur.mid.tone) || 'aged';
  const imgOf = (id, tone) => { id = String(id || '').replace(/^@/, '').trim(); return id && HAS(id) ? toned(id, tone || lookTone(), 0, 'print').c : null; };
  function noise(x) { const i = Math.floor(x), f = x - i; const h = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }; const w = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), w) * 2 - 1; }
  function api(e, lt, X) { const T0 = window.PPCINE.THEME(); const u = X.u;
    // layer() calls are queued and grouped by depth (0.25 steps): one camera/defocus pass per depth, however many calls the
    // director makes. Any direct drawing flushes the queue first, so draw order stays exactly as written.
    let Q = [], inL = false; const flush = () => { if (!Q.length || inL) return; const G = new Map(); Q.forEach(([d, f]) => { if (!G.has(d)) G.set(d, []); G.get(d).push(f); }); Q = []; [...G.keys()].sort((a, b) => a - b).forEach(d => { inL = true; try { X.layer(d, () => G.get(d).forEach(f => f())); } finally { inL = false; } }); };
    const layer = (d, fn) => { if (inL) return fn(); Q.push([Math.round(d * 4) / 4, fn]); }; const guard = f => (...a) => { if (!inL) flush(); return f(...a); };
    const at = (w, d) => X.at(w, d === undefined ? e.t : d);
    const p = (w, dur = .6, ez = 'out5') => { const s = typeof w === 'number' ? w : at(w); return (E[ez] || E.out5)(clamp((lt - s) / dur)); };
    const draw = (c, x, y, h, o = {}) => { if (!c) return; const hh = h, ww = hh * c.width / c.height; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); const s = o.s ?? 1; ctx.scale(s * (o.sx ?? 1), s);
      if (o.shadow) { ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20 * u; ctx.shadowOffsetY = 10 * u; } if (o.blend) ctx.globalCompositeOperation = o.blend; ctx.drawImage(c, -ww * (o.ax ?? .5), -hh * (o.ay ?? .5), ww, hh); ctx.restore(); return [ww, hh]; };
    const text = (s, x, y, o = {}) => T(String(s), x, y, { size: o.size || 60 * u, font: o.font || 'impact', weight: o.weight, fill: o.col || T0.ink, stroke: o.stroke || (T0.dark ? '#000' : T0.card), lw: o.lw ?? (o.size || 60 * u) * .06, align: o.align || 'center', alpha: o.a, rot: o.rot, ls: o.ls });
    const icon = (name, x, y, h, o = {}) => draw(window.PPBUILD ? window.PPBUILD.icon(name, o.col) : null, x, y, h, o);
    const air = (kind, o = {}) => window.PPART && window.PPART.atmo(kind, lt, X, { dens: o.dens ?? 1, t0: o.t0 ?? e.t, col: o.col, world: o.world ?? 1 });
    const line = (pts, o = {}) => { ctx.save(); ctx.strokeStyle = o.col || T0.red; ctx.lineWidth = (o.w || 5) * u; ctx.lineCap = ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash.map(d => d * u)); const k = o.k ?? 1; let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
      let left = L * k; ctx.beginPath(); ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= seg[i - 1]; } ctx.stroke(); ctx.restore(); };
    const fmt = (v, pre = '', unit = '') => { const a = Math.abs(v); return pre + (a >= 1e9 ? (v / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B' : a >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : a >= 1e4 ? Math.round(v / 1e3) + 'K' : Math.round(v).toLocaleString('en-US')) + unit; };
    // Remotion-style motion: spring(word|sec, {stiff, damp}) → a physical 0→1 (with overshoot) · stagger(i, n, word, spread) →
    // progress of item i in a cascade · wobble(seed, amp, hz) → organic drift · mblur(n, dt, f) → draws f(tt) n times back in time
    // (motion trail) — f receives a time offset to add to its own motion.
    const spring = (w, o = {}) => { const s0 = typeof w === 'number' ? w : at(w); const x = lt - s0; if (x <= 0) return 0; const k = o.stiff ?? 170, c = o.damp ?? 14, m = 1; const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m)); if (z >= 1) return 1 - Math.exp(-w0 * x) * (1 + w0 * x); const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * x) * (Math.cos(wd * x) + z * w0 / wd * Math.sin(wd * x)); };
    const stagger = (i, n, w, spread = .6, dur = .5, ez = 'out5') => { const s0 = (typeof w === 'number' ? w : at(w)) + spread * (n > 1 ? i / (n - 1) : 0); return (E[ez] || E.out5)(clamp((lt - s0) / dur)); };
    const wobble = (seed, amp = 1, hz = .3) => noise(seed * 13.7 + lt * hz) * amp;
    // v6.2 footage inside a custom scene: clip('<id>', start, speed) → the frame image for now (streams from disk); draw it like an image,
    // clip it to a mask (phone, window, split screen). It ping-pongs at the end so a short clip never jumps. Footage is not re-toned: grade it with ctx.
    const _cn = {}; const clipOf = (id, from = 0, speed = 1) => { id = String(id || '').replace(/^@|^clip:/g, ''); let n = _cn[id]; if (n === undefined) { n = 0; while (window.IMAGES[id + '__' + String(n).padStart(3, '0')]) n++; _cn[id] = n; } if (!n) return null;
      const fps = (window.IMAGES[id + '__000'] || {}).fps || 12; const t0 = typeof from === 'number' ? from : at(from); let f = Math.floor(Math.max(0, lt - t0) * fps * speed); const per = Math.max(1, 2 * n - 2); f = f % per; if (f >= n) f = per - f; const im = IMG[id + '__' + String(f).padStart(3, '0')]; return im && im.naturalWidth ? im : null; };
    const mblur = (n, dt, f) => { const a0 = ctx.globalAlpha; for (let k = n; k >= 0; k--) { ctx.globalAlpha = a0 * (k ? .5 * (1 - k / (n + 1)) : 1); f(-k * dt); } ctx.globalAlpha = a0; };
    return { _flush: flush, t: lt, dur: X.dur, at, p, spring, stagger, wobble, clip: clipOf, mblur: guard(mblur), W, H, u, layer, img: imgOf, draw: guard(draw), text: guard(text), icon: guard(icon), air: guard(air), line: guard(line), ease: E, lerp, clamp, rng, noise, num: fmt, col: { ink: T0.ink, red: T0.red, gold: PP.gold, card: T0.card, dark: T0.dark }, params: e, ctx, look: LOOK.name };
  }
  EXT.code = { world: true, sfx: (e, at) => split(e.sfx, '~').map(s => { const [n, w] = s.split('@'); return [w ? at(w.trim(), e.t) : e.t, n.trim(), .5]; }).filter(x => x[1]),
    draw(e, lt, X) { const fn = REG[e.arg]; if (!fn) { T(`custom scene "${e.arg}" not defined`, W / 2, H / 2, { size: 40 * X.u, font: 'cond', fill: '#e5484d', lw: 0 }); return; }
      try { ctx.save(); const A = api(e, lt, X); fn(A); A._flush(); ctx.restore(); } catch (err) { ctx.restore(); if (!e._warned) { console.error(`PP custom scene "${e.arg}": ${err.message}`); e._warned = 1; } T(`custom scene "${e.arg}": ${err.message}`.slice(0, 90), W / 2, H * .5, { size: 30 * X.u, font: 'cond', fill: '#e5484d', lw: 0 }); } } };
  // story preprocessing: pull `#! scene <name> … #! end` blocks out of the story text and compile them
  window.PPCINE.extractScenes = text => text.replace(/^#!\s*scene\s+(\w+)\s*\n([\s\S]*?)^#!\s*end\s*$/gm, (m, name, code) => { try { REG[name] = (0, eval)('(' + code.trim().replace(/;\s*$/, '') + ')'); } catch (err) { console.error(`PP custom scene "${name}" does not compile: ${err.message}`); REG[name] = () => { throw new Error('does not compile: ' + err.message); }; } return ''; });
})();
