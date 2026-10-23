/* @effect coin_share_slice
   @does: a real coin photo as a pie: a wedge cuts out on the spoken word and fills with banknote texture, showing a share of the whole
   @params: go, num, step
   @uses: onecoin_art_mood_city, onecoin_bitcoin_coins, onecoin_euro_cash (swap these ids for the new episode's own)
   @tags: share,pie,comparison,scale,money
   @born: onecoin a2: all Bitcoin was worth 15.5B; OneCoin had raised more than a quarter of that
*/
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ease, lerp, clamp, col, ctx, params }) => {
  // all the Bitcoin in the world at the end of 2016 as one real coin; OneCoin's cash take cuts out more than a quarter of it
  layer(1, () => { draw(img('onecoin_art_mood_city'), W * .5, H * .5, H * 1.1, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(0, 0, W, H); });
  const bc = img('onecoin_bitcoin_coins'), cx = W * .38, cy = H * .48, R = H * .34, k = spring(params.go || 'c1', { stiff: 90, damp: 12 });
  layer(2, () => { if (bc) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 7); ctx.clip(); ctx.drawImage(bc, cx - R * 1.32, cy - R * 1.32, R * 2.64, R * 2.64); ctx.restore(); }
    text('ALL BITCOIN · 31 DEC 2016', W * .72, H * .3, { size: 30 * u, font: 'cond', weight: 700, ls: 4 * u, col: '#b9a57d', a: clamp(k) });
    text('≈ $15.5 BILLION', W * .72, H * .39, { size: 48 * u, font: 'impact', col: '#efe2c4', a: p(params.num || 'billion', .5) });
    if (+params.step === 2) { const q = p('quarter', 1.1, 'inOut'), ang = .258 * Math.PI * 2 * q;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 1.04, -Math.PI / 2, -Math.PI / 2 + ang); ctx.closePath(); ctx.clip();
      const cash = img('onecoin_euro_cash'); if (cash) ctx.drawImage(cash, cx - R * 1.1, cy - R * 1.2, R * 2.2, R * 2.4); ctx.fillStyle = 'rgba(201,168,90,.35)'; ctx.fillRect(cx - R * 1.1, cy - R * 1.1, R * 2.2, R * 2.2); ctx.restore();
      ctx.strokeStyle = col.gold; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 1.04, -Math.PI / 2, -Math.PI / 2 + ang); ctx.closePath(); ctx.stroke();
      text('ONECOIN: > $4 BILLION', W * .72, H * .56, { size: 46 * u, font: 'impact', col: col.gold, a: q });
      text('for rows in a database', W * .72, H * .64, { size: 34 * u, font: 'serif', col: '#efe2c4', a: p('rows', .6) }); }
  });
}
