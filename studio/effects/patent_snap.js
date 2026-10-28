/* @effect patent_snap
   @does: a real patent drawing lies on a dark desk; the camera travels down the sheet from its filing header to the drawn brick, and on the word a real-size plastic brick drops onto the drawing and clicks into place; a filing date and a "today" chip set beside it
   @params: doc, go, fx, fy, h, brick, then, now, in, out
   @uses: lego_doc_patent_us3005282_drawing_sheet1, lego_cut_brick_red
   @tags: patent,drawing,brick,precision,compatibility,document,drop
   @born: lego a0-01: a brick made in 1958 still snaps onto a brick made today
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, drop, dur }) => {
  // the camera rides the sheet from its header (top) to the figure (fx, fy: the drawn brick, fractions of the sheet);
  // on go a brick drops onto the figure. then/now: the two chips. h: brick height in sheet heights
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .4 });
  const d = img(P.doc); if (!d) { ctx.restore(); return; }
  const k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k), fx = +(P.fx || .5), fy = +(P.fy || .45);
  const sh = H * lerp(1.15, 2.1, e), sw = sh * d.width / d.height, cx = lerp(.5, fx, e), cy = lerp(.12, fy, e);
  const ox = W / 2 - cx * sw, oy = H * .5 - cy * sh;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.drawImage(d, ox, oy, sw, sh); ctx.restore();
  const b = img(P.brick || 'lego_cut_brick_red'), t0 = at(P.go || 0);
  if (b && t > t0) { const bh = (+P.h || .06) * sh, bw = bh * b.width / b.height, tx = ox + fx * sw, ty = oy + fy * sh;
    const yy = drop(t0, ty - H * .9, ty, { bounce: .2, g: 5000 }); ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(tx, ty + bh * .45, bw * .55, bh * .12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.drawImage(b, tx - bw / 2, yy - bh / 2, bw, bh); }
  const a1 = clamp(p(.3, .5)), a2 = clamp(p(t0 + .35, .45));
  const chip = (s, x, y, a, c) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; const w = s.length * 24 * u + 50 * u; ctx.fillRect(x - w / 2, y - 34 * u, w, 68 * u); ctx.restore(); text(s, x, y, { size: 42 * u, font: 'cond', col: '#14110d', lw: 0, ls: 5 * u, a }); };
  chip(P.then || 'FILED 1958', W * .3, H * .14, a1, '#efe6d2'); chip(P.now || 'TODAY', W * .72, H * .14, a2, '#f2c14e');
  ctx.restore();
}
