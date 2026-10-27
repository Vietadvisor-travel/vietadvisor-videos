/* @effect two_accounts
   @does: the frame splits down a paper spine into two accounts, a picture in each half; a value types into each account on its word and the side that loses drains to grey
   @params: crack (word: the spine splits wide and the company half drops), in, out, open, win, wat
   @uses: — (swap these ids for the new episode's own)
   @tags: ledger,split-screen,comparison,two-sides,motif,money
   @born: wework a0-08: we'll keep two accounts side by side
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // the film's ledger: one frame split down a paper spine into two accounts, the company's (left) and the founder's (right).
  // Each half carries its own picture (photo or footage); a value types into each account on its word; on `wat` the side
  // that did NOT win (`win`: l | r) drains to grey and dims. params: l, r, lt, rt, lv, rv, ls, rs, lat, rat, win, wat, open, in, out
  const pic = id => id ? (clip(id, 0, 1) || img(id)) : null;
  const fit = (im, x, y, w, h, z, f) => { if (!im || !im.width || w < 1) return; const s = Math.max(w / im.width, h / im.height) * z; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); if (f) ctx.filter = f; ctx.drawImage(im, x + w / 2 - im.width * s / 2, y + h / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); };
  const typed = (s, w) => { s = String(s || ''); if (!w) return s; const k = clamp((t - at(w)) / Math.max(.35, s.length * .045)); return s.slice(0, Math.round(k * s.length)); };
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#0d0c0b'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const crack = P.crack ? clamp(p(P.crack, .8, 'inOut')) : 0, open = P.open === 'no' ? 1 : clamp(p(P.open || 0, .75, 'out5')), g = (8 + 70 * crack) * u, half = W / 2 - g / 2, win = P.win ? clamp(p(P.wat || 0, .7, 'inOut')) : 0;
  [['l', W / 2 - g / 2], ['r', W / 2 + g / 2]].forEach(([s, edge]) => { const dy = s === 'l' ? crack * H * .06 : 0; ctx.save(); ctx.translate(0, dy);
    const w = half * open, x = s === 'l' ? edge - w : edge, lose = P.win && P.win !== s ? win : 0, gain = P.win === s ? win : 0;
    fit(pic(P[s]), x, 0, w, H, 1.03 + .035 * clamp(t / dur) + .04 * gain, `grayscale(${(.1 + .9 * lose).toFixed(2)}) brightness(${(1 - .5 * lose + .06 * gain).toFixed(2)})`);
    const gb = ctx.createLinearGradient(0, H * .4, 0, H); gb.addColorStop(0, 'rgba(8,7,6,0)'); gb.addColorStop(1, 'rgba(8,7,6,.82)'); ctx.fillStyle = gb; ctx.fillRect(x, 0, w, H);
    const gt = ctx.createLinearGradient(0, 0, 0, H * .3); gt.addColorStop(0, 'rgba(8,7,6,.7)'); gt.addColorStop(1, 'rgba(8,7,6,0)'); ctx.fillStyle = gt; ctx.fillRect(x, 0, w, H * .3);
    const cx = s === 'l' ? W * .25 : W * .75, a = clamp((open - .6) / .4);
    text(P[s + 't'] || '', cx, H * .11, { size: 44 * u, font: 'cond', col: '#e9dfca', lw: 0, ls: 6 * u, a });
    const v = typed(P[s + 'v'], P[s + 'at']); setFont(118 * u, 'impact'); const vz = Math.min(118 * u, 118 * u * W * .42 / Math.max(1, ctx.measureText(String(P[s + 'v'] || '')).width)); if (v) text(v, cx, H * .66, { size: vz, font: 'impact', col: gain ? '#f2c14e' : '#f4efe4', lw: 0, a: a * (1 - .45 * lose) });
    if (P[s + 's'] && P[s + 'v'] && v.length === String(P[s + 'v']).length) text(P[s + 's'], cx, H * .77, { size: 40 * u, font: 'cond', col: '#cfc3ab', lw: 0, a: a * (1 - .4 * lose) });
    ctx.restore(); });
  ctx.fillStyle = '#efe6d2'; ctx.fillRect(W / 2 - 2 * u, 0, 4 * u, H * clamp(p(P.open === 'no' ? 0 : (P.open || 0), .45, 'out5')));
  ctx.restore();
}
