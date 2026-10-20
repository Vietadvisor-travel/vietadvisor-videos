# Visual Bible — the 8 elements of a Poison Pill frame

Derived from the MagnatesMedia "Rockefeller" thumbnail/edit language and the owner's brief:
"trực quan và sống động từng giây, từng khung hình". Each element lists the rule, the engine setting that
delivers it, and the failure it prevents.

## 1. Depth — three planes, always
| Plane | What | Treatment | Engine |
|---|---|---|---|
| **BG** (far) | context: the city, the factory, the oil field, the trading floor, the HQ | blur 8–12 px, brightness −40…−50 %, toned to the act; full frame but ~60 % covered by MID/type; silhouette only | `bg=<plate id> bgBlur=10 bgDim=.45` (tone auto per act, override `bgTone=navy|gold|teal|red|duo|bw`) or a procedural set `bg=navy|paper|news|chart|black|spot` |
| **MID** (subject) | the person(s) or the main object | cut-out, BW or duotone, contrast +20 %, **white border 6–8 px**, baked drop shadow; 40–60 % of frame height; on a third | `mid="id;x:.3;h:.6;tone:bw;at:<word>;lab:NAME"`; props as subject: `mid="@phone;…"` |
| **FG** (near) | symbolic objects: cash, coins, a contract, the product, the pill | bottom 20 % of the frame, saturated colour that contrasts the BG; never covers a face | `fg="@cash;x:.8;y:.97;h:.17;at:<word>"` or a cut-out photo id |
Parallax is automatic (BG depth 1, MID 2–2.7, type 2.4, FG 3+). A frame with fewer than 3 planes is a deliberate choice (`solo=1`) — e.g. one red word on black before the collapse.

## 2. Colour that tells the story
Palette: **Navy `#101c2e`** (power, secrecy) · **Gold `#c9a227`** (money, ambition) · **Paper `#f5f1e8`** (documents, the past) · **Red `#c0392b`** (crisis ONLY) · **Teal `#2a6b5e`** (flashback, doubt).
Rule: ≤ 3 main colours + 1 accent per frame. The colour script follows the story:
| Act (`act=`) | Mood | Grade the engine applies | Default BG |
|---|---|---|---|
| `setup` | hope, the beginning | warm soft-light, light | navy |
| `rise` | glamour, money | gold soft-light + glow on hero type; BW cut-outs pop against gold | navy |
| `doubt` | cracks, denial | teal colour wash, −25 % saturation | navy / news / chart |
| `fall` | collapse | −45 % saturation, red creeping in from the edges, stronger vignette | black |
| `after` | aftermath | desaturated navy multiply | navy |
| `flash` | flashback / the past | teal-sepia paper, flicker, ink type | paper |
| `lesson` | the verdict | navy spotlight, desaturated, one accent | spot |
Red appears in `fall/after/lesson` (and the red X strike, which is a symbol, not a mood). Elsewhere stamps are `col:gold` or `col:grey` — `pp_lint` warns otherwise. Use `fx="red;at:<word>"` to make the red creep start exactly on the word where things turn.

## 3. Typography is image
| Role | Size (1080p) | Font | Look | Motion |
|---|---|---|---|---|
| Hero (1–3 words) | 120–180 px (`size:`) | Anton (`font:impact`), Playfair Display 900 for elegant/old-money (`font:serif`) | accent colour of the act, 5 px ink stroke, drop shadow; gold glow in `rise` | **slam** 2.4→1.0 in 0.35 s + 0.3 s shake · `count` (number rolls up while slamming) · `type` (letters type on) · `to:` burn-swap (shakes red, embers, flashes into the new value) |
| Support (1 line) | 48–64 px | Oswald 700, tracked +3 | gold (paper on red frames) | fade + slide up 26 px in 0.4 s, 0.35 s after the hero |
| Caption (VO text) | 38 px fixed | Be Vietnam Pro 700 | white, ink stroke, numbers gold | never moves; bottom 10 % band; ≤ 2 lines |
| Labels | 26–30 px | Oswald 700 tracked | paper on navy plate with a gold tab | appear 0.25 s after the cut-out |
| Date cards | 64–72 px | Oswald 700 tracked +6 | paper + gold underline that draws | typed letter by letter |
| Quotes | 54–58 px | Playfair 900 | big gold “, words appear in time with the VO, attribution in gold caps | typed by word (`rate:` s/word) |
**Max 8 words on screen** (hero + support + stamps + bubbles; name labels excluded, quotes may run to 14). The hero never touches a face; its default position is the empty third opposite the main subject.

## 4. Composition
- Rule of thirds: subjects at x ≈ .25–.33 or .67–.78; faces in the top half; the hero type in the opposite third.
- Leading lines: `fx="line:1>2"` draws a gold dashed path from subject 1 to subject 2 (money flowing, a rival, an acquisition). Charts and arrows also lead the eye.
- Negative space: 30–40 % of the frame is calm (blurred BG only). If a frame is full, remove an element rather than shrinking everything.
- Two subjects = confrontation (left vs right, one flipped to face the other). Three+ = a network/market (staggered heights).
- Nothing important in the bottom 12 % (caption band) except FG objects, which may sit behind the caption.

## 5. Light
- Vignette 15–20 % (stronger, 25 %+, in `fall`).
- The grade per act (§2) is the light design: warm → gold → cold → red → grey.
- A soft dark floor gradient protects the caption band automatically.
- `bg=spot` = one top light on navy — for verdicts, quotes and the lesson.

## 6. Motion inside the frame
- Camera on every shot (`cam=`): push (importance), pull (context/emptiness), panL/panR (travel, time), tiltU/tiltD (scale, height), drift (calm), hold (only for quotes).
- Parallax: BG 1.0→1.05, MID →1.10, FG →1.15 (built in).
- Entrances: cut-outs **slap** (1.22→1 in 0.25 s) by default; `in:rise` (from below — someone rising to power), `in:slideL|slideR` (a rival arrives); FG objects drop into the band.
- Micro-life: cut-outs breathe (±0.6 %), dust motes drift, numbers roll, charts draw, red creeps. **Nothing is ever fully still.**
- `crash=<word>`: 0.18 s crash zoom on a punch word.

## 7. Transitions
- **80 % hard cut** on the first word of the next sentence (default).
- **Whip pan** (`trans=whip`) when time jumps forward or money moves fast.
- **Match cut** (`trans=match`, zoom-through) when two shots share a shape (a coin → the logo, a phone screen → the next set).
- **Flash** (`trans=flash`) only into a shock.
- Banned: fade, dissolve, cube, spin, iris, page curl, circles — the channel mode converts them to cuts.

## 8. QA checklist — every sampled frame must pass
- [ ] **3 planes** present (or a deliberate `solo=1`)?
- [ ] **Colour** tells the act (gold rise, teal doubt, red only in crisis)?
- [ ] **Type** is part of the composition (in negative space, right size, ≤ 8 words)?
- [ ] **Negative space** 30–40 %?
- [ ] **Mute test**: with the sound off, does the frame tell the story of this sentence?
- [ ] **Cinema test**: would this frame survive as a thumbnail? Or does it look like PowerPoint?
Plus technical: no face under the caption or the hero; no MISSING IMAGE placeholder (red card); nothing cropped by accident; no two consecutive frames from the same camera/bg; no dead air > 2 s.
