title: onecoin a2 · take the money
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: ruja=bf_emma
music: auto
captions: off
endcard: off

#! scene package_ladder
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx }) => {
  // the 2016 package ladder as bars made of real euro notes; the top tier shoots out of the frame
  layer(1, () => { draw(img('onecoin_art_gala_table'), W * .5, H * .5, H * 1.12, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(0, 0, W, H); });
  const tiers = [['STARTER', 100], ['TRADER', 500], ['PRO TRADER', 1000], ['EXECUTIVE', 3000], ['TYCOON', 5000], ['PREMIUM', 12500], ['TOP TIER', 118000]];
  const cash = img('onecoin_euro_cash'), base = H * .8, sc = H * .34 / 12500, bw = W * .085;
  layer(2, () => tiers.forEach(([name, v], i) => {
    const x = W * (.12 + i * .125), k = i < 6 ? stagger(i, 6, 'started', 1.3, .7, 'out5') : spring('118,000', { stiff: 60, damp: 11 });
    const h = Math.max(6 * u, v * sc * k), top = base - h;
    ctx.save(); ctx.beginPath(); ctx.rect(x - bw / 2, Math.max(-20 * u, top), bw, base - Math.max(-20 * u, top)); ctx.clip();
    if (cash) { const th = bw * cash.height / cash.width; for (let y = base - th; y > top - th; y -= th * .92) ctx.drawImage(cash, x - bw / 2, y, bw, th); }
    ctx.fillStyle = i === 6 ? 'rgba(201,168,90,.28)' : 'rgba(10,8,6,.22)'; ctx.fillRect(x - bw / 2, top, bw, h); ctx.restore();
    text(name, x, base + 30 * u, { size: 22 * u, font: 'cond', weight: 700, col: '#d8c7a2', ls: 2 * u, a: clamp(k * 3) });
    const lab = '€' + Math.round(v * clamp(k)).toLocaleString('en-US');
    text(lab, x, Math.max(H * .09, top - 26 * u), { size: (i === 6 ? 44 : 30) * u, font: 'cond', weight: 700, col: i === 6 ? col.gold : '#efe2c4', a: clamp(k * 3) });
  }));
  text('ONECOIN PACKAGES · 2016', W * .5, H * .06, { size: 26 * u, font: 'cond', weight: 700, ls: 8 * u, col: '#b9a57d', a: p('Package', .6) });
}
#! end

#! scene back_office
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
#! end

#! scene price_stairs
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, line, ease, lerp, clamp, col, ctx }) => {
  // the coin's internal price: a staircase the company built by hand, from 50 cents to €29.95, never a market line
  layer(1, () => { draw(img('onecoin_hq_office'), W * .2, H * .5, H * 1.05, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const x0 = W * .14, x1 = W * .86, y0 = H * .78, y1 = H * .2, n = 10, k = clamp((t - at('Fifty')) / Math.max(1, at('ninety') - at('Fifty') + .3));
  const pts = []; for (let i = 0; i <= n; i++) { const v = Math.pow(i / n, 1.6); const x = lerp(x0, x1, i / n), y = lerp(y0, y1, v); if (i) pts.push([x, pts[pts.length - 1][1]]); pts.push([x, y]); }
  layer(2, () => { line([[x0, y0], [x1, y0]], { col: 'rgba(239,226,196,.25)', w: 2 }); line(pts, { col: col.gold, w: 6, k });
    const head = pts[Math.min(pts.length - 1, Math.floor(k * (pts.length - 1)))];
    text('€0.50', x0, y0 + 40 * u, { size: 40 * u, font: 'impact', col: '#efe2c4', a: p('Fifty', .4) }); text('2014', x0, y0 + 80 * u, { size: 24 * u, font: 'cond', col: '#b9a57d', a: p('Fifty', .4) });
    const e = spring('ninety'); text('€29.95', x1 - 40 * u, y1 - 50 * u, { size: 70 * u * (.7 + .3 * clamp(e)), font: 'impact', col: col.gold, a: clamp(e) }); text('JANUARY 2019', x1 - 40 * u, y1 + 6 * u, { size: 24 * u, font: 'cond', col: '#b9a57d', a: clamp(e) });
    ctx.fillStyle = col.gold; ctx.beginPath(); ctx.arc(head[0], head[1], 10 * u, 0, 7); ctx.fill();
    text('SET BY THE COMPANY · STEPS ILLUSTRATIVE', W * .5, H * .92, { size: 24 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#b9a57d', a: p('ninety', .6) }); });
}
#! end

#! scene difficulty
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ease, lerp, clamp, col, ctx, rng }) => {
  // one coin on the left; the pile of tokens it costs on the right grows from 44 to 359 as the narrator says "rose"
  layer(1, () => { draw(img('onecoin_art_split_champagne'), W * .5, H * .5, H * 1.12, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const r = p('rose', 1.8, 'inOut'), n = Math.round(lerp(44, 359, r));
  layer(2, () => { draw(img('onecoin_el_gold_coin'), W * .2, H * .46, H * .4); text('1 COIN', W * .2, H * .7, { size: 44 * u, font: 'impact', col: col.gold });
    text('=', W * .35, H * .46, { size: 110 * u, font: 'impact', col: '#efe2c4' });
    for (let i = 0; i < n; i++) { const c = i % 24, row = Math.floor(i / 24), R = rng(i + 3); const x = W * (.43 + c * .021), y = H * (.12 + row * .034);
      ctx.fillStyle = i < 44 ? '#efe2c4' : col.gold; ctx.globalAlpha = i < 44 ? .9 : clamp((r * 359 - i) / 20) * .9; ctx.beginPath(); ctx.arc(x, y, 7 * u, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1; text(n + ' TOKENS', W * .68, H * .74, { size: 64 * u, font: 'impact', col: n > 44 ? col.gold : '#efe2c4' });
    text('"MINING DIFFICULTY"', W * .68, H * .82, { size: 24 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#b9a57d', a: p('difficulty', .5) }); });
}
#! end

#! scene bonus_split
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, ease, lerp, clamp, col, ctx }) => {
  // a real stack of euro notes is cut 60/40: the 60 comes to you, the 40 slides into a vault that shuts
  layer(1, () => { draw(img('onecoin_art_vault_glow'), W * .5, H * .5, H * 1.1, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const cash = img('onecoin_euro_cut'); if (!cash) return; const ch = H * .56, cw = ch * cash.width / cash.height, cx = W * .44, cy = H * .45;
  const a = spring('Sixty', { stiff: 140, damp: 14 }), b = spring('locked', { stiff: 90, damp: 12 }), cut = cw * .6;
  layer(2, () => {
    ctx.save(); ctx.translate(-a * W * .05, 0); ctx.drawImage(cash, 0, 0, cash.width * .6, cash.height, cx - cw / 2, cy - ch / 2, cut, ch); ctx.restore();
    text('60% CASH', cx - cw / 2 + cut / 2 - a * W * .05, cy + ch / 2 + 46 * u, { size: 48 * u, font: 'impact', col: '#efe2c4', a: clamp(a) });
    const dx = b * W * .26; ctx.save(); ctx.translate(dx, 0); ctx.drawImage(cash, cash.width * .6, 0, cash.width * .4, cash.height, cx - cw / 2 + cut + 10 * u, cy - ch / 2, cw - cut, ch); ctx.restore();
    text('40% LOCKED', cx + cw / 2 - (cw - cut) / 2 + dx, cy + ch / 2 + 46 * u, { size: 48 * u, font: 'impact', col: col.gold, a: clamp(p('Forty', .4)) });
  });
  layer(2.5, () => { const v = img('onecoin_el_vault_wheel'); if (!v) return; const shut = p('system', .6, 'out5'); draw(v, W * .84, H * .45, H * .48 * (1 + .04 * shut), { a: clamp(b * 1.4) });
    text('"TRADING ACCOUNT"', W * .86, H * .84, { size: 26 * u, font: 'cond', weight: 700, col: '#b9a57d', ls: 4 * u, a: clamp(b) }); });
}
#! end

#! scene bitcoin_quarter
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ease, lerp, clamp, col, ctx, params }) => {
  // all the Bitcoin in the world at the end of 2016 as one real coin; OneCoin's cash take cuts out more than a quarter of it
  layer(1, () => { draw(img('onecoin_art_mood_city'), W * .5, H * .5, H * 1.1, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(0, 0, W, H); });
  const bc = img('onecoin_bitcoin_coins'), cx = W * .38, cy = H * .48, R = H * .34, k = spring(params.go || 'c1', { stiff: 90, damp: 12 });
  layer(2, () => { if (bc) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 7); ctx.clip(); ctx.drawImage(bc, cx - R * 1.32, cy - R * 1.32, R * 2.64, R * 2.64); ctx.restore(); }
    text('ALL BITCOIN · 31 DEC 2016', W * .72, H * .3, { size: 30 * u, font: 'cond', weight: 700, ls: 4 * u, col: '#b9a57d', a: clamp(k) });
    text('≈ $15.5 BILLION', W * .72, H * .39, { size: 48 * u, font: 'impact', col: '#efe2c4', a: p(params.num || 'billion', .5) });
    if (+params.step === 2) { const q = p('quarter', 1.1, 'inOut'), ang = .258 * Math.PI * 2 * q;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 1.04, -Math.PI / 2, -Math.PI / 2 + ang); ctx.closePath(); ctx.clip();
      const cash = img('onecoin_euro_cash'); if (cash) ctx.drawImage(cash, cx - R * 1.1, cy - R * 1.2, R * 2.2, R * 2.4); ctx.fillStyle = 'rgba(201,168,90,.35)'; ctx.fillRect(cx - R * 1.1, cy - R * 1.1, R * 2.2, R * 2.2); ctx.restore();
      ctx.strokeStyle = col.gold; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 1.04, -Math.PI / 2, -Math.PI / 2 + ang); ctx.closePath(); ctx.stroke();
      text('ONECOIN: > $4 BILLION', W * .72, H * .56, { size: 46 * u, font: 'impact', col: col.gold, a: q });
      text('for rows in a database', W * .72, H * .64, { size: 34 * u, font: 'serif', col: '#efe2c4', a: p('rows', .6) }); }
  });
}
#! end

# cine act=rise bg=clip:onecoin_clip_city_night bgBlur=3 bgDim=.45 shot="1|1.12:pt:.5,.45@coin/dolly" fx="build:x;el:S=txt:STEP 1,.5,.3,40,gold~T=txt:TAKE THE MONEY,.5,.42,120,gold~C=@onecoin_el_gold_coin,.5,.7,.2;do:S.type@Step~T.rise@trick~C.vanish@coin"
Step one. Here's the trick: investors never actually bought a **coin**.

# cine act=rise shot="ws|1.15:pt:.6,.45@Wikipedia/dolly" fx="scene:x;plate:onecoin_art_mood_lobby;air:dust|build:x;el:P=txt:ONEACADEMY PACKAGE,.32,.3,53~D=icon:doc*6,.32,.55,.16~W=txt:COPIED FROM WIKIPEDIA?,.66,.55,72,gold~L=arrow:W>D;do:P.drop@package~D.multiply:6@notes~W.type@lawsuit~L.draw@copied"
They bought an education **package**: course notes that a US lawsuit says were copied from free sources like Wikipedia.

# cine act=rise shot="1|1.1:pt:.85,.35@118,000/rise" fx="code:package_ladder;sfx:ui_pop@started~impact_cinematic@118,000"
Package prices started at one hundred euros and went up to **118,000**.

# cine act=rise shot="ws|1.15:pt:.6,.5@coins/dolly" fx="scene:x;plate:onecoin_art_server_glow;fg:onecoin_el_server@.84,1.02,.9;air:smoke,dust;light:flicker|build:x;el:K=txt:TOKENS,.28,.4,47~C=@onecoin_el_gold_coin,.5,.42,.22~A=arrow:K>C;do:K.pop@tokens~A.draw@mined~C.spin@coins"
Each package came with tokens, and you "**mined**" the tokens into coins.

# cine act=rise shot="1|1.1:pt:.6,.5@number/dolly" fx="code:back_office;mode:timer;plate:onecoin_art_database_room;go:Mining;sfx:ui_tick@timer~ui_notification@number"
Mining meant a **timer**. When it ran out, a number appeared in your account.

# cine act=doubt shot="1|1.12:pt:.65,.45@typed/dolly" fx="code:back_office;mode:typed;plate:onecoin_hq_office;title:ADMIN · SOFIA;go:price;x:.62;sfx:ui_typing@typed"
And the price of that number? The office in Sofia **typed** it in.

# cine act=rise shot="1|1.1:pt:.8,.3@ninety/glide" fx="code:price_stairs;sfx:ui_pop@Fifty~impact_cinematic@ninety"
Fifty euro cents at launch. Twenty-nine ninety-five by **2019**.

# cine act=doubt bg=onecoin_departures bgBlur=12 bgDim=.7 shot="ws|1.15:pt:.5,.5@market/dolly" fx="flapboard:x;title:PUBLIC EXCHANGES;rows:COINBASE=NOT LISTED~KRAKEN=NOT LISTED~BITSTAMP=NOT LISTED~ANY PUBLIC MARKET=NEVER;at:traded"
Yet the coin never traded on a single public **market**.

# cine act=rise shot="ws|1.15:pt:.6,.45@doubled/dolly" fx="scene:x;plate:onecoin_art_split_champagne;tone:color;air:dust,bokeh;light:sweep@splits|build:x;el:T=txt:YOUR TOKENS,.62,.3,44~X=txt:× 2,.62,.45,150,gold~C=@onecoin_el_gold_coin,.84,.5,.2;do:T.rise@tokens~X.zoom@doubled~C.multiply:2@overnight"
Then came the **splits**: every few months, your tokens doubled overnight.

# cine act=doubt shot="1|1.08:pt:.68,.5@quietly/dolly" fx="code:difficulty;sfx:ui_pop@rose~impact_cinematic@tokens"
But each time, the "mining difficulty" quietly **rose**: from 44 tokens per coin to 359.

# cine act=rise shot="1|1.15:pt:.55,.45@grew/dolly" fx="code:back_office;mode:balance;plate:onecoin_art_mood_rain;title:MEMBER BACK OFFICE;go:screen;x:.55;sfx:ui_notification@screen~ui_counter@grew"
So on screen, your balance only ever **grew**.

# cine act=rise bg=onecoin_art_mood_city bgBlur=8 bgDim=.6 shot="ws|1.15:pt:.7,.5@million/dolly" fx="build:x;el:G=@onecoin_el_gold_coin,.28,.4,.46~N=txt:120 BILLION,.28,.72,64,gold~B=@onecoin_bitcoin_coins,.72,.42,.1~M=txt:21 MILLION,.72,.56,52~R=txt:≈ 5 700 × MORE COINS,.72,.22,49;do:G.grow:1.1@promised~N.type@billion~B.pop@Bitcoin~M.type@million~R.drop@million"
The company promised 120 billion coins. Bitcoin will only ever have twenty-one **million**.

# cine act=rise shot="ews|ws:pt:.5,.5@salesman/rise" fx="scene:x;plate:onecoin_macau;air:dust,bokeh|build:x;el:B=txt:BUYER,.32,.4,120~S=txt:= SELLER,.64,.4,120,gold;do:B.pop@buyer~S.zoom@salesman"
And every buyer was also a **salesman**.

# cine act=rise bg=onecoin_art_gala_table bgBlur=8 bgDim=.45 shot="1|1.12:pt:.5,.6@recruits#2/dolly" fx="build:x;el:Y=txt:YOU,.5,.18,80,gold~R=icon:person*3,.5,.42,.13~Q=icon:person*9,.5,.7,.1~L1=arrow:Y>R~L2=arrow:R>Q~T=txt:+ BONUS,.82,.42,56,gold~U=txt:+ BONUS,.82,.7,56,gold;do:L1.draw@paid~R.multiply:3@recruits~T.pop@recruits~L2.draw@recruits#2~Q.multiply:9@recruits#2~U.pop@recruits#2"
You got paid on your recruits, and on your recruits' **recruits**.

# cine act=rise shot="ws|1.15:pt:.3,.4@dollars/dolly" fx="scene:x;plate:onecoin_art_thailand_villa;air:dust;light:sun@.7,.2|build:x;el:P=txt:5%,.3,.3,150,gold~S=txt:OF ALL SALES WORLDWIDE,.3,.44,44~N=num:300000000:$,.3,.6,100;do:P.zoom@top~S.rise@five~N.count@five"
At the very top, Greenwood took five percent of all sales worldwide: over three hundred million **dollars**.

# cine act=doubt shot="1|1.08:pt:.7,.45@locked/dolly" fx="code:bonus_split;sfx:foley_paper_cut@Sixty~foley_door_close@system"
But your own bonus? Sixty percent cash. Forty percent locked inside the **system**.

# cine act=doubt bg=onecoin_art_frosted_doors bgBlur=4 bgDim=.3 shot="ws|1.12:pt:.5,.42@out/dolly" fx="receipt:WITHDRAWAL REQUEST=YOUR CASH~STATUS=PENDING~STATUS=PENDING~STATUS=PENDING;at:cash;x:.5;y:.42"
And even the cash was hard to get **out**.

# cine act=doubt bg=clip:onecoin_clip_datacenter bgBlur=2 bgDim=.4 shot="1|1.12:pt:.5,.45@offline/cut" fx="build:x;el:E=txt:ONECOIN'S OWN EXCHANGE,.5,.3,60~L=txt:DAILY SELL LIMITS,.5,.42,47~O=txt:OFFLINE,.5,.6,130,red;do:E.drop@exchange~L.rise@limits~O.stamp:OFFLINE@offline|flicker;at:offline"
The only exchange was OneCoin's own, with daily selling limits, and it kept going **offline**.

# cine act=rise bg=onecoin_euro_cash bgBlur=10 bgDim=.5 shot="ws|1.04:pt:.5,.5@in/glide" fx="flow:INVESTORS>ONECOIN>!NO WAY OUT;at:money"
Which meant the money flowed one **way**: in.

# cine act=rise bg=onecoin_court_sdny bgBlur=12 bgDim=.6 mid="onecoin_doc_doj_greenwood;x:.42;h:.82;style:print;at:files" shot="ms:1|1.6:pt:.4,.38@2016/dolly" fx="scan:1;at:obtained;dur:1.4|lower:DOJ / IRS-CI~Plea release 2022;at:prosecutors"
OneCoin's own files, later obtained by US prosecutors, cover late 2014 to late **2016**.

# cine act=rise bg=onecoin_art_vault_glow bgBlur=10 bgDim=.6 fg="onecoin_euro_cut;x:.84;y:.86;h:.34;at:Sales;rot:8" shot="1|1.08:pt:.45,.42@euros/dolly" hero="€4.037 BILLION;at:four;fx:count;pos:c;y:.4;size:130" sup="SALES · Q4 2014 – Q4 2016;at:euros"
Sales: four point zero three seven billion **euros**.

# cine act=rise bg=onecoin_art_split_champagne bgBlur=3 bgDim=.35 fg="onecoin_el_champagne;x:.84;y:.8;h:.5;at:profit" shot="1.15:pt:.4,.4|1:pt:.4,.45@billion/dolly" hero="€2.735 BILLION;at:two;fx:count;pos:l;x:.38;y:.36;col:#c9a85a" sup="BOOKED AS PROFIT;at:profit" fx="stamp:PROFIT;at:billion;x:.62;y:.62;col:gold;size:90;rot:-8"
Booked as profit: two point seven three five **billion**.

# cine act=doubt shot="ws|1.15:pt:.5,.45@make/dolly" fx="scene:x;plate:onecoin_art_mood_lobby;air:dust|build:x;el:A=@onecoin_euro_cut,.24,.48,.4~B=@onecoin_euro_cut,.5,.48,.4~C=@onecoin_euro_cut,.76,.48,.4~T=txt:COST ≈ 0,.76,.8,80,gold;do:A.glow@two~B.glow@three~C.shrink:.3@cost~T.type@make"
That's two of every three euros, because the product cost almost nothing to **make**.

# cine act=rise shot="1|1.08:pt:.38,.48@billion/dolly" fx="code:bitcoin_quarter;step:1;go:Bitcoin;num:billion;sfx:foley_coin_drop@Bitcoin"
For scale: at the end of 2016, all the Bitcoin in the world was worth about fifteen and a half **billion** dollars.

# cine act=fall shot="1.08:pt:.38,.48|1.15:pt:.4,.4@database/dolly" fx="code:bitcoin_quarter;step:2;go:c1;num:c1;sfx:foley_paper_cut@quarter~impact_cinematic@database"
OneCoin had already raised more than a **quarter** of that. For rows in a database.

# cine act=rise bg=onecoin_wembley_night bgBlur=3 bgDim=.2 mid="clip:onecoin_clip_ruja_stage;x:.6;h:.72;style:print;at:c1" shot="ws|1.2:1@Wembley/dolly" fx="date:JUNE 2016;at:June;x:.06;y:.12|air:x;kind:confetti;dens:.5;at:Wembley"
In June 2016, at the height of the money, she took the stage at **Wembley**.

# cine act=doubt bg=onecoin_art_split_champagne bgBlur=8 bgDim=.45 shot="ws|1.1:pt:.5,.5@people/dolly" fx="chat:x;msgs:G>These ppl are idiots~K>as you told me, the network would not work with intelligent people ;);names:G=Sebastian Greenwood,K=Konstantin Ignatov;rate:1.6|lower:REAL MESSAGES~11 Sept 2016 · DOJ;at:September"
And that September, Greenwood sent her brother a message about the members: "These ppl are **idiots**."
Her brother's message back: "the network would not work with intelligent **people**."
