/* @effect document_verdict_stamps
   @does: the opening document returns; each clause is highlighted on its word and gets what really happened stamped beside it
   @params: —
   @uses: onecoin_art_recruit_call (swap these ids for the new episode's own)
   @tags: callback,document,verdict,ending,stamps
   @born: onecoin a6: Take the money. Run. Blame someone else. She wrote it in 2014.
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, line, ease, lerp, clamp, col, ctx }) => {
  // the 2014 email returns; each clause of option one gets what actually happened stamped beside it
  layer(1, () => { draw(img('onecoin_art_recruit_call'), W * .5, H * .5, H * 1.08, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.5)'; ctx.fillRect(0, 0, W, H); });
  const s = spring('c1', { stiff: 120, damp: 13 }), x = W * .38 + wobble(3, 3 * u), y = lerp(-H * .6, H * .48, s);
  layer(2, () => { ctx.save(); ctx.translate(x, y); ctx.rotate(-.02); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-W * .3 + 14 * u, -H * .36 + 18 * u, W * .6, H * .72);
    ctx.fillStyle = '#efe6d2'; ctx.fillRect(-W * .3, -H * .36, W * .6, H * .72); ctx.fillStyle = '#d9cfb8'; ctx.fillRect(-W * .3, -H * .36, W * .6, 60 * u); ctx.restore();
    text('EMAIL  ·  9 AUGUST 2014  ·  OPTION 1', x - W * .27, y - H * .36 + 32 * u, { size: 26 * u, font: 'cond', weight: 700, ls: 4 * u, col: '#5b4d3c', lw: 0, align: 'left' });
    const cl = [['Take the money', 'Take', '> $4 BILLION'], ['and run', 'Run', 'ATHENS · 2017'], ['and blame someone else', 'Blame', 'OTHERS: 20 + 10 + 5 + 4 YRS']];
    cl.forEach(([s2, key, out], i) => { const yy = y - H * .16 + i * H * .17, k = p(key, .45, 'inOut'), st = spring(at(key) + .25, { stiff: 200, damp: 12 });
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(214,170,60,.85)'; ctx.fillRect(x - W * .27 - 6 * u, yy - 34 * u, W * .3 * k, 62 * u); ctx.restore();
      text(s2, x - W * .27, yy, { size: 52 * u, font: 'serif', weight: 900, col: '#1d1712', lw: 0, align: 'left' });
      ctx.save(); ctx.translate(x + W * .14, yy); ctx.rotate(-.08); ctx.scale(lerp(1.6, 1, clamp(st)), lerp(1.6, 1, clamp(st))); ctx.globalAlpha = clamp(st * 2);
      ctx.strokeStyle = '#8f1d1d'; ctx.lineWidth = 4 * u; ctx.strokeRect(-W * .1, -30 * u, W * .2, 60 * u); ctx.restore();
      text(out, x + W * .14, yy + 2 * u, { size: 30 * u, font: 'impact', col: '#8f1d1d', lw: 0, rot: -.08, a: clamp(st * 2) }); });
    text('she wrote it in 2014', x, y + H * .3, { size: 30 * u, font: 'serif', col: '#5b4d3c', lw: 0, a: p('wrote', .6) }); });
  air('dust', { dens: .5 });
}
