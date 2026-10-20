# Shot library — 60 paste-ready business-documentary shots

Each recipe = when to use it · the frame line · the `# cine` line (one line in the file) · a sample narration line.
Replace ids (`founder`, `plate_factory`…) with your registered images and move every `at:` to the stressed word of YOUR
sentence. Never use the same recipe twice in a row; never more than 3 times per act. All recipes are lint-clean. Ids are placeholders for REAL photos (cut-outs, plates, prints) — the props `@…` are seasoning on top of real images, never instead of them.

---
### Openings & people
**S01 · THE COLD OPEN (end first)** — first 5 s: show the ending, then rewind. Black, one number burns.
`// 0:00 BLACK; "$0" sits in red; on "worth" it burns back into the peak value, gold; subject slaps in on the third`
`# cine act=fall bg=black cam=push solo=1 mid="founder;x:.28;h:.62;at:worth;tone:bw" hero="$0;at:c1;col:red;pos:r;to:$12B;toAt:worth#2;toCol:#c9a227" fx="date:2014;at:ten|flash:white;at:worth#2"`
> This company is worth nothing today. Ten years ago it was worth twelve billion.

**S02 · THE FOUNDER ARRIVES** — introduce a person: rises into frame, nameplate, a date, his world blurred behind.
`# cine act=setup bg=plate_city bgBlur=10 cam=push date="1999" mid="founder;x:.3;h:.64;in:rise;at:ninety;lab:THE FOUNDER" fg="@doc;x:.82;y:.98;h:.28;at:ohio;title:BUSINESS PLAN" hero="ONE IDEA;at:idea;size:130" sup="AND NO MONEY;at:money"`
> In nineteen ninety-nine, a kid from Ohio had one idea. And no money.

**S03 · THE DUO / FACE-OFF** — two people, flipped to face each other, a leading line between them.
`# cine act=setup bg=plate_hq bgBlur=11 cam=drift mid="founder;x:.24;h:.6;at:one;lab:CEO|cofounder;x:.78;h:.58;at:other;flip;lab:CTO" fg="@doc;x:.9;y:.99;h:.24;at:build;title:PROTOTYPE" fx="line:1>2;at:together|stamp:PARTNERS;at:partners;x:.51;y:.24;col:gold;size:70"`
> One had the vision. The other could build it. Together, they were partners.

**S04 · THE NETWORK** — 3–4 people: investors, board, rivals; staggered heights, labels.
`# cine act=rise bg=plate_wallst bgBlur=10 cam=panR mid="investor_a;x:.18;h:.42;at:bankers;lab:GOLDMAN|investor_b;x:.42;h:.48;at:funds|investor_c;x:.66;h:.44;at:even|ceo;x:.86;h:.5;at:him" fg="@cash;x:.5;y:.97;h:.16;at:lined" fx="line:1>4;at:lined|line:3>4;at:him"`
> Bankers, funds, even rivals. Everyone lined up to give him money.

**S05 · THE QUOTE** — a verbatim line, flashback paper, typed in time with the VO.
`# cine act=flash bg=paper cam=hold crash=stage mid="ceo;x:.2;h:.5;at:c1;tone:duo" fg="@doc;x:.85;y:.99;h:.28;at:room" fx="date:2014;at:investors|quote:We are not a taxi company.;at:we;by:CEO, 2014;x:.62;y:.32;rate:.18"`
> He said it on stage, to a room full of investors. We are not a taxi company.

---
### Money & growth
**S06 · THE NUMBER SLAM** — one number that matters, counting, gold, cash landing.
`# cine act=rise bg=plate_wallst bgBlur=9 cam=pull mid="ceo;x:.28;h:.58;at:raised" fg="@coins;x:.62;y:.95;h:.16;at:point|@cash;x:.82;y:.97;h:.17;at:billion" hero="$1.75B;at:raised;fx:count;cdur:2" sup="BEFORE DAY ONE;at:before" fx="flash:gold;at:dollars|stamp:0 SHOWS;at:single;x:.82;y:.6;col:grey"`
> They raised one point seven five billion dollars. Before shooting a single frame.

