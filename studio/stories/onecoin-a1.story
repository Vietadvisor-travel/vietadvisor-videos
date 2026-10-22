title: onecoin a1 · the plan
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: ruja=bf_emma
music: auto
endcard: off

#! scene cv
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // her CV builds row by row on a cream card; the real place sits beside it as a print; the hidden row comes out last
  const step = +params.step, w0 = params.go || 'c1';
  layer(1, () => { draw(img(params.plate), W * .5, H * .5, H * 1.15, { a: .35 }); ctx.fillStyle = 'rgba(10,8,6,.55)'; ctx.fillRect(0, 0, W, H); });
  const cx = W * .3, cy = H * .47, cw = W * .4, ch = H * .66;
  layer(2, () => {
    ctx.save(); ctx.translate(cx + wobble(2, 3 * u), cy); ctx.rotate(-.02);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-cw / 2 + 12 * u, -ch / 2 + 16 * u, cw, ch);
    ctx.fillStyle = '#f2ead7'; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.fillStyle = '#c9a85a'; ctx.fillRect(-cw / 2, -ch / 2, cw, 10 * u); ctx.restore();
    text('CURRICULUM VITAE', cx - cw * .42, cy - ch * .38, { size: 26 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#7a6448', lw: 0, align: 'left' });
    text('Dr. Ruja Ignatova', cx - cw * .42, cy - ch * .27, { size: 58 * u, font: 'serif', weight: 900, col: '#1f1913', lw: 0, align: 'left' });
    const rows = [['LAW DOCTORATE', 'University of Konstanz'], ['CONSULTANT', 'McKinsey & Company'], ['OXFORD', 'as marketed'], ['2012', 'Convicted of fraud, Germany']];
    rows.forEach((r, i) => { if (i >= step) return; const y = cy - ch * .1 + i * ch * .17, fresh = i === step - 1, k = fresh ? spring(w0, { stiff: 150, damp: 15 }) : 1;
      const red = i === 3; ctx.save(); ctx.globalAlpha = clamp(k); ctx.translate((1 - k) * -40 * u, 0);
      if (red) { ctx.fillStyle = 'rgba(160,30,30,.14)'; ctx.fillRect(cx - cw * .45, y - 34 * u, cw * .9, 66 * u); }
      text(r[0], cx - cw * .42, y - 8 * u, { size: 42 * u, font: 'cond', weight: 700, col: red ? '#9b1c1c' : '#2a2219', lw: 0, align: 'left', ls: 2 * u });
      text(r[1], cx - cw * .42, y + 30 * u, { size: 32 * u, font: 'serif', col: red ? '#9b1c1c' : '#4a3d2e', lw: 0, align: 'left' }); ctx.restore();
      if (!red && (i < 2 || step > 3)) { ctx.save(); ctx.strokeStyle = '#a8832e'; ctx.lineWidth = 5 * u; ctx.beginPath(); const tx = cx + cw * .36; ctx.moveTo(tx - 14 * u, y); ctx.lineTo(tx - 2 * u, y + 12 * u); ctx.lineTo(tx + 18 * u, y - 16 * u); ctx.stroke(); ctx.restore(); }
      if (i === 2 && params.fix) { const f = spring(params.fix); ctx.save(); ctx.translate(cx + cw * .2, y + 4 * u); ctx.rotate(-.08); ctx.scale(f, f); ctx.fillStyle = '#e8c766'; ctx.fillRect(-120 * u, -26 * u, 240 * u, 52 * u);
        ctx.restore(); text("A MASTER'S", cx + cw * .2, y + 4 * u, { size: 30 * u * f, font: 'cond', weight: 700, col: '#2a2219', lw: 0, rot: -.08, a: f }); } });
  });
  layer(2.4, () => { const pk = spring(params.picAt || w0, { stiff: 110, damp: 12 }), px = W * .7, py = H * .45, ph = H * .44;
    const im = img(params.pic); if (!im) return; const pw = ph * im.width / im.height; ctx.save(); ctx.translate(px + (1 - pk) * W * .3, py); ctx.rotate(.05 - .02 * step);
    ctx.fillStyle = '#f4efe4'; ctx.fillRect(-pw / 2 - 14 * u, -ph / 2 - 14 * u, pw + 28 * u, ph + 60 * u); ctx.drawImage(im, -pw / 2, -ph / 2, pw, ph); ctx.restore();
    text(params.cap || '', px + (1 - pk) * W * .3, py + ph / 2 + 24 * u, { size: 24 * u, font: 'cond', weight: 700, col: '#3a3027', lw: 0, rot: .05 - .02 * step, ls: 3 * u }); });
  air('dust', { dens: .5 });
}
#! end

# cine act=setup bg=world map="25.97,43.85,5.5" map2="10.5,48.6,5.5" mapAt=Germany mapDur=1.6 fg="onecoin_ruse;x:.75;y:.64;h:.3;style:polaroid;tape;at:Ruse;rot:5" shot="ws|1.15:pt:.45,.45@Germany/glide" fx="pin:RUSE;ll:25.97,43.85;at:Ruse|route:25.97,43.85>8.4,48.2;at:Germany;dur:1.4|date:1980;at:c1;x:.06;y:.12"
Ruja Ignatova was born in **Ruse**, Bulgaria, in 1980, and grew up in Germany.

# cine act=setup shot="ws|1.15:pt:.66,.38@credible/dolly" fx="scene:x;plate:onecoin_art_mood_lobby;subj:onecoin_ruja@.66,1.02,.86;in:paper;air:dust,rays;light:sweep@credible|lower:DR. RUJA IGNATOVA~Founder, OneCoin;at:founder"
On paper, the founder was the most **credible** person in any room.

