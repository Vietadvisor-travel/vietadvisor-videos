/* @effect box_office
   @does: real footage of an audience plays; ticket stubs fly across the frame faster and faster while a box-office total counts up and locks on its final value
   @params: clip, to, go, span, pre, unit, lab, sub, in, out
   @uses: any clip
   @tags: movie,box-office,tickets,count,revenue,hit
   @born: lego a6-02: in 2014 The LEGO Movie took about 468 million dollars worldwide
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip || P.pic, 0, 1) || img(P.clip || P.pic), BX = img(P.brick); if (bg) cover(bg, { z: 1.05 + .1 * clamp(t / Math.max(1, dur)), filter: 'brightness(.42)' });
  const t0 = at(P.go || 0), r = rng(21); if (BX) { const bw = W * .12, bh = bw * BX.height / BX.width; for (let i = 0; i < 18; i++) { const st = t0 + i * .07, col = i % 2, lvl = Math.floor(i / 2); if (t < st) continue; const yy = Math.min(H * .86 - bh * (lvl + 1) * .92, -bh + 4000 * u * Math.pow(t - st, 2)); ctx.drawImage(BX, (col ? W * .86 : W * .14) - bw / 2 + (lvl % 2) * 10 * u, yy, bw, bh); } } for (let i = 0; i < (BX ? 0 : 60); i++) { const st = t0 + i * .05 * (1 - i / 140), y = r() * H * .9, sp = (900 + r() * 900) * u, rot = (r() - .5) * .8; if (t < st) continue; const x = -200 * u + (t - st) * sp; if (x > W + 200 * u) continue;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = .75; ctx.fillStyle = i % 3 ? '#f2d38a' : '#e9e2cf'; ctx.fillRect(-60 * u, -26 * u, 120 * u, 52 * u); ctx.fillStyle = '#b5302a'; ctx.fillRect(28 * u, -26 * u, 4 * u, 52 * u); ctx.restore(); }
  const k = clamp((t - t0) / +(P.span || 1.8)), e = 1 - Math.pow(1 - k, 3), v = lerp(0, +(P.to || 468.1), e);
  if (t > t0) { ctx.save(); ctx.fillStyle = 'rgba(8,7,6,.6)'; ctx.fillRect(W * .5 - 380 * u, H * .3, 760 * u, 280 * u); ctx.restore(); text((P.pre || '$') + v.toFixed(+(P.dec ?? 1)) + (P.unit || 'M'), W / 2, H * .3 + 120 * u, { size: 150 * u, font: 'impact', col: '#f2c14e', lw: 0 });
    if (P.lab) text(P.lab, W / 2, H * .3 + 215 * u, { size: 46 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u }); if (P.sub) text(P.sub, W / 2, H * .3 + 268 * u, { size: 40 * u, font: 'serif', col: '#d9cdb8', lw: 0 }); }
  ctx.restore();
}