**S07 · THE HOCKEY STICK** — growth chart drawing up, gold, the label lands on the peak word.
`# cine act=rise bg=chart cam=push crash=number mid="@phone;x:.2;h:.5;at:users;label:APP" fg="@coins;x:.12;y:.97;h:.12;at:month" fx="chart:up;at:users;x:.38;y:.3;w:.5;h:.4;lab:40M USERS;pts:4,6,9,14,22,35,52,74,96;dur:2.2|date:SUMMER 2016;at:summer|stamp:#1;at:america;x:.84;y:.24;col:gold"`
> Users doubled every month. By summer it was the number one app in America.

**S08 · THE EMPIRE MAP** — expansion: subject left, gold leading lines to cut-out stores / logos / cities.
`# cine act=rise bg=navy cam=panR mid="ceo;x:.18;h:.56;at:c1|store_photo;x:.5;h:.3;bottom:.5;at:london;lab:LONDON|store_photo2;x:.8;h:.3;bottom:.55;at:tokyo;lab:TOKYO" fg="@cash;x:.5;y:.98;h:.15;at:year" fx="line:1>2;at:london|line:2>3;at:tokyo|stamp:40 COUNTRIES;at:year;x:.7;y:.78;col:gold;size:64"`
> They opened in London. Then Tokyo. Within a year, forty countries.

**S09 · THE LUXURY LIFE** — the glamour peak: gold everything, hero in serif.
`# cine act=rise bg=plate_mansion bgBlur=12 cam=drift mid="ceo;x:.3;h:.62;at:jet;tone:gold" fg="jet_photo;x:.78;y:.96;h:.26;at:jet" hero="UNTOUCHABLE;at:untouchable;font:serif;size:130" crash=mansion fx="stamp:COVER STAR;at:magazine;x:.76;y:.3;col:gold;size:64|flash:gold;at:untouchable"`
> Private jets, magazine covers, a mansion in Malibu. He was untouchable.

---
### Cracks & doubt
**S10 · THE FIRST CRACK** — the turn: colour drains to teal on "but", a small red X appears.
`# cine act=doubt bg=plate_hq bgBlur=10 cam=pull mid="ceo;x:.32;h:.6;at:c1" fg="@doc;x:.82;y:.99;h:.28;at:numbers;title:Q3 REPORT" hero="-$2;at:story;pos:r;y:.3;size:140;col:paper" sup="PER ORDER;at:order" crash=every fx="stamp:LOSS;at:losing;x:.74;y:.62;col:grey;size:80|shake;at:losing"`
> But inside, the numbers told another story. They were losing money on every order.

**S11 · THE HEADLINE STORM** — 3 clippings hit in rhythm (pattern interrupt; use once per act at most).
`# cine act=doubt bg=news cam=push fx="headline:Is the bubble about to burst?;src:FINANCIAL TIMES;at:papers;x:.3;y:.36;rot:-4|headline:Investors start to ask questions;src:BLOOMBERG;at:investors;x:.66;y:.42;rot:3|headline:Inside the cash burn;src:THE WALL STREET JOURNAL;at:everyone;x:.5;y:.56;rot:-2" fg="@doc;x:.12;y:.99;h:.26;at:smelled" hero="?;at:wrong;pos:r;size:180;col:paper"`
> The papers smelled it first. Then the investors. Then everyone asked what went wrong.

**S12 · THE EXCUSE PARADE** — the leader blames the world; each excuse is struck on the next.
`# cine act=doubt bg=news cam=push mid="ceo;x:.3;h:.66;at:blamed;tone:teal" fg="@doc;x:.85;y:.98;h:.3;at:then#2;rot:8" fx="bubble:COVID!;at:pandemic|bubble:THE PHONES!;at:phones|bubble:THE USERS!;at:everyone|strike:b1;at:then|strike:b2;at:everyone|strike:b3;at:himself|shake;at:himself"`
> He blamed the pandemic. Then the phones. Then everyone but himself.

**S13 · THE RIVAL ARRIVES** — a competitor slides in from the right, the hero is challenged.
`# cine act=doubt bg=navy cam=panL mid="ceo;x:.26;h:.6;at:c1|rival;x:.76;h:.62;in:slideR;at:then;flip;lab:THE RIVAL" fg="@coins;x:.8;y:.97;h:.12;at:product" crash=same fx="line:2>1;at:half|stamp:HALF PRICE;at:half;x:.76;y:.24;col:gold;size:72"`
> Then a rival showed up. Same product. Half the price.

