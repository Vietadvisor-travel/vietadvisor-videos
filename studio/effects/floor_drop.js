/* @effect floor_drop
   @does: a tall stack of real-looking bricks stands on a floor over the dimmed source page, its value beside it; on the first word the floor cracks and the stack jolts down; on the second the top part breaks off and tumbles out of frame while the value counts down to the new figure and a red percentage sets
   @params: bg, from, to, a, b, go, go2, pct, lab, note, in, out
   @uses: lego_cut_brick_* + any page or photo
   @tags: fall,revenue,drop,collapse,decline,stack
   @born: lego a3-01: then the floor gave way; in 2003 sales fell by more than a quarter
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); { const _c = clamp(t / Math.max(1, dur)), _s = 1.01 + .06 * _c * _c * (3 - 2 * _c); ctx.translate(W / 2, H / 2); ctx.scale(_s, _s); ctx.translate(-W / 2 + (_c - .5) * -W * .03, -H / 2); }
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.15 + .1 * k, oy: (k - .5) * -.06, filter: 'brightness(.3) blur(3px)' });
  const br = img('lego_cut_brick_red'), from = +(P.from || 100), to = +(P.to || 70), n = 18, keep = Math.round(n * to / from), t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0);
  const bw = W * .2, bh = H * .62 / n, fy = H * .8, cx = W * .36, jolt = t > t1 ? Math.min(1, spring(t1, { stiff: 300, damp: 14 })) * 26 * u : 0;
  if (t > t1) { ctx.strokeStyle = 'rgba(240,230,210,.8)'; ctx.lineWidth = 3 * u; const r = rng(4), kc = clamp((t - t1) / .25); ctx.beginPath(); let x = W * .1; ctx.moveTo(x, fy + jolt); while (x < W * .1 + W * .8 * kc) { x += 30 * u; ctx.lineTo(x, fy + jolt + (r() - .5) * 18 * u); } ctx.stroke(); }
  ctx.fillStyle = 'rgba(240,230,210,.25)'; ctx.fillRect(W * .1, fy + jolt, W * .8, 3 * u);
  const kb = t > t2 ? (t - t2) : -1, rr = rng(9);
  for (let i = 0; i < n; i++) { const top = i >= keep; let x = cx - bw / 2 + (i % 2 ? 6 * u : -6 * u), y = fy + jolt - (i + 1) * bh, rot = 0, a = 1; const dx = -(.3 + rr()) * 700 * u, dr = (rr() - .5) * 3;
    { const kin = clamp((t - i * .07) / .3); y -= (1 - kin * kin) * H * .9; if (kin <= 0) continue; }
    if (top && kb > 0) { const tt = kb; x += dx * tt; y += 1400 * u * tt * tt - 200 * u * tt; rot = dr * tt; if (y > H * 1.3) continue; }
    if (!br) continue; ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.rotate(rot); ctx.globalAlpha = a; const ih = bw * br.height / br.width; ctx.drawImage(br, -bw / 2, bh / 2 - ih, bw, ih); ctx.restore(); }
  const kv = clamp(p(t2, 1.0, 'inOut')), v = Math.round(lerp(from, to, kv)), tx = W * .68;
  text(kv < 1 ? (P.a || '') : (P.b || ''), tx, H * .3, { size: 46 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 5 * u });
  text(v.toLocaleString('en-US'), tx, H * .43, { size: 150 * u, font: 'impact', col: kv > 0 ? '#ff6b5e' : '#f6efe2', lw: 0 });
  if (P.lab) text(P.lab, tx, H * .54, { size: 34 * u, font: 'cond', col: '#d9cdb8', lw: 0, ls: 4 * u });
  if (P.pct && kv >= 1) { const ks = clamp(spring(t2 + 1, { stiff: 240, damp: 16 }), 0, 1.1); text(P.pct, tx, H * .68, { size: 110 * u * ks, font: 'impact', col: '#ff6b5e', lw: 0 }); }
  if (P.note) text(P.note, tx, H * .6, { size: 26 * u, font: 'cond', col: '#b9ad98', lw: 0 });
  ctx.restore();
}
