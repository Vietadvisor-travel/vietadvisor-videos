/* =====================================================================
   BEATS II — extra storyboard beats so every video can have its own shape.
   countdown · myth · quiz · timeline · steps · budget · calendar · dialogue · montage · hook
   + title variants (variant=slam|paper|place) and FORMAT presets.
   All layouts are computed for 16:9 and 9:16 (V = vertical).
   ===================================================================== */
'use strict';
const _V = () => H > W;
function wrapLines(text, maxW, size, font = 'display', weight) { const words = String(text).split(/\s+/); const out = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (textW(t, size, font, weight) > maxW && cur) { out.push(cur); cur = w; } else cur = t; } if (cur) out.push(cur); return out; }
// visuals follow the voice: when a beat has one caption per item, item i appears as caption i starts
function syncTimes(caps, n, first, step) { if (caps.length === n && n > 0) return caps.map(c => Math.max(.2, c[0] + .1)); return Array.from({ length: n }, (_, i) => first + i * step); }
function card(x, y, w, h, fill = '#fff8e6', o = {}) { const u = U(); ctx.save(); ctx.globalAlpha *= .22; rr(x + 10 * u, y + 14 * u, w, h, (o.r ?? 26) * u, '#000', 0); ctx.restore(); sRR(x, y, w, h, (o.r ?? 26) * u, fill, { lw: (o.lw ?? 7) * u }); }
function fitSize(text, maxW, size, font, weight) { const w = textW(text, size, font, weight); return w > maxW ? size * maxW / w : size; }
const bgPaper = (lt, col = '#efe0bb') => { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); const r = rng(9), u = U(); ctx.save(); ctx.globalAlpha = .08; for (let i = 0; i < 90; i++) circ(r() * W, r() * H, (2 + r() * 6) * u, '#7a5a30', 0); ctx.restore(); ctx.save(); ctx.globalAlpha = .18; ctx.lineWidth = 2 * u; ctx.strokeStyle = '#a07a45'; for (let y = 120 * u; y < H; y += 120 * u) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore(); };

