/* @effect burn_away
   @does: a photo burns away from a point with a glowing charred edge, revealing the next picture
   @params: a, b, go
   @uses: — (swap these ids for the new episode's own)
   @tags: transition,fire,burn,money,loss
   @born: demo-kit (fx kit showcase)
*/
({ t, at, p, W, H, u, img, ctx, params, clamp, draw, grab, burn, cover }) => {
  // a photo burns away from a point with a glowing, charred edge, revealing the next picture beneath. params: a, b, go
  cover(img(params.a), { z: 1.04 + .03 * clamp(t / 6) }); const A = grab('burnA');
  cover(img(params.b), { z: 1.04 }); burn(A, clamp(p(params.go, 2.4, 'inOut')), { seed: 8, cx: .5, cy: .6 });
}
