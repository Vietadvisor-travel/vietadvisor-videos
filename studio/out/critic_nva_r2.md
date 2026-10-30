# CRITIC r2: nike-vs-adidas (sheets a0–a6, fresh critic, last round)

**Method**
- I opened all 14 sheets (frames at 0/42/72/96 % of each beat) and zoomed into 8 regions to check type size and collisions.
- I read every `// CARD`, `# cine` line and VO line in a0–a6 and checked every on-screen figure against RESEARCH (F01–F40, Q01–Q08).
- WOW gate /8 = originality + clarity + life + craft (0–2 each). Swap test as in final-cut §6/§C. The end card is not scored.
- Type size: 1 sheet px ≈ 5 px at 1080p.

## Per-beat table

| beat | /8 | swap | reason | cheap fix (beats ≤ 4 or FAIL) |
|---|---|---|---|---|
| a0-01 | 6 | PASS | The price line plunges and $31.97 is final by 42 % (F34 ✓). The ticker plate is generic. The lower-case "intraday low" is about 36 px. | |
| a0-02 | 6 | PASS | Fixed. The real 2013→2026 path, the NOV 2021 peak and the dashed 13-year level are all final by 42 %. Ticks are readable. | |
| a0-03 | 5 | PASS | Three windows open on their words. The "ONE ROOKIE" window shows Jordan at **Barcelona 1992** (wrong period). About half the frame is dark. | (Label the window "ONE PLAYER" or crop the photo tighter.) |
| a0-04 | 5 | PASS | The count reaches €1,008M by 42 % (F37 ✓). It is a flat slab on a dim aerial plate. | |
| a0-05 | 6 | PASS | Fixed. The carrier bar stays, the headline is struck by 42 %, and FOOTWEAR SALES · Q3 0 % sits beside it (F37 ✓). | |
| a0-06 | 5 | PASS | The thesis as a picture: the red row leaves and the blue row fills. The inner shelf panel floats on the plate. | |
| a0-07 | 5 | PASS | Fixed. The motif now ends at a shelf, and the labels are separated. The lane lines are straight and ignore the track's curve. The shoes stop moving after 42 %. | |
| a1-01 | 5 | PASS | The real 1928 factory photo with a push-in. HERZOGENAURACH · 1924 is final by 72 %. | |
| a1-02 | 7 | PASS | The best beat in the act: the camera travels to the real sign and a gold frame lands on it. | |
| a1-03 | 4 | PASS | Medals 1–3 are on screen at 42 % and the 4th only at 72 %, so a paused frame shows a false "3 golds". There are no spikes or Owens in the shot. | Key it to "nineteen" with `span ≤ 1.2` so all 4 medals are down by 45 %. Add `obj:` a spike on the bench (tinted `nva_cut_sneaker_red` → dark leather). |
| a1-04 | 6 | PASS | Fixed. It tears on "Then" and 1948 is final by 42 %. It is the declared bookend of a1-01. | |
| a1-05 | 5 | PASS | The stripes are brushed by 42 %, but the 47 lands at 72 % (late). The leather is empty at 0 %. Puma is never shown. | (Start the stripes on "Rudolf" and the 47 on "Adi" so it is final by 50 %.) |
| a1-06 | 5 | PASS | Two banks of the real lakeside get the two colours. The idea is specific. | |
| a1-07 | 5 | PASS | The real Knight and Bowerman print over the Eugene wetlands. | |
| a1-08 | 5 | PASS | Fixed period: a Cortez next to an Onitsuka Tiger. At 42 % the pencil shows a half-written "$3" (a false value). | (Shorten the write so $35 is whole by 42 %.) |
| a1-09 | 5 | PASS | Fixed. A grid iron opens and a nubbed sole comes out by 42 %. It is diagrammatic, with no steam or pour. | |
| a1-10 | 6 | PASS | The motif state matches the line: Adidas is on the shelf first. | |
| a2-01 | 5 | PASS | Fixed. Jordan's face is in frame and the strap is in by 42 %. | |
| a2-02 | 4 | PASS | At 42 % the cheque reads "$2.5 MIL" (a false value); the lines are final only at 72 %. The plate is the same AI court as a2-03, in back-to-back beats, and the reuse is not declared. | Key the lines to "offer" with `span ≤ 1.0` so all three are final by 50 %. Swap `bg` to a dark desk or office plate (`pp_stock.py find desk`) and keep the court for a2-03. |
| a2-03 | 5 | PASS | Fixed. A black and red shoe stands under the spot, and the note reads FLAGGED · 51 % WHITE (F10 ✓). The shoe is a tinted modern low-top runner. | |
| a2-04 | 4 | PASS | Legend versus evidence is specific. The stamp lands at 72 % and lies across the "Chicago" jersey script (type over type). | `sy:.42`: stamp the receipt itself, which voids the legend, and keep it off the jersey script. |
| a2-05 | 5 | PASS | Fixed. AIR JORDAN 1 is struck, the label slides to the Air Ship silhouette, and BANNED lands at 72 % on its own sentence. | |
| a2-06 | 5 | PASS | The 1985 tag flips to $65 by 42 % (F09/F11 ✓). The gym clip is modern. | |
| a2-07 | 5 | PASS | Fixed. A real AJ1 wall and box stacks, and $100M+ is final by 42 % (F11 ✓). Frame 0 shows "$89M+", because the count has already started at the cut. | (Start the count at the cut, or show $100M+ from the first frame.) |
| a2-08 | 4 | **FAIL** | A close-up of a single Cortez (a 1972 model) under "Nike's real formula… shelves everywhere", right after the AJ1 run. There are no shelves and no line of people. The "lights" read as scan bars. | Make it the CARRIER of a2-07: `pic:nike_vs_adidas_sneaker_store_jordans`, with `rows` set to the display stands so the real AJ1 stands light up row by row. Point the a6-07 callback at the same plate. |
| a2-09 | 6 | PASS | The motif: Nike takes the shelf and Adidas slides off it. | |
| a3-01 | 4 | PASS | CONSUMER DIRECT ACCELERATION is final only at about 80 % (keyed to "changed"). The navy marker on a grey wall has low contrast, and the source line is invisible. | Re-key to `thirty-five / June / Donahoe` so everything is final by 50 %. Ink white and red. Source ≥ 40 px in light ink. |
| a3-02 | 5 | PASS | NIKE → STORES (struck) → YOU, final early. The collision is fixed. | |
| a3-03 | 5 | PASS | The real list of cut accounts (F26 ✓), struck by 42 %. | |
| a3-04 | 5 | PASS | Fixed. Both slices stay: 44/56 (F27 ✓). The DIRECT label touches the ring's edge. | |
| a3-05 | 3 | **FAIL** | The plate's visible part is a **T-shirt rack**, not shoes. From 42 % to 96 % the frame is a near-black red wash with 3 drawn lines plus THE SHELF · SHRINKING: a word on a dark plate. | Change to `pic:nike_vs_adidas_sneakers_thrift_shopping` (a real shoe shelf with a hand reaching, unused). Dim the rows to about 40 %, not black, and dim only half the rows so it reads "shrinking", not "gone". |
| a3-06 | 5 | PASS | One AJ4 multiplying into identical tiles reads as sameness. The `lab` THE SAME FEW CLASSICS does not appear in any sample. | (Check that the label renders.) |
| a3-07 | 5 | PASS | Fixed. Worn sneakers under the Bloomberg band, which drains to grey on "Uncool". | |
| a3-08 | 5 | PASS | $51.4B → $46.3B and −10 % (F30 ✓), but they land at about 60 % (keyed to "revenue"). | (Re-key to `go:fiscal`.) |
| a3-09 | 5 | PASS | The 44 % tear; "$5.7B TO $3.2B" now renders correctly. | |
| a3-10 | 5 | PASS | Fixed. Solid stamps sit in clear space and are final by 42 % (F29 ✓). | |
| a3-11 | 6 | PASS | The motif: Nike steps off its own shelf. | |
| a4-01 | 3 | PASS | The drain lands at 72 % and the crack and ITS OWN DISASTER at 96 %. The crack is a hairline. For the first 42 % the picture is a sunny outlet. | Use `go:nobody` (drain) and `go2:Adidas` (crack, about 50 %). Make the crack stroke 3× thicker. The label must be final by 60 %. |
| a4-02 | 5 | PASS | The contract rips and the date is in by 42 % (F19/F20 ✓). After 72 % the halves have vanished and only text is left on the store. | |
| a4-03 | 4 | PASS | The verbatim statement (Q03 ✓) types with the voice, but the card is half empty and the plate is generic. | Use `h:.30` so the card fits the text, with the text ≥ 48 px. |
| a4-04 | 4 | PASS | The −€700M bar (F22 ✓) lands at 72 % (keyed to "forecast" in sentence 2). | Use `go:left`, from "It was left with a warehouse", so −€700M is final by 50 %. |
| a4-05 | 5 | PASS | The real Gulden print and the quote, lit with the voice (Q02 ✓). The lower half is empty. | |
| a4-06 | 5 | PASS | The drawer opens by 42 %. The tag clipping is fixed. The Superstar photo is amateur. | |
| a4-07 | 5 | PASS | The Samba lands big on its word, inside a lively card fan. Gazelle and Spezial are still not shown. | |
| a4-08 | 5 | PASS | Fixed. The Samba stays on screen (carrier), and the sash is inside the card and the safe area (F24 ✓). | |
| a4-09 | 4 | PASS | €260M lands at 72 % (keyed to "set" in sentence 2). The paper-bag plate is generic. | Use `go:sold` (end of sentence 1, about 45 %). |
| a4-10 | 5 | PASS | €268M → €2,056M and ×7.7 are final by 42 % (F22/F25 ✓). The stack is still thin. | |
| a4-11 | 6 | PASS | The new motif beat: Adidas climbs back onto its shelf. | |
| a5-01 | 3 | **FAIL** | A red-and-white club match, not the World Cup. The clip-art ball enters at 72 % and is still in mid-air over the players at 96 %. WORLD CUP 2026 lands at 72 %. The picture would fit any football line. | Use `go:who` and `y:.84` so the ball drops and rests on the grass by 40 %. `sub: Adidas makes the official ball`, which ties the drop to the brand (F38 ✓). |
| a5-02 | 6 | PASS | The views race reaches 66M vs 6.8M by 42 %, with "as reported" (F38 ✓). | |
| a5-03 | 5 | PASS | Fixed. The carrier's 66M bar flips into −4 % revenue: attention becomes sales. | |
| a5-04 | 5 | PASS | −4 / −9 / −26 with the currency note (F32 ✓), on a real Nike shoe. | |
| a5-05 | 4 | PASS | The guidance dash (F33 ✓). It is a generic whiteboard, and an empty pink forecast box shows at 0 %. | Drop the box until the dashed line comes in, and start that line on "told" so it is final by 50 %. |
| a5-06 | 5 | PASS | The declared bookend; $31.97 is in by 42 % (fixed). | |
| a5-07 | 4 | PASS | The verbatim Hill quote (Q01 ✓). The attribution is now about 42 px. It is still a type card on the film's 4th trading-screen plate. | Change `bg` to `nike_vs_adidas_nike_hq_entrance`, dimmed (a Nike place for a Nike CEO), or blur the trading plate. |
| a5-08 | 4 | PASS | A new device: quarterly bars and "first ever" (F37 ✓, +37 % ✓). The **FIRST EVER tag covers the "€1,008M" label**. The bars are already final at 0 %, so nothing grows. | Move the tag up about 0.07, or set it to the right of the bar. Start the Q3 2026 bar at 0 and grow it on "Three". |
| a5-09 | 5 | PASS | The €200M tariff refund peels off over a real container port (F37 ✓). | |
| a5-10 | 5 | PASS | Fixed. The plate is blurred, the divider is in, and 0 / +19 / +14 are correct (F37 ✓). | |
| a5-11 | 5 | PASS | The motif state is right, but all four samples are identical (the move is done before 0 %). | |
| a6-01 | 5 | PASS | Fixed. The ring morphs 56 → 61 and both slices stay (F27 ✓). | |
| a6-02 | 4 | PASS | The real multi-brand wall goes completely black, which says "no shoes anywhere", not "people can't find Nike". It is near-black with type from 42 %. | Use `rows:.52` (one row) and dim .5, so the wall stays visible with one dark gap. |
| a6-03 | 3 | PASS | The first half is a dead drawer wall. The Stan Smith arrives at about 65 % and the label at 72 %. It repeats the look of a4-06. | Use `go:company` so the drawer is open by 25 %. |
| a6-04 | 5 | PASS | Fixed. The thesis lands over the a0-06 shelf (bookend) and holds. Both rows are blue (the "empty red row" is not shown), which is acceptable. | |
| a6-05 | 5 | PASS | Fixed. A real magnifying glass over a calendar, with solid stamps by 42 % (F35 ✓). | |
| a6-06 | 6 | PASS | The motif: Nike stops just short of its empty slot. A good open question. | |
| a6-07 | 5 | PASS | Fixed in substance: 5 callback cuts. But the beat is about 24 s long, and the blue shelf holds about 7 s unchanged (42 → 72 %), which breaks the 4 s rule. "1985 · ON EVERY SHELF" is white on the white Cortez. The Cortez is a 1972 model. | (Add a change on "wherever", e.g. the blue rows fill slot by slot. Use the AJ1 wall as the 1985 callback.) |
| a6-08 | 4 | PASS | The choice cards lift on their words. The "new Nike" Vaporfly photo reads as white socks on feet. It is the 3rd, undeclared Samba use. | Crop the Vaporfly card: `z≈1.7`, focus on the shoes, so the socks and legs leave the frame. |

