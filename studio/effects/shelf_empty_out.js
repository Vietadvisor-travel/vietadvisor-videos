/* @effect shelf_empty_out
   @does: a real store wall full of shoes; on the word the shelves empty row by row from the top, the lights going out with them, until only bare shelves are left, and one word sets in the dark
   @params: pic, rows, go, word, in, out
   @uses: any store or shelf photo
   @tags: empty,shelf,absence,withdrawal,stores,loss
   @born: nike-vs-adidas a3-05: the margin was higher, but the shelf was gone
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .1 * k, ox: (k - .5) * .1, filter: 'brightness(.8)' });
  const R = (P.rows || '.25~.45~.65~.85').split('~').map(Number), t0 = at(P.go || 0); R.forEach((y, i) => { const kk = clamp((t - t0 - i * .3) / .4); if (kk <= 0) return; const y0 = (i ? (R[i - 1] + y) / 2 : 0) * H, y1 = (i < R.length - 1 ? (y + R[i + 1]) / 2 : 1) * H; ctx.fillStyle = `rgba(8,9,12,${(.86 * kk).toFixed(2)})`; ctx.fillRect(0, y0, W, y1 - y0); ctx.fillStyle = `rgba(90,94,104,${kk})`; ctx.fillRect(W * .05, y * H, W * .9, 6 * u); });
  if (P.word) text(P.word, W / 2, H * .5, { size: 110 * u, font: 'impact', col: '#ff6b5e', lw: 0, ls: 10 * u, a: clamp(p(t0 + R.length * .3, .4)) });
  ctx.restore();
}
