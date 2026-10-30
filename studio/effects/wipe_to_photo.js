/* @effect wipe_to_photo
   @does: real footage fills the frame; on the word a soft edge sweeps across it and the next picture (a real photo, still travelling) is revealed behind the edge, with a short label
   @params: clip, pic, go, lab, sub, in, out
   @uses: any clip + any photo
   @tags: material,change,wipe,reveal,history,transition
   @born: lego a1-06: plastic came after the war, and LEGO's early bricks followed a British design
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const a = clip(P.clip, 0, 1) || img(P.clip), b = img(P.pic) || clip(P.pic, 0, 1), k = clamp(t / Math.max(1, dur)), kw = clamp(p(P.go || 0, 1.1, 'inOut'));
  if (b) cover(b, { z: 1.2 + .08 * k, ox: (k - .5) * -.12, filter: 'brightness(.9)' });
  if (a && kw < 1) { const ex = lerp(-W * .1, W * 1.1, kw); ctx.save(); ctx.beginPath(); ctx.rect(ex, -H, W * 2, H * 3); ctx.clip(); cover(a, { z: 1.08 + .1 * k }); ctx.restore();
    const g = ctx.createLinearGradient(ex - 60 * u, 0, ex + 60 * u, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(ex - 60 * u, 0, 120 * u, H); }
  const la = clamp(p(at(P.go || 0) + .8, .4)); const ty = H * +(P.ty || .14); if (P.band && la > 0) { ctx.fillStyle = `rgba(8,7,6,${.75 * la})`; ctx.fillRect(0, ty - 50 * u, W, 150 * u); } if (P.lab) text(P.lab, W / 2, ty, { size: 58 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: la }); if (P.sub) text(P.sub, W / 2, ty + 60 * u, { size: 42 * u, font: 'serif', col: '#e8ddc8', lw: 0, a: la });
  ctx.restore();
}
