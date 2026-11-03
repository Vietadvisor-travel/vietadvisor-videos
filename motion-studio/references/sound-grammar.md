# Vietadvisor Motion Studio — Sound Grammar & Mix Spec
Owner: re-recording mixer / sound-design director · Oct 2026 · applies to `tools/sound_design.py` (+ cue emission in `engine/timeline.js`) Scope: **when** a sound plays, **how many**, **how layered**, **how mixed**. Sound *content* = `tools/sfx_pro.py` (library agent); music = new music engine. Everything here is written as rules a machine can apply. Numbers are defaults; QA (§7) is how we tune them.

## 0. Diagnosis — why the owner hears 2/10 (measured on ep4-cross-street, Oct 2026)
| Finding (measured, not guessed) | Evidence | Consequence |
|---|---|---|
| Foley is **inaudible on phones** | foley stem: −21.8 LUFS full-range → −34.3 LUFS through a phone model (HP 400 Hz 24 dB/oct). about 80% of its energy is below 100 Hz (`city_bed`, `boom`, `impact` are 30–160 Hz sine sweeps) | Phone speakers roll off from ~800 Hz down (Waves) / 220–400 Hz (Audiokinetic). The sounds exist; nobody hears them. |
| SFX stem loses 6.6 dB, music 6.3 dB, voice 4.3 dB on a phone | same model | Voice survives best → the mix *feels* like "voice + mush". |
| Voice has weak presence | VO 2–5 kHz band sits −16 dB below its 100–300 Hz band | Phone intelligibility depends on 2–5 kHz; Kokoro output is dark and is never EQ'd. |
| Density is uneven and mostly wash | ep4: 8.9 events/10 s *on paper*, but 42 of 84 are `horn_far`/`moto_pass`/`city_bed` (bed-level). ep3: 5.1/10 s with two **0-event 10 s windows**; 21 `whoosh` + 16 `pop` = same two sounds 37 times | "Not enough sound effects" = not enough *articulated, varied, audible foreground* events. |
| Vocabulary is ~19 sounds per episode | `Counter` of ep4 events | Repetition reads as cheap; no variants or round-robin. |
| Three generators, no shared event list | `sfx.py` (renderer cues) + `ambience.py` (beds) + `sound_design.py` (foley/beats/music) mix independently | Street shots get traffic **three times** (MOMENTS `moto_pass` + `city_bed` + ambience city bed); no global priority or anti-clutter possible. |
| Duplicate hits | `title`: sfx `impact`@0 **and** shake(amp 22)@0.38 → auto `impact` again. De-dupe only merges *same name within 80 ms* | Two booms 380 ms apart = mush, not punch. |
| Whooshes peak early | `sfx.py` starts every `*whoosh*` 0.25 s early **and** transition cues sit at `start − dur/2`; the whoosh peak (55% of 0.45 s) lands at the *start* of the transition, 0.23–0.35 s before the visual peak | Whoosh precedes the motion instead of riding it; audio-lead > 45 ms is detectable (ITU-R BT.1359). |
| Many visible events are silent | no cues for: expression/pose changes, walk steps (except street3d run), pushIn/pullOut/crane/orbit/whip camera moves, map route drawing, counters in beats, bubbles/lower-thirds exits, card exits | Breaks "every visible motion has a sound" — the core of OverSimplified/Kurzgesagt style. |
| Over-processing | 3 stacked `tanh` saturators (sfx.py, foley, final) + peak-normalise + **single-pass dynamic** `loudnorm` | Pumping, dulled transients; LRA of final only 4.1–4.9 LU, TP −0.9 dBTP on the YT file (above the −1 dBTP YouTube asks for). |
| SFX stem is never ducked | `S * sfx_gain` added without the voice envelope | Hits can sit on words. |

**Fix order (highest ROI first):** (1) every sound gets a 1–5 kHz layer (library rule, §3.0); (2) single event list + scheduler (§6); (3) voice chain + ducking (§5); (4) density rules (§2) and the full mapping (§3); (5) two-pass linear mastering (§5.8).

