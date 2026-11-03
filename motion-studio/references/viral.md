# What makes these videos travel (re-check every episode — platforms change monthly)

Researched Oct 2026. Treat numbers as direction, not law; refresh with a web search per episode and note the date in `// viral:`.

## Hooks (all platforms)
- 0.0–0.5 s: a visual trigger (the map snaps in, a spit-take, a hard zoom). 0.5–1.5 s: the verbal promise. Put the promise
  on screen as text by 0.5 s — most people watch muted (≈ 85 % of social video is watched without sound).
- Question hooks convert best ("Why is Vietnam shaped like an S?"); bold claims and numbers are next.
- A concrete number inside the first 10 s; never a greeting, intro or sponsor before the content.

## Vertical (TikTok / Reels / Shorts)
- Length: 60–150 s for story/explainer. TikTok's Creator Rewards only pay for videos **over 1 minute**; educational
  Shorts do well at 45–90 s; Reels/Shorts accept up to 3 min. Our cap: 3 min.
- Turn every 5–8 s: new map stage, a cut to a character, a gag, a guess. Word-by-word (karaoke) captions.
- Loops only help under ~35 s — for longer pieces, end on a satisfying line, not a cliff.
- Put "follow / next episode" in the post caption, not the video (the brand end frame stays short: `# end dur=1.6`).
- Comments: one guess-the-number exchange ("Guess how wide… Five hundred? — Fifty.") invites replies.

## YouTube (16:9, ≤ 10 min)
- 0–15 s: promise + 2–3 open loops ("two royal weddings, a rescue at sea, a lost kingdom…") + the travel payoff to come.
- No chapter cards in the film (house rule, Oct 2026): one continuous story. Description timestamps are optional and live only in the YouTube description.
- Re-hook every 60–90 s (a new character, a reversal, "and then the king died"); a mid-point twist around the halfway mark.
- Deliver value early and keep the best payoff in the last third (what it means for your trip: distances, times, prices).
- End: one-line synthesis + next-episode tease (`# title variant=film text="NEXT TIME|…"`).

## OverSimplified techniques we copy
- Colour-block maps with a face (`# sshape … face=yes`), countries/rulers given petty, relatable motives.
- Deadpan narration with modern understatement ("This part was not a wedding."), running gags with an escalating
  callback ("AGAIN?!"), meta cutaways to Dave/Cô Phở after dense stretches.
- Never punch down: jokes target deals and egos, never ethnic groups; tragedies are told plainly; both perspectives.

## Voice
- Narrator `af_heart` (best Kokoro voice), characters with distinct voices. `…` / ` — ` = held beat before a punchline;
  ≤ 4-word punchlines are spoken slower automatically (tools/voice.py `tts_expr`). Expressive open models
  (Chatterbox, Orpheus) need a GPU and their PyTorch index is blocked here — Kokoro + timing is the free option.

Sources: qten.ai "Anatomy of a viral short 2026"; virvid.ai looping guide; hypenest.ai TikTok algorithm 2026;
ttcalculator.net Creator Rewards; piktochart Shorts length; rivereditor YouTube scripting 2026; shapes.inc OverSimplified deep dive.
