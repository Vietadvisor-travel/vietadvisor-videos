/* @effect cash_vs_wall
   @does: two amounts at true scale on the floor of a real room: a small real stack of cash lands on its word, then a dark wall of blocks builds beside it until it runs out of frame
   @params: in, out, plate, a, b, ratio, cash, note
   @uses: — (swap these ids for the new episode's own)
   @tags: scale,comparison,cash,debt,liabilities,ratio
   @born: wework a5-07: 164 million in cash against 18.66 billion in liabilities
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, block, dur }) => {
  // two amounts at true scale on the floor of a real room: a small real stack of cash lands on its word, then on the next
  // word a wall of dark blocks builds up beside it until it runs out of the frame, each side with its figure and what it
  // is; the ratio is in the size, not in a chart. params: plate, cash (image id), a (value^label^word), b (value^label^word), ratio, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.plate, 0, 1) || img(P.plate); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.03 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'brightness(.5) saturate(.7)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const [av, al, aw] = String(P.a).split('^'), [bv, bl, bw] = String(P.b).split('^'), ratio = +(P.ratio || 100), floor = H * .8;
  const ka = clamp(spring(aw || 0, { stiff: 200, damp: 18 }), 0, 1.05), cash = img(P.cash), sw = W * .11, sh = sw * .45;
  if (ka > 0) { const y = floor - sh / 2 - (1 - Math.min(1, ka)) * H * .4; block(cash && cash.width ? cash : null, W * .2, y, sw, sh, { depth: .6, skew: .5, side: '#1d2a1a' }); text(av, W * .2, floor - sh - 80 * u, { size: 76 * u, font: 'impact', col: '#9fe0a8', lw: 0, a: Math.min(1, ka) }); text(al, W * .2, floor + 50 * u, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, a: Math.min(1, ka) }); }
  const kb = clamp(p(bw || 1e9, 2.2, 'inOut')); if (kb > 0) { const rows = Math.ceil(kb * 30), bwid = W * .44, bx = W * .64; for (let r = 0; r < rows; r++) { const y = floor - (r + .5) * H * .034; if (y < -H * .1) break; ctx.fillStyle = r % 2 ? '#3a1d1a' : '#4a2420'; ctx.fillRect(bx - bwid / 2, y - H * .016, bwid, H * .031); }
    const la = clamp((kb - .3) / .4); ctx.fillStyle = `rgba(10,8,7,${.6 * la})`; ctx.fillRect(bx - bwid / 2, H * .34, bwid, H * .2); text(bv, bx, H * .41, { size: 96 * u, font: 'impact', col: '#ff8a7a', lw: 0, a: la }); text(bl, bx, H * .49, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, a: la }); }
  if (P.note) text(P.note, W * .5, H * .1, { size: 40 * u, font: 'cond', col: '#cfc3ab', lw: 0, a: clamp(t / .6) });
  ctx.restore();
}
