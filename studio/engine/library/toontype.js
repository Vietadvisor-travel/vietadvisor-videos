/* TOON TYPE — cartoon lettering designed into each shot (Oct 2026).
   Per-letter animated, thick outline, 3D extrusion, gradient fill, shine; comic bursts, speech bubbles, name tags, ground paint.
   Fonts with full Vietnamese: Coiny (round, the house cartoon face) · Paytone One (heavy) · Bangers (onomatopoeia) · Baloo 2.
   TOON.word(text, x, y, { size, font, fill:[top,bottom], stroke, lw, depth, depthCol, at, out, enter, idle, rot, align, lt })
   enter: pop | drop | slam | wave | type ; idle: wobble | bounce | wave | none */
'use strict';
(function () {
  const ease = { pop: E.back, drop: E.bounce, slam: E.out5 };
  // layout guard: every frame, lettering registers its box; bubbles/bursts/tags that would overlap a box already on screen slide clear
  let BOX = [], _pend = false;
  function reg(b) { BOX.push(b); if (!_pend) { _pend = true; queueMicrotask(() => { BOX = []; _pend = false; }); } }
  function hit(a, b) { return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]; }
  function clear(x, y, hw, hh, lt, extra = 0) { const u = U(), pad = (34 + extra) * u, lim = H * (H > W ? .76 : .84); let yy = y;
    for (let n = 0; n < 6; n++) { const me = [x - hw, yy - hh, x + hw, yy + hh], o = BOX.find(b => b[4] === lt && hit(me, b)); if (!o) break; const down = o[3] + hh + pad, up = o[1] - hh - pad; yy = (down + hh <= lim) ? down : up; }
    return yy; }
  function letters(text, size, font) { setFont(size, font); const out = []; let x = 0; for (const ch of String(text)) { const w = ctx.measureText(ch).width; out.push([ch, x, w]); x += w; } return { list: out, width: x }; }
  function word(text, x, y, o = {}) { const lt = o.lt || 0, at = o.at ?? 0; if (lt < at) return; const u = U(); const size = (o.size || 90) * u, font = o.font || 'toon';
    const fill = o.fill || ['#fff3a0', '#ffb84d'], stroke = o.stroke || '#1b1530', lw = (o.lw ?? Math.max(6, (o.size || 90) * .16)) * u, depth = Math.round((o.depth ?? Math.max(3, (o.size || 90) * .08))), dcol = o.depthCol || '#1b1530';
    let L = letters(text, size, font); const maxW = W * (o.maxW || .9); let fit = 1; if (L.width + lw * 2 > maxW) fit = maxW / (L.width + lw * 2);
    const x0 = o.align === 'left' ? 0 : o.align === 'right' ? -L.width : -L.width / 2; const outP = o.out != null ? clamp((lt - o.out) / .3) : 0; if (outP >= 1) return;
    if (!o._inner) { const bw = (L.width + lw * 2) * fit, bx = x + x0 * fit - lw * fit; reg([bx - 20 * u, y - size * .7 * fit, bx + bw + 20 * u, y + size * .7 * fit, lt]); }
    ctx.save(); ctx.translate(x, y); if (fit < 1) ctx.scale(fit, fit); if (o.rot) ctx.rotate(o.rot); if (o.skewY) ctx.transform(1, o.skewY, 0, 1, 0, 0); if (o.flatY) ctx.scale(1, o.flatY);
    L.list.forEach(([ch, lx, w], i) => { if (ch === ' ') return; const d = lt - at - i * (o.stagger ?? .045); if (d < 0) return; const pin = clamp(d / (o.enter === 'drop' ? .5 : .32)); let sx = 1, sy = 1, dy = 0, r = 0, a = 1;
      const en = o.enter || 'pop'; if (en === 'pop') { const e = E.back(pin); sx = sy = e; r = (1 - pin) * (i % 2 ? .4 : -.4); } else if (en === 'drop') { dy = (1 - E.bounce(pin)) * -size * 2.2; } else if (en === 'slam') { const e = E.out5(pin); sx = sy = lerp(2.6, 1, e); a = clamp(pin * 3); } else if (en === 'wave') { dy = (1 - E.back(pin)) * size * .8; a = pin; } else if (en === 'type') { a = pin > .2 ? 1 : 0; }
      const idle = o.idle || 'wobble', tt = lt * (o.speed || 1); if (idle === 'wobble') r += Math.sin(tt * 3 + i * 1.3) * .045; if (idle === 'bounce') dy += -Math.abs(Math.sin(tt * 4 + i * .5)) * size * .08; if (idle === 'wave') dy += Math.sin(tt * 5 - i * .7) * size * .08;
      if (outP > 0) { const q = clamp(outP * 1.4 - i * .04); sx *= 1 - E.in(q); sy *= 1 - E.in(q); }
      ctx.save(); ctx.translate(x0 + lx + w / 2, dy); ctx.rotate(r); ctx.scale(sx, sy); ctx.globalAlpha *= a; setFont(size, font); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const yo = size * .06;
      for (let k = depth; k >= 1; k--) { ctx.fillStyle = dcol; ctx.lineWidth = lw; ctx.strokeStyle = dcol; ctx.lineJoin = 'round'; ctx.strokeText(ch, k * u * .9, yo + k * u * 1.3); ctx.fillText(ch, k * u * .9, yo + k * u * 1.3); }
      ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.strokeText(ch, 0, yo); const g = ctx.createLinearGradient(0, -size * .45, 0, size * .45); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1] || fill[0]); ctx.fillStyle = g; ctx.fillText(ch, 0, yo);
      ctx.save(); ctx.beginPath(); ctx.rect(-w, -size, w * 2, size * .62); ctx.clip(); ctx.globalAlpha *= .35; ctx.fillStyle = '#ffffff'; ctx.fillText(ch, 0, yo); ctx.restore(); ctx.restore(); });
    ctx.restore(); }
  // comic starburst with text
  function burst(text, x, y, o = {}) { const lt = o.lt || 0, at = o.at ?? 0; if (lt < at) return; const u = U(), r = (o.r || 150) * u, p = E.back(clamp((lt - at) / .28)), outP = o.out != null ? clamp((lt - o.out) / .25) : 0; if (outP >= 1) return; const k = p * (1 - E.in(outP)); const n = o.spikes || 14; y = clear(x, y, r * (o.wide || 1.25) * 1.05, r * 1.12, lt, 24); reg([x - r * (o.wide || 1.25), y - r, x + r * (o.wide || 1.25), y + r, lt]);
    ctx.save(); ctx.translate(x, y); ctx.rotate((o.rot || 0) + Math.sin(lt * 9) * .03); ctx.scale(k, k); const pts = []; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, rr2 = i % 2 ? r * .62 : r * (1 + (i % 4 === 0 ? .12 : 0)); pts.push([Math.cos(a) * rr2 * (o.wide || 1.25), Math.sin(a) * rr2]); }
    ctx.save(); ctx.translate(8 * u, 10 * u); poly(pts, '#1b1530', 0); ctx.restore(); poly(pts, o.col || '#ffd34a', 0); ctx.lineWidth = 8 * u; ctx.strokeStyle = '#1b1530'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((pp, i) => i ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1])); ctx.closePath(); ctx.stroke(); ctx.restore();
    word(text, x, y, { size: o.size || r / u * .55, font: o.font || 'comic', fill: o.fill || ['#ffffff', '#ffe0e0'], at, lt, out: o.out, enter: 'pop', idle: 'wobble', rot: o.rot || 0, depth: 3, stagger: .03, _inner: 1 }); }
  // speech bubble pointing at (tx, ty)
  function bubble(text, x, y, tx, ty, o = {}) { const lt = o.lt || 0, at = o.at ?? 0; if (lt < at) return; const u = U(), p = E.back(clamp((lt - at) / .3)), outP = o.out != null ? clamp((lt - o.out) / .2) : 0; if (outP >= 1) return; const size = (o.size || 52) * u; setFont(size, o.font || 'toon'); const w = ctx.measureText(text).width + 70 * u, h = size * 1.7; y = clear(x, y, w / 2 + 6 * u, h / 2 + 8 * u, lt); reg([x - w / 2, y - h / 2, x + w / 2, y + h / 2, lt]);
    ctx.save(); ctx.translate(x, y); ctx.scale(p * (1 - outP), p * (1 - outP)); ctx.fillStyle = '#1b1530'; ctx.beginPath(); ctx.roundRect(-w / 2 + 6 * u, -h / 2 + 8 * u, w, h, h / 2); ctx.fill(); ctx.fillStyle = o.col || '#ffffff'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.lineWidth = 6 * u; ctx.strokeStyle = '#1b1530'; ctx.stroke();
    const ax = (tx - x), ay = (ty - y); ctx.beginPath(); ctx.moveTo(-w * .12, h * .3); ctx.lineTo(ax * .55, ay * .55); ctx.lineTo(w * .12, h * .3); ctx.closePath(); ctx.fillStyle = o.col || '#ffffff'; ctx.fill(); ctx.stroke(); ctx.fillStyle = o.col || '#ffffff'; ctx.fillRect(-w * .14, h * .18, w * .28, h * .2); ctx.restore();
    word(text, x, y, { size: (o.size || 52), font: o.font || 'toon', fill: ['#1b1530', '#3b2b7b'], stroke: '#ffffff', lw: 0, depth: 0, at: at + .08, lt, out: o.out, enter: 'pop', idle: 'none', stagger: .02, _inner: 1 }); }
  // name tag with an arrow to a character
  function nametag(text, x, y, tx, ty, o = {}) { const lt = o.lt || 0, at = o.at ?? 0; if (lt < at) return; const u = U(), p = E.out(clamp((lt - at) / .4)), outP = o.out != null ? clamp((lt - o.out) / .25) : 0; if (outP >= 1) return; ctx.save(); ctx.globalAlpha *= 1 - outP;
    ctx.lineWidth = 7 * u; ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.beginPath(); const mx = lerp(x, tx, .5) + 60 * u, my = lerp(y, ty, .5) - 40 * u; ctx.moveTo(x, y + 40 * u); ctx.quadraticCurveTo(mx, my, lerp(x, tx, p), lerp(y + 40 * u, ty, p)); ctx.stroke(); if (p > .95) { const a = Math.atan2(ty - my, tx - mx); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx - Math.cos(a - .5) * 30 * u, ty - Math.sin(a - .5) * 30 * u); ctx.moveTo(tx, ty); ctx.lineTo(tx - Math.cos(a + .5) * 30 * u, ty - Math.sin(a + .5) * 30 * u); ctx.stroke(); } ctx.restore();
    word(text, x, y, { size: o.size || 78, font: 'toon', fill: o.fill || ['#ffffff', '#cfe8ff'], at, lt, out: o.out, enter: 'pop', idle: 'bounce', rot: o.rot ?? -.06 }); }
  // tape measure between two points with the label riding on it
  function tape(x0, y0, x1, y1, label, o = {}) { const lt = o.lt || 0, at = o.at ?? 0; if (lt < at) return; const u = U(), p = E.out(clamp((lt - at) / .5)); const xe = lerp(x0, x1, p), ye = lerp(y0, y1, p); ctx.save(); ctx.lineCap = 'butt'; line(x0, y0, xe, ye, 26 * u, '#1b1530'); line(x0, y0, xe, ye, 18 * u, '#ffd34a'); const len = Math.hypot(xe - x0, ye - y0), a = Math.atan2(ye - y0, xe - x0); for (let d = 0; d < len; d += 22 * u) { const cx = x0 + Math.cos(a) * d, cy = y0 + Math.sin(a) * d; line(cx, cy - 6 * u, cx, cy + 2 * u, 3 * u, '#1b1530'); } sRR(xe - 24 * u, ye - 24 * u, 48 * u, 48 * u, 10 * u, '#e2452e', { lw: 0 }); ctx.restore();
    if (p > .9) word(label, (x0 + x1) / 2, (y0 + y1) / 2 - 64 * u, { size: o.size || 92, font: 'toon', fill: ['#fff3a0', '#ffb84d'], at: at + .45, lt, out: o.out, enter: 'pop', idle: 'bounce' }); }
  window.TOON = { word, burst, bubble, nametag, tape, boxes: () => BOX };
})();
