# CRITIC x1: nike-vs-adidas, 9-act cut (a0–a8, 94 beats, fresh critic)

**Method**
- I opened all 20 sheets (frames at 0/42/72/96 % of every beat). I enlarged 8 regions 3× to check type, collisions and the safe area: a4-01, a4-05, a6-11, a7-01, a7-09, a7-11, a8-05 and a1-05.
- I read every `// CARD`, `# cine` and VO line in a0–a8, and checked every on-screen figure and VO claim against RESEARCH (F01–F40, Q01–Q08, MYTH 1–10, TRAP 1–12).
- WOW gate /8 = originality + clarity + life + craft (0–2 each). The swap test follows final-cut §6/§C. The end card (a8-b10) is not scored.
- Type size: 1 sheet px ≈ 5 px at 1080p.

## Per-beat table

The fix column is filled for every beat ≤ 4 or FAIL. A fix in brackets is optional.

| beat | /8 | swap | reason | cheap fix |
|---|---|---|---|---|
| a0-01 | 6 | PASS | The line plunges and $31.97 is final by 42 % (F34 ✓). "intraday low" is below 40 px. | (sub at ≥ 40 px) |
| a0-02 | 6 | PASS | The real 2013→2026 shape, the NOV 2021 peak and the 13-year level are all final by 42 %. | |
| a0-03 | 5 | PASS | The windows open on their words. "ONE ROOKIE" is Jordan at **Barcelona 1992** (wrong period). | (`wins:` → `nike_vs_adidas_michael_jordan_dunk_contest_1985`, the rookie season) |
| a0-04 | 5 | PASS | €1,008M is final by 42 % (F37 ✓). A flat slab on a dim aerial. "a record quarter" and "€1,000M" are about 30 px. | |
| a0-05 | 6 | PASS | The carrier bar holds, the headline is struck and FOOTWEAR 0 % is beside it. Currency-neutral is not labelled (TRAP 2). | (`b2lab:FOOTWEAR · Q3 · C-N`) |
| a0-06 | 5 | PASS | The thesis as a picture: the red row leaves and the blue row fills. | |
| a0-07 | 5 | PASS | The motif is set up. The lane labels are about 35 px. | |
| a1-01 | 5 | PASS | The real 1928 factory with a push-in. The caption is final at 72 %. | |
| a1-02 | 7 | PASS | The camera travels to the real sign and a gold frame lands on it. The best beat of the act. | |
| a1-03 | 4 | PASS | All 4 medals are down by 42 % (fixed). **The VO is broken:** "In nineteen thirty-six, At the Berlin Olympics of nineteen thirty-six…". There are no spikes and no Owens. The AI workshop shows a seated male figure who can be read as a Dassler. | VO: "At the Berlin Olympics of nineteen thirty-six, Jesse Owens wins four gold medals in their spikes." Add `dim:.55` so the figure is not readable. |
| a1-05 | 3 | PASS | **The wrong line is cut.** THE WAR is blacked out and THE BOMB-SHELTER STORY stays, which is the opposite of the VO and MYTH 2. The slot is black from frame 0, and the card is static for about 12 s. | Change `cut:1` to `cut:0` (the index is 0-based). Change `go:Nobody` to `go:famous` so the line visibly drops out at about 40 %. |
| a1-06 | 5 | PASS | The stripes are brushed and 47 is final by 42 % (F03 ✓). | |
| a1-07 | 5 | PASS | The real lake at Herzogenaurach is split ADIDAS / PUMA (F04 ✓). | |
| a1-08 | 3 | **FAIL** | A modern floodlit Latvia v Gibraltar match (ad boards) stands for the **1954** final. The label lands only at 96 % (keyed to the last word, "studs"). | Use `slow:fifty-four;freeze:final` so the freeze and label land by about 40 %. Add `mono:1`/sepia so it reads as a stand-in, and add `sub:` "stand-in footage". |
| a1-09 | 4 | PASS | The plate is a goalkeeper mid-kick with his own ball, not an empty stadium, so **two balls** sit on screen at 96 %. The ball rests only at 96 %. Size .3 is huge. | Use `bg:nike_vs_adidas_art_stadium_crowd` (unused), `go:From;size:.14`. |
| a1-10 | 5 | PASS | The motif state is right. The vintage grade turns the blue shoe grey: the colour code is lost. | (Exempt the motif sprites from the look, or use `look:broadcast` on this beat.) |
| a2-01 | 4 | PASS | The real 1958 Knight photo. The strap lands only at **96 %** ("Phil" is late in the 2nd sentence). The camera barely moves. | Use `go:nobody` so the strap is in by about 15 %. Set `fx:.72;fy:.25` (Knight is 2nd from the right) for a real travel to his face. |
| a2-02 | 4 | PASS | Tiger next to Cortez is the right pair. The "interlock" draws a gold Lego-like outline in mid-frame that locks onto neither shoe. The label lands at 72 %. | Use `a:.28,.3;b:.7,.7` (the shoe centres) and `go:deal` so the label is final by 40 %. |
| a2-03 | 5 | PASS | The Bowerman/Knight print slides onto the Eugene wetlands. | |
| a2-04 | 5 | PASS | $35 is ringed by 42 % (F07 ✓). The source line is about 30 px. | |
| a2-05 | 4 | PASS | Seventeen tallies and "17.5 h × $2 = $35" by 42 %: good. **The 1983 RING + 500 SHARES caption never appears**, so the 2nd sentence has no picture and the frame is static for about 7 s. | Add the 2nd caption keyed to `Twelve` (the param named in the CARD did not render). Check that `lab2`/`terms` is supported by `@years_tally`. |
| a2-06 | 5 | PASS | The iron opens and a nubbed sole comes out by 42 %. It is a flat diagram. | |
| a2-07 | 4 | PASS | The real 1966 Hayward meet. The pin lands at **72 %** ("debut" is late). The label implies a 1972 photo. | Use `go:nineteen` (the first word) and add "photo 1966" to the `sub`. |
| a2-08 | 4 | PASS | The split-flap idea is lively, but DEC 1980 locks only at about 65–72 %, and frame 42 % reads OCT 1980 (a false value). The blurred desk plate is generic. | Use `from:1979-6` so DEC 1980 locks by 40 %. |
| a2-09 | 5 | PASS | The motif: the upstart sets off. The sepia makes the red and blue shoes the same beige. | (Same as a1-10.) |
| a3-01 | 5 | PASS | The real Jordan dunk, with the strap by 42 %. | |
| a3-02 | 4 | PASS | The NIKE cheque is final by 42 %. **The ADIDAS cheque never appears** (it slides out before frame 0). After that the card is static for about 9 s; $500K / year is not shown. | Use `go:But` so the Adidas cheque greys out on screen. Add a 4th line `= $500,000 A YEAR` keyed to `year`. |
| a3-03 | 5 | PASS | FLAGGED · 51 % WHITE (F10 ✓). The shoe is a tinted modern runner. | |
| a3-04 | 5 | PASS | The stamp sits on the receipt (MYTH 1 ✓). It is static after 42 %. | |
| a3-05 | 5 | PASS | AIR JORDAN 1 is struck, the label moves to the Air Ship, BANNED stamps on its sentence. | |
| a3-06 | 5 | PASS | The tag flips to $65 by 42 % (F09/F11 ✓). | |
| a3-07 | 5 | PASS | $100M+ is final by 42 % (F11 ✓). Frame 0 reads **$94M+** (a false value). | (Start the count at the cut, or show $100M+ from frame 0.) |
| a3-08 | 4 | PASS | The carrier plate is right, but the "shelf lights" are three bright bars cutting across the shoe. There is no line of people and no shelves read. | Use `rows:` on the stand edges (about .22~.47~.70) at half the brightness and 1/3 the thickness. Fix the stale tag "CARRIER of a2-07" → a3-07. |
| a3-09 | 6 | PASS | The motif: Nike onto every shelf. | |
| a4-01 | 3 | PASS | The Air Max **97** stands for 1987. The disclosure sub ("pictured: a later model…") sits **on the white shoe and is illegible**, and the title collides with the shoe's heel. The caption is final at 72 %. The wipe from footage happens before frame 0, so the beat is one still photo. | Use `go:formula` (the first word) and move `txt` into the dark lower-left (`ty:.86` is too low; use `tx:.22;ty:.7`) on a dark plate strip. Put the sub on its own line at ≥ 40 px. |
| a4-02 | 5 | PASS | A JUST DO IT placard is planted in real B&W running footage by 42 % (F12 ✓). | |
| a4-03 | 2 | **FAIL** | No type and no Adidas. Modern fans making **heart hands**, which fits any concert line. The VO's picture (fans holding up Superstars, Run-DMC, the band signing) is absent. | Keep the hand clip and make the 2nd cut `nike_vs_adidas_adidas_superstar_white` held high on "Garden", with the label RUN-DMC · MY ADIDAS · 1986 keyed to `Adidas`. |
| a4-04 | 4 | PASS | Knight greys out and REEBOK · ABOUT $1.4B rises (F16 ✓). The "Reebok" is a generic white `el_` sneaker with a brand label. The 2nd sentence ("Nike took the lead back in 1988") gets no reversal, so the frame is static for 6 s. | Add a reversal on `back` (Nike rises, Reebok sinks) using `@rise_and_sink`'s second key, or ADAPT it. Label the sneaker REEBOK (ILLUSTRATION). |
| a4-05 | 3 | PASS | The label BRAND JORDAN · 1997 is **clipped at the bottom edge (bottom 12 %)** and invisible at 72/96 %. The Swoosh card is the LeBron Witness, which is also the plate of a5-09 (an undeclared reuse). Obama dominates the frame. There is no Jumpman. | Change `a:` to `nike_vs_adidas_nike_football_shoes_pair` (unused). Crop the White House photo to Jordan (`bz:1.6;bfx:.35`). Move `blab` above the print. |
| a4-06 | 4 | PASS | The revenue blocks are final by 42 % (F14 ✓). The source note **collides with the $10.7B label**. The type is all on a dark floor, and the chronology jumps back from 1997 to the mid-80s. | Cap the tallest block at 80 % of the height, or move the `note` to the left. Move this beat after a4-04 (see the listen test). |
| a4-07 | 5 | PASS | The Reebok tag ($3.8B, F17 ✓) swings over the real Herzogenaurach outlet. The NBA line has no picture, so it is static for about 7 s. | |
| a4-08 | 3 | **FAIL** | A generic department-store plate with a wooden ruler would fit any "in 2013…" line. KANYE WEST · FROM NIKE TO ADIDAS lands at 72 % on top of the store's red HOME signage (type on type). | Use `bg:nike_vs_adidas_sneakers_neon_wall` (unused, sneakers as fashion) and `go:twenty` (the first word) so the label is in by 30 %. |
| a4-09 | 4 | PASS | NEW device, real data (11.3 / 37 / 9.5, F40 ✓). The grey 100 are invisible, so the proportion does not read. 0–72 % is one thin blue row (about 9 s static). NIKE 37 % lands at about 90 %. The plate `flight_club_wall` is reused in a8-02 (undeclared). | Draw the 100 grey shoes at 50 % opacity from frame 0. Key NIKE and JORDAN to `climbed` (sentence 2). Use `bg:nike_vs_adidas_sneakers_thrift_shopping`. |
| a4-10 | 5 | PASS | The motif works, but its label repeats a3-09 word for word ("NIKE · ON EVERY SHELF"). | (`lab:NIKE · TOO BIG TO CHASE`) |
| a5-01 | 4 | PASS | CONSUMER DIRECT ACCELERATION is still final only at 72 %. The plate is near-black. The source is about 20 px. | Key `lines` to `For` / `thirty-five` / `June` so all three are final by 45 %. Make the source ≥ 40 px. |
| a5-02 | 5 | PASS | NIKE → (STORES struck) → YOU. | |
| a5-03 | 5 | PASS | The real list of cut accounts is struck by 42 % (F26 ✓). | |
| a5-04 | 5 | PASS | The ring goes from 24/76 to 44/56 on its sentence (F27 ✓). | |
| a5-05 | 4 | PASS | The declared callback plate. From 42 % the whole wall is a dark red wash with two thin lines, so "shrinking" is not shown as shrinking. | Use `dark:.35`. Take out the rows one by one (`rows:.3~.42~.55` staggered from `margin`). |
| a5-06 | 4 | PASS | AJ4 tiles multiply, but are static from 42 % for about 9 s across three sentences. The `lab` THE SAME FEW CLASSICS still does not render. | Fix the label render. Add a hue shift of the tiles on `colours` (ADAPT @tile_multiply → `hue:colours`). |
| a5-07 | 5 | PASS | The Bloomberg band, with a drain on "Uncool" (F28 ✓). | |
| a5-08 | 5 | PASS | $46.3B and −10 % by 42 % (F30 ✓). Frame 0 reads $49.4B. | |
| a5-09 | 5 | PASS | The −44 % tear (F30 ✓). | |
| a5-10 | 5 | PASS | INTERN 1988 / CEO OCT 2024 (F29 ✓). | |
| a5-11 | 4 | PASS | **The picture contradicts the line.** On "His first job: get Nike back on the shelves" the red shoe steps **off** its plank, and the label lands at 96 %. | Use `ax0:0.6;ax:0.76;go:job;lab:HILL'S JOB · GET BACK ON`: start off the shelf and edge back toward it. |
| a6-01 | 4 | PASS | The drain is in by 42 %. The "crack" is a thin white zigzag that reads as a **stock chart line**. ITS OWN DISASTER lands at 72 %. | Tie the label to `go` (not `go2`). Use a dark crack 3× thicker, with a white edge. |
| a6-02 | 5 | PASS | The contract rips, then ENDED · 25 OCT 2022 (F20 ✓). | |
| a6-03 | 5 | PASS | The verbatim statement types with the voice (Q03 ✓). The by-line is about 30 px. | |
| a6-04 | 5 | PASS | −€700M, labelled as a forecast (MYTH 4 ✓). It is already final at frame 0 and nothing moves. | (Camera travel down the aisle, `move:in`.) |
| a6-05 | 5 | PASS | The real Gulden print and Q02, lit with the voice. | |
| a6-06 | 5 | PASS | The archive drawer and the Superstar. | |
| a6-07 | 5 | PASS | The Samba lands big. Gazelle and Spezial are named in the VO but not shown. | |
| a6-08 | 5 | PASS | The carrier Samba with SHOE OF THE YEAR (F24 ✓). | |
| a6-09 | 4 | PASS | Q04 is verbatim and correctly undated. It is the **same layout as a6-05** (portrait left, quote right) four beats later, with an 8-s read. This is the 3rd of 4 quote cards in the act. | Use `pic:nike_vs_adidas_adidas_samba_black` (the carrier from a6-08) so "godsend" sits next to the shoe it is about. |
| a6-10 | 5 | PASS | €1.4B, with €260M peeled off by 42 % (F21 ✓). | |
| a6-11 | 3 | PASS | Q06 is verbatim, but **the by-line is wider than the card**: "HARM" and "actor" spill onto the dark plate, and it is about 25 px. Frame 0 is an empty black room. | Shorten it to `by:HARM OHLMEYER · ADIDAS CFO · Reuters, 5 Mar 2025` and put "read by a voice actor" on a 2nd line. Use `h:.30;w:.62`, and `go:finance` so the card is up by 15 %. |
| a6-12 | 3 | PASS | **The swing is never seen.** The bar already stands at +268M at frame 0; FORECAST −700 is never on screen. The plate `stock_office_whiteboard_14` is reused in a7-06 (undeclared). The 2nd VO sentence has no picture. | Start at −700 and move on `came` (not `never`), so the drop below zero is visible for about 1 s. Use `bg:nike_vs_adidas_doc_adidas_ar2024_ten_year_overview` (a real Adidas document with the operating profit row, unused). |
| a6-13 | 5 | PASS | €268M → €2,056M and ×7.7 are final by 42 % (F22/F25 ✓). | |
| a6-14 | 6 | PASS | The motif: Adidas back on the shelf. | |
| a7-01 | 3 | **FAIL** | An Austrian lower-league shoot-out (Wattens), with a pink light-leak streak on the right. The placard text **overflows its board** ("W" and "6" hang off). Any football line fits. | Use `clip:nike_vs_adidas_clip_football_fans_porto` (a fan screen, tournament feel, unused). Use `sign:WORLD CUP` with `sub:2026 · the ad war`, or widen the board. |
| a7-02 | 3 | PASS | The bars are already final at frame 0 and nothing moves for about 14 s. **"Its shoe sales grew one percent" (the point that pays off a0-05 and a7-14) is not on screen.** €6.7B is not shown. The note is about 25 px. | Add `~FOOTWEAR (C-N)^1^#c9ced8` keyed to `shoe`. Grow the bars from 0 on `spring`. Make the note ≥ 40 px. |
| a7-03 | 5 | PASS | 66M vs 6.8M by 42 %, "as reported" (F38 ✓). Frame 0 reads 61M. | |
| a7-04 | 5 | PASS | The carrier 66M flips to −4 % revenue. | |
| a7-05 | 5 | PASS | −4 / −9 / −26, with the currency note (F32 ✓, TRAP 2 ✓). | |
| a7-06 | 5 | PASS | Labelled guidance (TRAP 12 ✓). The y-axis is unlabelled and exaggerated (see the facts check). | (Rescale `pts:.9,.81,.81,.74`.) |
| a7-07 | 2 | PASS | **Nothing is cut.** `cut:3` is past the end of a 3-line list (0-based), so the card is fully static for about 12 s. | Change `cut:3` to `cut:2` and key it to `fewer`. Add slow camera travel on the sheet. |
| a7-08 | 5 | PASS | The declared bookend: $31.97 and −81 % (F34 ✓). The sub is about 30 px. | |
| a7-09 | 4 | PASS | Targets struck down to SELL · $27.50 (F34 ✓). The tag title **overflows the tag**. $40→$30 is Wells Fargo, but it reads as one bank's path. The 26 % BUY line is not shown, and the frame is static for about 10 s. | Use `lab:TARGETS · OCT 2026` (it fits). Use `vals:WFC $40@Banks~WFC $30@cut~BERENBERG SELL $27.50@Berenberg`. Swap `sub` to "26 % BUY · LOWEST IN 20+ YEARS" on `Only`. |
| a7-10 | 4 | PASS | Q01 is verbatim and NOT YET is good, but this is the **third trading-screen plate in a row** (b8–b10), so the eye sees one plate for about 35 s. | Use `bg:nike_vs_adidas_nike_hq_beaverton_wide` with `blur:6;dim:.3` (a Nike place for the Nike CEO). |
| a7-11 | 3 | PASS | The photo slides out before 42 %, leaving an **empty frame** for about 6 s. DEC 2008 – SEPT 2026 runs to **x ≈ 98 % (outside the safe area)**. "NIKE" is about 20 px. | Drain the photo but keep it in the frame (slide 30 % out, not 100 %). Put the date under the plate, centred. Make `cap` ≥ 40 px. |
| a7-12 | 5 | PASS | Q3 2026 grows through the €1,000M line, and FIRST EVER no longer covers €1,008M (fixed, F37 ✓). Frame 0 reads €676M. The frame is static for about 12 s, and the €2.5B outlook is not shown. | (Add tag `OUTLOOK 2026 ≈ €2.5B` keyed to `raised`.) |
| a7-13 | 5 | PASS | ≈ €200M one-off refund peeled off (TRAP 11 ✓). | |
| a7-14 | 5 | PASS | Footwear 0 / apparel +19 / performance +14, currency-neutral (F37 ✓). | |
| a7-15 | 5 | PASS | The motif state is right, but all 4 samples are identical (the move happens before frame 0). | |
| a8-01 | 5 | PASS | The ring morphs to 61/39 (F27 ✓). | |
| a8-02 | 4 | PASS | The "dark row" reads as a thin beige line, not a missing row. The beat is static, and the plate is reused from a4-09. | Use `dark:.85` on the single row and a .25 dim on the rest (a4-09 changes plate, per its fix). |
| a8-03 | 5 | PASS | The Stan Smith drawer is open by 42 %. | |
| a8-04 | 5 | PASS | The bookend: the thesis lands and holds. | |
| a8-05 | 3 | **FAIL** | **The 24 dots are invisible** (faint specks), so the picture is a headline on a dark trading plate. The $38 rebound in the VO is not shown. | Make the dots about 4× bigger (≈ 28 px) in one gold row, appearing 1→24 across 0–40 %. Add `sub2:$38.42 · 29 OCT` keyed to `October`. |
| a8-06 | 5 | PASS | INVESTOR DAY / 17 NOV 2026 (F35 ✓). | |
| a8-07 | 6 | PASS | The motif asks the open question. | |
| a8-08 | 5 | PASS | The callbacks now open on the AJ1 wall (fixed). From 72 % to 96 % it holds about 9 s on "IF IT DOESN'T", which is long but acceptable as the ending. | |
| a8-09 | 4 | PASS | The "new Nike" card is still **white socks on feet** (flagged in r2). It is the 4th Samba frame. | Crop with `az:1.8;afy:.75` so the soles fill the card, or use `a:nike_vs_adidas_nike_football_shoes_pair`. |

