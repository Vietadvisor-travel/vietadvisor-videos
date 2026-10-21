# Directing & editing: picture, voice and sound locked together (v5)

## What the engine already does for you
| Rule (below) | Where it lives |
|---|---|
| VO is the timing authority; visuals land on **real word times** | `voice.py` writes `words.json`; the engine times every `at:`/`@word` on it |
| Picture arrives **2–6 frames before** the stressed word | built in: every word cue fires 0.1 s early (`window.PP_LEAD`) |
| A picture event every 2–4 s; no static frame > 4 s | `pp_lint` (dead-picture and camera checks); camera rig `shot=` or the default slow push |
| ≥ 3 depth planes, parallax ratios | `scene` (plate / subject / foreground) and the collage planes, all parallaxed by the camera rig |
| Whoosh peak on the new shot, impact on landing, tick on appear | automatic SFX per event (`sound_design.py`) |
| Silence before reveals | `[BEAT]` in the script makes the voice pause; keep `fx` quiet in that beat |
| Restraint caps (crash zoom ≤ 1/min, stylised transitions ≤ 2/min…) | `pp_lint` caps |
| One grade, one light, one grain over everything | the v5 finish pass on every frame |
| Read-time for on-screen text | `pp_lint` (≤ 8 words on screen; hold rules) |

## What you must still decide (director)
- The **hit word** of each sentence, written `**bold**` in the A/V script.
- **Cut motivation:** the new picture must answer or advance what was just said.
- **Rhythm:** alternate runs of quick beats with one longer hold, and hold 1.5–4 s longer after a reveal line.
- **Match cuts and object wipes** at topic changes (shot-script.md bridges).

---

## 0. Evidence note

The web gives very little primary evidence on these channels. Johnny Harris, LEMMiNO, Wendover, Polymatter, Fern, Nexpo, Neo, Coffeezilla and MagnatesMedia have published almost nothing about their editing rules. What exists is:

- **Their own short statements:**
  - Kurzgesagt: the narration is the timing reference, every video gets a custom score and SFX from Epic Mountain, and they mix 2D with some 3D.
  - Johnny Harris: GEOlayers / After Effects map tutorials.
  - Vox: the team built a form that combines data visualisation, animation, sound design, expert interviews and narration.
- **Educators:** Murch's *Rule of Six*, *Every Frame a Painting*, and subtitle reading-speed research.
- **Practitioner and vendor guides:** retention editing, ducking, whoosh timing, cutting to the beat, Vox/Harris map tutorials.

Each rule below carries a tag:
- **[S]** sourced, with a citation at the end.
- **[P]** practitioner consensus repeated across several guides.
- **[O]** my observation of how these channels' videos behave, given as a default to tune. It is not a quoted rule.

Treat every number as a **default the critic can tune**, not as law. The numbers are a starting point. Final calibration should come from your own retention graphs, which several of the retention sources also recommend.

---

## 1. Cutting rhythm

### 1.1 The governing principle
- **Murch's Rule of Six, in priority order:** Emotion 51%, Story 23%, Rhythm 10%, Eye-trace 7%, 2D screen plane 5%, 3D space 4%. If a cut cannot satisfy all six, give up items from the bottom of the list first. [S]
  - Engine translation: the score for a cut point is weighted towards "does the image change when the *meaning* changes", not "is it on the beat".
- **Every cut must be motivated** (*Every Frame a Painting*, "How Does an Editor Think and Feel"). [S]
  - A motivated cut lands at the moment the viewer wants to see something that is not on screen yet. [S]
  - The editor's main control is **how long an emotion is held**: give the viewer time with an image before and after the key line. [S]
- **Pattern breaks belong at natural attention resets, not on a frantic fixed timer.** [S/P]

### 1.2 Shot-length targets (narration-led documentary)
Reference point: the average shot length (ASL) of English-language feature films fell from about 12 s (1930) to about 2.5 s (2010s), per James Cutting. [S]
Cutting also found that **each extra character or element in the frame adds about 1.5 s** to how long a shot needs to stay up. [S]
→ Rule: required hold time scales with visual density.

