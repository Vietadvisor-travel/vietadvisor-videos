/* VIS — content-first explainer scenes (Oct 2026). The film shows WHAT IS SAID, not someone saying it.
   Every beat is one idea drawn as an object, a process, a comparison or a place — no talking host.
   LAYOUT is fixed (no overlaps by construction):
     9:16  HEAD y 8–24 % (headline)  ·  STAGE y 26–74 % (the visual)  ·  CAPTION band y 76–86 % (reserved)
     16:9  HEAD y 6–19 %             ·  STAGE y 21–84 %                ·  CAPTION band y 86–96 %
   Beat:  # vis kind=hero|explode|vs|receipt|grid|bars|macro|daycycle  head="MAIN|sub" …
   Style: nutshell house look — deep colour field, one hero colour, soft rim glow, drifting bokeh, slow push. */
'use strict';
(function () {
  const V = () => H > W;
  const Z = () => { const v = V(); return v
    ? { head: { y0: H * .08, y1: H * .24 }, st: { x0: W * .07, x1: W * .93, y0: H * .26, y1: H * .74 } }
    : { head: { y0: H * .06, y1: H * .19 }, st: { x0: W * .08, x1: W * .92, y0: H * .21, y1: H * .84 } }; };
  const st = () => { const s = Z().st; return { ...s, w: s.x1 - s.x0, h: s.y1 - s.y0, cx: (s.x0 + s.x1) / 2, cy: (s.y0 + s.y1) / 2 }; };
  const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const PAL = { night: '#18214a', wine: '#4a1f36', teal: '#123c47', indigo: '#2a2160', forest: '#173f2c', ember: '#4a2414', plum: '#33204a', sea: '#0f3355' };
  const ACC = { night: '#ffcf4a', wine: '#ffb84a', teal: '#ffd25a', indigo: '#ff9f5a', forest: '#ffd84a', ember: '#ffc04a', plum: '#7fe0c8', sea: '#ffcf4a' };
  const palOf = (o, i) => { const k = o.bg && PAL[o.bg] ? o.bg : Object.keys(PAL)[i % 8]; return { bg: o.bg && !PAL[o.bg] ? o.bg : PAL[k], acc: o.acc || ACC[k] || '#ffcf4a' }; };
  const split = s => (s || '').split('|').map(x => x.trim()).filter(Boolean);
  const num = (v, d) => v === undefined ? d : +v;

  // ---------- frame pieces
  let CUR = {}; const BD = {}; // blurred backdrops, cached per place/time/size
  function field(col, lt, seed = 1) {
    const u = U(), s = st();
    if (CUR.place && PLACE[CUR.place]) { // cinematic backdrop: real location, out of focus, tinted to the scene colour (depth of field)
      const key = CUR.place + '|' + CUR.time + '|' + W + 'x' + H; if (!BD[key]) { const cv = mkCanvas(W, H); withCtx(cv.getContext('2d'), () => { ctx.filter = `blur(${(+CUR.dof || 7) * u}px)`; PLACE[CUR.place].draw(0, { t: 0, time: CUR.time }); ctx.filter = 'none'; }); BD[key] = cv; }
      ctx.save(); const k = 1.08 + .04 * E.sine(clamp(lt / 8)); ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2, -H / 2); ctx.drawImage(BD[key], 0, 0); ctx.restore();
      ctx.save(); ctx.globalAlpha = +CUR.tint || .62; const g0 = ctx.createLinearGradient(0, 0, 0, H); g0.addColorStop(0, col); g0.addColorStop(.5, rgba(col, .4)); g0.addColorStop(1, col); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H); ctx.restore(); motion(lt); return; } const g = ctx.createRadialGradient(s.cx, s.cy, 10, s.cx, s.cy, Math.max(W, H) * .75);
    g.addColorStop(0, shade(col, .1)); g.addColorStop(.55, col); g.addColorStop(1, shade(col, -.14)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = .07; for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(s.cx, s.cy, (k * 170 + (lt * 14) % 170) * u, 0, TAU); ctx.lineWidth = 3 * u; ctx.strokeStyle = '#fff'; ctx.stroke(); } ctx.restore();
    const r = rng(seed * 7 + 3); ctx.save(); for (let i = 0; i < 26; i++) { const x = (r() * W + lt * (8 + r() * 14) * u) % W, y = (r() * H - lt * (5 + r() * 9) * u + H) % H, rad = (2 + r() * 6) * u; ctx.globalAlpha = .1 + r() * .12; circ(x, y, rad, '#fff', 0); } ctx.restore(); motion(lt);
  }
  // MOTION BRIDGE — every vis beat enters and exits with movement so cuts flow (whip / zoom-through / rise / spin)
  const MOV = ['zoom', 'whipL', 'rise', 'whipR', 'spin'];
  function motion(lt) { if (CUR._pushed) return; if (!CUR.in && !CUR.out) { CUR._pushed = true; return; } // scene transitions (trans=) carry the cut; internal bridges only when asked const d = CUR._dur || 4, inn = CUR.in || MOV[(CUR._i || 0) % MOV.length], out = CUR.out || MOV[((CUR._i || 0) + 1) % MOV.length];
    const pi = clamp(lt / .38), po = clamp((lt - (d - .3)) / .3); CUR._pushed = true; const u = U();
    const ap = (kind, q, dir) => { const e = dir > 0 ? 1 - E.out5(q) : E.in(q); if (e <= .001) return;
      if (kind === 'zoom') { const k = dir > 0 ? lerp(1, 1.9, e) : lerp(1, 2.6, e); ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha *= 1 - e * .9; }
      else if (kind === 'whipL' || kind === 'whipR') { const sg = (kind === 'whipL' ? 1 : -1) * dir; ctx.translate(sg * W * 1.1 * e, 0); streaks(e); }
      else if (kind === 'rise') { ctx.translate(0, dir * H * .45 * e); ctx.globalAlpha *= 1 - e * .8; }
      else if (kind === 'spin') { ctx.translate(W / 2, H / 2); ctx.rotate(dir * e * .5); const k = lerp(1, .3, e); ctx.scale(k, k); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha *= 1 - e; } };
    if (pi < 1) ap(inn, pi, 1); if (po > 0) ap(out, po, -1); }
  function streaks(e) { const u = U(), r = rng(5); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .35 * e; for (let i = 0; i < 14; i++) { const y = r() * H, l = (200 + r() * 600) * u; rr(r() * W - l / 2, y, l, (3 + r() * 6) * u, 3 * u, '#fff', 0); } ctx.restore(); }
  function fgBokeh(lt, seed = 1, col = '#ffffff') { // out-of-focus foreground discs → depth (radial gradients, no filter = fast)
    const u = U(), r = rng(seed * 13 + 1); for (let i = 0; i < 4; i++) { const x = (r() * W + lt * 22 * u * (r() > .5 ? 1 : -1) + W * 4) % W, y = r() < .5 ? H * (.02 + r() * .1) : H * (.88 + r() * .1), rad = (50 + r() * 80) * u;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, rgba(col, .12)); g.addColorStop(.7, rgba(col, .07)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); } }
  function push(lt, dur, amt, fn) { const s = st(); const k = 1 + amt * E.sine(clamp(lt / Math.max(1, dur))); ctx.save(); ctx.translate(s.cx, s.cy); ctx.scale(k, k); ctx.translate(-s.cx, -s.cy); fn(); ctx.restore(); }
  function rim(x, y, r, col) { glow(x, y, r, col, .22); }
  // fit a prop into a box, origin bottom-centre; returns scale
  // all props drawn in the house nutshell style (no ink outlines, soft shading) so 2D matches the 3D world
  const NUT = () => (typeof CHAR_STYLES !== 'undefined' && CHAR_STYLES.nutshell) ? CHAR_STYLES.nutshell : null;
  function hero(name, cx, cy, bw, bh, lt, o = {}) { const st = NUT(); if (st && typeof withCharStyle === 'function' && !o._in) { let r = 0; withCharStyle(st, () => { r = hero(name, cx, cy, bw, bh, lt, { ...o, _in: 1 }); }); return r; } const p = PROP[name]; if (!p) return 0; const s = Math.min(bw / p.w, bh / p.h) * (o.k ?? 1); const bob = (o.bob ?? 1) * Math.sin(lt * 1.6) * 6 * U();
    if (o.blur) { ctx.save(); ctx.filter = `blur(${o.blur}px)`; drawProp(name, cx, cy + p.h * s / 2 + bob, s, o.opts || {}, lt); ctx.restore(); } else drawProp(name, cx, cy + p.h * s / 2 + bob, s, o.opts || {}, lt); return s; }
  // HEADLINE — the only big type, always in HEAD zone. "MAIN|sub"
  function headline(text, lt, at, acc, o = {}) { if (!text) return; const p = clamp((lt - at) / .45); if (p <= 0) return; const u = U(), z = Z().head, v = V(); const [a, b] = String(text).split('|');
    const maxW = W * (v ? .84 : .7); let size = (v ? 118 : 96) * u; size = Math.min(size, size * maxW / Math.max(1, textW(a, size, 'impact')));
    const yA = b ? z.y0 + (z.y1 - z.y0) * .42 : (z.y0 + z.y1) / 2; const e = E.out5(p);
    ctx.save(); ctx.beginPath(); ctx.rect(0, yA - size * .75, W, size * 1.5); ctx.clip();
    T(a, W / 2, yA + (1 - e) * size, { size, font: 'impact', fill: o.col || '#fff', lw: 0, shadow: 5 * u, shadowCol: 'rgba(12,8,44,.5)', ls: 1 }); ctx.restore();
    if (b) { const q = clamp((lt - at - .25) / .4); const bs = Math.min((v ? 40 : 34) * u, maxW / Math.max(1, textW(b.toUpperCase(), 40 * u, 'cond')) * 40 * u * .98);
      T(b.toUpperCase(), W / 2, yA + size * .62 + bs * .4, { size: bs, font: 'cond', fill: acc, lw: 0, alpha: q, ls: 3 * u, shadow: 3 * u, shadowCol: 'rgba(12,8,44,.55)' }); }
  }
  function priceTag(x, y, text, sub, p, acc, lt) { if (p <= 0) return; const u = U(); const size = 58 * u; const w = textW(text, size, 'impact') + 70 * u, h = size * 1.5 + (sub ? 34 * u : 0); const sw = Math.sin(lt * 2.2) * .04 * (1 - clamp(p - 1));
    ctx.save(); ctx.translate(x, y - (1 - E.back(clamp(p))) * 120 * u); ctx.rotate(-.06 + sw); ctx.globalAlpha *= clamp(p * 3);
    line(0, -h / 2 - 50 * u, 0, -h / 2, 3 * u, 'rgba(255,255,255,.6)');
    ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.roundRect(-w / 2 + 8 * u, -h / 2 + 12 * u, w, h, 18 * u); ctx.fill();
    ctx.fillStyle = acc; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 18 * u); ctx.fill(); circ(0, -h / 2 + 16 * u, 7 * u, shade(acc, -.35), 0);
    T(text, 0, sub ? -12 * u : 4 * u, { size, font: 'impact', fill: '#1b1530', lw: 0 }); if (sub) T(sub, 0, h / 2 - 24 * u, { size: 28 * u, font: 'cond', fill: '#1b1530', lw: 0, alpha: .8 }); ctx.restore(); }
  function label(x, y, tx, ty, text, p, acc, side) { if (p <= 0) return; const u = U(); const e = E.out(clamp(p)); line(x, y, lerp(x, tx, e), lerp(y, ty, e), 3 * u, 'rgba(255,255,255,.75)'); circ(x, y, 8 * u, acc, 0);
    if (p > .5) { const q = clamp((p - .5) * 2); const size = 32 * u, w = textW(text, size, 'cond') + 30 * u, left = side ? side === 'L' : tx < x; ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = 'rgba(10,12,30,.55)'; ctx.beginPath(); ctx.roundRect(left ? tx - w : tx, ty - size * .75, w, size * 1.5, 12 * u); ctx.fill(); T(text, left ? tx - w / 2 : tx + w / 2, ty, { size, font: 'cond', fill: '#fff', lw: 0 }); ctx.restore(); } }
  function stamp(x, y, text, p, lt) { if (p <= 0) return; const u = U(); const s = lerp(2.4, 1, E.out5(clamp(p / .35))); ctx.save(); ctx.translate(x, y); ctx.rotate(-.18); ctx.scale(s, s); ctx.globalAlpha *= clamp(p * 4);
    const size = 110 * u, w = textW(text, size, 'impact') + 60 * u; ctx.lineWidth = 9 * u; ctx.strokeStyle = '#ff4a3a'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * .75, w, size * 1.5, 14 * u); ctx.stroke(); T(text, 0, 6 * u, { size, font: 'impact', fill: '#ff4a3a', lw: 0 }); ctx.restore(); }
  const vnd = s => +String(s).replace(/[^\d]/g, '') || 0;

  // ---------- kinds. Each returns a draw(lt) and sfx; t = caption-synced times
  const K = {};
  K.hero = (o, c, P, dur, i) => { const tagAt = num(o.tagAt, c[1] ? c[1][0] + .1 : .9), stAt = num(o.stampAt, c[2] ? c[2][0] + .1 : -1);
    return { sfx: [[0, 'whoosh_up'], [.35, 'pop'], [tagAt, 'register'], ...(stAt > 0 ? [[stAt, 'stamp']] : [])], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i);
      push(lt, dur, .07, () => { const e = E.out5(clamp(lt / .6)); rim(s.cx, s.cy, Math.min(s.w, s.h) * .55, P.acc); hero(o.obj, s.cx, s.cy - s.h * .04, s.w * .82, s.h * .62, lt, { k: lerp(1.35, 1, e), blur: (1 - e) * 14 * u });
        if (o.name) T(o.name, s.cx, s.y1 - s.h * .06, { size: 44 * u, font: 'cond', fill: '#fff', lw: 0, alpha: clamp((lt - .5) / .4), ls: 2 * u });
        if (o.price) priceTag(s.x1 - s.w * .2, s.y0 + s.h * .16, o.price, o.sub, (lt - tagAt) / .45, P.acc, lt);
        if (stAt > 0) stamp(s.cx, s.cy, o.stamp || '×4', lt - stAt, lt); });
      headline(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };
  K.macro = (o, c, P, dur, i) => ({ sfx: [[0, 'whoosh']], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i); const d = E.sine(clamp(lt / dur));
    ctx.save(); ctx.beginPath(); ctx.rect(0, s.y0 - s.h * .05, W, s.h * 1.1); ctx.clip(); rim(s.cx, s.cy, s.w * .6, P.acc);
    ctx.translate(s.cx + lerp(-1, 1, d) * s.w * .06, s.cy); ctx.rotate(lerp(-.05, .04, d)); hero(o.obj, 0, s.h * .1, s.w * 1.9, s.h * 1.4, lt, { bob: .3 }); ctx.restore();
    headline(o.head, lt, .3, P.acc); fgBokeh(lt, i + 3, P.acc); } });
  K.explode = (o, c, P, dur, i) => { const parts = split(o.parts); const ats = parts.map((_, k) => c.length === parts.length + 1 ? c[k + 1][0] + .05 : c.length === parts.length ? c[k][0] + .1 : .8 + k * num(o.step, .5));
    return { sfx: [[.2, 'pop'], ...ats.map(a => [a, 'tick'])], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i);
      push(lt, dur, .05, () => { const oy = s.y0 + s.h * .26; hero(o.obj, s.cx, oy, s.w * .8, s.h * .4, lt, { k: lerp(.6, 1, E.back(clamp(lt / .5))) });
        const rows = Math.ceil(parts.length / 2); parts.forEach((pt, k) => { const left = k % 2 === 0, row = Math.floor(k / 2); const ty = s.y0 + s.h * (.6 + .36 * (rows > 1 ? row / (rows - 1) : 0));
          const tx = left ? s.cx - s.w * .04 : s.cx + s.w * .04; const ox = s.cx + (left ? -1 : 1) * s.w * (.12 + .1 * row), oy2 = oy + (k % 3 - 1) * s.h * .03; label(ox, oy2, tx, ty, pt, (lt - ats[k]) / .4, P.acc, left ? 'L' : 'R'); }); });
      headline(o.head, lt, .15, P.acc); fgBokeh(lt, i); } }; };
  K.vs = (o, c, P, dur, i) => { const tb = num(o.bAt, c[1] ? c[1][0] + .1 : 1.4), tv = num(o.verdictAt, c[2] ? c[2][0] + .1 : tb + 1.6);
    const pa = vnd(o.pa), pb = vnd(o.pb), win = o.win || (pa <= pb ? 'a' : 'b');
    return { sfx: [[.25, 'whoosh'], [tb, 'whoosh'], [tv, 'impact']], draw: lt => { const s = st(), u = U(), v = V(); field(P.bg, lt, i);
      const col = (side, at) => { const x = side === 'a' ? s.x0 + s.w * .25 : s.x0 + s.w * .75, p = clamp((lt - at) / .5); if (p <= 0) return; const dim = lt > tv && side !== win ? .45 : 1;
        ctx.save(); ctx.globalAlpha *= dim; ctx.translate((1 - E.out5(p)) * (side === 'a' ? -W * .5 : W * .5), 0);
        if (lt > tv && side === win) rim(x, s.cy - s.h * .1, s.w * .3, P.acc);
        hero(o[side], x, s.cy - s.h * .14, s.w * .42, s.h * .46, lt);
        T(o[side + 'n'] || '', x, s.y0 + s.h * .76, { size: (v ? 36 : 34) * u, font: 'cond', fill: '#fff', lw: 0, ls: 2 * u });
        const val = side === 'a' ? pa : pb, k = clamp((lt - at - .2) / .7); T(fmt(val * E.out(k)) + (o.unit ?? ' ₫'), x, s.y0 + s.h * .86, { size: (v ? 64 : 58) * u, font: 'impact', fill: side === win ? P.acc : '#ff7a6a', lw: 0 }); ctx.restore(); };
      col('a', .2); col('b', tb); if (lt > tb) { line(s.cx, s.y0 + s.h * .05, s.cx, s.y0 + s.h * .95, 3 * u, 'rgba(255,255,255,.25)'); }
      headline(lt > tv ? (o.verdict || o.head) : o.head, lt, lt > tv ? tv : .15, P.acc); fgBokeh(lt, i); } }; };
  K.receipt = (o, c, P, dur, i) => { const it = split(o.items).map(s => { const [obj, lab, pr] = s.split(':'); return { obj, lab, pr: vnd(pr) }; }); const n = it.length;
    const lastC = c.length ? c[c.length - 1][0] : 3; const stp = c.length >= n ? 0 : Math.min(num(o.step, .7), Math.max(.18, (lastC - .4) / n)); const ats = it.map((_, k) => c.length >= n ? c[k][0] + .1 : .4 + k * stp); const tt = c.length > n ? c[n][0] + .1 : (c.length >= n ? ats[n - 1] + .9 : Math.max(ats[n - 1] + .4, lastC)); const total = it.reduce((a, b) => a + b.pr, 0);
    return { sfx: [...ats.map(a => [a, 'register']), [tt, 'impact']], draw: lt => { const s = st(), u = U(), v = V(); field(P.bg, lt, i);
      const pw = s.w * (v ? .94 : .5), px = s.cx - pw / 2, lh = Math.min(s.h * .8 / (n + 1.6), 96 * u); const shown = it.filter((_, k) => lt >= ats[k]).length; const ph = lh * (shown + (lt > tt ? 1.6 : .4)) + 30 * u;
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(px + 10 * u, s.y0 + 14 * u, pw, ph); ctx.fillStyle = '#fbf6ea'; ctx.beginPath(); ctx.moveTo(px, s.y0); ctx.lineTo(px + pw, s.y0); ctx.lineTo(px + pw, s.y0 + ph);
      for (let x = px + pw; x > px; x -= 24 * u) ctx.lineTo(x - 12 * u, s.y0 + ph + 10 * u), ctx.lineTo(x - 24 * u, s.y0 + ph); ctx.closePath(); ctx.fill(); ctx.restore();
      it.forEach((r, k) => { const p = clamp((lt - ats[k]) / .35); if (p <= 0) return; const y = s.y0 + 30 * u + lh * (k + .5); ctx.save(); ctx.globalAlpha *= p;
        const ps = PROP[r.obj]; if (ps) { const fx = lerp(px - 200 * u, px + lh * .55, E.out5(p)); hero(r.obj, fx, y, lh * .9, lh * .78, 0, { bob: 0 }); }
        T(r.lab, px + lh * 1.15, y, { size: lh * .46, font: 'cond', fill: '#2a2440', lw: 0, align: 'left' }); T(fmt(r.pr * E.out(p)), px + pw - 24 * u, y, { size: lh * .52, font: 'impact', fill: '#2a2440', lw: 0, align: 'right' }); ctx.restore(); });
      if (lt > tt) { const y = s.y0 + 30 * u + lh * (n + .9); line(px + 20 * u, y - lh * .55, px + pw - 20 * u, y - lh * .55, 3 * u, '#2a2440'); T(o.totalLabel || 'TỔNG', px + 24 * u, y, { size: lh * .42, font: 'impact', fill: '#2a2440', lw: 0, align: 'left' }); T(fmt(total * E.out(clamp((lt - tt) / .8))) + ' ₫', px + pw - 24 * u, y, { size: lh * .6, font: 'impact', fill: '#e2452e', lw: 0, align: 'right' }); }
      const run = it.reduce((a, r, k) => a + (lt >= ats[k] ? r.pr * E.out(clamp((lt - ats[k]) / .35)) : 0), 0); headline(lt > tt && o.final ? o.final : fmt(run) + ' ₫|' + (o.sub || 'running total'), lt, 0, P.acc); fgBokeh(lt, i); } }; };
  K.grid = (o, c, P, dur, i) => { const it = split(o.items).map(s => { const [obj, lab] = s.split(':'); const no = obj.startsWith('!'); return { obj: no ? obj.slice(1) : obj, lab, no }; }); const n = it.length;
    const ats = it.map((_, k) => c.length >= n ? c[k][0] + .05 : .4 + k * num(o.step, .4));
    return { sfx: ats.map((a, k) => [a, it[k].no ? 'buzzer' : 'pop']), draw: lt => { const s = st(), u = U(), v = V(); field(P.bg, lt, i); const cols = v ? 2 : 3, rows = Math.ceil(n / cols); const cw = s.w / cols, ch = s.h / rows;
      it.forEach((r, k) => { const p = clamp((lt - ats[k]) / .4); if (p <= 0) return; const cx = s.x0 + cw * (k % cols + .5), cy = s.y0 + ch * (Math.floor(k / cols) + .5); const sc = E.back(p);
        ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(-cw * .44, -ch * .44, cw * .88, ch * .88, 28 * u); ctx.fill();
        ctx.globalAlpha *= r.no ? .55 : 1; hero(r.obj, 0, -ch * .08, cw * .6, ch * .5, lt, { bob: .5 }); ctx.globalAlpha = 1;
        T(r.lab, 0, ch * .3, { size: Math.min(36 * u, ch * .12), font: 'cond', fill: '#fff', lw: 0 }); if (r.no) { line(-cw * .3, -ch * .3, cw * .3, ch * .18, 10 * u, '#ff4a3a'); line(cw * .3, -ch * .3, -cw * .3, ch * .18, 10 * u, '#ff4a3a'); } ctx.restore(); });
      headline(o.head, lt, .1, P.acc); fgBokeh(lt, i); } }; };
  K.bars = (o, c, P, dur, i) => { const it = split(o.items).map(s => { const [lab, val, obj] = s.split(':'); return { lab, val: +val, obj }; }); const n = it.length, mx = Math.max(...it.map(r => r.val)); const hi = num(o.hi, 1) - 1;
    const ats = it.map((_, k) => c.length >= n ? c[k][0] + .1 : .5 + k * num(o.step, .55));
    return { sfx: ats.map(a => [a, 'whoosh']), draw: lt => { const s = st(), u = U(); field(P.bg, lt, i); const bh = Math.min(s.h / n * .62, 110 * u), gap = s.h / n;
      it.forEach((r, k) => { const p = E.out5(clamp((lt - ats[k]) / .8)); if (lt < ats[k]) return; const y = s.y0 + gap * (k + .5), x0 = s.x0 + s.w * .3, wmax = s.w * .44;
        T(r.lab, x0 - 20 * u, y, { size: Math.min(40 * u, bh * .45), font: 'cond', fill: '#fff', lw: 0, align: 'right' });
        ctx.fillStyle = k === hi ? P.acc : 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.roundRect(x0, y - bh / 2, Math.max(4 * u, wmax * r.val / mx * p), bh, bh / 2); ctx.fill();
        T((o.pre || '') + fmt(r.val * p) + (o.unit || ''), x0 + wmax * r.val / mx * p + 16 * u, y, { size: bh * .5, font: 'impact', fill: k === hi ? P.acc : '#fff', lw: 0, align: 'left' }); });
      headline(o.head, lt, .1, P.acc); } }; };
  K.daycycle = (o, c, P, dur, i) => { const stops = split(o.stops).map(s => { const a = s.split(':'); if (/^\d+$/.test(a[1] || '')) a.splice(0, 2, a[0] + ':' + a[1]); return { time: a[0], obj: a[1], lab: a[2], pr: a[3] }; }); const n = stops.length;
    const ats = stops.map((_, k) => c.length >= n ? c[k][0] : k * dur / n);
    return { sfx: ats.map(a => [a, 'whoosh']), draw: lt => { const s = st(), u = U(); let k = 0; for (let j = 0; j < n; j++) if (lt >= ats[j]) k = j; const r = stops[k], p = clamp((lt - ats[k]) / .5);
      const hr = parseInt(r.time) || 12, dayP = clamp((hr - 5) / 18); const sky = dayP < .15 ? '#3a2f6a' : dayP < .7 ? '#2f7fb8' : dayP < .85 ? '#c2563a' : '#151a3e'; field(sky, lt, 2);
      const ax = lerp(s.x0, s.x1, dayP), ay = s.y0 + s.h * .1 - Math.sin(dayP * Math.PI) * s.h * .08; if (dayP < .88) { glow(ax, ay, 120 * u, '#ffd36a', .25); circ(ax, ay, 34 * u, '#ffd36a', 0); } else circ(ax, ay, 28 * u, '#f3f0ff', 0);
      ctx.save(); ctx.globalAlpha *= clamp(p * 2); hero(r.obj, s.cx, s.cy + s.h * .05, s.w * .7, s.h * .48, lt, { k: lerp(.8, 1, E.back(p)) }); ctx.restore();
      if (r.lab) T(r.lab, s.cx, s.y1 - s.h * .07, { size: 44 * u, font: 'cond', fill: '#fff', lw: 0, alpha: p, ls: 2 * u }); if (r.pr) priceTag(s.x1 - s.w * .18, s.y0 + s.h * .3, r.pr, null, (lt - ats[k] - .3) / .4, P.acc, lt);
      headline(r.time + '|' + (o.sub || 'one day'), lt, 0, P.acc); fgBokeh(lt, i); } }; };


  // ---------- BUILD — the dish assembles on screen, one ingredient per line of voice-over (camera pushes, crumbs fly, bread squashes on impact)
  // sets draw in a local frame: 1 unit ≈ 1 px at k=1, dish centred on (0,0), ±130 wide
  const drop = (q, h = 320) => { if (q <= 0) return null; const e = E.bounce(clamp(q / .55)); return (1 - e) * -h; };
  const BUILD = {
    banhmi: {
      base(q) { const y = (1 - E.back(clamp(q / .5))) * 260; ctx.save(); ctx.translate(0, y);
        sSmooth([[-132, -12], [-104, 16], [104, 16], [132, -12], [96, -24], [-96, -24]], '#e39a45', { lw: 0 }); ell(0, -20, 118, 9, '#f7e2b6', 0); ctx.restore(); },
      top(q, close) { const a = lerp(-.72, 0, E.back(clamp(close))); const y = (1 - E.back(clamp(q / .5))) * -300; ctx.save(); ctx.translate(-128, -40 + y); ctx.rotate(a); ctx.translate(128, 0);
        sSmooth([[-132, 0], [-112, -46], [-40, -66], [40, -66], [112, -46], [132, 0], [0, -10]], '#eaa34c', { lw: 0 });
        for (let k = -2; k <= 2; k++) line(k * 46 - 12, -52, k * 46 + 14, -34, 6, '#c9792c'); ell(0, -4, 120, 7, '#f7e2b6', 0); ctx.restore(); },
      layers: {
        pate(q) { if (q <= 0) return; const w = 112 * E.out(clamp(q / .6)); ctx.save(); ctx.beginPath(); ctx.rect(-118, -40, w * 2.1, 40); ctx.clip(); ell(0, -24, 112, 7, '#9b5a36', 0); ell(-30, -26, 40, 3, '#b8754c', 0); ctx.restore();
          if (q < .7) { const x = -112 + w * 2; rr(x - 4, -70, 10, 50, 4, '#c8c8d0', 0); } },
        pork(q) { for (let i = 0; i < 5; i++) { const y = drop(q - i * .09); if (y === null) continue; const x = -84 + i * 42; ctx.save(); ctx.translate(x, -30 + y); ctx.rotate((i % 2 ? .12 : -.1)); ell(0, 0, 28, 9, '#b4613c', 0); ell(0, -2, 24, 5, '#c97a50', 0); for (let k = -1; k <= 1; k++) line(k * 10 - 4, -6, k * 10 + 4, 5, 3, '#6a2f18'); ctx.restore(); } },
        pickles(q) { const r = rng(4); for (let i = 0; i < 16; i++) { const y = drop(q - i * .025, 360); const x0 = -100 + r() * 200, rot = (r() - .5) * 1.2, col = i % 3 ? '#f08a2a' : '#f6efe0'; if (y === null) continue; ctx.save(); ctx.translate(x0, -42 + y + r() * 6); ctx.rotate(rot); rr(-16, -2.5, 32, 5, 2, col, 0); ctx.restore(); } },
        cucumber(q) { for (let i = 0; i < 3; i++) { const y = drop(q - i * .1); if (y === null) continue; ctx.save(); ctx.translate(-60 + i * 55, -48 + y); ctx.rotate(-.06 + i * .05); rr(-40, -5, 80, 10, 5, '#4f9e3d', 0); rr(-36, -2, 72, 4, 2, '#cfe8a8', 0); ctx.restore(); } },
        herbs(q) { const r = rng(9); for (let i = 0; i < 7; i++) { const p = E.back(clamp((q - i * .05) / .35)); if (p <= 0) continue; const x = -100 + i * 33 + r() * 8; ctx.save(); ctx.translate(x, -50); ctx.scale(p, p); ctx.rotate((r() - .5) * .8); line(0, 0, 0, -26, 3, '#2f7a2a'); for (let k = 0; k < 4; k++) circ(Math.cos(k * 1.6) * 9, -24 - Math.sin(k * 1.6) * 8, 7, k % 2 ? '#3f9a3a' : '#57b04a', 0); ctx.restore(); } },
        chili(q) { const r = rng(12); for (let i = 0; i < 6; i++) { const y = drop(q - i * .05, 300); if (y === null) continue; const x = -90 + r() * 180; circ(x, -54 + y, 7, '#e1352a', 0); circ(x, -54 + y, 3, '#ffd9a0', 0); } },
        sauce(q) { if (q <= 0) return; const n = Math.floor(clamp(q / .7) * 24); ctx.save(); ctx.beginPath(); for (let i = 0; i <= n; i++) { const x = -110 + i * 9.2, y = -56 + Math.sin(i * 1.3) * 8; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 4; ctx.strokeStyle = '#5a2810'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
      }, order: ['pate', 'pork', 'pickles', 'cucumber', 'herbs', 'chili', 'sauce'], hasTop: true },
    pho: {
      base(q) { const y = (1 - E.back(clamp(q / .5))) * 260; ctx.save(); ctx.translate(0, y); ell(0, -60, 132, 46, '#2b4f86', 0); ell(0, -62, 124, 40, '#1a2b46', 0); ctx.restore(); },
      front(q) { const y = (1 - E.back(clamp(q / .5))) * 260; ctx.save(); ctx.translate(0, y); ctx.beginPath(); ctx.moveTo(-132, -60); ctx.ellipse(0, -60, 132, 46, 0, Math.PI, 0, true); ctx.lineTo(84, 40); ctx.lineTo(-84, 40); ctx.closePath(); ctx.fillStyle = '#f6f2e8'; ctx.fill(); for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.arc(i * 24, 0, 7, 0, TAU); ctx.lineWidth = 3; ctx.strokeStyle = '#3a6fb0'; ctx.stroke(); } rr(-60, 36, 120, 12, 4, '#e8e2d2', 0); ctx.restore(); },
      layers: {
        broth(q) { if (q <= 0) return; const f = E.out(clamp(q / .8)); ctx.save(); ctx.globalAlpha *= .95; ell(0, -62, 120 * f, 38 * f, '#d79a4c', 0); ctx.restore(); if (q < .8) { rr(-8, -300, 16, 240, 8, '#d79a4c', 0); } },
        noodles(q) { for (let i = 0; i < 9; i++) { const y = drop(q - i * .03, 300); if (y === null) continue; ctx.save(); ctx.translate(-80 + i * 20, -66 + ((i * 37) % 50 - 25) + y); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.bezierCurveTo(-6, -14, 6, 10, 14, -4); ctx.lineWidth = 5; ctx.strokeStyle = '#fbf3df'; ctx.stroke(); ctx.restore(); } },
        beef(q) { for (let i = 0; i < 4; i++) { const y = drop(q - i * .1); if (y === null) continue; const cook = clamp((q - i * .1 - .5) / .8); ctx.save(); ctx.translate(-60 + i * 40, -70 + (i % 2 ? 14 : -12) + y); ctx.rotate(i % 2 ? .3 : -.2); ell(0, 0, 30, 12, mix('#d4505a', '#9a5a46', cook), 0); ctx.restore(); } },
        herbs(q) { const r = rng(3); for (let i = 0; i < 8; i++) { const p = E.back(clamp((q - i * .04) / .3)); if (p <= 0) continue; ell(-90 + r() * 180, -90 + r() * 50, 11 * p, 6 * p, i % 2 ? '#4aa53e' : '#2f8a35', 0, r() * 3); } },
        onion(q) { const r = rng(7); for (let i = 0; i < 10; i++) { const y = drop(q - i * .03, 240); if (y === null) continue; ctx.save(); ctx.beginPath(); ctx.arc(-90 + r() * 180, -88 + r() * 48 + y, 5, 0, TAU); ctx.lineWidth = 3; ctx.strokeStyle = '#7cc45a'; ctx.stroke(); ctx.restore(); } },
        lime(q) { const y = drop(q); if (y === null) return; ctx.save(); ctx.translate(96, -78 + y); ctx.rotate(-.4); ctx.beginPath(); ctx.arc(0, 0, 22, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = '#8fd14f'; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 16, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = '#e4f5b8'; ctx.fill(); ctx.restore(); },
        chili(q) { const r = rng(21); for (let i = 0; i < 5; i++) { const y = drop(q - i * .05, 300); if (y === null) continue; const x = -70 + r() * 140, yy = -86 + r() * 40; circ(x, yy + y, 6, '#e1352a', 0); circ(x, yy + y, 2.5, '#ffd9a0', 0); } }
      }, order: ['broth', 'noodles', 'beef', 'herbs', 'onion', 'lime', 'chili'], steam: true }
  };
  function crumbs(x, y, q, col, k) { if (q <= 0 || q > .6) return; const r = rng(Math.floor(x)); for (let i = 0; i < 8; i++) { const a = -Math.PI * (.15 + r() * .7), v = (60 + r() * 120) * k, tt = q; circ(x + Math.cos(a) * v * tt, y + Math.sin(a) * v * tt + 300 * k * tt * tt, (3 + r() * 3) * k, col, 0); } }
  K.build = (o, c, P, dur, i) => { const set = BUILD[o.set] || BUILD.banhmi; const parts = split(o.parts).map(x => { const [id, lab] = x.split(':'); return { id, lab: lab || id.toUpperCase() }; });
    const n = parts.length, hasIntro = c.length > n; const ats = parts.map((_, k) => c.length >= n ? c[k + (hasIntro ? 1 : 0)] ? c[k + (hasIntro ? 1 : 0)][0] + .05 : .8 + k * .7 : .8 + k * num(o.step, .7)); const tClose = num(o.closeAt, (ats[n - 1] || 1) + 1.1);
    return { sfx: [[0, 'whoosh_up'], ...ats.map(a => [a + .25, 'thud']), ...(set.hasTop ? [[tClose + .15, 'impact']] : [])], draw: lt => { const s = st(), u = U(); field(P.bg, lt, i);
      const k = Math.min(s.w / 300, s.h / 260) * .9; const cur = parts.filter((_, j) => lt >= ats[j]).length - 1;
      const zoom = 1 + .18 * E.inOut(clamp(lt / (tClose + .4))) - (set.hasTop ? .12 * E.out5(clamp((lt - tClose - .3) / .8)) : 0); const tilt = Math.sin(lt * .5) * .03;
      const land = parts.reduce((m, _, j) => { const d = lt - ats[j] - .3; return d > 0 && d < .25 ? Math.max(m, 1 - d / .25) : m; }, 0);
      ctx.save(); ctx.translate(s.cx, s.cy + s.h * (set.hasTop ? .26 : .14)); ctx.scale(k * zoom, k * zoom * (1 - land * .05)); ctx.rotate(tilt); rim(0, -40, 200, P.acc);
      set.base(lt); parts.forEach((pt, j) => { const L = set.layers[pt.id]; if (L) L(lt - ats[j]); crumbs(0, -40, lt - ats[j] - .3, P.acc, 1); });
      if (set.front) set.front(lt); if (set.hasTop) set.top(lt, (lt - tClose) / .35); if (set.steam && lt > (ats[0] || 0)) steamFx(0, -110, lt, 3, 1.2);
      ctx.restore();
      const hd = cur >= 0 ? parts[cur].lab + '|' + (o.sub || 'step ' + (cur + 1) + ' of ' + n) : o.head; const at = cur >= 0 ? ats[cur] : .1; headline(lt > tClose && o.final ? o.final : hd, lt, lt > tClose && o.final ? tClose : at, P.acc);
      fgBokeh(lt, i); } }; };

  // ---------- recipe
  SB.recipes.vis = (o, b) => { const kind = K[o.kind] ? o.kind : 'hero'; const { caps, end } = timeCaps(b.caps, .25, .06, b.capStyle); const idx = (SB._visN = (SB._visN || 0) + 1);
    const P = palOf(o, idx); const dur0 = Math.max(num(o.dur, 0), end + .35, 3); const R = K[kind](o, caps, P, dur0, idx);
    return { dur: dur0, place: 'studio', placeOpts: { color: P.bg, floor: false }, light: 'none', layers: [{ type: 'fn', screen: true, draw: lt => { CUR = o; o._dur = dur0; o._i = idx; o._pushed = false; ctx.save(); R.draw(lt); ctx.restore(); if (o._pushed) { o._pushed = false; } } }], captions: caps, sfx: R.sfx.filter(s => s[0] >= 0 && s[0] < dur0), vis: kind };
  };
  window.VIS = { kinds: Object.keys(K), zones: Z, headline, tag: priceTag, K, BUILD, h: { st, field, push, rim, hero, fgBokeh, label, stamp, fmt, split, num, crumbs, drop } };
})();
