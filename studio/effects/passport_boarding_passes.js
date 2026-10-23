/* @effect passport_boarding_passes
   @does: a passport lands; boarding passes slide out of it one per spoken city; only the chosen destination stays lit
   @params: —
   @uses: onecoin_art_checkin_hand, onecoin_el_passport (swap these ids for the new episode's own)
   @tags: travel,escape,flight,tickets,passport
   @born: onecoin a4: a big passport, and he bought her tickets to Vienna and to Athens
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx }) => {
  // the "big passport" lands; two boarding passes slide out of it, Vienna and Athens; only Athens stays lit
  layer(1, () => { draw(img('onecoin_art_checkin_hand'), W * .5, H * .5, H * 1.1, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(0, 0, W, H); });
  const pk = spring('passport', { stiff: 130, damp: 13 });
  layer(2, () => { draw(img('onecoin_el_passport'), W * .3, H * .5 + (1 - pk) * H * .4, H * .5, { a: clamp(pk), rot: -.08 });
    text('"BIG PASSPORT"', W * .3, H * .82, { size: 34 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#d9c7a0', a: p('passport', .5) }); });
  const pass = (k, y, code, city, lit) => { const x = lerp(W * .3, W * .68, k); ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(-.08, .02, k)); ctx.globalAlpha = clamp(k * 2) * (lit ? 1 : lerp(1, .35, p('Athens', .6)));
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-W * .17 + 10 * u, -H * .09 + 12 * u, W * .34, H * .18);
    ctx.fillStyle = '#f2ead7'; ctx.fillRect(-W * .17, -H * .09, W * .34, H * .18); ctx.fillStyle = lit ? '#c9a85a' : '#9a8e78'; ctx.fillRect(-W * .17, -H * .09, 18 * u, H * .18);
    ctx.setLineDash([6 * u, 6 * u]); ctx.strokeStyle = '#b5a888'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(W * .09, -H * .08); ctx.lineTo(W * .09, H * .08); ctx.stroke(); ctx.restore();
    text('BOARDING PASS', x - W * .13, y - H * .045, { size: 20 * u, font: 'cond', weight: 700, ls: 5 * u, col: '#7a6a52', lw: 0, align: 'left', a: clamp(k * 2) });
    text('SOF → ' + code, x - W * .13, y + H * .02, { size: 64 * u, font: 'impact', col: '#231c15', lw: 0, align: 'left', a: clamp(k * 2) });
    text(city, x + W * .13, y + H * .02, { size: 26 * u, font: 'cond', weight: 700, col: lit ? '#9c7a2c' : '#7a6a52', lw: 0, a: clamp(k * 2) }); };
  layer(2.4, () => { pass(spring('Vienna', { stiff: 110, damp: 13 }), H * .32, 'VIE', 'VIENNA', false); pass(spring('Athens', { stiff: 110, damp: 13 }), H * .62, 'ATH', 'ATHENS', true); });
  air('dust', { dens: .5 });
}
