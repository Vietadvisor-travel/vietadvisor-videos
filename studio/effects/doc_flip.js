/* @effect doc_flip
   @does: a real document flies in from deep space turning over in 3D (paper back first), lands with a shadow, a highlighter runs across one line
   @params: doc, land, bg, mark, line
   @uses: — (swap these ids for the new episode's own)
   @tags: document,3d,card,evidence,highlight
   @born: demo-kit (fx kit showcase)
*/
({ t, at, p, spring, W, H, u, img, ctx, params, clamp, lerp, card, draw }) => {
  // a real document arrives from deep space, turning over in 3D (its paper back first), and lands flat with a shadow;
  // then a highlighter runs across one line on the word. params: doc, bg, land, mark, line (0..1 height on the page)
  const c = img(params.doc); const k = clamp(spring(params.land, { stiff: 70, damp: 15 }), 0, 1.04);
  ctx.save(); ctx.filter = 'blur(8px) brightness(.4)'; draw(img(params.bg), W / 2, H / 2, H * 1.15); ctx.restore();
  if (!c || t < at(params.land) - .05) return; const w = W * .5, h = w * c.height / c.width;
  card(c, { x: W / 2, y: H * .47, w, h, ry: (1 - k) * Math.PI * 1.15, rx: (1 - k) * .6, rz: -.03 * k, z: (1 - k) * 2600 * u, shadow: k > .3, shade: true, back: '#d8cdb6' });
  const m = clamp(p(params.mark, .7, 'inOut')); if (m > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(250,215,60,.75)'; const y = H * .47 - h / 2 + h * (+params.line || .4); ctx.fillRect(W / 2 - w * .44, y - h * .035, w * .88 * m, h * .07); ctx.restore(); }
}