## Totals vs the ship gate

- Beats scored: **94** (end card excluded).
- **Score ≥ 5/8: 59/94 = 62.8 %.** The gate is ≥ 85 % (80 beats). **FAIL, short by 21 beats.**
- **Swap PASS: 89/94 = 94.7 %.** The gate is ≥ 90 %. **PASS.**
- **≤ 4 (35 beats):** a1-03, a1-05, a1-08, a1-09, a2-01, a2-02, a2-05, a2-07, a2-08, a3-02, a3-08, a4-01, a4-03, a4-04, a4-05, a4-06, a4-08, a4-09, a5-01, a5-05, a5-06, a5-11, a6-01, a6-09, a6-11, a6-12, a7-01, a7-02, a7-07, a7-09, a7-10, a7-11, a8-02, a8-05, a8-09.
- **≤ 3, redesign (13 beats):** a1-05, a1-08, a4-01, a4-03, a4-05, a4-08, a6-11, a6-12, a7-01, a7-02, a7-07, a7-11, a8-05.
- **Swap FAIL (5 beats):** a1-08, a4-03, a4-08, a7-01, a8-05.

| act | ≥ 5 | swap PASS | comment |
|---|---|---|---|
| a0 | 7/7 | 7/7 | solid |
| a1 | 6/10 | 9/10 | new 1954/1970 beats weak; a1-05 shows the wrong fact |
| a2 | 4/9 | 9/9 | new beats keyed late |
| a3 | 7/9 | 9/9 | |
| a4 | **3/10** | 8/10 | the new act is the weakest |
| a5 | 7/11 | 11/11 | |
| a6 | 10/14 | 14/14 | |
| a7 | 9/15 | 14/15 | |
| a8 | 6/9 | 8/9 | |

