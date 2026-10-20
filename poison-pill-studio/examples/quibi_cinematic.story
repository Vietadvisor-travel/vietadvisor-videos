title: Quibi — The $1.75 Billion Bet That Died in 6 Months (60 s demo)
channel: poisonpill
voice: am_michael
music: none
length: demo
sources: https://en.wikipedia.org/wiki/Quibi — verify each number on 2 sources before render (raise, launch date, shutdown date, quote)
// THESIS   Quibi didn't die from lack of money. It died from arrogance.
// CURVE    hope 0–8 s → glamour 8–20 s → doubt 20–36 s → collapse 36–50 s → lesson 50–60 s
// PALETTE  setup warm · rise gold · doubt teal · fall red creeps in · lesson navy spot
// PHOTOS   real cut-outs (Katzenberg, Whitman), plates (Hollywood, Wall St), prints (app screens, press clippings) — props only as seasoning
// RHYTHM   a new visual event every ≤ 1.5 s, locked to the stressed word; 6 of 7 cuts are hard cuts, 1 whip

// 0:00 HOOK — WIDE, blurred Hollywood plate; two BW cut-outs slap on the thirds on "two" / "legends"; date types in;
//      "$1.75B" counts up and slams on "billion"; gold support line on "crazy"; cash stack lands in the bottom band.
# cine act=setup bg=quibi_bg_hollywood bgBlur=10 bgDim=.5 cam=push date="APRIL 2020" mid="katzenberg;x:.24;h:.6;at:two;lab:JEFFREY KATZENBERG|whitman;x:.78;h:.58;at:legends;lab:MEG WHITMAN;flip" fg="@cash;x:.5;y:.97;h:.17;at:dollars" hero="$1.75B;at:billion;pos:c;y:.3;fx:count" sup="ON ONE IDEA;at:crazy" fx="stamp:ALL IN;at:bet;x:.5;y:.62;col:gold;size:70"
In twenty twenty, two Hollywood legends bet one point seven five billion dollars on a crazy idea.

// 0:06 THE DREAM — hard cut, MEDIUM: phone prop centre-left with QUIBI, three stamps hit on "phone" / "ten" / "Hollywood"
# cine act=rise bg=quibi_bg_hollywood bgBlur=12 bgDim=.6 cam=panR mid="@phone;x:.3;h:.6;at:shows;label:QUIBI;rot:-4" fg="quibi_app_screens;x:.12;y:.99;h:.3;at:quality;style:polaroid;rot:-7" hero="10 MIN;at:ten;pos:r;col:gold" fx="stamp:PHONE ONLY;at:phone;x:.72;y:.62;col:gold;rot:-6|stamp:HOLLYWOOD;at:hollywood;x:.74;y:.78;col:gold;rot:5|line:1>2;at:quality"
Shows made only for your phone. Ten minutes or less. Hollywood quality.

// 0:12 THE MONEY — WHIP; Wall Street plate goes gold; counter climbs on "raised"; coins + cash in FG; crash zoom on "single"
# cine act=rise bg=quibi_bg_wallst bgBlur=9 cam=pull trans=whip mid="katzenberg;x:.3;h:.56;at:raised" fg="@coins;x:.62;y:.95;h:.16;at:point|@cash;x:.82;y:.97;h:.17;at:billion" hero="$1.75B;at:raised;fx:count;cdur:2" sup="BEFORE DAY ONE;at:before" fx="flash:gold;at:dollars|stamp:0 SHOWS;at:single;x:.82;y:.6;col:grey" crash=single
They raised one point seven five billion dollars. Before shooting a single frame.

// 0:19 THE LAUNCH — hard cut, colour turns teal; date types; downloads chart draws itself DOWN; FLOP stamp grey on "nobody"
# cine act=doubt bg="wall:quibi_press_1,quibi_press_2,quibi_bg_hollywood" bgBlur=9 bgDim=.55 cam=drift date="APRIL 6, 2020" mid="@phone;x:.2;h:.5;at:app;label:QUIBI" fg="@arrowdown;x:.9;y:.9;h:.2;at:nobody" fx="chart:down;at:launches;x:.42;y:.36;w:.46;h:.36;lab:DOWNLOADS;pts:60,72,64,48,40,30,24,20|stamp:FLOP;at:nobody;x:.66;y:.3;col:grey;size:110"
April twenty twenty. The app launches. And… nobody cares.

// 0:25 THE EXCUSES — hard cut, MEDIUM CLOSE: Katzenberg left third, news wall behind; three bubbles pop on each excuse,
//      each gets a red X on the NEXT excuse; last X lands on "himself" with a shake.
# cine act=doubt bg=news cam=push mid="katzenberg;x:.3;h:.66;at:blamed;tone:teal" fg="@doc;x:.85;y:.98;h:.3;at:then#2;rot:8" fx="bubble:COVID!;at:pandemic|bubble:THE PHONES!;at:phones|bubble:THE USERS!;at:everyone|strike:b1;at:then|strike:b2;at:everyone|strike:b3;at:himself|shake;at:himself"
Katzenberg blamed the pandemic. Then the phones. Then everyone but himself.

// 0:31 THE QUOTE — hard cut, paper flashback; real quote typed word by word, attribution in gold (VERIFY wording + source)
# cine act=flash bg=paper cam=hold crash=virus mid="katzenberg;x:.2;h:.5;at:c1;tone:duo" fg="@doc;x:.84;y:.99;h:.28;at:said" fx="quote:I attribute everything that has gone wrong to coronavirus.;at:everything;x:.62;y:.3;by:Jeffrey Katzenberg, 2020;rate:.16"
He said it out loud. Everything that went wrong, he said, was the virus.

// 0:38 THE DEATH — hard cut to BLACK; red creeps from the edges; Whitman cut-out shatters on "shut";
//      "$1.75B" burns on "billion" and becomes "$0" on "gone" with a red flash and a sub drop.
# cine act=fall bg=black cam=push mid="whitman;x:.26;h:.58;at:six" fg="@arrowdown;x:.86;y:.92;h:.24;at:billion" hero="$1.75B;at:one;pos:r;to:$0;toAt:gone;toCol:red" fx="date:OCT 2020;at:six;x:.06;y:.12|shatter:1;at:shut|red;at:later|flash:red;at:gone"
Six months later, Quibi shut down. One point seven five billion dollars. Gone.

// 0:48 THE LESSON — hard cut, navy spotlight; ARROGANCE slams red; the pill drops from the top on "poison" and breaks;
//      gold support line; then the channel end card (automatic).
# cine act=lesson bg=spot cam=pull mid="quibi_press_1;x:.2;h:.3;bottom:.72;at:money;style:torn;tape;tone:bw;rot:-5" fg="@coins;x:.86;y:.96;h:.12;at:buy|@pill;x:.5;y:.76;h:.14;at:poison" hero="ARROGANCE;at:arrogance;col:red;x:.64;y:.36" sup="IS THE REAL POISON PILL;at:real" fx="strike:1;at:fit|stamp:NO FIT;at:fit+.3;x:.8;y:.2;col:grey;size:64|drop:pill;at:poison"
Money can't buy product-market fit. Arrogance is the real poison pill.

# ppend
