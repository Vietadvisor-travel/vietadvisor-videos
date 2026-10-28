/* @effect bridge_loan
   @does: two real pictures stand as prints on either side of a dark gap; on the word a bridge of bricks builds itself across the gap from the left print to the right one, brick by brick, while a sum counts up over it and locks
   @params: a, b, alab, blab, go, val, pre, unit, lab, in, out
   @uses: lego_cut_brick_* + any two photos
   @tags: loan,lend,bridge,support,family,rescue
   @born: lego a5-05: the family's holding company, KIRKBI, lent LEGO 800 million kroner
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const A = img(P.a), B = img(P.b), k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), kb = clamp((t - t0) / 1.2), pw = W * .3, cy = H * .52;
  const pr = (im, cx, lab) => { if (!im) return; const h = pw * im.height / im.width; ctx.save(); ctx.translate(cx, cy); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#efe8da'; ctx.fillRect(-pw / 2 - 10 * u, -h / 2 - 10 * u, pw + 20 * u, h + 20 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, -pw / 2, -h / 2, pw, h); ctx.restore(); if (lab) text(lab, cx, cy + h / 2 + 50 * u, { size: 34 * u, font: 'cond', col: '#f2ead8', lw: 0, ls: 3 * u }); };
  pr(A, W * .16 - k * 10 * u, P.alab); pr(B, W * .84 + k * 10 * u, P.blab);
  const x0 = W * .32 + 10 * u, x1 = W * .68 - 10 * u, n = 8, bw = (x1 - x0) / n, br = img('lego_cut_brick_yellow'), bh = bw * .62;
  for (let i = 0; i < n; i++) { const st = i / n, kk = clamp((kb - st) * n / 1.5); if (kk <= 0 || !br) continue; const x = x0 + i * bw, y = cy - (1 - kk) * H * .3 - Math.sin(i / (n - 1) * Math.PI) * 30 * u; ctx.drawImage(br, x, y - bh / 2, bw * 1.02, bh); }
  if (t > t0) { const v = Math.round(lerp(0, +(P.val || 0), clamp(kb * 1.1))); text((P.pre ? P.pre + ' ' : '') + v.toLocaleString('en-US') + (P.unit || ''), W / 2, H * .24, { size: 120 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W / 2, H * .34, { size: 38 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u }); }
  ctx.restore();
}
