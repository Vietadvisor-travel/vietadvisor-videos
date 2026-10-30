/* @effect stripes_paint
   @does: a real leather surface fills the frame, the camera gliding over it; on the word three white stripes are painted across it with a brush, one after another, then a small count of people ticks up beside them
   @params: bg, go, n, lab, sub, in, out
   @uses: any texture or photo
   @tags: stripes,brand,founding,logo,craft,mark
   @born: nike-vs-adidas a1-05: Adi registers his own company in 1949, with 47 employees and three stripes
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .7})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0); for (let i = 0; i < 3; i++) { const st = t0 + i * .35, kk = clamp((t - st) / .45); if (kk <= 0) continue; const x = W * (.3 + i * .14), w = W * .07; ctx.save(); ctx.translate(x, H * .5); ctx.rotate(-.35); const L = H * .9 * kk, r = rng(i + 3);
    ctx.fillStyle = 'rgba(250,248,240,.95)'; ctx.beginPath(); ctx.moveTo(-w / 2, -H * .45); for (let y = -H * .45; y < -H * .45 + L; y += 20 * u) ctx.lineTo(-w / 2 + (r() - .5) * 6 * u, y); ctx.lineTo(w / 2, -H * .45 + L); for (let y = -H * .45 + L; y > -H * .45; y -= 20 * u) ctx.lineTo(w / 2 + (r() - .5) * 6 * u, y); ctx.closePath(); ctx.fill(); ctx.restore(); }
  const kc = clamp((t - t0 - 1.1) / .8), n = Math.round(+(P.n || 47) * kc); if (kc > 0) { ctx.save(); ctx.fillStyle = 'rgba(10,8,6,.72)'; ctx.fillRect(W * .66, H * .3, W * .28, H * .3); ctx.restore(); text(String(n), W * .8, H * .42, { size: 120 * u, font: 'impact', col: '#f6efe2', lw: 0 }); if (P.sub) text(P.sub, W * .8, H * .53, { size: 34 * u, font: 'cond', col: '#e2d6c2', lw: 0, ls: 3 * u }); }
  if (P.lab) text(P.lab, W * .8, H * .22, { size: 54 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(t0 + .3, .4)) });
  ctx.restore();
}
