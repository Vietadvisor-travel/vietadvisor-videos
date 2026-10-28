/* @effect clipping_over_footage
   @does: real footage plays dim; a clipping cut out of a real page (torn edges, paper shadow) slides in large enough to read and drifts across it; on the word a red marker underlines the line that matters
   @params: clip, doc, crop, mark, go, rot, side, in, out
   @uses: any clip + any real page or screenshot
   @tags: news,clipping,document,evidence,footage,underline,quote
   @born: lego a0-07: the next year LEGO lost almost two billion kroner
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, marker, dur }) => {
  // crop: x0,y0,x1,y1 of the page (fractions) = the clipping; mark: x0,y0,x1,y1 of the line to underline (page fractions)
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.05 + .1 * k, filter: 'brightness(.42) saturate(.8)' });
  const d = img(P.doc); if (!d) { ctx.restore(); return; }
  const [x0, y0, x1, y1] = (P.crop || '0,0,1,.3').split(',').map(Number), sw = (x1 - x0) * d.width, sh = (y1 - y0) * d.height;
  const w = Math.min(W * .78, H * .7 * sw / sh), h = w * sh / sw, ki = clamp(p(.05, .7)), sd = P.side === 'left' ? -1 : 1;
  const cx = W / 2 + sd * (1 - ki) * W * .7 - (k - .5) * W * .04, cy = H * .46, rot = (+(P.rot || -2)) * Math.PI / 180;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u;
  ctx.beginPath(); const n = 18; ctx.moveTo(-w / 2, -h / 2); for (let i = 1; i <= n; i++) ctx.lineTo(-w / 2 + w * i / n, -h / 2 + ((i * 7) % 5 - 2) * 2 * u); for (let i = 1; i <= n; i++) ctx.lineTo(w / 2 + ((i * 3) % 5 - 2) * 2 * u, -h / 2 + h * i / n);
  for (let i = 1; i <= n; i++) ctx.lineTo(w / 2 - w * i / n, h / 2 + ((i * 5) % 5 - 2) * 2 * u); ctx.closePath(); ctx.fillStyle = '#f3efe6'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); ctx.clip();
  ctx.drawImage(d, x0 * d.width, y0 * d.height, sw, sh, -w / 2, -h / 2, w, h); ctx.restore();
  if (P.mark) { const [m0, m1, m2, m3] = P.mark.split(',').map(Number), mx0 = -w / 2 + (m0 - x0) / (x1 - x0) * w, mx1 = -w / 2 + (m2 - x0) / (x1 - x0) * w, my = -h / 2 + (m3 - y0) / (y1 - y0) * h + 3 * u;
    marker([[mx0, my], [lerp(mx0, mx1, .5), my + 3 * u], [mx1, my - 1 * u]], clamp(p(P.go || 0, .6)), { w: 6, seed: 4 }); }
  ctx.restore(); ctx.restore();
}
