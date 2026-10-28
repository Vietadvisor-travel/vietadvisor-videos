/* @effect three_windows
   @does: three empty dark frames hang in a row; on each named word real footage opens inside one of them like a window lighting up, its name under it; after the last, a counter over each window spins and never settles, a question mark where the number should be
   @params: wins, go, lab, in, out
   wins: id^LABEL^word~…
   @uses: any clips
   @tags: future,intangible,uncountable,new-products,games,films
   @born: lego a6-12: its newest pieces are games, films and promises about carbon, and none of them comes in a box you can count
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); { const _c = clamp(t / Math.max(1, dur)), _s = 1.01 + .06 * _c * _c * (3 - 2 * _c); ctx.translate(W / 2, H / 2); ctx.scale(_s, _s); ctx.translate(-W / 2 + (_c - .5) * -W * .05, -H / 2); } ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const Wn = (P.wins || '').split('~').filter(Boolean).map(s => s.split('^')), fw = W * .27, fh = fw * .7, gap = W * .04, x0 = W / 2 - (Wn.length * fw + (Wn.length - 1) * gap) / 2, cy = H * .48, k = clamp(t / Math.max(1, dur));
  let last = 0; Wn.forEach(([id, lab, w], i) => { const x = x0 + i * (fw + gap), st = at(w), ko = clamp(p(st, .5, 'out')); last = Math.max(last, st); ctx.fillStyle = '#1d1a16'; ctx.fillRect(x - 8 * u, cy - fh / 2 - 8 * u, fw + 16 * u, fh + 16 * u);
    const im = clip(id, 0, 1) || img(id); if (im) { const ka = .22 + .78 * ko; const s = Math.max(fw / im.width, fh / im.height) * (1.05 + .05 * k); ctx.save(); ctx.globalAlpha = ka; ctx.filter = ko < 1 ? `grayscale(${1 - ko})` : 'none'; ctx.beginPath(); ctx.rect(x, cy - fh / 2, fw, fh); ctx.clip(); ctx.drawImage(im, x + fw / 2 - im.width * s / 2, cy - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); }
    if (lab) text(lab, x + fw / 2, cy + fh / 2 + 56 * u, { size: 40 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 5 * u, a: ko }); });
  const kq = clamp(p(last + .6, .4)); if (kq > 0) Wn.forEach((_, i) => { const x = x0 + i * (fw + gap) + fw / 2, r = rng(Math.floor(t * 14) + i * 7), spin = t < last + 1.4; text(spin ? String(Math.floor(r() * 9000 + 1000)) : '?', x, cy - fh / 2 - 60 * u, { size: 70 * u, font: 'impact', col: spin ? 'rgba(242,193,78,.6)' : '#f2c14e', lw: 0, a: kq }); });
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 44 * u, font: 'cond', col: '#d9cdb8', lw: 0, ls: 5 * u, a: kq });
  ctx.restore();
}
