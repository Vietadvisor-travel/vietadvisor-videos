/* @effect redact_bars
   @does: a real news page lies on the desk under the lamp; on one word a red line strikes the reported figure through, on the next black redaction bars sweep across the rest of the text line by line, so a deal's later terms visibly vanish from the record
   @params: doc, crop (x0,y0,x1,y1), strike (x0,y0,x1,y1 of the line to strike, page coordinates), sat, go, rows, in, out
   @uses: any document id
   @tags: redaction,undisclosed,secret,settlement,strike,document
   @born: wework a4-07: cancelled, then settled on terms that were never fully disclosed
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .5, H * .42, 0, W * .5, H * .42, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.13)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const im = img(P.doc); if (!im || !im.width) { ctx.restore(); return; }
  const [c0, c1, c2, c3] = String(P.crop || '0,0,1,1').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = Math.min(W * .86 / sw, H * .74 / sh) * (1 + .04 * clamp(t / dur)), pw = sw * s, ph = sh * s, x0 = W / 2 - pw / 2, y0 = H * .45 - ph / 2;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(x0 - 16 * u, y0 - 16 * u, pw + 32 * u, ph + 32 * u); ctx.restore(); ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, x0, y0, pw, ph);
  const X = a => x0 + (a - c0) * im.width * s, Y = b => y0 + (b - c1) * im.height * s;
  if (P.strike) { const [a, b, c, d] = String(P.strike).split(',').map(Number), k = clamp(p(P.sat || 0, .5, 'inOut')); if (k > 0) { ctx.strokeStyle = '#d0342c'; ctx.lineWidth = 7 * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(a), (Y(b) + Y(d)) / 2); ctx.lineTo(lerp(X(a), X(c), k), (Y(b) + Y(d)) / 2); ctx.stroke(); } }
  const n = +(P.rows || 9); for (let i = 0; i < n; i++) { const k = clamp((t - at(P.go || 0) - i * .07) / .25); if (k <= 0) continue; const yy = y0 + ph * (.5 + i * .05), w = pw * (.5 + ((i * 37) % 40) / 100); ctx.fillStyle = '#0b0a09'; ctx.fillRect(x0 + pw * .06, yy, w * k, ph * .03); }
  ctx.restore();
}
