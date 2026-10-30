/* @effect rise_and_sink
   @does: two real pictures side by side as framed cards: on one word the left card sinks and drains to grey, on another the right card rises into the light, each with its label, so one fortune falls while the other climbs in the same frame
   @params: down, up, dlab, ulab, dat, uat, in, out
   @uses: any photo, document or clip ids
   @tags: contrast,rise,fall,two-fortunes,comparison,timing
   @born: wework a0-06: how do you raise money for your next company before the first one has finished falling
*/
({ t, at, p, spring, W, H, u, img, clip, cover, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#0f0d0b'; ctx.fillRect(-W, -H, 3 * W, 3 * H); { const bg = clip(P.bg, 0, 1) || img(P.bg); if (bg && cover) cover(bg, { z: 1.08, filter: `brightness(${P.dim || .45})` }); }
  const card = (id, cx, dy, grey, lab, col) => { const im = clip(id, 0, 1) || img(id); const w = W * .4, h = H * .56, y = H * .46 + dy; if (!im || !im.width) return;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.fillStyle = '#1b1814'; ctx.fillRect(cx - w / 2, y - h / 2, w, h); ctx.shadowColor = 'transparent'; ctx.beginPath(); ctx.rect(cx - w / 2, y - h / 2, w, h); ctx.clip();
    const s = Math.max(w / im.width, h / im.height) * (1.02 + .03 * clamp(t / dur)); ctx.filter = `grayscale(${grey.toFixed(2)}) brightness(${(1 - .45 * grey).toFixed(2)})`; ctx.drawImage(im, cx - im.width * s / 2, y - im.height * s / 2, im.width * s, im.height * s); ctx.restore();
    if (lab) text(lab, cx, y - h / 2 - 50 * u, { size: 52 * u, font: 'cond', col, lw: 0, ls: 4 * u }); };
  const d = clamp(p(P.dat || 0, 1.4, 'inOut')), r = clamp(spring(P.uat || 0, { stiff: 90, damp: 15 }), 0, 1.04);
  card(P.down, W * .26, d * H * .2, d, P.dlab, '#cfc3ab'); card(P.up, W * .74, (1 - Math.min(1, r)) * H * .5, 0, r > .05 ? P.ulab : '', '#f2c14e');
  ctx.restore();
}