Object.assign(SB.recipes, {
  // ---------- COLLAGE: real-photo stickers slap onto paper one by one (synced to captions), camera visits each, then pulls back
  collage(o, b) { const ids = split(o.photos), labs = split(o.labels); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const n = Math.max(1, ids.length); const ats = syncTimes(caps, n, .4, num(o.step, 1.1)); const dur = Math.max(num(o.dur, 0), end + .4, ats[n - 1] + 2.2);
    const slots = n === 1 ? [[.5, .45]] : n === 2 ? [[.32, .45], [.68, .5]] : n === 3 ? [[.22, .42], [.52, .55], [.8, .4]] : n === 4 ? [[.25, .32], [.72, .3], [.3, .7], [.7, .68]] : [[.2, .3], [.5, .27], [.8, .32], [.3, .68], [.68, .7], [.5, .5]];
    const vslots = n === 1 ? [[.5, .42]] : n === 2 ? [[.5, .3], [.5, .6]] : n === 3 ? [[.35, .27], [.66, .47], [.38, .66]] : [[.3, .26], [.7, .34], [.32, .52], [.68, .62], [.4, .74], [.6, .2]];
    const r = rng(ids.join().length + 3); const L = [];
    ids.forEach((id, i) => { const [x, y] = slots[i % slots.length], [vx, vy] = vslots[i % vslots.length]; const hh = n <= 2 ? 560 : n <= 4 ? 400 : 330; L.push({ type: 'image', img: id, x, y, h: hh, style: o.style || 'sticker', rot: (r() - .5) * .16, label: labs[i], in: { type: 'slap', at: ats[i], dur: .35 }, v: { x: vx, y: vy, h: hh * .95 } }); });
    L.unshift({ type: 'fn', draw: lt => { const u = U(), V = H > W; ctx.save(); ctx.setLineDash([14 * u, 12 * u]); ctx.lineCap = 'round'; for (let i = 1; i < n; i++) { const p = E.out(inv(ats[i] - .3, ats[i] + .2, lt)); if (p <= 0) continue; const a = (V ? vslots : slots)[(i - 1) % 6], c = (V ? vslots : slots)[i % 6]; const ax = a[0] * W, ay = a[1] * H, cx = c[0] * W, cy = c[1] * H; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + cx) / 2, Math.min(ay, cy) - 120 * u, lerp(ax, cx, p), lerp(ay, cy, p) - Math.sin(p * Math.PI) * 60 * u); ctx.lineWidth = 6 * u; ctx.strokeStyle = C.brand; ctx.stroke(); } ctx.restore(); } });
    const cam = [{ t: 0, x: .5, y: .5, z: 1 }]; ids.forEach((_, i) => { const [x, y] = slots[i % slots.length]; cam.push({ t: ats[i] + .1, x, y, z: n > 1 ? 1.22 : 1.08, ease: 'smooth', dur: .7 }); }); cam.push({ t: dur - 1.2, x: .5, y: .5, z: 1, ease: 'smooth', dur: 1 });
    const vcam = [{ t: 0, x: .5, y: .5, z: 1 }]; ids.forEach((_, i) => { const [x, y] = vslots[i % vslots.length]; vcam.push({ t: ats[i] + .1, x, y, z: n > 1 ? 1.15 : 1.05, ease: 'smooth', dur: .7 }); }); vcam.push({ t: dur - 1.2, x: .5, y: .5, z: 1, ease: 'smooth', dur: 1 });
    return { dur, place: 'studio', placeOpts: { color: o.bg || '#ecdcb8', color2: '#f3e6c8', floor: false }, layers: L, cam, v: { cam: vcam }, captions: caps, capY: { v: .84 }, sfx: ats.map(a => [a, 'stamp']), light: 'none' }; },
  // ---------- PHOTO plate: a real photo fills the frame (slow Ken Burns), optional cartoon host in front = mixed media
  photo(o, b) { const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .4, 4); const f = String(o.focus || '.5,.5').split(',').map(Number);
    const L = [{ type: 'image', img: o.img, screen: true, style: 'cover', z0: num(o.z0, 1.04), z1: num(o.z1, 1.16), focus: f }];
    if (o.label) L.push({ type: 'ui', name: 'banner', screen: true, at: .6, o: { x: .5, y: .14, text: o.label, size: 56 }, v: { o: { y: .2, size: 50 } } });
    if (o.credit !== 'no') L.push({ type: 'fn', screen: true, draw: lt => { const m = window.IMAGES[o.img] || {}; if (m.credit) T(m.credit, W - 24 * U(), H - 22 * U(), { size: 20 * U(), font: 'body', fill: 'rgba(255,255,255,.75)', lw: 0, align: 'right' }); } });
    const hero = chr(o.hero); if (hero) L.push({ type: 'char', id: hero, screen: true, x: num(o.hx, .2), y: .96, s: 1.15, pose: o.pose || 'point', expr: o.mood || 'happy', in: { type: 'up', at: .4 }, stage: 'none', v: { x: .26, y: .82, s: .95 } });
    return { dur, layers: L, captions: caps, capY: { v: .74 } }; },
  // ---------- COUNTDOWN item: "#3 — Bánh mì" — big number slam, prop pops, label banner
  countdown(o, b) { const { caps, end } = timeCaps(b.caps, .55, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 4); const n = String(o.n ?? '1'); const col = o.bg || pick(['#2f5fb0', '#1f8a6a', '#7a4fa0', '#d9662a', '#c0392b'], +n || 0); const hero = chr(o.hero);
    const L = [{ type: 'fn', screen: true, draw: lt => { const u = U(), V = _V(); const p = E.out5(clamp(lt / .35)); const nx = V ? W * .5 : W * .2, ny = V ? H * .2 : H * .45; ctx.save(); ctx.translate(nx, ny); ctx.rotate(-.12); T('#' + n, 0, 0, { size: (V ? 260 : 330) * u, fill: C.yel, scale: lerp(2.4, 1, p), alpha: clamp(lt / .12), shadow: 14 * u, lw: 34 * u }); ctx.restore(); } }];
    if (o.prop && PROP[o.prop]) L.push({ type: 'prop', name: o.prop, screen: true, x: .58, y: .66, s: num(o.size, 1.7), in: { type: 'pop', at: .45 }, v: { x: .5, y: .58, s: num(o.size, 1.7) * .95 } });
    if (hero) L.push({ type: 'char', id: hero, screen: true, x: .86, y: .95, s: 1.0, pose: o.pose || 'point', expr: o.mood || 'happy', flip: 1, in: { type: 'slideR', at: .8 }, stage: 'none', v: { x: .82, y: .8, s: .8 } });
    L.push({ type: 'ui', name: 'banner', screen: true, at: .8, o: { x: .58, y: .2, text: (o.text || '').toUpperCase(), size: 64 }, v: { o: { x: .5, y: .36, size: 56 } } });
    if (o.sub) L.push({ type: 'text', screen: true, text: o.sub, x: .58, y: .31, size: 44, font: 'body', in: { type: 'pop', at: 1.1 }, v: { x: .5, y: .68, size: 40 } });
    return { dur, render: null, place: 'studio', placeOpts: { color: col, color2: shade(col, .08), floor: false }, layers: L, captions: caps, shakes: [[.3, 16, .4]], sfx: [[.05, 'whoosh_up'], [.3, 'impact']], capY: { v: .75 } }; },

  // ---------- MYTH vs FACT: myth card → BUSTED stamp → fact card
  myth(o, b) { const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 5.5); const tf = num(o.factAt, caps.length > 1 ? caps[1][0] + .05 : Math.min(3.1, dur * .5)), tb = num(o.bust, Math.max(.8, tf - 1)); const host = chr(o.host);
    const L = [{ type: 'fn', screen: true, draw: lt => { const u = U(), V = _V(); const cw = V ? W * .84 : W * .52, cx = V ? W * .5 : W * .6, cy = V ? H * (host ? .21 : .36) : H * .42;
      const drawCard = (label, text, col, x, rot, a, sc) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, cy); ctx.rotate(rot); ctx.scale(sc, sc); const sz = (V ? 58 : 60) * u; const lines = wrapLines(text, cw - 120 * u, sz, 'body', 800); const ch = lines.length * sz * 1.25 + 210 * u; card(-cw / 2, -ch / 2, cw, ch, '#fffaf0'); rr(-cw / 2, -ch / 2, cw, 92 * u, 26 * u, col, 7 * u); T(label, 0, -ch / 2 + 46 * u, { size: 56 * u, fill: '#fff', lw: 0, ls: 6 * u }); lines.forEach((l, i) => T(l, 0, -ch / 2 + 140 * u + sz * .6 + i * sz * 1.25, { size: sz, font: 'body', weight: 800, fill: C.ink, lw: 0 })); ctx.restore(); };
      const out = E.in(inv(tf - .1, tf + .3, lt)); drawCard('MYTH', o.myth || '…', '#7a6450', cx - out * W * 1.1, -.03 - out * .3, out < 1 ? 1 : 0, E.back(clamp(lt / .4)));
      if (lt > tb && lt < tf) UI.stamp(1, { x: cx, y: cy, text: o.stamp || 'BUSTED', at: tb, size: V ? 96 : 110, color: C.red, rot: -.18 }, lt);
      drawCard('FACT', o.fact || '…', '#2e8b57', cx + (1 - E.out5(inv(tf, tf + .45, lt))) * W * .9, .02, lt > tf ? 1 : 0, 1);
      if (lt > tf + .3) { const p = E.back(clamp((lt - tf - .3) / .3)); ctx.save(); ctx.translate(cx + cw / 2 - 30 * u, cy - 120 * u); ctx.scale(p, p); sCirc(0, 0, 54 * u, '#2e8b57', { lw: 6 * u }); pline([[-24 * u, 0], [-6 * u, 20 * u], [26 * u, -18 * u]], 12 * u, '#fff'); ctx.restore(); } } }];
    if (host) L.push({ type: 'char', id: host, x: .14, y: 'ground', s: 1.25, pose: 'shrug', expr: 'thinking', keys: [{ t: tb, expr: 'shocked', pose: 'scared' }, { t: tf + .2, expr: 'happy', pose: 'point' }], in: { type: 'up', at: 0 }, v: { x: .5, s: .72 } });
    return { dur, place: placeOr(o.place, 'studio'), placeOpts: { color: o.bg || '#e9dcc0', time: o.time }, layers: L, captions: caps, shakes: [[tb + .05, 18, .45]], sfx: [[tb, 'stamp'], [tb + .05, 'buzzer'], [tf, 'whoosh'], [tf + .3, 'ding']], capY: { v: host ? .5 : .72 } }; },

  // ---------- QUIZ: question + 3 options + 3-2-1 ring + reveal
  quiz(o, b) { const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const opts = split(o.options || 'A|B|C'); const ans = num(o.answer, 1) - 1; const tq = .3, to = tq + .6, tc = to + opts.length * .35 + .3, tr = num(o.reveal, caps.length > 1 ? Math.max(tc + 1.5, caps[caps.length - 1][0]) : tc + 3); const dur = Math.max(num(o.dur, 0), end + .3, tr + 2.2);
    const render = lt => { const u = U(), V = _V(); burstBg(W / 2, H * .5, 16, lt * .1, o.bg || '#2f5fb0', shade(o.bg || '#2f5fb0', .06));
      const qs = (V ? 70 : 80) * u, ql = wrapLines(o.q || 'Question?', W * .82, qs, 'display'); ql.forEach((l, i) => T(l, W / 2, (V ? H * .2 : H * .16) + i * qs * 1.05, { size: qs, fill: '#fff', scale: pop(lt, tq + i * .08), shadow: 8 * u }));
      const ow = V ? W * .8 : W * .26, oh = (V ? 130 : 150) * u; opts.forEach((txt, i) => { const p = pop(lt, to + i * .35, .4); if (p <= 0) return; const x = V ? W / 2 : W * (.5 + (i - (opts.length - 1) / 2) * .3), y = V ? H * (.4 + i * .1) : H * .52; const rev = lt > tr, ok = i === ans; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); if (rev && !ok) ctx.globalAlpha *= .45; card(-ow / 2, -oh / 2, ow, oh, rev ? (ok ? '#4fb06a' : '#e7d9c4') : '#fffaf0'); sCirc(-ow / 2 + 64 * u, 0, 40 * u, rev && ok ? '#fff' : C.brand, { lw: 5 * u }); T('ABCD'[i], -ow / 2 + 64 * u, 0, { size: 44 * u, fill: rev && ok ? '#4fb06a' : '#fff', lw: 0 }); const fsz = fitSize(txt, ow - 160 * u, 52 * u, 'body', 800); T(txt, 22 * u, 0, { size: fsz, font: 'body', weight: 800, fill: rev && ok ? '#fff' : C.ink, lw: 0 }); ctx.restore(); if (rev && !ok) { const q = E.out(clamp((lt - tr) / .2)); line(x - ow * .4 * q, y - oh * .3 * q, x + ow * .4 * q, y + oh * .3 * q, 10 * u, C.red); } });
      if (lt > tc && lt < tr) { const k = (lt - tc) / (tr - tc), n = Math.ceil(3 * (1 - k)); const cx = V ? W / 2 : W * .5, cy = V ? H * .76 : H * .8; sCirc(cx, cy, 70 * u, '#fff', { lw: 6 * u }); ctx.save(); ctx.lineWidth = 12 * u; ctx.strokeStyle = C.brand; ctx.beginPath(); ctx.arc(cx, cy, 52 * u, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - k)); ctx.stroke(); ctx.restore(); T(String(n), cx, cy, { size: 64 * u, fill: C.ink, lw: 0, scale: 1 + .2 * (1 - ((3 * (1 - k)) % 1)) }); }
      if (lt > tr) PARTICLES.confetti && PARTICLES.confetti(lt - tr, 1, 3); };
    return { dur, render, captions: caps, capY: { h: .93, v: .8 }, sfx: [[to, 'pop'], [tc, 'tick'], [tc + (tr - tc) / 3, 'tick'], [tc + 2 * (tr - tc) / 3, 'tick'], [tr, 'ding']], shakes: [[tr, 10, .3]] }; },

  // ---------- TIMELINE (history): events="1802;Nguyễn dynasty|1945;Independence"
  timeline(o, b) { const ev = split(o.events).map(e => e.split(';')); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const step = num(o.step, Math.max(1, Math.min(2.2, (end - .6) / Math.max(1, ev.length)))); const ats = syncTimes(caps, ev.length, .5, step); const dur = Math.max(num(o.dur, 0), end + .3, ats[ats.length - 1] + 1.5);
    const render = lt => { const u = U(), V = _V(); bgPaper(lt, o.bg || '#efe0bb'); const n = ev.length; const prog = n > 1 ? clamp((lt - ats[0] + .3) / (ats[n - 1] - ats[0] + .3)) : 1; let cur = 0; ats.forEach((a, i) => { if (lt >= a) cur = i; });
      // camera follows the newest event
      const span = V ? H * .62 : W * .78, gap = span / Math.max(1, n - 1 || 1); const pos = i => V ? [W * .28, H * .2 + i * gap] : [W * .11 + i * gap, H * .52];
      const follow = V ? 0 : 0; ctx.save(); ctx.translate(follow, 0);
      const [x0, y0] = pos(0), [x1, y1] = pos(n - 1); ctx.lineCap = 'round'; if (V) line(x0, y0 - 40 * u, x0, lerp(y0, y1, prog) + 10 * u, 12 * u, C.ink); else line(x0 - 40 * u, y0, lerp(x0, x1, prog) + 10 * u, y0, 12 * u, C.ink);
      ev.forEach(([yr, label, prop], i) => { const at = ats[i], p = pop(lt, at, .45); if (p <= 0) return; const [x, y] = pos(i); const hot = i === cur; sCirc(x, y, (hot ? 34 : 24) * u * p, hot ? C.brand : '#fff', { lw: 6 * u });
        const ys = (hot ? 92 : 70) * u; if (V) { T(yr, x + 70 * u, y - 28 * u, { size: ys, fill: hot ? C.brand : C.ink, lw: 0, align: 'left', scale: p }); wrapLines(label || '', W * .58, 40 * u, 'body', 800).forEach((l, k) => T(l, x + 72 * u, y + 30 * u + k * 46 * u, { size: 40 * u, font: 'body', weight: 800, fill: C.inkSoft, lw: 0, align: 'left', alpha: clamp(p) })); if (prop && PROP[prop]) drawProp(prop, W * .14, y + 40 * u, .35 * u * p, {}, lt); }
        else { const up = i % 2 === 0; T(yr, x, y + (up ? -80 : 80) * u, { size: ys, fill: hot ? C.brand : C.ink, lw: 0, scale: p }); wrapLines(label || '', Math.min(gap * .95, W * .3), 46 * u, 'body', 800).forEach((l, k) => T(l, x, y + (up ? -160 - k * 52 : 160 + k * 52) * u, { size: 46 * u, font: 'body', weight: 800, fill: C.inkSoft, lw: 0, alpha: clamp(p) })); if (prop && PROP[prop]) drawProp(prop, x, y + (up ? 330 : -210) * u, .5 * u * p, {}, lt); } });
      ctx.restore(); if (o.title) T(o.title.toUpperCase(), W / 2, V ? H * .1 : H * .1, { size: (V ? 70 : 76) * u, fill: C.yel, scale: pop(lt, .1), shadow: 8 * u }); };
    return { dur, render, captions: caps, capY: { v: .8 }, sfx: ats.map(a => [a, 'pop']).concat([[0, 'pen_draw']]) }; },

  // ---------- STEPS: numbered cards with icons. items="Book a rider|Pack light" icons="phone|backpack"
  steps(o, b) { const items = split(o.items), icons = split(o.icons); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const step = num(o.step, Math.max(.7, Math.min(1.8, (end - .8) / Math.max(1, items.length)))); const ats = syncTimes(caps, items.length, .6, step); const dur = Math.max(num(o.dur, 0), end + .3, ats[ats.length - 1] + 1.6); const host = chr(o.host);
    const L = [{ type: 'fn', screen: true, draw: lt => { const u = U(), V = _V(); const n = items.length, cw = V ? W * .84 : W * (host ? .56 : .66), ch = (V ? (host ? 118 : 150) : Math.min(150, (H * .66) / n - 20 / u)) * u, x = V ? W * .08 : (host ? W * .38 : (W - cw) / 2), y0 = V ? H * (host ? .16 : .19) : H * .2;
      T((o.title || 'HOW TO DO IT').toUpperCase(), V ? W / 2 : x + cw / 2, V ? H * (host ? .1 : .12) : H * .1, { size: (V ? 70 : 78) * u, fill: C.yel, scale: pop(lt, .1), shadow: 8 * u });
      items.forEach((txt, i) => { const at = ats[i], p = E.out5(inv(at, at + .4, lt)); if (p <= 0) return; const y = y0 + i * (ch + 22 * u); ctx.save(); ctx.translate((1 - p) * W * .6, 0); card(x, y, cw, ch, '#fffaf0'); sCirc(x + ch / 2, y + ch / 2, ch * .34, C.brand, { lw: 6 * u }); T(String(i + 1), x + ch / 2, y + ch / 2, { size: ch * .4, fill: '#fff', lw: 0 }); const ic = icons[i]; let tx = x + ch * 1.05; if (ic && PROP[ic]) { const pr = PROP[ic]; drawProp(ic, x + ch * 1.45, y + ch * .86, Math.min(ch * .7 / pr.w, ch * .7 / pr.h), {}, lt); tx = x + ch * 1.95; } const fsz = fitSize(txt, x + cw - tx - 30 * u, (V ? 46 : 48) * u, 'body', 800); T(txt, tx, y + ch / 2, { size: fsz, font: 'body', weight: 800, fill: C.ink, lw: 0, align: 'left' }); ctx.restore(); }); } }];
    if (host) L.push({ type: 'char', id: host, x: .17, y: 'ground', s: 1.3, pose: 'present', expr: 'happy', in: { type: 'up', at: 0 }, keys: [{ t: dur * .5, pose: 'point' }], v: { x: .5, s: .72 } });
    return { dur, place: placeOr(o.place, 'studio'), placeOpts: { color: o.bg || C.paper, time: o.time }, layers: L, captions: caps, capY: { v: host ? .52 : .8 }, sfx: ats.map(a => [a, 'slide']) }; },

  // ---------- BUDGET: stacked bar + animated total. items="Bike;1.2M|Homestays;900k" total="3M ₫" usd="$118" checked="Oct 2026"
  budget(o, b) { const items = split(o.items).map(s => s.split(';')); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const step = num(o.step, .55); const ats = syncTimes(caps.length > items.length ? caps.slice(0, items.length) : caps, items.length, .7, step); const tt = caps.length === items.length + 1 ? caps[items.length][0] + .1 : ats[ats.length - 1] + .5; const dur = Math.max(num(o.dur, 0), end + .3, tt + 2.2); const pal = ['#ee4d2d', '#2f5fb0', '#2e8b57', '#f8c848', '#7a4fa0', '#2fa59d'];
    const parse = v => { const m = String(v).replace(/,/g, '.').match(/([\d.]+)\s*([kKmM]?)/); if (!m) return 1; return +m[1] * (/[mM]/.test(m[2]) ? 1000 : 1); }; const vals = items.map(i => parse(i[1])), tot = vals.reduce((a, b) => a + b, 0) || 1;
    const render = lt => { const u = U(), V = _V(); ctx.fillStyle = o.bg || '#fbf1dc'; ctx.fillRect(0, 0, W, H); T((o.title || 'WHAT IT COSTS').toUpperCase(), W / 2, V ? H * .15 : H * .12, { size: (V ? 72 : 80) * u, fill: C.yel, scale: pop(lt, .1), shadow: 8 * u });
      const bx = W * .08, bw = W * .84, by = V ? H * .26 : H * .26, bh = (V ? 120 : 110) * u; card(bx - 8 * u, by - 8 * u, bw + 16 * u, bh + 16 * u, '#fff', { r: 20 }); let acc = 0;
      items.forEach(([name, v], i) => { const at = ats[i], p = E.out(inv(at, at + .45, lt)); const w = bw * vals[i] / tot; if (p > 0) { rr(bx + bw * acc / tot, by, w * p, bh, 0, pal[i % pal.length], 0); }
        const ly = V ? by + bh + 70 * u + i * 92 * u : by + bh + 90 * u + Math.floor(i / 2) * 100 * u, lx = V ? bx + 20 * u : bx + (i % 2) * bw / 2 + 20 * u; const lp = pop(lt, at + .2); if (lp > 0) { ctx.save(); ctx.globalAlpha *= clamp(lp); sRR(lx, ly - 22 * u, 44 * u, 44 * u, 10 * u, pal[i % pal.length], { lw: 5 * u }); T(name, lx + 70 * u, ly, { size: 46 * u, font: 'body', weight: 800, fill: C.ink, lw: 0, align: 'left' }); T(v, lx + (V ? bw - 40 * u : bw / 2 - 60 * u), ly, { size: 50 * u, fill: C.brand, lw: 0, align: 'right' }); ctx.restore(); } acc += vals[i]; });
      line(bx, by, bx, by + bh, 7 * u, C.ink); rr(bx, by, bw, bh, 0, null, 7 * u);
      if (lt > tt) { const p = pop(lt, tt, .4); const ty = V ? H * .72 : H * .78; T('TOTAL', W / 2, ty - 80 * u, { size: 44 * u, font: 'body', weight: 900, fill: C.inkSoft, lw: 0, ls: 8 * u, alpha: clamp(p) }); T(o.total || '', W / 2, ty, { size: (V ? 120 : 130) * u, fill: C.brand, scale: p, shadow: 8 * u }); if (o.usd) T('≈ ' + o.usd, W / 2, ty + 90 * u, { size: 52 * u, font: 'body', weight: 800, fill: C.ink, lw: 0, alpha: clamp(p) }); if (o.checked) UI.stamp(1, { x: W * (V ? .76 : .7), y: ty - 10 * u, text: 'checked ' + o.checked, size: 36, color: '#2e8b57', at: tt + .5, rot: -.12 }, lt); } };
    return { dur, render, captions: caps, capY: { v: .8 }, sfx: ats.map(a => [a, 'pop']).concat([[tt, 'ding']]) }; },

  // ---------- CALENDAR: 12 months rated 1 (avoid) – 3 (best). rating="2,2,3,3,2,1,1,1,3,3,3,2"
  calendar(o, b) { const rt = String(o.rating || '2,2,2,2,2,2,2,2,2,2,2,2').split(',').map(Number); const { caps, end } = timeCaps(b.caps, .3, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, 4.5); const M = 'JFMAMJJASOND';
    const render = lt => { const u = U(), V = _V(); ctx.fillStyle = o.bg || '#fbf1dc'; ctx.fillRect(0, 0, W, H); T((o.title || 'WHEN TO GO').toUpperCase(), W / 2, V ? H * .15 : H * .12, { size: (V ? 72 : 80) * u, fill: C.yel, scale: pop(lt, .1), shadow: 8 * u });
      const cols = ['#d9534f', '#f0ad4e', '#4fb06a'], lab = ['Avoid', 'OK', 'Best']; const bx = W * .07, bw = W * .86, base = V ? H * .58 : H * .74, maxH = V ? H * .3 : H * .46, cw = bw / 12;
      for (let i = 0; i < 12; i++) { const r = clamp(rt[i] || 2, 1, 3), at = .4 + i * .09, p = E.back(clamp((lt - at) / .45)); if (p <= 0) continue; const h = maxH * r / 3 * p; sRR(bx + i * cw + cw * .12, base - h, cw * .76, h, 12 * u, cols[r - 1], { lw: 5 * u }); T(M[i], bx + i * cw + cw / 2, base + 44 * u, { size: 44 * u, fill: C.ink, lw: 0 }); if (r === 3 && lt > at + .5) sparkle(bx + i * cw + cw / 2, base - h - 30 * u, (.7 + .2 * Math.sin(lt * 5 + i)) * u, lt + i, C.yel); }
      line(bx, base, bx + bw, base, 7 * u, C.ink);
      const ly = V ? base + 140 * u : base + 120 * u; [0, 1, 2].forEach(k => { const lx = W / 2 + (k - 1) * (V ? 300 : 340) * u; sRR(lx - 90 * u, ly - 20 * u, 40 * u, 40 * u, 8 * u, cols[k], { lw: 4 * u }); T(lab[k], lx - 34 * u, ly, { size: 40 * u, font: 'body', weight: 800, fill: C.ink, lw: 0, align: 'left', alpha: clamp((lt - 1.6) * 3) }); });
      if (o.note) T(o.note, W / 2, V ? ly + 110 * u : H * .9, { size: 44 * u, font: 'body', weight: 800, fill: C.inkSoft, lw: 0, alpha: clamp((lt - 2) * 3) }); };
    return { dur, render, captions: caps, capY: { h: .9, v: .8 }, sfx: [[.4, 'pop_cascade']] }; },

  // ---------- DIALOGUE: two characters, alternating bubbles, shot/reverse feel. lines="a:shocked:Is it safe?|b:happy:With a good rider, yes."
  dialogue(o, b) { const A = chr(o.a) || 'dave', B = chr(o.b) || 'linh'; const place = placeOr(o.place, 'oldquarter'); const ls = split(o.lines).map(s => { const p = s.split(':'); return p.length >= 3 ? { who: p[0], mood: p[1], text: p.slice(2).join(':') } : { who: p[0], text: p.slice(1).join(':') }; });
    let t = .25; const caps = []; const ka = [], kb = []; const cam = [{ t: 0, x: .5, y: .5, z: 1.05 }]; const ui = [];
    ls.forEach((l, i) => { const isA = l.who === 'a'; const spk = isA ? (o.voiceA || 'a') : (o.voiceB || 'b'); const d = capDur(l.text, spk) + .04; caps.push([+t.toFixed(2), +(t + d).toFixed(2), l.text, { hide: 1, speaker: spk, who: CHAR[isA ? A : B].name.split(' (')[0].replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim(), vo: voIdx(), mood: l.mood }]);
      (isA ? ka : kb).push({ t, expr: l.mood || 'happy', pose: l.pose || pick(['present', 'stand', 'point', 'shrug', 'stand'], i), talk: 1, talkVo: voIdx() ?? -1, talkT0: t, dur: .05 }, { t: t + d - .1, talk: 0, dur: .05 }); (isA ? kb : ka).push({ t, pose: 'stand', talk: 0, dur: .05 });
      ui.push({ type: 'ui', name: 'bubble', screen: true, at: t, until: t + d, o: { follow: isA ? A : B, x: isA ? .33 : .67, y: .24, text: wrapBubble(l.text), size: 46 }, v: { o: { size: 42 } } });
      cam.push({ t: t + .05, x: isA ? .46 : .54, z: 1.12, ease: 'smooth', dur: .3 }); t += d + .06; });
    const { caps: nc, end } = timeCaps(b.caps, t, .05, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .3, t + .4);
    const L = [{ type: 'char', id: A, x: .3, y: 'ground', dy: 40, s: 1.35, pose: 'stand', expr: 'neutral', keys: ka, look: [1, 0], v: { x: .3, s: 1.05 } }, { type: 'char', id: B, x: .7, y: 'ground', dy: 40, s: 1.35, pose: 'stand', expr: 'neutral', flip: 1, keys: kb, look: [-1, 0], v: { x: .72, s: 1.05 } }, ...ui];
    return { dur, place, placeOpts: { time: o.time }, layers: L, captions: caps.concat(nc), cam, v: { cam: [{ t: 0, x: .5, y: .5, z: 1 }] } }; },

  // ---------- MONTAGE: fast cuts through places with label stamps. places="hoian,hue,dalat" labels="Hội An|Huế|Đà Lạt"
  montage(o, b) { const ps = String(o.places || 'hoian,hue,dalat').split(',').map(s => s.trim()).filter(p => PLACE[p]); const labs = split(o.labels); const { caps, end } = timeCaps(b.caps, .15, .05, b.capStyle); const seg = num(o.seg, Math.max(.6, Math.min(1.4, Math.max(end, 3) / ps.length))); const dur = Math.max(num(o.dur, 0), seg * ps.length + .2, end + .2);
    const render = lt => { const i = Math.min(ps.length - 1, Math.floor(lt / seg)), lt2 = lt - i * seg, u = U(); const z = 1.08 + lt2 / seg * .08 * (i % 2 ? -1 : 1); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.rotate((i % 2 ? 1 : -1) * .01); ctx.translate(-W / 2, -H / 2); const tg = LINT.tag; LINT.tag = 'bg'; PLACE[ps[i]].draw(lt, { t: lt, scroll: lt2 * 300 * u, time: o.time }); LINT.tag = tg; ctx.restore();
      if (lt2 < .08 && i > 0) { ctx.save(); ctx.globalAlpha = 1 - lt2 / .08; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      const lab = labs[i] || PLACE[ps[i]].label.split(' — ')[0]; UI.stamp(1, { x: W * (_V() ? .5 : .5), y: H * (_V() ? .3 : .22), text: lab.toUpperCase(), size: _V() ? 70 : 84, color: '#fff', at: .05, rot: (i % 2 ? .06 : -.06) }, lt2); };
    return { dur, render, captions: caps, sfx: ps.map((_, i) => [i * seg, i ? 'whoosh' : 'impact']) }; },

  // ---------- HOOK: cold-open question over a dimmed place, with a big ? and a ticking timer
  hook(o, b) { const place = placeOr(o.place, 'hagiang'); const { caps, end } = timeCaps(b.caps, .05, .1, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .2, 2.6);
    const L = [{ type: 'fn', screen: true, draw: lt => { const u = U(), V = _V(); ctx.save(); ctx.fillStyle = 'rgba(20,12,8,.45)'; ctx.fillRect(0, 0, W, H); ctx.restore(); const qs = (V ? 96 : 110) * u; wrapLines(o.text || '', W * .84, qs).forEach((l, i, a) => T(l, W / 2, H * (V ? .3 : .36) + (i - (a.length - 1) / 2) * qs * 1.05, { size: qs, fill: i === a.length - 1 ? C.yel : '#fff', scale: pop(lt, .05 + i * .12), shadow: 10 * u })); } }];
    if (o.hero) L.unshift({ type: 'char', id: chr(o.hero) || 'dave', x: .5, y: 'ground', dy: 40, s: 1.3, pose: o.pose || 'scared', expr: o.mood || 'shocked', v: { s: 1.1 } });
    return { dur, place, placeOpts: { time: o.time }, layers: L, captions: caps, moves: [{ type: 'pushIn', t0: 0, t1: dur, amt: .12 }], shakes: [[.1, 12, .35]], sfx: [[0, 'impact']] }; },
});
function wrapBubble(t) { const u = 1; const ls = wrapLines(t, 520, 46); return ls.join('\n'); }

