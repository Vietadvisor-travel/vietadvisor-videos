/* @effect brick_digits
   @does: a number is built out of plastic bricks that rain down and click into a 5x7 grid, digit by digit, over dim footage; a label sets under it once the last brick lands
   @params: bg, num, go, col, lab, sub, in, out
   @uses: lego_cut_brick_* + any clip or photo
   @tags: number,loss,brick,build,figure,count
   @born: lego a3-03: LEGO lost 935 million kroner
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); { const _c = clamp(t / Math.max(1, dur)), _s = 1.01 + .06 * _c * _c * (3 - 2 * _c); ctx.translate(W / 2, H / 2); ctx.scale(_s, _s); ctx.translate(-W / 2 + (_c - .5) * -W * .03, -H / 2); }
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .1 * k, filter: 'brightness(.32) blur(2px)' });
  const F = { '0': '01110100011001110101110011000101110', '1': '00100011000010000100001000010001110', '2': '01110100010000100010001000100011111', '3': '11110000010000101110000010000111110', '4': '00010001100101010010111110001000010', '5': '11111100001111000001000011000101110', '6': '00110010001000011110100011000101110', '7': '11111000010001000100010000100001000', '8': '01110100011000101110100011000101110', '9': '01110100011000101111000010001001100' };
  const s = String(P.num || '0'), cols = []; for (const ch of s) { if (ch === ',') cols.push({ w: 2, g: '00000000000110' }); else if (ch === '-' || ch === '−') cols.push({ w: 4, g: '0000000000001111000000000000' }); else if (F[ch]) cols.push({ w: 5, g: F[ch] }); }
  const totalW = cols.reduce((a, c) => a + c.w + 1, -1), cw = Math.min(W * .84 / totalW, H * .5 / 7), x0 = W / 2 - totalW * cw / 2, y0 = H * .4 - 3.5 * cw, t0 = at(P.go || 0), r = rng(3), C = { red: ['#c8281e', '#e5483b', '#8f1810'], yellow: ['#f2c11b', '#ffd94a', '#b88d00'], blue: ['#1f5fbf', '#3c7ee0', '#123c80'], white: ['#e9e6df', '#ffffff', '#a9a59c'] }[P.col || 'red'] || ['#c8281e', '#e5483b', '#8f1810'];
  let ox = 0, idx = 0; cols.forEach(c => { for (let rr = 6; rr >= 0; rr--) for (let cc = 0; cc < c.w; cc++) { if (c.g[rr * c.w + cc] !== '1') continue; const st = t0 + idx * .01 + (6 - rr) * .05 + r() * .06; idx++; if (t < st) continue; const kk = clamp((t - st) / .28), x = x0 + (ox + cc) * cw, y = y0 + rr * cw - (1 - kk * kk) * H * .6, g = cw * .04;
    ctx.fillStyle = C[2]; ctx.fillRect(x + g, y + g, cw - 2 * g, cw - 2 * g); ctx.fillStyle = C[0]; ctx.fillRect(x + g, y + g, cw - 2 * g - cw * .05, cw - 2 * g - cw * .05);
    ctx.beginPath(); ctx.arc(x + cw * .5 + cw * .04, y + cw * .5 + cw * .04, cw * .3, 0, 6.29); ctx.fillStyle = C[2]; ctx.fill(); ctx.beginPath(); ctx.arc(x + cw * .5, y + cw * .5, cw * .3, 0, 6.29); ctx.fillStyle = C[1]; ctx.fill(); } ox += c.w + 1; });
  const la = clamp(p(t0 + 1.4, .4)); if (P.lab) text(P.lab, W / 2, y0 + 7 * cw + 70 * u, { size: 56 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: la }); if (P.sub) text(P.sub, W / 2, y0 + 7 * cw + 125 * u, { size: 30 * u, font: 'cond', col: '#cfc3ad', lw: 0, a: la });
  ctx.restore();
}