| Segment | Default visual-change interval | Notes |
|---|---|---|
| Cold open / hook (0–30 s) | **1.5–3 s per visual change** [O/P] | Tightest density. One retention guide: change something every 10–15 s *at minimum* (angle, zoom, B-roll, text). [S] |
| First drop-off zone (25–35 s) | Place a deliberate **pattern interrupt** (new visual mode, music change, or reveal) [S] | Retention guides name this as the first big drop-off point. |
| Body, information-dense | **3–6 s ASL** [O] | Harris, Vox and Polymatter feel. One analysed one-minute Harris scene contained **18 clips, about 3.3 s average**. [S, weak source] |
| Body, atmospheric (Nexpo, Neo, LEMMiNO) | **6–12 s holds allowed**, *if the camera is moving* (slow push or drift) [O] | Slow channels change the *frame* rarely but never freeze. |
| Emotional or reveal beat | **Hold 1.5–4 s longer** than the information rate after the key line [S: EFAP "time to watch faces"] | Let it land. |
| Major pattern interrupt | **Every 30–60 s** in the body; retention guides range from 8–40 s (tighter early, wider later) [S] | Change of *mode*: map → archive → talking head → 3D → black screen with text. |

**Hard rules for the engine:**
1. **No static frame longer than 4 s.** A slow push or parallax counts as motion. A still image with no transform does not. [O/P]
2. **No identical visual mode for more than 20–25 s** (for example, four photo-pans in a row). [O/P]
3. **Some visual change ("picture event") within each spoken clause.** At about 150 wpm that is roughly every 2–4 s. A picture event is a cut, a new layer arriving, a text pop, a highlight or a camera move starting. [O]
4. **Rhythm should vary.** Avoid metronomic cutting. Alternate runs of quick cuts with one longer hold. Murch calls rhythm "how long or short, fast or slow" shots are; EFAP quotes him on rhythm as a large part of editing. [S]

### 1.3 Where exactly to cut (relative to the voice)
- **Cut on the stressed or keyword syllable, slightly before it.** The image of "Saigon" should be on screen when the word "Saigon" is *heard*, so cut 2–6 frames before the word's onset. Picture change takes a moment to perceive. [O/P]
- **Cut at clause boundaries or in breaths for topic changes.** Cut on the stressed word for *illustrations* of a noun. [O]
- **Cut before the sentence ends, not after.** Bring in the next idea's visual during the last 0.3–0.8 s of a sentence, the visual equivalent of a J-cut. This produces forward momentum. [O/P]
- **Do not cut mid-word or through an audio transient.** That breaks the sound and reads as a mistake. [S]
- **Pauses:** trim dead air in the VO. Ali Abdaal-style editing minimises pauses because they "sound odd". [S] **Keep intentional pauses** of 0.5–1.5 s before reveals (see §2.4).

---

## 2. Sync: picture ↔ voice ↔ music ↔ SFX

### 2.1 Hierarchy of timing authority
**VO first.** Kurzgesagt: "the voiceover provides the timing for the animation team". [S]
Artlist advises editing all the VO first "so that you have a foundation for the full video". [S]
Engine order:
1. VO with word timestamps
2. Visual beats placed on words
3. Music edited so that its phrases fit the VO structure
4. SFX placed on visual events
5. Mix

### 2.2 Word-level hit rules
- **Noun → image.** When a concrete noun (place, person, document, number) is spoken, its visual must be present by the start of the word, ideally 2–6 frames before. [O]
- **Number → text.** Spoken figures appear as on-screen numerals at the same time, or count up during the phrase and land on the final value as the number is said. [O]
- **"This" or "here" → highlight.** Deictic words ("this line", "right here") trigger a circle, underline, arrow or map highlight that starts animating **on** the word. [O]
- **Text animation completes on the stressed syllable.** Start the motion 6–10 frames before the word so the type has *arrived* when the word lands. Adobe's map tutorial uses label scale-ins over about a dozen frames. [S]

### 2.3 J-cuts, L-cuts, sound bridges
- **J-cut / pre-lap:** the next scene's audio (ambience, archival clip audio, music entrance) starts **before** its picture. **L-cut / post-lap:** the outgoing audio carries over the new picture. [S]
- Typical use: smooth a scene change, build tension by letting the viewer hear what comes next, compress time with music or ambience. [S]
- Method: make a straight cut, settle the pacing, then split the audio. Use **constant-power crossfades** on split audio. [S]
- No source gives a standard frame count. Engine defaults [O]:
  - Ambience J-cut lead: **0.5–1.5 s**.
  - Archival-voice J-cut lead: **0.3–1.0 s**.
  - L-cut tail of ambience or music: **0.5–2 s**, faded.

### 2.4 Silence, risers, drops, reveals
- **Riser → hard stop → silence → reveal.** A riser that stops dead at its peak leads into the cut, and the silence after it does the work. Use silence when the new shot needs air and a hit when it needs weight. [S]
- **Silence before a reveal:** pull music to near zero for **0.3–1.0 s** before the key line or image, then bring in the reveal with a sub-drop or music downbeat. [O]
- **Music drops on structural turns:** the act-change line or the thesis statement. Align the musical downbeat with the cut to the new section. [S/P]
- **Use the music's ending deliberately.** Arrange the music so its final downbeat lands **after** all the dialogue. [S]

