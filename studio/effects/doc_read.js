/* @effect doc_read
   @does: a real page on a dark desk; the camera travels to the passage that matters and a highlighter runs across each marked figure on its word
   @params: doc, in, out, crop, marks, z, zoom, rot
   @uses: — (swap these ids for the new episode's own)
   @tags: document,evidence,highlight,filing,table,read
   @born: wework a1-15: desks went from about 100,000 to 466,000
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, seam, dur }) => {
  // a real page lies on a dark desk under one lamp, seen whole; the camera travels to the passage that matters and a
  // highlighter runs across each marked figure on the word that says it. Coordinates are fractions of the page image.
  // params: doc, crop (x0,y0,x1,y1 of the page to show), marks (x0,y0,x1,y1@word ~ …), zoom (word), z (zoom amount), rot, in, out
  const im = img(P.doc); ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#16120e'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .5, H * .4, 0, W * .5, H * .4, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.12)'); lg.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  if (!im || !im.width) { ctx.restore(); return; }
  const [c0, c1, c2, c3] = String(P.crop || '0,0,1,1').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height;
  const marks = String(P.marks || '').split('~').filter(Boolean).map(s => { const [r, w] = s.split('@'); const [a, b, c, d] = r.split(',').map(Number); return { a, b, c, d, w }; });
  const s0 = Math.min(W * .84 / sw, H * .8 / sh), pw = sw * s0, ph = sh * s0, z = 1 + (+(P.z || .6)) * clamp(p(P.zoom || 0, 1.1, 'inOut'));
  const m0 = marks[0] || { a: .5, b: .5, c: .5, d: .5 }, fx = W / 2 - pw / 2 + ((m0.a + m0.c) / 2 - c0) / (c2 - c0) * pw, fy = H * .47 - ph / 2 + ((m0.b + m0.d) / 2 - c1) / (c3 - c1) * ph;
  const zk = (z - 1) / Math.max(.001, +(P.z || .6)); ctx.translate(lerp(0, -z * (fx - W / 2), zk), lerp(0, H * .45 - H * .47 - z * (fy - H * .47), zk)); ctx.translate(W / 2, H * .47); ctx.scale(z, z); ctx.rotate((+P.rot || -1.2) * Math.PI / 180 * (1 - zk)); ctx.translate(-W / 2, -H * .47);
  const x0 = W / 2 - pw / 2, y0 = H * .47 - ph / 2;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.fillStyle = '#f4f1ea'; ctx.fillRect(x0 - 14 * u, y0 - 14 * u, pw + 28 * u, ph + 28 * u); ctx.restore();
  ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, x0, y0, pw, ph);
  marks.forEach(m => { const k = clamp(p(m.w, .6, 'inOut')); if (k <= 0) return; const X = x0 + (m.a - c0) / (c2 - c0) * pw, Y = y0 + (m.b - c1) / (c3 - c1) * ph, Wd = (m.c - m.a) / (c2 - c0) * pw, Hd = (m.d - m.b) / (c3 - c1) * ph;
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,214,50,.85)'; ctx.fillRect(X - 4, Y - 2, (Wd + 8) * k, Hd + 4); ctx.restore(); });
  ctx.restore();
}
