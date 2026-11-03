title: Who put an egg in Hà Nội's coffee?
format: story
charstyle: storybook
voice: am_michael
music: cafe
look: grade=warm captions=karaoke
sources: Food Republic & Mental Floss (1946, Nguyễn Văn Giảng, Metropole bartender, milk short in the war, yolk + sugar; modern recipe often adds condensed milk; his son still runs the café); Wikipedia "Egg coffee" (condensed milk today, cup in hot water, spoon the foam first); LocalVietnam (30,000–60,000 ₫ a cup, Café Giảng up a narrow staircase on Nguyễn Hữu Huân); TrvLogue (Café Giảng 45,000 ₫) — checked Oct 2026. Lacroix, Hải, Cô Phở and all dialogue are dramatized.
cast: giang = man elder skin=4 hair=short:grey top=longsleeve:white bottom=wide:black glasses=round name="Ông Giảng"
cast: lacroix = man skin=2 hair=short:brown top=longsleeve:white bottom=wide:white name="Lacroix"
cast: copho = woman skin=4 hair=bun:black top=polo:#b84a2e bottom=longskirt:black name="Cô Phở"
set: metro1946 = kit=room wall=#5a3a22 floor=#2e1e12 window=night deco=lanterns
set: back_kitchen = kit=room wall=#d8c9a8 floor=#7a5a3a window=night
set: market1946 = sky=day far=town mid=market ground=pavement deco=stalls,flags palette=hanoi
set: cafe_now = kit=room wall=#c9a46a floor=#6a4a2e window=day deco=lanterns
// angle:   Hà Nội's most famous coffee exists because something was missing — and today, the missing thing is back in it
// viewer:  first-timers who see "egg coffee" on a menu, think "gross?", and want to know if it's worth ordering
// format:  story — period drama inside a present-day comedy; Dave and his milk obsession are the running gag
// hook:    sensory cold open (whisk, steam) + "This is Hà Nội's most famous coffee. The secret ingredient? An egg."
// payoff:  how to drink it (hot-water bowl, foam first, don't stir), ~45,000 ₫ (~$2), where the original is
// structure: Mystery — question in the hook · two wrong answers (Dave) · quiz · real answer (1946) · twist (condensed milk) · circle back
// design:  storybook charstyle — warm, soft line; suits a family story with a comic frame
// curve:   curious → amused → playful (quiz) → tense (war, no milk) → awe (the whisk) → triumph (encore) → surprise (twist) → warm → sure; peaks at the cold open, the encore and the twist

# gag place=sidewalk hero=dave hold=caphe_trung mood=happy react=shocked reactPose=scared punch="AN EGG?!" cam=snap fg=wires hit=.7
Dave just found out what's in his coffee.

# moment kind=steam dish=caphe_trung capAt=.3
This is Hà Nội's most famous coffee.
The secret ingredient? *An egg.*

# dialogue a=dave b=copho place=sidewalk fg=bokeh voiceA=am_puck voiceB=af_heart act="copho:wipe" lines="a:thinking:So it's a protein shake?|b:neutral:No.|a:surprised:A tourist gimmick, then?|b:smug:Older than you think.|a:shocked:Then who invented it?|b:smug:Guess."

# quiz q="Who invented egg coffee?" options="A gym coach|A French chef|A bartender with no milk" answer=3
Quick quiz. Who came up with this?
A gym coach, a French chef, or a bartender?
A bartender. With *no milk*.

# map to=hanoi label="HÀ NỘI · 1946" trans=burn dur=4
Let's go back eighty years.

# title variant=paper text="HÀ NỘI, 1946|THE MILK IS GONE" sub="the Metropole bar" trans=inkbleed
A war has just begun, and milk is in short supply.

# talk place=metro1946 time=night host=giang mood=neutral pose=present big="ÔNG GIẢNG" act="giang:wipe" shots="MS giang|MCU giang" fg=lanterns cam=breathe
Behind the hotel bar stands *Nguyễn Văn Giảng*.

# dialogue a=lacroix b=giang place=metro1946 time=night fg=lanterns voiceA=bm_george voiceB=am_adam act="giang:wipe" lines="a:thinking:Café au lait, please.|b:sad:No milk tonight, monsieur.|a:angry:Coffee without milk? Impossible.|b:determined:Give me two minutes."

# talk place=back_kitchen time=night host=giang mood=determined act="giang:stir" shots="MS giang|CU giang|MCU giang low" cam=pushIn rays=yes fg=window
He separates an egg. Just the yolk.
Sugar in. Then he whisks. And whisks.
Until it turns thick and pale, like cream.
He spoons it over hot black coffee.

# gag place=metro1946 time=night hero=lacroix hold=caphe_trung mood=thinking react=starstruck reactPose=cheer punch="ENCORE!" cam=snap fg=lanterns
The officer takes one sip. Silence.
Then he orders another.

# talk place=market1946 host=giang mood=happy extras=crowd fg=crowd act="giang:walk:2>bargain" cam=dolly shots="WS giang|MS giang"
Guests kept asking for it.
So Giảng left the hotel and opened his own café.

# timelapse place=oldquarter times="sunset,night,day" trans=lightleak dur=4
Eighty years later, his family still makes it.

# myth host=copho myth="Egg coffee has no milk in it" fact="Most cafés now add condensed milk" stamp=BUSTED trans=glitch
So there's no milk in it. Right?
Wrong. Most cafés now whisk in *sweetened condensed milk*.

# dialogue a=dave b=copho place=cafe_now voiceA=am_puck voiceB=af_heart act="dave:fistpump" lines="a:starstruck:So there IS milk!|b:smug:Now there is. In 1946, there wasn't.|b:neutral:Sit down. And don't stir."

# steps title="How to drink it" items="Cup sits in hot water|Spoon the foam first|Then sip the coffee" icons="caphe_trung|che|caphe_phin"
It arrives in a bowl of hot water, to stay warm.
Eat the foam first, with the little spoon.
Then sip the coffee underneath.

# gag place=cafe_now hero=dave hold=caphe_trung mood=thinking react=yummy reactPose=cheer punch="TIRAMISU?!" cam=snap act="dave:sip"
Dave takes one spoonful of foam.
It tastes like warm tiramisu.

# price place=sidewalk hero=dave seller=copho hold=caphe_trung item="egg coffee, Old Quarter" vnd="45.000 ₫" usd="≈ $2" checked="Oct 2026" react=yummy
At the original café, a cup is about [45,000 ₫] (~$2).

# list title="FIND THE ORIGINAL" items="Café Giảng · 39 Nguyễn Hữu Huân|!Asking for extra milk"
The original is Café Giảng, at 39 Nguyễn Hữu Huân.
And please, don't ask for extra milk.

# dialogue a=dave b=copho place=sidewalk time=sunset voiceA=am_puck voiceB=af_heart lines="a:happy:One egg coffee, please.|b:smug:With milk?|a:cool:No thanks. Foam first, no stirring.|b:laugh:Good. You learn fast."

# payoff place=oldquarter time=sunset hero=dave host=copho title="CÀ PHÊ TRỨNG|BORN FROM NO MILK" sub="~45,000 ₫ · foam first · don't stir"
Born from a shortage. Still poured, eighty years on.

# title variant=film place=hanoi text="NEXT TIME|WHY IS VIETNAM AN S?" sub="Ep. 3" trans=fgwipe
Next time: why is Vietnam shaped like an S?

# end url=vietadvisor.travel
