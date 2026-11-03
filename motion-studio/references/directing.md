# Directing — every video gets its own script and its own cut

Read this before writing any storyboard. The engine guarantees polish; **you** decide the shape.
Two videos about the same place must not look like the same template with new words.

## 1. Treatment first (5 lines, at the top of the .story as `//` comments)
```
// angle:   the one surprising truth this video is about (not the topic — the take)
// viewer:  who is watching and what they want to know before they book
// format:  one of the formats below, and why it fits this content
// hook:    the first 3 seconds, word for word, and what moves on screen
// payoff:  the saveable thing they leave with (price, route, month, rule)
// structure: one from script-craft.md §1 (never the previous video's)
// design:  charstyle (film-language §16) and why it suits this content
// curve:   emotion curve + where the 1–2 signature moments sit (film-language §11)
```
If you cannot write a sharp `angle`, research more before writing beats.

## 2. Pick the format from the content (header `format:`)
The format sets grade, caption style, transition family, camera energy, music mood and narrator voice.
You can still override any of them (`look:`, `music:`, `voice:`, per-beat `trans=`).

| format | use when the content is… | skeleton (beats) | signature devices |
|---|---|---|---|
| `explainer` | one destination/route explained end to end | hook/map → title → intro → route → reveal/ride ×2 → gag → compare → list → payoff | host + hero duo, map route, roadside signs |
| `countdown` | "N things / places / dishes" | hook → title → countdown ×N (best last) → payoff | big numbers, prop pop, punch captions, energetic cuts |
| `myth` | misconceptions, scams, "what nobody tells you" | hook → myth ×3–4 (with a gag in between) → list → payoff | MYTH card → BUSTED stamp → FACT card, deadpan host |
| `food` | one dish or a food area | hook (sizzle) → title variant=place → talk (origin) → steps (how to eat) → price → dialogue (ordering) → payoff | warm close-ups (`size=` big props), circles/iris transitions, café music |
| `history` | how a place/dish/custom came to be | hook → title variant=paper → map → timeline → dialogue (period characters) → reveal (today) → payoff | parchment, ink transitions, line boil, British narrator |
| `guide` | practical how-to: visas, SIMs, transport, booking | hook → steps → budget → calendar → list (! = avoid) → payoff | calm teal grade, paper/push transitions, steady pace |
| `versus` | A or B (Hà Giang vs Sa Pa, train vs bus, rider vs self-ride) | hook → title → compare → budget/compare → dialogue (argument) → stat → payoff (verdict) | split screens, stripes, verdict stamp |
| `story` | a character's day/journey; emotional or funny narrative | hook → intro → ride → dialogue → social → reveal → payoff | on-twos animation, golden grade, fades, emotional music |
| `night` | night markets, nightlife, after-dark | hook → montage → price ×2 → social → list → payoff | night grade, fireflies/lanterns, lo-fi night music |
| `quiz` | engagement reels: guess the price / place / month | hook → quiz ×2–3 → stat → payoff | 3-2-1 ring, green reveal, confetti |

**Rotate formats across the channel.** `lint` compares each storyboard with the others in `stories/`
and warns when the beat structure is >75 % the same or the opening repeats.

## 3. Writing the narration (captions = voice-over script)
- **Hook ≤ 3 s**: a claim, a number or a question with tension. "This road is 350 km of hairpins. People still ride it in two days — don't."
- **But / therefore, never "and then"**: each beat should turn the story (*but* it's landslide season, *therefore* go in October).
- **Rule of three** for lists and jokes; the third item twists.
- **Specific beats generic**: "50,000 ₫ (~$2) at a plastic-stool stall" beats "affordable street food".
- **Open a loop early, close it late** ("…and the best month isn't the one you think" → answered in `calendar`).
- **Pattern interrupt every 15–25 s**: `gag`, `quiz`, `stat`, `montage` or a format switch.
- **Re-hook at ~30 s and ~60 s** in videos over a minute: a new question or a bigger number.
- **One running gag** per video (Dave's spreadsheet, Kenji's map) paid off in the last beat.
- **End on value**, then the CTA: the saveable fact, then "Full guide at vietadvisor.travel".
- Line length 6–14 words; one idea per line; contractions; second person ("you"). Read it aloud — the
  voice is real now, so clunky lines sound clunky.

## 4. Directing the picture
- **Peaks and valleys**: a `# moment` at each emotional peak, a character or info beat between peaks, a quiet
  image after the biggest one. Paste-ready sequences: shot-recipes.md.
- **Depth in every location**: one foreground plane (`fg=`) per new place where it fits.
- **Everyone acts**: `act=` gives each character a real action (eating, paddling, bargaining, shading eyes).
- **Vary shot scale between cuts**: wide (place/map) → medium (characters) → close (prop/number). Never
  three wides in a row.
- **Screen direction**: travel left→right towards the destination; keep it consistent in a sequence.
- **Character acting**: give every character a reaction in every beat (`react=`, `mood=`). Dialogue lines can
  carry mood and pose: `lines="a:shocked:Is it safe?|b:happy:Yes, with a rider."`
- **Hold on the payoff**: 1.5–2.5 s with nothing new except a slow push.
- **Silence before the punch**: put a short line before a `gag` so the hit lands after a pause.
- **Match cuts**: same shape/position across a cut (a bowl → the round map pin) feels intentional.
- **Grounding is automatic** (roads under bikes, boats on water, stools under sitters) — but choose places
  that make sense: don't ride in a cave, don't sit in the sea.

## 5. Length planning (≈ 2.6–2.7 spoken words per second)
| length | words | beats | notes |
|---|---|---|---|
| Reel 15–30 s | 35–75 | 3–5 | format countdown/quiz/myth, captions punch |
| Short 45–75 s | 110–190 | 6–10 | one format, one running gag |
| Long 2–4 min | 300–620 | 14–30 | chapters (`# chapter`) every 45–60 s, switch sub-format per chapter |
| Long 5–12 min | 750–1,900 | 35–80 | one .story per chapter, render each, join with ffmpeg concat |

A 3-minute video ≈ 450 words ≈ 20–26 beats. Mix at least 7 different beat types.
