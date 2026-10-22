# Research notes (Oct 2026) — what the engine implements and why

Condensed from five research passes (cinematography, character acting, VFX/transitions, production
pipeline, Canvas rendering). Numbers are working defaults; most are industry convention.

## Cinematography
- Shot sizes are defined by where the frame cuts the body; eyes sit on the upper third (MS ≈ 0.30 H,
  MCU ≈ 0.33, CU ≈ 0.40). Lead room ≈ 0.62 of frame in front of the face (halve it in 9:16).
- 9:16 safe zone: top 15 %, sides 10–15 %, bottom 25–35 %; vertical shots are width-limited.
- Low angle = power/awe (horizon low), high = vulnerable, dutch 8–15° = unease (hold it, don't animate).
- Lens feel in 2.5D = camera distance: parallax factor p(z) = D/(D+z); wide D≈1.5, normal 4, tele 12.
  Dolly zoom: animate D, keep subject size with zoom ∝ D.
- Moves: hold 6–12 frames before/after; one dominant move per shot; push-in 3–6 s +8–20 %; reveal pull-back
  3–5 s ease-out; whip 6–10 f with blur; snap zoom 4–8 f + 3–6 % overshoot; follow = critically damped spring.
- Editing: 180° rule, 30° rule (or ≥2 shot sizes), cut on action, match cuts, establishing → medium → close.
  Average shot length: explainer 2.5–4 s, montage 1–2 s, vertical 1.5–3 s; hold 4–8 s for awe/emotion.
- Composition: thirds, leading lines (roads, rivers, cables), frames within frames (doors, lantern arches),
  FG/MG/BG depth staging, subject has the highest contrast.
- Light: one key per scene (direction drives shadows + rim); time-of-day colour scripts (dawn lavender
  shadows, noon high contrast, golden orange key/teal shadows, blue hour + lantern practicals, night rim).

## Character acting
- Second-order dynamics on every channel (f, ζ, r): ζ<1 overshoot, r<0 anticipation — "personality is
  just f and ζ" (nervous: high f low ζ; old/tired: low f, ζ=1).
- Anticipation 15–30 % of the action; overshoot 5–15 %; squash with area preservation sx = 1/√sy.
- Follow-through delays: chest 1–2 f, head 2–3, forearm 3–4, hand 4–6, hair/cloth 4–8.
- Blinks every 2–6 s, 4–6 frames, forced on head turns >30° and expression changes; eye darts lead the
  head by 2–4 f; moving holds (never freeze); talking gestures land on stressed words.
- Lip sync: Rhubarb/Hanna-Barbera shapes A–H+X; cheap path = RMS envelope → openness, mouths on 2s,
  hold shapes ≥2 frames, lead audio by 1–2 frames.
- Head turns: features slide sin(yaw·π/2)·0.4R, far eye compresses, far ear hides.
- Comedy: rule of three, 12–24 f pause before the punch, impact frame (1 f inverted) + hit-stop + shake.

## VFX & transitions
- The FG-element wipe (dark object passes the lens, cut hidden under it) is the most cinematic transition;
  J/L cuts (audio leads picture by ~0.8 s) make edits feel professional.
- Luma wipes with a texture map (noise, ink blobs) cover burn, ink bleed, watercolour; light leaks are
  screen-blended radial gradients peaking over the cut.
- FX animate on 2s/3s; toon smoke = merged circles + offset shadow band; dust/exhaust: fast expand, slow
  dissipate; rain: 3 depth layers + ground splashes.
- Rim light from alpha only: silhouette minus itself shifted away from the light; cast shadow = sheared,
  flattened silhouette; contact AO grounds everything; light wrap blends characters into the plate.
- Performance: cache static layers, do blur/bloom at ¼ resolution, avoid per-particle shadowBlur,
  render frame ranges in parallel and concat.

## Production & story
- Record VO first; animation timing follows the voice (the engine re-times captions to real audio).
- Pixar story spine (Once… Every day… One day… Because of that… Until finally…) gives each video its own shape.
- Kurzgesagt: one continuous world, visual metaphors for numbers; OverSimplified: comedic narrator,
  running gags paid off three times; Johnny Harris: map flyovers + paper-cutout photos; Ghibli "ma":
  quiet beats between dense ones.
- Retention: hook ≤3 s, open loop resolved late, re-hook every 30–60 s, payoff at 70–85 % of Reels runtime.
- Vietnam visual accuracy: tube houses 3–4 m wide with wires and signs; Hội An yellow walls + lanterns;
  pagodas with curved eaves and three-door gates (no Japanese torii / Chinese silhouettes); Cham brick
  towers; Ê Đê longhouses, Bahnar rông houses; ethnic dress only in the right region, never as a gag.
