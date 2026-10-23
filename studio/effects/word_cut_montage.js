/* @effect word_cut_montage
   @does: one clip per key word, hard cut on the word with a zoom-through seam (blur out, land pushing in)
   @params: clips, keys
   @uses: — (swap these ids for the new episode's own)
   @tags: footage,montage,cut,rhythm,stock
   @born: demo-stock (stock-as-material test)
*/
({ t, at, p, W, H, u, clip, ctx, params, clamp, lerp }) => {
  // one clip per spoken key word, hard-cut ON the word; every shot is already pushing in when it arrives (zoom-through seam:
  // the outgoing shot accelerates 1→1.2 with blur in the last .2 s, the new one lands at .8→1). params: clips, keys
  const ids = String(params.clips).split(','), keys = String(params.keys).split(',');
  let k = 0; keys.forEach((w, i) => { if (t >= at(w)) k = i; });
  const t0 = at(keys[k]), t1 = k + 1 < keys.length ? at(keys[k + 1]) : t0 + 99, lt = t - t0, left = t1 - t;
  const arrive = clamp(lt / .5), z = lerp(.86, 1, 1 - Math.pow(1 - arrive, 4)) * (1 + .03 * lt) * (left < .2 ? 1 + (.2 - left) : 1);
  const im = clip(ids[k], t0, 1); if (!im) return; ctx.save();
  const bl = (lt < .12 ? (.12 - lt) * 60 : 0) + (left < .2 ? (.2 - left) * 45 : 0); if (bl > .5) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  const s = Math.max(W / im.width, H / im.height) * z; ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore();
}
