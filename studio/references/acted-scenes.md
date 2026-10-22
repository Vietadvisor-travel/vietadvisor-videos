# Acted scenes — what "animation" means on this channel (Oct 2026)

User verdicts: talking heads = boring; infographic cards (timelines, plans, maps, receipts as the main picture) = "not animation
at all". The film must look like a cartoon: **a cast that ACTS inside an illustrated place**, and the information lives inside
that scene — a tape measure the officer unrolls, a sign that drops in, a clock that spins, a phone that flies. Cards are seasoning.

## The recipe (see engine/library/ep6_story.js — `# vis kind=ts act=…`)
1. **One illustrated set per episode** built from the nutshell painters (`NUTWORLD.tubeHouse / tree / wires / stool / table /
   scooter`), side view with depth: far side (houses, cafés, seated extras) · the thing the story is about (rails) · near side
   (our hero, props, street furniture) · blurred foliage foreground · lantern strings · drifting motes.
2. **A hero with a want** (Dave, the backpacker) + locals with personality (Cô Hoa, the officer, kids, grandma) — all `charstyle: nutshell`.
   Use real poses and faces: sit / sitHold / walk / run / point / shrug / facepalm / scared / cheer / photo / wave / ride;
   shocked / dizzy / smug / sleepy / starstruck / determined.
3. **Every line = an action beat**: the bell rings → the vendor yanks the stool → the train roars past → foam moustache → crowd laughs.
   Comedy by timing (setup line, beat, punchline action), not by jokes in the voice.
4. **Info diegetic**: tape measures, signs, clocks, chalkboards, tickets, a year stamped on a card *in the scene*; keep HEAD
   headlines only for the 2–4 numbers that matter.
5. **Same set, many states**: time of day, sepia flashback, crowds in/out, objects appearing — the viewer learns the place and
   every change reads instantly.
6. Story spine with BUT/THEREFORE; one continuous film (no chapters); re-hooks are twists inside the story.

## Checklist before render
- Can you mute it and still follow the story from the acting? If not, add action.
- Is any shot just a card/plan/map for > 3 s? Replace it with characters doing the thing.
- Do the characters' feet sit above the caption band (9:16 near line ≈ 73.5 % of H)?