## 1. Ten laws (the grammar in one screen)
1. **Every visible change makes a sound** — entrances, exits, pose/expression changes, camera moves, every UI element in *and out*. Exceptions are deliberate (law 7). Geisler (Cartoon Network): even an anticipation recoil needs sound, otherwise it "seems as unfinished as not animating it".
2. **Sync to the peak, not the start.** Every library sound carries `peak` metadata (seconds from file start to its transient / loudest point). The scheduler aligns `peak` to the visual anchor. Allowed error: audio may lead ≤ 20 ms, lag ≤ 40 ms (inside BT.1359 detectability 45 ms lead / 125 ms lag; EBU R37 +40/−60).
3. **Whoosh length = motion length.** <0.35 s motion → `whoosh_fast`, 0.35–0.7 s → `whoosh_med`, >0.7 s → `whoosh_long`. Leave the last ~80 ms empty if an impact lands (sonilo whoosh guide: 0.48 s title reveal with an "empty final 80 ms for a separate impact").
4. **Two-and-a-half.** Never more than 2 articulated sounds of the *same family* at once; at 3+ the brain hears a group (Murch's Law of Two-and-a-Half: past two walkers, footsteps no longer need sync). Use this: 3+ walkers → one `crowd_steps` bed, not N footstep tracks.
5. **Voice is sacred.** Design hits land in speech gaps or on the stressed word of a ≤4-word line. Music and SFX carve 1.5–4 kHz while the voice speaks.
6. **Phone first.** Every sound must read through a 400 Hz high-pass in mono. Sub (<100 Hz) is a bonus layer, never the identity of a sound.
7. **Silence is a hit.** Before the biggest moment of each act: 0.3–0.5 s dip (music −20 dB, beds −8 dB), then the hit. Max 1 per 20 s vertical / 1 per 45 s YouTube. A 2 s window where nothing moves and nothing sounds "reads as the video being over" (air.io) → forbidden unless flagged.
8. **Comedy = intro, setup, punchline, tag, one family** (SoundGirls cartoon cutting): "A single funny sound effect is almost never funny". Comedy stingers ≤ 1 per 15 s; the music stops on the record-scratch frame.
9. **Space tells story**: near = loud, bright, dry, wide; far = quiet, dark, wet, narrow. Pan follows screen x (|pan| ≤ 0.8), but toward/away motion is told by level + filter, not pan.
10. **Variation is mandatory**: round-robin variants, ±1.5 semitone pitch, ±1.5 dB gain on every repeating sound; never the same variant twice in a row.

## 2. Density targets & anti-clutter
### 2.1 Tiers (what counts as an "event")
| Tier | What | Counts toward density | Examples |
|---|---|---|---|
| **T1 hero** | the biggest hit of a moment, usually with sub + riser | yes (×1) | hook slam, title boom, reveal braam, near-miss |
| **T2 foreground** | articulated sounds tied to a visible action or UI | yes | whoosh, pop, stamp, tick, pin drop, expression stinger, price register |
| **T3 texture** | small, often off-axis detail; foley | yes (×0.5) | single footsteps, cloth, spoon clink, distant horn, bird chirp |
| **T4 bed** | continuous loops | no | street bed, rain, room tone, crowd murmur |

Density = (T1 + T2 + 0.5·T3) onsets per 10 s, measured on the *scheduled* list (after anti-clutter).
### 2.2 Per section (per 10 s window)
| Section | Vertical 9:16 (≤3 min) min / target / max | YouTube 16:9 (≤10 min) min / target / max | T1 spacing | Notes |
|---|---|---|---|---|
| Hook 0–3 s | **6 / 8 / 10** (in 3 s) | 4 / 6 / 8 (in 3 s) | T1 at ≤0.2 s | first audible event ≤ 80 ms after frame 0; no fade-in |
| Hook 3–10 s | 10 / 14 / 18 | 8 / 11 / 14 | ≥1 T1 | question line gets one riser-into-hit |
| Body | 9 / 13 / 18 | 6 / 10 / 14 | 1 per 5–8 s (V) · 8–15 s (YT) | pattern interrupt (gag/stat/stinger) every 8–12 s (V) — gofaceless/Creedom; every 20–40 s (YT) |
| Dialogue / talk passages | 6 / 9 / 12 | 5 / 7 / 10 | none on words | texture + reactions carry density, not hits |
| Payoff | 11 / 15 / 20 | 9 / 13 / 16 | 1 per 4 s | biggest music, victory recipe |
| End frame | 2 / 3 / 4 | 2 / 3 / 4 | brand sting | resolved chord, nothing after it |

These are working targets based on the reference styles (OverSimplified: a sound on nearly every pose, prop and gag; Kurzgesagt: soft UI/motion sound on most element animations). They are not measured counts from those channels. Calibrate by running the §7 QA on any reference clip you are licensed to analyse.
### 2.3 Per beat (minimum T1+T2 events per beat, independent of length)
`hook 6 · map 5 · title 4 · intro 6 · talk 3 + 1 per 4 s · price 5 · list 2 + 1 per item · compare 6 · reveal 5 · ride 4 + texture · gag 5 · social 3 + 2 per toast · route 3 + 1 per city · stat 4 · scale 2 + 1 per mark · payoff 7 · countdown 5 · myth 6 · quiz 8 · timeline 2 + 1 per event · steps 2 + 1 per step · budget 3 + 1 per bar · calendar 3 + 1 per 3 months · dialogue 2 + 1 per line · montage 2 per place · collage 2 per photo · photo 3 · timelapse 4 · moment 4 (kind-specific) · chapter 3 · end 2.`
### 2.4 Anti-clutter (the scheduler enforces these, §6.3)
- **Priority** 1 (never dropped) → 5 (first dropped). P1: VO/dialogue, T1 hero hits, sync contact sounds of the hero character. P2: transitions, typekit landings, UI the caption refers to. P3: other UI, expressions, camera moves. P4: secondary characters, extra foley. P5: random sweeteners, distant horns.
- **Concurrency**: at any instant ≤ **3 foreground** sounds (T1+T2 active above −20 dB of their peak), of which ≤ 1 T1; ≤ **2 per family** (`whoosh_*`, `impact_*`/`hit_*`, `ui_*`, `cartoon_*`, `foley_step*`…); ≤ 2 beds + music.
- **Spacing**: same sound name ≥ 0.25 s apart (merge if closer: keep higher priority, +1 dB); same family ≥ 0.12 s; T1 ≥ 4 s (V) / 6 s (YT); `riser_*` ≥ 10 s; comedy stingers (`cartoon_scratch`, `cartoon_boing`, `cartoon_slide_whistle`, `cartoon_sad_trombone`) ≥ 15 s and ≤ 4 per vertical, ≤ 10 per YT cut.
- **Hit de-dupe across sources**: any two `impact_*`/`hit_*`/`boom` within 0.15 s collapse into one layered hit (keep the higher priority's anchor). Shake-generated hits yield to any explicit hit within ±0.45 s.
- **Voice protection** (VAD from `_vo.wav`, 10 ms frames, threshold −40 dBFS, hangover 120 ms): while speech is active —
  - T1: may not start on speech; if not tied to visible contact, shift into the nearest gap within [−0.15, +0.25] s; else −6 dB and flag in QA.
  - T2 design sounds (non-contact): shift window [−0.10, +0.15] s; otherwise −4 dB plus the SFX dynamic-EQ dip (§5.4).
  - Contact-sync sounds (a stamp hits paper, a foot lands) are **never moved** more than −20/+40 ms; they are attenuated instead.
  - T3/T5 sweeteners: drop if overlapping a stressed word (word with the highest RMS in its line).
- **Gap filler**: if any 1.5 s (V) / 2.5 s (YT) window has zero T2/T3 onsets, no `drop`/`hush` flag and no VO, insert one place sweetener (§3.10) at the window centre (P5).
- **Masking budget**: in any 400 ms speech window, the summed non-voice energy in 1–4 kHz must stay ≥ 10 dB below voice energy in the same band (QA warns at < 6 dB).

## 3. EVENT → SOUND mapping
### 3.0 Conventions (read once)
- **Layer notation** `name@off/gain`: `off` = seconds where the sound's **peak** lands relative to the event anchor (negative = before = lead); `gain` = dB relative to the library-normalised level. Library normalisation: one-shots → momentary-max −14 LUFS-M; loops/beds → −24 LUFS integrated.
- **Pan**: `C` centre · `X` follows object screen x: `pan = clamp((x−.5)·1.6, −.8, .8)` · `MOVE` automates from start x to end x over the sound · `DIR` from the side the motion enters · `RND a` random in ±a · `W` stereo-wide (decorrelated L/R) · `N` narrow (width 30%).
- **Var**: `RR` round-robin variants · `P±n` random pitch ±n semitones · `G±n` random gain ±n dB · `ESC+n` successive items rise n semitones · `LEN` choose the variant whose length matches `dur`.
- **Prio** 1–5 as in §2.4. **Bus**: FG (foreground SFX), BG (background SFX), AMB, MUS, VO, DLG.
- **Phone rule for the library** (request to the sfx_pro agent): every one-shot must have ≥ 40% of its energy between 400 Hz and 6 kHz; every sub hit ships with a mid "body" (150–400 Hz) and a "snap" (2–5 kHz) layer; add 2nd/3rd harmonic saturation to anything below 120 Hz so the pitch still reads on small speakers (Waves small-speaker tips).
- **Names** use the library prefixes. Fallback chain while the library is being built: `whoosh_fast → whoosh`, `impact_heavy → impact`, `ui_tick → tick`, `cartoon_pop → pop`, `riser_* → riser`, `hit_* → thud`, `amb_* → ambience.py bed`. An unknown name must raise a QA error, never silently become `pop` (current `sfx.py` behaviour).
- **Anchors**: transitions → visual midpoint `at` (scene boundary); entrances → landing frame (`at + dur`); UI → `o.at` + its pop overshoot peak (+0.12 s for `pop()` easing); camera moves → `t0` for onset sounds and `t1` for landings.
### 3.1 Transitions (anchor = scene boundary `at`, `d` = transition duration)
| Transition | Layers | Pan | Var | Prio |
|---|---|---|---|---|
| `cut` (place changes) | AMB of the new place starts −0.4 s (J-cut); old bed ends +0.6 s (L-cut tail, −12 dB/0.4 s fade) | — | — | 2 |
| `cut` (same place) | none; `hit_soft@0/−14` only if the density floor needs it | C | RR | 5 |
| `cut` smash (into street3d/title/`drop=`) | music cut at −0.02 s; new bed + hit start exactly on frame | C | — | 1 |
| `whip` | `whoosh_fast@0/0` (LEN d) + `whoosh_air@−0.04/−6` + `hit_soft@+d/2/−8` | MOVE L→R, W | RR P±1 | 2 |
| `whipUp` | `whoosh_rise@0/0` + `whoosh_air@−0.04/−6` | C, W | RR P±1 | 2 |
| `circles` | 5× `cartoon_pop` from −d/2 to 0 every d/5, ESC+2 + `whoosh_med@0/−6` | pops RND .6 | ESC | 2 |
| `stripes` | 3× `whoosh_small` at −0.07/0/+0.07 | L, C, R | RR | 2 |
| `iris` | `whoosh_down@−d/4/−2` (closing) + `cartoon_plink@0/−6` + `whoosh_up@+d/4/−4` (opening) | C | P±1 | 2 |
| `ink` | `trans_ink_splat@0/0` + `whoosh_down@−0.05/−8` | C | RR | 2 |
| `inkbleed` | `trans_ink_bloom@0/0` (LEN d) + `riser_soft@0/−12` | C, W | RR | 2 |
| `burn` | `trans_fire_whoosh@0/0` + `foley_paper_crackle@−d/2/−8` (dur d) | C | RR | 2 |
| `lightleak` | `magic_shimmer@0/−4` + `whoosh_air_rev@0/−8` + `riser_tonal_soft@0/−14` | W | RR | 2 |
| `fgwipe` | `whoosh_close@0/0` (doppler); in street/market places → `vehicle_moto_pass_close@0/−2` | MOVE | RR P±1 | 2 |
| `tear` | `foley_paper_tear@0/0` (LEN d) + `whoosh_small@+0.05/−8` | MOVE | RR | 2 |
| `paper` | `foley_paper_slide@0/−2` + `foley_paper_flap@+0.1/−6` | DIR | RR | 3 |
| `slide` / `push` | `whoosh_small@0/−2` + `hit_wood_soft@+d/2/−10` | DIR | RR P±1 | 3 |
| `zoom` | `whoosh_zoom_in@0/0` + `hit_soft@+0.1/−8` | C | P±1 | 2 |
| `flash` | `hit_snap@0/0` + `impact_mid@0/−6` + `whoosh_rev_cymbal@−0.02/−10` (ends on cut) | C | RR | 1 |
| `fade` | none (music carries); if `d ≥ 0.8` → `whoosh_air_long@0/−16` | W | — | 4 |
| `portal` | `magic_portal@0/0` + `riser_soft@0/−8` (0.5 s) | W | RR | 2 |
| `glitch` | `glitch_burst@0/0` (LEN d) + 3× `glitch_tick` random in ±d/2 | RND .5 | RR | 2 |
| `watercolor` | `nature_water_drip@0/−6` + `magic_shimmer_soft@+0.1/−10` | C | RR | 3 |
| `brand` | brand sting: `whoosh_med@−0.1/−2` + `ui_chime_brand@+0.15/0` + `hit_sub_soft@+0.15/−10` (identical every episode = sonic logo) | C | none | 1 |
### 3.2 Beats (anchors in beat-local seconds; captions/VO handled separately)
| Beat | Mandatory layers | Bed | Prio notes |
|---|---|---|---|
| `hook` | Hook-slam recipe (§4.1) at 0; `riser_short` into the question's last word; place bed −10 dB (dimmed) | place | slam P1 |
| `map` | `whoosh_long@1.4/−2` over camLerp 1.4–4.6 (LEN 3.2), `riser_soft` ending at 4.2, pin-drop recipe at 4.2, `impact_mid@4.65/−4` on the shake | `amb_map_air` (wind −30) | pin P2 |
| `title` slam | `impact_heavy@0.38/0` + `hit_sub@0.38/−6` + `whoosh_rev_cymbal@0.38/−8` + `crowd_ooh`? no; bike passes 0.9–2.6 → `vehicle_moto_pass@1.75/−6` MOVE | none | one hit only (kills the double impact) |
| `title` paper | `foley_pen_write@0.1` (dur ≈ letters×0.06) + `impact_stamp@0.9/0` + `foley_paper_rustle@0/−14` | room tone | |
| `title` place/film | Big-reveal recipe (§4.2) with riser ending at 0.05 | place bed | P1 |
| `intro` | drop-in (§3.4 enter drop) at 0.1; `ui_arrow_draw@0.7` + `ui_pop@arrow tip`; host slideR whoosh at 1.8; `ui_lower_in@2.2`; bubble pop at 2.9; react: expression stinger at tReact + `whoosh_zoom_in@tReact/−6` (cam push) + focus-lines `magic_zing@tReact/−8` | place | react P2 |
| `talk` | host `up` entrance whoosh; prop pop + `hit_wood_soft` landing on table; `big` text → typekit landing sound (slam-lite); pose2 change at dur·.55 → `foley_cloth@/−14`+`whoosh_tiny@/−12` | place / studio room tone + 1 sweetener per 3 s | sparse: no hits on words |
| `price` | Price recipe: `ui_tag_slap@0.9/0` + `ui_register@1.0/−2` + `ui_coins@1.5/−6` (+ `impact_stamp@1.4/−4` if `checked`); camera bounce `cartoon_boing_tiny@1.05/−14`; react → `food_mmm`/`food_slurp` (yummy) at 1.5 | place | register P2 |
| `list` | title zoom → `whoosh_zoom_in@0.2`; per item at `1.0 + i·step + .2`: `ui_check@/0` (ESC+1) or `ui_cross@/0` + `cartoon_buzz_short@+0.05/−6` for `!`; host point → `whoosh_tiny` | place / studio | items P2 |
| `compare` | divider wipe `whoosh_med@0/−4`; left pop at 0.2 (`cartoon_pop` L), right pop at 0.5 (R); titles `ui_pop_small` ‑0.1; prices `ui_tag_slap` per side; verdict → `impact_mid` on the side that wins | studio | panned L/R ±0.5 |
| `reveal` | Big-reveal recipe at t=2.2 (end of the reveal move) with `whoosh_down@0→2.2` LEN; banner `ui_banner_unfurl@2.0`; particles → `magic_sparkle_bed` −20; hero slideL whoosh at 1.6 | place | P1 |
| `ride` | `vehicle_moto_loop` (speed-mapped pitch) + `whoosh_wind_loop` (speed) + speed-lines `whoosh_air_loop −14`; `stop=yes` → `vehicle_brake_squeal@dur·.45` + engine idle; road sign slide-in `whoosh_med` + `hit_wood_soft` lock; passenger → `cartoon_whee@1.0/−10` | place (wind if mountain) | engine P3 |
| `gag` | Joke-button recipe (§4.4) at tHit; setup: music −6 dB from tHit−0.35 (comic pause) | place | P1 at hit |
| `social` | per toast t: `food_glass_clink@t/0` (RR, P±2) + `crowd_laugh_small@t+0.3/−10` + `foley_cloth@t−0.2/−14`; cheer → `crowd_cheer_vn@t0−0.3/−4` ("một hai ba dô"); expression drift (tipsy/dizzy) → `cartoon_wobble@/−12` | `amb_homestay_night` (fire crackle, crickets) | clinks P2 |
| `route` | map drift `whoosh_air_long −16`; route draw `foley_marker_loop` from 0.5 to draw+0.5, pitch ∝ draw speed; per city `ui_pin_small@cityAt/−4` ESC+1; rider `vehicle_moto_tiny_loop −18`; each stat card `ui_card_in@at/−4` + `ui_card_out` at until | `amb_map_air` | cities P2 |
| `stat` | Counter recipe: `ui_tick_roll@0.2` (dur 1.4, rate ∝ digits) + `ui_ding_big@1.6/0` + `hit_soft@1.6/−6` + label pop `ui_pop@1.2` | burst bg → `riser_tonal_soft@1.6/−16` | land P2 |
| `scale` | per mark i at i·dur·.7/n: `ui_tick@/−4` ESC+2; camera tilt `whoosh_long` LEN; last mark ("NOPE.") → `cartoon_record_stop@/−4` or `hit_stinger` | place | last mark P2 |
| `payoff` | Victory recipe (§4.6) at 2.5 (title), `ui_cta_chime@3.5/−4`, sub pop at 3.0, pullOut → `whoosh_air_long@0→2.4/−12`; host slideR whoosh 0.6 | place sunset bed | P1 |
| `countdown` | number slam `whoosh_up@0.05` + `impact_mid@0.3` (+1 semitone per lower number: #3→#1 escalates) + prop pop; `crowd_ooh_small@0.6/−14` on #1 only | studio | P2 |
| `myth` | myth card `ui_card_in`; BUSTED: `impact_stamp@tb/0` + `cartoon_buzz@tb+0.05/−6` + `cartoon_scratch@tb−0.02/−4` (music stops on the same frame); fact card `whoosh_med@tf` + `ui_ding@tf+0.3` | studio | stamp P1 |
| `quiz` | option pops `ui_pop` ESC+1; countdown ring `ui_tick_clock` ×3 + heartbeat bed (`foley_heartbeat` 70 bpm → 110 bpm); drumroll from rv−1.8; reveal: `ui_ding_big@rv` + `crowd_ooh_small@rv+0.1/−8` + `crowd_claps_small@rv+0.25/−10`; wrong options `ui_cross −8` | quiz pulse music | reveal P1 |
| `timeline` | `foley_pen_draw` along the line; per event `ui_pop@at/−2` + year `ui_tick_roll_short` (if typed); era change → `whoosh_med` | paper room tone | items P2 |
| `steps` | per step at at_i: `ui_card_in@/0` + icon `cartoon_pop@+0.12/−6` + number `ui_tick@/−8` ESC+1 | studio | P2 |
| `budget` | per bar: `ui_slide_fill@at/−2` (LEN bar fill) + `ui_coins_small@end/−8`; total: `ui_register@tt/0` + `ui_ding_big@tt+0.2` | studio | total P1 |
| `calendar` | month cells `ui_tick_soft` every cell (rate 12 / fill dur), rating 3 cells get `ui_ding_small −10`, note → `foley_pen_write` | studio | P3 |
| `dialogue` | per line: speech bubble `ui_bubble_pop@bubble_at/−6` (panned to speaker side ±.4); speaker mood change → expression stinger (§3.4) only in the gap *after* the line; `act=` gestures → pose sounds | place | lines P1 (DLG bus) |
| `montage` | per segment i: `whoosh_fast@i·seg/−2` (i>0), first `impact_mid@0`; place label stamp `ui_stamp_small@i·seg+0.2/−6`; each segment gets its own place bed slice (J-cut 0.15 s) | per segment | P2 |
| `collage` | per photo: `foley_photo_slap@at/0` (sticker) / `foley_polaroid@at` / `foley_paper_tear@at`; camera visit `whoosh_small` MOVE; labels `ui_pop_small` | paper room tone | P2 |
| `photo` | Ken Burns → `whoosh_air_long −18` over the move; label `ui_lower_in`; host pose sounds; photo place gets its real-place bed | place | P3 |
| `timelapse` | `ui_clock_tick_accel` (dur), `whoosh_air_loop` rising pitch; per time-of-day change: bed crossfade (day birds → sunset → night crickets) + `magic_shimmer_soft` at each switch | time beds | P3 |
| `moment` | see §3.6 (street3d) and §3.11 (set pieces) | kind | — |
| `chapter` | Chapter-card recipe (§4.3) | room tone | P1 |
| `end` | brand sting (§3.1 `brand`), music resolved chord ≤ 0.2 s after logo lands | none | P1 |
### 3.3 UI components (anchor = element `at`; exits at `until`)
| UI event | Layers | Pan | Var | Prio |
|---|---|---|---|---|
| any UI **in** (generic) | `ui_pop@+0.12/−4` | X | RR P±1 | 3 |
| any UI **out** (`until`) | `ui_whoosh_out_small@+0.05/−10` | X | RR | 4 |
| checklist item ✓ | `ui_check@0/0` + `foley_pen_tick@−0.03/−10` | X | ESC+1 (cap +6), RR | 2 |
| checklist item ✗ (`!`) | `ui_cross@0/0` + `cartoon_buzz_short@+0.05/−6` | X | RR | 2 |
| price tag in | `ui_tag_slap@+0.1/0` + `ui_register@+0.1/−2` + `ui_coins@+0.6/−6` | X | RR | 2 |
| price `checked` stamp | `impact_stamp@+0.5/−2` + `foley_paper_thud@+0.5/−10` | X | RR | 2 |
| stamp (UI.stamp) | `impact_stamp@0/0` + `hit_wood_soft@0/−8` + `foley_ink_squelch@+0.03/−12` | X | RR P±1 | 2 |
| stat / info card in | `ui_card_in@0/−2` (whoosh + soft click lock at +0.12) | DIR | RR | 3 |
| stat card out | `ui_card_out@0/−8` | DIR | RR | 4 |
| banner | `ui_banner_unfurl@0/−2` (cloth flap) + `ui_pop@+0.25/−8` | C | RR | 3 |
| bubble | `ui_bubble_pop@+0.08/−4` (wet pop) | X | RR P±2 | 3 |
| arrow | `foley_marker_draw@0/−6` (LEN arrow draw) + `ui_pop_small@end/−8` | MOVE | RR | 3 |
| lower third | `ui_lower_in@0/−6` (slide + tick) ; out `ui_lower_out −10` | L→C | RR | 3 |
| punch text | `cartoon_hit_comic@0/0` + `impact_mid@0/−6` | X | RR | 2 |
| CTA | `ui_cta_chime@0/−4` (brand-key chime) | C | none | 2 |
| counter | `ui_tick_roll` (tick rate = min(25, Δdigits·6)/s, decelerating with the easing) + `ui_ding@land/0` | X | P±0.5 per tick | 2 |
| title (UI.title) | per line: `impact_mid@line_at/−2`, last line `impact_heavy` + `hit_sub −8` | C | ESC+1 per line | 1 |
| chapter (UI.chapter) | Chapter-card recipe | C | — | 1 |
| endFrame / logo | brand sting | C | none | 1 |
| choir (UI.choir) | `magic_choir_ahh@0/−6` + `magic_shimmer@0/−12` | W | RR | 2 |
| map pin | Pin-drop: `cartoon_fall_whistle_short@−0.05/−8` (whistle ends on landing) + `ui_pin_thunk@0/0` + `magic_sparkle_small@+0.05/−10` | X | RR P±1 | 2 |
| map route draw | `foley_marker_loop` from route start to end, pitch ∝ draw speed, −8; `ui_pin_small@city/−4` ESC+1 | MOVE (follows head) | — | 3 |
| map territory fill | `magic_liquid_fill@start→end/−6` (LEN) + `impact_wood@end/−4` | X | RR | 2 |
| map label | `ui_pop_small@+0.1/−8` | X | RR | 4 |
### 3.4 Character events (from `layers[].keys`, `in/out`, `act=`, beat react keys)
| Character event | Layers | Pan | Var | Prio |
|---|---|---|---|---|
| enter `drop` | `cartoon_fall_whistle@−0.05/−6` (starts at `at`, ends at land) + `impact_body_thud@0/0` (land) + `foley_dust_puff@+0.03/−8` + squash → `cartoon_boing_tiny@+0.08/−14` | X | RR P±1 | 2 |
| enter `pop` | `cartoon_pop@+0.12/−2` | X | RR P±2 | 3 |
| enter `slideL`/`slideR` | `whoosh_small@land−0.05/−4` + `foley_shoe_skid@land/−8` | DIR→X | RR | 3 |
| enter `up` | `whoosh_up_small@land/−8` | X | RR | 3 |
| enter `zoom` / `slap` | `whoosh_zoom_in@land/−4` / `cartoon_slap@land/−2` | X | RR | 3 |
| exit (any) | `whoosh_small_rev@0/−8`; fast exit (≤0.25 s) → `cartoon_zip_out@0/−4` | DIR | RR | 3 |
| walk (auto-walk or `walk=`) | `foley_step_<surface>` every footfall; cadence: walk 1.9 steps/s, steady 1.7, run 3.6; first step at t0+0.12 | X per step (MOVE) | alternate L/R variant sets, P±1, G±2 | hero 3 / others 4 |
| run start | `cartoon_scramble@t0/−4` (feet windmill) + `whoosh_small@t0+0.1/−8` + `foley_cloth_fast` loop −14 | X | RR | 3 |
| stop (sudden) | `foley_shoe_skid@0/0` + `cartoon_squeak@+0.02/−8` | X | RR | 2 |
| jump | `cartoon_boing_small@0/−6` + `whoosh_up_small@+0.05/−8`; land `impact_body_thud −2` | X | RR P±1 | 3 |
| pose change (generic) | `foley_cloth_rustle@0/−14` | X | RR | 4 |
| pose `point` / `present` | `whoosh_tiny@0/−12` + `foley_cloth −16` | X | RR | 4 |
| pose `cheer` / `thumbs` | `foley_cloth_swish@0/−10` + `cartoon_bloop_up@0/−10` | X | RR | 3 |
| pose `toast` | `food_glass_clink@+0.1/0` | X | RR P±2 | 2 |
| pose `photo` | `foley_camera_shutter@+0.3/−4` | X | RR | 3 |
| expr → `shocked`/`scared` | `hit_stinger@0/−2` ("dun!") + `cartoon_eye_pop@0/−8` + `vo_gasp@−0.05/−10` (generic gasp, not a voice line) | X | RR | 2 |
| expr → `joy`/`happy`/`grin` | `cartoon_bloop_up@0/−10` + `magic_sparkle_small@+0.05/−14` | X | RR P±2 | 4 |
| expr → `starstruck` | `magic_twinkle@0/−6` + `magic_choir_short@+0.05/−14` | X | RR | 3 |
| expr → `sad` | `cartoon_wah_short@0/−10` (muted trombone, 0.6 s) — or Sad recipe §4.10 if it is the beat's turn | X | RR | 3 |
| expr → `angry`/`hot` | `cartoon_steam_whistle@0/−8` (+ `food_sizzle_short` for chili `hot`) | X | RR | 3 |
| expr → `thinking` | `cartoon_tick_tock@0/−14` (2 ticks) | X | RR | 4 |
| expr → `yummy` | `food_mmm@0/−6` or `food_slurp@0/−4` (alternate) | X | RR | 3 |
| expr → `dizzy`/`tipsy` | `cartoon_tweety_wobble@0/−12` | X | RR | 4 |
| expr → `smug`/`cool` | `cartoon_ding_glint@0/−12` (tooth glint) | X | RR | 4 |
| talk start (lip flap) | none (VO); dialogue bubble covers it | — | — | — |
| crowd of ≥3 characters moving | one `crowd_steps` bed −14 instead of individual steps (Law of 2.5) | W | — | 4 |

Expression and pose sounds may sit under VO at the listed gain; if they collide with a stressed word, they slide to the next speech gap within +0.3 s, or drop (P4).
### 3.5 Camera events (from `moves[]`, `cam` keys, `shakes`)
| Camera event | Layers | Pan | Prio |
|---|---|---|---|
| `pushIn` (slow, > 2 s) | `whoosh_air_long@t0→t1/−18` (LEN) — barely there, adds "motion" | W | 5 |
| `pullOut` | `whoosh_air_long_rev@t0→t1/−16` + `magic_shimmer_soft@t1/−16` | W | 4 |
| `crashZoom` | `whoosh_zoom_in@t1/0` (peak on landing) + `hit_stinger@t1/−4` | C | 2 |
| `dutch` | `hit_stinger_small@t1/−10` (only if no crashZoom within 0.2 s) | C | 4 |
| `crane` / `craneDown` / `tiltUp` | `whoosh_long@t0→t1/−10` rising / falling pitch; outdoors high → `nature_wind_high −16` from apex | W | 3 |
| `whip` (move) / `snap` | `whoosh_fast@t1/−2` | MOVE | 2 |
| `orbit` / `arc` | `whoosh_air_loop/−16` with pan rotating ±0.6 at orbit speed | MOVE | 4 |
| `vertigo` | `riser_tonal@→t1/−10` + `whoosh_rev@t1/−8` | W | 3 |
| `dolly` | as pushIn at −20 | W | 5 |
| `bounce` | `cartoon_boing_tiny@t0/−14` | C | 4 |
| `reveal` | `whoosh_down@t0→t1/−4` (LEN) + `magic_shimmer@t1/−10` | W | 2 |
| rack focus / `dof` change / `focus` key | `foley_lens_tick@0/−14` | C | 5 |
| `shake` amp ≥ 14 | `impact_heavy@0/0` + `hit_sub@0/−8` (unless another hit ±0.45 s) | C | 2 |
| `shake` 8–14 | `impact_mid@0/−4` | C | 3 |
| `shake` < 8 | `hit_soft@0/−8` | C | 4 |
| `drift` / `handheld` / `breathe` / `follow` | none | — | — |
### 3.6 Flat-3D street (`moment kind=street3d`) — `traffic=n`, `time`, `ev`, `cam`, `walk`, `near`, `bus`, `flow`, `hand`, `done`, `title`
| Element | Rule |
|---|---|
| **Traffic bed** (AMB) | `n ≤ 8` → `amb_street_light` −26 · `9–20` → `amb_street_mid` −23 · `21–40` → `amb_street_heavy` −20 (LUFS on AMB bus before ducking). Starts −0.4 s before the cut. **Replaces** the ambience.py city bed and the MOMENTS `moto_pass` cue for this scene (single owner = sound_design). |
| `time=dusk` | add `crowd_street_chatter` −28 + one `food_sizzle_far` −30 (street food stalls) |
| `time=day` | add `nature_birds_city` −32 |
| `ev=yes` | engines → `vehicle_ev_whir_pass` (passes), bed −6 dB, horn rate ×0.3, add `nature_birds_city` −26 + `crowd_walkers` −28 (quiet lake streets) |
| **Pass-bys** (BG) | Poisson, λ = 0.025·n /s (n=30 → 0.75/s). Depth mix 70% far (`vehicle_moto_pass_far`, −14, LPF 3.5 k, N), 30% mid (`vehicle_moto_pass`, −8). Pan MOVE across, direction alternates per lane. |
| **Horns** (BG) | Poisson, λ = 0.012·n /s (n=30 → one every ~2.8 s); 80% `vehicle_horn_far` (−12, RND .8), 20% `vehicle_horn_scooter` (−6, X of a visible bike). Pitch RR among 6 horn tones. Never on a stressed word. |
| `near=t` | Near-miss recipe (§4.7) anchored at t (camera shake starts there) |
| `bus=t` | `vehicle_bus_approach@t−2.5→t+0.5/−6` (engine growl swell) + `vehicle_bus_horn@t+0.6/0` + `vehicle_air_brake@t+1.8/−2` + `hit_sub_soft@t+0.6/−10`; pan from the bus's x (−1.6 → slightly L) |
| Dave `walk` steady | `foley_step_street` 1.7/s from t0 to t1, X MOVE from x0 to x1 (x ∈ [−4.6, 4.6] world → pan ±0.6), −6 dB hero |
| Dave `mode=run` | steps 3.6/s, −4; `cartoon_scramble@t0`; traffic horns λ ×2.5 and two extra `vehicle_horn_scooter` at t0+0.6 and t0+1.2 (chaos) |
| Dave `mode=stop` | steps stop at the freeze; `foley_shoe_skid@freeze/0` + `vo_gasp@freeze+0.05/−8` + a close `vehicle_horn_scooter@freeze+0.4/−2` + `vehicle_brake_squeal@freeze+0.45/−4` |
| `flow=yes` | 2 extra mid passes per second panned around Dave's x, ±0.5 ("traffic bends round him") |
| `hand=yes` | `foley_cloth_swish@0.6/−8` + one friendly double `vehicle_horn_scooter@1.6/−6` ("I see you") |
| `done=t` | `crowd_claps_small@t/−8` + `cartoon_whee@t/−10` + expression joy layer |
| `copho` present | `foley_step_street` only when she moves; smug glint (`cartoon_ding_glint`) when she points |
| `title=` | title-stack recipe: typekit `stack/slam` landing at `titleAt` + dip (music −20 dB from titleAt−0.45) |
| cam `worm` | bed +3 dB, LPF opened; road rumble `amb_road_rumble_low` −24 (with mid harmonics) |
| cam `crane`/`bird`/`high` | bed −6 dB, LPF 2.5 kHz, `nature_wind_high` −22; horns far only |
| cam `close`/`ots` | passes +2 dB, 40% mid / 60% far |
| cam `chase` | steps +3 dB, bed slowly panned with the motion |
| `path` camera keys | each key interval > 2 s → `whoosh_air_long −18` (LEN) |
### 3.7 Typekit looks (`art=… artfx=…`, anchor `artAt`; multi-word stacks expand per word)
| Look | Layers | Dip | Prio |
|---|---|---|---|
| `slam` | `impact_heavy@0/0` + `hit_sub@0/−6` + `whoosh_rev_cymbal@0/−10` (ends on hit) + `glitch_tick@+0.04/−14` (colour misregistration) | yes | 1 |
| `stack` | per word k at `k·0.11`: `hit_punch@/−2` ESC+1 (cap 4 words, then group); last word `impact_mid −2` | last word | 2 |
| `count` | `ui_tick_roll` over the roll (rate ∝ digits) + `ui_ding_big@end/0` + `hit_soft@end/−6` | no | 2 |
| `stamp` | `impact_stamp@0/0` + `foley_paper_thud@0/−8` + `foley_ink_squelch@+0.03/−14` | yes | 1 |
| `typeon` | `ui_type_key` per character (RR 6 variants, P±1) + `ui_type_bell@end/−8` + `ui_type_return@end+0.1/−10` | no | 3 |
| `mask` | `riser_soft@−1.6→0/−8` + `hit_cinematic@0/0` (boom + body + air) + `magic_shimmer_soft@+0.2/−14` (tracking-in) | yes | 1 |
| `gold` | `magic_shimmer@0/−4` + `riser_braam_short@0/−8` + `magic_glint@glint_t/−10` (each glint pass) | yes | 1 |
| `neon` | `ui_neon_flicker@0/−4` (buzz gated by the flicker) + `ui_neon_hum` loop −22 while visible | no | 3 |
| `comic` | `cartoon_hit_comic@0/0` + `cartoon_pop@0/−6` + jitter on twos → `cartoon_rattle −16` | no | 2 |
| `hand` | `foley_pen_write@0` (LEN letters × 0.06) + `foley_pen_underline@end/−6` | no | 3 |
| `split` | 2× `whoosh_fast` from L and R (pan −0.6/+0.6) peaking at 0 + `impact_metal_lock@+0.12/0` | yes | 1 |
| `sign` | `hit_metal_plate@0/0` + `foley_metal_rattle@+0.05/−12` | no | 2 |
| any look `artOut` | `ui_whoosh_out_small@artOut/−10` | — | 4 |
### 3.8 Maps
| Map event | Layers |
|---|---|
| region → place zoom (camLerp) | `whoosh_long` LEN(t1−t0) −4 + `riser_soft` ending at pin time −12 + `foley_paper_flutter@t0/−16` |
| pin drop | Pin-drop (§3.3) |
| route draw | `foley_marker_loop` + per-city `ui_pin_small` ESC+1 |
| territory fill / vnFill | `magic_liquid_fill` (LEN) −6 + `impact_wood@end/−4` |
| map3d / fleet3d / wow_fleet / wow_south | Map-dive recipe (§4.8) |
| sshape (grow/narrow) | per growth step `whoosh_med −6` + `foley_paper_slide −10`; narrow → `whoosh_down −4` |
| mapdive set piece | Map-dive recipe (§4.8) |
### 3.9 Weather & time-of-day beds (AMB, layered on the place bed)
| Key | Bed (+ events) |
|---|---|
| `weather=rain` | `nature_rain_light` −22 (interior: `nature_rain_roof` + gutter drips λ 2/s) |
| `downpour` / heavy | `nature_rain_heavy` −18 + `nature_thunder_far` λ 1/8 s (−6, RND .6) + one `nature_thunder_crack` on the flash frame |
| `fog` | `nature_wind_soft` −30; all AMB/BG LPF 3 kHz (muffled world) |
| `snow` | `nature_wind_soft` −26; footsteps → `foley_step_snow` |
| `petals` | `nature_breeze` −28 + `vn_wind_chime` λ 1/6 s −20 |
| `fireflies` | `nature_crickets` −26 + `magic_twinkle_tiny` λ 1/2 s −24 |
| `time=day` | `nature_birds_day` −30 (city: sparrows; countryside: + `nature_cicada_day`) |
| `time=sunset` | `nature_birds_evening` −30 + `vn_temple_bell_far` once at 40% of the scene −18 |
| `time=night` | `nature_crickets` −26 + `nature_gecko_call` λ 1/15 s −22 + `animal_dog_far` λ 1/25 s −28 |
| `time=dawn` | `animal_rooster` once −16 + `nature_birds_dawn` −26 + (city) `vn_loa_phuong` (ward loudspeaker) far −30 |
### 3.10 Places — bed + sweetener palette (sweeteners also feed the gap filler)
| Place id(s) | Bed (AMB) | Sweeteners (BG, P5, λ per s) |
|---|---|---|
| `oldquarter`, `hanoi`, `sidewalk`, `saigon` | `amb_city_hanoi` (Saigon: `amb_city_saigon`, denser) | `vehicle_horn_far` .3 · `vehicle_moto_pass_far` .25 · `vn_vendor_call` 1/20 · `vehicle_bike_bell` 1/15 · `food_spoon_clink` 1/8 (sidewalk café) |
| `benthanh`, `night_market` | `crowd_market` | `vn_vendor_call` 1/8 · `food_sizzle_wok` 1/10 · `ui_coins_small` 1/12 · `crowd_laugh_small` 1/15 |
| `giang_kitchen` / kitchen | `food_simmer` + room tone | `food_knife_chop` 1/5 · `food_pan_sizzle` 1/12 · `food_kettle` once |
| `cafe_giang` / café | `amb_cafe_room` | `food_spoon_clink` 1/3 · `food_cup_set` 1/6 · `vn_phin_drip` loop −30 · `food_ice_glass` 1/10 |
| `metropole_bar` | `amb_bar_fan` (room reverb) | `food_glass_clink` 1/6 · `crowd_murmur_room` −30 |
| `hoian`, river | `nature_river_lap` + `amb_town` | `vehicle_boat_motor_far` 1/20 · `foley_oar_splash` 1/6 · (night) `vn_lantern_rustle` |
| `hagiang`, mountains, pass | `nature_wind_mountain` | `animal_buffalo_bell` 1/12 · `animal_goat` 1/30 · `vehicle_moto_far_echo` 1/15 · `vn_khen_far` (Hmông mouth organ) 1/40 |
| beach | `nature_waves` | `nature_palm_rustle` 1/8 · `crowd_kids_far` 1/25 |
| temple / pagoda | `amb_temple_room` (large) | `vn_temple_bell` 1/12 (long tail, −10) · `vn_mo_woodblock` rhythmic phrases 1/20 · `vn_chant_far` −28 |
| `trainstreet`, train | `amb_town` | `vehicle_train_warning_bell` before passes · `vehicle_train_horn` · `vehicle_train_clack` |
| `homestay` | `amb_homestay_night` (fire crackle + crickets) | `food_glass_clink` 1/10 · `crowd_laugh_small` 1/12 |
| `phongnha`, cave | `nature_cave_drips` + big reverb | `nature_water_drip` .5 · `nature_bat_flutter` 1/30 |
| `studio` | `amb_room_tone_studio` −34 | none (UI carries density) |
| history / battle (`hanoi1946`, dynasties, `wow_storm`) | `battle_ambience_camp` or period town | `battle_drum_far` (trống trận) 1/6 · `animal_horse_whinny` 1/20 · `battle_metal_clank` 1/8 · period: `vehicle_tram_bell` (1946 Hà Nội) |
### 3.11 Set-piece moments (`moment kind=`)
| Kind | Layers (beat-local seconds) |
|---|---|
| `crossing` | street bed heavy; 4 close passes at 0, 1.2, 2.5, 4.0 (`vehicle_moto_pass_close`, MOVE alternating); steps; `ui_ding@5` → replace with `crowd_claps_small@5` + `cartoon_whee` |
| `pass` | `vehicle_moto_loop` + `nature_wind_mountain`; `whoosh_up@0.1`; pass-by `vehicle_moto_pass@3.2/0` MOVE; valley echo send +6 dB |
| `steam` | `food_pour@0.6` (1.3 s) + `food_splash@0.9,1.5` + `food_steam@2.0` + `food_spoon_clink@2.1` + `food_sizzle_bed −20` |
| `downpour` | `nature_wind@0` + `nature_rain_heavy` from 2.2 (swell 1.2 s) + `nature_thunder_crack@1.7` on the flash |
| `lanterns` | `magic_sparkle@0.2` + `vn_lantern_rustle` bed + `magic_choir_ahh@2.4/−6` + `nature_river_lap −24` |
| `seasons` | `whoosh_up@0` + per season crossfade beds (birds → cicadas → wind → rain) + `magic_shimmer@3.4` |
| `train` | `vehicle_train_warning_bell@−1.0` (J-cut) + `vehicle_train_horn@0.3` + `vehicle_train_pass@2.6` + `impact_mid@3.4` (whoosh-by gust) |
| `cave` | `nature_water_drip@0,2` + deep reverb send +8 dB + `magic_choir_ahh@3.5/−8` |
| `sunrise` | `whoosh_up@0.3` + `animal_rooster@0.8` + `nature_birds_dawn` swell + `magic_choir_ahh@3/−8` |
| `fireworks` | per burst: `fx_firework_launch@−0.8` (whistle) + `fx_firework_burst@0` + `fx_firework_crackle@+0.3/−8`; `crowd_ooh` on the 1st and biggest; crowd cheer bed −20 |
| `window` | `vehicle_train_interior_loop` / `vehicle_moto_loop` + `whoosh@2` + glass rattle −20 |
| `mapdive` | Map-dive recipe (§4.8) |
| `split` | `whoosh_med@0.2` MOVE + `impact_metal_lock@0.6` |
| `shot_eyes` | `foley_heartbeat` (n = dur/0.75) + `riser_tension_low −14` + world LPF 1.2 kHz (subjective) |
| `shot_bird` | `nature_wind_high −14` + traffic bed −10 LPF 2.5 kHz |
| `shot_worm` | `vehicle_moto_pass_close@0.4/0` + `vehicle_horn_scooter@1.2/−4` + road rumble |
| `shot_ots` / `shot_street` | heartbeat (ots) / `whoosh_med@0` (street) + street bed |
| `map3d` `fleet3d` `wow_fleet` `wow_south` | Map-dive / big-reveal recipes; fleets add `battle_drum_far` + `nature_waves` + `magic_choir_ahh` (existing choir cue) |
| `wow_storm` | `nature_thunder_crack@0,2.6` + `nature_rain_heavy@0` + `nature_wind_storm −14` |
| `wow_morph` | `whoosh_med@0` + `foley_paper_slide@2.2` + `magic_liquid_fill` over the morph |

## 4. Layer recipes for signature moments
Offsets are relative to the anchor frame (0 = the visual hit). Every recipe gets a 0.15–0.45 s **pre-hit dip** where marked: music −20 dB and AMB −8 dB, linear ramp down over 0.12 s, then back up to full in 0.05 s on the hit (the current `dips` logic applied to the AMB bus as well, not only music).
#### 4.1 Hook slam (frame 0 of the video, or a `slam`/`stack` title) — dip none (nothing precedes it)
| Layer | Sound | Offset | Gain | Pan / notes |
|---|---|---|---|---|
| 1 transient | `hit_snap` (2–5 kHz crack) | 0.00 | 0 | C — this is what the phone hears |
| 2 body | `impact_heavy` | 0.00 | −2 | C |
| 3 sub | `hit_sub` (45 Hz + harmonics) | 0.00 | −6 | C, mono |
| 4 tail | `whoosh_air_rev` → `magic_shimmer` tail | +0.05 | −10 | W |
| 5 world | place bed or `amb_street_heavy` starts at full on frame 0 | 0.00 | bed level | — |
| 6 music | first downbeat at +0.00 (music engine aligns bar 1 to frame 0) | — | — | — |
#### 4.2 Big reveal (`reveal`, `title variant=film/place`, landmark first wide)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 riser | `riser_soft` (1.6 s, ends on hit) | −1.60 → 0 | −8 | W; pre-hit dip from −0.40 |
| 2 suck | `whoosh_rev_cymbal` | −0.45 → 0 | −10 | C |
| 3 hit | `hit_cinematic` (boom + body + snap) | 0.00 | 0 | C |
| 4 swell | `riser_braam_short` / `magic_choir_ahh` (epic vs wonder) | +0.02 | −6 | W |
| 5 air | `magic_shimmer` | +0.20 | −12 | W |
| 6 world | place bed fades in from −12 dB to its level over 1.5 s | 0 → 1.5 | — | the space "opens" |
#### 4.3 Chapter card
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 in | `whoosh_med` | −0.05 | −2 | DIR from the card's entry side |
| 2 lock | `hit_wood_heavy` (number lands) | 0.00 | 0 | C |
| 3 text | `ui_type_key` × letters or `foley_pen_write` (matches card style) | +0.25 | −8 | — |
| 4 tone | `riser_tonal_soft` reversed → sting chord from music engine | +0.00 | −10 | music engine plays a 1-bar stinger in the new act's mood |
| 5 out | `ui_whoosh_out_small` | card exit | −8 | — |
#### 4.4 Joke button (the punchline lands: `gag` tHit, `punch=`, comic reaction)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 0 pause | music −6 dB, AMB −4 dB | −0.35 → 0 | — | the comic beat; VO must be silent here |
| 1 crash | `whoosh_zoom_in` (crash zoom) | 0.00 | 0 | C |
| 2 hit | `cartoon_hit_comic` | 0.00 | −2 | C |
| 3 reaction | expression stinger (`hit_stinger` shocked / `cartoon_eye_pop`) | +0.02 | −6 | X |
| 4 tag | one family-matched sting: `cartoon_slide_whistle_down` (fail), `cartoon_boing` (surprise), `food_sizzle_short` (spicy) | +0.30 | −8 | same family as layer 2 (SoundGirls "tag") |
| 5 music | music engine: stop on 0, re-enter on the next bar or after the tag | — | — | never resume mid-bar |
#### 4.5 Fail (Dave ran, wrong answer, BUSTED)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 stop | `cartoon_scratch` (record scratch) | −0.02 | −2 | music cuts on the same frame |
| 2 hit | `impact_stamp` or `cartoon_buzz` | 0.00 | 0 | C |
| 3 sad | `cartoon_wah_short` (muted trombone, 2 notes down) | +0.35 | −8 | only in the gap after VO |
| 4 room | 0.6 s of AMB only (no music) | 0 → 0.6 | — | "awkward silence" |
| 5 tag | `vehicle_horn_scooter` (in street context) or `crowd_ooh_small` (quiz) | +0.9 | −10 | — |
#### 4.6 Victory (payoff title, `done=`, correct quiz answer)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 riser | `riser_soft` 1.2 s | −1.2 → 0 | −10 | pre-hit dip from −0.30 |
| 2 hit | `impact_mid` + `hit_snap` | 0.00 | 0 / −4 | C |
| 3 joy | `magic_sparkle` + `cartoon_bloop_up` | +0.05 | −8 | W |
| 4 crowd | `crowd_claps_small` → `crowd_cheer_vn` | +0.20 | −10 | W |
| 5 music | music engine: lift to biggest section (full band, crash) on 0 | — | — | — |
| 6 confetti | `fx_confetti_pop` if particles | +0.10 | −12 | RND .6 |
#### 4.7 Near-miss (street3d `near=t`, `shot_worm`, any close vehicle)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 approach | `vehicle_moto_pass_close` (doppler, peak = closest point) | 0.00 (peak) | 0 | MOVE R→L across the lens, W |
| 2 horn | `vehicle_horn_scooter` | −0.20 | −4 | X of the bike, P±1 |
| 3 gust | `whoosh_close` | +0.02 | −4 | MOVE |
| 4 hit | `hit_stinger` (Dave's heart) | +0.05 | −8 | C |
| 5 duck | everything else −6 dB for 0.6 s from +0.05 (subjective tunnel) + `foley_heartbeat` × 2 at +0.3 | — | — | world LPF 2 kHz for 0.5 s |
| 6 relief | `vo_gasp` / `cartoon_phew` | +0.9 | −10 | if no VO there |
#### 4.8 Map dive (map → ground, `mapdive`, `map3d`)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 rewind | `fx_tape_rewind` or `whoosh_long` (LEN dive) | dive start | −6 | W |
| 2 riser | `riser_soft` ending at touchdown | −1.4 → 0 | −10 | — |
| 3 wind | `nature_wind_high` rising, LPF opening 1.5 → 8 kHz | dive | −14 | altitude cue |
| 4 land | `ui_pin_thunk` + `hit_sub_soft` | 0.00 | 0 / −8 | C |
| 5 world | ground place bed crossfades in, 0.4 s J-cut | −0.4 | bed | the destination is heard first |
#### 4.9 Battle charge (history episodes)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 drums | `battle_drum_war` (trống trận) accelerating loop | −2.0 → 0 | −6 | W |
| 2 horn | `battle_horn_call` | −1.2 | −4 | C |
| 3 crowd | `battle_crowd_charge` swell | −0.5 → +3 | −6 | W, 2 layers L/R decorrelated |
| 4 hooves | `animal_horse_gallop_group` (one bed, Law of 2.5) | −0.3 | −8 | MOVE with the charge |
| 5 clash | `battle_metal_clash` + `impact_heavy` | 0.00 | 0 / −4 | C; then `battle_metal_clank` λ 3/s, −10 |
| 6 cannon/arrows (period) | `battle_cannon_far` / `battle_arrow_volley` | +0.4 | −6 | RND .6 |
#### 4.10 Sad beat (loss, "the street wins", reflective close)
| Layer | Sound | Offset | Gain | Notes |
|---|---|---|---|---|
| 1 strip | all SFX FG off; BG −8 dB; AMB LPF 3 kHz | −0.5 → end | — | the world recedes |
| 2 tone | music engine: solo instrument (sáo / piano), no drums | 0 | — | — |
| 3 detail | one intimate sound: `food_spoon_clink` / `nature_rain_window` / `vn_temple_bell_far` | +1.0 | −10 | C, dry, close |
| 4 breath | 0.8 s with no music | chosen gap | — | silence as a tool |
| 5 return | AMB opens back (LPF → full) over 1 s at the beat's end | end | — | — |

## 5. The mix spec
### 5.1 Bus structure (stereo, 48 kHz float internally; resample once at export)
```
VO  (narrator) ───────┐
DLG (character lines) ┤── SPEECH group ──(sidechain key)─────────────┐
MUS (score stems) ────────────── duck + dyn-EQ keyed by SPEECH ──────┤
SFX-FG (T1/T2) ─────────────── light duck + dyn-EQ keyed by SPEECH ──┤
SFX-BG (T3 foley, sweeteners) ─ duck keyed by SPEECH ────────────────┤── MASTER ── glue comp ── TP limiter ── 2-pass loudness
AMB (beds, weather) ─────────── duck keyed by SPEECH ────────────────┤
REV-S / REV-M / REV-L (send returns) ────────────────────────────────┘
```
### 5.2 Static balance (short-term loudness relative to the SPEECH group while speaking, measured LUFS-S)
| Bus | Under speech | In speech gaps | Notes |
|---|---|---|---|
| VO / DLG | 0 LU (reference ≈ −16 LUFS-S) | — | DLG = VO level; speaker A pan −0.15, B +0.15 |
| MUS | −18 LU (vertical) · −20 LU (YT talk) | −8 LU (V) · −10 LU (YT) | air.io guidance: −20/−25 dB calm, −8/−12 energetic; hook/payoff use the energetic end |
| SFX-FG standard | −6 LU momentary peaks | −2 LU | hero hits may reach **+2 LU** momentary in gaps (they must feel bigger than the voice for 200 ms) |
| SFX-FG UI | −10 LU | −8 LU | ticks, pops |
| SFX-BG | −16 LU | −12 LU | |
| AMB | −24 LU | −16 LU | silent sections (no VO, no music) → −12 LU |
### 5.3 EQ per bus (exact)
| Bus | Filters |
|---|---|
| VO / DLG | HPF 90 Hz 18 dB/oct (female voices 110 Hz) · bell −2.5 dB @ 300 Hz Q 1.2 (box/mud; Kokoro is dark) · bell +3 dB @ 3.2 kHz Q 0.9 (presence) · high shelf +2 dB @ 10 kHz · de-esser 5.5–8 kHz, max −5 dB · LPF 16 kHz |
| MUS | HPF 35 Hz 12 dB/oct · static bell −2 dB @ 2.5 kHz Q 0.8 (voice pocket) · **dynamic** bell −4 dB @ 2.5 kHz Q 0.7 keyed by SPEECH (additional) · bass harmonic exciter on 60–120 Hz (2nd+3rd harmonics, 15% mix) · LPF 16 kHz |
| SFX-FG | HPF 40 Hz · dynamic bell −3 dB @ 3 kHz Q 0.8 keyed by SPEECH · parallel saturation on < 150 Hz content (so impacts read on phones) |
| SFX-BG | HPF 120 Hz · LPF per distance (§5.6) · bell −2 dB @ 2.5 kHz |
| AMB | HPF 80 Hz 12 dB/oct · low shelf −3 dB @ 200 Hz (beds must not eat headroom) · bell −3 dB @ 2.5 kHz Q 0.7 (permanent voice pocket) · LPF 10 kHz |
| Reverb returns | HPF 250 Hz · LPF 7 kHz (S/M), 5 kHz (L) |
### 5.4 Dynamics, sidechain and ducking curves
| Processor | Setting |
|---|---|
| VO compressor | ratio 3:1, threshold so gain reduction is 3–6 dB on stressed words, attack 10 ms, release 80 ms, knee 6 dB; followed by a clipper/limiter at −3 dBFS peak on the VO bus |
| VO leveler (optional) | short-term RMS rider ±4 dB max, window 400 ms, toward −16 LUFS-S |
| SPEECH key (VAD) | 10 ms frames, gate −40 dBFS RMS, hangover 120 ms, **look-ahead 40 ms** (offline, so ducks start before the first syllable) |
| MUS duck (broadband) | depth −10 dB (V) / −12 dB (YT); attack 25 ms, hold 150 ms, release 400 ms; plus the dynamic EQ above (attack 15 ms, release 250 ms) |
| SFX-FG duck | depth −4 dB for P3–P5 sounds, 0 dB for P1–P2 (they are scheduled into gaps instead); attack 10 ms, release 200 ms |
| SFX-BG duck | −6 dB; attack 20 ms, release 350 ms |
| AMB duck | −6 dB; attack 40 ms, release 600 ms (slow = no "breathing" bed) |
| Pre-hit dips | music −20 dB, AMB −8 dB from anchor −0.45 to −0.33 (ramp), floor until anchor, recover 50 ms |
| Music "hole" for comedy | −6 dB from tHit −0.35 to tHit, full stop on record scratch |
| SFX-FG bus comp | 4:1, attack 1 ms, release 60 ms, GR ≤ 3 dB (glue for stacked layers) |
| MASTER glue | 1.5:1, attack 30 ms, release 200 ms (auto), GR ≤ 1.5 dB |
| MASTER limiter | true-peak (4× oversampled), ceiling −1.5 dBTP, look-ahead 5 ms, release 50 ms; QA fails if GR > 4 dB for > 200 ms |

The duck curves are attack/hold/release envelopes on the VAD mask, converted from dB to linear *after* smoothing (smooth in dB so release is exponential in level, not in amplitude).
### 5.5 Stereo / pan law
- Constant-power pan, **−4.5 dB centre law** (the compromise between −3 for stereo and −6 for mono fold-down; Sound On Sound recommends −4.5 dB "if in doubt"). Phones fold to mono or near-mono, so this matters.
- VO/DLG centre (DLG ±0.15). Music full stereo, L/R correlation > 0.2. FG SFX |pan| ≤ 0.8; T1 hits centre; MOVE automation ≤ 1.6 pan-units/s (faster sounds like a glitch).
- Width: near = W (100%), mid = 70%, far = N (30%). Beds: decorrelated wide, but QA checks mono sum loss ≤ 3 dB.
- Never pan a sound the viewer must hear hard L/R in the vertical cut (phones have one bottom-firing speaker in many models).
### 5.6 Perspective (distance model, by `depth` attr or shot size)
| Distance | When | Gain | LPF | Reverb send | Width | Transient |
|---|---|---|---|---|---|---|
| **Near** | CU/MCU subject, `close`/`ots`/`worm` vehicles, UI | 0 dB | none | −20 dB | W | full |
| **Mid** | MS/FS subject, crossing traffic | −6 dB | 9 kHz | −12 dB | 70% | −2 dB transient shaper |
| **Far** | WS background, horns_far, `crane`/`bird` views | −12 dB | 3.5 kHz | −6 dB | N | −6 dB transient shaper |
| **Off-screen** | sweeteners | −14 dB | 5 kHz | −8 dB | RND pan | soft |
### 5.7 Reverb sends by place
| Return | Model | RT60 | Pre-delay | Used for |
|---|---|---|---|---|
| REV-S room | small room | 0.4 s | 8 ms | kitchen, café, bar, homestay, studio (−24 send) |
| REV-M street | short slap + plate | 0.9 s, slap 70 ms (tube-house façades) | 20 ms | Old Quarter, market, town |
| REV-L open/hall | hall / outdoor | 1.8 s (temple 2.6 s, cave 3.5 s) | 25 ms | mountains (+ 250 ms valley echo, −14 dB), temple, cave, battle field |
UI sounds and VO are **dry** (no reverb) — they live "on the glass". Character foley gets the place reverb.
### 5.8 Loudness & mastering targets
| Deliverable | Integrated | True peak | LRA | Other |
|---|---|---|---|---|
| YouTube 16:9 | **−14 LUFS ±0.5** | **≤ −1.5 dBTP** | 5–9 LU | YouTube normalises to −14 LUFS (since 2019, Production Advice); YouTube recommends ≤ −1 dBTP; the extra 0.5 dB covers AAC encoding overs |
| Vertical (TikTok / Reels / Shorts) | **−13 LUFS ±0.5** | ≤ −1.5 dBTP | 4–7 LU | TikTok/Instagram publish no spec; guidance ranges from −14…−16 (OpenClip) to −10…−12 (Opus). Phones' AGC stops rewarding loudness above ≈ −12 LKFS (Audiokinetic). −13 is loud enough to compete without heavy limiting |
| Hook (0–3 s) | short-term ≥ integrated +1 LU | — | — | the first seconds must not sound quieter than the rest |
| Speech | speech-gated loudness within ±1.5 LU of integrated | — | — | voice stays the anchor |
| Archive stems | VO, DLG, MUS, SFX-FG, SFX-BG, AMB at mix gain, no master processing | — | — | for re-edits |

**Method:** two-pass ffmpeg `loudnorm` in **linear** mode (pass 1 measure → pass 2 with `measured_I/TP/LRA/thresh`, `linear=true`) after our own true-peak limiter, so loudnorm only applies static gain. If the required gain would push TP over the ceiling, lower the limiter input and re-run — never let loudnorm fall back to dynamic mode (QA checks the `normalization_type` it reports).
### 5.9 Phone-speaker translation checks (automatic, every render)
1. **Phone model**: HPF 400 Hz 24 dB/oct + LPF 12 kHz + mono sum. Each stem's loudness drop full→phone must be ≤ 8 dB (VO ≤ 5 dB). The current foley stem drops 12.5 dB, so it fails.
2. **Laptop model**: HPF 200 Hz 12 dB/oct, stereo.
3. **Voice SNR in 1–4 kHz** through the phone model ≥ +10 dB on 95% of speech frames.
4. **Hit audibility**: every T1 event must raise phone-model momentary loudness by ≥ 4 LU over the 1 s before it.
5. **Mono fold**: mono-sum loss ≤ 3 dB integrated; no event loses > 6 dB in mono.

## 6. Implementation plan for `tools/sound_design.py`
One process owns the whole soundtrack. `sfx.py` becomes a synthesis fallback and `ambience.py` a bed provider; neither mixes anything any more. `make.mjs` calls `sound_design.py` once and loudness-normalises its output with two-pass linear loudnorm.
### 6.1 Data model
```python
@dataclass
class Event:   # something that HAPPENED on screen
    t: float; kind: str; scene: int; src: str  # kind e.g. 'trans.whip' 'ui.checklist.item' 'char.expr' 'cam.crashZoom' 'street.near' 'art.slam' 'map.pin'; src renderer|beat|explicit|design|gapfill
    attrs: dict                                # dur, x, x1, depth, who, val ('shocked'), surface, n, intensity, no (✗), i (item index), speed
@dataclass
class Sound:   # something we will PLAY
    name: str; start: float; peak_t: float; dur: float; gain_db: float; pan: float | tuple; width: float
    bus: str; prio: int; tier: int; family: str; depth: str; sync: bool  # bus FG|BG|AMB · depth near|mid|far|off · sync = contact sound, never moved
    event: Event; opts: dict                   # opts: loop dur, pitch, LEN target
```
Library contract (`sfx_pro.py` must export): `META[name] = {peak, dur, family, tier, loop, variants, band}` and `render(name, variant, pitch, dur=None) -> np.ndarray (mono or stereo)`. Missing metadata → peak = argmax of the 10 ms RMS envelope, computed once and cached.
### 6.2 Collecting events
```python
def collect(cues_json, story_path, vo_wav, lines_json):
    C = json.load(open(cues_json)); beats, score = parse_story(story_path); ev = []
    # (a) renderer events — timeline.js emits C['events'] (spec in 6.2.1); fallback: reverse-map C['cues']
    for e in C.get('events') or legacy_cues_to_events(C['cues'], C['scenes']):
        ev.append(Event(e['t'], e['ev'], e['scene_idx'], e.get('a', {}), 'renderer'))
    # (b) beat events — one 'beat.<type>' per scene + parsed keys
    for i, sc in enumerate(C['scenes']):
        bt, o = beats[i] if i < len(beats) else ('end', {})
        ev.append(Event(sc['start'], f'beat.{bt}', i, {**o, 'dur': sc['dur'], 'place': o.get('place') or sc.get('place'),
                                                       'time': sc.get('time'), 'weather': sc.get('weather')}, 'beat'))
        ev += expand_beat_keys(i, sc, bt, o)          # street3d near/bus/walk/done/title, art=, drop=, quiz reveal from subs ...
        ev += parse_explicit_sfx(i, sc, o.get('sfx'))  # 'off:name[:gain[:pan]]' → kind 'explicit', gain converted from linear to dB
    # (c) voice activity + words
    vad = speech_mask(vo_wav, frame=.01, gate_db=-40, hang=.12, lookahead=.04)
    stressed = stressed_words(vo_wav, lines_json)      # per line: max-RMS word span
    return sorted(ev, key=lambda e: e.t), vad, stressed, score
```
`legacy_cues_to_events` maps the old names: transition cues (`auto` and at `start − dur/2`) → `trans.<type>` at the scene start; `tick`/`buzzer` after a checklist → `ui.checklist.item`; `fall`+`thud` → `char.enter.drop`; shake cues → `cam.shake` with amp; `engine_loop` → `char.ride`.
#### 6.2.1 New renderer event emission (spec for `engine/timeline.js episodeCues()`; another agent edits it)
Add `events: [{t, ev, scene_idx, a}]` beside `cues`, generated from data already in the scene:
- transitions: `trans.<type>` at `_starts[k]`, `a: {dur}`
- every layer `in`/`out`: `char|prop|ui.enter.<type>` at `at+dur` (landing), `a: {x, who|name}`; exits at `out.at`
- every `keys[]` entry: `expr` change → `char.expr` (`a.val`), `pose` change → `char.pose`, `x` change > 0.05 → `char.move` with `{x0, x1, t1, speed}`; auto-walk derives `char.step` events at the cadence of §3.4 (the scheduler can also do it from `char.move`)
- `moves[]`: `cam.<type>` with `{t0, t1, amt}`; `shakes`: `cam.shake {amp}`
- UI: `ui.<name>` at `o.at`, `ui.<name>.out` at `until`; checklist items `ui.checklist.item {i, no}`; counter `ui.counter {from, to, dur}`; price `{checked}`
- map: `map.zoom {t0,t1}`, `map.pin {x}`, `map.route {t0,t1,cities:[t...]}`; typekit: `art.<fx> {words, at, out}`
- moments: each MOMENTS def gets an optional `events(o, dur)` returning its internal anchors (street3d: near, bus, walk segments, done; fireworks bursts; train pass); captions: unchanged `subs`
### 6.3 Rule table (data, not code)
```python
# kind pattern → list of layers; values straight from §3. Conditions are small lambdas over attrs.
RULES = {
  'trans.whip':  [L('whoosh_fast', 0, 0, pan='MOVE', var='RR P1', prio=2, len_from='dur'),
                  L('whoosh_air', -.04, -6, pan='W', prio=3), L('hit_soft', 'dur/2', -8, prio=4)],
  'ui.checklist.item': [L('ui_check', 0, 0, pan='X', var='ESC1 RR', prio=2, when=lambda a: not a.get('no')),
                        L('ui_cross', 0, 0, pan='X', prio=2, when=lambda a: a.get('no')),
                        L('cartoon_buzz_short', .05, -6, prio=3, when=lambda a: a.get('no'))],
  'char.expr':   EXPR_TABLE,          # dict val → layers (§3.4)
  'cam.shake':   [L('impact_heavy', 0, 0, prio=2, when=lambda a: a['amp'] >= 14), ...],
  'street.traffic': STREET_GEN,       # generator rule: returns Poisson pass-bys/horns for the scene
  'beat.*':      PLACE_BEDS,          # bed + sweetener palette from attrs.place/time/weather (§3.9–3.10)
  ...
}
RECIPES = {'hook_slam': [...], 'big_reveal': [...], ...}   # §4; rules may reference 'recipe:big_reveal'
```
Expansion:
```python
def expand(events):
    out = []
    for e in events:
        for L in match(RULES, e.kind):                 # exact kind first, then wildcard 'beat.*', 'char.enter.*'
            if L.when and not L.when(e.attrs): continue
            if L.recipe: out += expand_recipe(RECIPES[L.recipe], e); continue
            if L.generator: out += L.generator(e, rng); continue
            name = pick_variant(L.name, e, L.len_from)  # LEN: whoosh_fast/med/long by duration; fallback chain
            off = eval_off(L.off, e.attrs)              # supports 'dur/2', 'land', numbers
            m = META[name]
            out.append(Sound(name, start=e.t + off - m['peak'], peak_t=e.t + off, dur=m['dur'] if not m['loop'] else L.dur(e),
                             gain_db=L.gain + jitter(L.var), pan=resolve_pan(L.pan, e.attrs), width=WIDTH[L.depth or depth_of(e)],
                             bus=L.bus or bus_for(m['tier']), prio=L.prio, tier=m['tier'], family=m['family'],
                             depth=L.depth or depth_of(e), sync=L.sync, event=e, opts=L.opts))
    return out
```
Variation state (`ESC`, `RR` "never same variant twice", `P±n`) lives in a per-name counter so it is deterministic per episode seed.
### 6.4 Priority / anti-clutter scheduler
```python
def schedule(cands, vad, stressed, flags, fmt):
    lim = LIMITS[fmt]                                  # §2.4 numbers for 'vertical' | 'youtube'
    cands = merge_duplicates(cands, same_name=.25, hits=.15)   # collapse; keep higher prio; +1 dB
    cands.sort(key=lambda s: (s.prio, -s.tier_weight, s.peak_t))
    accepted, log = [], []
    for s in cands:
        if s.bus == 'AMB': accepted.append(s); continue              # beds bypass concurrency
        # 1. voice protection
        if speech_at(vad, s.peak_t) and s.bus == 'FG':
            if s.tier == 1 or not s.sync:
                gap = nearest_gap(vad, s.peak_t, win=(-.15, .25) if s.tier == 1 else (-.10, .15))
                if gap is not None: s.shift(gap - s.peak_t)
                else: s.gain_db -= 6 if s.tier == 1 else 4; log.append(('masked', s))
            elif s.prio >= 5 and overlaps(stressed, s): log.append(('drop_voice', s)); continue
        # 2. spacing rules
        if violates_spacing(s, accepted, lim):                      # same family .12, T1 4/6 s, risers 10 s, comedy 15 s
            if s.prio <= 2: s.gain_db -= 3                           # keep but tuck
            else: log.append(('drop_spacing', s)); continue
        # 3. concurrency (active window = until envelope < -20 dB of peak)
        act = active_at(accepted, s)
        if len([a for a in act if a.bus == 'FG']) >= 3 or len([a for a in act if a.family == s.family]) >= 2:
            victim = max(act + [s], key=lambda a: (a.prio, a.tier))  # lowest importance loses
            if victim is s: log.append(('drop_conc', s)); continue
            accepted.remove(victim); log.append(('evicted', victim))
        accepted.append(s)
    accepted += gap_fill(accepted, vad, flags, lim)                   # §2.4 gap filler (place sweeteners)
    accepted += density_floor(accepted, flags, lim)                   # if a 10 s window < min: add P4 texture from palette
    return accepted, log
```
`flags` = `drop=` times, `hush=` ranges (new optional beat key: intentional silence), sad-beat strips.
### 6.5 Bus mixer
```python
def mix(accepted, stems_music, vo, dlg, fmt):
    n = total_samples(); B = {k: np.zeros((2, n)) for k in ('FG','BG','AMB','REV_S','REV_M','REV_L')}
    for s in accepted:
        x = render_variant(s) * db(s.gain_db)
        x = distance(x, s.depth)                          # §5.6 gain / LPF / transient
        L, R = pan_law(x, s.pan, width=s.width, law_db=-4.5)   # supports MOVE automation curves
        add(B[s.bus], L, R, s.start)
        send = REV_FOR[s.place][s.depth]                   # §5.7; UI and VO dry
        if send: add(B['REV_' + send.bus], L * db(send.db), R * db(send.db), s.start)
    key = sidechain_envelope(vad_of(vo + dlg), lookahead=.04)          # 0..1
    VO  = vo_chain(vo + dlg)                                            # §5.3 + §5.4
    MUS = eq(music_bus(stems_music), MUS_EQ); MUS = duck(MUS, key, -10 if fmt == 'vertical' else -12, a=.025, h=.15, r=.4)
    MUS = dyn_eq(MUS, key, f=2500, q=.7, depth=-4, a=.015, r=.25); MUS = apply_dips(MUS, dips, -20)
    FG  = dyn_eq(eq(B['FG'], FG_EQ), key, 3000, .8, -3); FG = bus_comp(FG, 4, att=.001, rel=.06, max_gr=3)
    BG  = duck(eq(B['BG'], BG_EQ), key, -6, a=.02, r=.35)
    AMB = apply_dips(duck(eq(B['AMB'], AMB_EQ), key, -6, a=.04, r=.6), dips, -8)
    REV = sum(reverb(B[k], IR[k]) for k in ('REV_S','REV_M','REV_L'))
    pre = VO + MUS*db(MUS_FADER) + FG*db(FG_FADER) + BG*db(BG_FADER) + AMB*db(AMB_FADER) + REV
    out = tp_limiter(glue(pre, 1.5, .03, .2), ceiling_dbtp=-1.5, os=4)
    write_stems(...); write(base + '_mix.wav', out)
```
Faders are solved, not hand-set: after rendering, measure each bus's LUFS-S over speech/gap regions and adjust the fader so the §5.2 offsets hold (median error ≤ 1 LU); one iteration is enough. Remove: all `np.tanh` saturators, the final peak normalise, and single-pass loudnorm.
### 6.6 QA report (`out/<slug>_sound_qa.json` + `.md`)
```python
def qa(accepted, log, buses, mix, vad, fmt):
    R = {}
    R['density'] = per_window(accepted, 10, weights={1:1, 2:1, 3:.5})            # vs §2.2 min/target/max, per section
    R['beat_min'] = check_beat_minimums(accepted, scenes)                       # §2.3
    R['max_gap'] = longest_gap(accepted, tiers=(1,2,3), exclude=flags)          # fail > 1.5 s V / 2.5 s YT
    R['concurrency'] = histogram(active_count(accepted, bus='FG'))              # fail if any > 3
    R['repeats'] = top_names(accepted)                                          # warn if any name > 12% of events or same variant twice in a row
    R['vocab'] = len(set(s.name for s in accepted))                             # warn < 40 (V) / 70 (YT)
    R['coverage'] = sounded(renderer_events) / len(renderer_events)             # fail < 0.9
    R['t1_spacing'], R['riser_spacing'], R['comedy_count'] = spacing_checks(accepted)
    R['voice_mask'] = [w for w in speech_windows(vad, .4) if band_snr(buses, w, 1000, 4000) < 6]   # warn list with timestamps
    R['hits_on_words'] = [s for s in accepted if s.tier == 1 and speech_at(vad, s.peak_t)]
    R['clip'] = {k: peak_dbfs(b) for k, b in buses.items()}                     # fail > -0.1 dBFS pre-limiter
    R['limiter_gr'] = gr_stats(); R['loud'] = ebur128(mix)                       # I, LRA, TP, S-max, hook S (0–3 s)
    R['phone'] = {k: lufs(b) - lufs(phone_model(b)) for k, b in buses.items()}  # §5.9
    R['mono'] = mono_loss(mix); R['sync'] = sync_errors(accepted)               # |peak_t - anchor| > 40 ms on sync sounds
    R['drops'] = Counter(reason for reason, _ in log)
    return R
```
Exit non-zero on any **fail**; print warnings into the review sheet so the director sees them next to the frames.
### 6.7 Migration order (one sitting ≈ 4–6 h)
1. Event/Sound dataclasses, `legacy_cues_to_events` (works with today's `_cues.json`). 2. RULES for §3.1–3.4 and §3.6–3.7 with fallback names. 3. Scheduler + VAD. 4. Bus mixer + VO chain + ducking. 5. Two-pass loudnorm in `make.mjs`. 6. QA report. 7. Then add the renderer `events` emission (other agent) and the remaining rules (§3.5, 3.8–3.11) as the library fills in.

## 7. Sound QA checklist (every episode, both cuts)
Automatic checks are marked **[A]**; listening checks **[L]** take about 4 minutes on a phone.

1. **[A]** Integrated loudness: YT −14 ±0.5 LUFS; vertical −13 ±0.5 LUFS.
2. **[A]** True peak ≤ −1.5 dBTP on the *encoded* AAC file (re-measure after encode).
3. **[A]** LRA: vertical 4–7 LU, YT 5–9 LU.
4. **[A]** Hook short-term loudness (0–3 s) ≥ integrated +1 LU; first audible event ≤ 80 ms after frame 0.
5. **[A]** Speech-gated loudness within ±1.5 LU of integrated.
6. **[A]** No bus peaks above −0.1 dBFS before the limiter; limiter GR ≤ 4 dB, never > 200 ms continuous.
7. **[A]** loudnorm ran in linear mode (both passes logged).
8. **[A]** Density per 10 s inside §2.2 min/max for each section; no beat below its §2.3 minimum.
9. **[A]** No unflagged gap > 1.5 s (V) / 2.5 s (YT) without a T1–T3 onset.
10. **[A]** Foreground concurrency never > 3; never > 2 sounds of one family at once.
11. **[A]** T1 spacing ≥ 4 s (V) / 6 s (YT); risers ≥ 10 s apart; comedy stingers within quota.
12. **[A]** No duplicated hits within 0.15 s (cross-source de-dupe worked; e.g. the title double impact is gone).
13. **[A]** Coverage: ≥ 90% of renderer events have a sound; every transition except same-place cuts has one.
14. **[A]** Sync: contact sounds within −20/+40 ms of their anchor; whoosh peaks within ±40 ms of the transition midpoint.
15. **[A]** No unknown sound names (no silent `pop` fallbacks).
16. **[A]** Vocabulary ≥ 40 distinct sounds (V) / 70 (YT); no name > 12% of events; no same variant twice in a row.
17. **[A]** No T1 hit peaking on a speech frame; every masking warning (1–4 kHz SNR < 6 dB) reviewed.
18. **[A]** Phone model: every stem loses ≤ 8 dB (VO ≤ 5 dB); every T1 adds ≥ 4 LU momentary on the phone model.
19. **[A]** Mono-sum loss ≤ 3 dB; music L/R correlation > 0.2.
20. **[A]** One bed owner per scene: no scene has two traffic beds, and ambience J-cut leads (0.3–0.6 s) exist at every place change.
21. **[A]** Music changes only at scene boundaries or bar lines; record scratch frames coincide with a music stop (±1 frame).
22. **[A]** End: brand sting present, nothing audible after the final chord's tail, last 0.3 s silent.
23. **[L]** Phone speaker, normal volume: every caption word understood without looking. If not, note the timestamp.
24. **[L]** Phone speaker: you can name what is happening in the hook from sound alone (eyes closed, first 5 s).
25. **[L]** Each joke has its pause and button; nothing steps on a punchline.
26. **[L]** Perspective reads: far traffic sounds far; near-miss feels like it went past your ear.
27. **[L]** No sound is annoying by repetition (horns, ticks, pops). If one bothers you once, it will bother 1,000 viewers.
28. **[L]** Silence moments feel intentional, never like a dropout.
29. **[L]** Earbuds: no harsh 3–5 kHz pileups on stacked hits (if there are, the stacks need the SFX bus comp or −2 dB on the snap layer).
30. **[L]** Vietnamese colour present and correct for the place (temple bell in temples, vendor calls in the Old Quarter, not gulls on a Vietnamese beach unless they really are there).

## 8. Sources
- **Animation sound practice** — A Sound Effect, *Spider-Verse* (Schulkey, Rubay; Pemberton's record-scratch score): https://www.asoundeffect.com/spider-man-into-the-spider-verse-sound/ · Mix Online, *Spider-Verse* mix ("at times, we play against it"; "fit the effects and music together"): https://www.mixonline.com/?p=103610 · Enhanced Media, *Spider-Verse* (all sound built in post, restraint, layering): https://enhanced.media/blog/2019/9/30/spider-man-into-the-spider-verse-and-the-eye-catching-sound-elements
- **Kurzgesagt / Epic Mountain** — process page (music + SFX as the final phase): https://kurzgesagt.org/youtube/ · Kottke: https://kottke.org/18/01/the-soundtrack-to-kurzgesagt
- **Cartoon & comedy timing** — Geisler, Animation World Magazine (anticipation gets sound, quiet setups, "bigger than life"): https://www.awn.com/mag/issue4.01/4.01pages/geislersound.php3 · SoundGirls, cutting cartoon SFX (intro/setup/punchline/tag, same family): https://soundgirls.org/?p=38151 · StudioBinder, Mickey Mousing (2–3 synced gags per scene): https://www.studiobinder.com/blog/mickey-mousing/
- **Density & clarity** — Murch, *Dense Clarity / Clear Density* (Designing Sound excerpt): https://designingsound.org/2009/10/15/walter-murch-special-womb-tone-and-dense-clarityclear-density/ · Krotos interview (Law of Two and a Half, THX 1138 footsteps): https://sound.krotosaudio.com/?p=1418 · Wright on Film: https://wrightonfilm.com/2010/10/28/rules-and-anarchy/
- **Motion-graphics sync** — Sonilo whoosh guide (length matching, 4-layer whoosh, 80 ms gap before an impact, mono-safe panning): https://sonilo.com/ai-music/whoosh-sound-effect-guide · Motion The Agency (frame-exact sync, voice clearest, restraint, phone tests): https://www.motiontheagency.com/blog/sound-design-examples-before-after-in-motion · Submagic, TikTok SFX: https://submagic.co/blog/how-to-add-sound-effects-to-tiktok
- **A/V sync tolerances** — Wikipedia (ITU-R BT.1359 45 ms lead / 125 ms lag; EBU R37 +40/−60 ms; ATSC): https://en.wikipedia.org/wiki/Audio-to-video_synchronization · Fora Soft (BT.1359 acceptability +90/−185 ms): https://www.forasoft.com/learn/audio-for-video/articles-audio/lip-sync-itu-r-bt-1359-tolerance-windows
- **Retention editing** — AIR Media-Tech (music −20/−25 dB calm, −8/−12 energetic; 2 s dead air reads as the end): https://air.io/en/youtube-hacks/advanced-retention-editing-cutting-patterns-that-keep-viewers-past-minute-8 · GoFaceless (pattern breaks every 8–12 s): https://www.gofaceless.ai/blog/optimize-video-engagement-pattern-breaks
- **Ducking & loudness** — OpenClip ducking (15–25 dB depth, 10–30 ms attack, 200–500 ms release): https://openclip.app/learn/audio-ducking · OpenClip platform targets (YouTube −14 LUFS / −1 dBTP; TikTok & Reels unpublished, −14…−16): https://openclip.app/learn/audio-normalization · Opus Clip (claims −10…−12 TikTok/Instagram, −13 Facebook, uncited): https://opus.pro/blog/best-loudness-normalizers · Production Advice (YouTube −14 LUFS since 2019): https://productionadvice.co.uk/youtube-loudness/ · Production Expert on AES TD1008/TD1004 (speech −18, music −16 LUFS; −1 dBTP; −3 dBTP suggested for lossy): https://www.pro-tools-expert.com/production-expert-1/aes-update-loudness-recommendations-for-audio-only-streaming
- **Phones & small speakers** — Audiokinetic smartphone measurements (roll-off, 4–5 kHz caution, ≈ −16 LKFS practical max, AGC above −12): https://www.audiokinetic.com/en/blog/loudness-and-frequency-response-on-popular-smart-phones/ · Waves small-speaker tips (HPF checks 200/400/800 Hz, 400 Hz–6 kHz focus, bass harmonics, mono): https://www.waves.com/tips-for-great-mixes-on-small-speakers
- **Space** — Sound On Sound pan law (−4.5 dB "if in doubt"): https://www.soundonsound.com/sound-advice/q-what-pan-law-setting-should-use · IRPR depth mix (level, HF roll-off, reverb ratio, transients): https://sounddesign.irpr.agency/glossary/depth-mix/
- **Internal measurements** — `out/ep4-cross-street(-yt)_*.wav`, `out/ep3-s-shape_cues.json` (ffmpeg ebur128, Welch PSD, phone model HP 400 Hz 24 dB/oct), Oct 2026.

**Gaps in the evidence:** no source publishes per-minute SFX counts for OverSimplified or Kurzgesagt, so the §2 density numbers are working targets to calibrate with §6.6. TikTok and Instagram publish no loudness spec; the −13 LUFS vertical target is a reasoned compromise between the conflicting third-party figures and the phone-AGC measurements.