// ---------- TITLE variants
const _titleRecipe = SB.recipes.title;
SB.recipes.title = (o, b) => { const v = o.variant || SB._fmt.title || 'slam'; if (v === 'slam') return _titleRecipe(o, b);
  const lines = split(o.text || 'TITLE'); const { caps, end } = timeCaps(b.caps, v === 'film' ? .25 : .9, .05, b.capStyle); const dur = Math.max(num(o.dur, 3.2), end + .2);
  if (v === 'film') return { dur: Math.max(dur, 3.6), captions: caps, sfx: [[.1, 'whoosh_down'], [1.2, 'sparkle']], render: lt => SB_TITLE_FILM(lt, lines, o) };
  if (v === 'paper') return { dur, captions: caps, sfx: [[.1, 'pen_draw'], [.9, 'stamp']], render: lt => { const u = U(), V = _V(); bgPaper(lt, o.bg || '#efe0bb'); for (let k = 0; k < 18; k++) { const x = (hash(k) * W + lt * 18 * u * (hash(k * 3) - .3)) % W, y = (hash(k * 5) * H + Math.sin(lt * .7 + k) * 30 * u); ctx.fillStyle = 'rgba(90,60,30,.18)'; ctx.beginPath(); ctx.arc(x, y, (2 + hash(k * 7) * 4) * u, 0, TAU); ctx.fill(); } const zP = 1 + lt * .03; ctx.save(); ctx.translate(W / 2, H * .42); ctx.scale(zP, zP); ctx.rotate(Math.sin(lt * .5) * .008); ctx.translate(-W / 2, -H * .42); const size = Math.min(V ? 150 : 180, (W * .84) / (Math.max(...lines.map(l => l.length)) * .55 * u)) * u; lines.forEach((l, i) => { const n = Math.floor(clamp((lt - .1 - i * .5) / .5) * l.length); T(l.slice(0, n), W / 2, H * .42 + (i - (lines.length - 1) / 2) * size * 1.02, { size, fill: i === lines.length - 1 ? C.brand : C.ink, lw: 0 }); });
      const up = E.out(inv(.9, 1.4, lt)); if (up > 0) { const y = H * .42 + lines.length * size * .55; ctx.save(); ctx.lineCap = 'round'; line(W / 2 - W * .3, y, W / 2 - W * .3 + W * .6 * up, y + 6 * u, 10 * u, C.brand); ctx.restore(); }
      if (o.sub) T(o.sub, W / 2, H * .42 + lines.length * size * .55 + 80 * u, { size: 48 * u, font: 'body', weight: 800, fill: C.inkSoft, lw: 0, alpha: clamp((lt - 1.3) * 3) }); ctx.restore(); } };
  // 'place': title over a real place, darkened, with a slow push
  const place = placeOr(o.place, 'hagiang');
  return { dur, place, placeOpts: { time: o.time || 'sunset' }, captions: caps, moves: [{ type: 'pushIn', t0: 0, t1: dur, amt: .1 }], shakes: [[.4, 14, .4]], sfx: [[0, 'impact']], layers: [{ type: 'fn', screen: true, draw: lt => { const u = U(); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(20,10,5,.55)'); g.addColorStop(.6, 'rgba(20,10,5,.15)'); g.addColorStop(1, 'rgba(20,10,5,.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); const size = Math.min(_V() ? 160 : 200, (W * .86) / (Math.max(...lines.map(l => l.length)) * .55 * u)) * u; UI.title(1, { text: lines, size: size / u, x: W / 2, y: H * .4, accentLast: lines.length > 1, at: .1, sub: o.sub }, lt); } }] }; };

