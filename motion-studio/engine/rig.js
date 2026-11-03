/* =====================================================================
   CHARACTER RIG — one parametric body for every character.
   person(x, y, s, spec, o)
     spec : the character design (preset) — skin, hair, outfit, accessories
     o    : the performance — pose, expr, t, look, flip, hold, ...
   Coordinates at s=1: feet on y=0, adult ≈ 400 units tall, head r ≈ 84.
   ===================================================================== */
'use strict';
const BODY = {
  adult: { leg: 105, torso: 110, tw: 96, head: 84, arm: 58, fore: 55, armW: 19, legW: 25, hand: 13 },
  teen: { leg: 96, torso: 100, tw: 88, head: 82, arm: 54, fore: 50, armW: 18, legW: 23, hand: 12 },
  kid: { leg: 66, torso: 78, tw: 78, head: 78, arm: 42, fore: 40, armW: 16, legW: 21, hand: 11 },
  elder: { leg: 98, torso: 106, tw: 98, head: 82, arm: 56, fore: 52, armW: 19, legW: 24, hand: 13 },
};
function ik(S, Hd, a, b, bend) {
  let dx = Hd[0] - S[0], dy = Hd[1] - S[1]; let d = Math.hypot(dx, dy) || 1;
  const maxD = (a + b) * .999; if (d > maxD) { Hd = [S[0] + dx / d * maxD, S[1] + dy / d * maxD]; dx = Hd[0] - S[0]; dy = Hd[1] - S[1]; d = maxD; }
  const ca = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1); const ang = Math.atan2(dy, dx) + bend * Math.acos(ca);
  return [[S[0] + Math.cos(ang) * a, S[1] + Math.sin(ang) * a], Hd];
}

// ---------------------------------------------------------------- expressions
const EXPR = {
  neutral: { eye: 'open', mouth: 'smile', mo: .5 },
  happy: { eye: 'open', mouth: 'smile', mo: 1, blush: .5 },
  joy: { eye: 'happy', mouth: 'grin', mo: 1, blush: .7 },
  grin: { eye: 'open', mouth: 'grin', mo: 1 },
  laugh: { eye: 'happy', mouth: 'laugh', mo: 1.2, blush: .6, brow: .15 },
  surprised: { eye: 'wide', mouth: 'o', mo: 1, brow: .3, browY: -10 },
  shocked: { eye: 'tiny', mouth: 'o', mo: 1.6, brow: .35, browY: -14, pale: .4 },
  scared: { eye: 'wide', mouth: 'wavy', brow: .35, browY: -6, pale: 1, sweat: 1, wobble: 1 },
  bored: { eye: 'half', mouth: 'flat', brow: -.08, look: [.6, .2] },
  sad: { eye: 'open', mouth: 'frown', brow: .35, browY: -4, look: [0, .5], tear: .6 },
  cry: { eye: 'closed', mouth: 'cry', brow: .4, tears: 1 },
  angry: { eye: 'open', mouth: 'frown', brow: -.45, browY: 6, anger: 1, red: .5 },
  smug: { eye: 'half', mouth: 'smirk', brow: -.12, look: [-.6, 0] },
  wink: { eye: 'wink', mouth: 'grin', mo: .9 },
  love: { eye: 'hearts', mouth: 'grin', mo: 1, blush: 1 },
  starstruck: { eye: 'stars', mouth: 'o', mo: 1.2, brow: .25, browY: -10 },
  dizzy: { eye: 'spiral', mouth: 'wavy', blush: .8 },
  tipsy: { eye: 'happy', mouth: 'grin', mo: .8, blush: 1, wobbleHead: 1 },
  sleepy: { eye: 'closed', mouth: 'o', mo: .4, zzz: 1 },
  thinking: { eye: 'open', mouth: 'flat', look: [.6, -.7], brow: .12 },
  yummy: { eye: 'happy', mouth: 'tongue', mo: 1, blush: .7 },
  hot: { eye: 'wide', mouth: 'o', mo: 1.2, red: 1, sweat: 1, steam: 1 },
  determined: { eye: 'open', mouth: 'smirk', brow: -.3, browY: 4 },
  nervous: { eye: 'open', mouth: 'wavy', sweat: 1, brow: .3, look: [.8, 0] },
  cool: { eye: 'open', mouth: 'smirk', shades: 1 },
};
const EXPR_NAMES = Object.keys(EXPR);

// ---------------------------------------------------------------- poses
// return joint targets in body space. b = BODY metrics, t = time
const POSE = {
  stand: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .64, -b.leg - 8] }),
  wave: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.head * 1.3 + Math.sin(t * 12) * 14, -b.leg - b.torso - 55 + Math.cos(t * 12) * 6] }),
  point: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * 1.45, -b.leg - b.torso * .8] }),
  pointUp: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.head * 1.25, -b.leg - b.torso - 95] }),
  cheer: (b, t) => ({ hL: [-b.head * 1.35, -b.leg - b.torso - 70 + Math.sin(t * 10) * 6], hR: [b.head * 1.35, -b.leg - b.torso - 70 + Math.cos(t * 10) * 6], bob: Math.abs(Math.sin(t * 6)) * -10 }),
  thumbs: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .95, -b.leg - b.torso * .75], thumbR: 1 }),
  shrug: (b, t) => ({ hL: [-b.tw * 1.05, -b.leg - b.torso * .55], hR: [b.tw * 1.05, -b.leg - b.torso * .55], palmUp: 1, shoulderUp: 8 }),
  hips: (b, t) => ({ hL: [-b.tw * .6, -b.leg - 6], hR: [b.tw * .6, -b.leg - 6], elbowOut: 1 }),
  think: (b, t) => ({ front: 1, hL: [-b.tw * .2, -b.leg - b.torso * .45], hR: [b.tw * .18, -b.leg - b.torso - 30] }),
  hold: (b, t) => ({ hL: [-b.tw * .32, -b.leg - b.torso * .42], hR: [b.tw * .32, -b.leg - b.torso * .42] }),
  holdUp: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .55, -b.leg - b.torso * .62] }),
  present: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * 1.35, -b.leg - b.torso * .5], palmUp: 1 }),
  eat: (b, t) => ({ front: 1, hL: [-b.tw * .34, -b.leg - b.torso * .4], hR: [b.tw * .2, -b.leg - b.torso - 20 + Math.abs(Math.sin(t * 5)) * 30] }),
  photo: (b, t) => ({ front: 1, hL: [-b.tw * .28, -b.leg - b.torso - 40], hR: [b.tw * .28, -b.leg - b.torso - 40] }),
  facepalm: (b, t) => ({ front: 1, hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .05, -b.leg - b.torso - 45], headTilt: .12 }),
  scared: (b, t) => ({ front: 1, hL: [-b.tw * .55, -b.leg - b.torso - 10 + Math.sin(t * 40) * 3], hR: [b.tw * .55, -b.leg - b.torso - 10 + Math.cos(t * 40) * 3], shake: 2.5 }),
  clap: (b, t) => { const c = Math.abs(Math.sin(t * 9)); return { hL: [-b.tw * (.12 + c * .45), -b.leg - b.torso * .6], hR: [b.tw * (.12 + c * .45), -b.leg - b.torso * .6] }; },
  bow: (b, t) => ({ hL: [-b.tw * .25, -b.leg - b.torso * .2], hR: [b.tw * .25, -b.leg - b.torso * .2], lean: 0, headY: 18, headTilt: 0 }),
  carry: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.tw * .45, -b.leg - b.torso - 4] }),
  dance: (b, t) => ({ hL: [-b.head * 1.3, -b.leg - b.torso - 40 + Math.sin(t * 8) * 40], hR: [b.head * 1.3, -b.leg - b.torso - 40 - Math.sin(t * 8) * 40], bob: Math.abs(Math.sin(t * 8)) * -14, lean: Math.sin(t * 4) * .06 }),
  walk: (b, t) => {
    const ph = t * 7.5, s = Math.sin(ph), c = Math.cos(ph);
    return { hL: [-b.tw * .62, -b.leg - 14 + s * 18], hR: [b.tw * .62, -b.leg - 14 - s * 18], fL: [-b.tw * .22 + s * 6, -Math.max(0, c) * 22], fR: [b.tw * .22 - s * 6, -Math.max(0, -c) * 22], bob: -Math.abs(s) * 9, lean: s * .02 };
  },
  run: (b, t) => {
    const ph = t * 12, s = Math.sin(ph), c = Math.cos(ph);
    return { hL: [-b.tw * .7, -b.leg - b.torso * .4 + s * 34], hR: [b.tw * .7, -b.leg - b.torso * .4 - s * 34], fL: [-b.tw * .24 + s * 10, -Math.max(0, c) * 40], fR: [b.tw * .24 - s * 10, -Math.max(0, -c) * 40], bob: -Math.abs(s) * 18, lean: .04 };
  },
  sit: (b, t) => ({ hL: [-b.tw * .55, -b.leg * .62], hR: [b.tw * .55, -b.leg * .62], fL: [-b.tw * .3, 0], fR: [b.tw * .3, 0], hipY: -b.leg * .55, knees: 1 }),
  sitHold: (b, t) => ({ hL: [-b.tw * .3, -b.leg * .55 - b.torso * .45], hR: [b.tw * .3, -b.leg * .55 - b.torso * .45], fL: [-b.tw * .3, 0], fR: [b.tw * .3, 0], hipY: -b.leg * .55, knees: 1 }),
  toast: (b, t) => ({ hL: [-b.tw * .64, -b.leg - 8], hR: [b.head * 1.3, -b.leg - b.torso - 50] }),
  ride: (b, t) => ({ hL: [b.tw * .9, -b.leg - b.torso * .5], hR: [b.tw * 1.25, -b.leg - b.torso * .62], fL: [b.tw * .55, 6], fR: [b.tw * .75, 4], hipY: -b.leg * .78, knees: 2, ride: 1 }),
};
const POSE_NAMES = Object.keys(POSE);

