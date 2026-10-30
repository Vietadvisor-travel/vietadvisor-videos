/* @effect box_stack_fall
   @does: a stack of shoe boxes stands beside a figure on a dark floor; on the word the floor jolts and the top boxes slide off and tumble out of frame while the figure counts down and locks, a red percentage setting under it
   @params: bg, box, from, to, a, b, go, pct, unit, lab, in, out
   @uses: nva_cut_shoe_box + any photo
   @tags: fall,revenue,decline,stack,boxes,shrink
   @born: nike-vs-adidas a3-08: in fiscal 2025 revenue fell ten percent, to $46.3 billion
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const bx = img(P.box || 'nva_cut_shoe_box'), from = +(P.from || 100), to = +(P.to || 90), n = 10, keep = Math.round(n * to / from), t0 = at(P.go || 0), kv = clamp(p(t0, .6, 'inOut')), bw = W * .2, bh = H * .065, fy = H * .84, cx = W * .3, jolt = t > t0 ? Math.min(1, spring(t0, { stiff: 300, damp: 14 })) * 18 * u : 0;
  ctx.fillStyle = 'rgba(240,240,240,.25)'; ctx.fillRect(W * .08, fy + jolt, W * .84, 3 * u); const r = rng(5);
  for (let i = 0; i < n; i++) { const top = i >= keep, dx = (r() * .7 + .3) * -700 * u, dr = (r() - .5) * 3, tt = t > t0 + .3 ? t - t0 - .3 : 0; let x = cx - bw / 2 + (i % 2 ? 8 * u : -8 * u), y = fy + jolt - (i + 1) * bh, rot = 0;
    if (top && tt > 0) { x += dx * tt; y += 1400 * u * tt * tt - 150 * u * tt; rot = dr * tt; if (y > H * .84) continue; }
    if (!bx) continue; ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.rotate(rot); const ih = bw * bx.height / bx.width; ctx.drawImage(bx, -bw / 2, bh / 2 - ih * .9, bw, ih); ctx.restore(); }
  const v = lerp(from, to, kv), tx = W * .66; text(t < t0 ? (P.a || '') : (P.b || ''), tx, H * .3, { size: 46 * u, font: 'cond', col: '#e9ecf2', lw: 0, ls: 5 * u });
  text((P.unit || '') + v.toFixed(1) + 'B', tx, H * .44, { size: 140 * u, font: 'impact', col: kv > 0 ? '#ff6b5e' : '#f2f4f8', lw: 0 }); if (P.lab) text(P.lab, tx, H * .55, { size: 34 * u, font: 'cond', col: '#c9ced8', lw: 0, ls: 4 * u });
  if (P.pct && kv >= 1) text(P.pct, tx, H * .69, { size: 100 * u, font: 'impact', col: '#ff6b5e', lw: 0 });
  ctx.restore();
}
