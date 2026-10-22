title: onecoin a4 · and run
channel: poisonpill
look: luxury
tone: playful
voice: am_michael*.7+bm_george*.3
delivery: wry
voices: ruja=bf_emma
music: auto
endcard: off

#! scene two_tickets
({ t, at, p, spring, stagger, wobble, W, H, u, layer, img, draw, text, air, ease, lerp, clamp, col, ctx }) => {
  // the "big passport" lands; two boarding passes slide out of it, Vienna and Athens; only Athens stays lit
  layer(1, () => { draw(img('onecoin_art_checkin_hand'), W * .5, H * .5, H * 1.1, { a: .35 }); ctx.fillStyle = 'rgba(8,6,4,.55)'; ctx.fillRect(0, 0, W, H); });
  const pk = spring('passport', { stiff: 130, damp: 13 });
  layer(2, () => { draw(img('onecoin_el_passport'), W * .3, H * .5 + (1 - pk) * H * .4, H * .5, { a: clamp(pk), rot: -.08 });
    text('"BIG PASSPORT"', W * .3, H * .82, { size: 34 * u, font: 'cond', weight: 700, ls: 6 * u, col: '#d9c7a0', a: p('passport', .5) }); });
  const pass = (k, y, code, city, lit) => { const x = lerp(W * .3, W * .68, k); ctx.save(); ctx.translate(x + wobble(y, 3 * u), y); ctx.rotate(lerp(-.08, .02, k)); ctx.globalAlpha = clamp(k * 2) * (lit ? 1 : lerp(1, .35, p('Athens', .6)));
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(-W * .17 + 10 * u, -H * .09 + 12 * u, W * .34, H * .18);
    ctx.fillStyle = '#f2ead7'; ctx.fillRect(-W * .17, -H * .09, W * .34, H * .18); ctx.fillStyle = lit ? '#c9a85a' : '#9a8e78'; ctx.fillRect(-W * .17, -H * .09, 18 * u, H * .18);
    ctx.setLineDash([6 * u, 6 * u]); ctx.strokeStyle = '#b5a888'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(W * .09, -H * .08); ctx.lineTo(W * .09, H * .08); ctx.stroke(); ctx.restore();
    text('BOARDING PASS', x - W * .13, y - H * .045, { size: 20 * u, font: 'cond', weight: 700, ls: 5 * u, col: '#7a6a52', lw: 0, align: 'left', a: clamp(k * 2) });
    text('SOF → ' + code, x - W * .13, y + H * .02, { size: 64 * u, font: 'impact', col: '#231c15', lw: 0, align: 'left', a: clamp(k * 2) });
    text(city, x + W * .13, y + H * .02, { size: 26 * u, font: 'cond', weight: 700, col: lit ? '#9c7a2c' : '#7a6a52', lw: 0, a: clamp(k * 2) }); };
  layer(2.4, () => { pass(spring('Vienna', { stiff: 110, damp: 13 }), H * .32, 'VIE', 'VIENNA', false); pass(spring('Athens', { stiff: 110, damp: 13 }), H * .62, 'ATH', 'ATHENS', true); });
  air('dust', { dens: .5 });
}
#! end

#! scene three_ticks
({ t, at, p, spring, stagger, W, H, u, layer, img, draw, text, ctx, col, lerp, params }) => {
  // the plan's checklist returns: two clauses ticked, the third still open
  layer(1, () => { draw(img('onecoin_art_mood_runway'), W * .5, H * .5, H * 1.1, { a: .5 }); ctx.fillStyle = 'rgba(6,5,4,.5)'; ctx.fillRect(0, 0, W, H); });
  const rows = ['TAKE THE MONEY', 'AND RUN', 'AND BLAME SOMEONE ELSE'], keys = ['money', 'Run'];
  layer(2, () => rows.forEach((r, i) => {
    const y = H * (.28 + i * .18), tk = i < 2 ? spring(at(keys[i]) + .2) : 0, open = i === 2;
    text(r, W * .2, y, { size: 80 * u, font: 'serif', weight: 900, col: open ? col.gold : '#efe2c4', align: 'left', a: open ? .5 + .5 * Math.abs(Math.sin(t * 2.4)) : 1 });
    if (i < 2) { ctx.save(); ctx.translate(W * .14, y - 6 * u); ctx.scale(tk, tk); ctx.strokeStyle = col.gold; ctx.lineWidth = 9 * u; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-26 * u, 0); ctx.lineTo(-6 * u, 22 * u); ctx.lineTo(30 * u, -28 * u); ctx.stroke(); ctx.restore(); }
    else { ctx.strokeStyle = col.gold; ctx.lineWidth = 4 * u; ctx.strokeRect(W * .14 - 26 * u, y - 32 * u, 52 * u, 52 * u); }
  }));
}
#! end

# cine act=fall date="SAT 7 OCTOBER 2017 · LISBON" shot="ews|1.18:pt:.5,.45@Lisbon/dolly" fx="scene:x;plate:onecoin_art_lisbon_chair;air:dust;light:sweep@event|build:x;el:S=txt:STEP 2 · RUN,.5,.16,46,gold;do:S.type@Step"
Step two. On Saturday, the seventh of October, 2017, OneCoin opened a big event in **Lisbon**.

# cine act=fall shot="1.15:pt:.5,.45|1.05:pt:.5,.5@showed/glide" fx="scene:x;plate:onecoin_art_lisbon_chair;air:dust;light:flicker|stamp:NO-SHOW;at:showed;x:.5;y:.3;col:grey;size:120;rot:-8"
Its founder never **showed**.

