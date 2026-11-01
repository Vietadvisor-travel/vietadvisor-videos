/* @effect stack_bite
   @does: a wall of gold bars, one bar per billion, stands for a company's cash; on the word a block of them slides out to the side as the penalty and lands in its own pile, the rest stays, so the bite and what is left read at a glance
   @params: bg, total, part, go, alab, blab, lab, note, in, out
   @uses: any dim plate
   @tags: cash,pile,share,penalty,bite,proportion,bars,gold
   @born: meta-cambridge-analytica-penalty a7: $25 billion is about 30 % of $82 billion in cash and securities
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .3 * Math.min(1, t / Math.max(1, dur)), ox: (Math.min(1, t / Math.max(1, dur)) - .5) * -.2, filter: 'brightness(.45) blur(1px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const N = +(P.total || 82), M = +(P.part || 25), t0 = at(P.go || 0), cols = 10, bw = 58 * u, bh = 26 * u, gx = W * .12, base = H * .8;
  const bar = (x, y, red) => { ctx.fillStyle = red ? '#e5332a' : '#d9a93a'; ctx.fillRect(x, y, bw, bh); ctx.fillStyle = red ? '#ff8a80' : '#f6d27a'; ctx.fillRect(x, y, bw, 5 * u); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2 * u; ctx.strokeRect(x, y, bw, bh); };
  for (let i = 0; i < N; i++) { const c = i % cols, r = Math.floor(i / cols), x = gx + c * (bw + 6 * u), y = base - (r + 1) * (bh + 4 * u), bite = i >= N - M, j = i - (N - M), ki = bite ? clamp((t - t0 - j * .04) / .5) : 0;
    if (!bite) { bar(x, y, false); continue; } const tx = W * .66 + (j % 5) * (bw + 6 * u), ty = base - (Math.floor(j / 5) + 1) * (bh + 4 * u); bar(lerp(x, tx, ki), lerp(y, ty, ki) - Math.sin(ki * 3.14) * 60 * u, ki > 0); }
  const ka = clamp(p(.3, .4)), kb = clamp(p(t0 + 1.2, .4)); text(P.alab || '', gx + cols * (bw + 6 * u) / 2, base + 50 * u, { size: 44 * u, font: 'cond', col: '#f6d27a', lw: 0, ls: 3 * u, a: ka }); text(P.blab || '', W * .66 + 2.5 * (bw + 6 * u), base + 50 * u, { size: 44 * u, font: 'cond', col: '#ff6b5e', lw: 0, ls: 3 * u, a: kb });
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 56 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u, a: kb });
  if (P.note) text(P.note, W * .74, H * .3, { size: 88 * u, font: 'impact', col: '#ff6b5e', lw: 0, a: kb });
  ctx.restore();
}
