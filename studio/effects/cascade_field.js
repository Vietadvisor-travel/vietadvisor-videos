/* @effect cascade_field
   @does: a small block of lit dots stands for the people who acted; on the word it bursts into a field of dots that fills the frame in waves from that block outward, the people it reached; each count sets beside its own group
   @params: bg, a, alab, b, blab, go, src, in, out
   @uses: any dim plate
   @tags: spread,multiply,reach,data,profiles,scale,dots,explosion
   @born: meta-cambridge-analytica-penalty a2: about 270,000 downloaded the quiz; up to 87 million profiles were reached
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); if (bg) cover(bg, { z: 1.08, filter: 'brightness(.32) blur(2px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), T = t - t0, ox = W * .2, oy = H * .55, r = rng(31);
  // the small block: 6 x 6 lit dots
  for (let i = 0; i < 36; i++) { const x = ox + (i % 6 - 2.5) * 18 * u, y = oy + (Math.floor(i / 6) - 2.5) * 18 * u; ctx.fillStyle = '#f2c14e'; ctx.fillRect(x - 6 * u, y - 6 * u, 12 * u, 12 * u); }
  const N = 1500; for (let i = 0; i < N; i++) { const x = W * (.06 + r() * .9), y = H * (.2 + r() * .64), d = Math.hypot(x - ox, (y - oy) * 1.6) / W, ki = clamp((T - d * 2.2) / .35); if (ki <= 0) continue; ctx.fillStyle = `rgba(127,178,255,${(.35 + r() * .5) * ki})`; const s = (3 + r() * 3) * u * ki; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
  ctx.save(); ctx.fillStyle = 'rgba(8,9,12,.75)'; ctx.fillRect(ox - 170 * u, oy + 70 * u, 340 * u, 120 * u); ctx.restore();
  text(P.a || '', ox, oy + 112 * u, { size: 58 * u, font: 'impact', col: '#f2c14e', lw: 0 }); text(P.alab || '', ox, oy + 162 * u, { size: 40 * u, font: 'cond', col: '#f2f4f8', lw: 0 });
  const kb = clamp(p(t0 + 1.2, .5)); if (kb > 0) { ctx.save(); ctx.globalAlpha = kb; ctx.fillStyle = 'rgba(8,9,12,.78)'; ctx.fillRect(W * .66 - 330 * u, H * .1, 660 * u, 170 * u); ctx.restore(); text(P.b || '', W * .66, H * .1 + 70 * u, { size: 90 * u, font: 'impact', col: '#7fb2ff', lw: 0, a: kb }); text(P.blab || '', W * .66, H * .1 + 136 * u, { size: 40 * u, font: 'cond', col: '#f2f4f8', lw: 0, a: kb }); }
  if (P.src) text(P.src, W * .5, H * .8, { size: 40 * u, font: 'cond', col: '#b9bec8', lw: 0, a: kb });
  ctx.restore();
}
