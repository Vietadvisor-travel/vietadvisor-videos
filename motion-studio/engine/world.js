/* =====================================================================
   WORLD — life around the actors.
   · extras: pedestrians & scooters crossing behind the action (auto in city places; `extras=none|crowd|traffic|both`)
   · weather: rain with splashes, snow, petals, fog (`weather=` on any beat)
   · timelapse beat: one place from day → sunset → night with racing clouds and lights coming on
   · street3d kit: a one-point-perspective street for real depth (`set: s = kit=street3d palette=hoian`)
   ===================================================================== */
'use strict';
const CITY_PLACES = ['oldquarter', 'hanoi', 'saigon', 'benthanh', 'sidewalk', 'night_market', 'hoian', 'trainstreet', 'hue', 'dalat'];
const EXTRA_POOL = ['xeom', 'cophovn', 'banhmi', 'barista', 'grandma', 'kid', 'chef', 'lena', 'sofia', 'wei', 'ploy', 'jiwoo', 'kenji', 'lantern', 'fisher'];
// Extras walk on a real surface: each place says where its walkway is (`walk` = units above the ground line —
// the foot of the shop fronts / far pavement). Places without a known walkway get no automatic extras, so nobody
// ever walks on an awning or floats over a counter. In close shots extras fade out (they would sit at hip height).
const WALK = { sidewalk: 26, oldquarter: 10, hanoi1946: 64 };
function drawExtras(S, place, lt) {
  if (!place) return; const gen = (place.desc || '').includes('generated set') && /town|market|colonial|street/.test(place.desc);
  const walk = place.walk ?? WALK[place.id] ?? (gen ? 54 : null); if (walk == null) return;
  // automatic extras only in establishing / travel beats — never crowding the hero in talk, price, dialogue or payoff shots
  const beat = String(S.id || '').replace(/^\d+_/, ''), autoOk = ['ride', 'reveal', 'intro', 'route', 'title', 'timelapse', 'hook', 'moment', 'montage'].includes(beat);
  const mode = S.extras ?? (((CITY_PLACES.includes(place.id) || gen) && autoOk) ? 'both' : 'none'); if (mode === 'none') return;
  const sz = S._shotSize || 'WS', fade = { MCU: 0, CU: 0, ECU: 0, MS: 0, MLS: .55 }[sz] ?? 1; if (fade <= 0) return;
  const u = U(), gy = place.ground() - walk * u, used = new Set((S.layers || []).filter(l => l.type === 'char').map(l => l.id)); const pool = EXTRA_POOL.filter(id => CHAR[id] && !used.has(id)); if (!pool.length) return;
  const seed = (S.id || 'x').length * 13 + 7, r = rng(seed); const tag = LINT.tag; LINT.tag = 'bg';
  ctx.save(); ctx.globalAlpha *= .92 * fade;
  if (mode === 'both' || mode === 'crowd') for (let i = 0; i < 4; i++) { const dir = r() < .5 ? 1 : -1, sp = (60 + r() * 50) * u, span = W + 500 * u, x0 = r() * span; const x = ((x0 + dir * lt * sp) % span + span) % span - 250 * u; const id = pool[Math.floor(r() * pool.length)]; const sc = (.56 + r() * .06) * u;
    person(x, gy, sc, CHAR[id].spec, { t: lt + i * 1.3, pose: 'walk', expr: 'neutral', flip: dir < 0, noShadow: 0 }); }
  if (mode === 'both' || mode === 'traffic') for (let i = 0; i < 2; i++) { const dir = i % 2 ? -1 : 1, sp = (300 + r() * 140) * u, span = W + 1600 * u, x0 = r() * span; const x = ((x0 + dir * lt * sp) % span + span) % span - 600 * u; const id = pool[Math.floor(r() * pool.length)]; const bs = .58 * u;
    ctx.save(); if (dir < 0) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); } drawProp('moto', x, gy, bs, { spin: lt * 18, color: pick(['#d9443a', '#3a7bd5', '#e8e2d6', '#2f2f2f'], i + seed) }, lt); person(x - 40 * bs, gy - 36 * bs, bs * .92, CHAR[id].spec, { t: lt, pose: 'ride', expr: 'neutral', headwear: { type: 'helmet', color: pick([C.yel, '#3fa36b', '#e8e2d6'], i) }, noShadow: 1 }); ctx.restore(); }
  ctx.restore(); LINT.tag = tag;
}
function drawWeather(kind, lt, place) { if (!kind) return; const u = U(), gy = place ? place.ground() : H * .85;
  if (kind === 'rain') { ctx.save(); ctx.fillStyle = 'rgba(40,60,90,.16)'; ctx.fillRect(0, 0, W, H); const r = rng(5); ctx.strokeStyle = 'rgba(225,235,248,.55)'; ctx.lineWidth = 2.2 * u; ctx.beginPath();
    for (let i = 0; i < 300; i++) { const z = .4 + r() * .6, x = (r() * W * 1.3 + lt * 200 * u) % (W * 1.3) - W * .15, y = (r() * H + lt * 1500 * u * z) % H; ctx.moveTo(x, y); ctx.lineTo(x - 9 * u * z, y + 36 * u * z); } ctx.stroke();
    ctx.strokeStyle = 'rgba(235,242,250,.6)'; ctx.lineWidth = 2 * u; for (let i = 0; i < 26; i++) { const ph = ((lt * 2.2 + r()) % 1), x = r() * W, y = gy + 20 * u + r() * (H - gy - 30 * u); ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.ellipse(x, y, (4 + ph * 26) * u, (1.5 + ph * 7) * u, 0, 0, TAU); ctx.stroke(); } ctx.restore(); }
  else if (kind === 'fog') { hazeBand(gy - 140 * u, 260 * u, '#ffffff', .4); hazeBand(gy - 520 * u, 220 * u, '#ffffff', .25); }
  else if (PARTICLES[kind]) PARTICLES[kind](lt, .9, 4); }