// ---------- FORMATS: one header line gives each video its own look, rhythm and sound
SB.FORMATS = {
  explainer: { grade: 'warm', captions: 'karaoke', trans: null, cam: 'mixed', music: 'adventure', voice: 'am_michael', title: 'slam' },
  history: { grade: 'golden', captions: 'line', trans: ['inkbleed', 'burn', 'paper', 'fade'], cam: 'calm', music: 'epic', voice: 'bm_george', title: 'paper', boil: 'on' },
  food: { grade: 'warm', captions: 'karaoke', trans: ['circles', 'portal', 'fgwipe', 'iris'], cam: 'calm', music: 'cafe', voice: 'af_heart', title: 'place' },
  countdown: { grade: 'punchy', captions: 'punch', trans: ['stripes', 'whip', 'glitch', 'push'], cam: 'energetic', music: 'upbeat', voice: 'am_puck', title: 'slam' },
  myth: { grade: 'clean', captions: 'punch', trans: ['glitch', 'slide', 'flash'], cam: 'energetic', music: 'comedy', voice: 'af_bella', title: 'slam' },
  guide: { grade: 'teal', captions: 'line', trans: ['paper', 'push', 'tear', 'fade'], cam: 'calm', music: 'chill', voice: 'af_sarah', title: 'paper' },
  versus: { grade: 'punchy', captions: 'punch', trans: ['stripes', 'tear', 'flash', 'whip'], cam: 'energetic', music: 'upbeat', voice: 'am_eric', title: 'slam' },
  story: { grade: 'golden', captions: 'line', trans: ['fgwipe', 'lightleak', 'fade', 'iris'], cam: 'calm', music: 'emotional', voice: 'bf_emma', title: 'place', step: 2 },
  night: { grade: 'night', captions: 'karaoke', trans: ['lightleak', 'fgwipe', 'iris', 'fade'], cam: 'calm', music: 'night', voice: 'af_nicole', title: 'place' },
  quiz: { grade: 'punchy', captions: 'punch', trans: ['flash', 'circles', 'stripes'], cam: 'energetic', music: 'quiz', voice: 'am_puck', title: 'slam' },
};
SB._fmt = {};
Object.assign(TRANS, { collage: ['paper', 'push'], photo: ['fade', 'lightleak'], countdown: ['stripes', 'push'], myth: ['slide', 'flash'], quiz: ['flash', 'circles'], timeline: ['paper', 'ink'], steps: ['push', 'paper'], budget: ['push', 'slide'], calendar: ['paper', 'push'], dialogue: ['iris', 'fade'], montage: ['flash'], hook: ['cut'] });

