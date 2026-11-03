/* =====================================================================
   GENERATORS — new characters and new places from one line of text, in house style.
   The asset library is a starting point, never a limit.

   cast: minh = man elder skin=5 hair=bald beard=white top=baba:#3a6b8a bottom=wide:#222 hat=nonla glasses=round acc=bag name="Ông Minh"
   set:  cafe_lane = sky=day far=hills mid=town,colonial ground=pavement deco=lanterns,wires,trees palette=hoian
   set:  night_rain = base=oldquarter time=night deco=rain,fog          (overlay an existing place)
   set:  temple_hill = sky=dawn far=karst mid=pagoda,forest ground=dirt deco=fog,petals
   set:  river_town = sky=sunset far=hills mid=stilt,palms water=river:#3f9a8c ground=dirt deco=boats,fireflies
   set:  homestay2 = kit=room wall=#8a5a35 floor=#5e3a20 window=night deco=altar,lanterns

   Kits — far: hills karst mountains skyline sea · mid: town colonial pagoda stilt cham market forest palms bamboo terraces
          water: river lake sea (:color) · ground: road pavement dirt grass sand floor rail water
          deco: lanterns wires trees boats stalls rain fog snow petals fireflies flags · kit=room (interior)
   ===================================================================== */
'use strict';
const PALETTES = {
  hanoi: ['#f2c14e', '#8ac0d8', '#e88a6a', '#9ccf8a', '#f4e1b8', '#d97a7a'], hoian: ['#f2c94c', '#f0b83a', '#e9a93a', '#f5d36b'], saigon: ['#9bc5e8', '#c9d6e3', '#e8e2d6', '#f2a65a'],
  pastel: ['#f6c1b0', '#bfe0d6', '#f2e1a6', '#c9c1ef', '#f3b6c8'], north: ['#e7d9c0', '#c9b79c', '#9aa88a', '#d9c3a0'], mekong: ['#7fb77e', '#e8c07a', '#d98a5a', '#9ccad0'],
};
const NAMED = { red: '#d9443a', orange: '#f08a3c', yellow: '#f8c848', green: '#3fa36b', teal: '#2fa59d', blue: '#3a7bd5', navy: '#2c3358', purple: '#7a4fa0', pink: '#f08aa0', white: '#f4efe6', black: '#1f1a1c', grey: '#9aa1a8', brown: '#7a4a2a', khaki: '#c9a66b', indigo: '#2c3358', cream: '#f3e6c4' };
const col = (v, d) => !v ? d : v.startsWith('#') ? v : (NAMED[v] || HAIR[v] || d);

// ---------------------------------------------------------------- characters
function castFromSpec(id, text) {
  const kv = {}, words = []; const re = /(\w+)=("([^"]*)"|(\S+))|(\S+)/g; let m; while ((m = re.exec(text))) { if (m[1]) kv[m[1]] = m[3] ?? m[4]; else words.push(m[5].toLowerCase()); }
  const has = w => words.includes(w); const female = has('woman') || has('girl') || has('female'); const age = has('elder') || has('old') ? 'elder' : has('kid') || has('boy') || has('girl') || has('child') ? 'kid' : has('teen') ? 'teen' : 'adult';
  const tv = (k, dType, dCol) => { const [t, c] = String(kv[k] || dType).split(':'); return { type: t, color: col(c, dCol) }; };
  const hairS = String(kv.hair || (age === 'elder' ? (female ? 'bun' : 'short') : female ? 'long' : 'short')).split(':');
  const hairCol = col(hairS[1], age === 'elder' ? HAIR.grey : HAIR.black);
  const spec = { skin: SKIN['s' + (kv.skin || 3)] || col(kv.skin, SKIN.s3), age, hair: { style: hairS[0], color: hairCol }, lashes: female ? 1 : 0,
    top: tv('top', female ? 'blouse' : 'tee', col(kv.color, '#3a7bd5')), bottom: tv('bottom', female ? 'wide' : 'jeans', '#2f3f5f'), shoes: kv.shoes || 'sandal' };
  if (spec.top.type === 'blouse') spec.top.type = 'shirt';
  if (has('slim') || has('stocky')) spec.build = has('slim') ? 'slim' : 'stocky';
  if (kv.beard) spec.beard = { color: col(kv.beard, HAIR.brown), a: .9 }; if (kv.mustache) spec.mustache = col(kv.mustache, HAIR.black); if (kv.goatee) spec.goatee = col(kv.goatee, HAIR.black);
  if (kv.hat) { const [t, c] = kv.hat.split(':'); spec.headwear = { type: t, color: col(c, undefined) }; }
  if (kv.style) spec.style = kv.style; if (kv.glasses) spec.glasses = kv.glasses; if (kv.acc) spec.acc = kv.acc.split(','); if (kv.eyes) spec.eyeSize = +kv.eyes; if (has('freckles')) spec.freckles = 1; if (kv.earring) spec.earring = col(kv.earring, C.gold);
  defChar(id, 'cast', kv.name || id, kv.desc || 'generated from storyboard', spec);
}

