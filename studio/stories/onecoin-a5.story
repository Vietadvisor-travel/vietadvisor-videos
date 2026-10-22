title: onecoin a5 · blame someone else
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: ruja=bf_emma
music: auto
endcard: off

#! scene sentence_ladder
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx, params }) => {
  // the sentences line up as bars of prison time; each beat adds one bar on its word; the founder's row stays empty
  const step = +params.step, go = params.go || 'c1';
  layer(1, () => { draw(img('onecoin_art_courtroom'), W * .5, H * .5, H * 1.12, { a: .32 }); ctx.fillStyle = 'rgba(8,6,4,.6)'; ctx.fillRect(0, 0, W, H); });
  const rows = [['GREENWOOD', 'the salesman', 20, '20 YEARS'], ['SCOTT', 'the lawyer', 10, '10 YEARS'], ['ARMENTA', 'the boyfriend', 5, '5 YEARS'], ['DILKINSKA', 'head of compliance', 4, '4 YEARS'], ['KONSTANTIN', 'the brother', 34 / 12, 'TIME SERVED'], ['RUJA', 'the founder', 0, 'NEVER TRIED']];
  const x0 = W * .3, full = W * .5, y0 = H * .14, dy = H * .125;
  layer(2, () => rows.forEach(([name, role, yrs, lab], i) => { if (i >= step) return; const y = y0 + i * dy, cur = i === step - 1, k = cur ? spring(go, { stiff: 70, damp: 12 }) : 1, a = cur ? clamp(p(go, .3) * 2) : (step === 6 ? .45 : .8);
    text(name, x0 - 24 * u, y, { size: 40 * u, font: 'impact', col: i === 5 ? col.gold : '#efe2c4', align: 'right', a: cur ? 1 : a });
    text(role, x0 - 24 * u, y + 30 * u, { size: 22 * u, font: 'serif', col: '#b9a57d', align: 'right', a: cur ? 1 : a });
    if (i < 5) { const w = full * yrs / 20 * k; ctx.save(); ctx.globalAlpha = cur ? 1 : a; const g = ctx.createLinearGradient(x0, 0, x0 + w, 0); g.addColorStop(0, '#6f5a2e'); g.addColorStop(1, cur ? '#e2c27a' : '#a8894a'); ctx.fillStyle = g; ctx.fillRect(x0, y - 22 * u, w, 44 * u);
      for (let b = 1; b < yrs; b++) { ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(x0 + full * b / 20 - 1.5 * u, y - 22 * u, 3 * u, 44 * u * clamp(k * 1.2)); } ctx.restore();
      text(lab, x0 + w + 20 * u, y + 2 * u, { size: 34 * u, font: 'impact', col: cur ? col.gold : '#d8c7a2', align: 'left', a: cur ? clamp(k) : a }); }
    else { const e = spring(go, { stiff: 160, damp: 12 }); ctx.save(); ctx.setLineDash([10 * u, 10 * u]); ctx.strokeStyle = col.gold; ctx.lineWidth = 3 * u; ctx.strokeRect(x0, y - 22 * u, full, 44 * u); ctx.restore();
      text(lab, x0 + full / 2, y + 2 * u, { size: 44 * u * (.7 + .3 * clamp(e)), font: 'impact', col: col.gold, a: clamp(e) }); }
  }));
  if (step === 6) text('5 COUNTS · PRESUMED INNOCENT IN LAW', W * .6, H * .93, { size: 26 * u, font: 'cond', weight: 700, ls: 5 * u, col: '#b9a57d', a: p('law', .6) });
}
#! end

# cine act=after shot="1.3:pt:.5,.5|ws@fast/whip" fx="scene:x;plate:onecoin_art_courtroom;air:dust;light:sweep@blame|build:x;el:H=@onecoin_el_handcuffs,.5,.62,.16;do:H.drop@fast"
The blame arrived **fast**.

# cine act=after bg=world map="100.5,13,4.5" map2="100,9.5,7" mapAt=arrested mapDur=1.8 fg="onecoin_art_thailand_villa;x:.78;y:.68;h:.36;style:polaroid;tape;at:Greenwood;rot:4" shot="ws|1.12:pt:.45,.5@Samui/glide" fx="date:JULY 2018;at:July;x:.06;y:.12|pin:KOH SAMUI;ll:100.0,9.5;at:Samui;col:red"
In July 2018, Greenwood was arrested on the Thai island of Koh **Samui**.

# cine act=after shot="1.25:pt:.6,.5|1:pt:.55,.5@arrested/dolly" fx="scene:x;plate:onecoin_art_lax_cuffs;air:dust;light:sweep@arrested|date:6 MARCH 2019 · LAX;at:March;x:.06;y:.12|lower:KONSTANTIN IGNATOV~arrested on arrival;at:arrested"
In March 2019, her brother's plane landed in Los Angeles, and he was **arrested** on arrival.

# cine act=after bg=onecoin_court_sdny bgBlur=0 bgDim=.4 shot="ws;angle:low|1.15:pt:.5,.4@ones/rise" fx="quote:a pyramid scheme based on smoke and mirrors more than zeroes and ones;at:pyramid;by:Geoffrey Berman, U.S. Attorney (SDNY), March 2019;x:.5;y:.36;rate:.17|smoke;at:smoke"
New York's top federal prosecutor called OneCoin "a pyramid scheme based on smoke and mirrors more than zeroes and **ones**."