### 2.5 Cutting to music
- **Cut on downbeats**, not on arbitrary beats. In montages, cut every **2 or 4 beats**, not on every beat. The strongest points are bar starts and the end of a **4-bar phrase**. [S]
- **One frame before the beat is common and often looks better.** One frame late is widely disliked, except to create unease on purpose. [S]
- Cut on the frame that *contains* the beat, not the nearest frame (vendor claim; treat as weak). [S]
- **Narration-led videos:** the voice outranks the beat. Snap a cut to a beat only if the beat falls within **±4 frames** of the speech-driven cut point. Otherwise keep the speech-driven point. [O]
- Hold shots across a phrase when the moment calls for it. Strong edits follow phrases, drops and energy shifts, not every beat. [S]

### 2.6 The "1 frame early" family (engine constants) [O/P]
| Event | Offset relative to its trigger |
|---|---|
| Picture cut vs. spoken keyword | −2 to −6 frames (cut earlier) |
| Picture cut vs. music downbeat | 0 to −1 frame |
| Whoosh peak vs. cut | peak on the **first frame of the new shot** [S] |
| Impact or hit SFX vs. object landing | 0 frames (same frame) |
| UI tick vs. text or element appearing | 0 to +1 frame |
| Riser end vs. cut | riser ends **on** the cut, followed by 0.3–1 s of silence or a hit [S] |

---

## 3. Layering ("lồng ghép") and composition

### 3.1 The Harris / Vox / Magnates stack, back to front
1. **Base texture / background:** paper, cardboard or desk surface, dark gradient, or blurred map. Johnny Harris leans on a tactile, film-era look; real paper and props on a desk beat purely digital 2D versions of the same things. [S]
2. **Primary media plate:** map, archival photo, document scan or footage. A photo slides in on position keyframes with eased curves, with a Gaussian blur that clears during the move. [S]
3. **Annotation layer:** highlighter strokes, circles, arrows, border strokes, redaction bars, labels. Map borders are highlighted with brush or stroke reveals. [S]
4. **Text layer:** quote pull-outs, dates, numbers, names.
5. **Overlay / grade layer:** film grain, dust, light leaks, paper texture in Multiply or Overlay blend, vignette. Grain plus black-and-white treatment gives a vintage feel. [S]
6. **Frame layer (optional):** projector frame, newspaper-clipping border, polaroid edges. MagnatesMedia-style work uses newspaper clippings with B&W overlays and kinetic type synced to VO. [S]

### 3.2 Depth composition (FG / MG / BG)
- **Three planes minimum** for convincing 2.5D: foreground, midground, background. [S]
- Default parallax ratio [O]: BG moves **0.3–0.5×**, MG **1×**, FG **1.3–2×** of the camera translation. FG elements (blurred paper edge, plant, desk object, vignette shape) should be soft and dark.
- Pick photos with clear subject/background separation and enough resolution. [S]
- Cutting's finding again: more elements means a longer hold (+about 1.5 s per added element). [S] Do not add more than **3 new elements per shot** without increasing the hold.

### 3.3 Reveal by masking
- **Map reveal:** an animated shape mask expands from the point of interest, scaled to mimic a zoom-out. [S, forum inference] Alternatively, a hidden, rotated, partly off-screen map is revealed by a match-and-move, then pushed in on the area of interest. [S]
- **Document reveal:** a highlighter wipe runs left→right over the key sentence *in time with the VO reading it*. Everything else dims to 40–60% opacity. [O]
- **Photo reveal:** blur→sharp, plus a scale from 105%→100% or a slide-in with ease. [S]
- **Rule:** a masked reveal must finish **by** the spoken payoff word, not after it. [O]

### 3.4 Source-type mixing
- Rotate source types so the viewer feels evidence piling up. A good default for a 30–60 s segment: map → archive photo → document → data / text → archival footage or 3D. [O]
- **Evidence styling:** documents keep their paper look (texture, slight rotation of ±1–3°, drop shadow). Coffeezilla, Harris and Magnates all treat a screenshot or document as a physical object on a surface. [O]
- Kurzgesagt-style consistency: build reusable, modular assets. On average Kurzgesagt draws about 200 illustrated panels per video, splits them into many parts and animates them in AE. [S, secondary]

---

## 4. Transitions

