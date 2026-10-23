/* @effect sentence_ladder
   @does: prison sentences of a whole cast as bars of years over a real prison photo; new rows land on their spoken words; the one never tried gets an empty dashed row
   @params: step, keys
   @uses: onecoin_prison (swap these ids for the new episode's own)
   @tags: verdict,sentences,court,comparison,cast,bars
   @born: onecoin a5: So line up the sentences
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // the sentences line up as bars of prison time over a real prison fence; new rows land on their spoken words; the founder's row stays empty
  const step = +params.step, keys = String(params.keys || 'c1').split(','), first = step - keys.length;
  layer(1, () => { draw(img('onecoin_prison'), W * .5, H * .5, H * 1.15, { a: .5 }); ctx.fillStyle = 'rgba(8,6,4,.5)'; ctx.fillRect(0, 0, W, H); });
  const rows = [['GREENWOOD', 'the salesman', 20, '20 YEARS'], ['SCOTT', 'the lawyer', 10, '10 YEARS'], ['ARMENTA', 'the boyfriend', 5, '5 YEARS'], ['DILKINSKA', 'head of compliance', 4, '4 YEARS'], ['KONSTANTIN', 'the brother', 34 / 12, 'TIME SERVED'], ['RUJA', 'the founder', 0, 'NEVER TRIED']];
  const x0 = W * .32, full = W * .5, y0 = H * .13, dy = H * .128;
  layer(2, () => rows.forEach(([name, role, yrs, lab], i) => { if (i >= step) return; const y = y0 + i * dy, cur = i >= first, go = cur ? keys[i - first] : 0, k = cur ? spring(go, { stiff: 70, damp: 12 }) : 1, a = cur ? clamp(p(go, .3) * 2) : (step === 6 ? .5 : .85);
    text(name, x0 - 26 * u, y, { size: 50 * u, font: 'impact', col: i === 5 ? col.gold : '#efe2c4', align: 'right', a: cur ? Math.max(a, .25) : a });
    text(role, x0 - 26 * u, y + 36 * u, { size: 28 * u, font: 'serif', col: '#d1bd93', align: 'right', a: cur ? Math.max(a, .25) : a });
    if (i < 5) { const w = full * yrs / 20 * k; ctx.save(); ctx.globalAlpha = cur ? 1 : a; const g = ctx.createLinearGradient(x0, 0, x0 + w, 0); g.addColorStop(0, '#7a6432'); g.addColorStop(1, cur ? '#f0d28a' : '#b8995a'); ctx.fillStyle = g; ctx.fillRect(x0, y - 26 * u, w, 52 * u);
      for (let b = 1; b < yrs; b++) { ctx.fillStyle = 'rgba(8,6,4,.5)'; ctx.fillRect(x0 + full * b / 20 - 1.5 * u, y - 26 * u, 3 * u, 52 * u * clamp(k * 1.2)); } ctx.restore();
      text(lab, x0 + w + 22 * u, y + 2 * u, { size: 44 * u, font: 'impact', col: cur ? col.gold : '#e6d6b2', align: 'left', a: cur ? clamp(k) : a }); }
    else { const e = spring(go, { stiff: 160, damp: 12 }); ctx.save(); ctx.setLineDash([12 * u, 10 * u]); ctx.strokeStyle = col.gold; ctx.lineWidth = 4 * u; ctx.strokeRect(x0, y - 26 * u, full, 52 * u); ctx.restore();
      text(lab, x0 + full / 2, y + 2 * u, { size: 52 * u * (.7 + .3 * clamp(e)), font: 'impact', col: col.gold, a: clamp(e) }); }
  }));
  if (step === 6) text('5 COUNTS · PRESUMED INNOCENT IN LAW', W * .57, H * .9, { size: 32 * u, font: 'cond', weight: 700, ls: 5 * u, col: '#e0cfa8', a: p('law', .6) });
}