# cine act=after shot="ews|1.2:pt:.5,.45@firm/dolly" fx="scene:x;plate:onecoin_art_frosted_doors;air:dust;light:sweep@washed|lower:MARK SCOTT~former Locke Lord partner;at:Scott"
Then came the man who washed the money: Mark Scott, a partner at a major law **firm**.

# cine act=after bg=onecoin_art_frosted_doors bgBlur=6 bgDim=.5 shot="1|1.12:pt:.5,.5@dollars/dolly" fx="build:x;el:F=tag:FENERO FUNDS · BVI · CAYMAN,.5,.2,44~C=@onecoin_euro_cash,.2,.55,.3~N=num:400000000:$,.5,.55,130~A=arrow:C>N;do:F.drop@funds~A.draw@moved~C.slideR@moved~N.count@four"
His fake investment funds moved about four hundred million **dollars**.

# cine act=after shot="1.2:pt:.4,.5|1:pt:.45,.5@million/truck" fx="scene:x;plate:onecoin_art_yacht_harbour;air:dust;light:sun@.8,.2|build:x;el:N=txt:$50M+,.3,.32,150,gold~T=tag:HIS FEE,.3,.46,40;do:T.drop@fee~N.zoom@million"
His fee: more than fifty **million**.

# cine act=after bg=onecoin_art_courtroom bgBlur=4 bgDim=.3 shot="1.2:pt:.5,.45|ws@scam/dolly" fx="build:x;el:D=tag:THE DEFENCE,.5,.32,44~Q=txt:HE DIDN'T KNOW,.5,.46,100,gold;do:D.drop@defence~Q.type@know"
His defence: he didn't know it was a **scam**.

# cine act=after bg=onecoin_courtroom_photo bgBlur=8 bgDim=.6 fg="onecoin_gavel;x:.8;y:.78;h:.34;style:print;at:jury;rot:-5" shot="ws|1.25:pt:.4,.42@hours/crash" hero="≈ 4 HOURS;at:four;font:impact;size:170;pos:l;x:.38;y:.42" sup="GUILTY ON BOTH COUNTS · NOV 2019;at:hours"
The jury took about four **hours**.

# cine act=after shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:1;go:sentences;sfx:impact_cinematic@sentences"
So line up the **sentences**.

# cine act=after shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:1;go:twenty;sfx:impact_cinematic@twenty"
Greenwood, the salesman: twenty **years**.

# cine act=after shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:2;go:ten;sfx:impact_cinematic@ten"
Scott, the lawyer: ten **years**.

# cine act=after shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:3;go:five;sfx:impact_cinematic@five"
Armenta, the boyfriend who flipped, then broke his own deal: five **years**.

# cine act=after shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:4;go:four;sfx:impact_cinematic@four"
Irina Dilkinska, head of legal and **compliance**: four years.

# cine act=after shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:5;go:time;sfx:impact_cinematic@time"
Konstantin, who testified about his sister's escape: time served, and **free**.

# cine act=lesson shot="1|1.04:pt:.5,.45@c1/glide" fx="code:sentence_ladder;step:6;go:never;sfx:impact_cinematic@never"
And Ruja? Charged on five counts, never **tried**. In law, she is presumed innocent.

# cine act=after trans=whip shot="1.3:pt:.4,.6|1.05:pt:.45,.55@sequel/dolly" fx="scene:x;plate:onecoin_art_airport_dawn;air:dust,rays;light:sweep@escape|build:x;el:S=txt:THE SEQUEL,.3,.25,100,gold;do:S.type@sequel"
Then even her escape got a **sequel**.

# cine act=after shot="ews|1.2:pt:.5,.45@spy/dolly" fx="scene:x;plate:onecoin_luxembourg;air:dust;light:sweep@Luxembourg|lower:FRANK SCHNEIDER~ex-deputy ops director, Luxembourg intelligence;at:Schneider|date:APRIL 2021 · FRANCE;at:arrested;x:.06;y:.12"
Frank Schneider, a former Luxembourg spy and OneCoin's security adviser, was arrested in France in **2021**.

# cine act=after shot="1.25:pt:.4,.55|1:pt:.5,.5@vanished/dolly" fx="scene:x;plate:onecoin_art_ankle_desk;fg:onecoin_el_ankle_tag@.3,.9,.2;air:dust,rays;light:sweep@house|build:x;el:G=tag:GPS TAG · HOUSE ARREST,.72,.3,40~L=txt:SIGNAL LOST,.72,.44,96,red~M=tag:MAY 2023,.72,.56,36;do:G.drop@tag~L.zoom@vanished~M.rise@May"
Under house arrest, with a GPS tag on his ankle, he **vanished** in May 2023.

# cine act=after shot="ws|1.3:pt:.5,.5@fugitive/drop" fx="scene:x;plate:onecoin_art_mood_fog;air:fog;light:flicker|stamp:FUGITIVE;at:fugitive;x:.5;y:.42;col:red;size:120;rot:-6"
He is still a **fugitive**.
