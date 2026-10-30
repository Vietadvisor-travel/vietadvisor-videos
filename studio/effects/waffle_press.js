/* @effect waffle_press
   @does: a slab of rubber lies under a hot iron grid; on the word the grid presses down, steam rises, and when it lifts the rubber carries a waffle pattern, which then slides away as a finished sole
   @params: bg, sole, go, lab, sub, in, out
   @uses: nva_cut_sole + a rubber texture
   @tags: invention,sole,waffle,craft,prototype,innovation
   @born: nike-vs-adidas a1-09: Bowerman makes a new sole by pouring rubber into a waffle iron
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .45})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kp = clamp((t - t0) / .5), up = clamp((t - t0 - 1.0) / .5), down = kp * (1 - up), cx = W / 2, cy = H * .56, sw = W * .44, sh = H * .22;
  ctx.fillStyle = '#1b1b1d'; ctx.fillRect(cx - sw / 2, cy - sh / 2, sw, sh); if (kp >= 1) { ctx.fillStyle = '#2c2c30'; for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) ctx.fillRect(cx - sw / 2 + 12 * u + i * sw / 12, cy - sh / 2 + 10 * u + j * sh / 4, sw / 12 - 14 * u, sh / 4 - 14 * u); }
  const gy = lerp(H * .05, cy - sh / 2 - 30 * u, down); ctx.fillStyle = '#5b5e66'; ctx.fillRect(cx - sw / 2 - 20 * u, gy - 60 * u, sw + 40 * u, 60 * u); ctx.fillStyle = '#7d808a'; for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) ctx.fillRect(cx - sw / 2 + i * sw / 12 + 6 * u, gy, sw / 12 - 12 * u, 24 * u);
  if (kp > .9 && up < 1) { const r = rng(Math.floor(t * 10)); ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.arc(cx + (r() - .5) * sw, gy - 80 * u - r() * 120 * u, (10 + r() * 30) * u, 0, 6.29); ctx.fill(); } }
  const S = img(P.sole), ks = clamp((t - t0 - 1.6) / .8); if (S && ks > 0) { const w = W * .4, h = w * S.height / S.width; ctx.drawImage(S, lerp(cx - w / 2, W * .55, ks), lerp(cy - h / 2, H * .7, ks), w, h); }
  const a = clamp(p(t0 + 1.2, .4)); if (P.lab) text(P.lab, W / 2, H * .14, { size: 52 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a }); if (P.sub) text(P.sub, W / 2, H * .84, { size: 34 * u, font: 'cond', col: '#e2d6c2', lw: 0, a });
  ctx.restore();
}
