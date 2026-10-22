# Vietadvisor Motion Studio: music engine v2 (`tools/music_pro.py`)

Owner: composer / music-tech lead · Oct 2026 · replaces `tools/music.py`, which the owner rated 3/10 ("boring, repetitive, thin").
Deliverables: `va-studio/tools/music_pro.py` (new, same CLI as music.py), demos in `research/music/demos/`, QA in `research/music/qa/`,
QA script `research/music/validate.py`. Every note is synthesised in numpy/scipy, so the music is royalty-free by construction. No samples are used, not even the CC0 ones.

---

## 0. Results in one table (same cues: ep4-cross-street YouTube cut, 191 s, mood adventure)

| metric | old `music.py` | new `music_pro.py` | target |
|---|---|---|---|
| 4-bar blocks that repeat a neighbour (r > .95) | **12 / 21** | **0 / 21** | 0 |
| mean / max similarity of adjacent 4-bar blocks (Pearson r, beat-synced 24-band log spectrogram) | .785 / .961 | .574 / .705 (comedy: .386 / .517) | as low as the style allows |
| energy share in the 200 Hz–6 kHz phone band | 0.20 | 0.52 | ≥ 0.4 |
| loudness lost through a phone model (HP 400 Hz 24 dB/oct + LP 8 kHz) | 6.3 dB | 2.7 dB | ≤ 3 dB |
| spectral-centroid p10–p90 (more range = more colour change) | 138–742 Hz | 265–953 Hz | wider |
| integrated loudness / true peak | −14.1 LUFS / −1.0 dBTP | −16.0 LUFS / −3.3 dBTP | −16 ± 0.5 / ≤ −1.5 |
| L/R correlation | 0.08 (falls apart in mono) | 0.79 | > 0.2 (sound-grammar §5) |
| render time for 191 s | ~10 s | 33 s (comedy 23 s) | < 90 s for 3 min |

All 19 mood demos (25 s, realistic cues) measure −16.00 LUFS ± 0.02, true peak −1.8 to −4.8 dBTP, 0 clipped samples, 0 repeated 4-bar blocks,
and a phone-band share of 0.45–0.87. All 9 stingers are normalised to momentary-max −14 LUFS (the sound-grammar one-shot standard) with true peak ≤ −2.7 dBTP.
I validated these numerically. I could not listen to them, so the owner's ears are the final test.

---

## 1. Research findings (with sources)

