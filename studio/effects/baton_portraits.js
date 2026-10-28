/* @effect baton_portraits
   @does: two real portraits stand as prints, the outgoing one in front; on the first word it greys, a tenure tag ties onto it and it slides back into the dark; on the second word the incoming print slides forward and grows into the light
   @params: a, b, alab, atag, blab, go, go2, in, out
   @uses: any two portraits
   @tags: succession,handover,ceo,leadership,change,people
   @born: lego a5-01: Kjeld stepped back after 25 years; the new chief executive was the man who had written the warning
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .4 });
  const A = img(P.a), B = img(P.b), k1 = clamp(p(P.go || 0, .9, 'inOut')), k2 = clamp(p(P.go2 || P.go || 0, .9, 'inOut'));
  const pr = (im, cx, cy, h, gr, a, lab, rot) => { if (!im) return; const w = h * im.width / im.height; ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 36 * u; ctx.fillStyle = '#efe8da'; ctx.fillRect(-w / 2 - 12 * u, -h / 2 - 12 * u, w + 24 * u, h + 24 * u); ctx.shadowColor = 'transparent'; ctx.filter = `grayscale(${gr}) brightness(${1 - .4 * gr})`; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.filter = 'none'; ctx.restore(); if (lab) text(lab, cx, cy + h / 2 + 50 * u, { size: 34 * u, font: 'cond', col: '#f2ead8', lw: 0, ls: 3 * u, a }); };
  pr(B, lerp(W * .78, W * .58, k2), H * .42, H * lerp(.36, .56, k2), 1 - k2, lerp(.45, 1, k2), P.blab, lerp(.04, -.02, k2));
  pr(A, lerp(W * .4, W * .22, k1), H * .42 + k1 * 20 * u, H * lerp(.56, .4, k1), k1, lerp(1, .55, k1 * k2 + k1 * .3), P.alab, lerp(-.02, -.05, k1));
  if (P.atag && k1 > 0) { const x = lerp(W * .4, W * .22, k1) + H * .14, y = H * .2; ctx.save(); ctx.translate(x, y); ctx.rotate(.12); ctx.globalAlpha = clamp(k1 * 2); ctx.fillStyle = '#e7d9b8'; ctx.fillRect(-120 * u, -30 * u, 240 * u, 60 * u); text(P.atag, 0, 0, { size: 30 * u, font: 'cond', col: '#2a241c', lw: 0, ls: 2 * u }); ctx.restore(); }
  ctx.restore();
}
