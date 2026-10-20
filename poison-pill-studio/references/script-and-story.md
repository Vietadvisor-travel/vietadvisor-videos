# Script and story: business case studies, 8–12 minutes (16:9)

The script is the film. If the script is a chronological list, no engine can make the film interesting. Score every
script with `node tools/pp_scriptlint.mjs research/<slug>_script.md --long` and only direct it at ≥ 8.5/10.

## 1. Topic scoring (make it at ≥ 75/100)
| Criterion | Pts |
|---|---|
| Clear rise AND clear fall/turn (or a "rose again") | 20 |
| A human at the centre (founder, CEO, rival) with real photos available | 15 |
| One number people can feel ($1.75B gone in 6 months) | 15 |
| A surprising thesis (not "they ran out of money") | 15 |
| Search/curiosity demand (people still ask "what happened to X?") | 15 |
| Visual material: places, products, headlines, documents, data | 10 |
| A lesson that transfers to the viewer's work/life | 10 |

Good veins:
- **Hyped startups that died:** Quibi, Theranos, WeWork, FTX, Juicero.
- **Giants that missed the shift:** Kodak, Nokia, Blockbuster, BlackBerry.
- **Comebacks:** Apple 1997, Lego 2004, Marvel.
- **Rivalries:** Adidas vs Puma, Pepsi vs Coke.
- **Founder sagas:** Rockefeller, Ford, Ray Kroc.

## 2. The thesis comes before the outline
Write one sentence that is *surprising, arguable and provable*:
> "Quibi didn't die because of the pandemic. It died because two geniuses never asked a single user."

Every act must turn this thesis. Each act should either make the viewer believe the opposite, or prove it a little
more. The last minute states it plainly and pays off the opening loop. A film without a thesis is a Wikipedia summary.

## 3. Architecture: a 10-min film is about 1,550 spoken words (2.6 words/s), about 120–160 beats
| Act | Time | Job | Colour | Visual signature |
|---|---|---|---|---|
| 0 Cold open | 0:00–0:30 | the end first (the crash, the number). Then "to understand how, we go back to…". Plant the OPEN LOOP | fall → setup | `title3d` / `money3d` burn → `desk3d` opens the case |
| 1 Origin | 0:30–2:00 | the person, the problem, the idea; why it shouldn't have worked | setup | `profile`, `napkin`, `map3d` to the place |
| 2 Rise | 2:00–4:30 | the money, the growth, the glamour. Make the viewer believe. Re-hook at about 3:00 | rise | `city3d`/`stacks3d`, `trend` up, `gallery3d` of the press |
| 3 The crack | 4:30–6:30 | the hidden flaw the thesis is about; the ignored warnings; MIDPOINT TWIST | doubt | `iceberg`, `chat`, `browser`, `funnel` |
| 4 The fall | 6:30–8:30 | the collapse in dated steps; the biggest number; one word on black | fall | `domino`, `trend` down, `boardroom3d` empties, `building3d` dark |
| 5 Aftermath | 8:30–9:30 | where everyone is now; the cost | after | `timeline3d`, `profile` verdicts |
| 6 The lesson | 9:30–10:00 | the thesis in one line; pay off the loop; tease the next case | lesson | `kin` on black, end card |

Each act is its own `.story` file (`-a0` … `-a6`).

## 4. The engines of attention (each one is checked by `pp_scriptlint`)
1. **BUT / THEREFORE, never AND THEN.** Every beat either turns (*but*, *until*, *except*) or follows (*so*, *which
   meant*, *that's why*). At least 20 % of sentences should carry a turn word. "And then" is the sound of a list.
2. **Open loops.**
   - Plant at least one in the first minute: a question, "remember this number", "but that's not the real story".
   - Plant a small one at every act turn.
   - Close each one on screen, with the same visual as the setup (match the mode). The bubble you inflated in minute 2
     pops in minute 7.
3. **Re-hooks every 2–3 minutes.**
   - Re-raise the stakes: "And that's when the real problem started." / "But the worst decision was still to come."
   - A re-hook is also a *visual* reset: change the family (3D after a run of 2D).
4. **Specificity.**
   - At least 6 sentences per minute should carry a number, a date, or a name.
   - "A lot of money" is invisible; "$1.75 billion" is a pile of cash in `money3d`.
   - "Executives left" is invisible; "five of six board members resigned within a year" is `boardroom3d` with chairs
     emptying.
5. **Stakes and a human.** Someone wants something, risks something, and loses or wins it. Return to the human every few
   minutes: their face, their post, their message.
6. **Showability.** Before keeping a sentence, ask *what do we see?* If the answer is "a photo of the CEO again", rewrite
   the sentence so it carries an object, a place, a document, a number or an action.
7. **The midpoint twist.** At about 50 %, reveal the fact that reframes everything you've shown so far. It's often the
   thesis seen from the inside.
8. **Rhythm.**
   - Vary sentence length: long build, then a short punch.
   - Use the rule of three, and twist the third item ("He blamed the pandemic. Then the phones. Then everyone but
     himself.").
   - Leave about 1 s of silence before the biggest hit; the storyboard marks it.

## 5. Line craft
- 6–16 words per line, one idea, one drawable noun. Use contractions and the active voice.
- Write numbers as spoken in the VO ("one point seven five billion"). The picture shows "$1.75B".
- The narrator is a sharp analyst, not a hype man: dry, specific, a little ironic. Use "insane" or "crazy" at most once
  per film. No "let's dive in", "buckle up", "in today's video".
- Quotes, posts and headlines are **verbatim** from the dossier (2 sources). They become `post`, `quote` or `browser`
  beats, so they must be exact.
- End with the thesis in 12 words or fewer, then the next-case tease, then the end card.

## 6. Hook formulas (first 15 s; the picture must land by 1.5 s)
- **The end first**: "Six months. One point seven five billion dollars. Gone." The film opens on `money3d` burning, then
  rewinds.
- **The impossible number**: "This app had more money than Netflix had in its first ten years. It lasted six months." Use
  `stacks3d` here.
- **The contradiction**: "The smartest people in Hollywood built a streaming service nobody wanted." Use `logos` zooming
  into the one.
- **The artefact**: the post or the memo that should never have been written, shown verbatim in `post`, `chat` or
  `desk3d`.

## 7. Write for the picture
Keep the visual script in mind while writing (`shot-script.md`). Sentences shaped like a mode make better films:

| Sentence shape | Mode |
|---|---|
| "X led to Y, which led to Z" | `domino` |
| "On one side… on the other…" | `scale` |
| "Everyone saw X. Nobody looked at Y." | `iceberg` |
| "From A to B to C" | `map3d` / `globe3d` |
| "In 2018… 2019… 2020…" | `timeline3d` |
| "A million downloaded, 40,000 paid" | `funnel` |
| "Revenue minus this minus that" | `waterfall` |
| "He posted…", "the messages said…", "the report found…" | `post`, `chat`, `browser` |
| "They bet everything" | `bet` |
| "The board / five executives resigned" | `boardroom3d` |

## 8. Packaging
- **Title:** 60 characters or fewer, a number plus a conflict ("The $1.75 Billion Bet That Died in 6 Months"). Nothing
  the film doesn't pay off.
- **Thumbnail:**
  - Brief: dossier look, one face cut-out with a white border, one number, one red word or red X. At most 3 elements,
    readable at 160 px.
  - Make it with `pp_thumb.mjs` from a `title3d` or `desk3d` frame.
- **Description:** a 2-line summary · timestamps per act · sources · photo credits · "commentary & analysis".
- **Pinned comment:** the open question ("Was it the product, or the pandemic?").