### 4.1 Meaningful (prefer)
| Transition | When it carries meaning | Implementation notes |
|---|---|---|
| **Straight cut** | Default for most changes. Invisible. | 80–90% of all transitions. [O] |
| **Match cut / graphic match** | Two ideas share shape, colour or motion (circle→circle, map border→document edge) | Planned at script stage; often more noticeable than a normal cut. [S] Can add a short dissolve. [S] Harris uses a *text match-cut*: the word stays in place while the background changes. [S] |
| **Zoom-through / map dive** | Moving in scale: globe → country → city → street → photo of a building | Google Earth Studio camera + AE tracking (Vox/NFS tutorial) [S]. Ease in-out, 1–2.5 s. |
| **Push through texture / object** | Going "into" a document, screen or window | Scale the plate past 300% into a texture region, then cut on the blur. |
| **Wipe by object** | A foreground element (person, car, paper sheet, hand) crosses the frame | Clean, motivated wipe. [S: Star Wars example] |
| **Morph / transform** | One data form becomes another (bar → map region; number → icon) | Only when the two forms are *the same data*. |
| **Whip pan** | Fast jump between places or times | Max 6–10 frames of motion blur. Must have a whoosh. [O] |
| **Hard cut to black, or silence** | Before a reveal or chapter break | 0.5–1.5 s. [O] |
| **Dissolve** | Passing time, memory, a soft ending | Slow and smooth if gentle; a straight cut if dramatic. [S] |

### 4.2 Considered cheap (avoid or ration)
- Preset wipes (star, clock, page curl, cube spin, 3D flips). No source names them, but they appear in no reference channel. [O]
- **Unmotivated** whip pans, glitches, zoom punches on every cut. The heavy-SFX, punch-zoom short-form style "has been cloned so heavily that thousands of videos now look exactly the same". [S]
- Transitions that **outlast their meaning**: anything over about 1 s that is not a geographic or scale journey. [O]
- Linear (un-eased) motion on any transition. "Linear motion reads as cheap." [S, opinion]
- **Budget:** no more than **1 stylised transition per 20–30 s** in the body. Everything else is a cut or an in-frame change. [O]

---

## 5. Camera language in 2.5D

| Move | Meaning | Default parameters [O unless noted] |
|---|---|---|
| **Slow push-in** | Attention, gravity, "listen to this" | 100%→108–115% scale over the whole shot (4–10 s). Ease-in-out or constant with soft ends. |
| **Slow pull-out** | Context, "this is bigger than you thought", endings | 115%→100% over 5–10 s. |
| **Lateral drift / parallax** | Atmosphere, a photo "feels alive" | 2–5% of frame width across the shot. Layer ratios as in §3.2. "3D Ken Burns" / depth-based parallax can be automated. [S] |
| **Crash zoom / snap zoom** | Punchline, shock, emphasis on one detail | 6–12 frames, with an ease-out overshoot of 2–4%. Plus an impact SFX. **Max about 1 per minute.** |
| **Rack focus (2.5D)** | Moving attention between planes (photo in BG → document in FG) | Gaussian blur swap over 12–20 frames, with a slight scale change on the newly focused plane. |
| **Handheld drift** | Documentary realism, tension, "found footage" (Nexpo, Coffeezilla) | Perlin noise, 0.3–1.0% translation, 0.2–0.5° rotation, at 0.2–0.5 Hz. Never on text-reading frames. |
| **Hold still** | Reading a document, absorbing a number, a shocking image, a silent beat | Use when the viewer must **read**, or when stillness *is* the statement. A still frame still gets micro-motion (≤1% push) unless the stop is meant to be felt. |

**Rules:**
- **One camera idea per shot.** Do not combine push + rotate + drift + parallax all at full strength. [O]
- **Continuity of camera direction** across a sequence. A series of pushes should all push. Reversing direction signals a turn in the argument. [O]
- **Camera speed follows music energy.** Slow beds get slow moves. Drops and act turns earn crash zooms or a hard push. [O]
- Map moves: start close on the subject and slowly pull out to context, or the reverse for a dive. [S]

---

## 6. Sound design layers

### 6.1 Layer stack, with relative levels
Targets [S]:
- Dialogue-led web video: about **−16 LUFS integrated, −1 dBTP**. Creator content may go to −14 LUFS for mobile.
- Dialogue is the spine, at about **−18 to −16 LUFS short-term**. Music sits under it; effects punctuate rather than compete.

