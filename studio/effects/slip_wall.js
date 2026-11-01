/* @effect slip_wall
   @does: a wall of paper slips, one per statement, flicks up one after another on the word; subject tabs light above it on their own words; on a later word a counted share of the slips flips red while the rest stay grey, and the count sets under the wall; an optional date card drops in
   @params: bg, n, go, pre, tabs (LABEL^word~…), red, rgo, rlab, date, dgo, lab, in, out
   @uses: any dim plate (or the desk)
   @tags: statements,count,verdict,share,wall,claims,jury
   @born: meta-cambridge-analytica-penalty a5-04: twenty-nine public statements; a5-05: twenty-six of them misleading
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const k = clamp(t / Math.max(1, dur)), bg = P.bg ? (clip(P.bg, 0, 1) || img(P.bg)) : null;
  if (bg) cover(bg, { z: 1.1 + .08 * k, filter: 'brightness(.32) saturate(.6) blur(2px)' }); else paperDesk({ lx: .5, ly: .45 });
  const n = +(P.n || 29), cols = Math.ceil(Math.sqrt(n * 2.2)), rows = Math.ceil(n / cols), sw = W * .072, sh = H * .1, gx = sw * 1.22, gy = sh * 1.25;
  const x0 = W / 2 - (cols - 1) * gx / 2, y0 = H * .47 - (rows - 1) * gy / 2, t0 = P.pre ? -9 : at(P.go || 0), tr = P.rgo ? at(P.rgo) : 1e9, nr = +(P.red || 0);
  // camera: a slow push toward the wall
  ctx.save(); const z = 1 + .12 * k; ctx.translate(W / 2 + (k - .5) * -W * .04, H * .47); ctx.scale(z, z); ctx.translate(-W / 2, -H * .47);
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => ((a * 7919) % 31) - ((b * 7919) % 31));
  const isRed = new Set(order.slice(0, nr));
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols), x = x0 + c * gx, y = y0 + r * gy, ti = t0 + i * Math.min(.07, 1.6 / n), e = clamp(spring(ti, { stiff: 190, damp: 15 }), 0, 1.1);
    if (e <= 0) { ctx.save(); ctx.strokeStyle = 'rgba(220,205,180,.16)'; ctx.setLineDash([6 * u, 6 * u]); ctx.lineWidth = 2 * u; ctx.strokeRect(x - sw / 2, y - sh / 2, sw, sh); ctx.restore(); continue; }
    const rot = (((i * 37) % 9) - 4) * .012, fl = isRed.has(i) ? clamp((t - tr - order.indexOf(i) * .045) / .3) : 0, sx = Math.abs(Math.cos(fl * Math.PI));
    ctx.save(); ctx.translate(x, y + (1 - Math.min(1, e)) * 40 * u); ctx.rotate(rot); ctx.scale(Math.min(1, e) * (fl > 0 && fl < 1 ? Math.max(.05, sx) : 1), Math.min(1, e));
    const red = fl > .5; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14 * u; ctx.shadowOffsetY = 6 * u; ctx.fillStyle = red ? '#b3261e' : (tr < 1e8 && t > tr + .6 ? '#8d877c' : '#e9e1cf'); ctx.fillRect(-sw / 2, -sh / 2, sw, sh); ctx.shadowColor = 'transparent';
    ctx.fillStyle = red ? 'rgba(255,220,210,.55)' : 'rgba(40,32,24,.38)'; for (let l = 0; l < 4; l++) ctx.fillRect(-sw * .36, -sh * .3 + l * sh * .17, sw * (l === 3 ? .4 : .72), 3 * u);
    ctx.restore();
  }
  ctx.restore();
  // subject tabs above the wall, each on its word
  const tabs = String(P.tabs || '').split('~').filter(Boolean).map(s => s.split('^'));
  if (tabs.length) { const tw = W * .8 / tabs.length; tabs.forEach(([lab, w], i) => { const a = clamp(p(w || 0, .35, 'out')); if (a <= 0) return; const x = W * .1 + tw * (i + .5), y = H * .15; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(14,12,10,.85)'; ctx.fillRect(x - tw * .46, y - 36 * u, tw * .92, 72 * u); ctx.fillStyle = '#e8c77e'; ctx.fillRect(x - tw * .46, y + 30 * u, tw * .92, 6 * u); ctx.restore(); text(lab, x, y, { size: 42 * u, font: 'cond', col: '#f2ead9', lw: 0, ls: 3 * u, a }); }); }
  else if (P.lab) { const a = clamp(p(P.go || 0, .4, 'out')); text(P.lab, W / 2, H * .13, { size: 64 * u, font: 'cond', col: '#f2ead9', lw: 0, ls: 6 * u, a }); }
  if (P.rlab) { const a = clamp((t - tr - .2) / .35); if (a > 0) { ctx.fillStyle = `rgba(14,12,10,${.8 * a})`; ctx.fillRect(W * .26, H * .76 - 48 * u, W * .48, 96 * u); text(P.rlab, W / 2, H * .76, { size: 66 * u, font: 'impact', col: '#ff8a7a', lw: 0, ls: 3 * u, a }); } }
  if (P.date) { const e = clamp(spring(P.dgo || 0, { stiff: 160, damp: 14 }), 0, 1.06); if (e > 0) { ctx.save(); ctx.translate(W * .84, H * .13 + (1 - Math.min(1, e)) * -H * .2); ctx.rotate(.04); ctx.fillStyle = '#f2ead9'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20 * u; const dw = String(P.date).length * 26 * u + 60 * u; ctx.fillRect(-dw / 2, -44 * u, dw, 88 * u); ctx.shadowColor = 'transparent'; text(P.date, 0, 0, { size: 46 * u, font: 'impact', col: '#7a1f1f', lw: 0 }); ctx.restore(); } }
  ctx.restore();
}
