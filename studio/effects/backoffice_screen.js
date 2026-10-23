/* @effect backoffice_screen
   @does: a glass member back-office screen floating over a plate, in 3 modes: a mining timer that fills then pays out, an admin price field being typed, a balance that only grows
   @params: mode, plate, go, x, title
   @uses: — (swap these ids for the new episode's own)
   @tags: ui,screen,database,fake,timer,balance,price
   @born: onecoin a2: Mining meant a timer / The office in Sofia typed it in / your balance only ever grew
*/
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // the member back office as a glass screen floating over the art: a mining timer, a typed price, a balance that only grows
  const mode = params.mode;
  layer(1, () => { draw(img(params.plate), W * .5, H * .5, H * 1.12, { a: .5 }); ctx.fillStyle = 'rgba(6,5,4,.45)'; ctx.fillRect(0, 0, W, H); });
  const k = spring(params.go || 'c1', { stiff: 120, damp: 14 }), x = W * (params.x || .6), y = H * .46, w = W * .5, h = H * .56;
  layer(2.2, () => {
    ctx.save(); ctx.globalAlpha = clamp(k); ctx.translate(x, y + (1 - k) * 50 * u);
    ctx.fillStyle = 'rgba(14,12,10,.86)'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = 'rgba(201,168,90,.7)'; ctx.lineWidth = 2 * u; ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = 'rgba(201,168,90,.16)'; ctx.fillRect(-w / 2, -h / 2, w, 52 * u); ctx.restore();
    const T = (s, dx, dy, o = {}) => text(s, x + dx, y + dy + (1 - k) * 50 * u, Object.assign({ size: 30 * u, font: 'cond', weight: 700, col: '#efe2c4', lw: 0, align: 'left', a: clamp(k) }, o));
    T(params.title || 'MEMBER BACK OFFICE', -w * .45, -h / 2 + 27 * u, { size: 24 * u, ls: 6 * u, col: col.gold });
    if (mode === 'timer') {
      const s0 = at('timer'), s1 = at('ran'), q = clamp((t - s0) / Math.max(.5, s1 - s0)), left = Math.max(0, Math.ceil(30 * (1 - q)));
      T('TOKENS SUBMITTED FOR MINING', -w * .45, -h * .22, { size: 26 * u, col: '#b9a57d' });
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x - w * .45, y - h * .1, w * .9, 30 * u); ctx.fillStyle = col.gold; ctx.fillRect(x - w * .45, y - h * .1, w * .9 * q, 30 * u);
      T('00:00:' + String(left).padStart(2, '0'), -w * .45, h * .1, { size: 64 * u, font: 'impact' });
      const nk = spring('number', { stiff: 180, damp: 12 }); T('+ ONECOIN', w * .02, h * .1, { size: 56 * u * (.6 + .4 * clamp(nk)), col: col.gold, a: clamp(nk) });
      text('ILLUSTRATION', x + w * .4, y - h / 2 + 27 * u, { size: 18 * u, font: 'cond', weight: 700, col: '#7d6f57', align: 'right', lw: 0, a: clamp(k) }); T('a number, in a row, in a database', -w * .45, h * .34, { size: 24 * u, font: 'serif', weight: 400, col: '#9d8c6c', a: p('account', .6) });
    }
    if (mode === 'typed') {
      T('COIN PRICE (EUR)', -w * .45, -h * .22, { size: 26 * u, col: '#b9a57d' });
      const s = '0.50', n = Math.floor(clamp((t - at('typed') + .2) / .5) * s.length), blink = Math.floor(t * 2.5) % 2;
      ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(x - w * .45, y - h * .12, w * .9, 110 * u);
      T('€ ' + s.slice(0, n) + (blink ? '|' : ' '), -w * .42, -h * .12 + 56 * u, { size: 80 * u, font: 'impact', col: '#ffffff' });
      const ok = p('typed', .3, 'out5'); if (t > at('typed') + .7) T('SAVED. NO MARKET REQUIRED.', -w * .45, h * .28, { size: 28 * u, col: col.gold, a: p(at('typed') + .7, .4) });
    }
    if (mode === 'balance') {
      const g = Math.max(0, t - at('screen')); const v = Math.floor(12000 * Math.pow(1.6, g)), up = Math.sin(t * 6) > 0;
      text('ILLUSTRATION', x + w * .4, y - h / 2 + 27 * u, { size: 18 * u, font: 'cond', weight: 700, col: '#7d6f57', align: 'right', lw: 0, a: clamp(k) }); T('YOUR BALANCE', -w * .45, -h * .22, { size: 26 * u, col: '#b9a57d' });
      T(v.toLocaleString('en-US') + ' ONE', -w * .45, -h * .02, { size: 84 * u, font: 'impact', col: col.gold });
      T('▲ ' + (8 + Math.floor(g * 7)) + '%', -w * .45, h * .2, { size: 44 * u, col: '#8fd18a', a: up ? 1 : .6 });
      T('WITHDRAW', w * .12, h * .3, { size: 26 * u, col: '#5c5244', a: p('grew', .5) });
    }
  });
  air('dust', { dens: .5 });
}