// ---------------------------------------------------------------- the rig
function person(x, y, s, spec, o = {}) { const st = styleOf(spec); withCharStyle(st, () => _personRaw(x, y, s, styledSpec(spec, st), o, st)); }
function _personRaw(x, y, s, spec, o = {}, st = CHAR_STYLES.chibi) {
  if (o.view === 'back') spec = { ...spec, top: spec.top ? { ...spec.top, print: undefined } : spec.top, acc: (spec.acc || []).filter(a => !['lanyard', 'camera', 'medal', 'bag', 'silverring'].includes(a)) };
  const t = o.t || 0;
  const b = bodyOf(spec); if (st.face && !spec.faceShape) spec = { ...spec, faceShape: st.face };
  if (spec.build === 'stocky') { b.tw *= 1.14; b.legW *= 1.08; b.armW *= 1.08; }
  if (spec.build === 'slim') { b.tw *= .9; b.legW *= .92; b.armW *= .92; }
  if (spec.tall) { b.leg *= spec.tall; b.torso *= Math.sqrt(spec.tall); }
  const exPreset = typeof o.expr === 'string' ? EXPR[o.expr] : null;
  const ex = { ...EXPR.neutral, ...(spec.face || {}), ...(exPreset || {}), ...(typeof o.expr === 'object' ? o.expr : {}) };
  if (o.talk && o.viseme && o.viseme !== 'X') { const m = o.mouthOpen ?? .6, V = { M: ['flat', .4], F: ['flat', .5], A: ['laugh', .55 + .5 * m], E: ['grin', .4 + .3 * m], O: ['o', .55 + .5 * m], C: ['grin', .3 + .15 * m] }[o.viseme]; if (V) { ex.mouth = V[0]; ex.mo = V[1]; } }
  else if (o.talk && o.mouthOpen !== undefined) { const m = o.mouthOpen; if (m > .08) { ex.mouth = m > .45 ? 'o' : (ex.mouth === 'frown' ? 'frown' : 'grin'); ex.mo = m > .45 ? .55 + m * .7 : .45 + m; } }
  else if (o.talk) { const tt = o.t || 0, v = (Math.sin(tt * 23) + Math.sin(tt * 14.3 + 1) * .7 + Math.sin(tt * 7.1) * .4) / 2.1; if (v > -.15) { ex.mouth = v > .35 ? 'o' : (ex.mouth === 'frown' ? 'frown' : 'grin'); ex.mo = .55 + .7 * clamp(v + .15) * o.talk; } }
  const poseFn = typeof resolvePose === 'function' ? resolvePose(o.pose, o.talk > .3 && !o.hold && !o.still) : (typeof o.pose === 'function' ? o.pose : POSE[o.pose || 'stand'] || POSE.stand);
  const P = { hipY: -b.leg, bob: 0, lean: 0, headTilt: 0, headY: 0, fL: [-b.tw * .24, 0], fR: [b.tw * .24, 0], ...poseFn(b, t), ...(o.joints || {}) };
  // idle breathing
  const breathe = o.still ? 0 : Math.sin(t * 2.4 + (spec.seed || 0)) * 2.2;
  const shakeX = P.shake ? Math.sin(t * 60) * P.shake : 0;

  ctx.save(); ctx.translate(x + shakeX * s, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const sq = o.squash || 0; ctx.scale(1 + sq * .2, 1 - sq * .2);
  if (o.rot) ctx.rotate(o.rot);
  ctx.globalAlpha *= o.alpha ?? 1;
  LW = 6;
  if (!o.noShadow && !P.ride) shadowBlob(0, 2, b.tw * .75, .22);

  const hipY = P.hipY + P.bob + (o.jump || 0);
  const shY = hipY - b.torso + breathe * .3 - (P.shoulderUp || 0);
  const SL = [-b.tw * .44, shY + 14], SR = [b.tw * .44, shY + 14];
  const headC = [0, shY - b.head * .9 + P.headY + breathe * .6];

  ctx.save(); if (P.lean) { ctx.translate(0, hipY); ctx.rotate(P.lean); ctx.translate(0, -hipY); }
  // ---- 1. back layer accessories
  backLayer(spec, b, shY, hipY, t, o);
  // ---- 2. legs
  drawLegs(spec, b, hipY, P, t);
  // ---- 3. torso + bottoms
  drawBottom(spec, b, hipY, P, t);
  drawTop(spec, b, shY, hipY, t, o);
  frontAcc(spec, b, shY, hipY, t, o);
  // ---- 4. arms
  const hold = o.hold;
  const elbowBend = P.elbowOut ? 1.2 : 1;
  const arms = () => { drawArm(spec, b, SL, P.hL, -1 * elbowBend, false, P, t, null); drawArm(spec, b, SR, P.hR, 1 * elbowBend, P.thumbR, P, t, hold); };
  const head = () => { ctx.save(); ctx.translate(headC[0], headC[1]); const wh = ex.wobbleHead ? Math.sin(t * 3) * .12 : 0; ctx.rotate(P.headTilt + (o.headRot || 0) + wh); drawHead(spec, b, ex, t, o); ctx.restore(); };
  if (P.front) { head(); arms(); } else { arms(); head(); }
  // ---- 6. held prop over hand
  if (hold && !PROP[hold]?.behindHand) heldItem(hold, P.hR, o, t);
  ctx.restore();
  ctx.restore();
}
function heldItem(hold, h, o, t) {
  const sc = o.holdScale ?? .55;
  if (PROP[hold]) drawProp(hold, h[0], h[1] - (PROP[hold].gripY ?? 0) * sc, sc, o.holdOpts || {}, t);
}

// ---------------------------------------------------------------- legs
function drawLegs(spec, b, hipY, P, t) {
  const bot = spec.bottom || { type: 'pants', color: C.khaki };
  const longLeg = ['pants', 'jeans', 'aodaipants', 'cargo', 'wide'].includes(bot.type);
  const legCol = longLeg ? bot.color : (spec.legs || spec.skin);
  const w = longLeg ? b.legW * (bot.type === 'aodaipants' || bot.type === 'wide' ? 1.45 : 1.18) : b.legW;
  for (const side of [-1, 1]) {
    const H0 = [side * b.tw * .22, hipY + 6];
    const F = side < 0 ? P.fL : P.fR;
    let pts;
    if (P.knees) { // seated / riding: knee forward-out
      const K = P.ride ? [F[0] + 18, hipY + 6] : [side * b.tw * .42, hipY + b.leg * .1];
      pts = [H0, K, [F[0], F[1] - 10]];
    } else {
      const [K] = ik(H0, [F[0], F[1] - 10], b.leg * .52, b.leg * .52, side * -.25);
      pts = [H0, K, [F[0], F[1] - 10]];
    }
    // skin ankle under short bottoms
    limb(pts, w, legCol);
    if (longLeg && bot.cuff) { const e = pts[2]; line(e[0] - w * .6, e[1] - 6, e[0] + w * .6, e[1] - 6, 5, shade(bot.color, -.2)); }
    drawShoe(spec.shoes || 'sneaker', F, side, spec, P);
  }
}
function drawShoe(type, F, side, spec, P) {
  const [x, y] = F; const col = spec.shoeColor || '#3b2a22';
  if (type === 'barefoot') { sEll(x + side * 4, y - 6, 17, 9, spec.skin); return; }
  if (type === 'sandal' || type === 'flipflop') { sEll(x + side * 4, y - 5, 18, 8, spec.skin, { lw: 5 }); rr(x - 18 + side * 4, y - 3, 36, 7, 3, col, 4); line(x + side * 4, y - 12, x + side * 4, y - 3, 4, col); return; }
  if (type === 'boot') { sRR(x - 18 + side * 2, y - 30, 36, 30, 10, col); return; }
  if (type === 'heel') { sEll(x + side * 5, y - 7, 16, 9, col); return; }
  // sneaker
  sEll(x + side * 6, y - 8, 22, 12, col); rr(x - 16 + side * 6, y - 4, 44, 6, 3, '#f4efe6', 3);
}

// ---------------------------------------------------------------- bottoms
function drawBottom(spec, b, hipY, P, t) {
  const bot = spec.bottom || { type: 'pants', color: C.khaki }; const c = bot.color;
  const top = hipY - 8, hw = b.tw * .52;
  if (bot.type === 'shorts' || bot.type === 'cargo_shorts') {
    const len = 46;
    sPoly([[-hw, top], [hw, top], [hw + 6, top + len], [8, top + len], [0, top + len - 18], [-8, top + len], [-hw - 6, top + len]], c);
    if (bot.type === 'cargo_shorts') { rr(-hw - 2, top + 18, 22, 20, 4, shade(c, -.06), 4); rr(hw - 20, top + 18, 22, 20, 4, shade(c, -.06), 4); }
  } else if (['pants', 'jeans', 'cargo', 'aodaipants', 'wide'].includes(bot.type)) {
    sPoly([[-hw, top], [hw, top], [hw + 2, top + 30], [-hw - 2, top + 30]], c, { hi: null });
    if (bot.type === 'jeans') { line(-hw + 10, top + 4, -hw + 22, top + 22, 3, shade(c, .15)); line(hw - 10, top + 4, hw - 22, top + 22, 3, shade(c, .15)); }
  } else if (bot.type === 'skirt' || bot.type === 'longskirt' || bot.type === 'pleated' || bot.type === 'sarong') {
    const len = bot.type === 'skirt' ? 62 : (-top - 18) * (P.knees ? .55 : 1);
    const sway = Math.sin(t * 2.5) * 3;
    const flare = bot.type === 'pleated' ? 34 : bot.type === 'sarong' ? 8 : 22;
    const pts = [[-hw, top], [hw, top], [hw + flare + sway, top + len], [-hw - flare + sway, top + len]];
    sPoly(pts, c);
    ctx.save(); ctx.beginPath(); poly(pts, null, 0); ctx.clip();
    if (bot.type === 'pleated') {
      for (let i = -6; i <= 6; i++) line(i * 9, top + 4, i * 14 + sway, top + len, 2.5, shade(c, -.15));
      (bot.bands || []).forEach((bc, i) => { const yb = top + len * (.5 + i * .17); ctx.fillStyle = bc; ctx.fillRect(-200, yb, 400, len * .1); });
      if (bot.batik) { ctx.globalAlpha = .55; for (let i = -8; i < 8; i++) for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(i * 16 + sway + (j % 2) * 8, top + len * (.2 + j * .1), 3.5, 0, TAU); ctx.fillStyle = bot.batik; ctx.fill(); } }
    }
    if (bot.type === 'sarong' && bot.band) { ctx.fillStyle = bot.band; ctx.fillRect(-200, top + len - 26, 400, 18); }
    ctx.restore(); poly(pts, null, LW);
  }
  if (bot.belt) rr(-hw, top - 2, hw * 2, 10, 4, bot.belt, 4);
}

