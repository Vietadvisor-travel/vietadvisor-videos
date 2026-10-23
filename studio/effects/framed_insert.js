/* @effect framed_insert
   @does: a second clip rises in a frame over the blurred first clip, then the camera pushes into the frame until it becomes the world
   @params: outside, inside, rise, fill
   @uses: — (swap these ids for the new episode's own)
   @tags: footage,picture-in-picture,window,object-becomes-world
   @born: demo-stock (stock-as-material test)
*/
({ t, at, p, spring, W, H, u, clip, ctx, params, clamp, lerp }) => {
  // the world outside (footage, blurred and dark) and one window into the subject: a second clip in a tall frame that rises
  // into place on a word with a premium spring, then the camera pushes into the frame until it fills the screen on the
  // last word (object becomes the world). params: outside, inside, rise, fill
  const out = clip(params.outside, 0, 1), ins = clip(params.inside, 0, 1);
  const r = clamp(spring(params.rise, { stiff: 160, damp: 24 })), f = clamp(p(params.fill, .9, 'inOut'));
  if (out) { ctx.save(); ctx.filter = `blur(${(10 * (1 - f)).toFixed(1)}px) brightness(${lerp(.45, 1, f).toFixed(2)})`; const s = Math.max(W / out.width, H / out.height) * (1.05 + .1 * f);
    ctx.drawImage(out, W / 2 - out.width * s / 2, H / 2 - out.height * s / 2, out.width * s, out.height * s); ctx.restore(); }
  if (!ins || r <= 0) return;
  const fw = lerp(W * .34, W, f), fh = lerp(H * .7, H, f), cx = lerp(W * .62, W / 2, f), cy = lerp(H * .5 + (1 - r) * H * .6, H / 2, f);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50 * u * (1 - f); ctx.fillStyle = '#0b0b0d'; ctx.fillRect(cx - fw / 2 - 8 * u * (1 - f), cy - fh / 2 - 8 * u * (1 - f), fw + 16 * u * (1 - f), fh + 16 * u * (1 - f)); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(cx - fw / 2, cy - fh / 2, fw, fh); ctx.clip(); const s = Math.max(fw / ins.width, fh / ins.height) * 1.02;
  ctx.drawImage(ins, cx - ins.width * s / 2, cy - ins.height * s / 2, ins.width * s, ins.height * s); ctx.restore();
}
