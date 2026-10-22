title: onecoin a0 · the exit strategy
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: ruja=bf_emma
music: auto
endcard: off

#! scene exit_email
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
#! end

#! scene three_ticks
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ctx, col, lerp }) => {
  // the three clauses of the email become a checklist; each one gets its tick on "three", the last lands on "word"
  layer(1, () => { draw(img('onecoin_art_mood_runway'), W * .5, H * .5, H * 1.1, { a: .5 }); ctx.fillStyle = 'rgba(6,5,4,.5)'; ctx.fillRect(0, 0, W, H); });
  const rows = ['TAKE THE MONEY', 'AND RUN', 'AND BLAME SOMEONE ELSE'];
  layer(2, () => rows.forEach((r, i) => {
    const k = stagger(i, 3, 'did', .35, .45), y = H * (.28 + i * .18), tk = i < 2 ? spring(at('three') + i * .25) : spring('word');
    text(r, W * .2 + (1 - k) * -60 * u, y, { size: 92 * u, font: 'serif', weight: 900, col: '#efe2c4', align: 'left', a: k });
    ctx.save(); ctx.translate(W * .14, y - 6 * u); ctx.scale(tk, tk); ctx.strokeStyle = col.gold; ctx.lineWidth = 9 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-26 * u, 0); ctx.lineTo(-6 * u, 22 * u); ctx.lineTo(30 * u, -28 * u); ctx.stroke(); ctx.restore();
  }));
}
#! end

# cine act=setup bg=clip:onecoin_clip_ruja_stage bgBlur=0 bgDim=.1 bgTone=color date="11 JUNE 2016 · WEMBLEY ARENA, LONDON" shot="ws|1.22:pt:.42,.5@gown/glide" fx="lower:FBI release footage~Public domain;at:stage"
On Saturday, the eleventh of June, 2016, a woman in a red **gown** walked onto the stage at Wembley Arena.

# cine act=rise shot="ews;angle:low|1.08:pt:.5,.42@arena/rise" fx="scene:x;plate:onecoin_art_wembley_gown;tone:color;air:dust,rays;light:sweep@arena"
Thousands of her investors filled the **arena**.

# cine act=rise bg=onecoin_wembley_interior bgBlur=14 bgDim=.55 mid="clip:onecoin_clip_ruja_close;x:.3;h:.66;style:raw;border:off" shot="ms|mcu:1@Bitcoin/dolly" fx="quote:In two years, nobody will speak about Bitcoin anymore.;at:promised;by:Ruja Ignatova, Wembley, June 2016;x:.7;y:.36;rate:.17"
She promised them that in two years, nobody would speak about **Bitcoin** anymore.

# cine act=rise bg=onecoin_wembley_night bgBlur=12 bgDim=.6 mid="onecoin_el_gold_coin;x:.3;h:.56;in:rise;at:selling;tone:gold|onecoin_bitcoin_coins;x:.71;h:.46;style:polaroid;tape;at:coin;rot:4" shot="ws|ms:2@kill/whip" fx="strike:2;at:kill|lower:ONECOIN vs BITCOIN~The pitch: the Bitcoin killer;at:selling"
She was selling investors the coin that would kill it. [BEAT]

# cine act=doubt shot="1.22:pt:.5,.45|1.4:pt:.5,.45@exist/cut" fx="scene:x;plate:onecoin_art_empty_stage;air:dust|build:x;el:C=@onecoin_el_gold_coin,.5,.42,.42;do:C.float@coin~C.vanish@exist"
That coin did not **exist**.

# cine act=doubt shot="ws|1.22:pt:.5,.55@billion/dolly" fx="scene:x;plate:onecoin_art_vault_glow;air:dust,rays;light:sweep@billion|build:x;el:N=num:4000000000:$,.5,.2,130~T=tag:RAISED · 2014–2016 AND BEYOND,.5,.33,34;do:N.count@raised~T.rise@billion~N.glow@billion"
This is the story of how a product that never existed raised more than four **billion** dollars.

# cine act=doubt bg=clip:onecoin_clip_datacenter bgBlur=0 bgDim=.35 fx="build:x;el:T=txt:NO BLOCKCHAIN,.5,.42,130,paper;do:T.zoom@blockchain"
No **blockchain**.

# cine act=doubt bg=clip:onecoin_clip_mining_asic bgBlur=0 bgDim=.35 fx="build:x;el:T=txt:NO MINING,.62,.4,130,paper;do:T.drop@mining"
No **mining**.

# cine act=doubt bg=onecoin_art_mood_trading_floor bgBlur=0 bgDim=.25 fx="build:x;el:T=txt:NO MARKET,.38,.4,130,paper;do:T.slideL@market"
No **market**.

# cine act=doubt shot="ws|1.4:pt:.62,.42@database/dolly" fx="scene:x;plate:onecoin_art_database_room;air:dust;light:flicker|build:x;el:D=tag:A DATABASE,.62,.24,40~O=tag:OWNED BY ONECOIN,.62,.32,30;do:D.drop@database~O.rise@company"
Just a **database** her own company controlled.

# cine act=doubt bg=onecoin_art_mood_fog bgBlur=6 bgDim=.55 trans=whip fg="onecoin_wembley_night;x:.78;y:.5;h:.42;style:polaroid;tape;at:c1;rot:5" shot="ws|1.15:pt:.35,.45@ending/dolly" hero="2016;at:whole;to:2014;toAt:before;font:serif;size:200;pos:l;x:.32;y:.42" sup="SHE WROTE THE ENDING;at:ending;x:.32;y:.6"
But that's not the whole story.
Two years before Wembley, she had already written the **ending**.

# cine act=flash shot="ms|1.4:pt:.42,.5@strategy/dolly;dutch:-3" fx="code:exit_email;sfx:foley_paper@email~foley_marker@strategy"
An email from August 2014, listing her exit **strategy**.

# cine act=flash bg=onecoin_art_recruit_call bgBlur=16 bgDim=.7 shot="ws|1.08:pt:.5,.45@blame/glide" fx="quote:Take the money and run and blame someone else for this . . . .;at:Take;by:Ruja Ignatova, email to Greenwood, 9 Aug 2014 (via DOJ);x:.5;y:.46;rate:.2|underline:.25,.58,.75;at:blame;col:gold"
Option one:
@ruja: Take the money and run and blame someone else for this.

# cine act=fall shot="ws|1.22:pt:.4,.5@word/dolly" fx="code:three_ticks;sfx:foley_marker@three~impact_cinematic@word"
She did all **three**. [BEAT] Almost to the word.

# cine act=fall shot="ws|1.4:pt:.38,.55@missing/dolly" fx="scene:x;plate:onecoin_art_victim_kitchen;air:dust;light:sun@.7,.2|build:x;el:N=num:3500000,.7,.24,120~T=tag:VICTIMS · 175 COUNTRIES,.7,.36,36;do:N.count@million~T.rise@investors~N.red@missing"
So who paid for it? Three and a half million investors, and the money is still **missing**.

# ppcase n=04 title="OneCoin" sub="The exit strategy" photo=onecoin_ruja_fbi stamp=OPEN stampAt=2.2