| Layer | Default level relative to VO | Notes |
|---|---|---|
| **VO** | 0 dB (reference) | Compressed, consistent. Trim breaths to −10 to −15 dB, do not delete them all. [O] |
| **Music bed under VO** | **−15 to −22 dB below VO** while speaking; duck **6–12 dB** from its gap level, **attack 30–80 ms, release 250–700 ms** [S for duck/attack/release; O for absolute offsets] | Rises in the VO gaps. Can swell to −6 dB under VO in silence/montage. |
| **Room tone / ambience** (city, rain, crowd, archival hiss) | −25 to −35 dB under VO | Never true digital silence, except the intentional pre-reveal "silence", which is really very low room tone. [O] |
| **Whooshes / swishes** | −10 to −18 dB under VO peak | Peak on the first frame of the new shot. Start before the cut. Length matches the motion it covers: about 1.5–3 s for a simple move, 4–6 s for a big build. [S] |
| **Impacts / hits / sub-drops** | −6 to −12 dB under VO peak; sub under 60 Hz | On reveals and crash zooms. Max about 1–2 per minute. [O] |
| **UI ticks, clicks, pops, typewriter** | −18 to −26 dB under VO | One per element appearance. Ali Abdaal adds a subtle SFX "whenever something appears on screen". [S] Vary the pitch ±1–2 semitones to avoid sounding mechanical. [O] |
| **Foley on media** (paper slide, page flip, photo drop, pin on cork, marker squeak, projector) | −15 to −24 dB under VO | Harris-style photo slide-ins use an old projector SFX. [S] Paper sound on every document entrance. [O] |
| **Risers** | Build from inaudible to about −8 dB under VO; stop dead | Into reveals and chapter turns. [S] |

### 6.2 Principles
- **Every visual event that implies physical motion gets a sound.** Things that are just "there" do not. [O; S for Abdaal]
- **SFX should be felt, not noticed.** If a test listener can *name* more than 2–3 SFX per minute, the mix is too hot. [O]
- **Bespoke score matters.** Kurzgesagt says "you wouldn't guess what a difference this step makes" for music and SFX. [S] For library music, edit to phrase boundaries; do not loop blindly.
- **Use silence as an instrument:** before reveals, after a shocking statement, at chapter cards. [S/O]
- **Horror and mystery channels (Nexpo, Neo):** localised, specific sound events direct attention and frighten. Low drones, sparse hits, long reverbs. Fewer SFX, more ambience. [S: horror trailer research; O]

---

## 7. On-screen text: hierarchy, quantity, motion

### 7.1 Reading budget
- Subtitle research: **12–14 characters/s** is a comfortable default (about 145–180 wpm). A two-line, roughly 37-char/line subtitle needs about **6 s**. The hard maximum is around **17–21 cps**. On-screen durations are **2–5 s** (BBC) to **1–7 s** (Netflix). [S]
- **Viewers are listening to VO at the same time**, so text that is *not* spoken must be **short**. [O]
  - **Non-spoken text: 1–6 words.**
  - **Spoken-verbatim text** (a quote being read) can be longer, because the voice paces the reading.
- **Hold time = max(1.2 s, characters / 12 s) + 0.5 s**, plus extra if the text arrives with a complex image. [S-derived formula]
- **One text focus per frame.** At most 1 headline + 1 supporting label + small labels on a map. [O]
- Test: "if viewers must read twice, the graphic has failed." [S]

### 7.2 Hierarchy
1. **Primary** (key number, name, date): largest, highest contrast, often in the accent colour.
2. **Secondary** (context, units, source): 40–60% of the primary size, lower contrast.
3. **Tertiary** (source credit, "Source: World Bank 2023"): small, bottom corner, ≥ 2.5% of frame height. [O]
- Contrast: high text/background contrast, generous line spacing, short lines. [S] Behind text over photos, use a dark scrim (30–60%) or a solid card. [O]
- **Safe area:** keep text inside the 90% title-safe zone. Avoid the bottom 15% where YouTube's UI and captions sit. [O]
- **Highlight the spoken word in a quote** (marker colour sweep) as the VO reads it. Harris, Vox and Coffeezilla all use this. [O]

### 7.3 Typography motion
- **Easing:** symmetric ease-in-out, for example cubic-bezier(0.66, 0, 0.34, 1). Linear motion looks mechanical. [S]
- **Durations** (UI-motion reference: about 200 ms exits/fades, about 400 ms entrances [S]) at 30 fps [O]:
  - Text in: **8–14 frames**. Label scale-ins over about a dozen frames. [S]
  - Text out: **6–10 frames**, or a hard cut-out on the shot change.
  - Per-word stagger: **2–4 frames**. Per-character stagger: **1 frame** (headlines only).
