# Poison Pill Studio: changelog

## v6.2 (Oct 2026): footage leads, a clean frame, the YouTube kit
Owner feedback on ep. 4 (OneCoin): elements in odd places and sometimes overlapping, no burned-in captions wanted, and
not "wow" enough (sparse, not polished). Creativity matters most. Muse now sources a lot of stock video.
- **Footage streams from disk.** `role: clip` frames are no longer embedded in `images.js`; the engine loads them on
  demand, and `renderReady(t)` waits for them before each exported frame (render, sheet, layout, thumb). An LRU cache
  keeps memory flat.
- **Packing footage:** `pp_pack.py clips-export` (Muse) and multi-zip `import` (Claude). Clips are imported at 24 fps
  and 1280 px.
- **`clip(id, start, speed)`** in custom scenes: footage inside masks, phones, windows and split screens.
- **Shared stock library** (`jobs/_stock/stock_library_*.zip`, `pp_stock.py index | find | pull`): indexed by setup;
  only the clips a story uses are extracted; usage is tracked across episodes.
- **`captions: off`** in the story header removes burned-in captions for the whole act.
- **`pp_layout.mjs`:** automatic layout QA on the real drawn frame. EDGE flags type outside the 3.5 % safe area;
  OVERLAP flags type colliding with type. Annotated JPGs are written. The gate is 0 flags.
- **`pp_publish.py`:** one YouTube SRT for the whole film (≤ 42 characters a line, ≤ 2 lines, ≤ 6.5 s a cue), plus
  publish facts: chapters, credits, AI images, voices, and CC BY items missing an author.
- **`references/publish.md`:** the upload guide template, SEO rules, the altered-content decision and the checklist.
- **`final-cut.md` v6.2:**
  - the new mix: footage ≥ 45 %, AI art ≤ 20 %, drawn-only ≤ 8 %, no text-only frames;
  - the clean-frame rules;
  - the creativity gate: concept, 3 ideas, hero sequences, montage runs;
  - the ship gate on real frames.

## v6.1 "Final cut" (Oct 2026): nothing mechanical
- **`final-cut.md`:**
  - Visual mix targets: ≥ 60 % invented, templates ≤ 20 % and each ≤ 2×, AI moment art 20–40 %, real b-roll 8–15 %.
  - The BEAT TABLE with the swap test.
  - Rhythm rules: punches, montage runs, breaths.
  - The Remotion motion standard, and one motif per episode.
  - The critic watches rendered frames.
- **Custom scenes:** `spring()` (physical overshoot), `stagger()` (cascades), `wobble()` (organic drift), `mblur()`
  (motion trails).
- **Lint:**
  - rhythm variation ≥ 35 %, and no 5 equal beats in a row;
  - each template ≤ 2× per episode;
  - invented beats ≥ 60 %.
- **AI images:** moment art is allowed on up to ~40 % of beats. Real people, documents and logos stay real.
- **Muse sourcing:** 25–40 moment-art images plus element cut-outs, and 10–20 licensed b-roll clips, all in the pack.

## v6 "Ultimate" (Oct 2026): research-built, written as code, found by itself, directed voice
- **Content with real value (`story-mining.md`):**
  - Muse researches first, using a 13-section Story Mining Worksheet: 40 facts ranked by surprise, sourced numbers,
    primary documents, quotes, the 3 decision moments, the mechanism, the counterfactual, myths, takeaways, and risks.
  - Claude writes the package from that research.
  - 7 angle types and the anti-Wikipedia test; a 20-point value rubric (≥ 15 to publish); 12 episode formats that rotate.
  - `pp_history` tracks format, opening and ending, and lint warns on repeats.
- **Custom scenes as code (`pp_custom.js`, `custom-scenes.md`):**
  - The director writes a beat's animation as a function of time, in the story file (`#! scene … #! end`).
  - API: word timing `at()`/`p()`, layers with depth and camera, real images, icons, text, counters, lines, atmosphere,
    seeded randomness and noise.
  - Anything the sentence needs, no template. Errors are drawn on the frame.
- **Images that find themselves (`pp_find.py`, `image-sourcing.md`):**
  - Searches Wikidata, Wikipedia lead images, Wikimedia Commons and Openverse.
  - Keeps only commercially reusable licences (CC0/PD/CC BY/CC BY-SA), scores the candidates, and downloads and imports
    them with credit.
  - `assets <package.md>` sources the whole §2 list and reports the gaps. Only the gaps may be generated.
- **Voice direction (`voice.py`, `voice-direction.md`):**
  - fp32 Kokoro, about 4× faster on CPU.
  - Narrator casting: names, blends (`a*.7+b*.3`), prosody mixes (`a~b*.2`), and `audition` to choose by ear.
  - Each act reads differently (the rise is quicker and brighter, the fall slower and lower, with formant-preserving
    pitch).
  - Each sentence is read by its role (a silence before reveals, a hanging question, a momentum build), with seeded
    human jitter.
  - `delivery:` sets the episode's read; `{hit}`/`{hold}`/`{low}`/`{archive}`… tags fine-tune a line.
  - Quote voices: `@speaker:` lines cast with `voices:`, with an automatic on-screen "WORDS OF … · VOICED" tag and lint
    rules for attribution.
  - Room tone and a narrator EQ on the voice track.
