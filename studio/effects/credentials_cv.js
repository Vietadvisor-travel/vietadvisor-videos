/* @effect credentials_cv
   @does: a CV card builds row by row on spring entries while a real photo of each place slides in beside it as a print; a correction sticker fixes an inflated claim; a hidden red row appears last
   @params: step, go, plate, fix, picAt, pic, cap
   @uses: — (swap these ids for the new episode's own)
   @tags: biography,credentials,cv,myth,correction,founder
   @born: onecoin a1: A real law doctorate…/Her Oxford degree was a master's/convicted of fraud
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // her CV builds row by row on a cream card; the real place sits beside it as a print; the hidden row comes out last
  const step = +params.step, w0 = params.go || 'c1';
  layer(1, () => { draw(img(params.plate), W * .5, H * .5, H * 1.15, { a: .35 }); ctx.fillStyle = 'rgba(10,8,6,.55)'; ctx.fillRect(0, 0, W, H); });
  const cx = W * .3, cy = H * .47, cw = W * .4, ch = H * .66;
  layer(2, () => {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.02);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-cw / 2 + 12 * u, -ch / 2 + 16 * u, cw, ch);
    ctx.fillStyle = '#f2ead7'; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.fillStyle = '#c9a85a'; ctx.fillRect(-cw / 2, -ch / 2, cw, 10 * u); ctx.restore();
    text('CURRICULUM VITAE', cx - cw * .42, cy - ch * .38, { size: 26 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#7a6448', lw: 0, align: 'left' });
    text('Dr. Ruja Ignatova', cx - cw * .42, cy - ch * .27, { size: 58 * u, font: 'serif', weight: 900, col: '#1f1913', lw: 0, align: 'left' });
    const rows = [['LAW DOCTORATE', 'University of Konstanz'], ['CONSULTANT', 'McKinsey & Company'], ['OXFORD', 'as marketed'], ['2012', 'Convicted of fraud, Germany']];
    rows.forEach((r, i) => { if (i >= step) return; const y = cy - ch * .1 + i * ch * .17, fresh = i === step - 1, k = fresh ? spring(w0, { stiff: 150, damp: 15 }) : 1;
      const red = i === 3; ctx.save(); ctx.globalAlpha = clamp(k); ctx.translate((1 - k) * -40 * u, 0);
      if (red) { ctx.fillStyle = 'rgba(160,30,30,.14)'; ctx.fillRect(cx - cw * .45, y - 34 * u, cw * .9, 66 * u); }
      text(r[0], cx - cw * .42, y - 8 * u, { size: 42 * u, font: 'cond', weight: 700, col: red ? '#9b1c1c' : '#2a2219', lw: 0, align: 'left', ls: 2 * u });
      text(r[1], cx - cw * .42, y + 30 * u, { size: 32 * u, font: 'serif', col: red ? '#9b1c1c' : '#4a3d2e', lw: 0, align: 'left' }); ctx.restore();
      if (!red && (i < 2 || step > 3)) { ctx.save(); ctx.strokeStyle = '#a8832e'; ctx.lineWidth = 5 * u; ctx.beginPath(); const tx = cx + cw * .36; ctx.moveTo(tx - 14 * u, y); ctx.lineTo(tx - 2 * u, y + 12 * u); ctx.lineTo(tx + 18 * u, y - 16 * u); ctx.stroke(); ctx.restore(); }
      if (i === 2 && params.fix) { const f = spring(params.fix); ctx.save(); ctx.translate(cx + cw * .2, y + 4 * u); ctx.rotate(-.08); ctx.scale(f, f); ctx.fillStyle = '#e8c766'; ctx.fillRect(-120 * u, -26 * u, 240 * u, 52 * u);
        ctx.restore(); text("A MASTER'S", cx + cw * .2, y + 4 * u, { size: 30 * u * f, font: 'cond', weight: 700, col: '#2a2219', lw: 0, rot: -.08, a: f }); } });
  });
  layer(2.4, () => { const pk = spring(params.picAt || w0, { stiff: 110, damp: 12 }), px = W * .7, py = H * .45, ph = H * .44;
    const im = img(params.pic); if (!im) return; const pw = ph * im.width / im.height; ctx.save(); ctx.translate(px + (1 - pk) * W * .3, py); ctx.rotate(.05 - .02 * step);
    ctx.fillStyle = '#f4efe4'; ctx.fillRect(-pw / 2 - 14 * u, -ph / 2 - 14 * u, pw + 28 * u, ph + 60 * u); ctx.drawImage(im, -pw / 2, -ph / 2, pw, ph); ctx.restore();
    text(params.cap || '', px + (1 - pk) * W * .3, py + ph / 2 + 24 * u, { size: 24 * u, font: 'cond', weight: 700, col: '#3a3027', lw: 0, rot: .05 - .02 * step, ls: 3 * u }); });
  air('dust', { dens: .5 });
}