- **Motion vocabulary:** stay to 2–3 entrance styles per video (fade + 10–20 px rise; mask wipe; scale 90→100%). Consistency signals quality. [O]
- **Numbers count up** over 0.5–1.5 s with an ease-out, landing on the spoken value. [O]
- Avoid bouncy or elastic text in serious documentaries. Keep overshoot under 3%. [O]
- Accessibility: keep motion purposeful and avoid flashing. [S]

---

## 8. Automated critic checklist

### 8.1 Per beat (one beat = one VO sentence or clause, about 2–8 s)
**Sync**
- [ ] Every concrete noun, number or name in the VO has a matching visual on screen by word onset (−2 to −6 frames). Flag any miss greater than +3 frames late.
- [ ] Spoken numbers appear as text or count up, landing on the spoken value.
- [ ] Deictic words ("this", "here", "look at") trigger a highlight or annotation on the word.
- [ ] Text and mask reveals **finish** by the payoff word.

**Cuts**
- [ ] The cut point sits on a word boundary or breath, never mid-word or through an audio transient.
- [ ] If music has a downbeat within ±4 frames of the cut, snap to beat −1 frame. Otherwise keep the speech cut.
- [ ] The cut is motivated: the new image answers or advances what was just said (semantic similarity of VO segment ↔ asset tags above threshold).

**Picture**
- [ ] Some motion or picture event occurs at least every 4 s (cut, layer arrival, camera move, highlight).
- [ ] At most one dominant camera move per shot. Shake is off when text is being read.
- [ ] No more than 3 new elements in a shot. Hold time is +1.5 s per element beyond 2.
- [ ] Text hold ≥ max(1.2 s, chars/12) + 0.5 s. Non-spoken text ≤ 6 words. One primary text focus.
- [ ] Text sits within title-safe and outside the bottom 15%, with contrast ≥ 4.5:1 or a scrim.
- [ ] Easing is non-linear on every keyframed property.

**Audio**
- [ ] Each physical-motion event (slide, drop, whip, zoom, page) has an SFX at the right offset (whoosh peak on the first frame of the new shot; impact at 0; tick at 0/+1).
- [ ] Music is ducked 6–12 dB under VO, attack 30–80 ms, release 250–700 ms.
- [ ] No SFX louder than VO peak −6 dB.

### 8.2 Per minute
- [ ] **ASL** is in band: hook 1.5–3 s; info body 3–6 s; atmospheric 6–12 s *with camera motion*. Shot-length variance > 0, so it is not metronomic (coefficient of variation ≥ 0.35).
- [ ] **≥ 2 visual modes** used (map, archive photo, document, data, text card, footage, 3D, presenter). No mode runs for more than 25 s.
- [ ] **≥ 1 pattern interrupt** (mode change, music change, silence, reveal). The first one falls between 25–35 s.
- [ ] **Stylised transitions ≤ 2/min.** Zero preset wipes. ≥ 80% of transitions are straight cuts or in-frame changes.
- [ ] **Crash zooms ≤ 1/min; impacts and sub-drops ≤ 2/min; risers ≤ 1/min**, each tied to a scripted reveal.
- [ ] **SFX density:** UI ticks and foley 5–20/min (info-dense) or 2–8/min (atmospheric). Nameable "featured" SFX ≤ 3/min.
- [ ] **Music:** cuts at section changes land on a bar or phrase boundary. The bed changes or evolves at least every 60–120 s. Its final downbeat comes after the last VO line in the section.
- [ ] **Silence:** at least one breath of ≥ 0.5 s of VO silence on screen per 60–90 s (reveals, chapter turns).
- [ ] **Text load:** total on-screen non-spoken words ≤ about 40/min. No two consecutive shots are text-only cards.
- [ ] **Loudness:** segment short-term −18 to −14 LUFS. Final master −16 to −14 LUFS integrated, −1 dBTP.
- [ ] **Style consistency:** ≤ 3 typefaces (ideally 2), ≤ 3 text entrance styles, one grain/texture treatment, palette consistent with the section.

### 8.3 Per video (structural)
- [ ] The hook delivers a visual "promise" within 5 s, with the strongest image or reveal teased.
- [ ] Each act opens with a scale move (map dive or pull-out) or a title card, plus a music change.
- [ ] Emotional climax: longest hold, sparsest mix, then a release.
- [ ] Recurring motifs (the same map, document or character) return as match cuts. Planned callbacks get a match cut.

---

## 9. Channel signatures (quick reference) [O, with S where marked]

