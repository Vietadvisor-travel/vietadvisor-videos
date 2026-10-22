/* =====================================================================
   ACTING — a bigger vocabulary of body language, chained actions and
   automatic talking gestures.
   · 30+ extra poses (eating with chopsticks, paddling, selfie, praying,
     bargaining, lantern release, falls, stretches, shoulder pole …)
   · pose chains: pose="walk:1.2>stop:.4>wave:1.5>point" — each segment runs
     on its own clock (so `fall`, `release`, `startle` play from their start)
     and neighbouring poses blend over .28 s with an ease.
   · talking gestures: a host who talks with pose stand gets beat gestures
     (open palms, count, present, hands together) that change every phrase.
   ===================================================================== */
'use strict';
const SM = x => x * x * (3 - 2 * x);
const cyc = (t, per) => (t % per) / per;
Object.assign(POSE, {
  // ---- talking: beat gestures, a new shape every ~1.1 s, springy blend
  talk: (b, t) => {
    const G = [
      () => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .64, -b.leg - 8] }),                                            // rest
      () => ({ hL: [-b.tw * .95, -b.leg - b.torso * .5], hR: [b.tw * .95, -b.leg - b.torso * .5], palmUp: 1 }),           // open palms
      () => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * 1.2, -b.leg - b.torso * .58], palmUp: 1 }),                      // present
      () => ({ front: 1, hL: [-b.tw * .1, -b.leg - b.torso * .55], hR: [b.tw * .1, -b.leg - b.torso * .55] }),             // hands together
      () => ({ hL: [-b.tw * .4, -b.leg - b.torso * .62], hR: [b.tw * .55, -b.leg - b.torso * .78], thumbR: 1 }),           // count / emphasise
      () => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .7, -b.leg - b.torso * .95] }),                                  // raised finger
      () => ({ hL: [-b.tw * 1.05, -b.leg - b.torso * .4], hR: [b.tw * .64, -b.leg - 8], palmUp: 1 }),                      // left offer
    ];
    const per = 1.1, k = Math.floor(t / per), f = cyc(t, per);
    const A = G[Math.floor(hash(k * 7.3) * G.length)](), B = G[Math.floor(hash((k + 1) * 7.3) * G.length)]();
    const blend = SM(clamp((f - .72) / .28));
    const P = blendPose(b, A, B, blend);
    const beat = Math.sin(t * 9.5) * 3; P.hR = [P.hR[0], P.hR[1] + beat]; P.hL = [P.hL[0], P.hL[1] - beat * .6];
    return P;
  },
  chopsticks: (b, t) => { const f = cyc(t, 2.1), up = f < .35 ? SM(f / .35) : f < .6 ? 1 : 1 - SM((f - .6) / .4);
    return { front: 1, hL: [-b.tw * .34, -b.leg - b.torso * .38], hR: [b.tw * .26 - up * 18, -b.leg - b.torso * .4 - up * (b.torso * .55)], headY: 4 - up * 4, headTilt: up * .06 }; },
  slurp: (b, t) => { const f = cyc(t, .5); return { front: 1, hL: [-b.tw * .3, -b.leg - b.torso * .55], hR: [b.tw * .15, -b.leg - b.torso - 18 + Math.sin(f * TAU) * 6], headY: 8, headTilt: .05 }; },
  sip: (b, t) => { const f = cyc(t, 3.2), up = f < .25 ? SM(f / .25) : f < .55 ? 1 : 1 - SM((f - .55) / .3);
    return { hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .45 - up * 30, -b.leg - b.torso * .45 - up * (b.torso * .5)], headTilt: -up * .1 }; },
  paddle: (b, t) => { const s = Math.sin(t * 2.6), c = Math.cos(t * 2.6);
    return { hL: [-b.tw * .1 + s * 40, -b.leg - b.torso * .85 - c * 14], hR: [b.tw * .5 + s * 46, -b.leg - b.torso * .35 + c * 10], lean: s * .05 }; },
  row: (b, t) => { const s = Math.sin(t * 2.2); return { hL: [-b.tw * .5 + s * 30, -b.leg - b.torso * .5], hR: [b.tw * .5 + s * 30, -b.leg - b.torso * .5], lean: s * .08 }; },
  selfie: (b, t) => ({ hL: [-b.tw * .32, -b.leg - b.torso - 34], hR: [b.tw * 1.35, -b.leg - b.torso - 70 + Math.sin(t * 2) * 4], headTilt: .12, bob: Math.sin(t * 3) * 2 }),
  lookAround: (b, t) => ({ hL: [-b.tw * .6, -b.leg - 6], hR: [b.tw * .6, -b.leg - 6], elbowOut: 1, headTilt: Math.sin(t * 1.3) * .1 }),
  shade: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .18, -b.leg - b.torso - 62], headTilt: -.05, lean: .02 }),
  nod: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .64, -b.leg - 8], headY: Math.max(0, Math.sin(t * 7)) * 7 }),
  headshake: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .64, -b.leg - 8], headTilt: Math.sin(t * 13) * .09 }),
  laugh: (b, t) => ({ front: 1, hL: [-b.tw * .3, -b.leg - b.torso * .32], hR: [b.tw * .3, -b.leg - b.torso * .32], bob: -Math.abs(Math.sin(t * 11)) * 6, headTilt: -.12 + Math.sin(t * 11) * .03 }),
  stretch: (b, t) => { const s = Math.sin(t * 1.4); return { hL: [-b.head * 1.05, -b.leg - b.torso - b.head * 2.3], hR: [b.head * 1.05, -b.leg - b.torso - b.head * 2.3], lean: s * .07, bob: -4 }; },
  wipe: (b, t) => { const f = cyc(t, 1.8); return { hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * (.4 - SM(clamp(f * 2)) * .7), -b.leg - b.torso - 58], headTilt: .05 }; },
  shiver: (b, t) => ({ front: 1, hL: [b.tw * .3, -b.leg - b.torso * .6], hR: [-b.tw * .3, -b.leg - b.torso * .62], shake: 1.6, shoulderUp: 6, headY: 4 }),
  pray: (b, t) => ({ front: 1, hL: [-5, -b.leg - b.torso * .72], hR: [5, -b.leg - b.torso * .72], headY: 7 + Math.sin(t * 1.2) * 2, bob: Math.max(0, Math.sin(t * 1.2)) * 3 }),
  stir: (b, t) => ({ hL: [-b.tw * .6, -b.leg - b.torso * .3], hR: [b.tw * .7 + Math.cos(t * 5) * 18, -b.leg - b.torso * .3 + Math.sin(t * 5) * 7], headY: 6 }),
  bargain: (b, t) => { const k = Math.floor(t / .9) % 2; return { hL: k ? [-b.tw * .9, -b.leg - b.torso * .55] : [-b.tw * .6, -b.leg - 8], hR: k ? [b.tw * .6, -b.leg - 8] : [b.tw * 1.1, -b.leg - b.torso * .62], palmUp: 1, headTilt: k ? -.06 : .06 }; },
  count: (b, t) => ({ front: 1, hL: [-b.tw * .15, -b.leg - b.torso * .7], hR: [b.tw * .25, -b.leg - b.torso * .75 + Math.sin(t * 6) * 5], thumbR: 1 }),
  beckon: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * (1.1 - Math.abs(Math.sin(t * 5)) * .35), -b.leg - b.torso * .62], palmUp: 1 }),
  fistpump: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 10], hR: [b.tw * .6, -b.leg - b.torso - 60 - Math.abs(Math.sin(t * 7)) * 30], bob: -Math.abs(Math.sin(t * 7)) * 6 }),
  jumpJoy: (b, t) => { const j = Math.abs(Math.sin(t * 5)); return { hL: [-b.head * 1.25, -b.leg - b.torso - 80], hR: [b.head * 1.25, -b.leg - b.torso - 80], bob: -j * 40, fL: [-b.tw * .3, -j * 14], fR: [b.tw * .3, -j * 14] }; },
  crossArms: (b, t) => ({ front: 1, hL: [b.tw * .28, -b.leg - b.torso * .55], hR: [-b.tw * .28, -b.leg - b.torso * .5], headTilt: -.04 }),
  leanBack: (b, t) => ({ hL: [-b.tw * .6, -b.leg - 6], hR: [b.tw * .6, -b.leg - 6], elbowOut: 1, lean: -.07 }),
  sneak: (b, t) => { const s = Math.sin(t * 5); return { hL: [-b.tw * .2, -b.leg * .75 - b.torso * .6 + s * 6], hR: [b.tw * .6, -b.leg * .75 - b.torso * .7 - s * 6], hipY: -b.leg * .8, lean: .14, fL: [-b.tw * .3 + s * 10, -Math.max(0, s) * 10], fR: [b.tw * .3 - s * 10, -Math.max(0, -s) * 10] }; },
  tired: (b, t) => ({ hL: [-b.tw * .55, -b.leg + 6], hR: [b.tw * .55, -b.leg + 6], shoulderUp: -6, headY: 10, lean: .05 + Math.sin(t * 1.5) * .01 }),
  phone: (b, t) => ({ front: 1, hL: [-b.tw * .12, -b.leg - b.torso * .5], hR: [b.tw * .12, -b.leg - b.torso * .52 + Math.sin(t * 8) * 1.5], headY: 9 }),
  pole: (b, t) => { const s = Math.sin(t * 7.5); return { hL: [-b.tw * .3, -b.leg - b.torso - 6], hR: [b.tw * .35, -b.leg - b.torso - 2], fL: [-b.tw * .22 + s * 6, -Math.max(0, Math.cos(t * 7.5)) * 16], fR: [b.tw * .22 - s * 6, -Math.max(0, -Math.cos(t * 7.5)) * 16], bob: -Math.abs(s) * 6 }; },
  tour: (b, t) => { const a = Math.sin(t * .9) * .5 + .5; return { hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * (.6 + a * .9), -b.leg - b.torso * (.55 + a * .4)], palmUp: 1 }; },
  fanDance: (b, t) => { const s = Math.sin(t * 2.4), c = Math.cos(t * 2.4); return { hL: [-b.tw * (1 + c * .3), -b.leg - b.torso * (.7 + s * .45)], hR: [b.tw * (1 - c * .3), -b.leg - b.torso * (.7 - s * .45)], lean: s * .08, bob: -Math.abs(c) * 6 }; },
  kneel: (b, t) => ({ hL: [-b.tw * .5, -b.leg * .5], hR: [b.tw * .5, -b.leg * .55], fL: [-b.tw * .3, 0], fR: [b.tw * .3, 0], hipY: -b.leg * .5, knees: 1 }),
  sitFloor: (b, t) => ({ hL: [-b.tw * .55, -b.leg * .2], hR: [b.tw * .55, -b.leg * .22], fL: [-b.tw * .5, 0], fR: [b.tw * .5, 0], hipY: -b.leg * .22, knees: 1 }),
  // ---- one-shot actions (play from the start of their segment)
  release: (b, t) => { const p = SM(clamp(t / 1.6)); return { front: p < .5 ? 1 : 0, hL: [-b.tw * (.15 + p * .6), -b.leg - b.torso * (.55 + p * .9)], hR: [b.tw * (.15 + p * .6), -b.leg - b.torso * (.55 + p * .9)], palmUp: p > .6 ? 1 : 0, headTilt: -p * .14 }; },
  startle: (b, t) => { const j = Math.max(0, Math.sin(Math.min(t, .5) * TAU)) * (t < .5 ? 1 : 0); return { hL: [-b.tw * .9, -b.leg - b.torso - 30], hR: [b.tw * .9, -b.leg - b.torso - 30], bob: -j * 40, shake: t > .5 && t < 1.2 ? 1.5 : 0 }; },
  fall: (b, t) => { const p = SM(clamp(t / .6)); return { hL: [-b.tw * (.6 + p * .6), -b.leg - b.torso * (.2 + p * .9) + Math.sin(t * 20) * 8 * (1 - p)], hR: [b.tw * (.6 + p * .6), -b.leg - b.torso * (.3 + p * .9)], lean: -p * 1.35, hipY: -b.leg * (1 - p * .6), shake: t < .6 ? 1 : 0 }; },
  bowDeep: (b, t) => { const p = SM(clamp(t / .7)) * (t < 2 ? 1 : 1 - SM(clamp((t - 2) / .6))); return { hL: [-b.tw * .2, -b.leg - b.torso * .2], hR: [b.tw * .2, -b.leg - b.torso * .2], lean: p * .45, headY: p * 10 }; },
  pickUp: (b, t) => { const p = t < .6 ? SM(t / .6) : 1 - SM(clamp((t - .9) / .6)); return { hL: [-b.tw * .5, -b.leg - 8 + p * 20], hR: [b.tw * .5, -b.leg + 30 * p], hipY: -b.leg * (1 - p * .25), lean: p * .3 }; },
  throwUp: (b, t) => { const p = SM(clamp(t / .5)); return { hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * (.4 + p * .3), -b.leg - b.torso * (.3 + p * 1.2)], bob: -p * 6 }; },
});
// blend two pose objects (missing joints fall back to stand)
function blendPose(b, A, B, f) {
  const D = { hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .64, -b.leg - 8], fL: [-b.tw * .24, 0], fR: [b.tw * .24, 0], hipY: -b.leg, bob: 0, lean: 0, headTilt: 0, headY: 0, shoulderUp: 0, shake: 0 };
  const out = {}, keys = new Set([...Object.keys(A), ...Object.keys(B)]);
  for (const k of keys) { const a = A[k] ?? D[k], c = B[k] ?? D[k];
    if (Array.isArray(a) || Array.isArray(c)) { const aa = a || c, cc = c || a; out[k] = [lerp(aa[0], cc[0], f), lerp(aa[1], cc[1], f)]; }
    else if (typeof a === 'number' || typeof c === 'number') { if (k in D || typeof (a ?? c) === 'number') out[k] = lerp(a ?? 0, c ?? 0, f); }
    else out[k] = f < .5 ? a : c; }
  // flags that change the leg solver switch at the midpoint
  for (const k of ['knees', 'ride', 'front', 'palmUp', 'thumbR', 'elbowOut']) out[k] = f < .5 ? A[k] : B[k];
  return out;
}
// "walk:1.2>stop:.4>wave" → pose function; last segment holds
const _seqCache = {};
function poseSeq(str) {
  if (_seqCache[str]) return _seqCache[str];
  const segs = String(str).split('>').map(s => { const [n, d] = s.trim().split(':'); return { fn: POSE[n === 'stop' ? 'stand' : n] || POSE.stand, d: d === undefined ? Infinity : +d || 1 }; });
  const starts = []; let acc = 0; for (const s of segs) { starts.push(acc); acc += s.d; }
  const X = .28;
  const fn = (b, t) => { let i = 0; while (i < segs.length - 1 && t >= starts[i + 1]) i++;
    const P = segs[i].fn(b, t - starts[i]);
    if (i < segs.length - 1) { const toNext = starts[i + 1] - t; if (toNext < X) { const Q = segs[i + 1].fn(b, 0); return blendPose(b, P, Q, SM(1 - toNext / X)); } }
    return P; };
  return (_seqCache[str] = fn);
}
function resolvePose(p, talk) {
  if (typeof p === 'function') return p;
  if (p && POSE[p]) return (talk && p === 'stand') ? POSE.talk : POSE[p];
  if (p && /[>:]/.test(p)) return poseSeq(p);
  return talk ? POSE.talk : POSE.stand;
}
const ACT_NAMES = ['talk', 'chopsticks', 'slurp', 'sip', 'paddle', 'row', 'selfie', 'lookAround', 'shade', 'nod', 'headshake', 'laugh', 'stretch', 'wipe', 'shiver', 'pray', 'stir', 'bargain', 'count', 'beckon', 'fistpump', 'jumpJoy', 'crossArms', 'leanBack', 'sneak', 'tired', 'phone', 'pole', 'tour', 'fanDance', 'kneel', 'sitFloor', 'release', 'startle', 'fall', 'bowDeep', 'pickUp', 'throwUp'];
