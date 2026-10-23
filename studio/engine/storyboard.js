/* =====================================================================
   STORYBOARD COMPILER — the token-cheap way to make an episode.
   A storyboard (.story) is a tiny text file: a header, then beats.
   Each beat = "# type key=value key="quoted value"" + caption lines.
   The compiler expands beats into full scenes using the recipe library:
   layout for 16:9 AND 9:16, camera moves, transitions (never repeated),
   timing from caption length (≈2.6 words/s), entrances, shakes, SFX.

   title: Phở in Hà Nội, honestly
   look: grade=warm captions=karaoke boil=off step=1
   sources: https://… — checked Oct 2026

   # map to=hanoi label="HÀ NỘI"
   This is *Vietnam*.
   And up north… *Hà Nội*.

   # price place=sidewalk hero=dave seller=cophovn hold=pho item="phở bò, street stall" vnd="45.000 ₫" usd="$1.80" checked="Oct 2026"
   A street bowl runs about [45,000 ₫] (~$1.80).

   Caption markup: *yellow highlight*, [brand-orange price/punchline].
   Beat options common to all: place time=day|sunset|night dur=<s> trans=<transition> cam=<move> grade=<grade> caps=line|karaoke|punch
   ===================================================================== */
'use strict';
const SB = {};
SB.parse = (text) => {
  const lines = String(text).replace(/\r/g, '').split('\n'); const ep = { header: {}, beats: [] }; let cur = null, raw = null;
  const kv = s => { const o = {}; const re = /(\w+)=("([^"]*)"|'([^']*)'|(\S+))/g; let m; while ((m = re.exec(s))) o[m[1]] = m[3] ?? m[4] ?? m[5]; return o; };
  for (const ln0 of lines) { const ln = ln0.trimEnd();
    if (raw !== null) { if (/^#\s*endraw/.test(ln)) { cur.raw = JSON.parse(raw); raw = null; continue; } raw += ln + '\n'; continue; }
    if (/^\s*\/\//.test(ln)) continue;
    const h = ln.match(/^#\s*(\w+)\s*(.*)$/); if (h) { cur = { type: h[1].toLowerCase(), opt: kv(h[2]), caps: [] }; ep.beats.push(cur); if (cur.type === 'raw') raw = ''; continue; }
    if (!cur) { const m = ln.match(/^(\w+)\s*:\s*(.*)$/); if (m) ep.header[m[1].toLowerCase()] = m[2]; continue; }
    if (ln.trim()) cur.caps.push(ln.trim()); }
  return ep;
};
const WPS = 2.6; // narration pace (≈150 wpm)
// Voice-over timing: pass 1 (SB._vo = {list:[]}) records every spoken line in order; tools/voice.py synthesises them;
// pass 2 (SB._vo = {durs:[…]}) times each caption to its real audio length. Without VO: 2.6 words/s estimate.
SB._vo = null;
function capDur(s, spk) { const est = Math.max(1.3, String(s).replace(/[\*\[\]]/g, '').split(/\s+/).filter(Boolean).length / WPS + .35); const V = SB._vo; if (!V) return est; const k = V.i++; V.last = k;
  if (V.durs) return V.durs[k] !== undefined ? Math.max(.6, V.durs[k] + .08) : est; V.list.push({ k, text: String(s), spk: spk || 'narrator' }); return est; }
const voIdx = () => SB._vo ? SB._vo.last : undefined;
function timeCaps(caps, start = .15, gap = .12, style) { const out = []; let t = start; for (const c of caps) { const d = capDur(c); const m = style ? { style } : {}; if (SB._vo) m.vo = voIdx(); out.push([+t.toFixed(2), +(t + d).toFixed(2), c, m]); t += d + gap; } return { caps: out, end: t }; }
const pick = (arr, i) => arr[i % arr.length];
const num = (v, d) => v === undefined ? d : +v;
const chr = id => (id && CHAR[id]) ? id : null;
const placeOr = (p, d) => (p && PLACE[p]) ? p : d;
const split = s => (s || '').split('|').map(x => x.trim()).filter(Boolean);
// transitions per beat type (first unused alternative wins)
const TRANS = { map: ['cut'], title: ['flash'], intro: ['inkbleed', 'circles'], route: ['whip', 'push'], talk: ['paper', 'slide'], price: ['push', 'fgwipe', 'whip'], list: ['paper', 'stripes'], compare: ['stripes', 'slide'], reveal: ['fgwipe', 'iris', 'circles'], ride: ['whip', 'fgwipe'], gag: ['zoom', 'flash'], social: ['lightleak', 'iris'], stat: ['circles', 'flash'], payoff: ['lightleak', 'flash'], end: ['brand'], scale: ['whipUp'], chapter: ['inkbleed'] };
const CAMS = ['drift', 'handheld'];

SB.recipes = {
  // ---------- MAP OPEN: zoom from region to a place, drop a pin
  map(o, b, ctx_) { const c = CITY[o.to] || null; const lon = c ? c[1] : num(o.lon, 105.85), lat = c ? c[2] : num(o.lat, 21.03); const label = o.label || (c ? c[0].toUpperCase() : '');
    const k = num(o.zoom, 640); const { caps, end } = timeCaps(b.caps, .1, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 6.5);
    return { dur, layers: [{ type: 'map', view: [{ lon: 105.6, lat: 16.2, k: 46 }], camLerp: { t0: 1.4, t1: 4.6, a: { lon: 105.6, lat: 16.2, k: 46 }, b: { lon, lat, k } }, o: { pins: [{ lon, lat, label, at: 4.2 }], vnFill: 1, underlay: (P, mo) => { if (mo.k < 160) return; ctx.save(); ctx.globalAlpha *= clamp((mo.k - 160) / 300); const r = rng(5); for (let i = 0; i < 40; i++) { const lo = lon + (r() - .5) * 1.6, la = lat + (r() - .5) * 1.2, sz = .6 + r() * .6; const [x, y] = P(lo, la); karstPeak(x, y, 50 * sz * U(), 60 * sz * U(), '#7aac5a', 3 * U()); } ctx.restore(); } } }],
      captions: caps, shakes: [[4.65, 14, .45]], sfx: [[0, 'map_whoosh'], [4.2, 'pin_drop']] }; },
  // ---------- ROUTE on a map with stat cards
  route(o, b) { const stops = (o.stops || '').split(',').map(s => s.trim()).filter(s => CITY[s]); const pts = stops.map(s => [CITY[s][1], CITY[s][2]]); if (o.loop === 'yes' && pts.length) pts.push(pts[0]);
    const lons = pts.map(p => p[0]), lats = pts.map(p => p[1]); const cl = (Math.min(...lons) + Math.max(...lons)) / 2, ca = (Math.min(...lats) + Math.max(...lats)) / 2; const span = Math.max(Math.max(...lons) - Math.min(...lons), (Math.max(...lats) - Math.min(...lats)) * 1.2, .05);
    const k = num(o.zoom, Math.min(2400, 520 / span)); const stats = split(o.stats); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 7);
    const route = []; for (let i = 0; i < pts.length - 1; i++) { const [a, c] = [pts[i], pts[i + 1]]; const dx = c[0] - a[0], dy = c[1] - a[1], d = Math.hypot(dx, dy) || 1; for (let j = 0; j < 20; j++) { const f = j / 20, w = Math.sin(f * Math.PI * 6) * d * .03 * Math.sin(f * Math.PI); route.push([a[0] + dx * f - dy / d * w, a[1] + dy * f + dx / d * w]); } } if (pts.length) route.push(pts[pts.length - 1]);
    const draw = Math.min(dur - 1.2, 1 + pts.length * .9); const cityAt = {}; stops.forEach((s, i) => cityAt[s] = .3 + (i / Math.max(1, stops.length - 1)) * draw);
    const layers = [{ type: 'map', view: [{ lon: cl + span * .18, lat: ca, k }, { t: dur, k: k * 1.06 }], v: { view: [{ lon: cl, lat: ca, k: k * .82 }, { t: dur, k: k * .86 }] }, routeP: [{ p: 0 }, { t: .5, p: 0 }, { t: draw + .5, p: 1, ease: 'sine' }], o: { route, cities: stops, cityAt, labels: 0, vnColor: o.land || '#bcd98a', sea: o.sea || '#e3cf9c', underlay: (P, mo) => SB.doodles(P, mo, pts) } },
      { type: 'fn', draw: (lt, S) => { const mo = S._mapO; if (!mo || !mo._head || lt < .5) return; const u = U(); ctx.save(); ctx.translate(mo._head[0], mo._head[1] - 4 * u); if (Math.cos(mo._dir) < 0) ctx.scale(-1, 1); drawProp(o.vehicle || 'moto', 0, 0, .28 * u, { spin: lt * 20, shadow: false }, lt); person(-12 * u, -10 * u, .26 * u, CHAR[chr(o.hero) || 'dave'].spec, { t: lt, pose: 'ride', expr: 'grin', headwear: { type: 'helmet', color: C.yel }, noShadow: 1 }); ctx.restore(); } }];
    stats.forEach((st, i) => { const [big, small] = st.split(';'); const at = 1 + i * 1.1; layers.push({ type: 'ui', name: 'stat', screen: true, at, o: { x: .82, y: .22 + i * .18, big, small, emoji: ['🛣️', '📅', '🌀', '💰', '⏱️'][i % 5] }, v: { until: i < stats.length - 1 ? at + 2.2 : undefined, o: { x: .5, y: .2, s: .9 } } }); });
    return { dur, layers, captions: caps }; },
  // ---------- TITLE SLAM
  title(o, b) { const lines = split(o.text || 'TITLE'); const { caps, end } = timeCaps(b.caps, .9, .05, b.capStyle); const dur = Math.max(num(o.dur, 3.2), end + .2);
    return { dur, render: lt => SB.titleRender(lt, lines, o), captions: caps, shakes: [[.38, 22, .5]], sfx: [[0, 'impact']] }; },
  // ---------- INTRO: hero drops in with name tag; optional host enters and asks; hero reacts
  intro(o, b) { const hero = chr(o.hero) || 'dave', host = chr(o.host); const place = placeOr(o.place, 'oldquarter'); const { caps, end } = timeCaps(b.caps, .15, .05, b.capStyle);
    const tReact = Math.max(3.4, end - 2.2); const dur = Math.max(num(o.dur, 0), end + .4, host ? 7 : 5);
    const L = [{ type: 'char', id: hero, x: host ? .36 : .5, y: 'ground', dy: 40, s: 1.4, expr: o.mood || 'neutral', in: { type: 'drop', at: .1 }, keys: [{ t: tReact, expr: o.react || 'starstruck', pose: o.reactPose || 'cheer' }], v: { x: host ? .3 : .5, s: 1.05 } },
      { type: 'ui', name: 'arrow', screen: true, at: .7, until: Math.min(2.6, tReact - .4), o: { from: [.2 * 1, .24], to: [host ? .33 : .46, .44], label: (o.label || CHAR[hero].name.split(' ')[0]).toUpperCase(), bend: [-40, -40] }, v: { o: { from: [.16, .28], to: [host ? .26 : .44, .48] } } }];
    if (host) { L.push({ type: 'char', id: host, x: .64, y: 'ground', dy: 40, s: 1.4, pose: 'wave', expr: 'happy', in: { type: 'slideR', at: 1.8, dur: .5 }, keys: [{ t: 2.8, pose: 'present', look: [-1, 0] }, { t: tReact, pose: 'thumbs', expr: 'grin' }], v: { x: .72, s: 1.05 } });
      L.push({ type: 'ui', name: 'lower', screen: true, at: 2.2, until: tReact - .2, o: { name: CHAR[host].name.split(' (')[0], role: o.role || 'your Vietadvisor local' } });
      if (o.ask) L.push({ type: 'ui', name: 'bubble', screen: true, at: 2.9, until: tReact, o: { follow: host, x: .72, y: .3, text: o.ask.replace(/\\n/g, '\n'), size: 46, tail: [-120, 150] }, v: { o: { size: 42 } } }); }
    if (o.shout) L.push({ type: 'ui', name: 'bubble', screen: true, at: tReact + .5, o: { follow: hero, x: host ? .3 : .5, y: .26, text: o.shout, size: 60, color: C.brand, tail: [60, 160] }, v: { o: { size: 52 } } });
    L.push({ type: 'fn', screen: true, draw: lt => { const p = E.out5(inv(tReact - .1, tReact + .25, lt)) * (1 - inv(tReact + 1.4, tReact + 1.9, lt)); if (p > 0) focusLines(W * (host ? .36 : .5), H * .45, lt, p * .8); } });
    return { dur, place, placeOpts: { time: o.time }, scroll: [{ t: 0, v: 0 }, { t: dur, v: 140 }], cam: [{ t: 0, x: .5, y: .5, z: 1 }, { t: tReact - .05, z: 1 }, { t: tReact + .3, z: 1.16, y: .55, ease: 'out5' }], layers: L, captions: caps, shakes: [[.55, 12, .4], [tReact, 15, .45]] }; },
  // ---------- TALK: host explains; optional prop or big text pops on the free third
  talk(o, b) { const host = chr(o.host) || 'linh'; const place = placeOr(o.place, 'studio'); const { caps, end } = timeCaps(b.caps, .15, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .4, 4);
    const L = [{ type: 'char', id: host, x: .26, y: 'ground', dy: 30, s: 1.35, pose: o.pose || 'present', expr: o.mood || 'happy', in: { type: 'up', at: 0 }, keys: [{ t: dur * .55, pose: o.pose2 || 'point' }].concat(o.speaks === 'no' ? [] : caps.flatMap(c => [{ t: c[0], talk: 1, talkVo: (c[3] && c[3].vo) ?? -1, talkT0: c[0], dur: .05 }, { t: c[1] - .05, talk: 0, dur: .05 }])), v: { x: .5, y: 'ground', s: 1.0 } }];
    // a talk prop stands on a real surface (a low table on the ground line) beside the host — never floating in mid-air
    if (o.prop && PROP[o.prop]) { const pr = PROP[o.prop], fit = Math.min(130 / pr.w, 110 / pr.h) * Math.min(1.25, num(o.size, 1)), tbl = PROP.table_low ? .9 : 0;
      L[0].x = .3; L[0].v = { x: .3, y: 'ground', s: .92 };
      if (tbl) L.push({ type: 'prop', name: 'table_low', x: .7, y: 'ground', dy: 20, s: 1.1, z: -1, v: { x: .72, s: 1.0 } });
      L.push({ type: 'prop', name: o.prop, x: .7, y: 'ground', dy: tbl ? -110 : 20, s: fit, in: { type: 'pop', at: .5 }, v: { x: .72, dy: tbl ? -98 : 20, s: fit * .9 } }); }
    if (o.big) L.push({ type: 'text', text: o.big, x: .66, y: o.prop ? .2 : .4, size: 110, fill: C.yel, in: { type: 'zoom', at: .4 }, v: { x: .5, y: o.prop ? .14 : .22, size: 92 } });
    return { dur, place, placeOpts: { time: o.time }, layers: L, captions: caps, capY: { v: .79 }, _hasProp: !!(o.prop && PROP[o.prop]), moves: [{ type: 'pushIn', t0: 0, t1: dur, amt: .08, to: [.5, .52] }] }; },
  // ---------- PRICE CHECK (brand format B)
  price(o, b) { const hero = chr(o.hero) || 'dave', seller = chr(o.seller); const place = placeOr(o.place, 'sidewalk'); const { caps, end } = timeCaps(b.caps, .15, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .4, 4.5); const tagAt = .9;
    const L = [{ type: 'char', id: hero, x: seller ? .58 : .4, y: 'ground', dy: 40, s: 1.35, pose: o.hold ? 'hold' : 'stand', hold: o.hold, holdScale: num(o.holdScale, .4), expr: 'happy', keys: [{ t: tagAt + .6, expr: o.react || 'yummy', pose: o.hold ? 'eat' : 'thumbs' }], v: { x: seller ? .64 : .5, s: 1.05 } }];
    if (seller) L.push({ type: 'char', id: seller, x: .3, y: 'ground', dy: 40, s: 1.35, pose: 'present', expr: 'happy', v: { x: .3, s: 1.05 } });
    L.push({ type: 'ui', name: 'price', screen: true, at: tagAt, o: { x: seller ? .82 : .72, y: .28, item: o.item || '', vnd: o.vnd || '?', usd: o.usd, checked: o.checked } , v: { o: { x: .5, y: .175, s: .74 } } });
    return { dur, place, placeOpts: { time: o.time }, layers: L, captions: caps, moves: [{ type: 'pushIn', t0: 0, t1: dur, amt: .1, to: [.5, .55] }, { type: 'bounce', t0: tagAt + .15, t1: tagAt + .7, amt: .05 }] }; },
  // ---------- LIST / checklist (format D). items="a|b|!avoid this"
  list(o, b) { const host = chr(o.host) || 'linh'; const items = split(o.items).map(t => t.startsWith('!') ? { text: t.slice(1), no: 1 } : { text: t }); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const step = num(o.step, Math.max(.8, Math.min(1.6, (end - 1.2) / Math.max(1, items.length)))); const dur = Math.max(num(o.dur, 0), end + .4, 1.4 + items.length * step + 1.2);
    return { dur, place: placeOr(o.place, 'studio'), placeOpts: { color: '#f3e6c4' }, layers: [
      { type: 'char', id: host, x: .17, y: 'ground', dy: 30, s: 1.35, pose: 'present', expr: 'happy', in: { type: 'up', at: 0 }, keys: [{ t: 1 + items.length * step * .6, pose: 'point', expr: 'determined' }], v: { x: .5, s: .72 } },
      { type: 'text', text: (o.title || 'GOOD TO KNOW').toUpperCase(), x: .62, y: .14, size: 92, fill: C.yel, in: { type: 'zoom', at: .2 }, v: { x: .5, y: .14, size: 84 } },
      { type: 'ui', name: 'checklist', screen: true, at: 1.0, o: { x: .4, y: .3, step, s: 1, items }, v: { o: { x: .07, y: .21, s: 1.22 } } }], captions: caps, capY: { v: .5 }, moves: [{ type: 'drift' }] }; },
  // ---------- COMPARE A vs B (split; stacked in 9:16)
  compare(o, b) { const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .4, 6); const side = (pfx, x, xv, yv, at) => { const L = []; const id = chr(o[pfx]); const ride = o[pfx + 'Ride'] === 'yes';
      if (id) L.push({ type: 'char', id, x, y: .9, s: ride ? 1.05 : 1.15, ride: ride ? 1 : 0, pose: o[pfx + 'Pose'] || 'stand', expr: o[pfx + 'Mood'] || 'happy', headwear: ride ? { type: 'helmet', color: C.yel } : undefined, speed: .5, in: { type: 'pop', at }, v: { x: xv, y: yv, s: ride ? .66 : .62 } });
      L.push({ type: 'text', text: (o[pfx + 'Title'] || pfx.toUpperCase()).toUpperCase(), x, y: .1, size: 62, fill: pfx === 'right' ? C.yel : '#fff', in: { type: 'pop', at: at - .1 }, v: { x: .5, y: pfx === 'left' ? .12 : .6, size: 56 } });
      if (o[pfx + 'Price']) { const [vnd, usd, item] = o[pfx + 'Price'].split(';'); L.push({ type: 'ui', name: 'price', screen: true, at: at + .9, o: { x, y: .35, vnd, usd, item: item || '', checked: o.checked, s: .82 }, v: { o: { x: .68, y: pfx === 'left' ? .22 : .7, s: .62 } } }); }
      return L; };
    return { dur, place: 'studio', placeOpts: { floor: false }, layers: [{ type: 'fn', draw: () => { const u = U(); if (H > W) rr(0, H * .5 - 4 * u, W, 8 * u, 0, C.ink, 0); else rr(W / 2 - 4 * u, 0, 8 * u, H, 0, C.ink, 0); } }, ...side('left', .25, .3, .42, .2), ...side('right', .75, .34, .93, .5)], captions: caps, capY: { v: .535 }, v: { capStyle: 'punch' } }; },
  // ---------- REVEAL a landmark: tight detail → wide, banner, sparkles
  reveal(o, b) { const place = placeOr(o.place, 'hoian'); const { caps, end } = timeCaps(b.caps, .4, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 5); const hero = chr(o.hero);
    const L = [{ type: 'particles', name: o.particles || (o.time === 'night' ? 'fireflies' : 'sparkles'), a: .7 }];
    if (hero) L.push({ type: 'char', id: hero, x: .3, y: 'ground', s: 1.2, pose: o.pose || 'photo', expr: o.mood || 'starstruck', in: { type: 'slideL', at: 1.6 }, v: { x: .3, s: .95 } });
    if (o.label) L.push({ type: 'ui', name: 'banner', screen: true, at: 2.0, o: { x: .5, y: .16, text: o.label, size: 60 }, v: { o: { y: .22, size: 52 } } });
    if (o.rays === 'yes') L.unshift({ type: 'fn', draw: lt => godRays(W * .65, H * .2, lt, { a: .4 * clamp((lt - .5) / 1) }) });
    return { dur, place, placeOpts: { time: o.time, season: o.season }, layers: L, captions: caps, moves: [{ type: 'reveal', t0: 0, t1: 2.2, from: [num(o.fx, .62), num(o.fy, .45)], z: 2.3, ease: 'out5' }, { type: 'drift' }] }; },
  // ---------- RIDE through a place (parallax scroll, speed lines, optional roadside sign)
  ride(o, b) { const hero = chr(o.hero) || 'dave'; const place = placeOr(o.place, 'hagiang'); const { caps, end } = timeCaps(b.caps, .2, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 5); const stop = o.stop === 'yes';
    const L = [{ type: 'char', id: hero, ride: 1, vehicle: o.vehicle || 'moto', x: .36, y: 'ground', dy: 40, s: 1.1, expr: o.mood || 'grin', headwear: { type: 'helmet', color: C.yel }, speed: 1, keys: o.react ? [{ t: dur * .5, expr: o.react }] : [], v: { x: .34, s: .9 } }];
    if (o.passenger) L.push({ type: 'char', id: chr(o.passenger) || 'linh', x: .3, y: 'ground', dy: -105, s: .62, pose: 'cheer', expr: 'joy', noShadow: 1, v: { x: .29, dy: -86, s: .5 } });
    if (o.sign) L.push({ type: 'fn', draw: lt => SB.roadSign(lt, o.sign, o.sub || '', dur) });
    L.push({ type: 'fn', screen: true, draw: lt => { const sp = stop ? 1 - E.out(inv(dur * .45, dur * .6, lt)) : 1; if (sp > .1) speedLines(lt, sp * .55); } });
    const scroll = stop ? [{ t: 0, v: 0 }, { t: dur * .45, v: dur * .45 * 900 }, { t: dur * .62, v: dur * .45 * 900 + 300, ease: 'out' }, { t: dur, v: dur * .45 * 900 + 340 }] : [{ t: 0, v: 0 }, { t: dur, v: dur * 900, ease: 'lin' }];
    return { dur, place, placeOpts: { time: o.time }, scroll, layers: L, captions: caps, moves: [{ type: 'handheld', amp: .6 }], v: { cam: [{ t: 0, x: .42, y: .62, z: 1.2 }] } }; },
  // ---------- GAG / reaction: setup → crash zoom + dutch + shake + punch text
  gag(o, b) { const hero = chr(o.hero) || 'dave'; const place = placeOr(o.place, 'oldquarter'); const { caps, end } = timeCaps(b.caps, .2, .05, b.capStyle); const tHit = num(o.hit, Math.min(1.8, Math.max(1.2, end * .4))); const dur = Math.max(num(o.dur, 0), end + .3, tHit + 2.4);
    const L = [{ type: 'char', id: hero, x: .45, y: 'ground', dy: 40, s: 1.35, pose: o.hold ? 'hold' : 'stand', hold: o.hold, holdScale: .38, expr: o.mood || 'happy', keys: [{ t: tHit, expr: o.react || 'shocked', pose: o.reactPose || 'scared' }], v: { x: .5, s: 1.05 } }];
    if (o.punch) L.push({ type: 'ui', name: 'punch', screen: true, at: tHit + .05, o: { x: .66, y: .28, text: o.punch, size: 120, life: dur - tHit }, v: { o: { x: .5, y: .3, size: 100 } } });
    L.push({ type: 'fn', screen: true, draw: lt => { const p = E.out5(inv(tHit, tHit + .2, lt)) * (1 - inv(tHit + 1.6, tHit + 2.2, lt)); if (p > 0) focusLines(W * .47, H * .45, lt, p * .8); } });
    return { dur, place, placeOpts: { time: o.time }, layers: L, captions: caps, shakes: [[tHit + .05, 20, .5]], moves: [{ type: 'drift' }, { type: 'crashZoom', t0: tHit, t1: tHit + .22, amt: .8, to: [.46, .5] }, { type: 'dutch', t0: tHit, t1: tHit + .25, deg: 7, ease: 'out5' }] }; },
  // ---------- SOCIAL night: toasts, sparkles, expression drift
  social(o, b) { const hero = chr(o.hero) || 'dave', host = chr(o.host) || 'hmong_grandpa'; const place = placeOr(o.place, 'homestay'); const { caps, end } = timeCaps(b.caps, .2, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 6); const n = num(o.toasts, 3);
    const times = Array.from({ length: n }, (_, i) => 1.6 + i * Math.min(1.4, (dur - 3) / n)); const kk = []; const moods = ['happy', 'tipsy', 'dizzy', 'dizzy'];
    times.forEach((t, i) => { kk.push({ t, pose: 'toast', expr: o.drift === 'no' ? 'joy' : moods[Math.min(i, 3)] }); kk.push({ t: t + .5, pose: 'sitHold' }); });
    const L = [{ type: 'char', id: hero, x: .37, y: 'ground', dy: 0, s: 1.3, pose: 'sitHold', expr: 'happy', keys: kk, v: { x: .3, s: 1.3 } },
      { type: 'char', id: host, x: .63, y: 'ground', dy: 0, s: 1.3, pose: 'sitHold', flip: 1, keys: kk.map(k => ({ t: k.t, pose: k.pose })), v: { x: .72, s: 1.3 } },
      { type: 'fn', draw: lt => { const u = U(), gy = PLACE[place].ground(), ty = gy - 95 * u, tw = Math.min(W * .36, 640 * u); rr(W / 2 - tw, ty, tw * 2, 400 * u, 0, '#8c5c33', 7 * u); sEll(W / 2, ty, tw, 60 * u, '#a8713f', { lw: 7 * u }); drawProp(o.drink || 'ruou_ngo', W / 2, ty + 14 * u, .85 * u, {}, lt); drawProp(o.food || 'pho', W / 2 - tw * .5, ty + 20 * u, .62 * u, {}, lt); drawProp(o.food2 || 'comtam', W / 2 + tw * .5, ty + 20 * u, .66 * u, {}, lt);
          for (const c of times) { const d = lt - c; if (d > 0 && d < .7) { const s = E.out(clamp(d / .3)); ctx.save(); ctx.globalAlpha *= 1 - clamp((d - .3) / .4); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; sparkle(W / 2 + Math.cos(a) * 120 * s * u, H * .4 + Math.sin(a) * 120 * s * u, .8 * u, a, C.yel); } ctx.restore(); } } } }];
    if (o.cheer) L.push({ type: 'ui', name: 'punch', screen: true, at: times[0] - .3, o: { x: .5, y: .17, text: o.cheer, size: 96, font: 'body', life: 1.5 }, v: { o: { y: .15, size: 66 } } });
    return { dur, place, layers: L, captions: caps, capY: { v: .42 }, shakes: times.map(t => [t, 7, .25]), sfx: times.map(t => [t, 'clink']), cam: [{ t: 0, x: .5, y: .56, z: 1.08 }, { t: dur, z: 1.16 }], v: { cam: [{ t: 0, x: .5, y: .5, z: 1 }, { t: dur, z: 1.06 }] } }; },
  // ---------- STAT: one big animated number
  stat(o, b) { const { caps, end } = timeCaps(b.caps, .4, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 3.5);
    return { dur, render: lt => { burstBg(W / 2, H * .45, 18, lt * .2, o.bg || C.brand, shade(o.bg || C.brand, -.06)); UI.counter(pop(lt, .1), { x: W / 2, y: H * .42, to: num(o.value, 100), from: num(o.from, 0), prefix: o.prefix || '', suffix: o.suffix || '', decimals: num(o.decimals, 0), size: Math.min(H > W ? 200 : 230, (H > W ? .86 : .8) * W / (Math.max(3, (String(o.prefix || '') + String(Math.max(Math.abs(num(o.value, 100)), Math.abs(num(o.from, 0)))) + String(o.suffix || '')).length) * .56 * U())), at: .2, dur: 1.4, fill: '#fff' }, lt); if (o.label) T(o.label, W / 2, H * .58, { size: Math.min(60 * U(), typeof fitSize === 'function' ? fitSize(o.label, W * .82, 60 * U(), 'body', 800) : 60 * U()), font: 'body', fill: C.yel, scale: pop(lt, 1.2) }); }, captions: caps, shakes: [[1.6, 10, .3]], sfx: [[.2, 'tick'], [1.6, 'ding']] }; },
  // ---------- SCALE gag: something very tall/deep with an escalating ruler
  scale(o, b) { const { caps, end } = timeCaps(b.caps, .2, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 6); const marks = split(o.marks || 'here|far|farther|MUCH farther|NOPE.');
    return { dur, place: placeOr(o.place, 'phongnha'), cam: [{ t: 0, x: .5, y: .3, z: 1.7 }, { t: dur * .7, y: .7, ease: 'inOut' }], layers: [
      { type: 'fn', screen: true, draw: lt => { const u = U(), rx = W * .86, p = clamp(lt / (dur * .7)); line(rx, H * .1, rx, H * .9, 8 * u, '#fff'); marks.forEach((m, i) => { const y = H * (.1 + .8 * i / Math.max(1, marks.length - 1)); if (p * marks.length >= i) { line(rx - 20 * u, y, rx + 20 * u, y, 8 * u, C.ink); T(m, rx - 40 * u, y, { size: 44 * u, align: 'right', fill: i === marks.length - 1 ? '#ff8a6a' : '#fff', scale: pop(lt, i * dur * .7 / marks.length, .3) }); } }); } }], captions: caps }; },
  // ---------- PAYOFF: sunset, transformed hero, title, CTA
  payoff(o, b) { const hero = chr(o.hero) || 'dave', host = chr(o.host); const place = placeOr(o.place, 'hagiang'); const { caps, end } = timeCaps(b.caps, .2, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 7); const tt = split(o.title || 'VIETNAM');
    const L = [{ type: 'particles', name: 'sparkles', a: .8 }, { type: 'char', id: hero, x: .36, y: 'ground', s: 1.3, pose: 'thumbs', expr: 'cool', spec: o.beard === 'no' ? {} : { beard: { color: HAIR.brown, a: .6 } }, in: { type: 'up', at: 0, dur: .6 }, wind: 1, keys: [{ t: 2.2, x: .26 }], v: { x: host ? .34 : .5, keys: [{ t: 2.2, x: host ? .34 : .5 }], s: 1.12 } }];
    if (host) L.push({ type: 'char', id: host, x: .54, y: 'ground', s: 1.2, pose: 'cheer', expr: 'joy', in: { type: 'slideR', at: .6, dur: .5 }, keys: [{ t: 2.2, x: .44 }], v: { x: .7, keys: [{ t: 2.2, x: .7 }], s: 1.0 } });
    const ml = Math.max(...tt.map(x => x.length)); L.push({ type: 'ui', name: 'title', screen: true, at: 2.5, o: { text: tt, x: .73, y: .32, size: Math.min(130, 860 / (ml * .58)), at: 2.5 }, v: { o: { x: .5, y: .22, size: Math.min(120, 1080 * .84 / (ml * .58 * 1.25)) } } });
    if (o.sub) L.push({ type: 'text', text: o.sub, x: .73, y: .56, size: 46, font: 'body', in: { type: 'pop', at: 3.0 }, v: { x: .5, y: .335, size: 40 } });
    L.push({ type: 'ui', name: 'cta', screen: true, at: 3.5, o: { x: .73, y: .7, top: o.ctaTop || 'Full guide, prices & tips', text: o.cta || 'vietadvisor.travel', s: .9 }, v: { o: { x: .5, y: .41, s: .75 } } });
    return { dur, place, placeOpts: { time: o.time || 'sunset' }, scroll: [{ t: 0, v: 0 }, { t: dur, v: 300 }], layers: L, captions: caps, look: { grade: 'golden' }, capY: { v: .47 }, moves: [{ type: 'pullOut', t0: 0, t1: 2.4, amt: .15 }] }; },
  chapter(o, b) { return { dur: num(o.dur, 2.6), place: placeOr(o.place, 'studio'), layers: [{ type: 'ui', name: 'chapter', screen: true, at: .1, o: { num: o.num, text: o.text || '' } }], captions: timeCaps(b.caps, .3, .05, b.capStyle).caps }; },
  end(o) { return { dur: num(o.dur, 2), layers: [{ type: 'ui', name: 'endFrame', screen: true, always: 1, o: { url: o.url } }] }; },
  raw(o, b) { return b.raw; },
};
SB.titleRender = (lt, lines, o) => { const u = U(), V = H > W; burstBg(W / 2, H * .45, 18, lt * .25, o.bg || C.red, shade(o.bg || C.red, -.08));
  ctx.save(); ctx.globalAlpha = .9; star(W / 2, H * .45, Math.min(W, H) * .4 * E.back(clamp(lt / .4)), shade(o.bg || C.red, .08), 0, lt * .2); ctx.restore();
  for (let i = 0; i < 16; i++) karstPeak(((i * 170 * u - lt * 120 * u) % (W + 300 * u) + W + 300 * u) % (W + 300 * u) - 150 * u, H, 220 * u, (140 + (i * 37 % 120)) * u, shade(o.bg || C.red, -.25), 0);
  const bp = inv(.9, 2.6, lt); if (bp > 0 && bp < 1 && o.bike !== 'no') { const bx = lerp(-300 * u, W + 300 * u, bp); drawProp('moto', bx, H - 50 * u, .7 * u, { spin: lt * 25, shadow: false }, lt); person(bx - 28 * u, H - 75 * u, .64 * u, CHAR[chr(o.hero) || 'dave'].spec, { t: lt, pose: 'ride', expr: 'grin', headwear: { type: 'helmet', color: C.yel }, wind: 1, noShadow: 1 }); }
  const maxLen = Math.max(...lines.map(l => l.length)); const size = Math.min(V ? 170 : 210, (W * .86) / (maxLen * .55 * u));
  UI.title(1, { text: lines, size, x: W / 2, y: H * .42, accentLast: lines.length > 1, at: 0, sub: o.sub }, lt);
  for (let i = 0; i < 6; i++) { const a = i * 1.1 + lt; sparkle(W / 2 + Math.cos(a) * W * .4, H * .45 + Math.sin(a * 1.3) * H * .35, (.8 + .4 * Math.sin(lt * 6 + i)) * u, lt * 2 + i); } };
SB.roadSign = (lt, title, sub, dur) => { const u = U(), x = W * (H > W ? .66 : .7), gy = PLACE.hagiang.ground(); const sp = E.out5(inv(dur * .35, dur * .62, lt)); const sx = lerp(W + 400 * u, x, sp);
  ctx.save(); ctx.translate(sx, 0); sRR(-230 * u, gy - 330 * u, 26 * u, 330 * u, 6 * u, '#7a5232'); sRR(204 * u, gy - 330 * u, 26 * u, 330 * u, 6 * u, '#7a5232'); sRR(-260 * u, gy - 520 * u, 520 * u, 220 * u, 18 * u, '#efe2c0', { lw: 8 * u });
  const ts = Math.min(72, 440 / Math.max(1, textW(title, 1, 'body', 900))); T(title, 0, gy - 450 * u, { size: ts * u, font: 'body', weight: 900, fill: C.red, lw: 0 }); if (sub) T(sub, 0, gy - 370 * u, { size: 32 * u, font: 'body', fill: '#7a6450', lw: 0, ls: 3 * u }); ctx.restore(); };
SB.doodles = (P, o, pts) => { const u = U(), k = o.k, r = rng(21); const lons = pts.map(p => p[0]), lats = pts.map(p => p[1]); const x0 = Math.min(...lons) - .15, x1 = Math.max(...lons) + .15, y0 = Math.min(...lats) - .12, y1 = Math.max(...lats) + .12;
  for (let i = 0; i < 70; i++) { const lo = lerp(x0, x1, r()), la = lerp(y0, y1, r()), sz = .6 + r() * .6; const [x, y] = P(lo, la); karstPeak(x, y, 44 * sz * u, 56 * sz * u, '#7aac5a', 3 * u); } };

// ---------------------------------------------------------------- compile
SB.compile = (text) => {
  const sb = SB.parse(text), H_ = sb.header; window.PP_IDLE = /^(on|yes|1)$/i.test(H_.idle || '') ? 1 : 0; /* v6.3: no idle breathing or floating unless idle: on */ const look = {}; const kvs = (H_.look || '').split(/\s+/).filter(Boolean).map(s => s.split('='));
  for (const [k, v] of kvs) { if (k === 'grade') look.grade = v; if (k === 'artstyle') look.artstyle = v; if (k === 'captions') look.captionStyle = v; if (k === 'boil') look.boil = v === 'off' ? undefined : (v === 'on' ? { amp: 1.1, fps: 8 } : { amp: +v, fps: 8 }); if (k === 'step') look.step = +v; if (k === 'smear') look.smear = v !== 'off'; }
  if (H_.artstyle) look.artstyle = H_.artstyle;
  const used = []; const scenes = [];
  sb.beats.forEach((b, i) => { const o = b.opt; b.capStyle = o.caps; const R = SB.recipes[b.type]; if (!R) { console.warn('unknown beat', b.type); return; }
    const sc = R(o, b) || {}; sc.id = sc.id || `${i + 1}_${b.type}`;
    if (o.place && PLACE[o.place] && !sc.render) sc.place = o.place; if (o.time && sc.placeOpts) sc.placeOpts.time = o.time;
    if (o.grade) sc.look = { ...(sc.look || {}), grade: o.grade };
    if (o.dur) sc.dur = +o.dur;
    if (o.artstyle) sc.artstyle = o.artstyle; // whole-frame art direction (engine/library/artstyles.js)
    if (o.caps === 'off' || /^(off|none|srt)$/i.test(H_.captions || '')) sc.hideCaps = true; // voice still plays; `captions: off` in the header = no burned-in captions (YouTube gets the .srt)
    if (o.art && window.TYPE) { const prev = sc.post; const ao = { at: o.artAt !== undefined ? +o.artAt : .3, out: o.artOut !== undefined ? +o.artOut : undefined, x: o.artX !== undefined ? +o.artX : undefined, y: o.artY !== undefined ? +o.artY : undefined, col: o.artCol, size: o.artSize ? +o.artSize : 1, role: o.artRole };
      sc.post = (lt, S) => { if (prev) prev(lt, S); TYPE.draw(o.artfx || 'slam', o.art, lt, ao); }; sc.art = { fx: o.artfx || 'slam', at: ao.at }; } // art-directed lettering on any beat (engine/library/typekit.js)
    if (o.capY !== undefined && b.type !== 'moment') sc.capY = { v: +o.capY, h: Math.min(.88, +o.capY + .02) }; // per-beat caption height override
    if (i > 0) { const alts = (o.trans ? [o.trans] : TRANS[b.type] || ['whip']); const prev = used[used.length - 1]; const tt = alts.find(a => a !== prev) || alts[0]; sc.transition = { type: tt, dur: tt === 'cut' ? 0 : (['circles', 'stripes', 'iris', 'ink', 'inkbleed', 'burn', 'lightleak', 'fgwipe', 'tear'].includes(tt) ? .7 : .45) }; if (o.tc) sc.transition.center = String(o.tc).split(',').map(Number); if (o.tc2) sc.transition.center2 = String(o.tc2).split(',').map(Number); if (o.tcol) sc.transition.col = o.tcol; if ((window.TR2_DUR || {})[tt]) sc.transition.dur = window.TR2_DUR[tt]; if (o.tdur) sc.transition.dur = +o.tdur; used.push(tt); }
    if (!sc.render) { sc.moves = sc.moves || []; if (!sc.moves.some(m => ['drift', 'handheld'].includes(m.type))) sc.moves.unshift({ type: pick(CAMS, i) }); if (o.cam) String(o.cam).split('+').forEach(c => { if (MOVES[c]) sc.moves.push({ type: c, t0: 0, t1: sc.dur }); }); }
    scenes.push(sc); });
  if (!scenes.length || sb.beats[sb.beats.length - 1].type !== 'end') scenes.push({ id: 'end', dur: 2, transition: { type: 'brand', dur: .6 }, layers: [{ type: 'ui', name: 'endFrame', screen: true, always: 1, o: {} }] });
  return { title: H_.title || 'Untitled', fps: 30, look, sources: H_.sources ? [H_.sources] : [], scenes };
};