// ---------------------------------------------------------------- place kits
function pagoda(x, gy, s, colWall = '#c94a3a', colRoof = '#7a3a2a') { // tiered temple with curved eaves
  const tier = (y, w, h) => { sRR(x - w * .36, y - h, w * .72, h, 4 * s, colWall, { lw: 4 * s }); for (let k = -1; k <= 1; k += 2) line(x + k * w * .2, y - h * .9, x + k * w * .2, y, 3 * s, shade(colWall, -.25));
    shaded(() => { ctx.moveTo(x - w * .62, y - h - 4 * s); ctx.quadraticCurveTo(x - w * .5, y - h - 18 * s, x - w * .4, y - h - 40 * s); ctx.lineTo(x + w * .4, y - h - 40 * s); ctx.quadraticCurveTo(x + w * .5, y - h - 18 * s, x + w * .62, y - h - 4 * s); ctx.quadraticCurveTo(x, y - h - 18 * s, x - w * .62, y - h - 4 * s); ctx.closePath(); }, colRoof, { lw: 4 * s }); };
  let y = gy, w = 300 * s; for (let i = 0; i < 3; i++) { tier(y, w, 90 * s); y -= 130 * s; w *= .78; } circ(x, y + 70 * s, 10 * s, C.gold, 3 * s);
}
function colonial(x, gy, w, h, c, s) { sRR(x, gy - h, w, h, 4 * s, c, { lw: 5 * s }); rr(x - 8 * s, gy - h - 16 * s, w + 16 * s, 20 * s, 3 * s, shade(c, -.15), 4 * s);
  const n = Math.max(2, Math.round(w / (120 * s))), fl = Math.max(1, Math.round(h / (150 * s)));
  for (let f = 0; f < fl; f++) for (let i = 0; i < n; i++) { const wx = x + (i + .5) * w / n, wy = gy - h + 40 * s + f * h / fl; ctx.beginPath(); ctx.moveTo(wx - 22 * s, wy + 70 * s); ctx.lineTo(wx - 22 * s, wy + 18 * s); ctx.arc(wx, wy + 18 * s, 22 * s, Math.PI, 0); ctx.lineTo(wx + 22 * s, wy + 70 * s); ctx.closePath(); fs('#3a6b4a', 3.5 * s); line(wx, wy, wx, wy + 70 * s, 2.5 * s, shade('#3a6b4a', -.3)); if (f > 0) rr(wx - 32 * s, wy + 70 * s, 64 * s, 8 * s, 2 * s, '#2b1d16', 0); } }
function stiltHouse(x, gy, s, c = '#a77b4f') { for (let k = -2; k <= 2; k++) rr(x + k * 70 * s - 6 * s, gy - 130 * s, 12 * s, 130 * s, 2 * s, '#6e4325', 3 * s); sRR(x - 180 * s, gy - 230 * s, 360 * s, 100 * s, 3 * s, c, { lw: 4 * s }); for (let k = 0; k < 9; k++) line(x - 170 * s + k * 42 * s, gy - 225 * s, x - 170 * s + k * 42 * s, gy - 135 * s, 2 * s, shade(c, -.2));
  sPoly([[x - 230 * s, gy - 225 * s], [x, gy - 360 * s], [x + 230 * s, gy - 225 * s]], '#c9a45a', { lw: 4 * s }); for (let k = 1; k < 6; k++) line(x - 230 * s + k * 38 * s, gy - 225 * s + 0, x - 230 * s + k * 38 * s + 20 * s, gy - 225 * s - k * 20 * s, 2 * s, '#a8843a'); }
