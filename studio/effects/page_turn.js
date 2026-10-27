/* @effect page_turn
   @does: the pages of a real filing flick past like a thumbed book, slow down and stop on the page that matters on its word; then the camera reads in and a highlighter runs over the marked line
   @params: in, out, pages, stop, marks, z, zoom
   @uses: — (swap these ids for the new episode's own)
   @tags: document,filing,pages,flip,highlight,find
   @born: wework a3-08/09: on page forty-one, one line decided everything
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, seam, text, dur }) => {
  // the pages of a real filing flick past like a thumbed book, slowing until they stop on the one page that matters on its
  // word; then the camera reads into it and a highlighter runs over the marked line(s). params: pages (ids, the last is the
  // stop page), stop (word), marks (x0,y0,x1,y1@word ~ …, on the stop page), zoom (word), z, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .5, H * .42, 0, W * .5, H * .42, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.13)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const ids = String(P.pages).split(','), n = ids.length, ts = P.stop ? at(P.stop) : 0, f = P.stop ? clamp(t / Math.max(.4, ts)) : 1, e = 1 - Math.pow(1 - f, 2.2), i = Math.min(n - 1, Math.floor(e * (n - 1) + .0001)), fr = e * (n - 1) - i;
  const last = img(ids[n - 1]); if (!last || !last.width) { ctx.restore(); return; }
  const marks = String(P.marks || '').split('~').filter(Boolean).map(s => { const [r, w] = s.split('@'); const [a, b, c, d] = r.split(',').map(Number); return { a, b, c, d, w }; });
  const ph = H * .86, pw = ph * last.width / last.height, cw = Math.min(pw, W * .9), chh = cw * last.height / last.width, x0 = W / 2 - cw / 2, y0 = H * .5 - chh / 2;
  const z = 1 + (+(P.z || 1)) * clamp(p(P.zoom || 1e9, 1.1, 'inOut')), m0 = marks[0] || { a: .5, b: .5, c: .5, d: .5 }, fx = x0 + (m0.a + m0.c) / 2 * cw, fy = y0 + (m0.b + m0.d) / 2 * chh, zk = (z - 1) / Math.max(.001, +(P.z || 1));
  ctx.translate(lerp(0, -z * (fx - W / 2), zk), lerp(0, H * .44 - H / 2 - z * (fy - H / 2), zk)); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  const page = (im, x, w, a) => { if (!im || !im.width) return; ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(x, y0, w, chh); ctx.shadowColor = 'transparent'; const s = Math.max(w / im.width, chh / im.height); ctx.beginPath(); ctx.rect(x, y0, w, chh); ctx.clip(); ctx.drawImage(im, x, y0, im.width * s, im.height * s); ctx.restore(); };
  page(img(ids[Math.min(n - 1, i + 1)]), x0, cw, 1);
  if (i < n - 1) { const w = cw * Math.max(0, Math.cos(fr * Math.PI / 2)); page(img(ids[i]), x0 + (cw - w), w, 1); ctx.fillStyle = `rgba(0,0,0,${(.35 * fr).toFixed(2)})`; ctx.fillRect(x0 + cw - w, y0, w, chh); }
  else marks.forEach(m => { const k = clamp(p(m.w, .6, 'inOut')); if (k <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,214,50,.85)'; ctx.fillRect(x0 + m.a * cw - 4, y0 + m.b * chh - 2, ((m.c - m.a) * cw + 8) * k, (m.d - m.b) * chh + 4); ctx.restore(); });
  ctx.restore(); if (P.lab && i >= n - 1) { const la = clamp((t - (P.stop ? at(P.stop) : 0)) / .3); ctx.fillStyle = `rgba(14,12,10,${.85 * la})`; ctx.fillRect(W * .9 - 300 * u, H * .12 - 52 * u, 320 * u, 104 * u); } if (P.lab && i >= n - 1) text(P.lab, W * .9, H * .12, { size: 64 * u, font: 'impact', col: '#f2c14e', lw: 0, align: 'right', a: clamp((t - (P.stop ? at(P.stop) : 0)) / .3) });
}
