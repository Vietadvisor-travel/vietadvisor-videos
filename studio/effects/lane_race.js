/* @effect lane_race
   @does: two shoes in two separate lanes of a running track that ends in a lit store shelf (one plank per lane); on the word each shoe runs from where it stood to where it stands now in the story: onto its plank (on the shelf), back off it, or stopped at the empty slot; a verdict sets above
   @params: bg, a, b, alab, blab, ax0, bx0, ax, bx, go, lab, shelf, in, out
   @uses: nva_cut_sneaker_red / _blue + a track plate
   @tags: race,rivalry,lead,lanes,motif,comparison,shelf,store
   @born: nike-vs-adidas motif: who is on the shelf, act by act
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.12 + .08 * k, ox: (k - .5) * -.1, filter: 'brightness(.55) saturate(1.05)' });
  const t0 = at(P.go || 0), km = clamp(p(t0, 1.1, 'inOut')), SX = .8 * W, SW = .17 * W, G = [H * .56, H * .84], sw = W * .14;
  // the shelf unit at the finish: back panel, a plank under each lane, a sign
  ctx.fillStyle = 'rgba(28,22,18,.92)'; ctx.fillRect(SX, H * .2, SW, H * .68); ctx.fillStyle = 'rgba(255,214,150,.10)'; ctx.fillRect(SX + 10 * u, H * .2 + 10 * u, SW - 20 * u, H * .68 - 20 * u);
  ctx.strokeStyle = '#8a6a48'; ctx.lineWidth = 6 * u; ctx.strokeRect(SX, H * .2, SW, H * .68);
  text(P.shelf || 'THE SHELF', SX + SW / 2 - 16 * u, H * .165, { size: 42 * u, font: 'cond', col: '#ffd9a0', lw: 0, ls: 5 * u });
  G.forEach(g => { ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(0, g - 3 * u, SX, 6 * u); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(0, g, SX, 4 * u); ctx.fillStyle = '#b08458'; ctx.fillRect(SX - 6 * u, g, SW + 12 * u, 18 * u); ctx.fillStyle = '#6e4f33'; ctx.fillRect(SX - 6 * u, g + 18 * u, SW + 12 * u, 8 * u); });
  [[img(P.a), +(P.ax0 ?? .3), +(P.ax ?? .5), G[0], P.alab, '#ff6b5e'], [img(P.b), +(P.bx0 ?? .3), +(P.bx ?? .5), G[1], P.blab, '#7fb2ff']].forEach(([im, x0, x1, g, lab, col]) => {
    const x = lerp(x0, x1, km), X = x * W, on = x > .84, slot = SX + SW / 2;
    // the empty slot on this plank, waiting, when nobody stands on it
    if (!on) { ctx.save(); ctx.setLineDash([12 * u, 10 * u]); ctx.strokeStyle = 'rgba(255,217,160,.55)'; ctx.lineWidth = 3 * u; ctx.strokeRect(slot - sw * .45, g - sw * .42, sw * .9, sw * .4); ctx.restore(); }
    else { const gl = ctx.createRadialGradient(X, g - 60 * u, 10 * u, X, g - 60 * u, sw * .8); gl.addColorStop(0, 'rgba(255,220,160,.45)'); gl.addColorStop(1, 'rgba(255,220,160,0)'); ctx.fillStyle = gl; ctx.fillRect(X - sw, g - sw, sw * 2, sw); }
    if (lab) text(lab, W * .06, g - 34 * u, { size: 44 * u, font: 'cond', col, lw: 0, ls: 4 * u, align: 'left' });
    if (!im) return; const h = sw * im.height / im.width, run = km > 0 && km < 1, bob = run ? Math.abs(Math.sin(t * 10)) * 12 * u : 0;
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(X, g + 2 * u, sw * .42, 9 * u, 0, 0, 6.29); ctx.fill();
    ctx.save(); if (x1 < x0 && run) ctx.globalAlpha = .9; ctx.drawImage(im, X - sw / 2, g - h - bob, sw, h); ctx.restore(); });
  if (P.lab) { const a = clamp(p(t0 + .5, .4)); ctx.save(); ctx.globalAlpha = a * .8; ctx.fillStyle = '#0d0f14'; ctx.fillRect(W * .4 - P.lab.length * 17 * u - 40 * u, H * .06, P.lab.length * 34 * u + 80 * u, 96 * u); ctx.restore(); text(P.lab, W * .4, H * .06 + 48 * u, { size: 60 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u, a }); }
  ctx.restore();
}