# cine act=setup shot="ms|1.15:pt:.32,.5@doctorate/dolly" fx="code:cv;step:1;go:doctorate;plate:onecoin_konstanz;pic:onecoin_konstanz;picAt:Konstanz;cap:KONSTANZ · 2005;sfx:foley_paper@doctorate~foley_marker@Konstanz"
A real law **doctorate** from the University of Konstanz.

# cine act=setup shot="1.15:pt:.32,.55|1.15:pt:.4,.5@McKinsey/rack" fx="code:cv;step:2;go:McKinsey;plate:onecoin_art_mood_lobby;sfx:foley_marker@McKinsey"
A job at **McKinsey**.

# cine act=setup shot="1.15:pt:.5,.5|1.15:pt:.4,.55@master/dolly" fx="code:cv;step:3;go:Oxford;fix:master;plate:onecoin_oxford;pic:onecoin_oxford;picAt:Oxford;cap:OXFORD;sfx:foley_paper@Oxford~foley_marker@master"
Her marketing added **Oxford**. [BEAT] Her Oxford degree was a master's.

# cine act=doubt shot="ms|1.15:pt:.32,.62@fraud/dolly;dutch:-4" fx="code:cv;step:4;go:convicted;plate:onecoin_prison;pic:onecoin_gavel;picAt:court;cap:GERMANY · 2012;sfx:impact_cinematic@fraud"
What the marketing left out: in 2012, a German court convicted her of **fraud**.

# cine act=doubt bg=onecoin_prison bgBlur=4 bgDim=.35 fg="onecoin_gavel;x:.24;y:.7;h:.4;style:print;at:c1+.3;rot:-6" shot="ws|1.15:pt:.62,.4@suspended/dolly" hero="14 MONTHS;at:fourteen;pos:r;x:.64;y:.36;size:120;col:#c9a85a" sup="SUSPENDED;at:suspended" fx="lower:GERMANY · 2012~Foundry stripped;at:father|stamp:BANKRUPT;at:bankrupt;x:.62;y:.62;col:grey;size:90;rot:-8"
She and her father had stripped a foundry until it went **bankrupt**. Her sentence: fourteen months, suspended.

# cine act=setup shot="ws|1.15:pt:.36,.45@BigCoin/dolly|1.15:pt:.68,.45@Greenwood/truck" fx="scene:x;plate:onecoin_art_mood_city;air:dust|build:x;el:C=@onecoin_el_gold_coin,.32,.46,.36~B=txt:BIGCOIN · 2013,.32,.75,49~G=txt:SEBASTIAN GREENWOOD,.66,.4,62,gold~S=txt:SALESMAN · SWEDEN,.66,.52,44~L=line:C-G;do:C.spin@BigCoin~B.rise@BigCoin~G.slideR@Greenwood~S.rise@salesman~L.draw@alongside"
Then, in 2013, she tried a first crypto scheme, **BigCoin**, alongside a Swedish salesman named Sebastian Greenwood.

# cine act=rise date="JUNE 2014" shot="ews|1.08:pt:.4,.5@deal/dolly" fx="scene:x;plate:onecoin_art_salon_pitch;tone:color;air:dust,rays;light:sweep@deal|build:x;el:E=txt:EMAIL · 11 JUNE 2014,.62,.18,47~D=txt:A BIGGER DEAL,.66,.3,90,gold;do:E.drop@email~D.type@deal"
In June 2014 she sent Greenwood an email pitching a bigger **deal**.

# cine act=rise bg=onecoin_art_split_champagne bgBlur=6 bgDim=.42 shot="ms|1.06:pt:.5,.45@numbers/glide" fx="seal:R.I.;at:words;x:.86;y:.2|quote:you as the magic sales machine - and me as someone who really can work with numbers;at:magic;by:Ruja Ignatova, email to Greenwood, 11 June 2014 (via DOJ);x:.5;y:.4;rate:.17"
In her words:
@ruja: You as the magic sales machine, and me as someone who really can work with numbers…

# cine act=rise bg=onecoin_art_mood_trading_floor bgBlur=3 bgDim=.35 shot="ws|1.15:pt:.5,.42@street/dolly" fx="quote:like MLM meets bitch of wall street ;-);at:MLM;by:same email, 11 June 2014;x:.5;y:.42;rate:.2|underline:.28,.52,.72;at:street;col:gold"
@ruja: …like MLM meets bitch of wall street.

# cine act=rise bg=onecoin_hq_office bgBlur=14 bgDim=.6 mid="onecoin_hq_door;x:.36;h:.7;style:print;tape;at:c1+.2;rot:-3" shot="ms|mcu:1@trashy/dolly" fx="stamp:TRASHY COIN;at:nickname;x:.38;y:.42;col:gold;size:120;rot:-9|lower:THE PRODUCT~Founders' nickname;at:nickname"
In their private emails, the two founders even had a nickname for their product: "trashy **coin**."

# cine act=doubt shot="ws|1.15:pt:.5,.45@email/whip" fx="calendar:x;from:2014-06;n:2;at:months|build:x;el:E=txt:9 AUGUST 2014 · THE EXIT EMAIL,.5,.84,44;do:E.rise@email"
Two months later came the exit **email**.

# cine act=doubt shot="ws|1.15:pt:.62,.48@blame/dolly" fx="scene:x;plate:onecoin_art_mood_lobby;air:dust|build:x;el:O=@onecoin_hq_office,.17,.5,.78~T=txt:TAKE,.45,.3,110,gold~R=txt:RUN,.63,.5,110,gold~B=txt:BLAME,.8,.7,110,red;do:O.rise@plan~T.drop@take~R.drop@run~B.drop@blame"
So before a single coin was sold, the plan had three **steps**: take, run, blame.
