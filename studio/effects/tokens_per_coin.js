/* @effect tokens_per_coin
   @does: one coin equals a grid of tokens that grows from N to M dots on the spoken word: the hidden dilution made countable
   @params: —
   @uses: onecoin_art_split_champagne, onecoin_el_gold_coin (swap these ids for the new episode's own)
   @tags: dilution,ratio,tokens,count,hidden-cost
   @born: onecoin a2: the mining difficulty quietly rose: from 44 tokens per coin to 359
*/
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ease, lerp, clamp, col, ctx, rng }) => {
  // one coin on the left; the pile of tokens it costs on the right grows from 44 to 359 as the narrator says "rose"
  layer(1, () => { draw(img('onecoin_art_split_champagne'), W * .5, H * .5, H * 1.12, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const r = p('rose', 1.8, 'inOut'), n = Math.round(lerp(44, 359, r));
  layer(2, () => { draw(img('onecoin_el_gold_coin'), W * .2, H * .46, H * .4); text('1 COIN', W * .2, H * .7, { size: 44 * u, font: 'impact', col: col.gold });
    text('=', W * .35, H * .46, { size: 110 * u, font: 'impact', col: '#efe2c4' });
    for (let i = 0; i < n; i++) { const c = i % 24, row = Math.floor(i / 24), R = rng(i + 3); const x = W * (.43 + c * .021), y = H * (.12 + row * .034);
      ctx.fillStyle = i < 44 ? '#efe2c4' : col.gold; ctx.globalAlpha = i < 44 ? .9 : clamp((r * 359 - i) / 20) * .9; ctx.beginPath(); ctx.arc(x, y, 7 * u, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1; text(n + ' TOKENS', W * .68, H * .74, { size: 64 * u, font: 'impact', col: n > 44 ? col.gold : '#efe2c4' });
    text('"MINING DIFFICULTY"', W * .68, H * .82, { size: 24 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#b9a57d', a: p('difficulty', .5) }); });
}
