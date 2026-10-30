/* @effect shelf_light
   @does: a real wall of sneakers on store shelves; the camera tracks along it while shelf lights switch on one row after another, every row full, and a short line sets above
   @params: pic, go, rows, lab, in, out
   @uses: any store or shelf photo
   @tags: shelf,retail,everywhere,availability,stores,distribution
   @born: nike-vs-adidas a2-09: a shoe people lined up for, on shelves everywhere
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { lock: 1, z: 1.15 + .1 * k, ox: (k - .5) * -.16, filter: `brightness(${(.35 + .5 * clamp((t - at(P.go || 0)) / 1.5)).toFixed(2)})` });
  const R = (P.rows || '.3~.5~.7').split('~').map(Number), t0 = at(P.go || 0); R.forEach((y, i) => { const kk = clamp((t - t0 - i * .35) / .3); if (kk <= 0) return; const g = ctx.createLinearGradient(0, y * H - 40 * u, 0, y * H + 60 * u); g.addColorStop(0, `rgba(255,236,190,${(.5 * kk).toFixed(2)})`); g.addColorStop(1, 'rgba(255,236,190,0)'); ctx.fillStyle = g; ctx.fillRect(0, y * H - 40 * u, W, 100 * u); ctx.fillStyle = `rgba(255,248,225,${kk})`; ctx.fillRect(0, y * H - 42 * u, W, 4 * u); });
  if (P.lab) { const a = clamp(p(t0 + R.length * .35, .4)); ctx.save(); ctx.globalAlpha = a * .7; ctx.fillStyle = '#0d0f14'; ctx.fillRect(W * .2, H * .08, W * .6, 100 * u); ctx.restore(); text(P.lab, W / 2, H * .08 + 50 * u, { size: 56 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 6 * u, a }); }
  ctx.restore();
}
