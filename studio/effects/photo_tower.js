/* @effect photo_tower
   @does: real photos become solid floors of a tower dropped in on the beat with the camera pulling back; one floor is pulled out and the rest shatter onto the ground
   @params: floors, go, pull, k, sky
   @uses: — (swap these ids for the new episode's own)
   @tags: photo,tower,physics,collapse,stack,shatter
   @born: demo-kit (fx kit showcase)
*/
({ t, at, p, W, H, u, img, ctx, params, clamp, lerp, extrude, drop, shatter, draw, cover, block }) => {
  // real photos become the floors of a tower: each floor is a thick slab cut from a photo, dropped in on the beat and
  // landing with a bounce; the camera climbs with the tower. On a word one floor is pulled out sideways and the rest shatter.
  // params: floors (image ids, bottom first), go, pull, k (index of the pulled floor), sky (backdrop image)
  const ids = String(params.floors).split(','), n = ids.length, fh = H * .12, fw = W * .4, base = H * .9, t0 = at(params.go), tp = at(params.pull), k = +params.k || 1;
  const S = window.__strips || (window.__strips = {});
  const strip = id => { if (S[id]) return S[id]; const c = img(id); if (!c) return null; const s = document.createElement('canvas'); s.width = 900; s.height = Math.round(900 * fh / fw); const g = s.getContext('2d');
    const sc = Math.max(s.width / c.width, s.height / c.height); g.drawImage(c, (s.width - c.width * sc) / 2, (s.height - c.height * sc) / 2, c.width * sc, c.height * sc); return S[id] = s; };
  const landed = ids.filter((_, i) => t > t0 + i * .42 + .3).length, climb = Math.max(0, (landed + 1.6) * fh - H * .62);
  const cam = 0, prog = clamp((t - t0) / (n * .42 + .5)), sc = lerp(1.9, 1, 1 - Math.pow(1 - prog, 2));   // pull back as it grows
  if (params.sky) cover(img(params.sky), { z: 1.2, oy: cam / H * .2, filter: 'blur(5px) brightness(.5)' });
  ctx.save(); ctx.translate(W / 2, base); ctx.scale(sc, sc); ctx.translate(-W / 2, -base + H * .06 * (sc - 1));
  const g = ctx.createLinearGradient(0, base, 0, base + H * .4); g.addColorStop(0, '#15120e'); g.addColorStop(1, '#050403'); ctx.fillStyle = g; ctx.fillRect(-W, base, W * 3, H * 2);
  ids.forEach((id, i) => {
    const s = strip(id); if (!s) return; const ty = base - (i + .5) * fh, tl = t0 + i * .42, y = drop(tl, ty - H * 1.2 - cam, ty, { bounce: .22 });
    if (t < tl) return;
    if (t >= tp && i === k) { const q = clamp((t - tp) / .45); block(s, W / 2 + q * q * W * .9, ty, fw, fh); return; }
    if (t >= tp + .35) { shatter(s, { x: W / 2, y: ty, w: fw, h: fh, t0: tp + .35 + Math.abs(i - k) * .06, cols: 8, rows: 2, origin: [W / 2, base - (k + .5) * fh], force: 700, floor: base, seed: 3 + i }); return; }
    block(s, W / 2, y, fw, fh);
  });
  ctx.restore();
}
