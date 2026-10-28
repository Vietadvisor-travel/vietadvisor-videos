/* @effect word_join
   @does: two words slide in from both sides over a real picture; on the word the letters that are not kept drop out of the line and the rest close up into one name
   @params: bg, a, b, keep, go, gloss, in, out
   @uses: any photo or clip as bg
   @tags: name,etymology,words,letters,brand,origin
   @born: lego a1-03: leg godt, play well
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // a, b: the two words; keep: indices (in the joined letters of a+b) that stay, e.g. 0,1,2,3,4 for LEG+GO; gloss: the meaning under
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.08 + .14 * clamp(t / Math.max(1, dur)), ox: (clamp(t / dur) - .5) * -.05, filter: 'brightness(.45)' });
  const A = P.a || 'LEG', B = P.b || 'GODT', L = (A + ' ' + B).split(''), keep = (P.keep || '0,1,2,4,5').split(',').map(Number), sz = 190 * u, cw = sz * .62;
  const ki = clamp(p(.1, .7)), kj = clamp(p(P.go || 0, .7, 'inOut')); let kept = 0; const nk = keep.length;
  L.forEach((c, i) => { if (c === ' ') return; const isA = i < A.length, x0 = W / 2 + (i - (L.length - 1) / 2) * cw + (isA ? -1 : 1) * (1 - ki) * W * .5, on = keep.includes(i);
    let x = x0, y = H * .45, a = 1; if (on) { const xi = W / 2 + (keep.indexOf(i) - (nk - 1) / 2) * cw * .92; x = lerp(x0, xi, kj); } else { y += kj * kj * H * .5; a = 1 - kj; }
    text(c, x, y, { size: sz, font: 'impact', col: on && kj > .9 ? '#f2c14e' : '#f3ecdc', lw: 0, a }); });
  if (P.gloss) text(P.gloss, W / 2, H * .66, { size: 56 * u, font: 'serif', col: '#efe4cf', lw: 0, a: clamp(p(at(P.go || 0) + .5, .5)) });
  ctx.restore();
}
