# Genre craft — what the best documentary channels do, translated into this engine

Studied: MagnatesMedia / James Jani (business & founder sagas), Johnny Harris & Vox (explainer collage, maps, marker),
Wendover / Polymatter (systems, data), Coffeezilla (investigation), plus retention-editing research for long-form YouTube.

## 1. The look (what makes them read as "premium")
| They do | We do it with |
|---|---|
| Real photos cut out, BW, white border, layered over blurred context (MagnatesMedia) | `mid=` cut-outs + `bg=<plate>` blur + `tone:bw` — the default of every beat |
| Gold/navy luxury palette for money, desaturation for the fall | act colour script (setup → rise gold → doubt teal → fall red → after grey) |
| Paper textures, film burns, light leaks, grain, VHS for eras (Harris) | `bg=paper`, `burn`, `leak`, `vhs`, `tone:halftone|sepia|sketch`, engine grain |
| Photo slides in from the top while its blur clears (Harris) | `in:drop` |
| Match cut on the same phrase across a dozen screenshots, accelerating (Harris) | `matchstack:` with `ui_shutter` clicks |
| Selective focus — blurred frame, sharp oval on the subject (Harris) | `focus:1` |
| Marker annotation: circles, arrows, underlines, highlights (Vox) | `circle arrow underline mark scribble lens` |
| Animated maps with routes and highlighted countries (Vox/Wendover) | `bg=world` + `pin` `route` `hl=` |
| Investigation boards, redactions, documents as evidence (Coffeezilla) | `bg=cork` + `string`, `redact`, `scan`, real scans with `mark`+`lens` |
| Spinning newspaper, archive TV, ticker tape (classic documentary) | `spin`, `clip:…;style:tv`, `ticker`, `stockcard` |
| Data you can feel: unit charts, bar races, counters (Polymatter) | `dots`, `bars`, `odo`, `crowd`, `circles`, `days` |

## 2. Retention structure for 8–12 minutes (research-based; see sources)
- **0–15 s: state the stakes** — the end first, a number burning (S01). Aim > 50 % still watching at 30 s.
- **25–35 s: first pattern interrupt** — the `# ppcase` sting does this.
- **Progressive rhythm**: denser cutting in minutes 0–3 (a new event every ≤ 1.5 s, a new beat every 3–5 s), slightly longer holds in minutes 3–7 on examples, then alternate calm explanation with short bursts after minute 8.
- **Contrast bursts**: every 2–3 minutes a burst of 5–10 fast cuts (S23 burst, S42 match stack, S11 headline storm) — then return to calm.
- **Narrative loop**: return to the opening premise every 2–3 minutes ("and that's when the $1.75 billion started to disappear"). Every resolved segment ends by pointing at the next reason to stay.
- **Strategic silence**: ~1 s of near silence after a high-energy peak; a held dark frame before the biggest reveal.
- **Smash cut** from calm to loud after a settled rhythm (`trans=slam`).
- **Letterbox in** before big moments (`letterbox`).
- **Shot-size progression & frame-position continuity**: skip a size between cuts; keep the subject within ~10 % of its previous screen position on match cuts; keep screen direction consistent.
- **Zoom grammar**: slow push = tension, slow pull = release, matched zoom directions across adjacent beats.
- **Text emphasis on the spoken word** (our hero/kin system), never paragraphs on screen.
- **Ending**: one-line CTA at most, end on an open question pointing to the next case, never a black card.
- **Avoid**: dead air (reads as the video ending), static shots, heavy transitions everywhere (save them for act turns), over-editing that hurts clarity.

## 3. Writing moves the best channels share
- Character over company: one person's decision at every turn.
- Specific > general: the exact date, the exact sum, the exact quote.
- The "but": every 20–40 s a reversal; the act turn is a big "but".
- Foreshadow the fall inside the rise ("the first crack was already there").
- Rule of three; the third item twists.
- The thesis is a sentence the viewer can repeat to a friend.

## 4. Sources
- AIR Media-Tech — advanced retention editing patterns past minute 8: https://air.io/en/youtube-hacks/advanced-retention-editing-cutting-patterns-that-keep-viewers-past-minute-8
- Motion Array — Johnny Harris-style documentary techniques: https://blog.motionarray.com/learn/premiere-pro/edit-documentary-in-premiere-pro/
- Pixflow — YouTube video retention editing: https://pixflow.net/blog/?p=93140
- Joyspace — pattern interrupts guide (2026): https://joyspace.ai/pattern-interrupt-reset-attention-span
- Creators Project — 2.5D photography (parallax from stills): https://thecreatorsproject.vice.com/blog/joe-fellows-teaches-us-how-to-master-25D-photography
