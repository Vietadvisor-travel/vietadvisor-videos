/* @effect callback_cuts
   @does: a closing summary told in hard cuts back to pictures the film already built, each cut on its word and each still moving: a shop wall whose lights come on, a shelf that goes dark, a shelf row that fills, a row that slides halfway back, a row that slides out again
   @params: cuts (pic^word^mode^label~…; mode light|dark|fillb|halfa|outa), a, b
   @uses: the plates of the earlier beats being recalled + two shoe cut-outs for the shelf modes
   @tags: recap,callback,summary,cuts,shelf,ending,bookend
   @born: nike-vs-adidas a6: remember that shelf from 1985 … the one still standing
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const C = (P.cuts || '').split('~').filter(Boolean).map(s => s.split('^')), st = C.map(c => c[1] === '0' ? 0 : at(c[1])); let i = 0; for (let j = 0; j < C.length; j++) if (t >= st[j] - .05) i = j;
  const [pic, , mode, lab] = C[i] || [], T = t - st[i], nx = i + 1 < C.length ? st[i + 1] : dur, kk = clamp(T / Math.max(.5, nx - st[i])), A = img(P.a), Bm = img(P.b), bg = clip(pic, 0, 1) || img(pic);
  if (bg) cover(bg, { z: 1.1 + .12 * kk, ox: (i % 2 ? 1 : -1) * (kk - .5) * .1, filter: mode === 'dark' ? 'brightness(.8)' : mode === 'light' ? `brightness(${lerp(.3, .85, clamp(T / 1.2))}) sepia(.2)` : 'brightness(.42)' });
  if (mode === 'light') { for (let r = 0; r < 3; r++) { const kr = clamp((T - r * .3) / .4), y = H * (.25 + r * .22); const g = ctx.createLinearGradient(0, y - 80 * u, 0, y + 80 * u); g.addColorStop(0, 'rgba(255,214,150,0)'); g.addColorStop(.5, `rgba(255,214,150,${.32 * kr})`); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - 80 * u, W, 160 * u); } }
  if (mode === 'dark') { [.25, .5, .75].forEach((y, r) => { const kr = clamp((T - r * .3) / .4); ctx.fillStyle = `rgba(14,13,12,${.8 * kr})`; ctx.fillRect(0, H * (y - .125), W, H * .25); ctx.fillStyle = `rgba(196,170,132,${kr})`; ctx.fillRect(W * .05, H * (y + .08), W * .9, 10 * u); }); }
  if (/fillb|halfa|outa/.test(mode)) { const rows = [H * .36, H * .6], sw = W * .14; ctx.fillStyle = 'rgba(40,34,30,.9)'; ctx.fillRect(W * .04, H * .2, W * .92, H * .56); ctx.fillStyle = 'rgba(240,236,228,.9)'; rows.forEach(y => ctx.fillRect(W * .06, y + 34 * u, W * .88, 10 * u));
    const kb = mode === 'fillb' ? clamp(p(st[i], .9, 'out')) : 1, ka = mode === 'halfa' ? .5 * clamp(p(st[i], 1.0, 'inOut')) : mode === 'outa' ? .5 * (1 - clamp(p(st[i], .9, 'in'))) : 0;
    for (let c = 0; c < 6; c++) { const x = W * .12 + c * W * .145; if (Bm) { const xx = x + (1 - kb) * W * 1.2 + c * (1 - kb) * 40 * u, h = sw * Bm.height / Bm.width; ctx.drawImage(Bm, xx - sw / 2, rows[1] + 34 * u - h, sw, h); }
      if (A && ka > 0 && c < 3) { const xx = x - (1 - ka * 2) * W * .6, h = sw * A.height / A.width; ctx.drawImage(A, xx - sw / 2, rows[0] + 34 * u - h, sw, h); } } }
  if (lab) text(lab, W / 2, H * .12, { size: 60 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a: clamp(T / .3) });
  ctx.restore();
}
