title: The coffee Hà Nội made without milk
format: story
charstyle: chibi
voice: am_michael
music: cafe
score: comedy@1 quiz@4 emotional@5 cafe@17 adventure@25
look: grade=warm captions=karaoke
sources: Food Republic & Mental Floss (1946, Nguyễn Văn Giảng, Metropole bartender, milk short in the war, yolk + sugar; his son still runs the café); Wikipedia "Egg coffee" (condensed milk in today's recipe, cup in hot water, spoon the foam first); LocalVietnam (30,000–60,000 ₫ a cup; Café Giảng on Nguyễn Hữu Huân); TrvLogue (Café Giảng 45,000 ₫) — checked Oct 2026. Hanoi's tram network ran 1900–1991. Lacroix, Cô Phở and all dialogue are dramatized.
cast: giang = man elder skin=4 hair=short:grey top=vest:#3a2a22 bottom=wide:black glasses=round name="Ông Giảng"
cast: lacroix = man skin=2 hair=short:brown top=uniform:#d9cfb0 bottom=wide:#d9cfb0 hat=cap:#d9cfb0 mustache=#7a4a2a name="Lacroix"
cast: copho = woman skin=4 hair=bun:black top=polo:#b84a2e bottom=longskirt:black acc=apron name="Cô Phở"
// angle:   Hà Nội's most famous coffee exists because the milk ran out — and today the milk is quietly back in it
// viewer:  first-timers who see "egg coffee" on a menu, think "gross?", and want to know if it's worth ordering
// format:  story, fast — OverSimplified pacing: short lines, a joke every few seconds, hard cuts
// hook:    Dave's spit-take at an egg in his coffee (hit at 0.5 s) + "Dave just found an egg in his coffee."
// payoff:  hot-water bowl, foam first, don't stir · ~45,000 ₫ (~$2) · Café Giảng, 39 Nguyễn Hữu Huân
// structure: Mystery with a running gag — wrong guesses · quiz · 1946 heist-style origin · twist (condensed milk) · callback
// design:  chibi — thick ink, big faces, reads at phone size; custom 1946 bar, kitchen, tram street and today's café
// curve:   shock → laughs → quiz → tension (no milk) → craft (whisk) → triumph (encore) → time jump (split) → twist → warm → sure

# gag place=cafe_giang hero=dave hold=caphe_trung_bath mood=happy react=shocked reactPose=scared punch="AN EGG?!" cam=snap hit=.5
Dave just found an egg in his coffee.

# talk place=cafe_giang host=copho mood=smug pose=present prop=caphe_trung_bath size=1.5 act="copho:present" shots="MS copho|CU copho" cam=pushIn
This is cà phê trứng. Hà Nội's most famous coffee.
Yes. That's egg on top.

# dialogue a=dave b=copho place=cafe_giang voiceA=am_puck voiceB=af_heart act="copho:wipe" lines="a:thinking:Is it a protein shake?|b:neutral:No.|a:surprised:A TikTok trend?|b:smug:It's eighty years old.|a:shocked:Then who invented this?|b:smug:Guess."

# quiz q="Who invented egg coffee?" options="A gym coach|A French chef|A bartender with no milk" answer=3
Quick quiz. Gym coach, French chef, or bartender?
Three. Two. One.
The bartender. With *no milk*.

# moment kind=mapdive to=hanoi label="HÀ NỘI · 1946" place=hanoi1946 time=day trans=burn grade=sepia
Rewind eighty years.

# talk place=hanoi1946 host=giang mood=determined act="giang:walk" extras=crowd cam=follow shots="WS giang|FS giang|MS giang" fg=leaves grade=sepia sfx="0.3:footsteps:0.35:0.2"
Hà Nội, 1946. Trams rattle down the boulevards.
A war is about to start.
And milk? Milk is running out.

# talk place=metropole_bar time=night host=giang mood=neutral pose=present big="ÔNG GIẢNG" act="giang:wipe" shots="FS giang|MS giang low" cam=arc grade=sepia sfx="0.5:squeak:0.18|2.0:wipe:0.25"
Meet *Nguyễn Văn Giảng*. Bartender at the Metropole hotel.

# dialogue a=lacroix b=giang place=metropole_bar time=night voiceA=bm_george voiceB=am_adam act="giang:wipe" grade=sepia sfx="0.2:knock:0.5:-0.3" lines="a:thinking:Café au lait, please.|b:nervous:No milk, monsieur.|a:shocked:No milk?!|b:sad:The milk went to war.|a:angry:Then fix it.|b:determined:Two minutes."

# stat value=0 from=12 suffix=" bottles" label="of milk in the whole hotel" bg=#3a2418 grade=sepia
Two minutes. Zero milk.

# talk place=giang_kitchen time=night host=giang mood=determined act="giang:stir" prop=egg_whisk_bowl size=1.3 cam=pushIn rays=yes grade=sepia sfx="0.6:egg_crack:0.8|1.8:sugar:0.45|2.6:whisk:0.6:0:|5.0:whisk:0.6"
One egg yolk. A spoon of sugar.
Then he whisks.
And whisks.
And whisks. No mixer. Just one very tired wrist.

# moment kind=steam dish=caphe_trung grade=sepia
It turns thick and pale, like cream.
He spoons it over hot black coffee.

# gag place=metropole_bar time=night hero=lacroix hold=caphe_trung mood=thinking react=starstruck reactPose=cheer punch="ENCORE!" cam=snap grade=sepia sfx="0.4:slurp:0.5"
Lacroix takes one sip.

# talk place=metropole_bar time=night host=giang mood=joy act="giang:bow" cam=crane shots="FS giang|MS giang" grade=sepia sfx="0.6:claps:0.5|2.0:claps:0.4"
Then the next table orders one. Then the next.

# talk place=hanoi1946 host=giang mood=happy act="giang:walk:2>wave" extras=crowd cam=dolly shots="WS giang|FS giang" fg=leaves grade=sepia
Guests keep asking for it.
So Giảng quits the hotel…

# reveal place=cafe_giang label="CAFÉ GIẢNG" hero=giang pose=present mood=joy particles=sparkles trans=fgwipe
…and opens his own café.

# moment kind=split a=metropole_bar b=cafe_giang labels="1946|TODAY" heroA=giang heroB=copho timeA=night timeB=day
Eighty years later, his family still makes it.

# myth host=copho place=cafe_giang myth="Egg coffee has no milk in it" fact="Most cafés now add condensed milk" stamp=BUSTED trans=glitch
So there's no milk in it. Right?
Wrong. Most cafés now whisk in *condensed milk*.

# dialogue a=dave b=copho place=cafe_giang voiceA=am_puck voiceB=af_heart act="dave:fistpump" lines="a:starstruck:So there IS milk!|b:smug:Now there is. In 1946, there wasn't.|a:joy:I knew it!"

# gag place=cafe_giang hero=dave hold=caphe_trung_bath mood=happy react=scared reactPose=scared punch="DON'T STIR!" cam=snap act="dave:stir"
Dave reaches for the spoon.

# steps host=copho place=cafe_giang title="How to drink it" items="Cup sits in hot water|Spoon the foam first|Then sip the coffee" icons="caphe_trung_bath|caphe_trung|caphe_phin"
It sits in a bowl of hot water, to stay warm.
Eat the foam first, with the little spoon.
Then sip the coffee underneath.

# gag place=cafe_giang hero=dave hold=caphe_trung_bath mood=thinking react=yummy reactPose=cheer punch="TIRAMISU?!" cam=snap act="dave:sip"
One spoonful. Warm tiramisu.

# price place=cafe_giang hero=dave seller=copho hold=caphe_trung_bath item="egg coffee, Old Quarter" vnd="45.000 ₫" usd="≈ $2" checked="Oct 2026" react=yummy
At the original café, about [45,000 ₫] (~$2).

# list host=copho place=cafe_giang title="FIND THE ORIGINAL" items="Café Giảng · 39 Nguyễn Hữu Huân|Up the narrow staircase|!Asking for extra milk"
Café Giảng, 39 Nguyễn Hữu Huân.
Up the narrow staircase.
And don't ask for extra milk.

# dialogue a=dave b=copho place=sidewalk time=sunset voiceA=am_puck voiceB=af_heart lines="a:happy:One egg coffee, please.|b:smug:With milk?|a:cool:Foam first. No stirring.|b:laugh:You learn fast."

# payoff place=oldquarter time=sunset hero=dave host=copho title="CÀ PHÊ TRỨNG|BORN FROM NO MILK" sub="~45,000 ₫ · foam first · don't stir"
Born from a shortage. Still poured, eighty years on.

# title variant=film place=hanoi text="NEXT TIME|WHY IS VIETNAM AN S?" sub="Ep. 3" trans=fgwipe
Next time: why is Vietnam shaped like an S?

# end url=vietadvisor.travel
