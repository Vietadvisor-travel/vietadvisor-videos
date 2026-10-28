/* @effect stud_counter
   @does: over dim real footage a row of yellow plastic studs pops in along a baseplate, one stud per unit, in quick waves, while a counter climbs and locks on the total in gold
   @params: bg, n, go, span, pre, lab, sub, in, out
   @uses: any clip or photo
   @tags: profit,count,small,positive,build,units
   @born: lego a4-02: before write-downs the toy business made a profit, 103 million kroner
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .1 * k, filter: 'brightness(.42)' });
  const n = +(P.n || 100), t0 = at(P.go || 0), span = +(P.span || 1.6), cols = 26, rows = Math.ceil(n / cols), cs = W * .72 / cols, bx = W / 2 - cols * cs / 2, by = H * .78 - rows * cs;
  const pa = clamp(p(t0 - .4, .4)); ctx.fillStyle = `rgba(30,110,50,${(.85 * pa).toFixed(2)})`; if (pa > 0) ctx.fillRect(bx - cs * .3, by - cs * .3, cols * cs + cs * .6, rows * cs + cs * .6);
  let shown = 0; for (let i = 0; i < n; i++) { const st = t0 + span * i / n; if (t < st) continue; shown++; const ks = Math.min(1.15, spring(st, { stiff: 380, damp: 16 })), x = bx + (i % cols) * cs + cs / 2, y = by + Math.floor(i / cols) * cs + cs / 2, r = cs * .38 * ks;
    ctx.fillStyle = '#b88d00'; ctx.beginPath(); ctx.arc(x + cs * .05, y + cs * .06, r, 0, 6.29); ctx.fill(); ctx.fillStyle = '#f2c11b'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); ctx.fillStyle = 'rgba(255,240,170,.8)'; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .25, 0, 6.29); ctx.fill(); }
  if (t > t0) { text((P.pre ? P.pre + ' ' : '') + shown, W / 2, H * .3, { size: 170 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W / 2, H * .43, { size: 42 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u }); }
  if (P.sub) text(P.sub, W / 2, H * .84, { size: 28 * u, font: 'cond', col: '#d9cdb8', lw: 0, a: clamp(p(t0 + span, .4)) });
  ctx.restore();
}
