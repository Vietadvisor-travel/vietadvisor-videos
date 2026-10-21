# The gauntlet: why agents make bad films, and the loop that stops it

## 1. What went wrong last time (diagnosed on the real engine)
An agent was given v3 of this skill and produced a film "not a corner as good" as the demos. Running v3 end to end on the
real engine showed the likely causes, from most to least likely:

1. **No real images were imported.** Every frame becomes red "MISSING IMAGE" slabs on an empty background, or empty
   frames. *Now:* a neutral PHOTO NEEDED card for drafts, `pp_lint` errors per missing id, and `pp_doctor` checks the
   bundle.
2. **The add-on wasn't installed or registered in the right order.** The engine then silently skips `# cine` and the
   modes. *Now:* `pp_doctor` must say ALL PASS before anything else. It proves every family renders.
3. **The agent reviewed nothing.** It rendered and delivered without looking at frames. *Now:* `pp_sheet` and
   `pp_review` sheets are mandatory, and a separate critic judges them (§2).
4. **v3 itself pushed toward sameness.** The only vocabulary was photo + slam + stamp + shake, and the lint rewarded event
   density. *Now:* 46 scene types (`visual-modes.md`), a camera rig (`camera.md`), and a lint that penalises plain collage,
   repeated modes and shake/flash/stamp overuse.
5. **There was no visual script.** Storyboards were written straight from the VO. *Now:* `pp_shotscript` is a gate.
6. **The skill was too long to hold in mind.** *Now:* SKILL.md is the operating manual, and each role reads only its own
   references.

## 2. Builder ≠ judge (the loop)
This method is adapted from the best open-source Claude video skills (motion-video-kit's "gauntlet", HyperFrames' lint,
snapshot, render loop):
- **Builder:** writes or edits the `.story` for one act. It never judges its own work.
- **Critic:** a fresh agent, or a fresh context, every round. It receives **only** the rendered sheets/frames, the brief,
  the visual script and the owner's words. It does **not** receive the builder's reasoning or the builder's list of what it
  fixed.
- **Orchestrator:** runs the loop, keeps the ledger, and decides the next fix. It fixes the **biggest gap first**, and a
  strength somewhere else never cancels a weakness.

### Rounds
| Round | Artefact the critic gets | Critic focus |
|---|---|---|
| Script | `_script.md` + `pp_scriptlint` report | thesis, hook, loops, BUT/THEREFORE, specificity, showability |
| Visual script | `_shotscript.md` | does every IDEA *explain* its MEANING? variety, bridges, signature shots at turns |
| Act storyboard | `pp_sheet` (4 frames per beat) + `pp_review` sheets | empty space, sameness, unreadable type, collisions, wrong mode for the content, dead seconds, cheap shakes |
| Full film | the MP4 → frames every 0.25 s + dense windows around cuts; loudness | holds, rhythm, transitions, captions, audio hits, the first 30 s |
| Verification | new render + previous report | each item FIXED / PARTLY / STILL PRESENT + new regressions → SHIP or ONE MORE PASS |

### Critic prompt (paste, fill the <>)
> You are an independent film critic for a business-documentary YouTube channel. You did not build this. Judge only what
> you see in the attached frames/sheets. The brief: <thesis, audience>. The owner's standard: "<owner's words>". Use the
> visual script <attached> to see what each beat was MEANT to show.
> 1. Per beat: does the picture explain the sentence? If not, say what it should show (name a mode from
>    visual-modes.md).
> 2. List every beat that looks like the previous one (same family, same size, same layout).
> 3. List cheap habits: shakes, flashes, stamps or slammed words used as decoration; text over faces; empty frames;
>    PHOTO NEEDED cards.
> 4. The top 6 fixes, ranked by impact, each concrete enough to implement (beat number + what to change).
> Verdict: KEEP / REVISE / REJECT. Under 600 words.

### Ledger (`out/<slug>_ledger.md`)
| Round | Artefact | Top critic findings | Changes made | Measured result (lint score, frozen seconds) |
|---|---|---|---|---|

### Stop
Stop only when one of these is true:
- the quality bar is met: `pp_lint` ≥ 9.0, the human rubric ≥ 9/10, and the critic says SHIP;
- the remaining items are cosmetic;
- the owner says stop.

Never stop after a fixed number of rounds.

## 3. Measurements anyone can run
- `node tools/pp_doctor.mjs`: the install proves itself.
- `node tools/pp_scriptlint.mjs research/<slug>_script.md --long`: script ≥ 8.5.
- `node tools/pp_shotscript.mjs check research/<slug>_shotscript.md`: 0 errors.
- `node tools/pp_lint.mjs stories/<slug>-aN.story`: 0 errors, DIRECTOR SCORE ≥ 9.0.
- `node tools/pp_sheet.mjs stories/<slug>-aN.story`: one row per beat, 4 moments each. **Look at every row.**
- `node tools/pp_review.mjs stories/<slug>-aN.story`: a frame after every event.
- Frozen time on the final: `ffmpeg -i final.mp4 -vf "select='gt(scene,0.002)',showinfo" -f null -` (long gaps
  between selected frames mean frozen picture).

## v6: the WOW gate (a fresh critic, on the contact sheets + the draft render)
Score each beat 0–2 on: **originality** (could this picture belong to any other sentence or episode? 0 = yes) · **clarity**
(is the idea understood in 2 s?) · **life** (does something meaningful move on the hit word?) · **craft** (composition,
type, colour, sync). A beat scoring ≤ 3/8 is listed for REDESIGN with a concrete new idea (custom scene sketch). The
episode ships when ≥ 85 % of beats score ≥ 5/8 and the value rubric (story-mining.md §6) is ≥ 15/20.

**The voice check:** the critic listens to the draft render. It plays one line from the rise and one from the fall
back to back: do they sound different? It also checks that every reveal has its silence before it, and that quote
voices are attributed on screen. Any "no" is a fix (voice-direction.md).

## v5: what the critic scores (in addition to the above)
1. **Script:** apply the line-by-line codes (S P R B/T E L J Q) and the 40-point scorecard from `script-masterclass.md` §7.
   Ship at ≥ 32/40. List the 5 weakest lines with a rewrite for each.
2. **Edit and sync:** apply the per-beat and per-minute checklist from `editing.md` §8 to the contact sheets and the draft
   render:
   - Does every hit word land on its picture?
   - Is there a picture event every 2–4 s?
   - Does text stay up long enough to read?
   - Are stylised transitions ≤ 2/min?
3. **Cohesion:** does any shot look like it comes from another film (a 3D shot, an AI image, a raw screenshot)? Name it
   and give the fix: use the look's colours, put it inside a `scene`, or replace it with a fast mode.
4. **Alive:** list beats where nothing moves for more than 4 s, and beats that are plain collage where a living picture
   (`scene` + air + light) would carry the moment.
