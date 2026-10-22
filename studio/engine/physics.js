/* =====================================================================
   PHYSICS & STAGING — nothing floats, nothing drives on water.
   Every place declares its walkable SURFACE. Before a character or a
   vehicle is drawn, `stageUnder()` adds the support it needs when the
   place does not provide it:
     · riding on grass / floor / studio paper → a road band (full width on
       a real place, a short road patch on studio/plain backgrounds)
     · standing on water → a sampan under the feet
     · sitting (sit / sitHold) → a low red plastic stool under the hips
     · plain background with no floor → a soft floor patch
   Override per layer: stage: 'none' | 'road' | 'floor' | 'boat' | 'stool'.
   Mark deliberate mid-air moments with air: 1 (jumps, passengers, dreams).
   Lint (engine/lint.js) reports any world character or grounded prop whose
   feet are above its support: "FLOAT".
   ===================================================================== */
'use strict';
const SURFACE = { hagiang: 'road', halong: 'water', hoian: 'pavement', sapa: 'dirt', phongnha: 'water', hanoi: 'pavement', oldquarter: 'road', trainstreet: 'rail', saigon: 'road', benthanh: 'road', mekong: 'water', hue: 'pavement', dalat: 'grass', ninhbinh: 'water', danang: 'grass', muine: 'sand', phuquoc: 'sand', homestay: 'floor', sidewalk: 'road', village: 'dirt', studio: 'paper', night_market: 'road' };
const surfaceOf = place => place ? (place.surface || SURFACE[place.id] || 'grass') : 'none';
const RIDEABLE = ['road', 'pavement', 'dirt', 'rail', 'sand'];
const GROUNDED_PROPS = new Set(['moto', 'scooter', 'cyclo', 'bike_flower', 'sleeperbus', 'train', 'buffalo', 'chicken', 'dog', 'pig', 'duck', 'stool', 'table_low', 'altar', 'suitcase', 'basket', 'bucket_ice', 'streetsign', 'sign', 'tree', 'palm', 'pine', 'banana_tree', 'flowertree', 'bamboo', 'bush', 'rock', 'backpack']);
const WATER_PROPS = new Set(['basketboat', 'sampan', 'junk']);
// does this scene need a road band drawn over the place's foreground?
function sceneNeedsRoad(S, place) { if (!place || ['studio'].includes(place.id)) return false; const sf = surfaceOf(place); if (RIDEABLE.includes(sf)) return false; if (sf === 'water') return false; return (S.layers || []).some(l0 => { const l = vmerge(l0); return l.type === 'char' && l.ride && !l.screen && l.stage !== 'none' && (l.y === undefined || String(l.y).startsWith('ground')); }); }
function drawRoadBand(gy, scroll = 0) { const u = U(); rr(-20, gy - 26 * u, W + 40, 120 * u, 0, '#86817a', 5 * u); rr(-20, gy - 26 * u, W + 40, 10 * u, 0, '#a39d93', 0); ctx.save(); ctx.setLineDash([60 * u, 50 * u]); ctx.lineDashOffset = scroll; line(-20, gy + 40 * u, W + 20, gy + 40 * u, 6 * u, '#f3e9c6'); ctx.restore(); }
function drawRoadPatch(x, y, s, t, speed = 1) { const w = 520 * s, h = 70 * s; ctx.save(); const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, 'rgba(134,129,122,0)'); g.addColorStop(.18, '#86817a'); g.addColorStop(.82, '#86817a'); g.addColorStop(1, 'rgba(134,129,122,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y + h * .25, w / 2, h / 2, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + h * .25, w / 2 * .9, h / 2 * .9, 0, 0, TAU); ctx.clip(); ctx.setLineDash([46 * s, 38 * s]); ctx.lineDashOffset = t * 900 * s * speed; line(x - w / 2, y + h * .3, x + w / 2, y + h * .3, 5 * s, 'rgba(243,233,198,.9)'); ctx.restore(); }
function drawFloorPatch(x, y, s, col = 'rgba(120,80,40,.16)') { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y + 4 * s, 170 * s, 26 * s, 0, 0, TAU); ctx.fill(); ctx.restore(); }
// called by drawLayer before a character is drawn. Returns { stage, dy } — dy lifts the character (e.g. onto a boat deck)
function stageUnder(L, place, x, y, s, lt) {
  const sf = surfaceOf(place); let st = L.stage; if (st === 'none' || L.air || L.screen) return { stage: 'none', dy: 0 };
  const sitting = ['sit', 'sitHold'].includes(L.pose);
  if (!st) { if (L.ride) st = (sf === 'none' || sf === 'paper') ? 'road' : 'none';
    else if (sf === 'water' && !L.ride) st = 'boat';
    else if (sitting && !L.noStool) st = 'stool';
    else if (sf === 'none' || sf === 'paper') st = L.floor === false ? 'none' : 'floor';
    else st = 'none'; }
  const b = bodyOf(CHAR[L.id] && CHAR[L.id].spec);
  switch (st) {
    case 'road': drawRoadPatch(x, y, s, lt, L.speed ?? 1); break;
    case 'floor': drawFloorPatch(x, y, s); break;
    case 'boat': drawProp('sampan', x, y + 30 * s, s * 1.15, {}, lt); return { stage: st, dy: -26 * s };
    case 'stool': drawProp('stool', x - (L.flip ? -1 : 1) * 6 * s, y, s * b.leg * .55 / 112, { color: L.stoolColor }, lt); break;
  }
  return { stage: st, dy: 0 };
}
// ---- lint hooks (record support problems while LINT.on)
function lintFeet(L, place, x, y, io, stage) { if (!place || L.air || L.screen || L.jump || Math.abs(io.dy) > 1 || stage !== 'none') return; const u = U(), gy = place.ground(), sf = surfaceOf(place);
  if (L.ride && sf === 'water') LINT.boxes.push({ k: 'phys', sev: 'error', s: `"${L.id}" rides a ${L.vehicle || 'moto'} on water (${place.id}) — change place or vehicle` });
  else if (y < gy - 25 * u) LINT.boxes.push({ k: 'phys', sev: 'error', s: `"${L.id}" floats ${Math.round((gy - y) / u)} u above the ground — use y:'ground' (dy ≥ 0) or mark air:1` }); }
function lintProp(L, place, x, y, io) { if (!place || L.air || L.screen || Math.abs(io.dy) > 1) return; const u = U(), gy = place.ground(), sf = surfaceOf(place);
  if (WATER_PROPS.has(L.name) && sf !== 'water' && !L.stage) LINT.boxes.push({ k: 'phys', sev: 'warn', s: `boat "${L.name}" sits on dry land (${place.id})` });
  if (GROUNDED_PROPS.has(L.name)) { if (sf === 'water' && /moto|scooter|cyclo|bus|train|bike/.test(L.name)) LINT.boxes.push({ k: 'phys', sev: 'error', s: `"${L.name}" on water (${place.id})` }); else if (y < gy - 25 * u) LINT.boxes.push({ k: 'phys', sev: 'error', s: `prop "${L.name}" floats ${Math.round((gy - y) / u)} u above the ground — y:'ground' or air:1` }); } }
