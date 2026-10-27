/* @effect years_vs_month
   @does: a business model as two objects on a real floor: a tall stack of YEAR blocks dropping in (what the company owes) beside one thin 1 MONTH tile that blinks out (what the customer owes)
   @params: in, out, plate, n, go, month, blink, llab, rlab
   @uses: — (swap these ids for the new episode's own)
   @tags: mismatch,duration,lease,mechanism,comparison,blocks
   @born: wework a1-09: remember that, it's the whole story
*/
({ t, at, p, spring, stagger, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, block, dur }) => {
  // the whole business model as two objects on a real floor: on the left a tall stack of year blocks (what WeWork owed),
  // dropping in one by one; on the right one thin month tile (what a member owed) that blinks out and back, because it can
  // leave any month. params: plate, n (year blocks), go, month, llab, rlab, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.plate, 0, 1) || img(P.plate); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(5px) brightness(.45)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const n = +(P.n || 10), bw = W * .2, bh = H * .056, floor = H * .82, lx = W * .32;
  for (let i = 0; i < n; i++) { const k = clamp(spring(at(P.go || 0) + i * .11, { stiff: 210, damp: 20 }), 0, 1.06); if (k <= 0) continue; const y = floor - bh * (i + .5) - (1 - Math.min(1, k)) * H * .5; block(null, lx, y, bw, bh * .92, { depth: .5, skew: .45, side: '#2a2014' }); ctx.fillStyle = i % 2 ? '#d9a63c' : '#f2c14e'; ctx.fillRect(lx - bw / 2, y - bh * .46, bw, bh * .92); text('YEAR', lx, y, { size: 30 * u, font: 'cond', col: '#2a2014', lw: 0, ls: 8 * u, a: .8 }); }
  const mx = W * .7, mk = clamp(spring(P.month || P.go || 0, { stiff: 170, damp: 18 }), 0, 1.04), blink = P.blink ? (Math.floor((t - at(P.blink)) * 3) % 2 === 0 && t > at(P.blink) && t < at(P.blink) + 1.4 ? .15 : 1) : 1;
  if (mk > 0) { const y = floor - bh * .5 - (1 - Math.min(1, mk)) * H * .4; ctx.save(); ctx.globalAlpha = blink; block(null, mx, y, bw, bh * .92, { depth: .5, skew: .45, side: '#1d2a33' }); ctx.fillStyle = '#9fd1e8'; ctx.fillRect(mx - bw / 2, y - bh * .46, bw, bh * .92); text('1 MONTH', mx, y, { size: 30 * u, font: 'cond', col: '#10202a', lw: 0, ls: 6 * u }); ctx.restore(); }
  const a = clamp(p(P.go || 0, .5)); text(P.llab || 'WHAT WEWORK OWED', lx, H * .16, { size: 52 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 4 * u, a });
  text(P.rlab || 'WHAT A MEMBER OWED', mx, H * .16, { size: 52 * u, font: 'cond', col: '#9fd1e8', lw: 0, ls: 4 * u, a: clamp(p(P.month || P.go || 0, .5)) });
  ctx.restore();
}
