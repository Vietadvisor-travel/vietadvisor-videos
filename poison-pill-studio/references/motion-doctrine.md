# MOTION DOCTRINE: what the best agent video skills know (learned Oct 2026)

Distilled from:
- HeyGen **HyperFrames** (`motion-doctrine`, `cut-the-curve`, `story`, `motion`, `film`: rules measured frame by frame
  on shipped films; Apache-2.0);
- **Remotion**'s official agent skills (`remotion-markup`: effects, transitions, video editing, timing, motion blur);
- documentary craft notes (Johnny Harris, 2.5D photo parallax).

Here they are rewritten for our engine. Read with `scene-script.md`. Where they disagree with older files, these win.

## 1. The seam law: one camera, not a slideshow
- **How a scene exits decides how the next enters:**
  - same axis, same direction, matched speed;
  - the cut lands mid-motion on both sides;
  - settling to rest before a cut, or starting from rest after it, is a dead beat.
- **Z has a sign:**
  - a push (things growing) is answered by a push;
  - a pull (things shrinking) is answered by a pull;
  - a receding exit followed by a grow-from-small entry is the most common error.
- **One current per film** (default: leftward or rightward travel). Reserved vectors carry meaning:
  - up = a reveal or conclusion;
  - Z forward = deeper into the same thought;
  - Z back = an arrival;
  - burst = leaving a world.
  - Never ping-pong directions without a visible cause.
- **Carriers:** the eye follows objects. Hand a concrete thing across the cut at the same position and speed, e.g. a
  coin, a line, a document, a light. Never a crossfade: it carries nothing.
- **Causal motion:** each move is launched by the last (impact → recoil → reveal). Effects start on the causing frame,
  never "shortly after". Big things rebound slower, small things snap.

## 2. The cut catalogue (parameters at 1920×1080)
| Cut | Use | Recipe |
|---|---|---|
| **Cut the curve** (default seam) | the next beat, in the current | outgoing hero accelerates ~230 px (12 % of frame) with an ease-in (power4.in, 0.3 s); the cut lands mid-move; the incoming hero arrives already moving the same way, decelerating (power4.out, ≥ 0.3 s); the outgoing fade ends at 25–30 % of its travel; optional 8–10 px directional blur |
| **Zoom-through** | deeper into the same thought | exit scale 1→1.2, blur 0→10 px, 0.2 s ease-in; hard swap at peak blur; entry 0.75→1, blur 10→0, 0.5 s expo.out; never both visible |
| **Inverse zoom** | an arrival or payoff | exit 1→0.8 + blur; entry arrives oversized 1.25→1, 0.5 s; spend it on payoffs only |
| **Rack-focus blur-cut** | a state change of the same surface | outgoing stays opaque; blur spikes to 8–12 px; one-frame swap at the peak; lens-breathing scale ~1.06; ≤ once per 8 s |
| **Object becomes the world** | entering a document, a photo, a screen | the object grows past the frame in 0.65 s (ease-in-out); what surrounds it blurs ~15 px and fades in 0.3 s; the new world is its fill |
| **Match cut** | one shape holds, the world changes | a coin → a spotlight → a lens; align position and size exactly on the cut frame |
| **Whip** | time or place jumps | a 0.13–0.3 s smear; the arrival lands blurred and sharpens in 0.13 s |
| **Iris from a point** | from a detail into its world | a circle clip opens from the clicked/marked point in 0.15 s |
| **Dip cut** | a hard cut that must read as meant | darken the outgoing frame ~40 % for 3 frames, then cut |

Use 3–5 kinds in a film, each caused by something on screen.

## 3. The scene keeps performing (no idle wobble)
Breathing, floating, pulsing and slow creeping zooms are **banned as sustained motion**: they read as "the video is
waiting". Every stretch of a scene is owned by one of these routes:
- **Staged reveals:** hold content back and pay it off on the narration's words; the frame keeps gaining information.
- **Camera with intent:** establish wide → travel → arrive on the subject; then the camera stops.
- **Sequenced UI life:** the screen does what the voice says: a value is typed, a bar fills, a count ticks.
- **Acted sequence:** objects act the beat out: a card files into a stack, a stamp is pulled, a door closes.
- **Footage playing:** real motion is never idle.

Pause test: freeze any second. Something meaningful must be mid-flight.

**Stillness before the climax:** hold 0.3–0.75 s between the action and its result, the dramatic comma. Music ducks.

## 4. Timing that reads as made by a person
- **Arrive slow, leave clean:**
  - arrivals use long-tailed ease-outs (expo.out, power4.out);
  - exits are 40–50 % shorter and accelerate (power3.in);
  - camera moves ease both ways (power2.inOut).
  - The same 0.5 s ease on everything is the "generated" default.