**S14 · THE BOARDROOM** — power struggle; board members staggered, one stamp.
`# cine act=doubt bg=plate_boardroom bgBlur=11 cam=hold mid="board_a;x:.2;h:.42;at:board|board_b;x:.42;h:.46;at:board+.2|board_c;x:.64;h:.44;at:board+.4|ceo;x:.86;h:.56;at:him;flip" fg="@doc;x:.5;y:.99;h:.26;at:vote;title:RESOLUTION" fx="line:3>4;at:against|stamp:VOTED OUT;at:out;x:.5;y:.26;col:grey;size:90"`
> The board met in secret. They voted against him. He was out.

---
### Collapse
**S15 · THE DEATH** — black, red creep, the subject shatters, the number burns to zero.
`# cine act=fall bg=black cam=push mid="ceo;x:.26;h:.58;at:six" fg="@arrowdown;x:.86;y:.92;h:.24;at:billion" hero="$1.75B;at:one;pos:r;to:$0;toAt:gone;toCol:red" fx="date:OCT 2020;at:six;x:.06;y:.12|shatter:1;at:shut|red;at:later|flash:red;at:gone"`
> Six months later, Quibi shut down. One point seven five billion dollars. Gone.

**S16 · THE CRASH CHART** — the stock/valuation falls; the label is the loss.
`# cine act=fall bg=chart cam=pull mid="ceo;x:.2;h:.5;at:c1;tone:red" fg="@arrowdown;x:.9;y:.92;h:.22;at:ninety" fx="chart:down;at:shares;x:.38;y:.3;w:.5;h:.42;lab:-90%;pts:96,92,80,85,60,42,30,18,9;dur:2|red;at:shares|shake;at:ninety"`
> In one year, the shares fell ninety percent.

**S17 · THE COURTROOM / THE FILING** — documents as evidence (court, bankruptcy, SEC).
`# cine act=fall bg=plate_court bgBlur=12 cam=push mid="ceo;x:.28;h:.58;at:filed;tone:red" fg="@doc;x:.74;y:.9;h:.5;at:chapter;title:CHAPTER 11" fx="date:MONDAY, 9:00 AM;at:monday|stamp:BANKRUPT;at:bankruptcy;x:.74;y:.5;size:96;rot:-12|flash:red;at:bankruptcy"`
> On a Monday morning, the company filed for Chapter Eleven bankruptcy.

**S18 · ONE WORD ON BLACK** — the silent beat before/after the biggest hit (0.4 s silence before it in the VO).
`# cine act=fall bg=black cam=hold solo=1 hero="GONE.;at:gone;col:red;pos:c;size:180" vig=.7`
> Gone.

---
### Aftermath & lesson
**S19 · THEN vs NOW** — same person/place, past (teal) left vs present (grey) right.
`# cine act=after bg=navy cam=drift mid="ceo;x:.26;h:.58;at:then;tone:teal;lab:2014|ceo;x:.74;h:.58;at:today;tone:navy;flip;lab:2024" fg="@coins;x:.85;y:.97;h:.12;at:lost" crash=economy fx="date:2014;at:face|line:1>2;at:today|stamp:-$40B;at:lost;x:.5;y:.24;col:grey;size:80"`
> Then, he was the face of a new economy. Today, he has lost forty billion.

**S20 · THE LEDGER** — what the story cost, as a receipt of numbers (≤ 3 items).
`# cine act=after bg=paper cam=push fg="@doc;x:.22;y:.9;h:.55;at:c1;title:THE BILL" hero="$5B;at:lost;fx:count;pos:r;col:#101c2e" sup="3,000 JOBS;at:jobs;col:red" fx="flash:white;at:dollars|stamp:LAID OFF;at:thousand;x:.7;y:.75;size:70"`
> In the end, investors lost five billion dollars. Three thousand people lost their jobs.