// ---------- compile wrapper: apply FORMAT defaults, format transition family, camera energy
const _compile = SB.compile;
SB.compile = (text, opts = {}) => { for (const m of String(text).matchAll(/^cast\s*:\s*(\w+)\s*=\s*(.+)$/gm)) castFromSpec(m[1], m[2]); for (const m of String(text).matchAll(/^set\s*:\s*(\w+)\s*=\s*(.+)$/gm)) defSet(m[1], m[2]); SB._vo = opts.vo ? { durs: opts.vo, i: 0 } : (opts.collect ? { list: [], i: 0 } : null); try { return SB._compileF(text); } finally { SB._lines = SB._vo && SB._vo.list; SB._vo = null; } };
SB._compileF = (text) => { const hdr = SB.parse(text).header; const F = SB.FORMATS[(hdr.format || 'explainer').trim()] || SB.FORMATS.explainer; SB._fmt = F;
  // format look defaults only fill what the look: line didn't set
  const lk = hdr.look || ''; const add = []; if (!/grade=/.test(lk)) add.push('grade=' + F.grade); if (!/captions=/.test(lk)) add.push('captions=' + F.captions); if (F.boil && !/boil=/.test(lk)) add.push('boil=' + F.boil); if (F.step && !/step=/.test(lk)) add.push('step=' + F.step);
  let src = text; if (add.length) { if (/^look\s*:/m.test(src)) src = src.replace(/^look\s*:(.*)$/m, (m, a) => 'look:' + a + ' ' + add.join(' ')); else src = 'look: ' + add.join(' ') + '\n' + src; }
  const ep = _compile(src); const beats = SB.parse(src).beats;
  // transition family: cycle through the format's set, never repeating, unless a beat set trans= or is map/end/hook
  if (F.trans) { let k = 0, prev = null; ep.scenes.forEach((sc, i) => { const bt = beats[i]; if (!i || !sc.transition || !bt || bt.opt.trans || ['map', 'end', 'hook', 'title'].includes(bt.type)) { prev = sc.transition && sc.transition.type; return; } let tt = F.trans[k++ % F.trans.length]; if (tt === prev) tt = F.trans[k++ % F.trans.length]; sc.transition = { type: tt, dur: ['circles', 'stripes', 'iris', 'ink', 'inkbleed', 'burn', 'lightleak', 'fgwipe', 'tear', 'portal'].includes(tt) ? .7 : .45 }; prev = tt; }); }
  // camera energy
  ep.scenes.forEach(sc => { if (sc.render || !sc.moves) return; if (F.cam === 'calm') sc.moves = sc.moves.map(m => m.type === 'handheld' ? { type: 'drift' } : m); if (F.cam === 'energetic') sc.moves = sc.moves.map(m => m.type === 'drift' ? { type: 'handheld', amp: .8 } : m); });
  // cinema pass: coverage (edited shots inside a scene), shot/lens/light/impact keys from the beat line
  ep.scenes.forEach((sc, i) => { const bt = beats[i]; if (!bt) return; const o0 = bt.opt; if (o0.fg) sc.fg = o0.fg; if (o0.rays) sc.rays = o0.rays; if (o0.act) String(o0.act).split('|').forEach(e => { const i = e.indexOf(':'); if (i < 0) return; const id = e.slice(0, i).trim(), pz = e.slice(i + 1).trim(); (sc.layers || []).filter(l => l.type === 'char' && l.id === id).forEach(l => { l.pose = pz; if (l.v) delete l.v.pose; const ah = { chopsticks: 'chopsticks', sip: 'caphe_suada', phone: 'phone', selfie: 'phone', slurp: 'chopsticks', toast: 'biahoi' }[pz.split(/[:>]/)[0]]; if (ah && !l.hold) { l.hold = ah; l.holdScale = l.holdScale || .32; } if (l.keys) l.keys = l.keys.map(k => { const { pose, ...r } = k; return r; }); }); }); });
  ep.scenes.forEach((sc, i) => { const bt = beats[i]; if (!bt || sc.render) return; const o = bt.opt;
    if (o.bgphoto) { sc.place = photoPlace(o.bgphoto, num(o.ground, .86)); if (sc.extras === undefined) sc.extras = 'none'; }
    if (o.back) { const L = (sc.layers || []).find(l => l.type === 'char' && (o.back === 'yes' || l.id === o.back)); if (L) L.view = 'back'; }
    if (o.extras) sc.extras = o.extras; if (o.weather) sc.weather = o.weather;
    if (o.lens) sc.lens = o.lens; if (o.light) sc.light = o.light; if (o.dof !== undefined) sc.dof = +o.dof;
    if (o.shot) sc.coverage = [{ t: 0, size: o.shot.toUpperCase(), on: o.on, angle: o.angle }];
    else if (o.shots) { const caps = (sc.captions || []).filter(c => !(c[3] && c[3].hide) || true); sc.coverage = o.shots.split('|').map((x, k) => { const [size, on, angle] = x.trim().split(/\s+/); return { t: k ? (caps[k] ? caps[k][0] : k * 2.5) : 0, size: size.toUpperCase(), on, angle }; }); }
    else if (o.cover !== 'none' && F.cover !== false) { const cv = SB.autoCover(bt.type, sc, o); if (cv) sc.coverage = cv; }
    if (o.angle && sc.coverage) sc.coverage.forEach(c => c.angle = c.angle || o.angle);
    if (o.photo && bt.type !== 'photo' && bt.type !== 'collage') (sc.layers = sc.layers || []).push({ type: 'image', img: o.photo, x: num(o.px, .72), y: num(o.py, .42), h: num(o.ph, 520), style: o.pstyle || 'sticker', rot: -.05, label: o.plabel, in: { type: 'slap', at: num(o.pat, .6) }, v: { x: .5, y: .3, h: num(o.ph, 520) * .85 } });
    if (bt.type === 'gag' && o.impact !== 'no' && sc.shakes && sc.shakes[0]) sc.impacts = [sc.shakes[0][0] - .05]; });
  ep.format = hdr.format || 'explainer'; ep.charStyle = (hdr.charstyle || CHAR_STYLE_BY_FORMAT[(hdr.format || 'explainer').trim()] || 'chibi').trim(); ep.music = (hdr.music || F.music).trim(); ep.voice = (hdr.voice || F.voice).trim(); ep.beats = beats.map(b => b.type);
  return ep; };

