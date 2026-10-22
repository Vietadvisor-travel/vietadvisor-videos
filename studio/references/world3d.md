# WORLD3D — cinematic 3D world (Oct 2026)

Why: the user rated the 2D explainer format 6/10 — "too static, looks like infographics, not animation". The fix is a real
camera in a real (toon-shaded) world: flights, dives, orbits, worm's-eye traffic, depth of field, and actions happening
where the camera goes. `engine/library/world3d.js` (three.js r160, renders headless on SwiftShader, ~0.3–0.6 s/frame at 1080p).

## The world
One Hà Nội-style street: 2 rows of tube houses (balconies, AC units, shop signs in Vietnamese, awnings, warm interiors),
trees, wires with lanterns, 18 scooters with riders moving in 5 lanes, a bánh mì cart, a stool café, a phở stall, a bia hơi
corner, a hotel lobby café. Time of day per beat: `time=dawn|day|sunset|night` (sky, fog, sun, lit windows, glowing lanterns).

## Beat
`# w3 at=<POI> cam=<move> act=<action> time=… head="MAIN|sub" tags="poi:TEXT:sub:at|…" out=push travel=.9 dof=.6 shake=.02`
- POIs: `street cart board cafe cup pho bowl biahoi hotel money sky`
- cam: `push pull orbit crane drop macro low top track chase dollyzoom reveal hero curb`
  (`hero` = 3/4 high food shot with slow orbit; `curb` = lens on the kerb, scooters stream past; `drop` = dive from rooftops).
- act: `banhmi pho coffee money cheers traffic none` (+ `parts=` for banhmi/pho build, `full=1` = finished bowl).
- **Travel**: every w3 beat after the first starts with a camera flight from the previous beat's final pose (arced, with speed
  streaks) → the film reads as one continuous take. `travel=0` = hard cut.
- `out=push` rushes the lens into the subject in the last 0.45 s → pair with a following `# vis … in=zoom` for a zoom-through
  into a detailed 2D insert (e.g. the cart → the bánh mì being built).
- `tags=` pins price chips to 3D points (projected every frame). HEAD headline + fixed captions as in vis.
- Depth of field is automatic per move (strong on hero/macro, light on wide); `dof=0` turns it off.

## Directing rules
1. Open in the world with a big move (drop / crane / curb) — never on a static card.
2. Alternate scale: wide world move → close action → zoom-through to a 2D detail insert → back out with a flight.
3. Every beat has a camera move AND something moving in frame (traffic, steam, drips, falling notes, clinking glasses).
4. Time of day carries the day's story (dawn → day → sunset → night) — change it on act turns.
5. New place in a script? Add a POI + set to world3d.js (`WD.<name>`), never fall back to a talking character.