**S21 · THE VERDICT (THE POISON PILL)** — the thesis lands: one red word, the pill drops and breaks.
`# cine act=lesson bg=spot cam=pull mid="press_clip;x:.2;h:.3;bottom:.72;at:money;style:torn;tape;tone:bw;rot:-5" fg="@coins;x:.86;y:.96;h:.12;at:buy|@pill;x:.5;y:.76;h:.14;at:poison" hero="ARROGANCE;at:arrogance;col:red;x:.64;y:.36" sup="IS THE REAL POISON PILL;at:real" fx="strike:1;at:fit|drop:pill;at:poison"`
> Money can't buy product-market fit. Arrogance is the real poison pill.

**S22 · THE OPEN LOOP / NEXT CASE** — the last 8 s tease the next episode (before the end card).
`# cine act=setup bg=plate_next bgBlur=12 cam=push crash=hundred mid="next_ceo;x:.7;h:.6;at:next;flip" fg="@doc;x:.2;y:.98;h:.3;at:case;title:CASE #12|@cash;x:.5;y:.98;h:.15;at:made" hero="NEXT;at:next;pos:l" sup="THE $100B MISTAKE;at:mistake" fx="stamp:TWICE;at:twice;x:.3;y:.7;col:gold;size:72"`
> Next time: the case of the company that made a one hundred billion dollar mistake. Twice.

---
## v2 signature shots (S25–S36) — real data, real documents, real footage

**S25 · THE EXPANSION MAP** — real borders, the camera flies, countries light up gold as the VO names them.
`# cine act=rise bg=world map="-100,38,2.2" map2="10,35,1.3" hl="United States of America,United Kingdom,Japan" hlAt=london cam=hold fx="pin:LOS ANGELES;ll:-118.2,34;at:launched|route:-118.2,34>-0.1,51.5;at:london|pin:LONDON;ll:-0.1,51.5;at:london+.6|route:-0.1,51.5>139.7,35.7;at:tokyo|pin:TOKYO;ll:139.7,35.7;at:tokyo+.8;side:-1|stamp:1 YEAR;at:year;x:.5;y:.74;col:gold;size:64" fg="store_photo;x:.12;y:.99;h:.26;at:angeles;style:polaroid;rot:-6"`
> It launched in Los Angeles. Then London. Then Tokyo, all in one year.

**S26 · ARCHIVE FOOTAGE ON A TV** — a real news/ad clip plays inside a CRT, market ticker on top.
`# cine act=doubt bg=news cam=pull mid="clip:news_clip;x:.36;h:.5;bottom:.72;style:tv;tone:color;at:c1" fg="@doc;x:.85;y:.98;h:.26;at:news" fx="ticker:QUIBI ▼ -42%~NETFLIX ▲ +3%~DISNEY+ ▲ +12%;at:c1|spot:1;at:changed|timeline:2018,2019,2020,2021;cur:2020;at:april"`
> On the evening news, the story changed by April.

**S27 · THE EVIDENCE** — a real document scan; the key line is highlighted, then magnified.
`# cine act=doubt bg=news cam=push mid="doc_scan;x:.32;h:.62;at:memo;style:print;tone:bw;rot:-3" fg="@coins;x:.88;y:.97;h:.12;at:said" fx="mark:1;r:.08,.42,.9,.5;at:read|lens:1;r:.5,.46;z:2.4;at:read+.4;x:.72;y:.42|stamp:LEAKED;at:leaked;x:.75;y:.75;col:grey;size:70"`
> A leaked memo said it all. Read the second line.

**S28 · THE TIME JUMP** — whip + the timeline marker races across years.
`# cine act=setup bg=plate_city bgBlur=11 cam=panR trans=whip mid="founder;x:.3;h:.6;at:years;tone:bw" fg="@doc;x:.85;y:.98;h:.26;at:later" hero="$4B;at:worth;fx:count;pos:r" crash=ohio fx="timeline:1999,2004,2009,2014;from:1999;cur:2009;at:ten;dur:1.4|date:2009;at:later"`
> Ten years later, the kid from Ohio ran a company worth billions.

**S29 · THE LEDGER** — the receipt of the story: rows tick in, the total slams red.
`# cine act=after bg=paper cam=hold crash=hundred mid="ceo;x:.24;h:.56;at:c1;tone:halftone" fg="@coins;x:.1;y:.97;h:.12;at:sold" fx="tally:Raised=$1.75B~Sold to Roku=<$100M~Lasted=6 months;at:raised;rate:.9;total:-94%;x:.66;y:.24;w:.36|split:BEFORE>AFTER;at:c1"`
> Raised one point seven five billion. Sold for under one hundred million.