// ---------------------------------------------------------------- tops
function torsoPath(b, shY, hipY, flare = 0, len = 0) {
  const tw = b.tw / 2, bot = hipY + len;
  return () => { ctx.moveTo(-tw + 4, shY + 4); ctx.quadraticCurveTo(-tw - 4, shY + 10, -tw - 2, shY + 34); ctx.lineTo(-tw - 2 - flare, bot); ctx.quadraticCurveTo(0, bot + 6, tw + 2 + flare, bot); ctx.lineTo(tw + 2, shY + 34); ctx.quadraticCurveTo(tw + 4, shY + 10, tw - 4, shY + 4); ctx.quadraticCurveTo(0, shY - 4, -tw + 4, shY + 4); ctx.closePath(); };
}
function drawTop(spec, b, shY, hipY, t, o) {
  const top = spec.top || { type: 'tee', color: C.teal }; const c = top.color;
  const ty = top.type;
  let flare = 0, len = 4;
  if (ty === 'aodai') { // flowing panels first
    const sway = Math.sin(t * 2.2) * 6;
    const hem = -24;
    sPoly([[-b.tw * .36, hipY - 10], [b.tw * .36, hipY - 10], [b.tw * .3 + sway, hem], [-b.tw * .3 + sway, hem]], c, { inner: () => { if (top.pattern) aoDaiPattern(top, hipY, hem, sway); } });
  }
  if (ty === 'baba' || ty === 'hmong' || ty === 'dao' || ty === 'robe' || ty === 'jacket' || ty === 'leather' || ty === 'hoodie') len = 18;
  if (ty === 'thai') len = -40;
  if (ty === 'robe') { flare = 18; len = 40; }
  shaded(torsoPath(b, shY, hipY, flare, len), c, { sx: 12, sy: 6, hx: -6, hy: -4 });
  const tw = b.tw / 2;
  ctx.save(); ctx.beginPath(); torsoPath(b, shY, hipY, flare, len)(); ctx.clip();
  switch (ty) {
    case 'tee': if (top.print === 'star') star(0, shY + 46, 15, C.gold, 3); if (top.print === 'stripe') { for (let i = 0; i < 4; i++) { ctx.fillStyle = top.color2 || '#fff'; ctx.fillRect(-60, shY + 26 + i * 22, 120, 8); } } if (top.print === 'heart') heart(0, shY + 50, .8, C.red, 3); if (top.print === 'text') T(top.text || 'VN', 0, shY + 48, { size: Math.min(26, b.tw * .78 / Math.max(1, textW(top.text || 'VN', 1))), fill: top.color2 || '#fff', lw: 0 });
      ctx.beginPath(); ctx.arc(0, shY + 2, 16, .1 * Math.PI, .9 * Math.PI); fs(null, 4); break;
    case 'tank': break;
    case 'polo': case 'shirt':
      poly([[-16, shY], [0, shY + 22], [-24, shY + 16]], shade(c, .08), 4); poly([[16, shY], [0, shY + 22], [24, shY + 16]], shade(c, .08), 4);
      line(0, shY + 22, 0, hipY, 3, shade(c, -.2)); for (let i = 0; i < 4; i++) circ(4, shY + 34 + i * 22, 3, '#fff', 2);
      if (top.pattern === 'floral') floral(c, shY, hipY, top.color2 || C.yel);
      if (top.pocket) rr(-tw + 14, shY + 30, 24, 22, 3, shade(c, -.05), 3); break;
    case 'longsleeve': ctx.beginPath(); ctx.arc(0, shY + 2, 16, .1 * Math.PI, .9 * Math.PI); fs(null, 4); break;
    case 'hoodie': rr(-26, shY + 56, 52, 26, 8, shade(c, -.06), 4); line(-8, shY + 8, -10, shY + 40, 3, '#fff'); line(8, shY + 8, 10, shY + 40, 3, '#fff'); break;
    case 'jacket': case 'leather': {
      const inner = top.inner || '#fff';
      poly([[-14, shY], [14, shY], [10, hipY + len], [-10, hipY + len]], inner, 3);
      line(-12, shY + 2, -14, hipY + len, 4); line(12, shY + 2, 14, hipY + len, 4);
      poly([[-14, shY], [-30, shY + 40], [-12, shY + 46]], shade(c, -.08), 4); poly([[14, shY], [30, shY + 40], [12, shY + 46]], shade(c, -.08), 4);
      if (ty === 'leather') { line(-tw + 14, shY + 70, -18, shY + 74, 3, '#999'); } break; }
    case 'aodai':
      rr(-12, shY - 6, 24, 14, 5, c, 4); // collar
      ctx.beginPath(); ctx.moveTo(0, shY + 6); ctx.quadraticCurveTo(-tw * .8, shY + 18, -tw * .5, shY + 46); fs(null, 3, shade(c, -.25));
      for (let i = 0; i < 3; i++) circ(-tw * .42 - i * 4, shY + 14 + i * 12, 2.6, C.gold, 1.5);
      if (top.pattern) aoDaiPattern(top, shY + 30, hipY, 0); break;
    case 'baba':
      ctx.beginPath(); ctx.arc(0, shY + 2, 14, .1 * Math.PI, .9 * Math.PI); fs(null, 4);
      line(0, shY + 16, 0, hipY + len, 3, shade(c, -.18)); for (let i = 0; i < 5; i++) circ(-5, shY + 22 + i * 20, 3, shade(c, .25), 1.5);
      rr(-tw + 8, hipY - 16, 24, 20, 3, null, 3); rr(tw - 32, hipY - 16, 24, 20, 3, null, 3); break;
    case 'hmong': { // Black Hmong (Sa Pa): indigo jacket with embroidered bands on collar & front
      const bands = top.bands || [C.red, C.gold, '#3fa36b', '#3a7bd5'];
      bands.forEach((bc, i) => { ctx.beginPath(); ctx.moveTo(-tw * .9 + i * 4, shY + 6); ctx.lineTo(-10 + i * 3, hipY + len); ctx.lineWidth = 6; ctx.strokeStyle = bc; ctx.stroke(); ctx.beginPath(); ctx.moveTo(tw * .9 - i * 4, shY + 6); ctx.lineTo(10 - i * 3, hipY + len); ctx.stroke(); });
      if (top.apron) { rr(-tw * .55, hipY - 34, tw * 1.1, 60, 6, top.apron, 4); for (let i = 0; i < 3; i++) { ctx.fillStyle = bands[i]; ctx.fillRect(-tw * .55, hipY - 26 + i * 12, tw * 1.1, 5); } }
      break; }
    case 'flowerhmong': { // Flower Hmong (Bac Ha): very colourful stacked bands
      const bands = top.bands || [C.pink, C.gold, '#3fa36b', C.red, '#3a7bd5', C.orange];
      for (let i = 0; i < 9; i++) { ctx.fillStyle = bands[i % bands.length]; ctx.fillRect(-80, shY + 30 + i * 11, 160, 8); }
      ctx.fillStyle = shade(c, -.05); ctx.fillRect(-tw * .35, shY - 4, tw * .7, 30);
      for (let i = -3; i <= 3; i++) circ(i * 10, shY + 30 + (i % 2) * 3, 3, C.gold, 1.5); break; }
    case 'dao': { // Red Dao: dark jacket, red embroidered front borders, red pompoms
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-14, shY); ctx.lineTo(-22, hipY + len); ctx.lineTo(-6, hipY + len); ctx.lineTo(-4, shY); ctx.fill(); ctx.beginPath(); ctx.moveTo(14, shY); ctx.lineTo(22, hipY + len); ctx.lineTo(6, hipY + len); ctx.lineTo(4, shY); ctx.fill();
      for (let i = 0; i < 6; i++) { sCirc(-16, shY + 18 + i * 16, 7, '#e8302a', { lw: 3 }); sCirc(16, shY + 18 + i * 16, 7, '#e8302a', { lw: 3 }); }
      for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? C.gold : '#fff'; ctx.fillRect(-tw - 4 + i * 9, hipY - 6, 4, 4); } break; }
    case 'thai': // White Thai: fitted blouse with row of silver butterfly buttons
      for (let i = 0; i < 6; i++) { const yy = shY + 16 + i * 12; ctx.save(); ctx.translate(0, yy); ell(-6, 0, 6, 4, '#e6e8ec', 2); ell(6, 0, 6, 4, '#e6e8ec', 2); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, shY + 2, 12, .1 * Math.PI, .9 * Math.PI); fs(null, 3); break;
    case 'robe': // monk robe draped over one shoulder
      ctx.beginPath(); ctx.moveTo(-tw - 6, shY + 8); ctx.quadraticCurveTo(0, shY + 60, tw + 10, hipY + 10); fs(null, 4, shade(c, -.25));
      ctx.beginPath(); ctx.moveTo(-tw, shY + 40); ctx.quadraticCurveTo(0, shY + 90, tw, hipY + 30); fs(null, 3, shade(c, -.2)); break;
    case 'vest': poly([[-14, shY], [14, shY], [6, hipY], [-6, hipY]], top.inner || '#fff', 3); for (let i = 0; i < 3; i++) circ(-18, shY + 40 + i * 20, 3, C.gold, 1.5); break;
    case 'uniform': rr(-tw + 10, shY + 26, 24, 18, 3, null, 3); rr(tw - 34, shY + 26, 24, 18, 3, null, 3); line(0, shY + 10, 0, hipY, 3, shade(c, -.2)); star(-tw + 22, shY + 14, 7, C.gold, 2); break;
  }
  ctx.restore();
  if (top.belt) rr(-tw - 2, hipY - 14, b.tw + 4, 12, 4, top.belt, 4);
  if (top.sash) { ctx.save(); rr(-tw - 2, hipY - 22, b.tw + 4, 18, 6, top.sash, 4); ctx.restore(); }
}
function aoDaiPattern(top, y0, y1, sway) {
  ctx.save(); ctx.globalAlpha = .9; const r = rng(top.seed || 5);
  for (let i = 0; i < 9; i++) { const x = (r() - .5) * 60 + sway * (i / 9), y = lerp(y0, y1, r()); const pc = top.pattern === 'lotus' ? C.pink : top.color2 || C.gold;
    for (let k = 0; k < 5; k++) { const a = k * TAU / 5; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 6, 3.5, a, 0, TAU); ctx.fillStyle = pc; ctx.fill(); }
    circ(x, y, 2.5, '#fff', 0); }
  ctx.restore();
}
function floral(c, y0, y1, c2) { const r = rng(9); ctx.save(); for (let i = 0; i < 14; i++) { const x = (r() - .5) * 110, y = lerp(y0, y1, r()); for (let k = 0; k < 4; k++) { const a = k * TAU / 4; circ(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 4, c2, 0); } circ(x, y, 2.5, '#fff', 0); } ctx.restore(); }

