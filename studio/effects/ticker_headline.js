/* @effect ticker_headline
   @does: a real photo behind under a slow push; a news-ticker band slides in low in the frame and a quoted headline crawls into place on it, then stops and holds, its source in a tab at the band end
   @params: bg, head, src, go, in, out
   @uses: any photo or clip
   @tags: headline,news,press,ticker,coverage,reputation
   @born: nike-vs-adidas a3-07: a Bloomberg profile was titled "The Man Who Made Nike Uncool"
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .5}) grayscale(${P.mono ? clamp(p(at(P.mono), .8)) : 0})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kb = clamp(p(t0 - .4, .4, 'out')), kc = clamp(p(t0, 1.2, 'out')), y = H * +(P.y || .6), bh = H * .16;
  ctx.fillStyle = `rgba(200,30,30,${(.95 * kb).toFixed(2)})`; ctx.fillRect(-W, y - bh / 2, W * kb * 2 + W * .05, bh); ctx.fillStyle = `rgba(245,245,245,${kb})`; ctx.fillRect(W * .7, y - bh / 2, W * .25, bh);
  (P.src || '').split('~').forEach((s, i, A) => text(s, W * .825, y + (i - (A.length - 1) / 2) * 46 * u, { size: 40 * u, font: 'cond', col: '#1d1d20', lw: 0, ls: 2 * u, a: kb }));
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - bh / 2, W * .7, bh); ctx.clip(); text(P.head || '', lerp(W * 1.2, W * .36, kc), y, { size: 54 * u, font: 'cond', col: '#fff', lw: 0, ls: 2 * u }); ctx.restore();
  ctx.restore();
}
