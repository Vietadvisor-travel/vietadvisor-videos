/* @effect hundred_stacks_one_lit
   @does: a total as 100 stacks of real notes; the recovered share is one lit stack; on the word the other 99 go dark and the ratio lands
   @params: step
   @uses: onecoin_art_victim_kitchen, onecoin_euro_cash (swap these ids for the new episode's own)
   @tags: recovery,ratio,money,victims,comparison,one-percent
   @born: onecoin a6: just over 40 million… about one cent on the dollar
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // more than $4 billion lost as 100 stacks of real notes; the 2026 victim fund is one stack; on "cent" the other 99 go dark
  layer(1, () => { draw(img('onecoin_art_victim_kitchen'), W * .5, H * .5, H * 1.12, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const cash = img('onecoin_euro_cash'), step = +params.step, gx = W * .08, gy = H * .16, cw = W * .045, chh = cw * (cash ? cash.height / cash.width : 1.1), sp = W * .052;
  const fund = step === 1 ? spring('forty', { stiff: 140, damp: 12 }) : 1, dark = step === 2 ? p('cent', .9, 'inOut') : 0;
  layer(2, () => { for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), k = step === 1 ? stagger(c + r, 19, 'opened', .9, .4) : 1, me = i === 99;
      const x = gx + c * sp, y = gy + r * (chh * .62); if (!cash) break; ctx.globalAlpha = clamp(k) * (me ? 1 : 1 - dark * .85);
      ctx.drawImage(cash, x, y + (1 - k) * -30 * u, cw, chh * .55); if (me && fund > .05) { ctx.strokeStyle = col.gold; ctx.lineWidth = 4 * u * fund; ctx.strokeRect(x - 4 * u, y - 4 * u, cw + 8 * u, chh * .55 + 8 * u); } }
    ctx.globalAlpha = 1; });
  layer(2.4, () => { const tx = W * .78;
    text('> $4 BILLION', tx, H * .3, { size: 72 * u, font: 'impact', col: '#efe2c4', a: step === 1 ? p('fund', .5) : 1 - dark * .6 });
    text('LOST · 100 STACKS', tx, H * .38, { size: 26 * u, font: 'cond', weight: 700, ls: 5 * u, col: '#b9a57d', a: step === 1 ? p('fund', .5) : 1 });
    text('$40 MILLION+', tx, H * .56, { size: 72 * u * (.7 + .3 * clamp(fund)), font: 'impact', col: col.gold, a: clamp(fund) });
    text('THE 2026 VICTIM FUND · 1 STACK', tx, H * .64, { size: 26 * u, font: 'cond', weight: 700, ls: 4 * u, col: '#b9a57d', a: clamp(fund) });
    if (step === 2) { const e = spring('cent', { stiff: 160, damp: 12 }); text('≈ 1¢ ON THE $', tx, H * .82, { size: 84 * u * (.6 + .4 * clamp(e)), font: 'impact', col: col.gold, a: clamp(e) }); } });
}
