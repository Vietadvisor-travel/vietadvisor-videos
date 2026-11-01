/* @effect same_day_split
   @does: the frame splits into two real places side by side under one date; on its word each half gets its own number, counted up, so two facts about one company collide on one day
   @params: a, b, alab, blab, aval, bval, apre, bpre, asuf, bsuf, ago, bgo, date, in, out
   @uses: two real pictures (photo or footage)
   @tags: split,same-day,collision,two-places,numbers,cold-open,contrast
   @born: meta-cambridge-analytica-penalty a0: revenue in California and a penalty in Santa Fe on the same day
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const k = clamp(t / Math.max(1, dur)), split = clamp(p(.1, .9, 'inOut'));
  [[P.a, 0, P.alab, P.aval, P.apre, P.asuf, P.ago, '#7fb2ff'], [P.b, 1, P.blab, P.bval, P.bpre, P.bsuf, P.bgo, '#ff6b5e']].forEach(([id, side, lab, val, pre, suf, go, col]) => {
    const im = clip(id, 0, 1) || img(id); const x0 = side ? W / 2 + 6 * u : 0, w = W / 2 - 6 * u;
    ctx.save(); ctx.beginPath(); ctx.rect(lerp(side ? W : -w, x0, split), 0, w, H); ctx.clip();
    if (im) { const s = Math.max(w / im.width, H / im.height) * (1.12 + .1 * k); ctx.filter = 'brightness(.55)'; ctx.drawImage(im, lerp(side ? W : -w, x0, split) + w / 2 - im.width * s / 2 + (k - .5) * (side ? -1 : 1) * 40 * u, H / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.filter = 'none'; }
    ctx.restore();
    const cx = x0 + w / 2, a = clamp(split * 2 - 1); if (lab) text(lab, cx, H * .3, { size: 46 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u, a });
    if (val && go) { const kv = clamp(p(at(go), 1.0, 'out')); if (kv > 0) { const v = +val * kv, s = (pre || '') + (Number.isInteger(+val) ? Math.round(v) : v.toFixed(1)) + (suf || ''); ctx.save(); ctx.fillStyle = 'rgba(8,9,12,.7)'; ctx.fillRect(cx - 300 * u, H * .45, 600 * u, 190 * u); ctx.restore(); text(s, cx, H * .45 + 98 * u, { size: 128 * u, font: 'impact', col, lw: 0, a: clamp(kv * 3) }); } } });
  if (P.date) { const kd = clamp(spring(.4, { stiff: 260, damp: 18 }), 0, 1.1); ctx.save(); ctx.translate(W / 2, H * .13); ctx.scale(kd, kd); ctx.fillStyle = '#f2ead9'; const dw = (P.date.length * 30 + 80) * u; ctx.fillRect(-dw / 2, -48 * u, dw, 96 * u); text(P.date, 0, 2 * u, { size: 56 * u, font: 'impact', col: '#1c1c20', lw: 0, ls: 4 * u }); ctx.restore(); }
  ctx.restore();
}