| Channel | Signature to emulate |
|---|---|
| **Johnny Harris** | Tactile desk/paper collage, GEOlayers maps with stroke-reveal borders [S], marker highlights, photo slide-ins with blur and projector SFX [S], text match-cuts [S], very dense picture events (about 3 s ASL) [S weak]. |
| **Vox (Fong, Edwards)** | Data viz + animation + sound design + narration fused [S]; Google Earth Studio map dives [S]; clean labels; archival on textured cards. |
| **LEMMiNO** | Minimal, precise typography; long, slow camera moves on darkened archival; sparse, deliberate sound; self-composed music driving structure; very low transition count. |
| **Kurzgesagt** | VO-timed animation [S]; custom score + SFX (Epic Mountain) [S]; 2D flat + 3D [S]; constant micro-motion; every element animated. |
| **Wendover / Polymatter** | Explainer maps and diagrams, steady 3–5 s cadence, restrained SFX, clear data hierarchy. |
| **MagnatesMedia** | Cinematic music-led storytelling, newspaper clippings, B&W overlays, kinetic type synced to VO [S]; strong risers and drops at act turns. |
| **Coffeezilla** | Evidence-board look: screenshots and documents as objects, highlight sweeps, a virtual-production set with camera tracking [S]. |
| **Fern** | Re-enacted 3D scenes (reportedly Blender-style low-poly) [S weak], slow cinematic cameras, ambient-heavy mix. |
| **Nexpo / Neo** | Long holds with slow push and drift, darkness, grain, drones, sparse localised hits; silence as tension. |
| **Bloomberg Quicktake** | Fast news cadence, bold lower-thirds, bold data callouts, footage-first. |
| **Captain Disillusion** | Comedy timing via precise SFX hits and match transitions (Edgar Wright-like visual comedy: framing gags, perfectly timed sound effect, action synced to music [S]); Blender VFX. |

---

