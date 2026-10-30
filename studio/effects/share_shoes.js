/* @effect share_shoes
   @does: a market as a hundred shoes on a dim shelf grid, all grey; on each brand's word its share of the hundred lights up in its own shoe and colour, filling from the left, and its figure sets in a legend under the grid
   @params: bg, groups (LABEL^share^cut-out^colour^word ~ …), lab, src, in, out
   @uses: the episode's sneaker cut-outs (one per brand) + any dim plate
   @tags: market,share,percent,grid,brands,comparison,shelf
   @born: nike-vs-adidas a4: by 2017 Adidas had 11 % of the US market; Nike still had 37 %
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .12 * k, ox: (k - .5) * -.08, filter: 'brightness(.45) blur(1px)' }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const G = (P.groups || '').split('~').filter(Boolean).map(s => s.split('^')), cols = 20, rows = 5, x0 = W * .08, x1 = W * .92, y0 = H * .27, cw = (x1 - x0) / cols, ch = H * .085;
  // the camera drifts along the grid for the whole beat
  ctx.save(); ctx.translate(W / 2, H * .45); ctx.scale(1 + .06 * k, 1 + .06 * k); ctx.translate(-W / 2 + (k - .5) * -W * .03, -H * .45);
  const owner = new Array(cols * rows).fill(-1); let c0 = 0; G.forEach(([, sh], gi) => { const n = Math.round(+sh); for (let i = c0; i < Math.min(cols * rows, c0 + n); i++) owner[i] = gi; c0 += n; });
  const grey = img(G[0] && G[0][2]);
  for (let r = 0; r < rows; r++) { ctx.fillStyle = 'rgba(196,170,132,.55)'; ctx.fillRect(x0 - 10 * u, y0 + (r + 1) * ch - 6 * u, x1 - x0 + 20 * u, 5 * u); }
  for (let i = 0; i < cols * rows; i++) { const c = i % cols, r = Math.floor(i / cols), x = x0 + c * cw + cw / 2, y = y0 + (r + 1) * ch - 8 * u, gi = owner[i];
    let lit = 0, im = grey; if (gi >= 0) { const g = G[gi], st = at(g[4] || 0), first = owner.indexOf(gi); lit = clamp((t - st - (i - first) * .025) / .25); if (lit > 0) im = img(g[2]) || grey; }
    if (!im) continue; const w = cw * .86, h = w * im.height / im.width; ctx.save(); ctx.filter = lit > 0 ? 'none' : 'grayscale(1) brightness(.85)'; ctx.globalAlpha = lit > 0 ? lerp(.6, 1, lit) : .5; ctx.drawImage(im, x - w / 2, y - h - (lit > 0 && lit < 1 ? (1 - lit) * 14 * u : 0), w, h); ctx.restore(); }
  ctx.restore();
  G.forEach(([lab, sh, , col, w], gi) => { const a = clamp(p(at(w || 0) + .3, .4)), x = W * (G.length > 1 ? lerp(.2, .8, gi / (G.length - 1)) : .5); text(sh + '%', x, H * .76, { size: 84 * u, font: 'impact', col: col || '#f2c14e', lw: 0, a }); text(lab, x, H * .83, { size: 42 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, a }); });
  if (P.lab) text(P.lab, W / 2, H * .12, { size: 52 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u });
  if (P.src) text(P.src, W / 2, H * .19, { size: 40 * u, font: 'cond', col: '#b9bec8', lw: 0 });
  ctx.restore();
}
