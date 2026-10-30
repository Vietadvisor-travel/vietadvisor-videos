/* @effect ramp_freeze
   @does: footage slows on one word and freezes on the next; the held frame drains to monochrome and a frame line draws round it like evidence
   @params: clip, slow, freeze, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: footage,speed-ramp,freeze,evidence,tension
   @born: demo-stock (stock-as-material test)
*/
({ t, at, p, W, H, u, clip, img, cover, ctx, params, clamp, lerp, text }) => {
  // footage plays, slows on one word (speed ramp 1 → .15), freezes on the next word; on the freeze the picture drains to
  // monochrome and a thin frame line draws round it, so the held instant reads as evidence. params: clip, slow, freeze
  const id = params.clip, ts = at(params.slow), tf = at(params.freeze);
  const eff = t < ts ? t : t < tf ? ts + (t - ts) * lerp(1, .15, clamp((t - ts) / .4)) : ts + (tf - ts) * .4;
  const im = clip(id, t - eff, 1); if (!im) return; const fr = clamp(p(params.freeze, .35, 'out5'));
  ctx.save(); ctx.filter = `grayscale(${fr.toFixed(2)}) contrast(${(1 + .25 * fr).toFixed(2)})`;
  const s = Math.max(W / im.width, H / im.height) * (1.02 + .04 * clamp(t / 6)); ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore();
  if (fr > 0) { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${.18 * fr})`; ctx.fillRect(0, 0, W, H);
    const m = 60 * u, len = 2 * (W + H - 4 * m) * fr; ctx.strokeStyle = '#e8e2d4'; ctx.lineWidth = 3 * u; ctx.setLineDash([len, 99999]);
    ctx.strokeRect(m, m, W - 2 * m, H - 2 * m); ctx.restore(); }
  if (params.lab) text(params.lab, W / 2, H * .13, { size: 64 * u, font: 'impact', col: '#f6efe2', lw: 0, ls: 5 * u, a: fr }); if (params.sub) text(params.sub, W / 2, H * .13 + 70 * u, { size: 42 * u, font: 'cond', col: '#e2d6c2', lw: 0, a: fr });
}
