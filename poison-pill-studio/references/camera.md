# The camera: lens language for `# cine` beats (v4 rig, `pp_cam.js`)

Every beat longer than 3 seconds needs a deliberate camera: a shot size, an angle, and a move that lands on a spoken
word. 3D shots fly their own camera, so this file covers collage beats, set pieces and screen modes, the ones the 2.5D rig
drives. The rig has real per-plane parallax. BG moves at half the camera speed, MID moves with it, FG moves 1.5× faster.

## 1. Syntax
```
shot="<kf>|<kf>|…"      kf = <size>[:<target>][@<word>][/<move>][;key:val…]     the first kf is the opening frame (t = 0)
focus="auto|off|bg@0|1@deal|fg1@billion"                                         rack focus between planes
```
- **size**:
  - `ews`, `ws`: the whole frame.
  - `ms`: the whole figure.
  - `mcu`: head and chest.
  - `cu`: the face.
  - `ecu`: the eyes or a detail.
  - `insert`: the centre of an object.
  - a number such as `1.6`: zoom.
- **target**:
  - `1`…`n`: mid layers.
  - an image id.
  - `fg1`…: foreground layers.
  - `hero`.
  - `pt:x,y`: any frame point, which is how you frame inside a set piece.
- **move**:

  | move | what it does | when to use it |
  |---|---|---|
  | `cut` | 0 s punch-in | jump to a closer size on the stressed word |
  | `dolly` | 1.1 s power3 push or pull | the default intentional move |
  | `glide` | eases over the whole gap | slow reading moves, establishing |
  | `whip` | 0.28 s with motion blur | change of subject, "but…", a turn |
  | `crash` | 0.16 s snap zoom with overshoot + shake | an impact. Rare: about 1 per minute |
  | `rack` | 0.6 s with a focus pull | shifting attention between planes |
  | `vertigo` | dolly-zoom: subject stays, background stretches | realisation, the floor dropping out |
  | `truck` | lateral move, strong parallax | travelling along a set: dominoes, a skyline, pipes |
  | `drop` | pedestal down | descending: the iceberg dive, into the crack |
  | `rise` | pedestal up | rising: up the ladder, up to the controller |
- **keys**:
  - `dutch:<deg>`: roll.
  - `angle:low|high|eye`.
  - `hand:<0..2>`: handheld.
  - `breathe:<%>`: slow push after landing, 3 by default.
  - `dur:<s>`.
  - `ox`/`oy`: lead room.

Example:
`shot="ws|mcu:1@dealmaker/dolly|ecu:1@billion/crash;dutch:-5|ws:2@but/whip"`

## 2. Grammar: what each choice means
| Choice | Meaning on this channel |
|---|---|
| **EWS/WS** | context: the place, the scale of the operation, the whole system (open each act and each new location wide) |
| **MS/MCU** | the person as an actor in the story; use it for introductions |
| **CU** | judgement: the face at the moment of the decision, the lie, the fall |
| **ECU / insert** | evidence: the number on the page, the signature, the word in the post |
| **low angle** (`angle:low`) | power, arrogance, the founder at the top, the tower of money |
| **high angle** (`angle:high`) | smallness, defeat, a board looking down on the pieces |
| **dutch** (5–8°) | something is wrong. Use it in the doubt and fall acts only, never in setup |
| **handheld** (`hand:1`) | urgency, investigation, the leak (doubt act) |
| **push in** on a word | "this matters" |
| **pull out** on a word | reveal: the bigger picture, the consequence, the scale |
| **rack focus** | moving attention from the person to the document they signed |
| **vertigo** | the realisation (the founder learns the number). Once per episode |
| **whip** | a turn in the logic ("but"), or a jump to a parallel place |
| **truck** | inspecting a line of things: the chain, the rivals, the years |

## 3. Rules
1. **Scale changes across every cut.** Wide → close → medium. Never open two consecutive beats on the same size (lint
   warns).
2. **The move lands on a stressed word.** Keyframes 2+ need `@word`; only `glide` is exempt.
3. **One intention per move.** A move without a reason is noise. Write the reason in the visual script's CAMERA column.
4. **Leave reading holds.** After the move lands, the frame keeps a 3 % breathing push. Never pile a second fast move
   onto a frame the viewer is reading.
5. **Crash zooms and shakes are rare** (≤ 2 per minute combined). The rig's `crash` already counts as a shake.
6. **Lead room.** A face looking left sits on the right third (`ox:.1`) and looks *into* the frame.
7. **Bridge moves.** End a beat with a push into an object (`insert:fg1@word/dolly`) and open the next beat on a matching
   object or close-up. That's a zoom-through / match cut, the cheapest way to look expensive.
8. **3D shots fly themselves.** Don't put `shot=` on a beat whose main event is a `*3d` mode.

## 4. Recipes
| Situation | `shot=` |
|---|---|
| Introduce a person | `ws|mcu:1@<name>/dolly` |
| A number lands on a document | `ms:1|insert:fg1@<number>/dolly` + `focus="1@0|fg1@<number>"` |
| The lie, then the truth | `cu:1;hand:1|ws@but/whip` |
| Arrogance | `mcu:1;angle:low|cu:1@<word>/dolly;angle:low` |
| Defeat | `ms:1;angle:high|ws@<word>/glide;angle:high` |
| Realisation | `mcu:1/vertigo` |
| Walk the domino chain | `1.8:pt:.2,.62|1.4:pt:.6,.6@<w>/truck|ws@<w2>/dolly` |
| Dive under the iceberg | `1.7:pt:.5,.3|ws/glide|2:pt:.5,.78@<w>/drop` |
| Up to who pulls the strings | `1.4:pt:.5,.55|ws@<w>/rise` |
| Into the scandal on the chart | `ws|2:pt:.7,.4@<w>/dolly` |