## Totals vs ship gate
- Beats scored: **67** (end card excluded).
- ≥ 5/8: **50/67 = 74.6 %** (gate ≥ 85 %, i.e. 57 beats). **FAIL by 7 beats.** Round 1 was 39 %.
- Swap PASS: **64/67 = 95.5 %** (gate ≥ 90 %). **PASS.** Round 1 was 70 %.
- ≤ 4 (17 beats): a1-03, a2-02, a2-04, a2-08, a3-01, a3-05, a4-01, a4-03, a4-04, a4-09, a5-01, a5-05, a5-07, a5-08, a6-02, a6-03, a6-08.
- ≤ 3 (redesign, 4 beats): a3-05, a4-01, a5-01, a6-03.
- Swap FAIL (3 beats): a2-08, a3-05, a5-01.

| act | ≥ 5 | swap PASS |
|---|---|---|
| a0 | 7/7 | 7/7 |
| a1 | 9/10 | 10/10 |
| a2 | 6/9 | 8/9 |
| a3 | 9/11 | 10/11 |
| a4 | 7/11 | 11/11 |
| a5 | 7/11 | 10/11 |
| a6 | 5/8 | 8/8 |

## Film-level defects

**1. Not final by 50 % (the main reason the gate fails).** This is a param problem in almost every case:

