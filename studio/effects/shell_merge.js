/* @effect shell_merge
   @does: how a SPAC works: an empty box already standing on the stock-market line; a company card slides into it and the lid closes, while the usual filing card is struck through and set aside
   @params: in, out, bg, line, shell, go, co, skip, filing
   @uses: — (swap these ids for the new episode's own)
   @tags: spac,merger,shell,listing,mechanism,diagram
   @born: wework a4-12: a SPAC is a shell company already on the stock market
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // how a SPAC works, as two objects over a real picture: an empty box already standing on the exchange's line (the
  // listed shell); a company card slides into it on the word and the lid closes; the normal route (a filing) is shown as a
  // card that gets skipped, dimmed and set aside. params: bg, shell, co, go, skip, lab, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(6px) brightness(.38)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const ground = H * .7; ctx.fillStyle = 'rgba(239,230,210,.8)'; ctx.fillRect(W * .08, ground, W * .84, 4 * u); text(P.line || 'THE STOCK MARKET', W * .14, ground + 44 * u, { size: 40 * u, font: 'cond', col: '#cfc3ab', lw: 0, align: 'left', ls: 4 * u });
  const sx = W * .64, sw = W * .26, sh = H * .3, a0 = clamp(t / .5);
  ctx.save(); ctx.globalAlpha = a0; ctx.strokeStyle = '#efe6d2'; ctx.lineWidth = 5 * u; ctx.strokeRect(sx - sw / 2, ground - sh, sw, sh); ctx.fillStyle = 'rgba(239,230,210,.06)'; ctx.fillRect(sx - sw / 2, ground - sh, sw, sh); ctx.restore();
  text(P.shell || 'LISTED SHELL', sx, ground - sh - 46 * u, { size: 48 * u, font: 'cond', col: '#efe6d2', lw: 0, ls: 4 * u, a: a0 });
  const k = clamp(spring(P.go || 0, { stiff: 110, damp: 17 }), 0, 1.03), cw = sw * .78, ch = sh * .74, cx = lerp(W * .2, sx, Math.min(1, k)), cy = ground - ch / 2 - 10 * u - (1 - Math.min(1, k)) * 0;
  ctx.save(); ctx.fillStyle = '#f2c14e'; ctx.fillRect(cx - cw / 2, cy - ch / 2, cw, ch); ctx.restore(); text(P.co || 'WEWORK', cx, cy, { size: 64 * u, font: 'impact', col: '#1a1408', lw: 0 });
  const lid = clamp(p(P.go || 0, .5, 'out') - .4 > 0 ? (t - at(P.go || 0) - .9) / .35 : 0); if (lid > 0) { ctx.save(); ctx.translate(sx - sw / 2, ground - sh); ctx.rotate(-(1 - lid) * 1.2); ctx.fillStyle = '#efe6d2'; ctx.fillRect(0, -6 * u, sw, 12 * u); ctx.restore(); }
  const sk = clamp(p(P.skip || 1e9, .6, 'inOut')), fxp = W * .36, fyp = H * .27; ctx.save(); ctx.globalAlpha = a0 * (1 - .65 * sk); ctx.translate(fxp, fyp - sk * 30 * u); ctx.rotate(-.05 - sk * .12); ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-W * .09, -H * .1, W * .18, H * .2); ctx.restore();
  text(P.filing || 'THE USUAL FILING', fxp, fyp - sk * 30 * u, { size: 40 * u, font: 'cond', col: '#2a241c', lw: 0, a: a0 * (1 - .65 * sk) });
  if (sk > 0) { ctx.strokeStyle = '#ff6b5e'; ctx.lineWidth = 7 * u; ctx.beginPath(); ctx.moveTo(fxp - W * .1, fyp - H * .11); ctx.lineTo(fxp - W * .1 + W * .2 * sk, fyp + H * .11 * (2 * sk - 1)); ctx.stroke(); }
  ctx.restore();
}
