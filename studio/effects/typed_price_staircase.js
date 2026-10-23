/* @effect typed_price_staircase
   @does: a hand-set price drawn as a gold staircase line (never a market wiggle) from a start price to an end price, over a dim photo of the office that set it
   @params: —
   @uses: onecoin_hq_office (swap these ids for the new episode's own)
   @tags: price,chart,manipulation,line,growth
   @born: onecoin a2: Fifty euro cents at launch. 29.95 by 2019
*/
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, line, ease, lerp, clamp, col, ctx }) => {
  // the coin's internal price: a staircase the company built by hand, from 50 cents to €29.95, never a market line
  layer(1, () => { draw(img('onecoin_hq_office'), W * .2, H * .5, H * 1.05, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const x0 = W * .14, x1 = W * .86, y0 = H * .78, y1 = H * .2, n = 10, k = clamp((t - at('Fifty')) / Math.max(1, at('ninety') - at('Fifty') + .3));
  const pts = []; for (let i = 0; i <= n; i++) { const v = Math.pow(i / n, 1.6); const x = lerp(x0, x1, i / n), y = lerp(y0, y1, v); if (i) pts.push([x, pts[pts.length - 1][1]]); pts.push([x, y]); }
  layer(2, () => { line([[x0, y0], [x1, y0]], { col: 'rgba(239,226,196,.25)', w: 2 }); line(pts, { col: col.gold, w: 6, k });
    const head = pts[Math.min(pts.length - 1, Math.floor(k * (pts.length - 1)))];
    text('€0.50', x0, y0 + 40 * u, { size: 40 * u, font: 'impact', col: '#efe2c4', a: p('Fifty', .4) }); text('2014', x0, y0 + 80 * u, { size: 24 * u, font: 'cond', col: '#b9a57d', a: p('Fifty', .4) });
    const e = spring('ninety'); text('€29.95', x1 - 40 * u, y1 - 50 * u, { size: 70 * u * (.7 + .3 * clamp(e)), font: 'impact', col: col.gold, a: clamp(e) }); text('JANUARY 2019', x1 - 40 * u, y1 + 6 * u, { size: 24 * u, font: 'cond', col: '#b9a57d', a: clamp(e) });
    ctx.fillStyle = col.gold; ctx.beginPath(); ctx.arc(head[0], head[1], 10 * u, 0, 7); ctx.fill();
    text('SET BY THE COMPANY · STEPS ILLUSTRATIVE', W * .5, H * .92, { size: 24 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#b9a57d', a: p('ninety', .6) }); });
}