**S30 · THE KINETIC THESIS** — the thesis line builds word by word on black, the last word red, film burn.
`# cine act=fall bg=black cam=push solo=1 fx="kin:THE REAL POISON PILL;at:the;hl:4|burn;at:pill"`
> The real poison pill was arrogance.

**S31 · BEFORE / AFTER** — same face, halftone past vs colour present, split line.
`# cine act=after bg=navy cam=drift mid="ceo;x:.26;h:.58;at:then;tone:halftone;lab:2014|ceo;x:.74;h:.58;at:today;tone:bw;flip;lab:2024" fg="@coins;x:.85;y:.97;h:.12;at:lost" crash=economy fx="date:2014;at:face|split:THEN>NOW;at:then|stamp:-$40B;at:lost;x:.5;y:.24;col:grey;size:80|line:1>2;at:today"`
> Then, he was the face of a new economy. Today, he has lost forty billion.

**S32 · THE CASE FILE (episode signature, right after the cold open)**
`# ppcase n=07 title="Quibi" sub="The $1.75B bet" photo=katzenberg stamp=CLOSED stampAt=2.2`
> Case number seven. Quibi.

**S33 · THE MARKET** — the ticker runs, the chart crashes, the subject in red.
`# cine act=fall bg=chart cam=pull mid="ceo;x:.2;h:.5;at:c1;tone:red" crash=morning fg="@arrowdown;x:.9;y:.92;h:.22;at:wiped" fx="stamp:SELL;at:third;x:.82;y:.72;size:70|ticker:STOCK ▼ -31%~NASDAQ ▼ -3%~RIVAL ▲ +8%;at:c1|chart:down;at:opened;x:.38;y:.32;w:.5;h:.4;lab:-31%;pts:90,88,86,60,44,40,38;dur:1.6|shake;at:wiped"`
> The market opened. In one morning, a third of the company was wiped out.

**S34 · THE CULPRIT** — four faces; the light finds one.
`# cine act=doubt bg=plate_boardroom bgBlur=11 cam=push mid="board_a;x:.18;h:.44;at:four|board_b;x:.4;h:.46;at:four+.2|board_c;x:.62;h:.44;at:four+.4|ceo;x:.84;h:.54;at:one;flip" fg="@doc;x:.5;y:.99;h:.24;at:room" fx="spot:4;at:one|stamp:HE SIGNED;at:signed;x:.6;y:.24;col:grey;size:64"`
> Four people were in the room. Only one signed the deal.

**S35 · THE FLASHBACK BURN** — the film burns into the past: paper, halftone, typed date.
`# cine act=flash bg=paper cam=pull mid="founder;x:.3;h:.6;at:years;tone:halftone" fg="@doc;x:.82;y:.99;h:.28;at:letter;title:1997" fx="burn;at:c1|date:SUMMER 1997;at:back|quote:We will never sell this company.;at:wrote;x:.66;y:.3;by:Founder, 1997;rate:.2"`
> Go back twenty years. In a letter, the founder wrote: we will never sell this company.

**S36 · THE GLOBE PULL-BACK** — from one city to the whole planet as the scale lands.
`# cine act=rise bg=world map="-122.4,37.8,9" map2="0,20,1" hl="United States of America,Brazil,India,Germany,Japan,Australia" hlAt=countries cam=hold fx="pin:SAN FRANCISCO;ll:-122.4,37.8;at:c1|date:TODAY;at:today|stamp:190 COUNTRIES;at:countries;x:.5;y:.72;col:gold;size:80" fg="store_photo;x:.14;y:.99;h:.26;at:apartment;style:polaroid;rot:-5|@coins;x:.88;y:.97;h:.12;at:use"`
> It started in one apartment in San Francisco. Today, one hundred ninety countries use it.

---
## v3 signature shots (S37–S60) — annotation, evidence, data, paper, atmosphere

**S37 · THE MARKER BREAKDOWN** (Vox/Harris) — a real page, circled, arrowed, underlined in rhythm.
`# cine act=doubt bg=news cam=push mid="doc_scan;x:.34;h:.62;at:c1;style:print;tone:bw;rot:-2" fg="@coins;x:.9;y:.97;h:.12;at:numbers" fx="circle:1;r:.1,.4,.6,.55;at:look|arrow:.82,.2>.58,.42;at:here;lab:HERE|underline:.6,.78,.92;at:numbers;col:gold"`
> Look at this page. Right here. These are the real numbers.