| beat | what is late |
|---|---|
| a1-03 | 4th medal at 72 % |
| a1-05 | 47 at 72 % |
| a1-08 | "$3" at 42 % |
| a2-02 | "$2.5 MIL" at 42 % |
| a2-07 | $89M+ on frame 0 |
| a3-01 | about 80 % |
| a3-08 | about 60 % |
| a4-01 | 96 % |
| a4-04 | 72 % |
| a4-09 | 72 % |
| a5-01 | 72–96 % |
| a5-05 | about 55 % |
| a6-03 | 72 % |

**2. Collisions:**
- a5-08: FIRST EVER covers €1,008M;
- a2-04: stamp on the "Chicago" jersey script;
- a6-07: white type on the white Cortez at 0 %;
- a3-04 and a6-01: pie labels touch the ring's edge (minor).

**3. Bottom 12 % and safe area.** Nothing found. The a2-07 watermark and the a4-08 sash are fixed. The a5-01 ball crosses the bottom edge only in motion.

**4. Type size.** The 40 px floor holds almost everywhere; zoomed checks of the lane labels, the cheque lines, the a5-07 attribution and the a5-05 axis came out at about 40–48 px.
- Still under the floor or illegible:
  - a0-01 lower-case "intraday low" (about 36 px);
  - a3-01 source line (invisible);
  - a3-01 navy lines (contrast).
