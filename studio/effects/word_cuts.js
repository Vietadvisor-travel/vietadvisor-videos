/* @effect word_cuts
   @does: one picture per spoken word (footage or photo), hard cut on its word, each arriving already pushing in toward its own focus point
   @params: items, in, out
   @uses: — (swap these ids for the new episode's own)
   @tags: montage,list,cut,footage,photo,rhythm
   @born: wework a0-03: the coffee is free, there's a beer tap, a sign says do what you love
*/
({ t, at, W, H, u, img, clip, ctx, params: P, clamp, lerp, seam }) => {
  // one picture per spoken word (footage or a photo), hard-cut ON its word; each arrives already pushing in toward its own
  // focus point (zoom-through seam: blur spike on the cut, then a long ease-out), so a list of things reads as a list of shots.
  // params: items = id@word@fx@fy@zoom ~ … (the first item needs no word), in, out
  const items = String(P.items).split('~').map(s => { const [id, w, fx, fy, zz] = s.split('@'); return { id, w, fx: +(fx || .5), fy: +(fy || .5), zz: +(zz || 1) }; });
  let k = 0; items.forEach((it, i) => { if (i && it.w && t >= at(it.w)) k = i; });
  const it = items[k], t0 = k ? at(it.w) : 0, t1 = k + 1 < items.length ? at(items[k + 1].w) : 1e9, lt = Math.max(0, t - t0), left = t1 - t;
  const im = clip(it.id, t0, 1) || img(it.id); if (!im || !im.width) return;
  const arrive = 1 - Math.pow(1 - clamp(lt / .5), 4), z = it.zz * lerp(.9, 1, arrive) * (1 + .02 * lt) * (left < .16 ? 1 + (.16 - left) * 1.4 : 1);
  ctx.save(); seam(k === 0 ? (P.in || 'none') : 'none', k === items.length - 1 ? (P.out || 'none') : 'none');
  const bl = (lt < .1 ? (.1 - lt) * 70 : 0) + (left < .16 ? (.16 - left) * 45 : 0); if (bl > .5) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  const s0 = Math.max(W / im.width, H / im.height) * 1.04, fx = it.zz > 1 ? W / 2 + (it.fx - .5) * im.width * s0 : clamp(W / 2 + (it.fx - .5) * im.width * s0, W * .2, W * .8), fy = it.zz > 1 ? H / 2 + (it.fy - .5) * im.height * s0 : clamp(H / 2 + (it.fy - .5) * im.height * s0, H * .2, H * .8); if (it.zz > 1) ctx.translate((W / 2 - fx) * (1 - 1 / it.zz), (H / 2 - fy) * (1 - 1 / it.zz));
  ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); ctx.drawImage(im, W / 2 - im.width * s0 / 2, H / 2 - im.height * s0 / 2, im.width * s0, im.height * s0); ctx.restore();
}
