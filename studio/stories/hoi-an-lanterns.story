title: Hội An after dark
format: story
sources: demo story for the engine — no prices quoted
cast: ba_tu = woman elder skin=4 hair=bun:grey top=baba:#7a4a7a bottom=wide:black hat=nonla name="Bà Tư"
set: lantern_lane = base=hoian time=night deco=lanterns,fog
set: lantern_shop = kit=room wall=#e8c46a floor=#8a5a35 window=night deco=lanterns,altar
set: old_street = kit=street3d palette=hoian time=night deco=fog
// angle:  Hội An is two towns — the daytime crowd and the lantern town after sunset
// viewer: first-timers deciding when to visit the old town
// format: story — a quiet character piece, golden light, fades and light leaks
// hook:   "Most visitors leave Hội An at the wrong time." over a sunset river
// payoff: stay for the evening; walk the old town; the lanterns are the point

# title variant=film place=hoian time=sunset text="HỘI AN|AFTER DARK" sub="a Vietadvisor short"
Most visitors leave Hội An at the wrong time.

# intro place=hoian time=sunset hero=dave mood=bored host=linh ask="Leaving already?\nWait an hour."
Dave has seen the yellow walls. He's ready to go.
Linh asks him to wait one more hour.

# timelapse place=hoian
The sun drops behind the river.
And the town starts to change.

# reveal place=lantern_lane time=night hero=dave label="THE LANTERN TOWN" particles=fireflies shot=WS lens=wide
One by one, the lanterns come on.

# dialogue a=dave b=ba_tu place=lantern_shop lines="a:starstruck:Did you make all of these?|b:happy:Every one. Silk and bamboo.|a:love:How long does one take?|b:joy:A whole afternoon. Take your time choosing."

# talk place=old_street host=linh mood=happy
Come after sunset, and walk the old town slowly.
That's when Hội An makes sense.

# payoff place=hoian time=night hero=dave host=linh title="STAY|FOR THE LIGHTS" sub="Hội An · after sunset"
Dave didn't leave. He stayed for dinner.
