title: Egg coffee: the drink Hà Nội made when the milk ran out
format: story
charstyle: retro
voice: am_michael
music: cafe
sources: Mental Floss, "A Brief History of Vietnamese Egg Coffee" (1946, Metropole, milk shortage); TrvLogue, Café Giảng (39 Nguyễn Hữu Huân, 45,000 ₫ — TO VERIFY before render). Dialogue and the people Giảng, Lacroix, Hải, Cô Phở are dramatized.
cast: giang = man elder skin=4 hair=short:grey top=longsleeve:white bottom=wide:black glasses=round name="Ông Giảng"
cast: lacroix = man skin=2 hair=short:brown top=longsleeve:white bottom=wide:white name="Lacroix"
cast: copho = woman skin=4 hair=bun:black top=polo:#b84a2e bottom=longskirt:black name="Cô Phở"
cast: hai = man skin=4 hair=short:black top=tee:white bottom=jeans:blue name="Hải"
set: metro1946 = kit=room wall=#5a3a22 floor=#2e1e12 window=night deco=lanterns
set: back_kitchen = kit=room wall=#d8c9a8 floor=#7a5a3a window=night
set: market1946 = sky=day far=town mid=market ground=pavement deco=stalls,flags palette=hanoi
set: cafe_now = kit=room wall=#c9a46a floor=#6a4a2e window=day
// angle:   the milk did not come, so a bartender whipped an egg into his coffee — and it stayed
// viewer:  first-timers in Hà Nội who see egg coffee on a menu and want to know what it is
// format:  story — period then present, one continuous camera, a running gag (Dave and the milk)
// hook:    "This coffee has a raw egg in it. On purpose." over a close-up of the foam
// payoff:  the price (~45,000 ₫, ~$2), how to drink it (sip the top, don't stir), and a teaser for Ep. 3
// structure: hook → 1946 period → whisk → first sip → street → present-day counter → gag → payoff → teaser
// design:  storybook charstyle (warm, soft, fine line) — fits a history with a modern frame
// curve:   curiosity → period tension → humour in the present → quiet warmth at the payoff; peaks at the steam moment and the first sip

# hook place=sidewalk hero=dave mood=shocked text="Coffee with a raw egg. On purpose." shot=CU on=dave
This coffee has a raw egg in it.
On purpose.

# title variant=place place=metro1946 text="HANOI, 1946|THE MILK IS GONE" sub="egg coffee, part two"
Hanoi, 1946. The war has just started.
And the milk is gone.

# dialogue a=lacroix b=giang place=metro1946 time=night voiceA=bm_george voiceB=am_adam lines="a:thinking:A café au lait, please.|b:sad:No milk tonight, monsieur.|a:angry:Then what is it? Coffee with nothing?|b:determined:Give me a moment."

# moment kind=steam dish=caphe_trung
He cracked an egg and whisked the yolk with sugar.
Thick and pale, the way you'd whip cream. No milk needed.

# gag place=metro1946 hero=lacroix hold=caphe_trung react=yummy punch="ENCORE!"
The officer took one sip.
Then he asked for another.

# talk place=market1946 host=giang mood=determined extras=crowd cam=pushIn fg=crowd
Outside, the market was nearly empty.
He bought every egg it had.

# dialogue a=hai b=giang place=back_kitchen time=night voiceA=am_puck voiceB=am_adam lines="a:nervous:They'll fine us for this, Mr Giảng.|b:determined:People still need their coffee."

# timelapse place=oldquarter times="day,sunset,night"
It wasn't a trend. It was a Tuesday, and there was no milk.

# title variant=place place=sidewalk text="TODAY|SAME STREET" sub="Nguyễn Hữu Huân"
Today, the drink is still on the menu.

# dialogue a=dave b=copho place=cafe_now voiceA=am_puck voiceB=af_heart lines="a:happy:Hi! One egg coffee, please. Can I get milk in it?|b:neutral:No milk.|a:surprised:Oh. Like 1946?|b:smug:No milk since 1946."

# talk place=cafe_now host=copho mood=happy pose=present prop=caphe_trung cam=breathe
The trick is not the egg.
It is the patience.

# gag place=sidewalk hero=dave hold=caphe_trung react=shocked reactPose=scared punch="DON'T STIR!"
Dave stirred it. The foam collapsed.

# dialogue a=dave b=copho place=cafe_now voiceA=am_puck voiceB=af_heart lines="a:thinking:What? I was stirring it.|b:neutral:Sip the top first. Do not stir."

# gag place=cafe_now hero=dave hold=caphe_trung react=yummy punch="TIRAMISU?!"
It tastes like tiramisu.
Why does it taste like tiramisu?

# montage places="hanoi,oldquarter,sidewalk" labels="1946|1954|TODAY" seg=0.9
The drink left the hotel and went out to the street.
People made it at home and sold it at small tables.

# dialogue a=dave b=copho place=cafe_now voiceA=am_puck voiceB=af_heart lines="a:cool:Is this just a gimmick? Egg in coffee sounds like a dare.|b:smug:A gimmick is quitting coffee when there's no milk. This is making something new."

# title variant=film place=sidewalk text="NO MILK,|NO PROBLEM" sub=""
The sign still says it.

# price place=sidewalk hero=dave seller=copho hold=caphe_trung item="egg coffee" vnd="45.000 ₫" usd="≈ $2" checked="Oct 2026" react=yummy
It costs about [45,000 ₫] (≈ $2).

# list title="ORDER IT RIGHT" items="Sip the top first|Don't stir it|Come early, the little stools fill up"
Sip the top first.
Don't stir it.
Come early. The little stools fill up.

# dialogue a=dave b=copho place=sidewalk voiceA=am_puck voiceB=af_heart lines="a:starstruck:So what's the next story? The coffee? The milk? The street?|b:happy:People tell stories to customers patient enough to stay.|a:joy:See you tomorrow."

# title variant=film place=hanoi text="NEXT TIME|WHY IS VIETNAM SHAPED LIKE AN S?" sub="Ep. 3"
Next time: why Vietnam is shaped like an S.
Follow, so you don't miss it.

# end url=vietadvisor.travel