**S38 · THE REDACTION** — black bars over the document, then the truth slides out.
`# cine act=doubt bg=navy cam=pull mid="doc_scan;x:.36;h:.62;at:c1;style:print;tone:bw" fg="@doc;x:.88;y:.98;h:.24;at:hid" fx="redact:1;at:hid;reveal:until|scan:1;at:until|stamp:CLASSIFIED;at:hid+.6;x:.76;y:.3;col:grey;size:64"`
> They hid the key lines from investors, until a court made them public.

**S39 · THE INVESTIGATION BOARD** — real faces pinned, red string connects them one by one.
`# cine act=doubt bg=cork cam=hand mid="ceo;x:.18;h:.36;bottom:.5;at:c1;style:print;tape|investor_a;x:.5;h:.34;bottom:.46;at:investor;style:print;tape|rival;x:.82;h:.36;bottom:.52;at:rival;style:print;tape" fg="doc_scan;x:.5;y:.99;h:.3;at:deal;style:polaroid;rot:4" fx="string:1>2>3;at:investor;rate:.8|stamp:CONNECTED;at:deal;x:.5;y:.7;col:grey;size:60"`
> The CEO. His investor. And his biggest rival. All in the same deal.

**S40 · THE RIP** — a real photo of two partners tears in half on "split".
`# cine act=fall bg=black cam=push mid="cofounder_photo;x:.5;h:.6;at:c1;style:print;tone:bw" fg="@doc;x:.88;y:.98;h:.24;at:lawyers" fx="rip:1;at:split;dur:1|letterbox;at:c1|flash:red;at:split"`
> Ten years together. Then the split. Then the lawyers.

**S41 · THE BURNING PHOTO** — the past burns away from the edges.
`# cine act=fall bg=black cam=pull mid="ceo;x:.4;h:.6;at:c1;tone:sepia" fg="@arrowdown;x:.86;y:.92;h:.22;at:legacy" fx="burnaway:1;at:burned;dur:1.8|embers;at:c1|smoke;at:c1"`
> Everything he had built burned. Even the legacy.

**S42 · THE MATCH STACK** (Johnny Harris) — the same phrase on a dozen real screenshots, faster and faster.
`# cine act=doubt bg=news cam=hold solo=1 fx="matchstack:press_1,press_2,shot_b,shot_c,doc_scan,press_1,press_2,shot_b;at:everyone;x:.5;y:.45;h:.55;step:.55;accel:.9|stamp:SAME STORY;at:same#4;x:.5;y:.82;col:grey;size:60"`
> Everyone wrote the same story. Same words. Same headline. Same story.

**S43 · THE POLAROID SPREAD** — the people of the story drop onto the table one by one.
`# cine act=setup bg=wood cam=pull fx="polaroids:founder,cofounder,investor_a,rival;at:c1;rate:.5" fg="@coins;x:.9;y:.97;h:.12;at:money"`
> Four people. One idea. And a lot of money.

**S44 · THE BAR RACE** — the subject against the giants, its bar in red.
`# cine act=rise bg=navy cam=orbit crash=quibi fx="bars:Netflix=$29B~Disney+=$22B~Quibi=$1.75B;at:netflix;hl:3;x:.32;w:.5;rate:1.4|stamp:-94%;at:five;x:.16;y:.62;col:grey;size:56|donut:2;at:share;x:.8;y:.38;lab:MARKET SHARE" fg="@coins;x:.9;y:.97;h:.12;at:share"`
> Netflix spent twenty nine billion. Quibi had one point seven five. A market share of two.

**S45 · NINE IN TEN** — unit chart of people, the failures turn red.
`# cine act=after bg=navy cam=push fx="dots:9/10;at:nine;people;cols:10;gap:90;x:.28;y:.36;col:red;lab:9 IN 10 FAIL|stamp:FAIL;at:fail;x:.28;y:.78;size:60|odo:1750000000;at:billion;pre:$;x:.72;y:.4;size:70" fg="doc_scan;x:.9;y:.99;h:.26;at:burned;style:polaroid;rot:6"`
> Nine in ten startups fail. This one burned one point seven five billion doing it.

