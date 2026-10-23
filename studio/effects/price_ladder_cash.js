/* @effect price_ladder_cash
   @does: a product price ladder as bars built from real banknote images; tiers stagger up, the top tier springs out of the frame with its price pinned at the top
   @params: —
   @uses: onecoin_art_gala_table, onecoin_euro_cash (swap these ids for the new episode's own)
   @tags: money,price,tiers,bars,packages,scale
   @born: onecoin a2: Package prices started at one hundred euros and went up to 118,000
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx }) => {
  // the 2016 package ladder as bars made of real euro notes; the top tier shoots out of the frame
  layer(1, () => { draw(img('onecoin_art_gala_table'), W * .5, H * .5, H * 1.12, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(0, 0, W, H); });
  const tiers = [['STARTER', 100], ['TRADER', 500], ['PRO TRADER', 1000], ['EXECUTIVE', 3000], ['TYCOON', 5000], ['PREMIUM', 12500], ['TOP TIER', 118000]];
  const cash = img('onecoin_euro_cash'), base = H * .8, sc = H * .34 / 12500, bw = W * .085;
  layer(2, () => tiers.forEach(([name, v], i) => {
    const x = W * (.12 + i * .125), k = i < 6 ? stagger(i, 6, 'started', 1.3, .7, 'out5') : spring('118,000', { stiff: 60, damp: 11 });
    const h = Math.max(6 * u, v * sc * k), top = base - h;
    ctx.save(); ctx.beginPath(); ctx.rect(x - bw / 2, Math.max(-20 * u, top), bw, base - Math.max(-20 * u, top)); ctx.clip();
    if (cash) { const th = bw * cash.height / cash.width; for (let y = base - th; y > top - th; y -= th * .92) ctx.drawImage(cash, x - bw / 2, y, bw, th); }
    ctx.fillStyle = i === 6 ? 'rgba(201,168,90,.28)' : 'rgba(10,8,6,.22)'; ctx.fillRect(x - bw / 2, top, bw, h); ctx.restore();
    text(name, x, base + 30 * u, { size: 22 * u, font: 'cond', weight: 700, col: '#d8c7a2', ls: 2 * u, a: clamp(k * 3) });
    const lab = '€' + Math.round(v * clamp(k)).toLocaleString('en-US');
    text(lab, x, Math.max(H * .09, top - 26 * u), { size: (i === 6 ? 44 : 30) * u, font: 'cond', weight: 700, col: i === 6 ? col.gold : '#efe2c4', a: clamp(k * 3) });
  }));
  text('ONECOIN PACKAGES · 2016', W * .5, H * .06, { size: 26 * u, font: 'cond', weight: 700, ls: 8 * u, col: '#b9a57d', a: p('Package', .6) });
}
