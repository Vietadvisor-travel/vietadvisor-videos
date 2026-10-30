/* @effect shelf_switch
   @does: two real photos stand side by side as prints, the old thing on the left and the new on the right; on the word the old print greys and slides off the left edge while the new one moves to the centre and grows
   @params: a, b, alab, blab, go, in, out
   @uses: any two photos
   @tags: switch,replace,old-new,decision,product,pivot
   @born: lego a1-14: Godtfred stopped making wooden toys, and his brothers left
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .4 });
  const A = img(P.a), B = img(P.b), k = clamp(p(P.go || 0, 1.1, 'inOut')), drift = clamp(t / Math.max(1, dur)) * 20 * u;
  const print = (im, cx, cy, w, a, gr, lab) => { if (!im) return; const h = w * im.height / im.width; ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = '#efe8da'; ctx.fillRect(-w / 2 - 14 * u, -h / 2 - 14 * u, w + 28 * u, h + 28 * u); ctx.shadowColor = 'transparent'; ctx.filter = `grayscale(${gr})`; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.filter = 'none'; ctx.restore(); if (lab) text(lab, cx, Math.min(cy + h / 2 + 50 * u, H * .84), { size: 44 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u, a }); };
  print(A, lerp(W * .28, -W * .3, k) - drift, H * .45, W * .38, 1 - .5 * k, k.toFixed(2), P.alab); print(B, lerp(W * .72, W * .5, k) + drift, H * .45, W * lerp(.38, .56, k), 1, 0, P.blab);
  ctx.restore();
}