**S46 · THE ODOMETER** — money spinning on a mechanical counter.
`# cine act=rise bg=chart cam=push mid="ceo;x:.2;h:.5;at:c1" fg="@cash;x:.86;y:.97;h:.16;at:day" fx="odo:1000000;at:million;pre:$;x:.6;y:.4;size:100;lab:EVERY DAY|pulse;at:day"`
> They were burning one million dollars, every single day.

**S47 · THE CALENDAR OF DOOM** — every day crossed out.
`# cine act=fall bg=black cam=pull fg="@arrowdown;x:.9;y:.9;h:.2;at:dead" fx="days:180;at:days;x:.3;y:.24;cols:30;cell:28;dur:2.4|stamp:DEAD;at:dead;x:.72;y:.74;size:80"`
> One hundred eighty days. That is how long it took to be dead.

**S48 · VERSUS** — two numbers slam from the sides.
`# cine act=doubt bg=navy cam=pull fx="versus:Quibi=6 months~Vine=4 years;at:quibi|flow:Raise money>Make shows>!Nobody watches;at:raise;y:.72;rate:.7" fg="doc_scan;x:.9;y:.99;h:.26;at:raise;style:polaroid;rot:5"`
> Quibi lasted six months. Raise money, make shows, nobody watches.

**S49 · THE BUSINESS MODEL** — the money machine as a flow, the broken step in red.
`# cine act=doubt bg=chart cam=drift fx="flow:Users>Subscriptions>Content>!No profit;at:users;rate:.8;y:.42|coinflow:1>2;at:money" fg="doc_scan;x:.88;y:.99;h:.26;at:money;style:polaroid;rot:5" mid="@phone;x:.12;h:.34;bottom:.9;at:users;label:APP"`
> Users pay subscriptions. Subscriptions pay for content. The money never came back.

**S50 · THE MEMO** — a memo types itself, the stamp lands when it ends.
`# cine act=setup bg=paper cam=push mid="ceo;x:.2;h:.5;at:c1;tone:sepia;in:develop" fx="memo:We will not make a free tier. Quality costs money and viewers will pay for it.;at:wrote;head:INTERNAL MEMO;meta:TO: All staff~FROM: CEO~DATE: Jan 2020;stamp:WRONG;rate:.03" fg="@coins;x:.1;y:.97;h:.1;at:everyone"`
> In January, the boss wrote a memo to everyone.

**S51 · THE SPINNING NEWSPAPER** — the classic: a front page spins in and lands.
`# cine act=doubt bg=news cam=push fx="spin:Quibi shuts down after six months;src:THE DAILY LEDGER;date:OCTOBER 21, 2020;at:c1;photo:katzenberg|smoke;at:c1" fg="@doc;x:.9;y:.99;h:.22;at:said"`
> The headlines said it all.

**S52 · THE SEARCH BAR** — the question millions typed, then the notification.
`# cine act=doubt bg=navy cam=drift fx="search:what happened to quibi;at:c1;res:Quibi shuts down — 6 months after launch~Why Quibi failed~Quibi sold to Roku|notify:QUIBI~Your subscription has ended;at:ended;y:.8" fg="katzenberg;x:.88;y:1.02;h:.36;at:asked;tone:bw"`
> Millions asked the same question. Your subscription has ended.

**S53 · THE STOCK CARD & LAYOFFS** — ticker card, crowd of staff, most fade red, sirens.
`# cine act=fall bg=chart cam=push fg="doc_scan;x:.12;y:.99;h:.26;at:fell;style:polaroid;rot:-5" fx="stockcard:QBI~$12.40~-31%;at:c1;x:.3|crowd:200;at:staff;cols:20;x:.72;y:.22;size:20;gone:laid;fade:60;lab:STAFF|siren;at:laid|seal:VOID;at:void;x:.3;y:.7"`
> The stock fell. Two hundred staff, then most laid off. The deal was void.