// ---------------------------------------------------------------- arms
function drawArm(spec, b, S, Hd, bend, thumb, P, t, hold) {
  const top = spec.top || {}; const sleeveCol = top.sleeve || top.color;
  const [El, Hh] = ik(S, Hd, b.arm, b.fore, bend * (Hd[1] > S[1] + 40 ? .45 : .9));
  const sleeves = { tee: 'short', polo: 'short', shirt: top.long ? 'long' : 'short', tank: 'none', longsleeve: 'long', hoodie: 'long', jacket: 'long', leather: 'long', aodai: 'long', baba: 'long', hmong: 'long', flowerhmong: 'long', dao: 'long', thai: 'long', robe: 'short', vest: 'none', uniform: 'long' }[top.type] || 'short';
  if (sleeves === 'long') {
    limb([S, El, Hh], b.armW * 1.25, sleeveCol);
    if (top.cuffs) { const dx = Hh[0] - El[0], dy = Hh[1] - El[1], d = Math.hypot(dx, dy); const cx = Hh[0] - dx / d * 12, cy = Hh[1] - dy / d * 12; top.cuffs.forEach((cc, i) => { ctx.beginPath(); ctx.arc(cx - dx / d * i * 7, cy - dy / d * i * 7, b.armW * .62, 0, TAU); ctx.fillStyle = cc; ctx.fill(); }); }
  } else {
    limb([S, El, Hh], b.armW, spec.skin);
    if (sleeves === 'short') { const mid = [lerp(S[0], El[0], .62), lerp(S[1], El[1], .62)]; limb([S, mid], b.armW * 1.4, sleeveCol); }
  }
  // hand
  if (hold && PROP[hold]?.behindHand) heldItem(hold, Hh, { hold }, t);
  sCirc(Hh[0], Hh[1], b.hand, spec.skin, { lw: 5 });
  if (thumb) { ctx.save(); ctx.translate(Hh[0], Hh[1]); sRR(-5, -b.hand * 2.3, 11, b.hand * 1.6, 5, spec.skin, { lw: 4 }); ctx.restore(); }
  if (spec.bracelet) { ctx.beginPath(); ctx.arc(lerp(El[0], Hh[0], .8), lerp(El[1], Hh[1], .8), b.armW * .55, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = spec.bracelet; ctx.stroke(); }
}

// ---------------------------------------------------------------- back & front accessories
function backLayer(spec, b, shY, hipY, t, o) {
  const acc = spec.acc || [];
  const hair = spec.hair || {};
  if (acc.includes('gui')) { // conical back basket (Hmong/Dao)
    sPoly([[-b.tw * .7, shY - 30], [b.tw * .7, shY - 30], [b.tw * .45, hipY + 10], [-b.tw * .45, hipY + 10]], '#c99a5b', { inner: () => { for (let i = 0; i < 8; i++) line(-80, shY - 20 + i * 18, 80, shY - 20 + i * 18, 2.5, '#8a6235'); for (let i = -6; i <= 6; i++) line(i * 12, shY - 30, i * 8, hipY + 10, 2, '#a27a45'); } });
    rr(-b.tw * .74, shY - 38, b.tw * 1.48, 14, 6, '#8a6235', 4);
    if (spec.guiFill) for (let i = 0; i < 5; i++) sCirc(-36 + i * 18, shY - 40 - (i % 2) * 8, 13, spec.guiFill, { lw: 4 });
  }
  if (acc.includes('backpack')) sRR(-b.tw * .62, shY - 6, b.tw * 1.24, b.torso * .8, 24, spec.packColor || C.orange);
  if (acc.includes('bigpack')) { sRR(-b.tw * .66, shY - 70, b.tw * 1.32, b.torso + 50, 26, spec.packColor || C.orange); sRR(-b.tw * .5, shY - 92, b.tw, 30, 12, '#4a7bb7', { lw: 5 }); }
  if (['long', 'ponytail', 'braid', 'twin', 'longwavy'].includes(hair.style)) hairBack(hair, b, shY, t);
}
function frontAcc(spec, b, shY, hipY, t, o) {
  const acc = spec.acc || []; const tw = b.tw / 2;
  if (acc.includes('backpack') || acc.includes('bigpack')) { line(-tw + 12, shY + 4, -tw + 14, shY + b.torso * .7, 7, spec.strapColor || shade(spec.packColor || C.orange, -.2)); line(tw - 12, shY + 4, tw - 14, shY + b.torso * .7, 7, spec.strapColor || shade(spec.packColor || C.orange, -.2)); }
  if (acc.includes('khanran')) { // Southern checked scarf
    ctx.save(); sPoly([[-tw + 2, shY + 2], [tw - 2, shY + 2], [tw * .5, shY + 26], [-tw * .5, shY + 26]], '#fafafa', { inner: () => { for (let i = -6; i < 7; i++) { ctx.fillStyle = 'rgba(40,40,40,.85)'; ctx.fillRect(i * 9, shY, 4, 30); ctx.fillRect(-60, shY + 6 + (i + 6) % 3 * 7, 120, 3); } } });
    sPoly([[tw * .3, shY + 18], [tw * .55, shY + 18], [tw * .62, shY + 64], [tw * .3, shY + 58]], '#fafafa', { inner: () => { for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(40,40,40,.85)'; ctx.fillRect(tw * .3 + i * 7, shY + 18, 3, 48); } } }); ctx.restore();
  }
  if (acc.includes('bandana')) poly([[-24, shY + 2], [24, shY + 2], [0, shY + 28]], spec.bandanaColor || C.red, 5);
  if (acc.includes('silverring')) { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, shY + 8 + i * 9, tw * .55 - i * 4, 10, 0, 0, Math.PI); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = '#e8eaee'; ctx.stroke(); } }
  if (acc.includes('camera')) { pline([[-tw + 8, shY + 2], [0, shY + 62], [tw - 8, shY + 2]], 4, '#333'); drawProp('camera', 0, shY + 70, .42); }
  if (acc.includes('bag')) { pline([[-tw + 4, shY + 2], [tw + 6, hipY - 10]], 6, spec.bagColor || '#7a4a2a'); sRR(tw - 6, hipY - 34, 40, 34, 8, spec.bagColor || '#7a4a2a', { lw: 5 }); }
  if (acc.includes('lanyard')) { pline([[-16, shY + 2], [0, shY + 54], [16, shY + 2]], 4, C.brand); sRR(-14, shY + 50, 28, 34, 4, '#fff', { lw: 4 }); line(-7, shY + 62, 7, shY + 62, 3, C.brand); }
  if (acc.includes('medal')) { pline([[-14, shY + 2], [0, shY + 40], [14, shY + 2]], 5, C.red); sCirc(0, shY + 48, 12, C.gold, { lw: 4 }); }
}

// ---------------------------------------------------------------- hair
function hairBack(h, b, shY, t) {
  const r = b.head, col = h.color || HAIR.black, sway = Math.sin(t * 2) * 4;
  const hc = shY - r * .9;
  if (h.style === 'long' || h.style === 'longwavy') sSmooth([[-r * .95, hc - r * .2], [-r * 1.05, hc + r * .9], [-r * .7 + sway, shY + 60], [0, shY + 70], [r * .7 + sway, shY + 60], [r * 1.05, hc + r * .9], [r * .95, hc - r * .2], [0, hc - r * 1.05]], col, { hiA: .3 });
  if (h.style === 'ponytail') { sSmooth([[r * .5, hc - r * .5], [r * 1.25 + sway, hc - r * .1], [r * 1.2 + sway * 2, hc + r * .9], [r * .95 + sway * 2, hc + r * 1.25], [r * .8, hc + r * .2]], col); circ(r * .72, hc - r * .42, 10, h.tie || C.brand, 4); }
  if (h.style === 'braid') { for (let i = 0; i < 6; i++) sEll(r * .62 + Math.sin(i + t * 2) * 3, hc + r * .5 + i * 22, 15 - i, 13, col, { lw: 4 }); circ(r * .62, hc + r * .5 + 6 * 22, 8, h.tie || C.red, 4); }
  if (h.style === 'twin') for (const sd of [-1, 1]) { sSmooth([[sd * r * .7, hc - r * .3], [sd * (r * 1.25), hc + r * .1], [sd * (r * 1.15) + sway, hc + r * 1.1], [sd * r * .85, hc + r * .3]], col); }
}
function hairFront(h, r, t, o) {
  const col = h.color || HAIR.black, st = h.style || 'short', wind = o.wind || 0;
  const W_ = (i) => wind * (6 + Math.sin(t * 24 + i) * 5);
  switch (st) {
    case 'bald': ctx.save(); ctx.globalAlpha = .35; ell(-r * .35, -r * .62, r * .25, r * .12, '#fff', 0, -.4); ctx.restore(); break;
    case 'buzz': ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); ctx.beginPath(); ctx.arc(0, r * .05, r * 1.02, Math.PI * 1.08, Math.PI * 1.92); ctx.lineTo(r, -r * .2); ctx.lineTo(-r, -r * .2); ctx.closePath(); ctx.fillStyle = rgba(col, .85); ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.arc(0, 0, r, Math.PI * 1.1, Math.PI * 1.9); fs(null, LW); break;
    case 'spiky': {
      ctx.beginPath(); ctx.moveTo(-r * .98, -r * .1); const n = 7;
      for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI, q = i % 2 ? r * 1.04 : r * 1.28; ctx.lineTo(Math.cos(a) * q - W_(i) * (i / n) * 2, Math.sin(a) * q - (i % 2 ? 0 : 6)); }
      ctx.lineTo(r * .98, -r * .1); ctx.quadraticCurveTo(r * .5, -r * .5, 0, -r * .42); ctx.quadraticCurveTo(-r * .55, -r * .5, -r * .98, -r * .1); ctx.closePath();
      const p = new Path2D(); shaded(() => { ctx.moveTo(-r * .98, -r * .1); for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI, q = i % 2 ? r * 1.04 : r * 1.28; ctx.lineTo(Math.cos(a) * q - W_(i) * (i / n) * 2, Math.sin(a) * q - (i % 2 ? 0 : 6)); } ctx.lineTo(r * .98, -r * .1); ctx.quadraticCurveTo(r * .5, -r * .5, 0, -r * .42); ctx.quadraticCurveTo(-r * .55, -r * .5, -r * .98, -r * .1); ctx.closePath(); }, col, { sx: 8, sy: 10 }); break; }
    case 'short': case 'grey_short': case 'side':
      shaded(() => { ctx.moveTo(-r * 1.0, -r * .05); ctx.bezierCurveTo(-r * 1.08, -r * 1.05, r * 1.08, -r * 1.12, r * 1.0, -r * .05); ctx.quadraticCurveTo(r * .86, -r * .48, r * .35, -r * .52); ctx.quadraticCurveTo(st === 'side' ? -r * .1 : 0, -r * .3 - W_(1), -r * .25, -r * .55); ctx.quadraticCurveTo(-r * .8, -r * .5, -r * 1.0, -r * .05); ctx.closePath(); }, col, { sx: 8, sy: 10 }); break;
    case 'curly': case 'afro': { const big = st === 'afro' ? 1.35 : 1.12; const pts = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * .95 + i / 10 * Math.PI * 1.1; pts.push([Math.cos(a) * r * big, Math.sin(a) * r * big * .95 - r * .05]); }
      for (const [px, py] of pts) sCirc(px, py, r * .3, col, { lw: 5 }); ctx.beginPath(); ctx.ellipse(0, -r * .55, r * .95, r * .45, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); break; }
    case 'bob': case 'long': case 'longwavy': case 'ponytail': case 'braid': case 'twin': case 'bun': case 'topknot': {
      // fringe / bangs
      const side = st === 'bob' ? r * 1.12 : r * 1.06;
      shaded(() => { ctx.moveTo(-side, st === 'bob' ? r * .55 : -r * .05); ctx.bezierCurveTo(-r * 1.15, -r * 1.12, r * 1.15, -r * 1.12, side, st === 'bob' ? r * .55 : -r * .05); if (st === 'bob') ctx.lineTo(r * .8, r * .55); ctx.quadraticCurveTo(r * .9, -r * .3, r * .3, -r * .45); ctx.quadraticCurveTo(0, -r * .2, -r * .3, -r * .48 - W_(2)); ctx.quadraticCurveTo(-r * .9, -r * .3, st === 'bob' ? -r * .8 : -side, st === 'bob' ? r * .55 : -r * .05); ctx.closePath(); }, col, { sx: 8, sy: 10 });
      if (st === 'bun' || st === 'topknot') { sCirc(0, -r * 1.12, r * (st === 'bun' ? .36 : .26), col, { lw: 5 }); if (h.pin) line(-r * .4, -r * 1.25, r * .4, -r * 1.05, 4, h.pin); }
      break; }
  }
  if (st === 'grey_short' || h.grey) { ctx.save(); ctx.globalAlpha = .35; ell(-r * .4, -r * .7, r * .25, r * .1, '#fff', 0, -.3); ctx.restore(); }
}

