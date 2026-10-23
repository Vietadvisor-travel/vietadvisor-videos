/* @effect cash_split_vault
   @does: a real stack of notes is cut 60/40: one part slides to you, the other slides into a vault that shuts on the word
   @params: —
   @uses: onecoin_art_vault_glow, onecoin_euro_cut, onecoin_el_vault_wheel (swap these ids for the new episode's own)
   @tags: money,split,locked,payout,vault,percent
   @born: onecoin a2: Sixty percent cash. Forty percent locked inside the system
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, ease, lerp, clamp, col, ctx }) => {
  // a real stack of euro notes is cut 60/40: the 60 comes to you, the 40 slides into a vault that shuts
  layer(1, () => { draw(img('onecoin_art_vault_glow'), W * .5, H * .5, H * 1.1, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const cash = img('onecoin_euro_cut'); if (!cash) return; const ch = H * .56, cw = ch * cash.width / cash.height, cx = W * .44, cy = H * .45;
  const a = spring('Sixty', { stiff: 140, damp: 14 }), b = spring('locked', { stiff: 90, damp: 12 }), cut = cw * .6;
  layer(2, () => {
    ctx.save(); ctx.translate(-a * W * .05, 0); ctx.drawImage(cash, 0, 0, cash.width * .6, cash.height, cx - cw / 2, cy - ch / 2, cut, ch); ctx.restore();
    text('60% CASH', cx - cw / 2 + cut / 2 - a * W * .05, cy + ch / 2 + 46 * u, { size: 48 * u, font: 'impact', col: '#efe2c4', a: clamp(a) });
    const dx = b * W * .26; ctx.save(); ctx.translate(dx, 0); ctx.drawImage(cash, cash.width * .6, 0, cash.width * .4, cash.height, cx - cw / 2 + cut + 10 * u, cy - ch / 2, cw - cut, ch); ctx.restore();
    text('40% LOCKED', cx + cw / 2 - (cw - cut) / 2 + dx, cy + ch / 2 + 46 * u, { size: 48 * u, font: 'impact', col: col.gold, a: clamp(p('Forty', .4)) });
  });
  layer(2.5, () => { const v = img('onecoin_el_vault_wheel'); if (!v) return; const shut = p('system', .6, 'out5'); draw(v, W * .84, H * .45, H * .48 * (1 + .04 * shut), { a: clamp(b * 1.4) });
    text('"TRADING ACCOUNT"', W * .86, H * .84, { size: 26 * u, font: 'cond', weight: 700, col: '#b9a57d', ls: 4 * u, a: clamp(b) }); });
}
