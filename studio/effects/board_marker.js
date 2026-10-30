/* @effect board_marker
   @does: a quiet room is framed on its blank whiteboard; on each named word a marker writes one line on the board, left to right, the camera easing in; a small source note is written in the corner
   @params: pic, bx, by, bw, lines, src, ink, in, out
   lines: TEXT^word~… ; bx,by = board centre in the image (fractions), bw = board width in the image (fraction)
   @uses: any photo with a board or wall to write on
   @tags: meeting,date,who,record,whiteboard,handwriting
   @born: lego a3-11: on 30 November 2004 bankers from Morgan Stanley met Kjeld
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const im = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)), _e = clamp(t / 3.2), dx = (1 - _e * _e * (3 - 2 * _e)) * W * .42 + (k - .5) * -W * .05, bx = +(P.bx || .5), by = +(P.by || .45), bw = +(P.bw || .4);
  if (im) { const s = W * .74 / (bw * im.width) * (1.12 - .1 * _e), x = W / 2 - bx * im.width * s + dx, y = H * .44 - by * im.height * s; ctx.filter = `brightness(${P.dim || .85})`; ctx.drawImage(im, x, y, im.width * s, im.height * s); ctx.filter = 'none'; }
  const g = ctx.createRadialGradient(W / 2, H * .44, H * .3, W / 2, H * .5, H * .9); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const L = (P.lines || '').split('~').filter(Boolean).map(s => s.split('^')), n = L.length;
  L.forEach(([s, w], i) => { const st = at(w), kk = clamp((t - st) / Math.max(.5, s.length * .045)); if (kk <= 0) return; const y = H * (.3 + i * .13), sz = (i === 0 ? 88 : 70) * u; ctx.save(); ctx.font = `${sz}px "Patrick Hand", cursive`; const fw = ctx.measureText(s).width * 1.1 + 40 * u; ctx.beginPath(); ctx.rect(W / 2 + dx - fw / 2, y - sz, fw * kk, sz * 2); ctx.clip(); text(s, W / 2 + dx, y, { size: sz, font: 'hand', col: P.ink === 'light' ? (i === 0 ? '#ff8a6a' : '#f2f4f8') : (i === 0 ? '#b3261e' : '#1d2f6a'), lw: 0 }); ctx.restore(); });
  if (P.src) { const st = n ? at(L[n - 1][1]) + .5 : 0; text(P.src, W / 2 + dx, H * .7, { size: 36 * u, font: 'hand', col: P.ink === 'light' ? '#c9ced8' : '#3a3a3a', lw: 0, a: clamp(p(st, .4)) }); }
  ctx.restore();
}
