/* @effect print_slide
   @does: real footage of the work plays full-frame; on the name an old photo print slides in from the side with a white border, turns and settles, a caption plate under it
   @params: clip, pic, go, side, cap, sub, in, out
   @uses: any clip + any portrait or archive photo
   @tags: portrait,archive,print,footage,person,introduction
   @born: lego a1-02: in 1932 Ole Kirk Christiansen began making wooden toys
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip); if (bg) cover(bg, { z: 1.05 + .1 * clamp(t / Math.max(1, dur)), filter: 'brightness(.78)' });
  const pic = img(P.pic), k = clamp(spring(P.go || 0, { stiff: 110, damp: 15 }), 0, 1.06), sd = P.side === 'right' ? 1 : -1;
  if (pic && k > 0) { const h = H * .5, w = h * pic.width / pic.height, cx = W * (.5 + sd * .26) + sd * (1 - k) * W * .5, cy = H * .42;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(sd * (.06 * (1 - k) + .03)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u; ctx.fillStyle = '#efe8da'; ctx.fillRect(-w / 2 - 18 * u, -h / 2 - 18 * u, w + 36 * u, h + 70 * u); ctx.shadowColor = 'transparent';
    ctx.filter = 'sepia(.25)'; ctx.drawImage(pic, -w / 2, -h / 2, w, h); ctx.filter = 'none'; ctx.restore();
    const a = clamp(p(at(P.go || 0) + .4, .4)); if (P.cap) text(P.cap, cx, cy + h / 2 + 90 * u, { size: 46 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a }); if (P.sub) text(P.sub, cx, cy + h / 2 + 140 * u, { size: 36 * u, font: 'serif', col: '#e2d6c2', lw: 0, a }); }
  ctx.restore();
}