Almost every ≤ 4 beat has a fix that is only a param, a word key or a plate swap. If the fixes for the 35 beats above are applied, I expect ≥ 28 of them to reach 5. That would put the film at about 87–92 %.

## Film-level defects

**1. Values and labels land late (not final by 50 %): 13 beats.**
- a1-08: 96 %
- a1-09: 96 %
- a2-01: 96 %
- a2-02: 72 %
- a2-07: 72 %
- a2-08: about 70 %
- a4-01: 72 %
- a4-08: 72 %
- a4-09: Nike 37 % at about 90 %
- a5-01: 72 %
- a5-11: 96 %
- a6-01: 72 %
- a6-12: the forecast state is never seen

A false value appears on frame 0 or 42 % in a2-08 (OCT 1980), a3-07 ($94M+), a5-08 ($49.4B), a7-03 (61M) and a7-12 (€676M).

**2. Params that silently do nothing or do the wrong thing (render bugs, not design): 7 beats.**
- a1-05: `cut:1` cuts the wrong line.
- a7-07: `cut:3` is out of range; nothing is cut.
- a2-05: the 1983 caption is missing.
- a3-02: the Adidas cheque never appears.
- a5-06: the label does not render.
- a6-12: the swing starts at its final state.
- a8-05: the dots are invisible.

