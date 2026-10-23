/* @effect burn_away
   @does: a photo burns away from a point with a glowing charred edge, revealing the next picture
   @params: a, b, go
   @uses: — (swap these ids for the new episode's own)
   @tags: transition,fire,burn,money,loss
   @born: demo-kit (fx kit showcase)
*/
({ t, at, p, W, H, u, img, ctx, params, clamp, draw, grab, burn, cover, text }) => {
  // a photo burns away from a point with a glowing, charred edge, revealing the next picture beneath. params: a, b, go
  cover(img(params.a), { z: 1.04 + .03 * clamp(t / 6) }); const A = grab('burnA');
  cover(img(params.b), { z: 1.04 }); burn(A, clamp(p(params.go, 2.4, 'inOut')), { seed: 8, cx: .5, cy: .6 });
  if (params.txt) { const a = clamp(p(params.tat || params.go, .4, 'out')), yy = H * .42, sg = ctx.createLinearGradient(0, yy - H * .2, 0, yy + H * .2); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(.5, `rgba(6,5,4,${.6 * a})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(0, yy - H * .2, W, H * .4);
    ctx.save(); ctx.globalAlpha = a; text(params.txt, W / 2, yy, { size: 62 * u, font: 'serif', col: '#f3ecdc', lw: 0 }); if (params.sub) text(params.sub, W / 2, yy + 64 * u, { size: 46 * u, font: 'serif', col: '#e6dccb', lw: 0 }); ctx.restore(); }
}