**S54 · THE MONEY RAIN** — glamour peak: cash falls, light rays, confetti.
`# cine act=rise bg=quibi_bg_hollywood bgBlur=10 cam=rise mid="katzenberg;x:.28;h:.6;at:c1;tone:gold" fg="@cash;x:.84;y:.97;h:.18;at:party" fx="moneyrain;at:money|rays;at:c1|confetti;at:party|stamp:SOLD OUT;at:sold;x:.74;y:.3;col:gold;size:70"`
> The money poured in. A launch party. Ads sold out before launch.

**S55 · THE RECEIPT** — what it cost, line by line, printed.
`# cine act=after bg=navy cam=pull mid="ceo;x:.26;h:.56;at:c1;tone:bw" fx="receipt:Content=$1.1B~Marketing=$400M~Tech=$250M;at:spent;total:$1.75B;x:.74|gauge:92;at:risk;x:.26;y:.86;size:110;lab:RISK" fg="@coins;x:.5;y:.97;h:.12;at:tech"`
> What they spent: content, marketing, tech. And the risk was ninety two percent.

**S56 · THE LOWER THIRD INTRODUCTION** — documentary name super on a real face.
`# cine act=setup bg=quibi_bg_hollywood bgBlur=10 cam=push mid="katzenberg;x:.66;h:.72;at:c1;tone:bw" fg="@doc;x:.12;y:.98;h:.24;at:dreamworks" crash=katzenberg fx="circle:1;r:.25,.02,.75,.32;at:katzenberg|lower:Jeffrey Katzenberg~Co-founder, DreamWorks;at:jeffrey|callout:THE DEALMAKER;on:1;at:dealmaker;x:.3;y:.3"`
> Meet Jeffrey Katzenberg. The dealmaker of DreamWorks.

**S57 · THE SILHOUETTE** — the unknown player: a black shadow, spotlight, a question.
`# cine act=doubt bg=spot cam=push mid="ceo;x:.5;h:.62;at:c1;tone:shadow" fg="@doc;x:.88;y:.98;h:.24;at:deal" hero="?;at:who;pos:r;size:200;col:paper" fx="spot:1;at:c1|stamp:UNKNOWN;at:deal;x:.24;y:.7;col:grey;size:60"`
> But who was really behind the deal?

**S58 · THE VHS ARCHIVE** — an era look: VHS overlay, halftone photo, typed date.
`# cine act=flash bg=paper cam=pull mid="founder;x:.32;h:.6;at:c1;tone:halftone" fg="@doc;x:.86;y:.98;h:.26;at:tape" crash=seven fx="vhs:REC 1997;at:c1|date:SUMMER 1997;at:back|burn;at:c1|underline:.2,.86,.6;at:tape;col:gold" trans=burn`
> Go back to nineteen ninety seven. It is all on tape.

**S59 · THE VERTIGO REVEAL** — the world stretches behind the subject as the truth lands.
`# cine act=fall bg=plate_hq bgBlur=8 cam=vertigo mid="ceo;x:.5;h:.66;at:c1;tone:bw" fg="@arrowdown;x:.86;y:.92;h:.22;at:knew" hero="HE KNEW;at:knew;pos:t;col:red" fx="pulse;at:c1;col:red|focus:1;at:realised"`
> And that is when he realised. He knew all along.

**S60 · THE INFINITE ZOOM** — zoom into a detail of the photo and smash into the next scene.
`# cine act=setup bg=plate_city bgBlur=10 cam=push mid="doc_scan;x:.4;h:.62;at:c1;style:print;tone:bw" fg="@coins;x:.88;y:.97;h:.12;at:address" fx="circle:1;r:.5,.3,.7,.5;at:address|arrow:.85,.2>.62,.36;at:letter|stamp:HQ;at:everything;x:.8;y:.72;col:gold;size:60|zoomto:1;r:.6,.4;z:6;at:there;dur:.5" trans=slam`
> Look at the address on the letter. Everything started there.

### Rhythm devices
**S23 · THE BURST (6–10 cuts in 4 s)** — write 6 one-word/very short lines, one `# cine` each, `dur=.6`, alternating sides, hard cuts; e.g. a montage of acquisitions, each a cut-out + a gold stamp of the price. Use once every 2–3 minutes.
**S24 · THE COUNTER CLOCK** — a running number across several beats ("$1M a day" → `hero` count in each beat with a growing value, same position) to make time felt. Keep the hero position fixed so the cuts feel like one clock.