Fix these before anything else. They are the cheapest points.

**3. Layout flags `pp_layout` should have caught. Do not render with these.**
- a4-05: the label is clipped at the bottom edge, in the bottom 12 %.
- a7-11: the date is at x ≈ 98 %, outside the safe area.
- a6-11: the by-line overflows the card.
- a7-01: the sign text overflows the board.
- a7-09: the tag title overflows the tag.
- a4-06: the note collides with $10.7B.
- a4-01: the sub sits on the white shoe.
- a4-08: the label sits on the store's HOME signage.

Run `pp_layout` again after the fixes. Some of these are bounds overflows inside a component, which the tool may not test.

**4. Type below 40 px (sources, by-lines, subs):**
- a0-01, a0-04
- a2-04, a3-03, a3-05
- a4-01
- a5-01 (about 20 px)
- a6-03, a6-05, a6-11 (about 25 px)
- a7-02 (about 25 px), a7-08, a7-09, a7-11 ("NIKE" about 20 px)

Raise the engine's sub/source minimum to 40 px at 1080p, film-wide.

**5. Plates used twice without a declaration:**
- `nike_vs_adidas_nike_lebron_witness_black`: a4-05 and a5-09.
- `nike_vs_adidas_flight_club_wall`: a4-09 and a8-02.
- `stock_office_whiteboard_14`: a6-12 and a7-06.
- `nike_vs_adidas_adidas_samba_black`: a6-07, a6-08 and a8-09. a6-08 is a declared carrier; a8-09 is not declared.

