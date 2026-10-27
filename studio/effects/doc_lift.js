/* @effect doc_lift
   @does: a real financial statement on the desk; on the word one figure is cut out of the page and lifts toward the camera as a raised slab, the page dimming behind; its plain-words label sets under it
   @params: in, out, doc, crop, cut, go, lab, col
   @uses: — (swap these ids for the new episode's own)
   @tags: document,figure,lift,accounts,number,evidence
   @born: wework a3-04: brought in 1.82 billion of revenue / lost 1.61 billion
*/
({ t, at, p, spring, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a real financial statement lies on the desk; on the word one figure is cut out of the page and lifts toward the
  // camera as a raised slab with a shadow, while the page behind dims and blurs; its plain-words label sets under it.
  // params: doc, crop (x0,y0,x1,y1), cut (x0,y0,x1,y1 of the figure on the page), go, lab, col, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const im = img(P.doc); if (!im || !im.width) { ctx.restore(); return; }
  const [c0, c1, c2, c3] = String(P.crop || '0,0,1,1').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = Math.max(W * .92 / sw, H * .5 / sh), pw = sw * s, ph = sh * s;
  const [f0, f1, f2, f3] = String(P.cut).split(',').map(Number), k = clamp(p(P.go || 0, .8, 'out5')), drift = .02 * clamp(t / dur);
  const fx = W / 2 - pw / 2 + (f0 - c0) * im.width * s, fy = H * .5 - ph / 2 + (f1 - c1) * im.height * s, fw = (f2 - f0) * im.width * s, fh = (f3 - f1) * im.height * s;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1 + drift, 1 + drift); ctx.translate(-W / 2, -H / 2);
  ctx.filter = `blur(${(5 * k).toFixed(1)}px) brightness(${(1 - .55 * k).toFixed(2)})`; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(W / 2 - pw / 2, H * .5 - ph / 2, pw, ph); ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, W / 2 - pw / 2, H * .5 - ph / 2, pw, ph); ctx.filter = 'none';
  if (k > 0) { ctx.fillStyle = 'rgba(10,9,8,.85)'; ctx.fillRect(fx, fy, fw, fh); }
  ctx.restore();
  if (k > 0) { const sc = lerp(1, Math.min(3.2, W * .5 / fw), k), cx = lerp(fx + fw / 2, W / 2, k), cy = lerp(fy + fh / 2, H * .42, k), w = fw * sc, h = fh * sc;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50 * u * k; ctx.shadowOffsetY = 26 * u * k; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(cx - w / 2 - 20 * u * k, cy - h / 2 - 14 * u * k, w + 40 * u * k, h + 28 * u * k); ctx.restore();
    ctx.drawImage(im, f0 * im.width, f1 * im.height, (f2 - f0) * im.width, (f3 - f1) * im.height, cx - w / 2, cy - h / 2, w, h);
    if (P.lab) text(P.lab, W / 2, H * .66, { size: 76 * u, font: 'impact', col: P.col || '#f2ead9', lw: 0, a: clamp((k - .6) / .4) }); }
  ctx.restore();
}