// timelapse: crossfade the same place across times of day, clouds racing
SB.recipes.timelapse = (o, b) => { const place = placeOr(o.place, 'hoian'); const { caps, end } = timeCaps(b.caps, .3, .12, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .4, 5.5); const seq = String(o.times || 'day,sunset,night').split(',');
  return { dur, render: lt => { const p = clamp(lt / dur) * (seq.length - 1), i = Math.min(seq.length - 2, Math.floor(p)), f = E.smooth(p - i); const z = 1.04 + lt / dur * .06; const draw = (tm, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); const tg = LINT.tag; LINT.tag = 'bg'; PLACE[place].draw(lt * 9, { t: lt * 9, time: tm, scroll: lt * 30 * U() }); LINT.tag = tg; ctx.restore(); };
    draw(seq[i], 1); draw(seq[i + 1], f); }, captions: caps, sfx: [[0, 'whoosh_down']] }; };
TRANS.timelapse = ['fade', 'lightleak'];

// one-point perspective street (generators kit)
function street3d(t, o, gy, u, pal) { const vx = W / 2, vy = gy - 420 * u, s = o.scroll || 0; sky(o, vy + 40 * u);
  // road
  ctx.fillStyle = '#8d877e'; ctx.beginPath(); ctx.moveTo(vx - 30 * u, vy); ctx.lineTo(vx + 30 * u, vy); ctx.lineTo(W * 1.2, H); ctx.lineTo(-W * .2, H); ctx.closePath(); ctx.fill(); ctx.lineWidth = 4 * u; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let k = 0; k < 14; k++) { const q = ((k / 14 + s * .0004) % 1), d = q * q, y = vy + (H - vy) * d, w = 10 * u + 60 * u * d; ctx.fillStyle = '#efe6c8'; ctx.fillRect(vx - w / 2 * .2, y, w * .2, (H - vy) * .02 * d + 2); }
  // houses on both sides, far → near
  for (const side of [-1, 1]) for (let k = 11; k >= 0; k--) { const q0 = ((k + 1) / 12) ** 2, q1 = (k / 12) ** 2; const xA = vx + side * (40 * u + (W * .75) * q0), xB = vx + side * (40 * u + (W * .75) * q1); const hA = 60 * u + 900 * u * q0, hB = 60 * u + 900 * u * q1; const yA = vy + (gy + 140 * u - vy) * q0, yB = vy + (gy + 140 * u - vy) * q1;
    const c = pal[(k + (side > 0 ? 2 : 0)) % pal.length]; ctx.beginPath(); ctx.moveTo(xB, yB); ctx.lineTo(xA, yA); ctx.lineTo(xA, yA - hA); ctx.lineTo(xB, yB - hB); ctx.closePath(); fs(shade(c, side > 0 ? -.08 : 0), 3 * u);
    const mx = (xA + xB) / 2, my = (yA + yB) / 2 - (hA + hB) / 4; ctx.save(); ctx.globalAlpha = .9; const ww = Math.abs(xA - xB) * .4, wh = (hA + hB) / 2 * .14; rr(mx - ww / 2, my - wh, ww, wh, 2 * u, '#3f7a5a', 2 * u); rr(mx - ww / 2, my + wh * .6, ww, wh, 2 * u, '#3f7a5a', 2 * u); ctx.restore();
    if (k % 3 === 1) { const ly = yA - hA * .55; drawProp('lantern', xA - side * 12 * u, ly, .2 * u + .5 * u * q0, { color: pick([C.red, C.yel, C.orange], k) }, t); } }
  // wires converging
  for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-20, vy - 200 * u - k * 30 * u); ctx.quadraticCurveTo(vx, vy - 40 * u, W + 20, vy - 210 * u - k * 24 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = C.ink; ctx.stroke(); }
}