- **Claude Code studio mode:**
  - The installed engine is now in the repo (`studio/`), set up in about 1.5 min by `setup.sh`.
  - `pp_pack.py` moves Muse's sourced images (with catalogue and credits) and the music library to Claude.
  - `CLAUDE.md` holds the "làm tập <slug>" procedure.
- **Fixes:**
  - `[BEAT]` at the end of a line no longer merges that line with the next one; the pause is kept at the line end.
  - Act files and channel endings pass the engine lint without `--skip-lint`.
- **The WOW gate (`gauntlet.md`):** a fresh critic scores every beat on originality, clarity, life and craft. Weak beats
  get a redesign with a custom-scene sketch. The critic also checks the voice.

## v5.2 (Oct 2026): invent, don't assemble; never repeat
- **`build`** (`pp_build.js`, `build.md`): the free-form composer.
  - Elements: real images, 24 icons (singles or crowds/piles), kinetic text, counters, tags, self-drawing arrows and lines.
  - About 30 verbs on spoken words: grow, multiply, follow, crack, burn (charred, embers), explode, stamp, gray, red, spin,
    swing, fall…
  - Idle life on everything, and a sound per verb.
  - Every picture is invented from its own sentence; lint asks for ≥ 25 % of beats.
- **Per-episode motion signature:**
  - hit-word accents rotate among 7 styles (push, pull, tilt, pan) in an episode-seeded order; ~40 % of hits are left
    alone;
  - chapter transitions rotate through a look-specific pool, each at most twice per episode.
- **`pp_history.mjs`:**
  - remembers each episode's look, opening, scene types, build verbs, transitions and tracks;
  - lint warns on reused openings, looks or signature template scenes from the last 3 episodes;
  - the music picker avoids their tracks;
  - `make.mjs` records automatically.
- **Lint:** flags duplicate compositions inside an episode.


## v5.1 (Oct 2026): music, and an edit that moves
- **Music** (`pp_music.py`, `music.md`, `sound_design.py`):
  - a library of real royalty-free tracks, analysed for tempo, bar grid, energy, intro and peak;
  - `music: auto` gives each act its mood, picks a track per mood run, enters on a bar line at the cut, loops on bar
    lines, crossfades between moods, ducks under the voice, and drops out under every `[BEAT]`;
  - credits are written to `<slug>_music_used.json`;
  - the procedural score fills any mood the library lacks.
- **Hit-word punches:** every `**hit word**` in the caption gets a camera punch and a soft hit, on the word.
- **Auto re-frame:** long collage beats "cut" to a new angle at clause breaks.
- **Motivated auto-transitions:**
  - an act change gets the look's chapter transition (tear, glitch or burn; lightleak around flashbacks);
  - "But / Yet / However" lines get a whip;
  - at most one every 5 beats;
  - tear, burn, glitch, lightleak, push and portal are now allowed, while iris, slide and fade stay refused.
- **Lint:** warns when written stylised transitions exceed 2/min.
- **Grain:** now changes at 12 fps (filmic), which lets still frames be reused more often.


## v5 "Ultimate" (Oct 2026): wow script, living pictures, one film, locked to the voice
- **Research-backed craft references:**
  - `script-masterclass.md`: hooks, reveal ladder, scenes, line craft, humor, endings, the A/V script, the critic's
    scorecard.
  - `editing.md`: cut rhythm, word sync, layering, transitions, camera, sound, text, per-beat and per-minute checklists.
  - `motion.md`: easing, idle motion, parallax, atmosphere, light, grain, the cohesion grade, AI imagery.
  - `ai-images.md`: what may be generated, a style bible per look, disclosure.
- **Living pictures** (`pp_art.js`):
  - `scene`: a sharp real photo, the subject lifted with a halo and contact shadow, breathing, a foreground element,
    light sweep, sun, flicker and neon.
  - `air`: atmosphere at three depths (dust, bokeh, smoke, fog, rays, rain, snow, embers, ash, sparks, papers, bills,
    confetti, leak, lightning). The camera rig parallaxes every plane.
- **One film:**
  - every frame gets the same finish: a raised, tinted black floor, one shared key light from the top left, and animated
    grain (about 15 ms a frame);
  - the 3D desk and materials follow the look;
  - real 3D is capped at 10 % of beats, signature moments only.
- **Locked to the voice:**
  - `voice.py` writes `words.json` (real word times from the sentence audio, with phoneme weights and pauses snapped);
  - the engine times every `at:`/`@word` on it, and pictures land 3 frames before the word;
  - `[BEAT]` makes a real pause, and `(J)` marks a laugh.
- **Speed:**
  - removed the per-draw CPU blur (`ctx.filter`) from the camera rig. It made every beat with a slight defocus 3–5×
    slower, so light blur now uses the fast downscale path.
  - subject shadows are pre-baked.
