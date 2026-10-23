/* @effect gold_ink
   @does: ink spreads to reveal footage; a real object with thickness drops onto the floor; RGB-split hit on the last word
   @params: ink, clip, go, obj, hit
   @uses: — (swap these ids for the new episode's own)
   @tags: ink,reveal,object,extrude,chroma,hit
   @born: demo-kit (fx kit showcase)
*/
({ t, at, p, W, H, u, img, clip, ctx, params, clamp, lerp, blob, extrude, drop, grab, chroma }) => {
  // ink spreads from the centre and the city appears through it; a real object (cut-out with thickness) drops onto the
  // floor in front; on the last word the frame takes an RGB-split hit. params: clip, obj, ink, go, hit
  ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H);
  const r = lerp(0, W * .75, clamp(p(params.ink, 2.2, 'out'))); if (r > 1) { ctx.save(); blob(W / 2, H * .45, r, { seed: 4, wob: .25, flow: 1 }); ctx.clip(); const im = clip(params.clip, 0, 1);
    if (im) { const s = Math.max(W / im.width, H / im.height) * 1.06; ctx.filter = 'brightness(.75)'; ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); } ctx.restore(); }
  if (t > at(params.go)) extrude(img(params.obj), W / 2, drop(at(params.go), -H * .4, H * .55, { bounce: .2 }), H * .5, { depth: 26, ang: 2.4 });
  const hk = 1 - clamp((t - at(params.hit)) / .45); if (t > at(params.hit) && hk > 0) chroma(grab('hit'), 16 * hk, { ang: .2 });
}
