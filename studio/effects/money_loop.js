/* @effect money_loop
   @does: a closed ring of labelled stations drawn over a real picture; arrows draw themselves on their words until the last one closes the loop in gold: a circle with no outsider in it
   @params: in, out, bg, nodes, close
   @uses: — (swap these ids for the new episode's own)
   @tags: loop,circular,mechanism,diagram,reflexive,money
   @born: wework a1-20: a price set by the very investor who was paying for the growth
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a closed loop drawn over a real picture: labelled stations around a ring, joined by arrows that draw themselves on their
  // words, so the viewer sees money and price chasing each other in a circle with no outsider in it. params: bg, nodes
  // (label@word ~ …, clockwise from the top), close (word: the last arrow back to the start, drawn in the accent), in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.03 + .04 * clamp(t / dur)); ctx.save(); ctx.filter = 'brightness(.42) grayscale(.3)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const N = String(P.nodes).split('~').map(s => { const [l, w] = s.split('@'); return { l, w }; }), n = N.length, cx = W / 2, cy = H * .47, rx = W * .3, ry = H * .3;
  const pos = i => { const a = -Math.PI / 2 + i / n * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; };
  N.forEach((nd, i) => { const j = (i + 1) % n, last = j === 0, w = last ? (P.close || nd.w) : N[j].w, k = clamp(p(w, .7, 'inOut')); if (k <= 0) return;
    const a0 = -Math.PI / 2 + i / n * Math.PI * 2 + .32, a1 = -Math.PI / 2 + (i + 1) / n * Math.PI * 2 - .32, am = lerp(a0, a1, k);
    ctx.save(); ctx.strokeStyle = last ? '#f2c14e' : '#efe6d2'; ctx.lineWidth = (last ? 7 : 5) * u; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, a0, am); ctx.stroke();
    const ex = cx + Math.cos(am) * rx, ey = cy + Math.sin(am) * ry, tx = -Math.sin(am) * rx, ty = Math.cos(am) * ry, tl = Math.hypot(tx, ty), ux = tx / tl, uy = ty / tl;
    ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(ex + ux * 20 * u, ey + uy * 20 * u); ctx.lineTo(ex - ux * 8 * u - uy * 14 * u, ey - uy * 8 * u + ux * 14 * u); ctx.lineTo(ex - ux * 8 * u + uy * 14 * u, ey - uy * 8 * u - ux * 14 * u); ctx.fill(); ctx.restore(); });
  N.forEach((nd, i) => { const a = clamp(p(nd.w || 0, .45, 'out5')); if (a <= 0) return; const [x, y] = pos(i); setFont(56 * u, 'cond'); const tw = ctx.measureText(nd.l).width + 56 * u;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = i === 0 ? '#f2c14e' : 'rgba(18,17,15,.9)'; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 44 * u, tw, 88 * u, 44 * u); ctx.fill(); ctx.restore();
    text(nd.l, x, y, { size: 56 * u, font: 'cond', col: i === 0 ? '#1a1408' : '#f4efe4', lw: 0, ls: 3 * u, a }); });
  ctx.restore();
}