# cine act=fall bg=onecoin_court_sdny bgBlur=0 bgDim=.35 shot="ws;angle:low|1.15:pt:.5,.35@warrant/rise" fx="date:12 OCT 2017;at:Five;x:.06;y:.12|build:x;el:W=txt:U.S. ARREST WARRANT,.5,.5,68~R=txt:RUJA IGNATOVA,.5,.62,44;do:W.drop@issued~R.rise@arrest"
Five days later, the United States issued a **warrant** for her arrest.

# cine act=fall bg=clip:onecoin_clip_rain_window bgBlur=0 bgDim=.05 shot="1.15:pt:.5,.5|1:pt:.5,.5@tired/glide" fx="lower:KONSTANTIN IGNATOV~Trial testimony;at:brother|build:x;el:T=txt:VERY TIRED,.5,.4,130,gold;do:T.type@tired"
She told her brother she was very **tired**.

# cine act=fall shot="1|1.08:pt:.62,.55@Athens/dolly" fx="code:two_tickets;sfx:foley_book_close@passport~foley_paper@Vienna~foley_paper@Athens"
She had what he called a "big **passport**", and he bought her tickets to Vienna and to Athens.

# cine act=fall bg=world map="23.4,41.8,8" map2="23.6,39.8,8.6" mapAt=Ryanair mapDur=2.4 date="WED 25 OCTOBER 2017" fg="clip:onecoin_clip_takeoff;x:.74;y:.72;h:.28;style:polaroid;at:boarded" shot="ws|1.12:pt:.5,.5@Athens/glide" fx="pin:SOFIA;ll:23.32,42.7;at:Sofia|route:23.32,42.7>23.73,37.98;at:Ryanair;dur:2|pin:ATHENS;ll:23.73,37.98;at:Athens;col:red"
On Wednesday, the twenty-fifth of October, 2017, she boarded a **Ryanair** plane from Sofia to Athens.

# cine act=fall shot="1.15:pt:.36,.5|1.05:pt:.4,.5@bodyguard/drop" fx="scene:x;plate:onecoin_art_airport_dawn;air:dust,rays;light:sun@.8,.25|build:x;el:B=txt:ONE BAG,.72,.3,44~G=txt:ONE BODYGUARD,.72,.4,44;do:B.drop@bag~G.drop@bodyguard"
One bag. One **bodyguard**. [BEAT]

# cine act=fall bg=onecoin_athens_airport bgBlur=0 bgDim=0 bgTone=color shot="ews|1.15:pt:.42,.6@Athens/dolly" fx="pin:ATHENS AIRPORT;ll:23.95,37.94;at:landed|lower:ATHENS INTERNATIONAL AIRPORT~25 October 2017;at:Athens"
She landed in **Athens**.

# cine act=fall shot="ws|1.15:pt:.5,.5@Ignatova/glide" fx="scene:x;plate:onecoin_art_athens_light;air:dust,rays;light:sun@.5,.3|build:x;el:L=txt:LAST CONFIRMED SIGHTING,.5,.16,44;do:L.type@last~L.dim@Ignatova"
And that is the last confirmed sighting of Ruja Ignatova. {hold}

# cine act=after bg=onecoin_art_mood_rain bgBlur=4 bgDim=.5 mid="onecoin_ruja;x:.32;h:.66;tone:bw;at:c1" shot="ws|1.1:1@again/dolly" fx="build:x;el:B=txt:HER BROTHER,.68,.36,49~T=txt:NO CONTACT,.68,.5,96,gold~S=txt:SINCE OCTOBER 2017,.68,.62,44;do:B.drop@brother~T.type@contacted~S.rise@again"
She never contacted her brother **again**.

# cine act=after bg=onecoin_sofia bgBlur=8 bgDim=.4 mid="onecoin_hq_office;x:.66;h:.8;style:print;tape;at:c1;rot:3" shot="1.12:1|1:1@pause/rack" fx="stamp:BUSINESS AS USUAL;at:pause;x:.36;y:.45;col:gold;size:60;rot:-8"
But the company didn't even **pause**.

# cine act=after bg=onecoin_art_mood_lobby bgBlur=6 bgDim=.45 shot="ws|1.06:pt:.5,.45@months/dolly" fx="calendar:x;from:2017-11;n:16;at:ran|build:x;el:F=txt:KONSTANTIN · FORMER FORKLIFT DRIVER,.5,.14,49;do:F.drop@forklift"
Her brother, a former forklift driver, ran it for sixteen more **months**.

# cine act=after shot="ws|1.15:pt:.5,.5@coins/dolly" fx="scene:x;plate:onecoin_art_mood_city;air:bokeh|build:x;el:C=@onecoin_el_gold_coin,.5,.45,.2~Y=txt:INTO 2019,.5,.72,90,gold;do:C.multiply:9@buying~Y.type@coins"
Members kept buying coins into **2019**.

# cine act=after shot="1|1.08:pt:.4,.5@done#2/dolly" fx="code:three_ticks;sfx:foley_marker@money~foley_marker@Run"
Take the money: done. Run: **done**.

# cine act=after bg=onecoin_art_courtroom bgBlur=4 bgDim=.35 shot="1.15:pt:.5,.45|ws@else/whip" hero="BLAME SOMEONE ELSE;at:blame;font:serif;size:96;pos:c;y:.42;col:#e2c27a" sup="STEP 3;at:One;col:#e2c27a"
One step left: blame someone **else**.