- Near the floor: the a1-02 and a1-07 serif subs, and the a2-05 note.

**5. Plates used twice or more without a declaration:**
- `art_basketball_court_1980s` in a2-02 and a2-03, back to back;
- `adidas_samba_black` a 3rd time in a6-08 (a4-07, then a4-08 as a carrier, then a6-08).

All other repeats are declared: bookend, carrier, callbacks, motif.

**6. Effects.** All are ≤ 2 uses. `@reel` is down to 1 and `@lane_race` is the motif (7). The shelf family (shelf_swap ×2, shelf_empty_out ×2, shelf_light, callback_cuts) is heavy but on-theme.

**7. Wrong period, place or model:**
- a0-03: the 1992 Barcelona photo stands for "rookie";
- a2-08 and the a6-07 callback: a Cortez (1972) stands for the 1985 Jordan formula;
- a2-03: a modern low-top runner stands for a 1984 basketball shoe (the label carries it);
- a5-01: a club match stands for the World Cup;
- a6-08: the Vaporfly reads as socks.

**8. Held cards over 4 s.** a6-07 holds about 7 s on one state. a6-04 is a declared HOLD (ok). The quote cards change with the voice (ok).

**9. Motif.** Now one beat per act and every beat shows the shelf. Fixed. Two craft faults remain: the lane guides are straight lines across a curved track, and a5-11 has no visible motion in its samples.

