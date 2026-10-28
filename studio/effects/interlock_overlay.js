/* @effect interlock_overlay
   @does: the camera pushes into a real old photo; on the word two gold outline bricks appear over two different bricks in the picture, slide to each other and lock together, one on top of the other
   @params: pic, a, b, go, lab, in, out
   @uses: any photo with bricks in it
   @tags: compatibility,system,interlock,old-photo,promise,fit
   @born: lego a1-09: every new set would work with every set a child already owned
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.pic) || clip(P.pic, 0, 1), k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k); if (bg) cover(bg, { z: 1.1 + .25 * e, oy: -.04 * e, filter: 'brightness(.85)' });
  const [ax, ay] = (P.a || '.3,.62').split(',').map(Number), [bx, by] = (P.b || '.7,.7').split(',').map(Number), t0 = at(P.go || 0), ka = clamp(p(t0, .3)), km = clamp(spring(t0 + .4, { stiff: 140, damp: 15 }), 0, 1.05);
  const bw = W * .12, bh = bw * .38, mx = (ax + bx) / 2 * W, my = (ay + by) / 2 * H;
  const brick = (x, y, c) => { ctx.save(); ctx.globalAlpha = ka; ctx.strokeStyle = c; ctx.lineWidth = 5 * u; ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh); for (let i = 0; i < 4; i++) ctx.strokeRect(x - bw / 2 + bw * (i + .2) / 4, y - bh / 2 - bh * .28, bw * .14, bh * .28); ctx.restore(); };
  brick(lerp(ax * W, mx, Math.min(1, km)), lerp(ay * H, my - bh * .86, Math.min(1, km)), '#f2c14e'); brick(lerp(bx * W, mx, Math.min(1, km)), lerp(by * H, my, Math.min(1, km)), '#f6efe2');
  if (P.lab) text(P.lab, W / 2, H * .13, { size: 60 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a: clamp(p(t0 + .9, .4)) });
  ctx.restore();
}