// ---------------------------------------------------------------- headwear
function headwear(hw, r, t, o) {
  if (!hw) return; const ty = hw.type || hw; const c = hw.color;
  switch (ty) {
    case 'nonla': { // conical hat — the icon
      const tilt = hw.tilt || 0; ctx.save(); ctx.rotate(tilt);
      ctx.save(); ctx.globalAlpha *= .8; pline([[-r * .95, -r * .25], [-r * .62, r * .82], [0, r * 1.02], [r * .62, r * .82], [r * .95, -r * .25]], 2.5, '#9b7a45'); ctx.restore();
      shaded(() => { ctx.moveTo(-r * 1.7, -r * .38); ctx.quadraticCurveTo(0, -r * .1, r * 1.7, -r * .38); ctx.lineTo(0, -r * 1.55); ctx.closePath(); }, c || '#ecd59a', { sx: 14, sy: 4, hx: -8, hy: -2, inner: () => { for (let i = 1; i < 6; i++) { ctx.beginPath(); const yy = lerp(-r * 1.55, -r * .3, i / 6); const xx = lerp(0, r * 1.7, i / 6); ctx.moveTo(-xx, yy + (i / 6) * r * .02); ctx.quadraticCurveTo(0, yy + r * .2 * (i / 6), xx, yy); ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(150,110,50,.55)'; ctx.stroke(); } } });
      ctx.restore(); break; }
    case 'helmet': {
      shaded(() => { ctx.arc(0, -r * .08, r * 1.06, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); }, c || C.yel, { sx: 12, sy: 6 });
      rr(-r * 1.12, -r * .2, r * 2.24, r * .2, 8, shade(c || C.yel, -.15), 5);
      if (hw.visor) { ctx.save(); ctx.globalAlpha = .7; rr(-r * .7, -r * .18, r * 1.4, r * .26, 8, '#9fd4e6', 4); ctx.restore(); }
      pline([[-r * .9, -r * .05], [-r * .65, r * .72]], 4); pline([[r * .9, -r * .05], [r * .65, r * .72]], 4);
      if (hw.logo) star(0, -r * .6, r * .16, '#fff', 3); break; }
    case 'cap': shaded(() => { ctx.arc(0, -r * .15, r * 1.0, Math.PI * 1.05, Math.PI * 1.95); ctx.closePath(); }, c || C.blue); sEll(r * .55 * (hw.back ? -1 : 1), -r * .28, r * .7, r * .16, shade(c || C.blue, -.1), { lw: 5 }); circ(0, -r * 1.12, 6, shade(c || C.blue, -.2), 3); break;
    case 'bucket': shaded(() => { ctx.moveTo(-r * 1.3, -r * .35); ctx.quadraticCurveTo(0, -r * .1, r * 1.3, -r * .35); ctx.lineTo(r * .85, -r * .72); ctx.quadraticCurveTo(r * .8, -r * 1.25, 0, -r * 1.25); ctx.quadraticCurveTo(-r * .8, -r * 1.25, -r * .85, -r * .72); ctx.closePath(); }, c || '#c9a66b'); line(-r * .86, -r * .6, r * .86, -r * .6, 5, shade(c || '#c9a66b', -.2)); break;
    case 'beanie': shaded(() => { ctx.arc(0, -r * .2, r * 1.02, Math.PI, 0); ctx.lineTo(r * 1.02, -r * .2); ctx.closePath(); }, c || C.red); rr(-r * 1.06, -r * .38, r * 2.12, r * .3, 10, shade(c || C.red, -.1), 5); sCirc(0, -r * 1.28, r * .2, '#fff', { lw: 4 }); break;
    case 'hmongwrap': // indigo/black cylindrical turban
      sRR(-r * 1.02, -r * 1.25, r * 2.04, r * .78, r * .3, c || '#26243a', { inner: () => { for (let i = 0; i < 4; i++) line(-r * 1.1, -r * 1.12 + i * r * .17, r * 1.1, -r * 1.05 + i * r * .17, 3, 'rgba(255,255,255,.12)'); } }); break;
    case 'flowerhmong': // checked colourful headscarf
      sRR(-r * 1.12, -r * 1.3, r * 2.24, r * .82, r * .35, c || C.pink, { inner: () => { for (let i = -6; i < 7; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,220,60,.8)' : 'rgba(40,160,110,.75)'; ctx.fillRect(i * r * .18, -r * 1.4, r * .07, r); ctx.fillRect(-r * 1.2, -r * 1.25 + (i + 6) % 4 * r * .2, r * 2.4, r * .05); } } });
      for (let i = 0; i < 5; i++) { line(r * (.9 + i * .04), -r * .5, r * (.95 + i * .05), -r * .1 + Math.sin(t * 3 + i) * 3, 3, [C.gold, C.red, '#3fa36b'][i % 3]); } break;
    case 'daoturban': // Red Dao: large red turban with tassels
      sEll(0, -r * .9, r * 1.32, r * .62, c || '#d4261f', { inner: () => { for (let i = 0; i < 5; i++) line(-r * 1.4, -r * 1.2 + i * r * .15, r * 1.4, -r * 1.1 + i * r * .15, 3, 'rgba(120,10,10,.35)'); } });
      for (let i = -5; i <= 5; i++) { const xx = i * r * .2; const sw = Math.sin(t * 3 + i) * 3; line(xx, -r * .38, xx + sw, -r * .1, 5, i % 2 ? C.gold : '#ff4a3a'); circ(xx + sw, -r * .08, 4, i % 2 ? C.gold : '#ff4a3a', 0); }
      sCirc(-r * 1.1, -r * .95, r * .18, '#ff4a3a', { lw: 4 }); sCirc(r * 1.1, -r * .95, r * .18, '#ff4a3a', { lw: 4 }); break;
    case 'thai': // khăn piêu: black embroidered scarf folded on top
      sRR(-r * .95, -r * 1.18, r * 1.9, r * .5, r * .2, c || '#1f1d24', { inner: () => { for (let i = -4; i <= 4; i++) { circ(i * r * .2, -r * .95, 3.5, [C.red, C.gold, '#3fa36b', C.pink][(i + 8) % 4], 0); } } });
      sPoly([[r * .7, -r * .9], [r * 1.25, -r * .6], [r * 1.1, -r * .4], [r * .65, -r * .7]], c || '#1f1d24', { lw: 4 }); break;
    case 'headband': rr(-r * 1.02, -r * .62, r * 2.04, r * .2, 6, c || C.red, 4); break;
    case 'beret': sEll(-r * .15, -r * .82, r * 1.0, r * .38, c || '#3a3a5a', {}, -.15); break;
    case 'flower': for (let k = 0; k < 5; k++) { const a = k * TAU / 5; sCirc(r * .65 + Math.cos(a) * 11, -r * .7 + Math.sin(a) * 11, 9, c || C.pink, { lw: 3 }); } circ(r * .65, -r * .7, 6, C.gold, 3); break;
    case 'chef': sRR(-r * .8, -r * 1.85, r * 1.6, r * 1.0, r * .4, '#fff'); rr(-r * .9, -r * 1.0, r * 1.8, r * .3, 8, '#f2f2f2', 5); break;
    case 'crown': { const g = c || C.gold; sPoly([[-r * .86, -r * .6], [-r * .9, -r * 1.3], [-r * .45, -r * .98], [0, -r * 1.5], [r * .45, -r * .98], [r * .9, -r * 1.3], [r * .86, -r * .6]], g, { lw: 4 }); line(-r * .86, -r * .74, r * .86, -r * .74, 4, shade(g, -.25)); circ(0, -r * .9, r * .13, C.red, 3); circ(-r * .55, -r * .86, r * .08, '#3fa3c9', 2); circ(r * .55, -r * .86, r * .08, '#3fa3c9', 2); break; }
    case 'mandarin': { const k = c || '#1d1b22'; for (const d of [-1, 1]) sEll(d * r * 1.22, -r * .92, r * .5, r * .17, k, { lw: 4 }, d * .12); sRR(-r * .82, -r * 1.36, r * 1.64, r * .82, r * .34, k, {}); line(-r * .8, -r * .72, r * .8, -r * .72, 4, '#c9a032'); break; }
    case 'conehat_mini': break;
  }
}

// ---------------------------------------------------------------- head & face
function drawHead(spec, b, ex, t, o) {
  const r = b.head; const skin = spec.skin;
  if (o.view === 'back') { // seen from behind: ears, back of the head (hair), headwear — no face
    sCirc(-r * .97, r * .05, r * .18, skin, { lw: 5 }); sCirc(r * .97, r * .05, r * .18, skin, { lw: 5 });
    const h = spec.hair || {}; const bald = ['bald', 'buzz'].includes(h.style); sCirc(0, 0, r, bald ? skin : (h.color || HAIR.black), { lw: 6 });
    if (!bald) { ctx.save(); ctx.globalAlpha = .25; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * r * .25, -r * .85); ctx.quadraticCurveTo(k * r * .32, 0, k * r * .2, r * .7); ctx.lineWidth = 4; ctx.strokeStyle = shade(h.color || HAIR.black, .35); ctx.stroke(); } ctx.restore(); }
    if (h.style === 'bun' || h.style === 'topknot') sCirc(0, -r * .55, r * .32, h.color, { lw: 5 }); if (h.style === 'ponytail') sEll(0, r * .55, r * .2, r * .45, h.color, { lw: 5 });
    headwear(o.headwear !== undefined ? o.headwear : spec.headwear, r, t, o); return; }
  // head turn (yaw −1…1: 0 = front, ±0.5 = three-quarter): features slide, far side compresses, far ear hides
  const look0 = (o.look || ex.look || [0, 0])[0]; const yaw = clamp(o.yaw ?? look0 * .32, -.95, .95), ay = Math.abs(yaw), ys = Math.sign(yaw); o._yaw = yaw;
  // ears
  for (const sd of [-1, 1]) { const far = sd === ys && ay > .05; if (far && ay > .3) continue; const ex_ = sd * r * .97 * (far ? 1 : 1 - .45 * ay * (sd === -ys ? 1 : 0)); sCirc(ex_, r * .05, r * .18, skin, { lw: 5 }); if (spec.earring) circ(ex_, r * .25, 5, spec.earring, 2.5); }
  // face
  shaded(() => { if (spec.faceShape === 'oval') ctx.ellipse(0, 0, r * .95, r * 1.03, 0, 0, TAU); else ctx.arc(0, 0, r, 0, TAU); }, skin, { sx: r * .16, sy: r * .12, hx: -r * .08, hy: -r * .1, shA: .75 });
  if (spec.age === 'elder' || spec.wrinkles) { ctx.save(); ctx.globalAlpha = .45; ctx.beginPath(); ctx.arc(-r * .58, r * .22, r * .12, -.6, .9); fs(null, 3, shade(skin, -.25)); ctx.beginPath(); ctx.arc(r * .58, r * .22, r * .12, Math.PI - .9, Math.PI + .6); fs(null, 3, shade(skin, -.25)); line(-r * .22, -r * .6, r * .22, -r * .6, 3, shade(skin, -.2)); ctx.restore(); }
  if (spec.freckles) { ctx.save(); ctx.globalAlpha = .55; for (const [fx, fy] of [[-.5, .12], [-.42, .2], [-.58, .22], [.5, .12], [.42, .2], [.58, .22]]) circ(fx * r, fy * r, 2.4, '#b06a40', 0); ctx.restore(); }
  if (ex.pale) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r - 3, 0, TAU); ctx.clip(); const g = ctx.createLinearGradient(0, -r, 0, r * .4); g.addColorStop(0, `rgba(110,200,95,${.7 * ex.pale})`); g.addColorStop(1, 'rgba(110,200,95,0)'); ctx.fillStyle = g; ctx.fillRect(-r, -r, r * 2, r * 1.6); ctx.restore(); }
  if (ex.red) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r - 3, 0, TAU); ctx.clip(); ctx.globalAlpha = .45 * ex.red; const g = ctx.createLinearGradient(0, r, 0, -r * .2); g.addColorStop(0, '#ff3b2f'); g.addColorStop(1, 'rgba(255,59,47,0)'); ctx.fillStyle = g; ctx.fillRect(-r, -r * .3, r * 2, r * 1.4); ctx.restore(); }
  // hair (front) & facial hair under headwear
  if (spec.beard) { ctx.save(); ctx.globalAlpha = spec.beard.a ?? .9; ctx.beginPath(); ctx.arc(0, 0, r - 1, .08 * Math.PI, .92 * Math.PI); ctx.arc(0, -r * .18, r * .86, .86 * Math.PI, .14 * Math.PI, true); ctx.closePath(); ctx.fillStyle = spec.beard.color || HAIR.brown; ctx.fill(); ctx.restore(); }
  { const fx = Math.sin(yaw * Math.PI / 2) * r * .42; ctx.save(); ctx.translate(fx, 0); window._CSFACE = 1; try { face(spec, r, ex, t, o); } finally { window._CSFACE = 0; } ctx.restore(); ctx.save(); ctx.translate(fx * .9, 0);
  if (spec.mustache) { ctx.beginPath(); ctx.moveTo(-r * .3, r * .36); ctx.quadraticCurveTo(-r * .12, r * .22, 0, r * .32); ctx.quadraticCurveTo(r * .12, r * .22, r * .3, r * .36); ctx.quadraticCurveTo(0, r * .42, -r * .3, r * .36); fs(spec.mustache, 3); }
  if (spec.goatee) { sPoly([[-r * .12, r * .78], [r * .12, r * .78], [0, r * 1.15]], spec.goatee, { lw: 3 }); } ctx.restore(); }
  const hw = o.headwear !== undefined ? o.headwear : spec.headwear;
  const hwType = hw && (hw.type || hw);
  if (!['helmet', 'hmongwrap', 'flowerhmong', 'daoturban', 'beanie', 'chef'].includes(hwType)) { ctx.save(); ctx.translate(Math.sin(yaw * Math.PI / 2) * r * .14, 0); hairFront(spec.hair || {}, r, t, o); ctx.restore(); }
  else if (spec.hair && ['long', 'bob', 'ponytail', 'braid', 'twin', 'longwavy'].includes(spec.hair.style) && hwType === 'helmet') { /* hair visible under helmet at sides */ sEll(-r * .9, r * .1, r * .2, r * .45, spec.hair.color, { lw: 4 }); sEll(r * .9, r * .1, r * .2, r * .45, spec.hair.color, { lw: 4 }); }
  headwear(hw, r, t, o);
  { const fx = Math.sin(yaw * Math.PI / 2) * r * .42; ctx.save(); ctx.translate(fx, 0); ctx.scale(1 - .18 * ay, 1);
  if (spec.glasses || o.glasses) glasses(r, spec.glasses || 'round');
  if (ex.shades || o.shades) shades(r, typeof o.shades === 'number' ? o.shades : 1); ctx.restore(); }
}
function glasses(r, kind) {
  ctx.save(); ctx.translate(0, -r * .02); const gw = r * .3;
  ctx.lineWidth = 5; ctx.strokeStyle = kind === 'gold' ? '#b48a2c' : C.ink;
  ctx.beginPath(); kind === 'square' ? ctx.roundRect(-r * .36 - gw * .5 - 4, -gw * .5, gw + 8, gw, 6) : ctx.arc(-r * .36, 0, gw * .62, 0, TAU); ctx.stroke();
  ctx.beginPath(); kind === 'square' ? ctx.roundRect(r * .36 - gw * .5 - 4, -gw * .5, gw + 8, gw, 6) : ctx.arc(r * .36, 0, gw * .62, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r * .17, -2); ctx.quadraticCurveTo(0, -8, r * .17, -2); ctx.stroke(); ctx.restore();
}
function shades(r, a) {
  ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(0, -r * .02 - (1 - clamp(a)) * r * .7);
  ctx.beginPath(); ctx.roundRect(-r * .66, -r * .18, r * .56, r * .38, 12); ctx.roundRect(r * .1, -r * .18, r * .56, r * .38, 12); fs('#17151c', 5);
  line(-r * .1, -r * .08, r * .1, -r * .08, 5); line(-r * .66, -r * .08, -r * .86, -r * .14, 5); line(r * .66, -r * .08, r * .86, -r * .14, 5);
  ctx.globalAlpha *= .8; line(-r * .55, -r * .08, -r * .4, r * .08, 4, '#fff'); line(r * .21, -r * .08, r * .36, r * .08, 4, '#fff'); ctx.restore();
}
function face(spec, r, ex, t, o) {
  const look = o.look || ex.look || [0, 0];
  const st = styleOf(spec); const es = (o.eyeScale || 1) * (spec.eyeSize || 1) * (st.eye === 'anime' ? 1.28 : 1);
  const blink = !o.noBlink && ((t + (spec.seed || 0) * .37) % 3.4) < .11 && ['open', 'wide', 'half'].includes(ex.eye);
  const ey = -r * .02, exs = r * .36;
  const yw = o._yaw || 0, ayw = Math.abs(yw), ysw = Math.sign(yw);
  for (const sd of [-1, 1]) {
    const far = sd === ysw && ayw > .05; const cx = sd * exs * (far ? 1 - .5 * ayw : 1 - .12 * ayw); let type = ex.eye;
    if (type === 'wink' && sd > 0) type = 'happy'; else if (type === 'wink') type = 'open';
    ctx.save(); ctx.translate(cx, ey); if (far) ctx.scale(1 - .45 * ayw, 1);
    const rx = r * .2 * es, ry = r * .24 * es;
    if (blink || type === 'closed') { ctx.beginPath(); ctx.arc(0, -ry * .1, rx * .9, .15 * Math.PI, .85 * Math.PI); fs(null, 5); }
    else if (type === 'happy') { ctx.beginPath(); ctx.arc(0, ry * .35, rx * .95, 1.15 * Math.PI, 1.85 * Math.PI); fs(null, 6); }
    else if (type === 'hearts') { const p = 1 + Math.sin(t * 12) * .12; heart(0, ry * .2, 1.25 * p * r / 84, C.red, 4); }
    else if (st.eye !== 'big' && st.eye !== 'anime' && ['open', 'wide', 'half'].includes(type)) {
      const wk = type === 'wide' ? 1.25 : 1, px = look[0] * rx * .25, py = look[1] * ry * .2;
      if (st.eye === 'dot') { ell(px, py, rx * .36 * wk, ry * .42 * wk, C.ink, 0); circ(px + rx * .12, py - ry * .16, rx * .1, '#fff', 0); }
      else if (st.eye === 'bean') { ell(px, py, rx * .4 * wk, ry * .74 * wk, C.ink, 0); circ(px + rx * .13, py - ry * .3, rx * .11, '#fff', 0); }
      else if (st.eye === 'line') { ctx.beginPath(); ctx.moveTo(-rx * .85, py + ry * .1); ctx.quadraticCurveTo(0, py - ry * .38 * wk, rx * .85, py + ry * .1); fs(null, 6); circ(px * .6, py + ry * .02, rx * .16, C.ink, 0); }
      else if (st.eye === 'pie') { ell(0, 0, rx * .58 * wk, ry * 1.02 * wk, C.ink, 0); ctx.save(); ctx.fillStyle = '#fff'; const cx2 = px * .5 + rx * .1, cy2 = py * .5 - ry * .32; ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.arc(cx2, cy2, rx * .24, -.3, -1.25, true); ctx.closePath(); ctx.fill(); ctx.restore(); }
      if (type === 'half') { ctx.fillStyle = spec.skin; ctx.fillRect(-rx * 2, -ry * 2, rx * 4, ry * 1.6); line(-rx * .9, -ry * .4, rx * .9, -ry * .4, 5); }
    }
    else if (type === 'tiny') { ell(0, 0, rx * 1.05, ry * 1.05, '#fff', 5); circ(look[0] * 3, look[1] * 3, rx * .22, C.ink, 0); }
    else {
      const sc = type === 'wide' ? 1.25 : 1;
      ell(0, 0, rx * sc, ry * sc, '#fff', 5);
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, rx * sc - 2, ry * sc - 2, 0, 0, TAU); ctx.clip();
      if (type === 'stars') star(0, 0, rx * 1.05 * (1 + Math.sin(t * 14) * .1), C.gold, 3, t * 2);
      else if (type === 'spiral') { ctx.beginPath(); const rot = t * 9 * sd; for (let a = 0; a < 14; a += .2) { const q = a * rx / 14; ctx.lineTo(Math.cos(a + rot) * q, Math.sin(a + rot) * q); } ctx.lineWidth = 3.5; ctx.strokeStyle = C.ink; ctx.stroke(); }
      else {
        const wb = ex.wobble ? [Math.sin(t * 31 + sd) * 2.5, Math.cos(t * 27) * 2.5] : [0, 0];
        const px = look[0] * rx * .42 + wb[0], py = look[1] * ry * .4 + wb[1];
        const pr = rx * .62 * (type === 'wide' ? .75 : 1);
        circ(px, py, pr, spec.eyeColor || '#3a2418', 0); circ(px, py, pr * .55, C.ink, 0);
        circ(px + pr * .35, py - pr * .4, pr * .32, '#fff', 0); circ(px - pr * .3, py + pr * .35, pr * .14, '#fff', 0);
      }
      if (type === 'half') { ctx.fillStyle = spec.skin; ctx.fillRect(-rx * 2, -ry * 2, rx * 4, ry * 1.85); line(-rx * 1.2, -ry * .15, rx * 1.2, -ry * .15, 5); }
      ctx.restore();
      if (spec.lashes || st.eye === 'anime') { pline([[sd * rx * .8, -ry * .7], [sd * rx * 1.25, -ry * 1.05]], 4); pline([[sd * rx * .35, -ry * .98], [sd * rx * .55, -ry * 1.35]], 4); }
    }
    ctx.restore();
  }
  // brows
  const bA = ex.brow || 0, bY = ey - r * .38 + (ex.browY || 0) - (ex.eye === 'wide' ? 6 : 0);
  const bc = spec.browColor || (spec.hair && spec.hair.color) || C.ink;
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * exs, bY); ctx.rotate(sd * bA); ctx.beginPath(); ctx.moveTo(-r * .15, 2); ctx.quadraticCurveTo(0, -4, r * .15, 2); ctx.lineWidth = spec.thickBrows ? 9 : 6; ctx.strokeStyle = bc === HAIR.white || bc === HAIR.grey ? shade(bc, -.25) : bc; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  // nose
  const nc = spec.sunburn ? '#ec8a78' : shade(spec.skin, -.1, .05);
  if (st.nose === 'dot') ell(0, r * .2, r * .085, r * .065, nc, 0); else if (st.nose === 'line') { ctx.beginPath(); ctx.moveTo(r * .02, r * .08); ctx.quadraticCurveTo(r * .1, r * .2, -r * .03, r * .24); fs(null, 4, shade(spec.skin, -.35)); }
  // blush
  const bl = Math.max(ex.blush || 0, (spec.blush ?? .25) * st.blush);
  if (bl) { ctx.save(); ctx.globalAlpha *= bl * .8; ell(-r * .52, r * .3, r * .16, r * .09, '#ff7f8a', 0); ell(r * .52, r * .3, r * .16, r * .09, '#ff7f8a', 0); ctx.restore(); }
  // mouth
  const m = ex.mouth || 'smile', mo = ex.mo ?? 1;
  ctx.save(); ctx.translate(0, r * .5);
  const lip = spec.lips || null;
  switch (m) {
    case 'smile': ctx.beginPath(); ctx.arc(0, -r * .14, r * .22 * (.7 + mo * .3), .2 * Math.PI, .8 * Math.PI); fs(null, 6, lip || C.ink); break;
    case 'flat': line(-r * .16, 0, r * .16, 2, 6); break;
    case 'frown': ctx.beginPath(); ctx.arc(0, r * .16, r * .19, 1.2 * Math.PI, 1.8 * Math.PI); fs(null, 6); break;
    case 'smirk': ctx.beginPath(); ctx.moveTo(-r * .16, 2); ctx.quadraticCurveTo(r * .06, 8, r * .2, -8); fs(null, 6); break;
    case 'wavy': ctx.beginPath(); for (let x = -r * .22; x <= r * .22; x += 2) ctx.lineTo(x, Math.sin(x * .45 + t * 20) * 4); fs(null, 5); break;
    case 'o': ell(0, r * .04, r * .12 * (.7 + mo * .4), r * .17 * mo, '#5a1f1f', 5); ell(0, r * .04 + r * .1 * mo, r * .08 * mo, r * .05 * mo, '#e25d6a', 0); break;
    case 'cry': ctx.beginPath(); ctx.moveTo(-r * .25, r * .1); ctx.quadraticCurveTo(0, -r * .2, r * .25, r * .1); ctx.quadraticCurveTo(0, 0, -r * .25, r * .1); fs('#5a1f1f', 5); break;
    case 'grin': case 'laugh': case 'tongue': {
      const w = r * .3, d = r * .38 * mo * (m === 'laugh' ? 1.2 : 1);
      const mp = () => { ctx.moveTo(-w, -r * .08); ctx.quadraticCurveTo(0, d, w, -r * .08); ctx.closePath(); };
      ctx.beginPath(); mp(); fs('#5a1f1f', 5);
      ctx.save(); ctx.beginPath(); mp(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-w, -r * .1, w * 2, r * .1 + 2);
      ell(0, d * .75, w * .45, r * .1, '#e25d6a', 0); ctx.restore();
      ctx.beginPath(); mp(); fs(null, 5);
      if (m === 'tongue') { sEll(r * .08, r * .14, r * .1, r * .13, '#e25d6a', { lw: 4 }); }
      break; }
  }
  ctx.restore();
  // FX on face
  if (ex.sweat) for (const [sx, sy, ph] of [[.75, -.55, 0], [-.8, -.35, .5]]) { const p = ((t * 1.3 + ph) % 1); ctx.save(); ctx.globalAlpha *= ex.sweat * (1 - p * .6); ctx.translate(sx * r, sy * r + p * 30); ctx.beginPath(); ctx.moveTo(0, -14); ctx.quadraticCurveTo(11, 3, 0, 9); ctx.quadraticCurveTo(-11, 3, 0, -14); fs('#8fd6ff', 4); ctx.restore(); }
  if (ex.tear || ex.tears) for (const sd of [-1, 1]) { const n = ex.tears ? 2 : 1; for (let k = 0; k < n; k++) { const p = ((t * 1.6 + k * .5) % 1); ctx.save(); ctx.globalAlpha *= (1 - p); ctx.translate(sd * exs + sd * 4, ey + r * .25 + p * r * .5); ell(0, 0, 6, 9, '#8fd6ff', 3); ctx.restore(); } }
  if (ex.anger) { ctx.save(); ctx.translate(r * .62, -r * .7); const s = 1 + Math.sin(t * 10) * .1; ctx.scale(s, s); for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(5, -16); ctx.quadraticCurveTo(5, -5, 16, -5); ctx.lineWidth = 6; ctx.strokeStyle = '#e8302a'; ctx.stroke(); } ctx.restore(); }
  if (ex.zzz) for (let k = 0; k < 3; k++) { const p = ((t * .6 + k / 3) % 1); T('z', r * (.9 + p * .6), -r * (.6 + p * .9), { size: 26 + k * 8, fill: '#fff', alpha: 1 - p, lw: 6 }); }
  if (ex.steam) for (let k = 0; k < 3; k++) { const p = ((t + k / 3) % 1); ctx.save(); ctx.globalAlpha *= (1 - p) * .8; circ((k - 1) * r * .5, -r * (1.1 + p * .8), 14 + p * 10, '#ffffff', 0); ctx.restore(); }
}