function chamTower(x, gy, s) { const c = '#b5643c'; for (let i = 0; i < 4; i++) { const w = (150 - i * 30) * s, h = (i ? 70 : 160) * s, y = gy - (i ? 160 + (i - 1) * 70 : 0) * s - (i ? 0 : 0); sRR(x - w / 2, y - h, w, h, 3 * s, shade(c, i * .04), { lw: 4 * s }); } sPoly([[x - 30 * s, gy - 370 * s], [x, gy - 440 * s], [x + 30 * s, gy - 370 * s]], shade(c, .1), { lw: 4 * s }); rr(x - 20 * s, gy - 90 * s, 40 * s, 90 * s, 18 * s, '#3a2418', 3 * s); }
function stall(x, gy, s, r) { const c = pick([C.red, '#3fa36b', '#3a7bd5', C.orange], Math.floor(r() * 4)); rr(x - 110 * s, gy - 70 * s, 220 * s, 70 * s, 4 * s, '#8c5c33', 4 * s); sPoly([[x - 130 * s, gy - 190 * s], [x + 130 * s, gy - 190 * s], [x + 150 * s, gy - 150 * s], [x - 150 * s, gy - 150 * s]], c, { lw: 4 * s }); line(x - 110 * s, gy - 150 * s, x - 110 * s, gy - 70 * s, 5 * s, '#6e4325'); line(x + 110 * s, gy - 150 * s, x + 110 * s, gy - 70 * s, 5 * s, '#6e4325');
  for (let k = 0; k < 6; k++) circ(x - 80 * s + k * 32 * s, gy - 82 * s, 13 * s, pick([C.orange, C.yel, '#e2453c', '#7cb85c', C.pink], k + Math.floor(r() * 5)), 3 * s); }
function terraces(gy, s, sc) { for (let i = 0; i < 7; i++) { const y = gy - 330 * s + i * 50 * s; ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= W + 40; x += 40) ctx.lineTo(x, y + Math.sin((x + sc * .3 * (1 + i * .1)) * .004 + i) * 30 * s); ctx.lineTo(W, gy); ctx.lineTo(0, gy); ctx.closePath(); fs(['#b8d66a', '#a6cc5a', '#94c04e', '#86b648', '#7aac44', '#6ea03e', '#629438'][i], 3 * s); } }
function rainFx(t, a = 1) { const u = U(), r = rng(3); ctx.save(); ctx.globalAlpha = .45 * a; ctx.strokeStyle = '#dfe9f5'; ctx.lineWidth = 2 * u; ctx.beginPath(); for (let i = 0; i < 260; i++) { const x = (r() * W * 1.2 + t * 260 * u) % (W * 1.2) - W * .1, y = (r() * H + t * 1400 * u * (.8 + r() * .4)) % H; ctx.moveTo(x, y); ctx.lineTo(x - 10 * u, y + 34 * u); } ctx.stroke(); ctx.restore(); }