The fixes above remove the first three. Also, five trading-screen plates (a0-01, a7-08, a7-09, a7-10, a8-05) read as the same plate, and three of them run back to back in a7.

**6. Effects.** Every effect is used ≤ 2 times and the motif once per act ✓. But 16 effects are used exactly twice, and four pairs sit in the same act:
- `@category_bars`: a7-02 and a7-14
- `@quote_card_type`: a6-03 and a6-11
- `@ember_quote` and `@quote_beside`: a6-05 and a6-09, which read as the same layout

Act a6 has **4 quote cards** (b3, b5, b9, b11), about 35 s of reading.

**7. The motif.** Nine identical compositions on the same AI track. It is clear, but by a5 it is predictable:
- a3-09 and a4-10 carry the same label.
- In a1 and a2 the vintage grade turns red and blue into the same beige, so the colour code fails.
- a7-15 and a5-11 have no visible motion in the samples.
- a5-11 contradicts its line.

**8. Stale cross-references in CARD tags** (bookkeeping only; fix so `pp_motion` and future critics are not misled):
- a3-08 "CARRIER of a2-07"
- a6-08 "CARRIER of a4-07"
- a7-04 "CARRIER of a5-02"
- a8-01 "the a3-04 ring"
- a8-08 "a2-08 Cortez wall / a3-05 boutique"