// ---------- automatic coverage: how an editor would cut this beat (shot sizes change ≥2 steps, establishing first)
SB.autoCover = (type, sc, o) => {
  const chars = (sc.layers || []).filter(l => l.type === 'char' && !l.screen && !(l.v && l.v.hide)); if (!chars.length) return null;
  const caps = (sc.captions || []).map(c => c[0]); const at = k => caps[k] ?? null; const id = l => l.id; const A = chars[0], B = chars[1];
  const seq = (list) => { const out = []; for (const e of list.filter(e => e.t !== null && e.t !== undefined).sort((a, b) => a.t - b.t)) if (!out.length || e.t - out[out.length - 1].t >= 1.5) out.push(e); return out; };
  switch (type) {
    case 'intro': { if (!B) return seq([{ t: 0, size: 'WS', on: id(A) }, { t: Math.max(1.6, at(1) ?? 2.4), size: 'MCU', on: id(A) }]); const tR = (A.keys || []).find(k => k.expr && k.t > 2)?.t ?? at(2);
      return seq([{ t: 0, size: 'WS', on: id(A) }, { t: 2.9, size: 'MS', on: id(B) }, { t: tR, size: 'MCU', on: id(A) }]); }
    case 'talk': return seq([{ t: 0, size: 'MS', on: id(A) }, ...caps.slice(1).map((t, k) => ({ t, size: k % 2 ? 'MS' : 'MCU', on: id(A) }))]).map(e => ({ ...e, lead: -.1 }));
    case 'price': return seq([{ t: 0, size: 'FS', on: id(A) }, { t: Math.max(1.8, at(1) ?? 2.4), size: 'MS', on: id(A) }]);
    case 'social': return seq([{ t: 0, size: 'WS', on: id(A) }, { t: at(1) ?? 2.4, size: 'MCU', on: id(A) }, ...(B ? [{ t: at(2) ?? 4.4, size: 'MCU', on: id(B) }] : []), { t: (sc.dur || 6) - 1.8, size: 'WS', on: id(A) }]);
    case 'dialogue': { const hc = (sc.captions || []).filter(c => c[3] && c[3].hide); return seq([{ t: 0, size: 'WS', on: id(A), creep: .02 }, { t: 1.5, size: 'MLS', on: id(A) }, ...hc.slice(1).map((c, k) => { const who = (c[3].speaker === (o.voiceA || 'a')) ? A : B; const big = /shock|surpris|love|star|sad|angry|cry|scared|hot/.test(c[3].mood || ''); return { t: c[0], size: big ? 'MCU' : (k % 2 ? 'MLS' : 'MS'), on: id(who || A), v: { size: big ? 'MS' : (k % 2 ? 'FS' : 'MLS') } }; })]); }
    case 'ride': return seq([{ t: 0, size: 'WS', on: id(A) }, { t: at(1) ?? 2.6, size: 'FS', on: id(A), creep: .01, lead: .2 }, ...(at(2) ? [{ t: at(2), size: 'WS', on: id(A) }] : [])]);
    case 'hook': return seq([{ t: 0, size: 'MS', on: id(A), angle: 'low' }]);
    default: return null;
  }
};