const SETS = {};
function defSet(id, text) {
  const kv = {}; const re = /(\w+)=("([^"]*)"|(\S+))/g; let m; while ((m = re.exec(text))) kv[m[1]] = m[3] ?? m[4];
  const list = k => (kv[k] || '').split(',').map(s => s.trim()).filter(Boolean); const deco = list('deco'); SETS[id] = kv;
  const ground = kv.ground || (kv.kit === 'room' ? 'floor' : 'pavement'); const base = kv.base && PLACE[kv.base];
  const gOff = base ? base.gOff : +(kv.groundline || 170);
  defPlace(id, kv.label || id, 'generated set: ' + text, gOff, (t, o0) => {
    const o = { ...o0, time: o0.time || kv.time || kv.sky || 'day' }; const u = U(), gy = HB() - gOff * u, s = o.scroll || 0, r = rng(id.length * 31); LW = 5 * u;
    if (base) base.draw(t, o);
    else if (kv.kit === 'street3d') street3d(t, o, gy, u, PALETTES[kv.palette] || PALETTES.hanoi);
    else if (kv.kit === 'room') { // one-point perspective interior
      const wall = col(kv.wall, '#d9c3a0'), fl = col(kv.floor, '#9a6338'); ctx.fillStyle = shade(wall, -.12); ctx.fillRect(0, 0, W, H); const vx = W / 2, bw = W * .62, bh = (gy - H * .08) * .9, bx = vx - bw / 2, by = gy - bh;
      sPoly([[0, H], [bx, gy], [bx + bw, gy], [W, H]], fl, { lw: 4 * u }); for (let k = 1; k < 8; k++) line(bx + bw * k / 8, gy, W * k / 8, H, 2 * u, shade(fl, -.2));
      sPoly([[0, 0], [bx, by], [bx, gy], [0, H]], shade(wall, -.08), { lw: 4 * u }); sPoly([[W, 0], [bx + bw, by], [bx + bw, gy], [W, H]], shade(wall, -.08), { lw: 4 * u }); sRR(bx, by, bw, bh, 0, wall, { lw: 4 * u });
      if (kv.window) { const wx = bx + bw * .62, wy = by + bh * .2, ww = bw * .26, wh = bh * .38; rr(wx, wy, ww, wh, 6 * u, kv.window === 'night' ? '#14234a' : '#9fd6f0', 6 * u); line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 5 * u); line(wx, wy + wh / 2, wx + ww, wy + wh / 2, 5 * u); if (kv.window === 'night') drawProp('moon', wx + ww * .7, wy + wh * .3, .5 * u); }
      if (deco.includes('altar')) drawProp('altar', bx + bw * .25, gy - 4 * u, 1.1 * u, {}, t);
    } else {
      sky(o, gy - 300 * u);
      for (const f of list('far')) { if (f === 'hills') range(7, 7, 2400 * u, gy - 120 * u, 160 * u, 300 * u, 420 * u, 640 * u, '#8fbf8a', .1, s, 4 * u);
        if (f === 'karst') { range(9, 9, 2400 * u, gy - 160 * u, 260 * u, 460 * u, 180 * u, 300 * u, '#9cc49a', .08, s, 4 * u); hazeBand(gy - 200 * u, 120 * u, '#ffffff', .35); }
        if (f === 'mountains') { range(5, 5, 3000 * u, gy - 120 * u, 380 * u, 560 * u, 600 * u, 900 * u, '#8fa3b8', .05, s, 4 * u); hazeBand(gy - 160 * u, 140 * u, '#ffffff', .4); }
        if (f === 'skyline') layerRep(2200 * u, .12, s, x0 => { for (let i = 0; i < 12; i++) { const h = (220 + hash(i * 7) * 380) * u; rr(x0 + i * 180 * u, gy - 140 * u - h, 140 * u, h + 40 * u, 4 * u, shade('#9fb4c8', hash(i) * .1 - .05), 3 * u); } });
        if (f === 'sea') { ctx.fillStyle = '#5cc0cf'; ctx.fillRect(0, gy - 200 * u, W, 120 * u); } }
      const water_ = kv.water && kv.water.split(':'); if (water_) water(gy - (water_[0] === 'sea' ? 140 : 70) * u, col(water_[1], water_[0] === 'river' ? '#3f9a8c' : '#5cc0cf'), o, .6);
      const pal = PALETTES[kv.palette] || PALETTES.hanoi;
      for (const k of list('mid')) {
        if (k === 'town') layerRep(2000 * u, .45, s, x0 => { for (let i = 0; i < 5; i++) tubeHouse(x0 + i * 400 * u, gy - 60 * u, 380 * u, (380 + hash(i * 3 + id.length) * 260) * u, pal[i % pal.length], { u, shop: 1, balcony: 1, awning: i % 2 ? C.red : '#3fa36b' }); });
        if (k === 'colonial') layerRep(2400 * u, .45, s, x0 => { for (let i = 0; i < 3; i++) colonial(x0 + i * 800 * u + 60 * u, gy - 60 * u, 680 * u, 420 * u, pick(['#f2c94c', '#f0d080', '#e9b84a'], i), u); });
        if (k === 'pagoda') pagoda(W * .66 - s * .3, gy - 70 * u, 1.05 * u);
        if (k === 'cham') chamTower(W * .7 - s * .3, gy - 60 * u, 1.1 * u);
        if (k === 'stilt') layerRep(1600 * u, .5, s, x0 => { stiltHouse(x0 + 300 * u, gy - 40 * u, 1 * u); stiltHouse(x0 + 1100 * u, gy - 40 * u, .85 * u, '#9a6e44'); });
        if (k === 'market') layerRep(1400 * u, .6, s, x0 => { for (let i = 0; i < 4; i++) stall(x0 + 180 * u + i * 340 * u, gy - 10 * u, 1 * u, r); });
        if (k === 'forest') layerRep(1800 * u, .35, s, x0 => { for (let i = 0; i < 9; i++) drawProp(i % 3 ? 'tree' : 'pine', x0 + i * 200 * u, gy - 70 * u, (.8 + hash(i) * .4) * u, { color: '#4f9a4a' }, t); });
        if (k === 'palms') layerRep(1600 * u, .5, s, x0 => { for (let i = 0; i < 4; i++) drawProp('palm', x0 + i * 400 * u + 100 * u, gy - 40 * u, (1 + hash(i) * .3) * u, {}, t); });
        if (k === 'bamboo') layerRep(1400 * u, .4, s, x0 => { for (let i = 0; i < 10; i++) drawProp('bamboo', x0 + i * 140 * u, gy - 60 * u, .7 * u, {}, t); });
        if (k === 'terraces') terraces(gy, u, s);
      }
      const gc = { road: '#86817a', pavement: '#c9b49a', dirt: '#b8905a', grass: '#8cc85a', sand: '#efd9a4', floor: '#8a5a35', rail: '#9a8f80', water: '#3f9a8c' }[ground] || '#b8905a';
      rr(-20, gy, W + 40, H - gy + 20, 0, gc, LW); if (ground === 'road') { ctx.save(); ctx.setLineDash([60 * u, 50 * u]); ctx.lineDashOffset = s; line(0, gy + (H - gy) * .45, W, gy + (H - gy) * .45, 6 * u, '#f3e9c6'); ctx.restore(); }
    }
    // deco overlays (all kits & bases)
    if (deco.includes('wires')) { for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-20, gy - 520 * u + k * 16 * u); ctx.quadraticCurveTo(W / 2, gy - 440 * u + k * 22 * u, W + 20, gy - 530 * u + k * 12 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = C.ink; ctx.stroke(); } }
    if (deco.includes('lanterns')) { const y0 = gy - 470 * u; ctx.beginPath(); ctx.moveTo(-20, y0); ctx.quadraticCurveTo(W / 2, y0 + 90 * u, W + 20, y0); ctx.lineWidth = 3 * u; ctx.strokeStyle = C.ink; ctx.stroke(); for (let i = 0; i < 9; i++) { const x = (i + .5) * W / 9, q = x / W, y = y0 + 4 * q * (1 - q) * 90 * u; drawProp('lantern', x, y + 70 * u, .5 * u, { color: pick([C.red, C.yel, C.orange, C.pink, '#7a4fa0'], i), glow: o.time === 'night' }, t); } }
    if (deco.includes('trees')) layerRep(1500 * u, .9, s, x0 => { drawProp('tree', x0 + 200 * u, gy - 10 * u, 1.1 * u, { color: '#4f9a4a' }, t); });
    if (deco.includes('stalls')) layerRep(1500 * u, .9, s, x0 => { stall(x0 + 260 * u, gy + 30 * u, 1.05 * u, r); stall(x0 + 980 * u, gy + 30 * u, 1.05 * u, r); });
    if (deco.includes('boats')) { drawProp('sampan', ((W * .3 - s * .5 + t * 20 * u) % (W + 600 * u) + W + 600 * u) % (W + 600 * u) - 300 * u, gy - 40 * u, .8 * u, {}, t); drawProp('basketboat', W * .75 - s * .4, gy - 30 * u, .7 * u, {}, t); }
    if (deco.includes('altar') && kv.kit !== 'room') drawProp('altar', W * .2, gy, 1 * u, {}, t);
    if (deco.includes('flags')) for (let i = 0; i < 6; i++) drawProp('flag_vn', W * (.1 + i * .16), gy - 380 * u, .45 * u, {}, t);
    if (kv.kit !== 'room' && !base) timeTint(o);
    if (deco.includes('fog')) { hazeBand(gy - 120 * u, 200 * u, '#ffffff', .45); hazeBand(gy - 380 * u, 160 * u, '#ffffff', .3); }
    if (deco.includes('rain')) { ctx.save(); ctx.fillStyle = 'rgba(40,60,90,.18)'; ctx.fillRect(0, 0, W, H); ctx.restore(); rainFx(t); }
    for (const p of ['petals', 'fireflies', 'snow', 'sparkles']) if (deco.includes(p) && PARTICLES[p]) PARTICLES[p](t, .8, 2);
  }, { surface: base ? (base.surface || SURFACE[base.id]) : ground, night: base ? base.night : (kv.time || kv.sky) === 'night', ...(base ? { ground: base.ground } : {}) });
}