**9. Does it earn 12 minutes? Not yet.**
- a0, a3, a5 and a8 carry the film.
- a4 (about 1:45) is a chronicle of 11 milestones with no question or tension, and 7 of its 10 beats are ≤ 4.
- a7 (about 2:40) has a dead visual stretch at b8–b10 (three trading screens, about 35 s).
- a6 slows to reading speed at b9 and b11.

Verbal tics:
- "put it this way" is used 3 times: a6-09, a6-11 and a7-10.
- "Remember that shelf" is used 3 times: a0-07, a3-09 and a8-08.
- "where you sell is part of what you sell" is said twice within about 60 s (a8-04 and a8-08).

Suggested trims, about 45 s:
- Cut a6-09 (the second Gulden quote) or fold it into a6-08.
- Cut a7-11 (S&P 100), or merge it into a7-08's sub.
- Vary the attribution verbs: "said", "told reporters", "admitted on the call".

## Facts check

All on-screen numbers trace to the research:
- $31.97, −81 %
- 13 years
- €1,008M, €736M, +37 %
- 0 / +19 / +14
- +13 % / +5 % / €212M
- 66M / 6.8M
- −4 / −9 / −26
- $2.5B Pace, 4→3
- $40 / $30 / $27.50, 26 %
- Dec 2008, 24 rises, 4.8 %
- $38+
- 17 Nov
- 61/39, 24/76 → 44/56
- $51.4B → $46.3B, −10 %, −44 %, $5.7B → $3.2B
- −€700M, €268M, €2,056M, ×7.7
- €1.4B / €260M
- €200M
- $1.07B / $6.47B / $10.7B
- $3.8B, ≈ $1.4B Reebok
- 11.3 / 37 / 9.5
- $35, $2 × 17.5 h, 500 shares, 1983
- $65, $100M+, $2.5M / 5 yrs, $500K / yr
- 18 Oct 1984 (a Thursday ✓), 25 Feb 1985
- 1924 / 1936 / 1948 / 1949 / 47 / 1954 / 1970
- 1962 / 1964 / 1971 / 1972 / 1974 / 1980
- The day names are also right: 1 Oct 2026 was a Thursday, 2 Oct a Friday, 20 Oct a Tuesday.

