/* @effect page_stack
   @does: a real document's first page drops onto a dark desk with weight and the rest of the filing builds up under it into a thick stack; a filing label types beside it
   @params: in, out, doc, crop, pages, grow, land, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: document,filing,stack,pages,weight,evidence
   @born: wework a3-01: WeWork filed its S-1
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a real document's first page drops onto a desk with weight, then the rest of the filing builds up under it as a thick
  // stack (its page count made physical); a filing label types beside it. params: doc, crop (x0,y0,x1,y1), land, grow, pages, lab, sub, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .42, H * .42, 0, W * .42, H * .42, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.14)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const im = img(P.doc); if (!im || !im.width) { ctx.restore(); return; }
  const [c0, c1, c2, c3] = String(P.crop || '0,0,1,1').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = Math.min(W * .5 / sw, H * .66 / sh), pw = sw * s, ph = sh * s;
  const cx = W * .38, cy = H * .44, n = +(P.pages || 30), g = clamp(p(P.grow || P.land || 0, 1.4, 'inOut')), thick = n * .9 * u * g;
  for (let i = Math.floor(n * g); i > 0; i--) { const off = i * .9 * u; ctx.fillStyle = i % 3 ? '#e9e3d6' : '#d6cfbf'; ctx.fillRect(cx - pw / 2 + off * .6, cy - ph / 2 + off, pw, ph); }
  const k = clamp(spring(P.land || 0, { stiff: 130, damp: 17 }), 0, 1.05), z = lerp(1.6, 1, Math.min(1, k)), a = clamp(k * 3);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy - thick * .1); ctx.scale(z, z); ctx.rotate((1 - Math.min(1, k)) * -.12 - .015);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(-pw / 2, -ph / 2, pw, ph); ctx.shadowColor = 'transparent';
  ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, -pw / 2, -ph / 2, pw, ph); ctx.restore();
  const la = clamp((t - at(P.land || 0) - .6) / .4), lx = cx + pw / 2 + W * .05;
  if (P.lab) text(P.lab, lx, H * .4, { size: 84 * u, font: 'impact', col: '#f2ead9', align: 'left', lw: 0, a: la });
  if (P.sub) text(P.sub, lx, H * .4 + 84 * u, { size: 44 * u, font: 'cond', col: '#c9bda6', align: 'left', lw: 0, a: clamp(p(P.grow || P.land || 0, .5, 'out')) });
  ctx.restore();
}
