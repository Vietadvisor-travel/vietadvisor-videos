/* @effect tear_reveal
   @does: the whole picture tears in two like paper with fibrous edges, revealing footage beneath
   @params: a, b, go
   @uses: — (swap these ids for the new episode's own)
   @tags: transition,paper,tear,footage,collapse
   @born: demo-kit (fx kit showcase)
*/
({ t, at, p, W, H, u, img, clip, ctx, params, clamp, draw, grab, tear, cover }) => {
  // the whole picture (a still with a slow push) tears in two like paper on the word, revealing footage underneath.
  // params: a (image id), b (clip id), go
  cover(img(params.a), { z: 1.05 + .05 * clamp(t / 6) }); const A = grab('tearA');
  const im = clip(params.b, 0, 1); if (im) { const s = Math.max(W / im.width, H / im.height) * 1.04; ctx.drawImage(im, W / 2 - im.width * s / 2, H / 2 - im.height * s / 2, im.width * s, im.height * s); }
  tear(A, clamp(p(params.go, 1.3, 'inOut')), { seed: 5, ang: .1, gap: .7, curl: .14 });
}
