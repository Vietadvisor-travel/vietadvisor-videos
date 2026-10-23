/* @effect reel
   @does: footage as the hero picture: a camera move with intent, an optional speed ramp and freeze on words, a grade that changes on a word, one optional label set in the world, and doctrine seams in and out
   @params: clip, from, move, z, slow, freeze, mono, grade, under, ua, txt, tx, ty, tsize, tat, tfont, tcol, sub, in, out, ink
   @uses: any clip id
   @tags: footage, hero, camera, speed-ramp, freeze, seam, workhorse
   @born: onecoin v2 (all acts)
*/
({ t, at, p, W, H, u, clip, img, ctx, params: P, clamp, lerp, text, seam, cover, blob, dur }) => {
  // move: in | out | left | right | up | down | none — the camera's single intent for the shot; z = strength (default .08)
  const z = +(P.z || .08), k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k), mv = P.move || 'in';
  const ts = P.slow ? at(P.slow) : 1e9, tf = P.freeze ? at(P.freeze) : 1e9;
  const eff = t < ts ? t : t < tf ? ts + (t - ts) * lerp(1, .2, clamp((t - ts) / .4)) : ts + Math.max(0, (Math.min(t, tf) - ts)) * .45;
  const im = clip(P.clip, t - eff - (+P.from || 0), 1); ctx.save(); seam(P.in || 'none', P.out || 'none');
  const sc = mv === 'in' ? 1.03 + z * e : mv === 'out' ? 1.03 + z * (1 - e) : 1.06 + z * .3, ox = mv === 'left' ? (e - .5) * -z * .6 : mv === 'right' ? (e - .5) * z * .6 : 0, oy = mv === 'up' ? (e - .5) * -z * .5 : mv === 'down' ? (e - .5) * z * .5 : 0;
  const mono = P.mono ? clamp(p(P.mono, .5, 'inOut')) : P.grade === 'mono' ? 1 : 0, warm = P.grade === 'warm', cold = P.grade === 'cold';
  let f = `grayscale(${mono.toFixed(2)})`; if (warm) f += ' sepia(.25) saturate(1.1)'; if (cold) f += ' saturate(.7) hue-rotate(-12deg)'; if (t >= tf) f += ` contrast(${(1 + .15 * clamp((t - tf) / .3)).toFixed(2)})`;
  if (P.ink) { const r = lerp(0, W * .8, clamp(p(P.ink === '1' ? 0 : P.ink, 1.6, 'out'))); ctx.fillStyle = '#070605'; ctx.fillRect(0, 0, W, H); blob(W / 2, H / 2, r, { seed: 6, wob: .28, flow: 1 }); ctx.clip(); }
  if (P.under) { cover(img(P.under), { z: sc * 1.02, ox: ox * .5, oy: oy * .5, filter: 'brightness(.8)' }); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = +(P.ua || .6); }
  if (im) cover(im, { z: sc, ox, oy, filter: f }); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.restore();
  if (P.txt) { const a = clamp(p(P.tat || 0, .35, 'out')); if (a > 0) { const yy = (+P.ty || .2) * H, sg = ctx.createLinearGradient(0, yy - H * .2, 0, yy + H * .2); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(.5, `rgba(6,5,4,${.55 * a})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(0, yy - H * .2, W, H * .4); const bl = (1 - a) * 6; ctx.save(); if (bl > .3) ctx.filter = `blur(${bl * u}px)`; ctx.globalAlpha = a;
    text(P.txt, (+P.tx || .5) * W, (+P.ty || .2) * H, { size: (+P.tsize || 64) * u, font: P.tfont || 'cond', col: P.tcol || '#f3ecdc', lw: 0, ls: 4 * u });
    if (P.sub) text(P.sub, (+P.tx || .5) * W, (+P.ty || .2) * H + (+P.tsize || 64) * 1.0 * u, { size: 50 * u, font: 'serif', col: '#e6dccb', lw: 0 }); ctx.restore(); } }
}
