# Cinematography — how every shot earns its place

Sources studied (Oct 2026): fxguide on *Spider-Verse* (Sony Imageworks), Arcane breakdowns (Fortiche), NFI camera-angle
guide, StudioBinder (shot sizes, colour scripts, text in film), PremiumBeat "9 essential cuts", Tuts+ composition rules,
the 12 principles of animation (Thomas & Johnston), Kurzgesagt process notes. Everything below is mapped to engine keys.

## 1. Pick the angle from the emotion, never at random
| Feeling the line must create | Angle / size | Engine |
|---|---|---|
| power, threat, awe ("7 million bikes") | worm's-eye / low, wide lens | `street3d cam=worm`, `shot_worm`, `angle=low` |
| small, lost, overwhelmed | high angle, extreme long shot, tiny figure | `cam=high`, `cam=bird`, `shot_bird`, `shot=els` |
| god's view, system, "here's the secret" | overhead / bird's-eye, slow drift | `cam=bird`, map beats, `map3d` |
| decision, confrontation | over-the-shoulder | `cam=ots`, dialogue `shots=ots` |
| intensity, fear, a single detail | extreme close-up (eyes, hand, price tag) | `shot_eyes`, `shot=ecu` |
| unease, chaos, something is wrong | Dutch tilt (roll 6–12°) | `path=…` with roll, `angle=dutch` |
| energy, speed | whip pan, chase cam, near-miss past the lens | `cam=chase`, `near=t`, `trans=whip` |
| reveal of scale | crane up / pull out | `cam=crane rise=.6`, `moves pullOut` |
| immersion, "you are there" | eye-level, long take, handheld | `cam=eye`, `cam=handheld` |
| a turn / disorientation | dolly-zoom (push in while fov widens) | `path="…,fov 30@0|…,fov 60@2"` |
Rule: **every beat changes at least one of angle, size or side** from the previous beat. Two identical framings in a row = a jump cut you didn't mean.

## 2. Shot sizes and the vertical frame
- Sequence grammar: establishing (ELS/LS) → MS → CU, then break it with an ECU or a bird's-eye on the turn.
- 9:16 loves height: towers, falling, rising, stacks, worm's-eye. Put the subject in the middle third, faces in the upper
  third (y 25–45 %), lettering y 15–35 %, captions at 76 %. Nothing important below 80 % or right of 88 % (platform UI).
- 16:9 loves width: lateral tracking (side cam), two-shots, maps, parades, versus splits.

## 3. Composition checklist (each frame, before render)
1. One subject. If you can't say what the eye goes to first, the frame fails.
2. Rule of thirds / golden spiral for the subject; dead centre only for symmetry = rigid power (palaces, armies, a verdict).
3. Leading lines into the subject: roads, wires, rivers, rows of lanterns (the flat-3D street does this for free — use it).
4. Lead room: more space in the direction of looking or moving.
5. Depth: foreground / midground / background, each with a purpose (`fg=` layers, near billboards, haze `fog`). Five parallax planes is the house standard.
6. Frame within a frame: doorways, windows, arches, the OTS shoulder, foliage.
7. Negative space for drama — and for the lettering. Plan where the title sits when you plan the shot.
8. Scale: tiny figure + huge world = awe; huge face + tiny world = intimacy.
9. Tight spaces = tension, open spaces = freedom (Arcane). Contrast between two worlds = conflict.

## 4. Camera movement needs a motive
- Move **with** something (a scooter, a walk, a falling object) or **toward** meaning (push in on the decision).
- Push in = it matters / realisation. Pull out = consequence / scale. Crane up = triumph or release. Orbit = heightened moment.
  Static locked-off = comedy beat (let the gag play). Handheld = documentary truth / panic.
- Ease every move (slow in, slow out). Never two moves fighting in one shot. Hold 0.3–0.5 s still before a cut on a punchline.
- Flat-3D: `path="x,y,z,yaw,pitch,fov@t|…"` keys are smoothstepped; 2–3 keys per beat is enough.

## 5. Light and colour script
- Before writing beats, write a one-line **colour script** in the treatment: `// colour: dusk orange (hook) → cold blue (danger) → noon gold (relief) → neon night (payoff)`.
- Warm = safety, love, appetite; cool = danger, loneliness, the past; saturated = excitement; desaturated = memory (`grade=sepia`).
- Change palette on the story's turns, not randomly. Key moments get the strongest contrast (silhouettes, rim light, god rays `rays=`).
- `time=dusk|day|night` on sets; `grade=` per beat; emissive signs and light pools for night.

## 6. Cutting
| Cut | Use | Engine |
|---|---|---|
| hard cut | default; on the beat of the music | `trans=cut` |
| cut on action | mid-movement (a scooter crossing frame, a hand slam) — invisible | cut while a near billboard fills frame |
| match cut | shape/action rhyme across time or place (lantern → moon, river 1288 → river today) | same composition, `trans=cut` |
| smash cut | loud → silent or calm → chaos, for comedy | `trans=cut` + music dip (`drop=`) |
| J-cut | next scene's sound starts first (horns before we see the street) | sound cue with negative offset `sfx="-0.6:city_bed"` |
| L-cut | voice continues over a reaction shot | dialogue line spans the next beat |
| cross-cut | two simultaneous lines of action (Dave vs bus) | alternate short beats |
| montage | time passing, a list, a journey | `# montage`, `# timelapse` |
| cutaway | quick detail to orient (sign, price, map pin) | 1–2 s beat |
Pace: hook 1–2 s per shot, body 3–6 s, emotional beats 6–8 s. A turn every 5–8 s. Re-hook every 60–90 s in YouTube cuts.

## 7. Animated-feature tricks that read as "expensive"
- **Spider-Verse**: animate on twos for snap (the rig already steps); drawn speed lines instead of motion blur; colour
  misregistration as defocus (the `slam` lettering does it); halftone and hatching in shadows; comic onomatopoeia in frame
  (`artfx=comic`); exaggerated perspective — lean buildings, push the worm's-eye fov to 70+; design beats accuracy.
- **Arcane**: symmetry for authority, tight framing for tension, a dedicated palette per world, slow motion on the decisive moment, light as emotion.
- **Kurzgesagt**: one clear idea per shot, scale jumps (cell → planet), satisfying loops, flat colour with soft gradients and glow (`charstyle: nutshell`).
- **12 principles**: anticipation before every big action, overshoot and settle, follow-through on hair/cloth, arcs not straight lines, squash & stretch on impacts, secondary action (a dog, a lantern sway) in every long shot.
- Impact frames: 2–3 frames of inverted/flat colour on the biggest hit (`impacts`), screen shake ≤ 0.25 s.
- Letterbox (`lb`) only for the big moments so it means something.

## 8. Shot list (write it before the story file)
For every beat: `// shot: <size> <angle> <move> — <emotion> — <what the lettering does> — <sound>`
```
// shot: ELS worm push — awe — "7,000,000" slams into the sky — riser → boom, horns
// shot: OTS dusk static — decision — none — city bed, one horn
// shot: ECU eyes — panic — none — heartbeat, music drops out
// shot: bird's-eye drift — understanding — "THE RIVER" mask title — wind, music returns
```
