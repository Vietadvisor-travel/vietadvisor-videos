/* @effect bill_tape
   @does: a long paper bill headed THE BILL feeds out of the right of the frame; the lines it already carries scroll up, the new lines of this act print one by one on their word, and a red stamp lands across the foot of the tape; a short verdict sits at the left
   @params: bg, lines (LABEL^AMOUNT~…), new (index of the first line this act prints), go, stamp, stampat, lab, sub, in, out
   @uses: any dim plate
   @tags: bill,receipt,penalty,fines,ledger,motif,running-total,unpaid
   @born: meta-cambridge-analytica-penalty motif: the bill that never gets paid
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1, filter: 'brightness(.35) blur(2px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const L = (P.lines || '').split('~').filter(Boolean).map(s => s.split('^')), nw = +(P.new || 0), t0 = at(P.go || 0), rowH = 112 * u, tw = W * .38, tx = W * .64, show = 5;
  // how many lines are printed by now: the old ones at once, then one every .55 s from the word
  const printed = nw + Math.max(0, Math.min(L.length - nw, Math.floor((t - t0) / .55) + 1)) * (t >= t0 ? 1 : 0), lastK = clamp(((t - t0) % .55) / .4);
  const first = Math.max(0, printed - show), feed = (k - .5) * 30 * u, y0 = H * .14 + feed;
  const n = Math.min(show, printed), th = 120 * u + n * rowH + 40 * u;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.fillStyle = '#f3efe6'; ctx.fillRect(tx - tw / 2, y0 - 400 * u, tw, th + 400 * u); ctx.restore();
  ctx.fillStyle = '#f3efe6'; for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.moveTo(tx - tw / 2 + i * tw / 18, y0 + th); ctx.lineTo(tx - tw / 2 + (i + .5) * tw / 18, y0 + th + 16 * u); ctx.lineTo(tx - tw / 2 + (i + 1) * tw / 18, y0 + th); ctx.fill(); }
  text('THE BILL', tx, y0 + 60 * u, { size: 62 * u, font: 'impact', col: '#1c1c20', lw: 0, ls: 8 * u });
  ctx.fillStyle = '#1c1c20'; ctx.fillRect(tx - tw * .42, y0 + 104 * u, tw * .84, 3 * u);
  for (let j = 0; j < n; j++) { const i = first + j, [lab, amt] = L[i], y = y0 + 120 * u + j * rowH, isNew = i >= nw, a = isNew ? clamp((t - t0 - (i - nw) * .55) / .4) : 1;
    text(lab, tx - tw * .44, y + 30 * u, { size: 40 * u, font: 'cond', col: '#3a3a40', lw: 0, align: 'left', a });
    text(amt || '', tx + tw * .44, y + 76 * u, { size: 50 * u, font: 'impact', col: isNew ? '#c8281e' : '#1c1c20', lw: 0, align: 'right', a });
    ctx.fillStyle = 'rgba(28,28,32,.18)'; ctx.fillRect(tx - tw * .42, y + rowH - 6 * u, tw * .84, 2 * u); }
  if (P.stamp) { const ks = clamp(spring(at(P.stampat || P.go || 0), { stiff: 300, damp: 16 }), 0, 1.15); if (ks > 0) { ctx.save(); ctx.translate(W * .24, H * .68); ctx.rotate(-.08); const sc = lerp(2.2, 1, Math.min(1, ks)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(ks * 1.5) * .92; ctx.strokeStyle = '#c8281e'; ctx.lineWidth = 9 * u; const sw = Math.max(380, P.stamp.length * 44 + 60) * u; ctx.strokeRect(-sw / 2, -60 * u, sw, 120 * u); text(P.stamp, 0, 4 * u, { size: 76 * u, font: 'impact', col: '#c8281e', lw: 0, ls: 6 * u }); ctx.restore(); } }
  if (P.lab) { const a = clamp(p(t0 + .3, .4)); text(P.lab, W * .24, H * .44, { size: 72 * u, font: 'impact', col: '#f2f4f8', lw: 0, ls: 3 * u, a }); if (P.sub) text(P.sub, W * .24, H * .44 + 74 * u, { size: 42 * u, font: 'cond', col: '#c9ced8', lw: 0, ls: 2 * u, a }); }
  ctx.restore();
}