The quotes Q01, Q02, Q03, Q04 and Q06 are verbatim and attributed, with "read by a voice actor". Q07 is used only as a quoted fragment ✓. Q08 (unverified) is correctly not used. MYTH 1, 2, 4, 6 and 7 and TRAP 2, 3, 9, 11 and 12 are handled.

**Errors and flags:**
1. **a1-05 (on-screen fact inverted).** The card blacks out THE WAR and keeps THE BOMB-SHELTER STORY, while the VO says the shelter story is unproven (MYTH 2). Fix: `cut:0`.
2. **a1-03 (broken VO).** "In nineteen thirty-six, At the Berlin Olympics of nineteen thirty-six" is in both the story and the script.
3. **a8-08 (wrong referent).** "the brothers' old rival from Bavaria may be the one still standing". Adidas *is* one of the brothers' companies; Nike is the rival. Say "the Bavarian brother's company" or "the old company from Bavaria".
4. **a6-12 (RISK 4 basis).** "On the bottom line, it still lost money for the first time since 1992." The research supports a *net loss from continuing operations* (€58M), the first since 1992. Say so: "…posted a net loss from continuing operations, its first since 1992."
5. **a7-06 (misleading chart).** The unlabelled, truncated y-axis draws FY25 −10 % and the FY27 high-single-digit guidance as falls of about 40 %. Rescale (`pts:.9,.81,.81,.74`) or label it "not to scale".
6. **a7-11 (loose timing).** "A month earlier": the removal was announced on 4 Sept and took effect on 21 Sept, which is 10–27 days before 1 Oct. Say "In September".
7. **a3-01 (weakly sourced).** "By 1984, Adidas was the bigger company" rests only on research §Top-3 / HOOK 3, with no F-number and no named source. Keep it, but list it in the report as unsourced, or soften it to "Adidas was the giant".
8. **Wrong period or model, disclosed badly or not at all:**
   - a4-01: an Air Max 97 for 1987. The disclosure is illegible.
   - a0-03: Jordan in 1992 for "ONE ROOKIE".
   - a2-07: a 1966 photo read as 1972.
   - a1-08: a modern match for 1954.
   - a1-09: a modern goalkeeper for 1970.
9. **a7-09.** $40→$30 is Wells Fargo, but the tag reads as one bank's path to $27.50. Name the banks.
10. **a4-04.** A generic `el_` sneaker is labelled REEBOK. Mark it as an illustration; no real product should be implied.
11. **a1-03 (AI art).** The Dassler-workshop scene contains a seated male figure who can be read as Adi Dassler. Dim or crop him out; no real person may be drawn.
12. **a0-05 (TRAP 2).** FOOTWEAR 0 % lacks "currency-neutral" (a7-14 has it).

No number on screen lacks a source.

## Listen-only test: act a4 VO (screen off)

