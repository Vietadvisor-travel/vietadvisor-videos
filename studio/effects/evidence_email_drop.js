/* @effect evidence_email_drop
   @does: a real email printed as evidence drops onto a dark desk with a spring; header lines stagger in; the key phrase gets a gold marker on its spoken word; the next lines are redacted bars
   @params: —
   @uses: onecoin_art_recruit_call (swap these ids for the new episode's own)
   @tags: document,email,evidence,quote,reveal,desk
   @born: onecoin a0: An email from August 2014, listing her exit strategy
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, line, ease, lerp, clamp, col, ctx }) => {
  // the 2014 email lands on a dark desk like evidence; the words EXIT STRATEGY get a gold marker on the spoken word
  layer(1, () => { draw(img('onecoin_art_recruit_call'), W * .5, H * .5, H * 1.08, { a: .42 }); ctx.fillStyle = 'rgba(8,6,4,.45)'; ctx.fillRect(0, 0, W, H); });
  const s = spring('email', { stiff: 120, damp: 13 }), x = W * .5 + wobble(3, 4 * u), y = lerp(-H * .6, H * .47, s);
  layer(2, () => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(-.2, -.025, s));
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-W * .3 + 14 * u, -H * .36 + 18 * u, W * .6, H * .72);
    ctx.fillStyle = '#f3ecdc'; ctx.fillRect(-W * .3, -H * .36, W * .6, H * .72);
    ctx.fillStyle = '#d9cfb8'; ctx.fillRect(-W * .3, -H * .36, W * .6, 64 * u);
    ctx.restore();
    const L = (s2, dx, dy, o = {}) => text(s2, x + dx, y + dy, Object.assign({ size: 30 * u, font: 'cond', col: '#2a2420', lw: 0, align: 'left' }, o));
    L('EMAIL  ·  9 AUGUST 2014', -W * .27, -H * .36 + 34 * u, { size: 28 * u, weight: 700, ls: 4 * u, col: '#5b4d3c' });
    L('From: Ruja Ignatova', -W * .27, -H * .22, { a: stagger(0, 3, 'email', .5) });
    L('To: Karl Sebastian Greenwood', -W * .27, -H * .16, { a: stagger(1, 3, 'email', .5) });
    L('As quoted by the U.S. Department of Justice', -W * .27, -H * .10, { size: 24 * u, col: '#7a6a55', a: stagger(2, 3, 'email', .5) });
    const hk = p('strategy', .5, 'inOut');
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(214,170,60,.85)'; ctx.fillRect(x - W * .27 - 8 * u, y - H * .015 - 34 * u, 480 * u * hk, 62 * u); ctx.restore();
    L('"EXIT STRATEGY"', -W * .27, -H * .015, { size: 58 * u, font: 'serif', weight: 900, col: '#1d1712' });
    L('Option 1:', -W * .27, H * .1, { size: 34 * u, font: 'serif', weight: 700, col: '#1d1712', a: p('strategy', .4) });
    ctx.fillStyle = '#16120e'; [0, 1].forEach(i => ctx.fillRect(x - W * .27, y + H * (.16 + i * .075), W * (.5 - i * .14) * p('strategy', .7, 'out5'), 34 * u));
  });
  air('dust', { dens: .7 });
}
