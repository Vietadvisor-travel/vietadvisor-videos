/* @effect lane_race
   @does: two shoes stand in two lanes of a real-looking running track, each lane named; on the word they run to new positions that show who leads at this point of the story, the camera tracking with them, and a one-line verdict sets above
   @params: bg, a, b, alab, blab, ax, bx, go, lab, in, out
   @uses: nva_cut_sneaker_red / _blue + a track plate
   @tags: race,rivalry,lead,lanes,motif,comparison
   @born: nike-vs-adidas motif: who leads, act by act
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.15 + .1 * k, ox: (k - .5) * -.14, filter: 'brightness(.7) saturate(1.1)' });
  const A = img(P.a), B = img(P.b), t0 = at(P.go || 0), km = clamp(p(t0, 1.2, 'inOut')), ax = lerp(.2, +(P.ax || .5), km), bx = lerp(.2, +(P.bx || .5), km), sw = W * .17;
  [[A, ax, H * .62, P.alab, '#ff6b5e'], [B, bx, H * .8, P.blab, '#7fb2ff']].forEach(([im, x, y, lab, col]) => { if (!im) return; const X = x * W, bob = Math.abs(Math.sin(t * 9)) * 14 * u * (km > 0 && km < 1 ? 1 : 0), h = sw * im.height / im.width;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(X, y + 6 * u, sw * .45, 12 * u, 0, 0, 6.29); ctx.fill(); ctx.drawImage(im, X - sw / 2, y - h - bob, sw, h);
    if (lab) text(lab, X, y + 48 * u, { size: 40 * u, font: 'cond', col, lw: 0, ls: 4 * u }); });
  if (P.lab) { const a = clamp(p(t0 + .8, .4)); ctx.save(); ctx.globalAlpha = a * .75; ctx.fillStyle = '#0d0f14'; ctx.fillRect(W * .5 - P.lab.length * 21 * u - 40 * u, H * .1, P.lab.length * 42 * u + 80 * u, 100 * u); ctx.restore(); text(P.lab, W / 2, H * .1 + 50 * u, { size: 64 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 6 * u, a }); }
  ctx.restore();
}
