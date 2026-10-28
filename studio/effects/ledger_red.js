/* @effect ledger_red
   @does: an accounts ledger page slides along under the lamp, one row per year with its result ticked in black ink; on the word the last row's year is stamped in red, LOSS, the ink bleeding into the paper
   @params: y0, y1, go, word, lab, in, out
   @uses: none (procedural paper)
   @tags: loss,first,ledger,year,accounts,turning-point
   @born: lego a2-14: in 1998, LEGO posted a loss
*/
({ t, at, p, spring, W, H, u, ctx, params: P, clamp, lerp, text, seam, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const y0 = +(P.y0 || 1990), y1 = +(P.y1 || 1998), n = y1 - y0 + 1, k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), rh = H * .085, pw = W * .5, px = W * .5 - pw / 2, py = H * .5 - (n * rh) / 2 + lerp(H * .12, -H * .02, k);
  ctx.save(); ctx.translate(W * .5, H * .5); ctx.rotate(-.025); ctx.translate(-W * .5, -H * .5);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u; ctx.fillStyle = '#efe6d2'; ctx.fillRect(px, py - rh, pw, (n + 1.4) * rh); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(70,110,150,.35)'; ctx.lineWidth = 2 * u; for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(px, py + i * rh); ctx.lineTo(px + pw, py + i * rh); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(190,60,50,.5)'; ctx.beginPath(); ctx.moveTo(px + pw * .3, py - rh); ctx.lineTo(px + pw * .3, py + n * rh); ctx.stroke();
  text(P.lab || 'RESULT', px + pw * .65, py - rh * .45, { size: 34 * u, font: 'cond', col: '#5a4c3a', lw: 0, ls: 4 * u });
  for (let i = 0; i < n; i++) { const yy = py + i * rh + rh * .55, last = i === n - 1, ka = clamp((t - i * .18) / .3); if (ka <= 0) continue;
    text(String(y0 + i), px + pw * .15, yy, { size: 44 * u, font: 'hand', col: last && t > t0 ? '#b3261e' : '#2a241c', lw: 0, a: ka });
    if (!last) { ctx.strokeStyle = `rgba(30,30,30,${ka})`; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(px + pw * .6, yy); ctx.lineTo(px + pw * .64, yy + 10 * u); ctx.lineTo(px + pw * .72, yy - 14 * u); ctx.stroke(); } }
  if (t > t0) { const ks = clamp(spring(t0, { stiff: 260, damp: 16 }), 0, 1.2), yy = py + (n - 1) * rh + rh * .55, sc = lerp(2.4, 1, Math.min(1, ks)); ctx.save(); ctx.translate(px + pw * .66, yy); ctx.rotate(-.12); ctx.scale(sc, sc); ctx.globalAlpha = clamp(ks * 1.5);
    ctx.strokeStyle = '#b3261e'; ctx.lineWidth = 6 * u; ctx.strokeRect(-110 * u, -36 * u, 220 * u, 72 * u); text(P.word || 'LOSS', 0, 0, { size: 60 * u, font: 'impact', col: '#b3261e', lw: 0, ls: 6 * u }); ctx.restore();
    const kb = clamp((t - t0 - .3) / 1.5); ctx.fillStyle = `rgba(179,38,30,${(.18 * kb).toFixed(2)})`; ctx.beginPath(); ctx.ellipse(px + pw * .66, yy, 160 * u * kb, 60 * u * kb, -.12, 0, 6.29); ctx.fill(); }
  ctx.restore(); ctx.restore();
}
