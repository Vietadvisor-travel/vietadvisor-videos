/* @effect doc_quote_line
   @does: a real page lies dim and blurred behind; one line (or two) of it is lifted out as a wide paper strip across the frame, large enough to read, and a highlighter runs over the words that matter on their cue; the source sits under the strip
   @params: doc, line (x0,y0,x1,y1 of each segment of the passage, joined with +, stacked in reading order at one text size), marks (x0,y0,x1,y1@word ~ … in page coordinates), src, in, out
   @uses: any document id
   @tags: document,quote,line,evidence,highlight,readable
   @born: wework a3-09: future lease payments, already signed: forty-seven point two billion dollars
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const im = img(P.doc); if (!im || !im.width) { ctx.restore(); return; }
  const s0 = Math.max(W / im.width, H / im.height) * 1.1; ctx.save(); ctx.filter = 'blur(7px) brightness(.32)'; ctx.drawImage(im, W / 2 - im.width * s0 / 2, H * .3 - im.height * s0 * .2, im.width * s0, im.height * s0); ctx.restore();
  const segs = String(P.line).split('+').map(q => q.split(',').map(Number)), k = clamp(p(0, .7, 'out5'));
  const sc = Math.min(W * .86 / Math.max(...segs.map(q => (q[2] - q[0]) * im.width)), H * .12 / Math.max(...segs.map(q => (q[3] - q[1]) * im.height)));
  const rows = segs.map(q => ({ q, w: (q[2] - q[0]) * im.width * sc, h: (q[3] - q[1]) * im.height * sc })), gap = 14 * u, tot = rows.reduce((a, r) => a + r.h + gap, -gap), pw = Math.max(...rows.map(r => r.w)), x0 = W / 2 - pw / 2;
  let y = H * .44 - tot / 2 + (1 - k) * 40 * u; const y0 = y;
  ctx.save(); ctx.globalAlpha = k; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(x0 - 30 * u, y - 26 * u, pw + 60 * u, tot + 52 * u); ctx.shadowColor = 'transparent';
  const marks = String(P.marks || '').split('~').filter(Boolean).map(m => { const [r, w] = m.split('@'); return { r: r.split(',').map(Number), w }; });
  rows.forEach(rw => { const [a0, b0, a1, b1] = rw.q; ctx.drawImage(im, a0 * im.width, b0 * im.height, (a1 - a0) * im.width, (b1 - b0) * im.height, x0, y, rw.w, rw.h);
    marks.forEach(m => { const [a, b, c, d] = m.r, cx = (a + c) / 2, cy = (b + d) / 2; if (cx < a0 || cx > a1 || cy < b0 || cy > b1) return; const q = clamp(p(m.w, .6, 'inOut')); if (q <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,214,50,.9)'; ctx.fillRect(x0 + (Math.max(a, a0) - a0) * im.width * sc - 4, y + (Math.max(b, b0) - b0) * im.height * sc - 3, ((Math.min(c, a1) - Math.max(a, a0)) * im.width * sc + 8) * q, (Math.min(d, b1) - Math.max(b, b0)) * im.height * sc + 6); ctx.restore(); });
    y += rw.h + gap; });
  const ph = tot;
  ctx.restore(); if (P.src) text(P.src, W / 2, Math.min(H * .8, y0 + ph + 90 * u), { size: 40 * u, font: 'cond', col: '#c9bda6', lw: 0, a: k });
  ctx.restore();
}