**10. AI art.** No real person is drawn. The a1-03 AI workshop has an unnamed craftsman seen from behind (the catalogue declares him generic), which is acceptable.

## Facts check
Every on-screen figure matches RESEARCH:

| beat | figures | source |
|---|---|---|
| a0-01, a0-02, a5-06 | $31.97 on 2 Oct 2026; "13 years"; NOV 2021 record | F34 |
| a0-04, a5-08 | €1,008M; €736M; +37 %; first ever | F37 |
| a0-05, a5-10 | footwear 0 %; apparel +19 %; Performance +14 % | F37 |
| a1-01 to a1-09 | 1924; 1936 and four golds; 1948; 1949 and 47; 1964; 1971 and $35 by Carolyn Davidson; 1972 Trials | F01–F08 |
| a2-02 | 5 years, $2.5M | F09 |
| a2-03 | 18 Oct 1984; 51 % white; letter of 25 Feb 1985 | F10 |
| a2-04 | ESPN 2016 | F10 |
| a2-06 | $65, April 1985 | F11 |
| a2-07 | $100M+ (Britannica) | F11 |
| a3-03 | the account names | F26 |
| a3-04, a6-01 | 44 % in FY24; 61/39 in FY26 | F27 |
| a3-07 | Bloomberg, Sept 2024 | F28 |
| a3-08, a3-09 | $51.4B → $46.3B (−10 %); −44 %, $5.7B → $3.2B | F30 |
| a3-10 | 1988; 2020; Oct 2024 | F29 |
| a4-02 | 25 Oct 2022 | F20 |
| a4-03 | the statement | Q03 |
| a4-04 | −€700M | F22 |
| a4-05 | the Gulden quote | Q02 |
| a4-08 | FN 2023, first since Yeezy 2015 | F24 |
| a4-09 | €1.4B; €260M | F21 |
| a4-10 | €268M → €2,056M, ×7.67 | F22/F25 |
| a5-02 | 66M and 6.8M "as reported" | F38 |
| a5-04 | −4 / −9 cc / −26 cc | F32 |
| a5-05 | guidance high-single-digit decline; FY26 flat | F33/F30 |
| a5-07 | the Hill quote | Q01 |
| a5-09 | ≈ €200M tariff refund | F37 |
| a6-05 | 17 Nov 2026 | F35 |

Two notes:
- The a5-10 note says "currency-neutral", and the VO says "footwear sales were flat", which is correct. The a0-05 label FOOTWEAR SALES · Q3 0 % should also say "currency-neutral" (cheap).
- The a5-09 VO says the refund was "of it", meaning of operating profit. F37 says the refund helped gross margin, so it is in the profit. Acceptable.