- **Springs by damping ratio:**
  - 1.0 never bounces;
  - 0.7–0.85 reads premium;
  - 0.4–0.6 playful;
  - < 0.3 cartoon.
  - Position and size may bounce; opacity and colour never do. In our API:
    `spring(word, { stiff: 170, damp: 26 })` ≈ 0.8.
- **Overlap:** the next element starts when the previous is 30–50 % done. Stagger: letters 1 frame, words 60–120 ms,
  list items 40–80 ms; total stagger ≤ 0.5 s.
- **Holds:**
  - a line to be read holds 0.5 s + 0.3 s a word;
  - the last line of the film ≥ 2 s;
  - a landed title is dead still: the motion moves to the camera or the world behind it.
- **Rhythm:**
  - contrast speeds: montages cut every 0.13–0.8 s on strong beats;
  - a demonstration holds one framing 7–10 s while things act inside it;
  - an average shot is 1.8–3 s with motion inside.
  - Any single treatment goes stale after ~6 s: change the treatment, never slow the tween.
- **Music:**
  - a move that must land on a hit starts 40–190 ms early;
  - a reaction starts 0–45 ms after it;
  - the hit itself is instant (never eased).

## 5. Type
- Type is never the picture.
- At most one line on screen at a time, and at most 6 words for a title.
- Title size is 4–9 % of the frame height; hero words may fill 60–90 % of the width.
- One highlighted word, in the accent colour, carrying meaning.
- **Entrances** (vary them within a film; never fade-and-slide-up for each):
  - per word, blur 6 px → 0 with opacity, 0.13 s each, 0.067 s apart, no translate;
  - per word, grey → ink;
  - the whole line blurring in (8 → 0 px in 0.15 s);
  - a name per letter (0.1 s apart);
  - **behind the subject**: the title between the plate and the lifted person;
  - **slot-machine word**: one word rolling through options ~0.1 s a roll.
- **Exit:** a blur-out and fade of 0.13–0.25 s, or ride the scene's move.

## 6. Footage as a material (Remotion/HyperFrames practice, mapped to our engine)
| Want | Our engine |
|---|---|
| Punch-in, reframe, Ken Burns | `shot=` keyframes, or scale/translate a wrapper in a custom scene: never creep |
| Footage inside a shape (phone, window, document photo, iris) | `clip(id)` + `ctx.clip()` with a path in a custom scene |
| Split screen | two `clip()` draws in two clipped rectangles; collapse into one on the word |
| Speed ramp | `clip(id, start, speed)`: change `speed` around the hit word (e.g. 1 → 0.25 → 1) |
| Freeze on the beat | `clip(id, start, 0)` from the hit word |
| Match cut on shape | end scene A with the shape centred; start scene B with the same shape, same size and position |
| Motion blur on a fast move | `mblur(n, dt, f)` in custom scenes, or the camera rig's move blur |
| Light leak, grain, halftone, paper | the look's grade + `air:leak`; texture belongs to the look, never decoration |
| Real places | real imagery (photo, satellite, footage); vector outlines are diagrams, keep them for labels and borders on top |

## 7. Documentary craft notes
- **Johnny Harris:**
  - texture everywhere (film burns, light leaks, grain, paper) on top of real material;
  - stills slide in with an ease and an animated blur plus a projector sound;
  - maps on real imagery, with routes drawn by hand;
  - physical props filmed or composited, rather than flat 2D.
- **2.5D photos ("3D Ken Burns"):** cut the subject out, rebuild the background behind it, move the camera through
  the planes. Foreground moves faster than background (≈ 2–3 : 1). This is `scene` in our engine; give it a real
  camera path, not a creep.
- **Investigation look:**
  - real documents shown whole, then the camera travels to the line;
  - the line is marked by hand on its word;
  - the camera rack-focuses from the document to the person.

## 8. Effects Remotion ships that we should port when a card needs them
In priority order (port into `pp_custom` helpers when a scene card asks for one; save the scene to the library):
1. **Zoom blur:** radial speed into a point.
2. **Chromatic aberration** at a hit.
3. **Corner pin:** footage mapped onto a tilted screen or poster.
4. **Light trail.**
5. **Halftone and duotone** for archive.
6. **Paper tear and roughen edges** for collage.
7. **Lens distortion** (barrel or fisheye) on a whip.
8. **Pixel dissolve and venetian blinds** for data-world transitions.
9. **Progressive blur** for depth of field on a flat plate.
