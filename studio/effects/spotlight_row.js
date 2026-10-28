/* @effect spotlight_row
   @does: a real table page lies in the dark; a spotlight wanders down its rows as if searching; on the word it snaps onto one forgotten row and the camera closes in on it while a label sets
   @params: doc, row, go, lab, sub, in, out
   @uses: any table or document page
   @tags: document,overlooked,detail,search,twist,table
   @born: lego a4-01: here's the twist the usual story leaves out
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0b0907'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const d = img(P.doc); if (!d) { ctx.restore(); return; } const [x0, y0, x1, y1] = (P.row || '.2,.15,.76,.18').split(',').map(Number), t0 = at(P.go || 0), kz = clamp(p(t0, 1.1, 'inOut')), k = clamp(t / Math.max(1, dur));
  const zA = 1.5, zB = .9 / (x1 - x0), z = lerp(zA, zB, kz), s = W / d.width * z, cx = lerp(.5, (x0 + x1) / 2, kz), cy = lerp(.24 + .04 * k, (y0 + y1) / 2, kz), ox = W / 2 - cx * d.width * s, oy = H / 2 - cy * d.height * s;
  ctx.drawImage(d, ox, oy, d.width * s, d.height * s);
  const wy = t < t0 ? .13 + (.3 * ((t * .35) % 1)) : (y0 + y1) / 2, sy = oy + lerp(wy, (y0 + y1) / 2, kz) * d.height * s, sh = lerp(H * .16, (y1 - y0) * d.height * s * 1.6, kz), sx0 = ox + x0 * d.width * s - 20 * u, sx1 = ox + x1 * d.width * s + 20 * u;
  ctx.save(); ctx.beginPath(); ctx.rect(-W, -H, 3 * W, 3 * H); ctx.rect(sx0, sy - sh / 2, sx1 - sx0, sh); ctx.fillStyle = 'rgba(8,6,4,.78)'; ctx.fill('evenodd'); ctx.restore();
  if (kz > .6) { ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 4 * u; ctx.strokeRect(sx0, sy - sh / 2, sx1 - sx0, sh); }
  const la = clamp(p(t0 + .9, .4)); if (P.lab) text(P.lab, W / 2, H * .16, { size: 60 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 6 * u, a: la }); if (P.sub) text(P.sub, W / 2, H * .8, { size: 30 * u, font: 'cond', col: '#d9cdb8', lw: 0, a: la });
  ctx.restore();
}