- **Script lint:**
  - promise in 30 s, something new every 40 s, laughs `(J)`, ≥ 2 scenes;
  - final line ≤ 15 words, thesis ≤ 25 words;
  - no filler or hype words; lines ≤ 20 words.
- **Lint:**
  - knows `scene` and `air`, and checks their images;
  - asks for ≥ 20 % living pictures;
  - 3D ≤ 10 %.
- **Auto-director:** suggests `scene` for moments.
- **Images:** `pp_img.py add --gen` and `gen-list`, with AI images credited automatically by `make.mjs`.
- **Director package:**
  - THESIS, master loop, best fact, reveal ladder, callback plant and scenes in META;
  - A/V script marks;
  - generated-image rows;
  - an extended self-check;
  - Muse rules for generating images.


## v4.2 (Oct 2026): the look follows the content, a funnier tone, fast rendering
- **11 looks chosen by the content** (`pp_looks.js`, `look.md`):
  - dossier, noir, editorial, tech, luxury, vintage, retro, broadcast, eastern, ledger, blueprint;
  - per episode (`look:`), per act file, or per beat (`look=`);
  - each sets the backdrops, photo treatment, accent palette, act grades, vignette, map colours, the ink and card colours
    of every set piece and mode, and the 3D world light;
  - `pp_looksheet` compares looks side by side.
- **19 FAST modes** (`pp_modes3.js`, 40–110 ms a frame): isocity, isobars, coverflow, spinpaper, spotlight, units, tank,
  race, rollnum, faceoff, invoice, candles, vault, slots, outbreak, meter, calendar, papercut, flapboard.
- **Tone playful** (`humor.md`, `pp_fun.js`):
  - 10 comedy techniques for explainers;
  - photo-based comedy tools: freeze, expect, cutaway, dramatic, math, meme, aside, with caps checked by lint;
  - cartoon characters are forbidden by lint (owner rule).
- **Render speed on weak machines:**
  - the post pass is off by default;
  - frame reuse on still frames;
  - fast depth-of-field blur;
  - the world map is cached;
  - 3D at 15 fps and 0.62× (`--lite`: 12 fps and 0.5×);
  - chunked rendering on a shared queue (`--jobs`), resumable after a crash or reboot (`--resume`);
  - a watchdog per frame, `progress.json`, x264 veryfast;
  - `pp_speed` estimates render time per beat.
- **Lint and auto-director:**
  - know all 70 scene types;
  - prefer fast modes;
  - cap real 3D at 20 % (auto-director `--fast` uses none);
  - validate look names;
  - add the `depth` family.
- **Docs:**
  - new: `humor.md`, `production.md` §7;
  - rewritten: `look.md`;
  - updated: `visual-modes.md` (fast and comedy sections, decision table), `director-package.md` (look, tone, 3D cap,
    render rules), START.md, SKILL.md, INSTALL.


## v4 (Oct 2026): ideas, not collage
- **The dossier look** is the default: manila, kraft, newsprint, graph paper, warm archive prints, ink type. `look: noir` keeps the v3
  dark style. **16:9 only.**
- **Camera rig** (`pp_cam.js`): `shot=` keyframes with shot sizes framed on a subject, moves on spoken words (dolly, glide, whip,
  crash, rack, vertigo, truck, drop, rise), true per-plane parallax, dutch, low/high angle, rack focus, motion blur, handheld.
- **46 scene types in 5 families:**
  - 17 set pieces (`pp_sets.js`, `pp_modes2.js`);
  - 14 screen and diagram modes (`pp_modes.js`, `pp_modes2.js`);
  - 15 real-3D shots (`pp_3d.js`: desk, map table, globe, gallery, timeline, skyline, title, money, phone, boardroom,
    building, conveyor, pie, stacks, monitors);
  - collage;
  - maps (now in paper).
- **Tools:**
  - `pp_doctor`: proves the install and renders every family.
  - `pp_scriptlint`: script score.
  - `pp_shotscript`: the per-second visual script, with a check.
  - `pp_sheet`: beat contact sheets.
  - `pp_testimages`: imports the public-domain test photos.
- **Auto-director** picks a mode by the meaning of each sentence and won't repeat a mode within 4 beats. It writes `shot=`
  cameras.
- **Lint v4:**
  - scores ideas vs collage, camera direction, restraint (shake/flash/stamp/slam caps) and variety of scene types and
    families;
  - checks set and mode images and words.
- **Docs:**
  - new: `visual-modes.md`, `camera.md`, `shot-script.md`, `look.md`, `gauntlet.md`;
  - rewritten: `script-and-story.md`, `multi-agent.md`, SKILL.md;
  - updated: `toolkit.md`, `quality-rubric.md`, INSTALL.
- **Fixes:**
  - `pp_review` no longer crashes when `out/` doesn't exist;
  - missing images render as neutral PHOTO NEEDED cards;
  - all SFX names are verified.

## v3: 100+ collage devices, 14 tools, 60 recipes, multi-agent pipeline
## v2: maps, footage, evidence devices, scaffold, archetypes
## v1: `# cine` 3-plane beat, real-photo pipeline
