/* @effect object_drop
   @does: a real scene under a slow push; on the word a cut-out object falls into frame, lands with a bounce and a dust ring, and a label sets beside it
   @params: bg, obj, go, x, y, size, lab, sub, in, out
   @uses: a plate or footage + one cut-out
   @tags: drop,land,arrival,object,ball,event,bounce
   @born: nike-vs-adidas a5: then came the World Cup
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .12 * k, ox: (k - .5) * -.08, filter: `brightness(${P.dim || .55})` });
  const O = img(P.obj), t0 = at(P.go || 0), T = t - t0, x = W * +(P.x || .5), gy = H * +(P.y || .72), s = H * +(P.size || .34);
  if (O && T > 0) { // fall, then two shrinking bounces
    let y; if (T < .45) y = lerp(-s, gy, (T / .45) ** 2); else { const b = T - .45, h1 = .32, h2 = .18; y = b < h1 ? gy - Math.sin(b / h1 * Math.PI) * s * .35 : b < h1 + h2 ? gy - Math.sin((b - h1) / h2 * Math.PI) * s * .12 : gy; }
    const sq = T > .43 && T < .52 ? .88 : 1; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(x, gy + s * .02, s * .42 * clamp(T / .45), s * .07, 0, 0, 6.29); ctx.fill();
    const kr = clamp((T - .45) / .5); if (kr > 0 && kr < 1) { ctx.strokeStyle = `rgba(255,255,255,${.5 * (1 - kr)})`; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.ellipse(x, gy, s * (.4 + kr * .6), s * (.07 + kr * .1), 0, 0, 6.29); ctx.stroke(); }
    const w = s * O.width / O.height; ctx.save(); ctx.translate(x, y); ctx.rotate(T * 3); ctx.scale(1 / sq, sq); ctx.drawImage(O, -w / 2, -s, w, s); ctx.restore(); }
  const a = clamp(p(t0 + .5, .4)); if (P.lab) text(P.lab, W / 2, H * .13, { size: 84 * u, font: 'impact', col: '#f6efe2', lw: 0, ls: 6 * u, a }); if (P.sub) text(P.sub, W / 2, H * .13 + 78 * u, { size: 42 * u, font: 'cond', col: '#e2e6ee', lw: 0, ls: 3 * u, a });
  ctx.restore();
}
