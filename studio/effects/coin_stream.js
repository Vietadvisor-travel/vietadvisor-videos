/* @effect coin_stream
   @does: two real pictures stand as prints side by side; on the first word a stream of gold coins pours into the left one and piles under it; on the second word the right one, left dry, drains grey and sags
   @params: a, b, alab, blab, go, dry, in, out
   @uses: any two photos
   @tags: profit,winner,loser,comparison,money,licensing
   @born: lego a2-16: Star Wars made money, but many of LEGO's own new worlds did not
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .4 });
  const A = img(P.a), B = img(P.b), t0 = at(P.go || 0), kd = clamp(p(P.dry || 0, .9, 'inOut'));
  const print = (im, cx, cy, w, gr, sag, lab, col) => { if (!im) return; const h = w * im.height / im.width; ctx.save(); ctx.translate(cx, cy + sag * 30 * u); ctx.rotate(sag * .05); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#efe8da'; ctx.fillRect(-w / 2 - 12 * u, -h / 2 - 12 * u, w + 24 * u, h + 24 * u); ctx.shadowColor = 'transparent'; ctx.filter = `grayscale(${gr}) brightness(${1 - .3 * gr})`; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.filter = 'none'; ctx.restore(); if (lab) text(lab, cx, H * .12, { size: 44 * u, font: 'cond', col, lw: 0, ls: 4 * u }); };
  print(A, W * .29, H * .42, W * .36, 0, 0, P.alab, '#f2c14e'); print(B, W * .71, H * .42, W * .36, kd, kd, P.blab, '#cfc4b0');
  const r = rng(2); for (let i = 0; i < 70; i++) { const st = t0 + i * .03; if (t < st) { r(); r(); continue; } const x = W * .29 + (r() - .5) * W * .22, tau = t - st, y = Math.min(H * .86 - (i % 14) * 6 * u, -20 * u + 1800 * u * tau * tau); ctx.fillStyle = '#e8b923'; ctx.beginPath(); ctx.ellipse(x, y, 14 * u, 7 * u, 0, 0, 6.29); ctx.fill(); ctx.strokeStyle = '#a67c12'; ctx.lineWidth = 2 * u; ctx.stroke(); }
  ctx.restore();
}
