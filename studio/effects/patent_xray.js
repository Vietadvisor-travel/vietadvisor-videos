/* @effect patent_xray
   @does: a big plastic brick sits on a dark desk; on the word a scan bar sweeps across it and, behind the bar, the solid brick turns into the real patent drawing of its inside, so the tubes show; the filing date sets under it
   @params: brick, doc, crop, go, lab, sub, in, out
   @uses: lego_cut_brick_red + a patent drawing page
   @tags: patent,invention,inside,xray,engineering,tubes
   @born: lego a1-11: LEGO filed a patent, tubes inside the brick, so it clutches
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const b = img(P.brick || 'lego_cut_brick_red'), d = img(P.doc), k = clamp(t / Math.max(1, dur)); if (!b) { ctx.restore(); return; }
  const bw = W * lerp(.56, .62, k), bh = bw * b.width ? bw * b.height / b.width : bw * .33, x = W / 2 - bw / 2, y = H * .5 - bh / 2, ks = clamp(p(P.go || 0, 1.2, 'inOut')), sx = x + bw * ks;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u; ctx.drawImage(b, x, y, bw, bh); ctx.restore();
  if (d && ks > 0) { const [c0, c1, c2, c3] = (P.crop || '.52,.22,.74,.33').split(',').map(Number); ctx.save(); ctx.beginPath(); ctx.rect(x, y - 10 * u, sx - x, bh + 20 * u); ctx.clip(); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(x, y, bw, bh);
    const cw = (c2 - c0) * d.width, chh = (c3 - c1) * d.height, sc = Math.min(bw / cw, bh / chh) * .96; ctx.drawImage(d, c0 * d.width, c1 * d.height, cw, chh, x + bw / 2 - cw * sc / 2, y + bh / 2 - chh * sc / 2, cw * sc, chh * sc); ctx.restore();
    if (ks < 1) { const g = ctx.createLinearGradient(sx - 40 * u, 0, sx + 40 * u, 0); g.addColorStop(0, 'rgba(120,220,255,0)'); g.addColorStop(.5, 'rgba(160,235,255,.85)'); g.addColorStop(1, 'rgba(120,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 40 * u, y - 40 * u, 80 * u, bh + 80 * u); } }
  const la = clamp(p(at(P.go || 0) + 1.1, .4)); if (P.lab) text(P.lab, W / 2, H * .15, { size: 64 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: la }); if (P.sub) text(P.sub, W / 2, y + bh + 70 * u, { size: 40 * u, font: 'serif', col: '#e8ddc8', lw: 0, a: la });
  ctx.restore();
}
