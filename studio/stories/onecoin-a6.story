title: onecoin a6 · the bill
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: ruja=bf_emma
music: auto

#! scene one_cent
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // more than $4 billion lost as 100 stacks of real notes; the 2026 victim fund is one stack; on "cent" the other 99 go dark
  layer(1, () => { draw(img('onecoin_art_victim_kitchen'), W * .5, H * .5, H * 1.12, { a: .3 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const cash = img('onecoin_euro_cash'), step = +params.step, gx = W * .08, gy = H * .16, cw = W * .045, chh = cw * (cash ? cash.height / cash.width : 1.1), sp = W * .052;
  const fund = step === 1 ? spring('forty', { stiff: 140, damp: 12 }) : 1, dark = step === 2 ? p('cent', .9, 'inOut') : 0;
  layer(2, () => { for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), k = step === 1 ? stagger(c + r, 19, 'opened', .9, .4) : 1, me = i === 99;
      const x = gx + c * sp, y = gy + r * (chh * .62); if (!cash) break; ctx.globalAlpha = clamp(k) * (me ? 1 : 1 - dark * .85);
      ctx.drawImage(cash, x, y + (1 - k) * -30 * u, cw, chh * .55); if (me && fund > .05) { ctx.strokeStyle = col.gold; ctx.lineWidth = 4 * u * fund; ctx.strokeRect(x - 4 * u, y - 4 * u, cw + 8 * u, chh * .55 + 8 * u); } }
    ctx.globalAlpha = 1; });
  layer(2.4, () => { const tx = W * .78;
    text('> $4 BILLION', tx, H * .3, { size: 72 * u, font: 'impact', col: '#efe2c4', a: step === 1 ? p('fund', .5) : 1 - dark * .6 });
    text('LOST · 100 STACKS', tx, H * .38, { size: 26 * u, font: 'cond', weight: 700, ls: 5 * u, col: '#b9a57d', a: step === 1 ? p('fund', .5) : 1 });
    text('$40 MILLION+', tx, H * .56, { size: 72 * u * (.7 + .3 * clamp(fund)), font: 'impact', col: col.gold, a: clamp(fund) });
    text('THE 2026 VICTIM FUND · 1 STACK', tx, H * .64, { size: 26 * u, font: 'cond', weight: 700, ls: 4 * u, col: '#b9a57d', a: clamp(fund) });
    if (step === 2) { const e = spring('cent', { stiff: 160, damp: 12 }); text('≈ 1¢ ON THE $', tx, H * .82, { size: 84 * u * (.6 + .4 * clamp(e)), font: 'impact', col: col.gold, a: clamp(e) }); } });
}
#! end

#! scene exit_email
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, line, ease, lerp, clamp, col, ctx }) => {
  // the 2014 email returns; each clause of option one gets what actually happened stamped beside it
  layer(1, () => { draw(img('onecoin_art_recruit_call'), W * .5, H * .5, H * 1.08, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.5)'; ctx.fillRect(0, 0, W, H); });
  const s = spring('c1', { stiff: 120, damp: 13 }), x = W * .38 + wobble(3, 3 * u), y = lerp(-H * .6, H * .48, s);
  layer(2, () => { ctx.save(); ctx.translate(x, y); ctx.rotate(-.02); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-W * .3 + 14 * u, -H * .36 + 18 * u, W * .6, H * .72);
    ctx.fillStyle = '#efe6d2'; ctx.fillRect(-W * .3, -H * .36, W * .6, H * .72); ctx.fillStyle = '#d9cfb8'; ctx.fillRect(-W * .3, -H * .36, W * .6, 60 * u); ctx.restore();
    text('EMAIL  ·  9 AUGUST 2014  ·  OPTION 1', x - W * .27, y - H * .36 + 32 * u, { size: 26 * u, font: 'cond', weight: 700, ls: 4 * u, col: '#5b4d3c', lw: 0, align: 'left' });
    const cl = [['Take the money', 'Take', '> $4 BILLION'], ['and run', 'Run', 'ATHENS · 2017'], ['and blame someone else', 'Blame', 'OTHERS: 20 + 10 + 5 + 4 YRS']];
    cl.forEach(([s2, key, out], i) => { const yy = y - H * .16 + i * H * .17, k = p(key, .45, 'inOut'), st = spring(at(key) + .25, { stiff: 200, damp: 12 });
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(214,170,60,.85)'; ctx.fillRect(x - W * .27 - 6 * u, yy - 34 * u, W * .3 * k, 62 * u); ctx.restore();
      text(s2, x - W * .27, yy, { size: 52 * u, font: 'serif', weight: 900, col: '#1d1712', lw: 0, align: 'left' });
      ctx.save(); ctx.translate(x + W * .14, yy); ctx.rotate(-.08); ctx.scale(lerp(1.6, 1, clamp(st)), lerp(1.6, 1, clamp(st))); ctx.globalAlpha = clamp(st * 2);
      ctx.strokeStyle = '#8f1d1d'; ctx.lineWidth = 4 * u; ctx.strokeRect(-W * .1, -30 * u, W * .2, 60 * u); ctx.restore();
      text(out, x + W * .14, yy + 2 * u, { size: 30 * u, font: 'impact', col: '#8f1d1d', lw: 0, rot: -.08, a: clamp(st * 2) }); });
    text('she wrote it in 2014', x, y + H * .3, { size: 30 * u, font: 'serif', col: '#5b4d3c', lw: 0, a: p('wrote', .6) }); });
  air('dust', { dens: .5 });
}
#! end

# cine act=lesson shot="1.3:pt:.62,.45|1:pt:.6,.45@she/glide" fx="scene:x;plate:onecoin_art_poster_wall;air:rain,dust;light:flicker|build:x;el:Q=txt:WHERE IS SHE?,.32,.3,90,gold;do:Q.type@where"
So where is **she**?

# cine act=lesson bg=onecoin_fbi_hq bgBlur=12 bgDim=.6 mid="onecoin_doc_fbi_wanted;x:.4;h:.86;style:print;at:c1" shot="1|1.5:1@woman/dolly" fx="date:30 JUNE 2022;at:FBI;x:.06;y:.12|mark:1;r:.05,.13,.6,.2;at:Wanted|lower:FUGITIVE NO. 527~the only woman on the list;at:woman"
In 2022, the FBI put her on its Ten Most Wanted list, the only **woman** on it at the time.

# cine act=lesson bg=onecoin_art_poster_wall bgBlur=10 bgDim=.6 mid="onecoin_ruja_fbi;x:.32;h:.62;style:print;tape;at:c1;rot:-3" shot="ws|1.18:pt:.68,.45@dollars/dolly" fx="build:x;el:N=num:5000000:$,.72,.44,130~T=tag:REWARD · JUNE 2024,.72,.56,40~O=tag:WAS $100,000 IN 2022,.72,.64,30;do:N.count@raised~T.rise@reward~O.rise@dollars"
In 2024, the United States raised the reward to five million **dollars**.

# cine act=lesson shot="1.25:pt:.5,.55|ws@killed/drop" fx="scene:x;plate:onecoin_art_raid_office;air:dust,rays;light:flicker|build:x;el:M=tag:LEAKED BULGARIAN POLICE MEMO,.5,.22,44~K=txt:CLAIM: KILLED IN 2018,.5,.36,80,gold;do:M.drop@memo~K.type@killed"
A leaked Bulgarian police memo claims she was killed in **2018**.

# cine act=lesson bg=onecoin_art_raid_office bgBlur=10 bgDim=.6 shot="ws|1.12:pt:.5,.45@unverified/dolly" fx="build:x;el:D=tag:THE DOCUMENT,.3,.32,44~R=txt:REAL,.3,.46,110,gold~C=tag:THE CLAIM INSIDE,.7,.32,44~U=txt:UNVERIFIED,.7,.46,90,red;do:D.drop@document~R.zoom@real~C.drop@claim~U.stamp:UNVERIFIED@unverified"
The document is real. But the claim inside it is second-hand, and **unverified**.

# cine act=lesson shot="ews|1.2:pt:.5,.45@alive/rise" fx="scene:x;plate:onecoin_fbi_hq;air:dust;light:sweep@hunts|lower:THE FBI'S WORKING ASSUMPTION~she is alive;at:alive"
So the FBI still hunts her as if she's **alive**.

# cine act=lesson shot="1.6:pt:.5,.5|1.1:pt:.5,.5@Athens/glide" fx="scene:x;plate:onecoin_art_athens_light;air:dust,rays;light:sun@.5,.3|build:x;el:A=tag:ATHENS · 25 OCT 2017,.5,.16,44;do:A.type@confirmed"
Nobody has confirmed seeing her since **Athens**.

# cine act=after bg=onecoin_art_victim_kitchen bgBlur=6 bgDim=.45 shot="1.25:pt:.5,.55|1:pt:.5,.5@bill/dolly" fx="tally:VICTIMS=3.5 MILLION+~COUNTRIES=175 (REPORTED)~LOST=MORE THAN $4 BILLION;at:confirm;rate:.6;x:.66;y:.3;w:.36"
What we can confirm is the **bill**.

# cine act=after date="UGANDA" shot="1.3:pt:.6,.6|1:pt:.55,.55@livestock/glide" fx="scene:x;plate:onecoin_art_uganda_plot;air:dust;light:sun@.85,.2|lower:UGANDA~farmers sold land to buy in (BBC);at:farmers"
In Uganda, the BBC found farmers who had sold land and **livestock** to buy in.

# cine act=after bg=world map="10.4,51.2,5.6" hl="Germany" hlAt=Germany shot="ws|1.15:pt:.5,.5@processor/dolly" fx="build:x;el:N=txt:17,552,.72,.4,130,gold~T=tag:VICTIMS · ONE PAYMENT PROCESSOR,.72,.52,34~S=tag:DEC 2015 – AUG 2016,.72,.6,30;do:N.zoom@victims~T.rise@processor~S.rise@single"
In Germany, investigators traced the money of 17,552 victims through a single payment **processor**.

# cine act=after shot="1.2:pt:.4,.5|1:pt:.45,.5@family/truck" fx="scene:x;plate:onecoin_art_victim_kitchen;air:dust;light:sun@.75,.2|lower:JEN McADAM~victim and campaigner, Glasgow;at:McAdam"
In Glasgow, Jen McAdam had brought in friends and **family**.

# cine act=after bg=onecoin_euro_cash bgBlur=14 bgDim=.7 shot="ws|1.12:pt:.5,.45@away/dolly" fx="quote:thrown a quarter of a million euros away;at:thrown;by:Jen McAdam to the BBC, 2019;x:.5;y:.42;rate:.2"
Together, she said, they had "thrown a quarter of a million euros **away**."

# cine act=after shot="1|1.06:pt:.6,.45@forty/dolly" fx="code:one_cent;step:1;sfx:ui_pop@opened~magic_reveal@forty"
In 2026, the US opened a fund for victims: just over forty million **dollars**.

# cine act=after shot="1.06:pt:.6,.45|1.15:pt:.62,.55@cent/dolly" fx="code:one_cent;step:2;sfx:glitch_power_down@cent"
Against more than four billion lost, that's about one **cent** on the dollar. [BEAT]

# cine act=lesson shot="ws|1.3:pt:.6,.42@database/dolly" fx="scene:x;plate:onecoin_art_database_room;air:dust,rays;light:sweep@database|build:x;el:R=tag:THE REAL REASON,.3,.22,44~O=txt:ONE INSPECTION,.3,.34,90,gold;do:R.drop@reason~O.type@person"
Here's the real reason it worked: the fraud never needed smarter victims. It needed one person to open the **database**.

# cine act=lesson bg=onecoin_art_database_room bgBlur=10 bgDim=.6 shot="1.2:pt:.5,.5|ws@everywhere/drop" fx="build:x;el:P=tag:A PRIVATE BLOCKCHAIN,.22,.36,48~F=tag:SALESMEN = FAMILY,.5,.36,48~E=tag:MONEY: EVERYWHERE,.78,.36,48~L1=@onecoin_el_vault_wheel,.22,.64,.34~L2=@onecoin_el_champagne,.5,.66,.36~L3=@onecoin_euro_cash,.78,.66,.32;do:P.drop@private~L1.rise@private~F.drop@salesmen~L2.rise@family~E.drop@money~L3.rise@everywhere"
Nobody could, because the "blockchain" was **private**, the salesmen were family, and the money was everywhere.

# cine act=lesson shot="1|1.08:pt:.45,.5@wrote/dolly" fx="code:exit_email;sfx:foley_marker@Take~foley_marker@Run~impact_cinematic@Blame"
Take the money. Run. Blame someone else. She wrote it in **2014**.

# cine act=lesson bg=black solo=1 shot="1|1.12:pt:.5,.45@did/dolly" fx="build:x;el:C=@onecoin_el_gold_coin,.5,.36,.32~A=txt:THE COIN NEVER EXISTED.,.5,.66,64,ink~B=txt:THE EXIT STRATEGY DID.,.5,.78,76,gold;do:C.vanish@existed~A.type@coin~B.type@exit"
The coin never existed. The exit strategy **did**.

# ppend