## Listen-only test: act 5 VO (screen off)
**Result:** it works on the ear for about 9 of 13 lines, and the "shelf" payoff lands because acts 0–4 primed it.

Fixes:
1. **The Hill quote is unannounced.** A new voice reads 30 words and the listener never hears who is speaking. Add a narrator line before it: "Nike's chief executive, Elliott Hill, put it this way."
2. **"Revenue, down four percent. Direct sales, down nine. Greater China, down twenty-six, at constant currency."** This is three numbers in one breath. "At constant currency" sounds as if it applies to all three, but the −4 % is reported. Say: "Revenue fell four percent. In Greater China, it fell twenty-six." Leave −9 % to the screen.
3. **"One billion and eight million euros"** is clumsy on the ear. "It was its first billion-euro quarter ever" then repeats it, and "it was its" stumbles. Say: "Three weeks later, Adidas made just over a billion euros of operating profit in a single quarter, the first time in its history."
4. **"Then"** opens two lines in four ("Then came the World Cup", "Then it reported the quarter"). Change the first to "And then came the World Cup", or cut "Then".
5. **The second number has no currency.** "About two hundred million of it" should be "About two hundred million euros of it".
6. **Emotion.** Only one tag (`{wry}`) in the act. Put `{grave}` on the revenue line and `{tense}` on the stock-low line, so the fall sounds different from Adidas's rise. Put `{warm}` or `{wry}` on the final "Nike had stepped off the shelf".

## Top 5 fixes, ranked by impact (all cheap)
1. **Re-key the late values (params only).** This should lift about 7 beats to ≥ 5, which reaches the gate (57/67 = 85 %).

   | beat | change |
   |---|---|
   | a1-03 | `go:nineteen; span:1.2` |
   | a2-02 | `go:offer; span:1.0` |
   | a3-01 | lines on `thirty-five / June / Donahoe`; white and red ink |
   | a4-01 | `go:nobody; go2:Adidas`; thicker crack |
   | a4-04 | `go:left` |
   | a4-09 | `go:sold` |
   | a6-03 | `go:company` |
   | a1-05, a1-08, a3-08, a5-05 (polish) | 47 on "Adi"; $35 whole by 42 %; `go:fiscal`; dashed line on "told" |
2. **a2-08 becomes the carrier of the a2-07 AJ1 wall** (`pic:nike_vs_adidas_sneaker_store_jordans`, lights on the real stands). Point the a6-07 "1985" callback at the same plate. This clears 1 swap FAIL and 2 period errors.
3. **a5-01:** `go:who`, `y:.84`, `sub: Adidas makes the official ball` (F38). The ball then rests on the grass and the label is in by 40 %. This clears a swap FAIL.
4. **Never black out the shelf.**
   - a3-05: `pic:nike_vs_adidas_sneakers_thrift_shopping` (unused, a real shoe shelf), dim to .4 and only half the rows.
   - a6-02: `rows:.52`, dim .5, so the wall stays visible with one dark gap.

   This clears a swap FAIL and lifts two beats.
5. **Collision and plate cleanup:**
   - a5-08: FIRST EVER tag up about 0.07, and grow the Q3 2026 bar on "Three";
   - a2-04: `sy:.42`, stamp on the receipt;
   - a2-02: change `bg` off the a2-03 court;
   - a6-08: crop the Vaporfly card to the shoes;
   - a6-07: add one change on "wherever" and keep the 0 % label off the white shoe.

**Projection.** Fix 1 alone gives about 57/67 (85 %). Fixes 1–5 give about 61/67 (91 %) ≥ 5 and 67/67 swap PASS. None of these needs a new asset or a new effect.

## Verdict
**REVISE.** The gate is not met: 74.6 % ≥ 5/8 (needs 85 %). Swap passes at 95.5 %. This is the last critic round, so the rule allows shipping with the scores disclosed. But fix 1 is pure re-keying and reaches the gate. Apply fixes 1–3, re-sheet only a1, a2, a3, a4, a5 and a6, and ship.