### Edutainment and animation scoring
- **OverSimplified** scores its videos with Creative Commons library music (Kevin MacLeod) over a deadpan third-person narration. The comedy is bait-and-switch, so the music is *straight-faced* and the joke lands in the cut and the sting. → Score jokes with an earnest bed, a hole before the punchline, and a short button. [creatorhandbook](https://www.creatorhandbook.net/oversimplified-a-youtube-empire/)
- **Kurzgesagt / Epic Mountain**: "each Kurzgesagt gets its own specifically composed soundtrack … to give it a unique mood and emotional impact". Music and SFX are the final phase of production. The style is pads and plucks with slow build-ups and "wonder" swells (our `wonder` mood). [kurzgesagt.org/youtube](https://kurzgesagt.org/youtube/) · [kottke](https://kottke.org/18/01/the-soundtrack-to-kurzgesagt) · [Epic Mountain bandcamp](https://epicmountainmusic.bandcamp.com/)
- **Mickey-mousing / hit points**: the director and composer spot the cut and mark hit points, then the composer tempo-maps so the hits land. Carl Stalling (Warner, 1936–58) changed tempo several times inside one gag. Use it *deliberately on a few key moments*, because constant tracking exhausts the viewer and devalues silence. → The engine hits cuts into hook/title/reveal/hero moments and leaves dialogue alone. [StudioBinder](https://www.studiobinder.com/blog/mickey-mousing/)
- **Looney Tunes practice today** (Carl Johnson): every footstep or key event lands "within a frame or two". Stalling's cut-and-paste mixed jazz, classical and pop quotations, and music has to carry the narration when there's no dialogue. [InsideHook](https://www.insidehook.com/article/music/looney-tunes-shorts-carl-johnson-hbo-max)
- **Sting / stinger**: a brief musical phrase that punctuates a story moment, often closing a scene or announcing a climax. [ControlBooth](https://www.controlbooth.com/wiki/sting)
- **Leitmotif**: a phrase that stands for a character, place or idea. It is transformed by tempo, rhythm, texture (dense = action, sparse = intimacy) and orchestration, as in E.T.'s flying theme on piccolo over high strings. [PremiumBeat](https://www.premiumbeat.com/blog/leitmotif-in-film-scores/). *Up* is "character-theme based, using thematic transformation" (jazz → waltz). [Wikipedia: Up soundtrack](https://en.wikipedia.org/wiki/Up_(soundtrack)) → One seed-derived contour is shared by every mood of an episode.
- **Trailer form**: a sparse, subtle opening, then a gradual build (Act I + II can merge into one "slow burn"), sometimes a break before the final climax, and often a last riser into a final hit. [VI-Control](https://vi-control.net/community/threads/slow-burn-trailer-tracks-structure-form.171675/)
- **Arrangement against boredom**: make a change about every 8 bars. Use theme and variations, vary instrumentation, dynamics and rhythm, and use breakdowns, risers and fills at transitions. The chorus is the peak and the bridge gives contrast. [Avid](https://www.avid.com/resource-center/arranging-music-guide). Build in 8- or 16-bar blocks, add an element every few bars, then cut in breakdowns and drops. [Attack Magazine](https://www.attackmagazine.com/technique/tutorials/4-ways-to-break-out-of-the-loop/)
- **Comedy fail**: the "wah wah waaah" descending trombone, last note held longest, punctuates awkward pauses. [Otto](https://joinotto.com/video-creators/sound-effects/sad-trombone)
- **Lo-fi**: 70–90 BPM, jazzy 7th chords on Rhodes or piano, subdued root bass, dusty sparse drums, vinyl crackle and tape warble. [Produce Like A Pro](https://producelikeapro.com/blog/what-is-lo-fi-music/). High-cut around 2–4 kHz, tape saturation, chorus-style wow, loose unquantised drums. [Yamaha Hub](https://hub.yamaha.com/proaudio/recording/how-to-create-lo-fi)
- In-house rules this engine follows: `research/mix/sound-grammar.md`: silence is a hit (0.3–0.5 s dip before the act's biggest moment, at most one per 20 s), a comedy button with a −6 dB hole for 0.35 s before the punch, music re-enters on the next bar and never mid-bar, voice is sacred, and the music changes only at scene boundaries or bar lines. `research/story/story-devices.md`: the sincere-whiplash beat drops the music out, mock-epic cuts the music dead, the Wurtz rhythm runs line → sting → line, and the Kurzgesagt pivot softens the music.

### Vietnamese traditional music
- **Đàn bầu**: one string, plucked at one of 7 harmonic nodes, so the tone is near-sinusoidal (flageolet). Overtones run 1/2 … 7/8, the last two being non-Western intervals. A flexible rod bends the pitch both ways and adds vibrato. It is usually tuned near C3 (131 Hz), it is soft, and modern instruments use a magnetic pickup. [Wikipedia](https://en.wikipedia.org/wiki/%C4%90%C3%A0n_b%E1%BA%A7u) · [Lark in the Morning](https://larkinthemorning.com/blogs/articles/the-dan-b-u-one-string-many-tones)
- **Đàn tranh**: 16 strings is the classic count and 17 is standard since the late 1980s. It is tuned pentatonic, the right hand plucks with picks, and the left hand presses behind the bridges for bends and ornaments. [Wikipedia](https://en.wikipedia.org/wiki/%C4%90%C3%A0n_tranh). Pitch bends are the defining embellishment, and a 166-cent step is common. [Sonic Field](https://labs.sonicfield.org/library/vietnamese-modal-scales-of-the-dan-tranh)
- **Sáo trúc**: a transverse bamboo flute with 6 or 10 holes. Tone colour comes from breath and blowing angle, and half-holing gives fine pitch shades. [Wikipedia](https://en.wikipedia.org/wiki/S%C3%A1o)
- **Instruments**: trống (trống cái, trống chầu, trống cơm), cồng chiêng (flat and knobbed tuned gongs), tam âm la, đàn nguyệt (2 strings tuned a 4th, 5th or minor 7th apart), đàn nhị. [Wikipedia](https://en.wikipedia.org/wiki/Traditional_Vietnamese_musical_instruments) · [Music of Vietnam](https://en.wikipedia.org/wiki/Music_of_Vietnam). Song lang is the foot clapper that marks strong beats in tài tử. [Folkways UNES08049 liner notes](https://folkways-media.si.edu/docs/folkways/artwork/UNES08049.pdf)
- **Modes** (Trần Văn Khê's notes): the **Bắc** system has hơi Bắc (joy), Quảng (fantasy) and Nhạc (solemn, ceremonial). The **Nam** system has Xuân (serenity), Ai (melancholy), Đảo and **Oán** (sadness, close to Ai). Each mode has its own scale, favoured degrees, ornaments and mood. [Folkways UNES08049](https://folkways-media.si.edu/docs/folkways/artwork/UNES08049.pdf). Vọng cổ is "the oán nuance of the nam mode", melancholy in character. [Wikipedia](https://en.wikipedia.org/wiki/V%E1%BB%8Dng_c%E1%BB%95). A Nam/Oán flute improvisation from 1965 is archived at [CREM](https://archives.crem-cnrs.fr/archives/items/CNRSMH_I_1971_035_005_08/). Central Vietnam uses tetratonic scales with a lowered xự and raised xang. [RFA](https://www.rfa.org/vietnamese/news/programs/MusicForWeekend/central-province-folklores-vh-02232014104605.html)
  - Engine encoding: **Bắc = C D F G A** (hò xự xang xê cống) for `vn_folk`. **Oán ≈ C E♭+ F G A♭+**, with xự +30 c, cống +45 c and rung vibrato, for `vn_epic`. The exact cent values are a performance-practice approximation (no source gave numbers) and should be checked with a Vietnamese musician.

### Cheap realistic synthesis
- **Karplus–Strong**: a delay line filled with noise, a one-zero loop filter, a lowpassed excitation as the dynamics control, and a pick-position comb. [CCRMA/DSPRelated](https://www.dsprelated.com/freebooks/pasp/Karplus_Strong_Algorithm.html) · [Wikipedia](https://en.wikipedia.org/wiki/Karplus%E2%80%93Strong_string_synthesis). Implemented with `lfilter`, using an integer delay plus a resample for exact tuning (measured 0–1 cent error) and a convolved body IR (guitar, tranh, nguyệt, bass, violin modes).
- **FM**: sidebands sit at fc ± k·fm. An integer ratio gives harmonic tones, a non-integer ratio gives bells, and an index that decays from bright to pure gives a struck sound. For brass, the index follows the amplitude. [Cycling '74](https://docs.cycling74.com/legacy/max5/tutorials/msp-tut/mspchapter11.html) · [Chowning 1973](https://web.eecs.umich.edu/%7Efessler/course/100/misc/chowning-73-tso.pdf). Used for the e-piano (1:1 plus a 14:1 tine) and the bell (1:3.5).
- **Brass**: 2–3 saws detuned ±6 c. The amp attack is slightly faster than the filter attack, there is a pitch scoop at key-on, and the French horn has a slower attack with less filter-envelope depth. [Sound On Sound](https://www.soundonsound.com/techniques/creating-analogue-sounds-digital-synths-part-3). The filter sweep is approximated by crossfading a dark and a bright filtered copy along the envelope, which is vectorised and cheap.
- **Snare**: two tonal modes near 180 and 330 Hz with separate decays, plus lowpassed noise split into a high-passed path and a direct path (TR-909 analysis). [Sound On Sound](https://www.soundonsound.com/techniques/practical-snare-drum-synthesis)
- **Reverb**: use uncorrelated noise IRs (dense, colourless) with separate L/R sequences for width, an exponential decay set by RT60, and more high-frequency damping over time. [Vicanek](https://www.vicanek.de/articles/ReverbAlgo.pdf). Implemented as 3-band decaying stereo noise (low ×1.15, high ×0.45 RT60) with an 18 ms pre-delay and early-reflection taps.
- **Sidechain**: the kick drives a compressor on the pad and bass, with fast attack and release setting the pump length. [MusicTech](https://musictech.com/glossary/sidechain-compression/)
- **Loudness**: BS.1770 blocks of 400 ms with 75 % overlap, the −0.691 + 10·log10 Σ formula, and true peak by oversampling (8× at 44.1 kHz in MATLAB). [MathWorks](https://www.mathworks.com/help/audio/ref/loudnessmeter.html). Our meter (K-weighting with libebur128 coefficients, gates at −70 and −10) matches `ffmpeg ebur128` to 0.0 LU on the demos.

---

## 2. Scoring rules: what to play when

### 2.1 Mood per story moment
| story moment | mood(s) | why |
|---|---|---|
| cold open / hook question | `adventure`, `upbeat`, `tension` (scary question), `mystery` (riddle) | full band from frame 0, accent on the first cut |
| title card | the act's mood; `triumph` for a film-style title | accent hit + crash |
| guide / how-to / list | `chill`, `cafe`, `upbeat` (countdown) | steady groove, melody thins under VO |
| food, café, slow street life | `cafe`, `lofi_hanoi`, `chill` | Rhodes 7ths/9ths, brushes, dusty beat |
| night street, neon | `night`, `lofi_hanoi` | đàn bầu over lo-fi |
| culture / village / craft / landscape | `vn_folk` | tranh arps, sáo, bầu, mõ + song lang |
| history battle, Bạch Đằng, dynasties | `vn_epic` (Vietnamese), `epic` (generic) | trống trận, chiêng hits, ostinato strings, brass |
| myth vs fact, comic bits, character intro | `comedy`, `sneaky` (scheming, tiptoe) | bassoon/xylo/pizz, tuba oompah, woodblock |
| awkward failure, Dave loses | `sad_comedy` | minor waltz, accordion, tuba (3/4) |
| quiz, countdown | `quiz` | ticking 16ths, pulse bass, pizz ostinato |
| science, scale, "wow" reveal (Kurzgesagt pivot) | `wonder` | Lydian pads, delayed plucks, choir, bells |
| crisis / danger / traffic panic | `tension`, `mystery` | Phrygian, b2, low ostinato |
| victory, payoff, "I crossed!" | `triumph` | fanfare, snare + timpani, ♭VI–♭VII–I |
| parade / mock-military / "RULE #1" | `march` | snare march, tuba, piccolo |
| sincere-whiplash line (story-devices #22) | `emotional`, or no music | piano + strings, then drop out |

### 2.2 How to score…
- **A joke**: earnest bed → the music dips to −6 dB for 0.35 s before the punch (the comic pause) → **button** (2 notes, V → I, staccato pizz + bassoon + woodblock) landing on the punch frame → the music stays at −10 dB until the **next bar line** and re-enters on the downbeat, never mid-bar. One button per ≥ 9 s (engine) and at most one comedy stinger per 15 s (sound-grammar). A *silent visual gag* gets a sting and no bed. *Mock-epic* means epic music that cuts dead (`record_scratch_stop`).
- **A reveal**: a build bar before it (snare/tom fill, reverse cymbal, riser) → **near-silence** from −0.45 s (ramp to −20 dB by −0.33 s) → **hit on the cut** (brass chord + timpani + taiko + crash, or chiêng + trống in VN moods) → the biggest section (D) starts. At most one drop-out per 20 s.
- **A battle**: `vn_epic` or `epic`. Trống on the downbeats and rim "cắc" on the off-beats, 16th spiccato ostinato on root–5th, a chiêng on every section rise, brass melody in C/D with a strings-octave doubling, a half-time "breath" phrase every 4th phrase for pacing, and a tom/trống crescendo fill into each phrase.
- **A sad beat**: `emotional` (piano broken chords + strings pad + sáo). The bass holds whole notes and there are no drums at level ≤ 2. For the sincere line itself, let the music drop out (`--mood none` segment or a dip) and bring back a solo instrument afterwards.
- **A montage / route / ride**: level 3 (C). Full groove, the lead rotates every phrase (tranh → sáo → trumpet → steel guitar in `adventure`), counter-melody on, a "push" phrase (extra percussion, counter up an octave) every 4th phrase, a crash on each cut that raises energy, and a key change into the last act.
- **Dialogue**: level 1 (A). Pad + light comp + bass roots. The melody plays only in speech gaps (notes under subs are thinned 55 % and softened −4.4 dB). Bubble pops and expression stingers belong to SFX, not to the score.
- **End card**: the bar before is forced to V (V7 in minor), and the tonic chord lands 30 ms after the end frame on pad + piano + lead + bass + crash. Everything else stops on the end frame, and the tail fades by +3.8 s.

---

## 3. Engine design (what `music_pro.py` does)
1. **Energy map**: beat type → level 0–4 (`ENERGY`, `MOMENT_E`: `street3d` = 3, `shot_eyes` = 1, `steam` = 1, …). Each section switches on the **bar line nearest the cut**, and bar 1 = frame 0.
2. **Song form**: levels become labels: `intro` (first bar if the episode doesn't open on a hook), `A` (verse, level 1), `B` (lift, 2), `C` (hook/chorus, 3), `D` (climax = the last C run after 45 % of the runtime), `X` (breakdown = quiet run right after a peak), `^` build (the bar before a jump into C/D), and the end cadence. Example (ep4 YouTube, 89 bars): `iCCCCCBCCC…CxxxxBBBB^CCCC^CCC…B^CCCCBCCCCCCBCC…BBBB^CCCxxBBB^DDD`.
3. **Variation system** (no unvaried loop): each 4-bar phrase gets `v` = how many phrases of that label have played so far. `v` rotates:
   - lead instrument (`leads[(v + label offset) % n]`), with call and response (bars 3–4 played by a counter instrument on odd `v`);
   - melodic transform: original → sequence (+2 steps) → inversion → diminution (augmentation in breakdowns), plus register +12 on some climax phrases;
   - theme: leitmotif or B theme (B on odd B phrases and every 4th C phrase);
   - progression: the base progression → rotated by 2 → substitution on chord 2 (I→vi, IV→ii / i→III, VI→iv) → the sister section's progression;
   - texture: `tex 2` = **breath** (half-time drums, pads + arp, bass whole notes), `tex 3` = **push** (extra shaker/tamb, counter-melody up an octave);
   - drum variant (2 per level per kit, switching every 2 bars) and comp pattern rotation, with fills on every phrase end (tom/trống/woodblock/snare by kit).
4. **Melody writer**: a seed-derived contour (the leitmotif, shared by every mood with the same `--seed`) on a style-specific rhythm "feel" (bouncy, lyrical, driving, sparse, sneaky, folk, fanfare). Strong beats snap to chord tones, phrase ends cadence on a chord tone (the tonic at section ends), comedy moods add chromatic approach notes, and VN ornaments are added: sáo luyến grace notes, đàn bầu scoops, falls and rises with widening rung, tranh nhấn bends and rung, nguyệt tremolo, and tranh glissando runs (lướt) into phrases.
5. **Counter-melody**: guide tones (3rd/7th) in 55–70 MIDI, voice-led by the nearest step, as whole notes (lyrical feels) or half notes.
6. **Hit points**: accents (≥ 5 s apart; 2.5 s for title/reveal/chapter/payoff), drop-outs, buttons, the end cadence, and a modulation (`mod` = +1 or +2 semitones at the first D bar, after a V/new-key pivot bar, only if the cue is ≥ 45 s).
7. **Mix**: humanised timing (σ 4 ms, clipped ±10 ms), velocity ±6 %, equal-power pan, per-stem HPF, a −35 % low-mid carve on harmony, mono-safe Haas widening, a tempo-synced ping-pong delay (dotted 8th) on the melody in airy moods, kick-keyed sidechain (upbeat), **auto-balance** (each stem's gated LUFS set relative to the melody by a style profile: default, soft, drive or comic), hall convolution per stem, and lo-fi wow/flutter (9 c at 0.45 Hz + 3 c at 5.7 Hz) plus crackle.
8. **Master**: HPF 28 Hz, −25 % below 110 Hz, +presence (1.8–4.5 kHz) and +mid (0.5–1.5 kHz) for phones, RMS glue compressor at 2:1, tanh tape saturation, BS.1770 normalisation to −16 LUFS, 4×-oversampled look-ahead true-peak limiter at −1.6 dBTP (iterated), and a final safety trim.
9. **Stems**: `drums bass harmony melody fx` (the final chord goes into harmony), exported post-balance and post-reverb with the master gain applied but no glue/limiter. They sum back to the master with r = 0.91 and +0.9 dB.

---

## 4. Instrument recipes (all in `music_pro.py`, all vectorised)
| instrument | recipe |
|---|---|
| guitar / steel / harp / pizz / upright bass | Karplus–Strong (`lfilter`, loop weight from brightness, T60 per instrument, pick-position comb) + body-IR convolution + resample to exact pitch; the bass gets tanh drive so harmonics carry on phones |
| **đàn tranh** | bright KS (T60 2.6 s) + tranh body modes (240/520/900/1700/2600 Hz); nhấn = pitch warp from −100/−200 c, rung = 5.6 Hz ±30 c after 0.2 s, plus glissando runs |
| **đàn nguyệt** | darker, shorter KS + nguyệt body; tremolo picking (13 Hz) on long notes |
| **đàn bầu** | near-sine harmonic (1, .22, .07, .025) with a soft swell, pick click, rod scoop/fall/rise bends, 5.3 Hz rung widening over time, light pickup drive |
| **sáo trúc** | sine + 2nd/3rd/4th partials, band-passed breath noise modulated with the vibrato, chiff burst, −35 c scoop, delayed 5.2 Hz vibrato, luyến grace note |
| strings ensemble / violin / cello / spiccato | 1–5 polyBLEP saws with independent vibrato (4.8–6.2 Hz) and detune ±7 c, LPF tracking pitch and velocity, a 700–1400 Hz formant lift, bow noise; violin/cello add a body IR |
| trumpet / horn / trombone / tuba / brass section | detuned polyBLEP saws, −40 c scoop, delayed vibrato, dark/bright crossfade along the filter envelope (amp attack faster than filter attack), breath noise; tuba gets tanh drive |
| clarinet / bassoon / accordion | band-limited square (clarinet); saw through 300–900 + 1000–1500 Hz formants (bassoon); 3 detuned reed voices (musette) + bellows tremolo (accordion) |
| piano | 15 inharmonic partials (B = 2.5e-4) with 2 detuned strings each, two-stage decay, velocity-dependent brightness, hammer noise, damper |
| e-piano | FM 1:1 with a decaying index + 14:1 tine; optional 4.6 Hz tremolo (night/lo-fi) |
| mallets | modal partials: marimba 1/3.93/9.2, xylophone 1/3/6.1, glockenspiel 1/2.76/5.4/8.9, celesta, vibraphone with a 5.4 Hz motor; bell = FM 1:3.5 |
| pads / choir / pluck | 4 detuned saws with a slow attack (pad), plus high air noise (pad_air), saws through aah formants (choir), saws with a fast dark/bright filter envelope (Kurzgesagt pluck) |
| drums | kick = sine sweep 160→50 Hz + beater click 1.5–5 kHz (phone band); snare = 185/330 Hz modes + split noise; 808-ratio metallic hats; clap = 4 bursts; taiko; timpani (1, 1.504, 1.742, 2.0, 2.245 modes) |
| **trống / mõ / song lang / chiêng** | trống trận: 78 Hz barrel drum, 3 overtones, long ring + slap; "cắc" rim click (1.05 kHz); trống nhỏ ~190 Hz; mõ hollow 820 Hz + 2.3× partial; song lang 2.3 kHz click; chiêng knobbed gong: 5 beating partials (1, 2.01, 2.76, 3.6, 4.9) with a bloom; tam-tam cloud for epic |
| FX | riser (swept noise band + rising saws), reverse cymbal, sub-drop with 2nd/4th harmonics, impact, whoosh, record scratch (hand-motion modulated band noise + tone), crackle |

---

## 5. Mood catalogue
| mood | bpm / meter | key, mode | kit · bass | leads (rotate) · counter | use |
|---|---|---|---|---|---|
| adventure | 112 | D major, pentatonic melody | pop · e-bass pop | tranh, sáo, trumpet, steel · horn, strings, sáo | default travel, street, routes |
| comedy | 108 (swing .1) | C major + chromatic approach notes | woodblock/cowbell · tuba oompah | bassoon, xylo, clarinet, pizz · clarinet, glock | myths, character bits |
| epic | 92 | D minor | taiko/toms · cello ostinato + choir | brass section, strings, horn, choir | generic history, scale |
| emotional | 72 | C major add9 | soft (later) · cello long | piano, sáo, violin, cello | sincere beats |
| cafe | 92 (swing .2) | F major 7ths | brushes + ride · walking upright | vibes, tranh, clarinet, guitar | food, cà phê |
| night | 84 (swing .16) | A minor 9ths, pentatonic | lo-fi · e-bass | đàn bầu, e-piano, sáo (+ delay) | night street |
| quiz | 120 | D minor (V major) | ticking 16ths · synth pulse | marimba, pizz, pluck, glock | quiz/countdown |
| upbeat | 122 | C major | four-on-the-floor · off-beat synth bass + sidechain | pluck, sáo, saw lead, glock | listicles, energy |
| chill | 96 | E major 9ths | soft shaker · e-bass | sáo, guitar, vibes, tranh | guides |
| **vn_folk** | 96 | G Bắc (C D F G A), open 5th/9th voicings | mõ, song lang, trống nhỏ · upright | sáo, tranh, bầu, nguyệt · bầu, sáo | villages, crafts, landscapes |
| **vn_epic** | 100 | D Oán (microtonal xự/cống) | trống trận, cắc, taiko, chiêng · cello ostinato | sáo, brass section, bầu, strings | battles, dynasties |
| **mystery** | 80 | E harmonic minor (i–♭VI–iv–V, ♭II) | soft toms/shaker · slow walking pizz | celesta, clarinet, violin, bell | riddles, legends |
| **tension** | 100 | C♯ Phrygian (♭II) | ticks → toms · 16th pulse | high strings, horn, piano, cello | danger, traffic panic |
| **wonder** | 84 | E♭ Lydian (I–II vamp), add9 | soft → claps · sub | pluck, bell, sáo, choir (+ delay, big hall) | Kurzgesagt pivot, scale reveals |
| **sneaky** | 100 (swing .12) | A minor 7, chromatic | snaps, brushes · chromatic walk | bassoon, clarinet, pizz, vibes | scheming, tiptoe |
| **triumph** | 116 | B♭ major (♭VI–♭VII–I) | march snare + timpani · tuba march | trumpet, brass section, strings, horn | victory, payoff |
| **lofi_hanoi** | 76 (swing .22) | F major 9ths, pentatonic | lo-fi + crackle + wow · e-bass | đàn bầu, e-piano, sáo | Hà Nội café/night montage |
| **march** | 112 | B♭ major | snare march · tuba | trumpet, piccolo, glock, clarinet | mock-military, rules |
| **sad_comedy** | 132, **3/4** | D harmonic minor | waltz brushes/triangle · tuba on 1 | accordion, clarinet, violin, bassoon | awkward fails |

Aliases: food→cafe, history→epic, story→emotional, guide→chill, myth→comedy, countdown/versus→upbeat, battle→vn_epic, folk→vn_folk, sad→emotional, lofi→lofi_hanoi, science→wonder, heist→sneaky, victory→triumph, suspense→tension, spooky→mystery, awkward→sad_comedy.

---

## 6. Stingers
| stinger | content | length | typical anchor |
|---|---|---|---|
| `comedy_button` | "bum-BUM" V→I pizz + bassoon + tuba + woodblock | 1.4 s | punch frame of a gag (second hit at +0.30 s) |
| `reveal` | riser + reverse cymbal → 0.2 s gap → brass chord + strings + glock + timpani + taiko + crash + sub-drop | 4.2 s | hit at **+1.90 s**: place at reveal − 1.90 |
| `fail` | sad trombone: 3 falling notes with plunger wah + a long wobbling 4th that sags | 3.4 s | after the failure lands, in silence |
| `win` | snare pickup → trumpet arpeggio → held tonic, brass + strings, glock sparkle, crash, timpani | 3.6 s | tonic hit at **+0.60 s** |
| `tension_hit` | impact + sub-drop + low brass cluster (b2) + high string semitone + timpani + tam-tam | 3.8 s | on the shock frame (0) |
| `vn_gong` | trống + chiêng ×2 + rim + đàn bầu scoop + tranh run | 5.0 s | chapter cards in VN history, dynasty titles |
| `chapter` | string swell → timpani + bell/harp chord ("page turn") | 4.0 s | chord at **+1.20 s** |
| `transition` | reverse cymbal + whoosh → harp glissando | 2.4 s | landing at **+0.90 s** on the cut |
| `record_scratch_stop` | a groove → scratch → tape stop → silence | 2.6 s | scratch at **+0.88 s**: music stops on that frame |

`python3 tools/music_pro.py stinger <type> out.wav --mood <mood>`. The mood sets the key (the root of that mood), so stingers sit in the score's key.

---

## 7. CLI
```
python3 tools/music_pro.py score out/x_cues.json out/x_music.wav --mood adventure --seed ep4 [--stems out/x_stems/] [--modulate auto|off|N] [--lufs -16]
python3 tools/music_pro.py stinger reveal out/x_reveal.wav --mood vn_epic
python3 tools/music_pro.py demo out/demos/ [--only adventure,comedy] [--cues some_cues.json]
python3 tools/music_pro.py list
```
The CLI behaves like music.py: `--mood` falls back to `cues.music` and then `adventure`; `--mood path/to/track.mp3` or `none` is passed to music.py's user-track and silence handling; the output is stereo 44.1 kHz 16-bit and D + 3 s long. It prints a JSON info line (form string, hits, buttons, drops, modulation, events, seconds).

---

## 8. Integration notes for `tools/sound_design.py` (not applied: one-line changes for the owner)
1. **Switch engine**: in `main()`, replace `'music.py'` with `'music_pro.py'` in the subprocess call.
2. **Seed = episode slug, not `'egg-' + mood`**: pass `'--seed', os.path.basename(base)`. All moods of the episode then share one leitmotif, transformed per mood (Giacchino-style thematic transformation).
3. **Cache bust**: the cache test only compares mtime to `_cues.json`, so old music.py renders would be reused. Rename the cache to `f'{base}_mpro_{mood}.wav'` (or delete `out/*_music_*.wav` once).
4. **Crossfades on the bar**: every mood render puts bar 1 at frame 0 and switches sections on the bar line nearest a cut. Today's −0.35 s / 1.4 s equal-power crossfade works. Better: centre each crossfade on the incoming mood's bar line nearest the cut (`60/STYLES[m]['bpm'] * STYLES[m].get('bpb', 4)`), with a 0.25 s fade for a smash cut and 1.4 s for a dissolve.
5. **Don't double the grammar**: music_pro already does reveal/payoff drop-outs, buttons on gag/dialogue/myth ends, accents on hero cuts and the end cadence. Keep `sound_design` dips for art slams, film titles and `drop=` (they multiply, so a coincident dip is harmless). Keep the slide-whistle/record-scratch SFX, but when a `myth` BUSTED fires `record_scratch`, also zero the music bus from that frame to the next bar (sound-grammar §3.5: the music stops on the scratch frame).
6. **Levels**: the music file arrives at −16 LUFS integrated / ≤ −1.5 dBTP. The mixer's `music_db = −14.5` and ducking stay valid. Remove the final `tanh` + peak normalise and move to the two-pass loudnorm in sound-grammar §5.8.
7. **Cost**: each mood is rendered over the full timeline (about 0.17–0.2× realtime per mood). A 3-min cut with 5 moods takes ≈ 2.5–3 min. Possible later optimisation: a `--range t0 t1` flag so each mood renders only its segments ± 2 bars.
8. **Stinger placement grammar** (use the music_pro stingers as SFX-FG events; spacing per sound-grammar §2):

| trigger | stinger | anchor offset | gain | rule |
|---|---|---|---|---|
| `gag` punch / `punch=` | `comedy_button` (comedy family moods) | −0.30 s (the second note lands on the punch) | −6 dB | ≥ 15 s apart, ≤ 4 per vertical, ≤ 10 per YT; VO silent 0.35 s before |
| `myth` BUSTED | `record_scratch_stop` | −0.88 s | −4 dB | music bus cut at the scratch frame |
| Dave fails / "NOPE." | `fail` | +0.1 s after the visual | −6 dB | in an AMB-only gap; never under VO |
| `payoff`, "done" moment | `win` | −0.60 s | −4 dB | once per act |
| big `reveal` / `map3d` / `wow_*` | `reveal` (or let the score's own hit carry it) | −1.90 s | −6 dB | ≤ 1 per 20 s (V) / 45 s (YT); skip if the score already hits there |
| `chapter` (YT) | `chapter`, or `vn_gong` for history | −1.20 s / 0 | −8 dB | every chapter |
| shocked/scared expression, `crashZoom` into danger | `tension_hit` | 0 | −8 dB | ≥ 6 s apart |
| `trans=fade/wipe` between acts | `transition` | −0.90 s | −10 dB | only between acts |

9. **New story header vocabulary**, e.g. ep4: `score: comedy@1 adventure@4 sneaky@6 tension@9 lofi_hanoi@14 triumph@16`, and for history episodes `vn_epic` battles / `vn_folk` villages / `wonder` for the Kurzgesagt pivot.

---

## 9. Validation method and files
- `python3 research/music/validate.py --dir research/music/demos --cues research/music/demos/demo_cues.json --png research/music/qa --json research/music/qa/demos_metrics.json`
- Metrics: LUFS (cross-checked with `ffmpeg ebur128`: −16.0 / −1.6 dBTP identical), true peak, clipped samples, phone-band share, phone-model loudness drop, spectral centroid mean/std/p10–p90, onset density, per-scene RMS/centroid/onsets, adjacent 4-bar block similarity, L/R correlation. Spectrogram + RMS plots are in `qa/*.png`.
- Per-scene check (adventure demo): hook −17 dB / 7.5 onsets/s, dialogue −22 dB / 1.6, gag −19 dB, talk −19 dB, reveal −17 dB / 10.9, street moment −18 dB / 7.6, end −22 dB. The energy follows the beats, and the dialogue thins as intended.
- Bugs found and fixed during QA: polyBLEP called with scalar frequencies (pads, plucks, synth bass and accordion rendered as clicks: tuning check showed −370 c), band-pass edge inversion for high notes, a sidechain negative index, drum-dominated balance (drums 97 % below 200 Hz → role gains + beater click + auto-balance), and a too-narrow image (corr 0.95 → 0.7–0.87). The repetition metric was rebuilt because cosine on band energy was blind to loops.

## 10. Known limits / next steps
- I didn't listen to any of this, so the owner's ears are the final test. The most likely complaints are synthetic brass (the dark/bright crossfade is not a true time-varying filter), choir, and accordion. The quickest realism win would be CC0 multisampled one-shots (e.g. a CC0 piano or đàn tranh set) loaded as a sampler; the engine's event list is sampler-ready.
- Oán microtones and ornament rates are approximations; check them with a đàn tranh or đàn bầu player.
- Fixed tempo per mood: no rubato or tempo-mapping onto hit frames (hits are placed on exact frames over the grid instead). Only `sad_comedy` uses 3/4.
- Stems are pre-glue/limiter and sum to the master within about 1 dB (r = 0.91).
- Demos: `demos/<mood>.wav` (19 × 25 s, seed `demo`, so every mood shares one theme), `demos/stingers/*.wav` (9), `demos/showcase/ep4-yt_adventure_191s.wav` vs `…_OLD_music.py.wav` (A/B on the same cues), `ep4-yt_comedy_191s.wav`, `vn_epic_demo_with_stems.wav` + `vn_epic_stems/`.