## Sources
- Kurzgesagt – Our video process: https://kurzgesagt.org/youtube/
- Kurzgesagt soundtrack / Epic Mountain: https://kottke.org/18/01/the-soundtrack-to-kurzgesagt
- "How to make a Kurzgesagt video in 1200 hours" (transcript copy): https://www.lingq.com/en/learn-english-online/courses/689474/how-to-make-a-kurzgesagt-video-in-120-4887128/
- Kurzgesagt process summary: https://gist.ly/youtube-summarizer/how-kurzgesagt-creates-videos-1200-hours-of-science-art
- Vox black hole video (Joss Fong): https://www.theopennotebook.com/2020/01/07/videogram-how-a-vox-video-explains-the-science-behind-the-first-photo-of-a-black-hole/
- Former Vox journalists on YouTube: https://thelongstory.substack.com/p/why-the-best-journalists-on-youtube
- Motion Array – Johnny Harris-style documentary tips: https://blog.motionarray.com/learn/premiere-pro/edit-documentary-in-premiere-pro/
- Johnny Harris-style editing in CapCut (18-clip breakdown): https://gist.ly/youtube-summarizer/master-johnny-harris-style-editing-in-capcut
- RNDR – tactile visuals (Harris): https://rndr.beehiiv.com/p/5-visuals-next-video-ead0
- Adobe forum – Harris mask reveal: https://community.adobe.com/t5/after-effects-discussions/how-does-johnny-harris-do-this-mask-reveal-animation-in-after-effects/td-p/15191636
- Johnny Harris maps in After Effects: https://glasp.co/youtube/GsojLuJpe_0
- GEOlayers masterclass: https://boonelovesvideo.teachable.com/
- No Film School – Vox-style map animations: https://nofilmschool.com/how-create-vox-style-map-animations-after-effects
- Adobe – map animation tutorial: https://www.adobe.com/learn/after-effects/web/map-animation
- Canva map reveal note: https://lilys.ai/en/notes/map-animation-20260119/vox-style-documentary-canva
- Murch Rule of Six: https://nofilmschool.com/2016/11/6-rules-good-cutting-according-oscar-winning-editor-walter-murch ; https://filmdaft.com/walter-murchs-rule-of-six-the-editors-formula-for-choosing-the-right-cut/
- Every Frame a Painting – How Does an Editor Think and Feel: https://nofilmschool.com/2016/05/inside-mind-editor-how-do-they-know-when-cut ; https://kottke.org/16/05/how-do-you-know-when-to-cut
- Every Frame a Painting – Edgar Wright visual comedy: https://www.moviemaker.com/edgar-wright-visual-comedy-video/ ; https://openculture.com/2015/05/the-art-of-making-intelligent-comedy-movies.html
- James Cutting – shot length research: https://pmc.ncbi.nlm.nih.gov/articles/PMC3485803/ ; https://www.nationalgeographic.com/culture/article/100225-foxnews-science-of-hollywood-films-chaos-theory ; https://flowingdata.com/2014/09/22/evolution-of-movies/
- Retention editing: https://air.io/en/youtube-hacks/advanced-retention-editing-cutting-patterns-that-keep-viewers-past-minute-8 ; https://pixflow.net/blog/?p=93140 ; https://blog.autonolab.com/blog/2025-10-01-pattern-interrupts-resetting-attention-every-30-seconds/ ; https://island-salto-f5b.notion.site/The-YouTube-Retention-Playbook-3227add0746481158ae2db80fef6b959 ; https://www.gofaceless.ai/en/blog/optimize-video-engagement-pattern-breaks
- J-cut / L-cut: https://en.wikipedia.org/wiki/J_cut ; https://www.epidemicsound.com/blog/j-cuts-and-l-cuts/ ; https://filmdaft.com/?p=36396
- Sound bridges / pre-lap: https://www.studiobinder.com/blog/what-is-a-sound-bridge-definition/ ; https://filmdaft.com/what-is-a-sound-bridge-in-film-definition-and-transition-guide/ ; https://filmlifestyle.com/what-are-pre-lap-sounds-with-examples-tutorials/ ; https://eshop.macsales.com/blog/83936-how-to-make-sound-bridges-in-premiere-pro/
- Cutting on the beat: https://community.adobe.com/t5/video-lounge-discussions/editing-with-music/m-p/12801378/highlight/true ; https://www.eoshd.com/comments/topic/46696-editing/ ; https://framia.converge.ai/page/en-US/blog/beat-sync-ai-music-video ; https://spliceapp.com/blog/what-video-editors-optimize-timing-with-music
- Music editing to picture: https://licensing.routenote.com/blog/?p=9560 ; https://artlist.io/blog/how-to-add-music-to-a-video/
- Whoosh / riser timing: https://morphic.com/resources/sounds/transition-sound-effects ; https://morphic.com/es/resources/sounds/whoosh-sound-effect
- Ducking: https://www.capcut.com/create/audio-ducking-for-clear-dialogue-in-video ; https://manual.audacityteam.org/man/auto_duck.html
- Loudness: https://josephnilo.com/blog/dialogue-loudness-lufs-true-peak-video/ ; https://hackernoon.com/how-to-master-ai-generated-film-audio-for-youtube ; https://tech.ebu.ch/docs/r/r128s4.pdf ; https://forum.shotcut.org/t/video-volume/24529
- Ali Abdaal editing notes: https://notes.dsebastien.net/30+Areas/32+Literature+notes/32.02+Content/Video+editing ; https://www.choppity.com/tools/recreate-video-editing-style/ali-abdaal/
- Match cuts / transitions: https://www.soundstripe.com/blogs/how-to-use-match-cuts-in-film-and-video-editing ; https://borisfx.com/blog/what-is-a-match-cut/ ; https://www.miracamp.com/learn/video-editing/different-types-of-transitions-film
- 2.5D parallax: https://petapixel.com/2013/11/19/creating-motion-stills-animate-photo-post-parallax-effect ; https://petapixel.com/2017/08/09/give-still-photos-2-5d-parallax-effect-photoshop/ ; https://boingboing.net/2019/09/16/3d-ken-burns-effect-on-standar.html ; https://ecampusontario.pressbooks.pub/app/uploads/sites/432/2019/04/KOSLOSKI_Figure-5.5.pdf
- Subtitle reading speed: https://support.limecraft.com/en/support/solutions/articles/48001249679 ; https://revistas.uma.es/index.php/trans/article/view/3210 ; https://dev-avt.ckc.uw.edu.pl/wp-content/uploads/sites/170/2016/12/Report_Survey2_SURE.pdf
- Motion/typography easing: https://brandhub.heidelbergmaterials.com/node/229 ; https://framosynthcomm.lovable.app/blog/kinetic-typography-that-does-not-distract ; https://design.ruttl.com/motion
- MagnatesMedia-style descriptions (freelancer): https://fiverr.com/khixoxd/create-youtube-cashcow-videos
- Coffeezilla virtual production: https://mo-sys.com/news/coffeezilla-takes-a-look-at-startracker-max/
- Fern channel: https://www.pluggedin.com/youtube-reviews/fern/
- Captain Disillusion: https://en.wikipedia.org/wiki/Captain_Disillusion
- Horror trailer sound design: https://acta.sapientia.ro/content/docs/the-soundtrack-of-the-sinister-trailer-.pdf
- Grain overlays: https://www.flexclip.com/create/grain-video.html
