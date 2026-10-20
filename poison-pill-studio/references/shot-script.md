# The visual script: every sentence, every second

Between the VO script and the storyboard sits one table. It's where the film is actually designed. Agents that skip it
write `# cine` lines straight from the script, and every line comes out the same: a photo, a word, a stamp. The table
forces five decisions per sentence.

```
node tools/pp_shotscript.mjs research/<slug>_script.md            → research/<slug>_shotscript.md (pre-filled suggestions)
node tools/pp_shotscript.mjs check research/<slug>_shotscript.md  → 0 errors before any .story is written
```

## 1. The columns
| Column | Question | Bad | Good |
|---|---|---|---|
| **MEANING** | What must the viewer understand from this sentence? | "Quibi raised money" | "They had more money than any app ever, *before* a single show existed" |
| **IDEA (what we see)** | If this were a shot in a film, what is literally in the frame, and what happens? | "photo of Katzenberg + $1.75B" | "bills rain onto a pile on the desk until it's taller than the lamp; the counter reads $1.75B" |
| **MODE** | Which family member shows that idea? (`visual-modes.md`) | `collage` again | `money3d` |
| **CAMERA** | Size, angle, move, and why. (`camera.md`) | "push" | "low angle on the pile, slow crane up, so the money looks too big" (3D: own camera) |
| **ON WORD** | The spoken word the picture changes on | — | `billion` |
| **BRIDGE → next** | How this shot hands over to the next one | "cut" | "the camera pushes into one bill → match cut to the `browser` page printed on paper" |

## 2. Time
Each row has an estimated start time (2.6 words/s). Read down the time column and check four things:
1. **Something changes about every 1.5–2 s.** That can be the mode's own events (fall, tip, scroll, pop), a camera
   keyframe, or an overlay.
2. **The family changes at least every 3 rows.** Collage, then set, then mode, then 3D, then collage.
3. **Every act turn and every re-hook has a signature shot.** That's a 3D shot or a big set piece.
4. **Before the biggest hit there's about 1 s of stillness.** Use a slow `glide` and no new event. Then the hit.

## 3. From MEANING to IDEA: the method
1. Underline the **one concrete noun or number** in the sentence. That's your subject.
2. Ask what **change** the sentence describes (grow, fall, move, hide, reveal, connect, break, control, bet, lose). The
   change is the animation.
3. Look up the change in the decision table (`visual-modes.md` §1). That gives you the mode.
4. Put **real material** on it. Photos go on the dominoes, chess pieces, profile, gallery, desk and phone screen. The
   real article goes in `browser`; the real post goes in `post`.
5. Choose the **camera** that gives the change weight: a low angle on power, a drop for discovery, a whip for "but".
6. Decide the **bridge**: how this picture becomes the next one.

## 4. Bridges (ranked from most to least elegant)
1. **Zoom-through:** push into an object until it fills the frame, then open the next beat inside a similar object. A print
   in `desk3d` leads to the `browser` page; a phone screen leads to the `chat`; a coin leads to `stacks3d`.
2. **Match on shape:** the `trend` line becomes the `coaster` track; the `mania` bubble becomes the globe; the bomb
   becomes the boardroom lamp.
3. **Match on action:** the domino falls, and the next shot opens on something already falling (`crack`, `sinking`).
4. **Continuity of an actor:** the same photo or object keeps its identity across shots (the founder's print travels from
   `profile` to `chess` to `ladder`).
5. **Whip on "but":** fast lateral motion blur into a contrasting place.
6. **Hard cut on the word:** the default, and fine about 60 % of the time, as long as the size and family change.
7. **Never:** a fade, a dissolve, or a spinning 3D cube.

## 5. Worked example (Quibi, 0:00–0:40)
| # | time | VO | MEANING | IDEA | MODE | CAMERA | ON WORD | BRIDGE |
|---|---|---|---|---|---|---|---|---|
| 1 | 0:00 | Six months. One point seven five billion dollars. Gone. | the end first: absurd speed, absurd sum | a pile of bills on the dark desk ignites and chars to ash | `money3d` (rain:months, burn:gone) | own: low over the pile, slow push | gone | the last ember → cut to black |
| 2 | 0:05 | To understand how, we go back to a file opened in twenty eighteen. | promise: this is an investigation | the case file on the desk, the folder opens, prints slide out | `desk3d` (open:file, spread:eighteen) | own: top-down, crane to the hero print | file | push into Katzenberg's print → |
| 3 | 0:11 | Jeffrey Katzenberg. The man who made Shrek. | who: a legend, credibility | his personnel file types in; stats; no verdict yet | `profile` | `ms|mcu:1@shrek/dolly` (lead room left) | shrek | match: same print, now on a chess king |
| 4 | 0:16 | He wanted to beat Netflix with one idea. | rivalry and ambition | chess, his photo king vs Netflix king, his move | `chess` (move:beat) | `ws;angle:high|cu:pt:.55,.62@idea/dolly;angle:low` | idea | the board's top view → napkin |
| 5 | 0:21 | Hollywood stars. Ten-minute shows. Only on your phone. | the idea is simple | pen sketches three boxes and a $ on a napkin | `napkin` | `ws|1.3:pt:.6,.45@phone/dolly` | phone | zoom into the phone box → |
| 6 | 0:27 | Investors gave him one point seven five billion before a single show existed. | THE absurd fact | coin towers: Quibi beside Netflix's first decade | `stacks3d` | own: low pan along the towers | billion | coin → zoom-through → |
| 7 | 0:34 | Remember that number. It's about to disappear. | OPEN LOOP | "$1.75B" as a solid title; the light sweeps it, then it goes dark | `title3d` (slam:number) | own: swing round to front | disappear | cut to black, then act 1 |

Six families appear in 40 seconds, every picture explains its sentence, and there's no shake.

## 6. Gate
`pp_shotscript check` must pass:
- every cell is filled;
- no mode appears 3 times in a row;
- at least 3 families;
- collage is 35 % of rows or less.

Then the storyboarders translate each row into `# cine` lines, one file per act. Every row's MODE, CAMERA and ON WORD must
appear in its beat.