> The formula kept working. In 1987, Nike put a window in the sole: Air Max. A year later came three words, written by its ad agency: Just Do It. The first ad starred a runner named Walt Stack. Adidas found its audience somewhere else. In 1986, Run-DMC released "My Adidas." At Madison Square Garden, fans held up their Superstars, and Adidas signed the band. Adidas calls it the birth of non-athletic promotion in sporting goods. Nike's real scare came from Reebok… But Nike took the lead back in 1988. In 1997, Jordan got his own brand… Nike's yearly sales passed one billion dollars in the mid-eighties. They reached six and a half billion by 1996, and ten billion by 2003. So in 2006, Adidas bought Reebok… In 2013, Kanye West left Nike for Adidas… In early 2017, Adidas grew faster… about eleven percent… Nike still had thirty-seven percent. Nike didn't need to chase anyone. It was on every shelf.

**Verdict: PASS for clarity, FAIL for drive.** Every sentence is understood with the screen off, and the act lands on its last line.

Problems:
1. **The chronology zig-zags twice.** It runs 1987 → 1988 → 1986 → late-80s → 1988 → 1997, then jumps back to the mid-80s and forward to 1996/2003, then 2006 → 2017 → 2013/2015 → 2017. The revenue sentence after Jordan Brand sends the ear back 12 years.
   - Fix: move a4-06 straight after a4-04 ("…took the lead back in 1988. Its sales had already passed a billion…").
   - Fix: open a4-09 with "Then, in early 2017…".
2. **No question and no turn.** Eleven milestones in about 105 s, each an "and then". Add one sentence of stakes after the Reebok purchase, e.g. "For the first time since the eighties, Adidas looked like it could catch up." That gives a4-09 something to answer and a4-10 its line.
3. **"In early twenty seventeen… By twenty seventeen…"** says the year twice in two sentences. Cut "By twenty seventeen,".
4. **"Adidas calls it the birth of non-athletic promotion in sporting goods"** is jargon that sounds flat aloud. Say: "Adidas says no sports brand had ever been sold that way."

## Top 6 fixes, ranked by impact

| # | fix | beats it lifts |
|---|---|---|
| 1 | **Fix the 7 render bugs and dead params:** `cut:0` (a1-05), `cut:2` (a7-07), the missing 1983 caption (a2-05), the Adidas cheque on `go:But` (a3-02), the a5-06 label, the a6-12 swing starting at −700 on `came`, and the a8-05 dot size. One fact error (a1-05) goes away. | 7 beats, 4 of them ≤ 3 |
| 2 | **Re-key every late value to an early word** so it is final by 45 %: a1-08, a1-09, a2-01, a2-02, a2-07, a2-08 (`from:1979-6`), a4-01, a4-08, a4-09, a5-01, a5-11 (also reverse the move to match "get back on"), a6-01. | 12 beats |
| 3 | **Clear every layout flag before render:** a4-05 label above the print, a7-11 date inside the safe area with the photo kept, a6-11 by-line on 2 lines, a7-01 shorter sign, a7-09 shorter tag title, a4-06 note moved, a4-01 type on the dark strip, a4-08 new plate. Set the film-wide sub/source minimum to 40 px. | 8 beats, plus clean-frame compliance |
| 4 | **Plate swaps from the catalogue (all unused):** `clip_football_fans_porto` (a7-01), `adidas_superstar_white` held aloft (a4-03), `sneakers_neon_wall` (a4-08), `art_stadium_crowd` (a1-09), `nike_football_shoes_pair` (a4-05; also ends the LeBron reuse), `doc_adidas_ar2024_ten_year_overview` (a6-12; also ends the whiteboard reuse), `sneakers_thrift_shopping` (a4-09; also ends the flight-club reuse), `nike_hq_beaverton_wide` blurred (a7-10). | 4 swap FAILs to PASS, 8 beats |
| 5 | **Script fixes:** the a1-03 duplicate, the a8-08 referent, the a6-12 basis, "In September" for a7-11, reordering a4 (a4-06 after a4-04) plus one stakes sentence, and varying "put it this way". | the listen test and 3 fact flags |
| 6 | **Put a change in every static second half:** a7-02 FOOTWEAR +1 % bar on `shoe` (which pays off a0-05/a7-14), a7-09 26 % BUY on `Only`, a4-04 reversal on `back`, a3-02 $500K line, a5-05 staggered rows, a6-09 quote set beside the Samba. | 6 beats; removes the a6/a7 dead stretches |

**Verdict: DO NOT SHIP this cut.**
- Swap passes: 94.7 %.
- WOW is 62.8 % ≥ 5/8 against an 85 % gate.
- One on-screen fact is inverted (a1-05).
- One VO line is broken (a1-03).
- Eight layout flags remain.

Nearly every fix is a param, a word key or a plate swap, so one round of re-sheeting a1, a2, a4, a6, a7 and a8 should clear the gate.
