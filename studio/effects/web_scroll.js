/* @effect web_scroll
   @does: an archived web page sits in a browser window over a dark desk and scrolls down continuously; on the word a highlight band sweeps across one passage of it
   @params: doc, crop (x0,x1 of the page width to show), from, to, mark, go, url, in, out
   @uses: any archived page screenshot (tall)
   @tags: web,page,archive,scroll,browser,catalogue,highlight
   @born: lego a2-09: new themes, new worlds, new pieces every year
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  // from/to: scroll position (0 = top of page) as fractions of the page height; mark: y0,y1 (page fractions) to highlight on go
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const d = img(P.doc); const bw = W * .74, bh = H * .82, bx = W / 2 - bw / 2, by = H * .1;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50 * u; ctx.shadowOffsetY = 20 * u; ctx.fillStyle = '#e9e6e0'; ctx.fillRect(bx, by, bw, bh); ctx.restore();
  ctx.fillStyle = '#d4d0c8'; ctx.fillRect(bx, by, bw, 54 * u); ['#e05a4f', '#e8b13d', '#5bb15b'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx + 30 * u + i * 26 * u, by + 27 * u, 8 * u, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = '#fff'; ctx.fillRect(bx + 120 * u, by + 12 * u, bw - 150 * u, 30 * u); if (P.url) text(P.url, bx + 136 * u, by + 28 * u, { size: 24 * u, font: 'cond', col: '#555', lw: 0, align: 'left' });
  if (d) { const [cx0, cx1] = (P.crop || '0,1').split(',').map(Number), s = bw / (d.width * (cx1 - cx0)), ph = d.height * s, dx = bx - cx0 * d.width * s, k = clamp(t / Math.max(1, dur)), sy = lerp(+(P.from || 0), +(P.to || .5), k) * ph; ctx.save(); ctx.beginPath(); ctx.rect(bx, by + 54 * u, bw, bh - 54 * u); ctx.clip();
    ctx.drawImage(d, dx, by + 54 * u - sy, d.width * s, ph);
    if (P.mark) { const [m0, m1] = P.mark.split(',').map(Number), km = clamp(p(P.go || 0, .5)); if (km > 0) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,214,70,.75)'; ctx.fillRect(bx, by + 54 * u - sy + m0 * ph, bw * km, (m1 - m0) * ph); ctx.globalCompositeOperation = 'source-over'; } }
    ctx.restore(); }
  ctx.restore();
}
