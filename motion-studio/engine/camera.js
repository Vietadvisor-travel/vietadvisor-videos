/* =====================================================================
   CAMERA LANGUAGE — named moves layered on top of the scene camera.
   scene.moves = [{ type, t0, t1, ...params, ease }]
   Each move returns deltas {dx, dy, dz (multiplier), rot} for progress p (0..1).
   Stage units: dx/dy are fractions of W/H. All moves stack.

   pushIn      slow push toward a point            { amt:.15, to:[x,y] }
   pullOut     reveal by pulling back              { amt:.25, from:[x,y] }
   crashZoom   fast punch-in with a hit            { amt:.6, to:[x,y] }  (add a shake)
   panL/panR   horizontal pan                       { dist:.2 }
   tiltUp/Down vertical tilt                        { dist:.2 }
   dutch       tilted horizon (tension / comedy)    { deg:6 }
   handheld    organic camera noise                 { amp:1 }
   drift       slow floating move (b-roll feel)     { amp:1 }
   orbit       fake parallax orbit (use layer depth){ amt:.06 }
   follow      keep a layer centred                 { id:'dave', z:1.2, lag:.15 }
   reveal      start tight on a detail → wide       { from:[x,y], z:2.2 }
   bounce      elastic zoom hit on a beat           { amt:.08 }
   dolly       push in while foreground slides out  { amt:.2 } (pairs with depth layers)
   focus       rack focus between depths            { from:1, to:0 }  → sets S._focus
   ===================================================================== */
'use strict';
E.anticipate = t => { const c1 = 1.7, c2 = c1 * 1.525; return t < .5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2; };
E.snap = t => 1 - Math.pow(1 - t, 8);
E.smooth = t => t * t * t * (t * (t * 6 - 15) + 10);
const MOVES = {
  pushIn: (p, m) => { const a = m.amt ?? .15, to = m.to || [.5, .5]; return { dz: 1 + a * p, dx: (to[0] - .5) * p * .6, dy: (to[1] - .5) * p * .6 }; },
  pullOut: (p, m) => { const a = m.amt ?? .25, f = m.from || [.5, .5]; return { dz: 1 + a * (1 - p), dx: (f[0] - .5) * (1 - p) * .6, dy: (f[1] - .5) * (1 - p) * .6 }; },
  crashZoom: (p, m) => { const a = m.amt ?? .6, to = m.to || [.5, .5]; const e = E.snap(p); return { dz: 1 + a * e, dx: (to[0] - .5) * e * .8, dy: (to[1] - .5) * e * .8 }; },
  panL: (p, m) => ({ dx: -(m.dist ?? .2) * p }), panR: (p, m) => ({ dx: (m.dist ?? .2) * p }),
  tiltUp: (p, m) => ({ dy: -(m.dist ?? .2) * p }), tiltDown: (p, m) => ({ dy: (m.dist ?? .2) * p }),
  dutch: (p, m) => ({ rot: (m.deg ?? 6) * Math.PI / 180 * p }),
  handheld: (p, m, t) => { const a = (m.amp ?? 1) * .004; return { dx: fbm(t * .9 + 3) * a, dy: fbm(t * .8 + 9) * a, rot: fbm(t * .6 + 20) * a * .6 }; },
  drift: (p, m, t) => { const a = (m.amp ?? 1) * .01; return { dx: Math.sin(t * .35) * a, dy: Math.cos(t * .27) * a * .6, dz: 1 + Math.sin(t * .2) * a * .5 }; },
  orbit: (p, m) => ({ dx: (m.amt ?? .06) * (p - .5) * 2, dz: 1 + Math.sin(p * Math.PI) * .03, _orbit: (m.amt ?? .06) * (p - .5) * 2 }),
  reveal: (p, m) => { const f = m.from || [.5, .5], z = m.z ?? 2.2; return { dz: lerp(z, 1, p), dx: (f[0] - .5) * (1 - p), dy: (f[1] - .5) * (1 - p) }; },
  bounce: (p, m) => ({ dz: 1 + (m.amt ?? .08) * Math.sin(p * Math.PI) * (1 - p) * 2.4 }),
  dolly: (p, m) => ({ dz: 1 + (m.amt ?? .2) * p, _dolly: p }),
  vertigo: (p, m) => ({ dz: 1 + (m.amt ?? .35) * p, _vert: [(m.amt ?? .35), p] }),   // dolly zoom: subject grows, world falls away
  crane: (p, m) => ({ dy: (m.dist ?? .12) * (1 - p), dz: 1 + (m.amt ?? .1) * (1 - p) }),   // rise and settle: reveal from low
  craneDown: (p, m) => ({ dy: -(m.dist ?? .12) * p, dz: 1 + (m.amt ?? .1) * p }),
  arc: (p, m) => ({ dx: Math.sin((p - .5) * Math.PI) * (m.amt ?? .05), rot: (p - .5) * (m.deg ?? 2) * Math.PI / 180, dz: 1.04, _orbit: (m.amt ?? .05) * (p - .5) * 2 }),
  whip: (p, m) => ({ dx: (m.dist ?? .35) * E.snap(p) * (m.dir ?? 1) }),
  snap: (p, m) => { const e = E.snap(p); return { dz: 1 + (m.amt ?? .3) * e }; },
  breathe: (p, m, t) => ({ dz: 1 + Math.sin(t * .6) * (m.amt ?? .015) + .015 }),
  follow: () => ({}), focus: () => ({}),
};
const MOVE_NAMES = Object.keys(MOVES);
function applyMoves(S, cam, lt, place) {
  let x = cam.x, y = cam.y, z = cam.z, rot = cam.rot; S._focus = S.focus ?? 1; S._orbit = 0; S._vert = null;
  for (const m0 of (S.moves || [])) { const m = vmerge(m0); const t0 = m.t0 ?? 0, t1 = m.t1 ?? (S.dur || 99);
    if (m.type === 'follow') { if (lt < t0) continue; const L = (S.layers || []).find(l => l.id === m.id || l.key === m.id); if (!L) continue; const st = sampleKeys(vmerge(L), L.keys, Math.max(0, lt - (m.lag ?? .15))); const fy = resolveY(st.y, place, st.dy || 0) / H - (m.headroom ?? .18); x = lerp(x, st.x ?? .5, clamp((lt - t0) / .4)); y = lerp(y, fy, clamp((lt - t0) / .4)); z *= lerp(1, m.z ?? 1.2, clamp((lt - t0) / .6)); continue; }
    if (m.type === 'focus') { S._focus = lerp(m.from ?? 1, m.to ?? 0, ease(m.ease || 'inOut')(inv(t0, t1, lt))); continue; }
    if (lt < t0 && !['handheld', 'drift'].includes(m.type)) continue;
    const p = ['handheld', 'drift'].includes(m.type) ? 1 : ease(m.ease || (m.type === 'crashZoom' ? 'lin' : 'inOut'))(inv(t0, t1, lt));
    const d = MOVES[m.type] ? MOVES[m.type](p, m, lt) : {};
    x += d.dx || 0; y += d.dy || 0; z *= d.dz || 1; rot += d.rot || 0; if (d._orbit) S._orbit = d._orbit; if (d._dolly !== undefined) S._dolly = d._dolly; if (d._vert) S._vert = d._vert;
  }
  return { x, y, z, rot };
}
// depth-of-field: blur radius for a layer depth given focus depth
function dofBlur(depth, focus) { return Math.min(14, Math.abs((depth ?? 1) - focus) * 9) * U(); }
