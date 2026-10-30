# CRITIC x2: nike-vs-adidas, 9-act cut, round 2 (last), fresh critic

**Method.**
- I opened all 20 re-rendered sheets (17:10–17:14) and read the story and script diff against x1.
- I enlarged three regions 3×: a3-02, a4-06 and a8-02.
- Scoring is the same as x1: WOW /8 (originality, clarity, life, craft at 0–2 each), the swap test per final-cut §6/§C, and 1 sheet px ≈ 5 px at 1080p.
- The end card is not scored.

## Per-beat table

The fix column is filled only where a beat is ≤ 4 or FAIL. "=" means unchanged since x1.

| beat | x1 | x2 | swap | reason | cheapest fix |
|---|---|---|---|---|---|
| a0-01 | 6 | 6 | PASS | = | |
| a0-02 | 6 | 6 | PASS | = | |
| a0-03 | 5 | 5 | PASS | = (Jordan 1992 for "rookie" is still there) | |
| a0-04 | 5 | 5 | PASS | = | |
| a0-05 | 6 | 6 | PASS | = (FOOTWEAR 0 % still has no c-n label) | |
| a0-06 | 5 | 5 | PASS | = | |
| a0-07 | 5 | 5 | PASS | = | |
| a1-01 | 5 | 5 | PASS | = | |
| a1-02 | 7 | 7 | PASS | = | |
| a1-03 | 4 | 5 | PASS | The VO is fixed. The four medals are down by 42 %. The figure is dimmed. | |
| a1-05 | 3 | 5 | PASS | Fixed. THE BOMB-SHELTER STORY is red at 0 % and cut by 42 %; the other three stay. | |
| a1-06 | 5 | 5 | PASS | = | |
| a1-07 | 5 | 5 | PASS | = | |
| a1-08 | 3 | 4 | **FAIL** | Now mono and honestly labelled "stand-in footage", but the freeze and label still land only at about 72 %. It is still a modern floodlit club match, so it fits any football line. | `freeze:West` (about word 6) so the label lands by about 35 %. |
| a1-09 | 4 | 5 | PASS | One ball on an AI stadium; the label is in by 42 %. The ball is oversized for the bowl. | |
| a1-10 | 5 | 5 | PASS | = | |
| a2-01 | 4 | 5 | PASS | The strap is up from 0 %. The camera travel is barely visible. | |
| a2-02 | 4 | 4 | PASS | The label is in by 42 %, but the gold "interlock" still draws a Lego-brick outline in mid-frame that locks onto neither shoe. Moving `a/b` changed nothing. | Drop the overlay. Use `@sign_zoom` (1 use) travelling to the Tiger stripes, with the same label. |
| a2-03 | 5 | 5 | PASS | = | |
| a2-04 | 5 | 5 | PASS | = | |
| a2-05 | 4 | 5 | PASS | Fixed. 1983 · A GOLD SWOOSH RING + 500 SHARES lands on its sentence. | |
| a2-06 | 5 | 5 | PASS | = | |
| a2-07 | 4 | 5 | PASS | Fixed. The pin is in at 0 %, and the sub says "photo 1966". | |
| a2-08 | 4 | 4 | PASS | Still a false value on the pause: 42 % reads **NOV 1980**, and DEC 1980 locks only at about 65 %. | `from:1980-9` (three flips) so DEC 1980 locks by about 35 %. |
| a2-09 | 5 | 5 | PASS | = (sepia still makes both shoes beige) | |
| a3-01 | 5 | 5 | PASS | The VO is softened to "still the giant". | |
| a3-02 | 4 | 4 | PASS | $500,000 A YEAR is added, but it **overflows the card's bottom edge** (the 3× crop shows it cut by the border). The Adidas cheque still never shows: `go2:But` fires on the first word, before frame 0. | Increase the card height by one line (`h` +.06). Set `go2:offer` so the Adidas cheque greys out at about 15 % on screen. |
| a3-03 | 5 | 5 | PASS | = | |
| a3-04 | 5 | 5 | PASS | = | |
| a3-05 | 5 | 5 | PASS | = | |
| a3-06 | 5 | 5 | PASS | = | |
| a3-07 | 5 | 5 | PASS | = (frame 0 still reads $94M+) | |
| a3-08 | 4 | 4 | PASS | The new `rows` changed nothing visible: three bright bars still slice across the shoe, and no shelf or queue reads. | Halve the bar opacity and thickness, or swap the device to the a3-07 boxes staying lit (CARRIER) with only the label. |
| a3-09 | 6 | 6 | PASS | = | |
| a4-01 | 3 | 5 | PASS | VISIBLE AIR · SINCE 1987 and the Air Max 97 disclosure now sit legibly on a dark band by 42 %. It is still one still photo. | |
| a4-02 | 5 | 5 | PASS | = | |
| a4-03 | 2 | 3 | PASS | A real Superstar now fills the frame on "Garden", which is specific. But there is **no type** (no Run-DMC, no 1986), it is **static for about 9 s**, and the plate `adidas_superstar_white` is reused in a6-06 without a declaration. | Add `lab:RUN-DMC · "MY ADIDAS" · 1986` keyed to `Adidas`, plus a slow push (`z:1.15`). Tag a6-06 as "CALLBACK of a4-03". |
| a4-04 | 4 | 4 | PASS | Now labelled ILLUSTRATION. Still no reversal on "Nike took the lead back in 1988", so it is static for about 6 s. | Add a second key `back` that swaps the rise and sink (ADAPT `@rise_and_sink`). |
| a4-05 | 4 | 5 | PASS | (Blocks, moved here.) The note no longer collides, the blocks are final by 42 %, and the chronology is fixed. | |
| a4-06 | 3 | 4 | PASS | (Jordan Brand, moved here.) The real Nike football shoes replace the reused LeBron shot, and the label is inside the safe area. But at 0–42 % the label is **wider than the print and clipped on both sides** ("RAND JORDAN … 201"). Obama still takes half the frame, and there is no Jumpman. | Crop the White House photo to Jordan (`bz:1.6;bfx:.35`) so the print is wider and the label fits. Or shorten it to `BRAND JORDAN · 1997`. |
| a4-07 | 5 | 5 | PASS | = | |
| a4-08 | 3 | 5 | PASS | Fixed. The chunky fashion sneaker plate and the label are in by 42 %. The label crosses the busy shoe but stays readable. | |
| a4-09 | 4 | 5 | PASS | The grey 100 now read and the plate is new. NIKE/JORDAN land at about 65 % (sentence-keyed). | |
| a4-10 | 5 | 5 | PASS | The "what could possibly go wrong?" turn is good. The label still repeats a3-09. | |
| a5-01 | 4 | 5 | PASS | Fixed. All three lines are final by 42 %. The source is still about 20 px. | |
| a5-02 | 5 | 5 | PASS | = | |
| a5-03 | 5 | 5 | PASS | = | |
| a5-04 | 5 | 5 | PASS | = | |
| a5-05 | 4 | 4 | PASS | The wall is visible now, but the "rows" render as three **hairlines**. No shoes leave, so "shrinking" is never shown. | The engine draws rows as lines. Give `@shelf_empty_out` a row-band height (about .08) that darkens to .8. The same fix also fixes a8-02. |
| a5-06 | 4 | 5 | PASS | Fixed. The label renders and the tiles shift hue on "colours". | |
| a5-07 | 5 | 5 | PASS | = | |
| a5-08 | 5 | 5 | PASS | = | |
| a5-09 | 5 | 5 | PASS | = (the LeBron plate is now unique) | |
| a5-10 | 5 | 5 | PASS | = | |
| a5-11 | 4 | 4 | PASS | The direction is fixed (the shoe moves toward the shelf), but the move and HILL'S JOB · GET BACK ON both land only at **96 %**: `go:job` is in the last sentence. 0–72 % carries no label. | `go:plan` (word 2) so the move and label are final by about 20 %. |
| a6-01 | 4 | 5 | PASS | The label is in by 42 %. The crack still reads somewhat like a chart line. | |
| a6-02 | 5 | 5 | PASS | = | |
| a6-03 | 5 | 5 | PASS | = | |
| a6-04 | 5 | 5 | PASS | = | |
| a6-05 | 5 | 5 | PASS | = | |
| a6-06 | 5 | 5 | PASS | = (the plate is now shared with a4-03; see a4-03) | |
| a6-07 | 5 | 5 | PASS | = | |
| a6-08 | 5 | 5 | PASS | = | |
| a6-09 | 4 | 5 | PASS | Fixed. The quote sits beside the Samba, and the VO is reworded. Tag it CARRIER of a6-08: it is the 3rd consecutive Samba frame. | |
| a6-10 | 5 | 5 | PASS | = | |
| a6-11 | 3 | 5 | PASS | Fixed. The by-line is on two lines inside the card, and the card types by 42 %. | |
| a6-12 | 3 | 3 | PASS | **The forecast state is still never seen.** Frame 0 already shows "ACTUAL 2023 (€)" with the bar at zero, so `@swing_bar` does not draw its `a` (−700) state. The new plate is the right document, but the chart and labels now sit **on dense table text** (type over type). | Make it the CARRIER of a6-04 (`@forecast_dashed`, 1 use): the dashed −€700M bar stands from frame 0, and on `never` a solid gold +€268M bar rises beside it. Or set `dim:.2;blur:3` on the document and fix `@swing_bar`'s start state. |
| a6-13 | 5 | 5 | PASS | = | |
| a6-14 | 6 | 6 | PASS | = | |
| a7-01 | 3 | 5 | PASS | A real fan zone with a push-in and WORLD CUP fitting its board. The fans are club supporters in Porto (catalogue: Porto fan square), not the 2026 World Cup, so this is a stand-in without a label. | (`sub:2026 · the ad war · stand-in`) |
| a7-02 | 3 | 5 | PASS | Fixed. The bars grow from 0, and FOOTWEAR (C-N) +1 % is on screen. Static after 42 %. | |
| a7-03 | 5 | 5 | PASS | = | |
| a7-04 | 5 | 5 | PASS | = | |
| a7-05 | 5 | 5 | PASS | = | |
| a7-06 | 5 | 5 | PASS | Rescaled, so the chart is honest now. | |
| a7-07 | 2 | 5 | PASS | Fixed. FEWER ROLES is highlighted, then cut and falling. | |
| a7-08 | 5 | 5 | PASS | = | |
| a7-09 | 4 | 5 | PASS | Fixed. WELLS $40 → $30 struck, SELL $27.50, and 26 % BUY · FEWEST IN 20+ YEARS. The tag fits. | |
| a7-10 | 4 | 4 | PASS | Unchanged: the third trading-screen plate in a row (b8–b10). | `bg:nike_vs_adidas_nike_hq_beaverton_wide;blur:6;dim:.3`. |
| a7-11 | 3 | 5 | PASS | Fixed. The photo drains and stays, and 2008–2026 is inside the safe area. The "NIKE" cap is still about 20 px. | (`cap` ≥ 40 px) |
| a7-12 | 5 | 5 | PASS | = | |
| a7-13 | 5 | 5 | PASS | = | |
| a7-14 | 5 | 5 | PASS | = | |
| a7-15 | 5 | 5 | PASS | = | |
| a8-01 | 5 | 5 | PASS | = | |
| a8-02 | 4 | 3 | PASS | **Worse.** `dark:.85` dimmed the **whole wall** to near-black, so the frame is a red headline over a dark field with one beige hairline. That is type as the picture. | Same engine fix as a5-05 (darken a band, not the plate). Until then, revert to `dark:.5`. |
| a8-03 | 5 | 5 | PASS | = | |
| a8-04 | 5 | 5 | PASS | = | |
| a8-05 | 3 | 5 | PASS | Fixed. A row of 24 gold dots is in by 42 %, then BACK ABOVE $38. | |
| a8-06 | 5 | 5 | PASS | = | |
| a8-07 | 6 | 6 | PASS | = | |
| a8-08 | 5 | 5 | PASS | The VO referent is fixed ("the old company from Bavaria"). | |
| a8-09 | 4 | 4 | PASS | Unchanged: the "new Nike" card is still white socks on feet. | `az:1.8;afy:.75` (crop to the soles), or `a:nike_vs_adidas_nike_football_shoes_pair`. |

## Totals vs the ship gate

| | x1 | **x2** | gate |
|---|---|---|---|
| beats scored | 94 | **94** | |
| ≥ 5/8 | 59 (62.8 %) | **80 (85.1 %)** | ≥ 85 % (80 beats): **PASS, with zero margin** |
| swap PASS | 89 (94.7 %) | **93 (98.9 %)** | ≥ 90 %: **PASS** |
| ≤ 3 | 13 | **3** (a4-03, a6-12, a8-02) | |

The ≥ 5 gate is met exactly. **Any one regression fails it**, so treat the 14 beats below as must-fix if anything is re-sheeted.

**Per act, beats ≥ 5:**

| act | ≥ 5 |
|---|---|
| a0 | 7/7 |
| a1 | 9/10 |
| a2 | 7/9 |
| a3 | 7/9 |
| a4 | 7/10 |
| a5 | 9/11 |
| a6 | 13/14 |
| a7 | 14/15 |
| a8 | 7/9 |

**Still ≤ 4 or FAIL (14 beats):**
- a1-08 (4, FAIL)
- a2-02 (4)
- a2-08 (4)
- a3-02 (4)
- a3-08 (4)
- a4-03 (3)
- a4-04 (4)
- a4-06 (4)
- a5-05 (4)
- a5-11 (4)
- a6-12 (3)
- a7-10 (4)
- a8-02 (3)
- a8-09 (4)

## Film-level

**1. Engine bugs that params cannot fix.** These are the root of 4 of the 14 beats.
- `@swing_bar` never draws its start (`a`) state (a6-12).
- `@shelf_empty_out` draws rows as hairlines, and `dark` dims the whole plate instead of a row band (a5-05, a8-02).
- `@interlock_overlay` ignores `a/b` (a2-02).

**2. Overflows inside a component that `pp_layout` does not catch.** Its "0 flags" result missed both:
- a3-02: the 4th line overflows the card.
- a4-06: the label is wider than its print at 0–42 %.

Worth adding a text-box-inside-parent check to `pp_layout`.

**3. Undeclared plate reuse.**
- `adidas_superstar_white` is used in a4-03 and a6-06.
- `adidas_samba_black` is used in a6-07, a6-08, a6-09 and a8-09; tag a6-09 as CARRIER.

The x1 reuses (LeBron, flight-club wall, whiteboard) are resolved.

**4. Effects.** Every effect is used ≤ 2 times, and the motif once per act ✓.

**5. Type under 40 px** remains in sources and by-lines film-wide: a5-01, a7-11 cap, a6-03/a6-05 by-lines, a0-04 and a7-08 subs. It is minor and not gating, but it is a clean-frame rule.

**6. Pacing.**
- a4 is much better: the order runs 1986–2003 then 1997, and the "what could possibly go wrong?" turn gives the act a hinge.
- a7 b8–b10 is still three trading screens in a row (fix a7-10).

## Facts check (round 2)

**Fixed:**
- a1-05 cuts the right line.
- a1-03 VO no longer repeats itself.
- a8-08 has the right referent.
- a6-12 now states "net loss from continuing operations, first since 1992" (RISK 4 ✓).
- a7-06 is rescaled.
- a7-11 now says "In September".
- a3-01 is softened.
- a4-04 is labelled as an illustration.
- a7-09 names Wells Fargo.

**Remaining. No unsupported number is on screen; these are period and label points only:**
1. **a7-01:** club supporters in a Porto square (not 2026 World Cup footage) under WORLD CUP · 2026, with no stand-in label. Add "stand-in".
2. **a0-03:** Jordan in 1992 for "ONE ROOKIE".
3. **a0-05:** FOOTWEAR 0 % lacks "currency-neutral" (TRAP 2). a7-14 has it.
4. **a1-08 and a1-09:** modern football for 1954 and 1970. a1-08 is now labelled as a stand-in; a1-09 is AI art.

## Verdict

**Ship-eligible on the gate:**
- WOW: 85.1 %, exactly 80 of 94 beats.
- Swap: 98.9 %.
- No factual errors remain.

If time allows before render, the cheapest insurance is about 10 minutes of param edits, then re-sheeting a2, a5, a7 and a8. The engine bugs are not needed for this. The six edits:
1. a2-08: `from:1980-9`
2. a5-11: `go:plan`
3. a7-10: plate swap
4. a8-02: revert to `dark:.5`
5. a8-09: crop
6. a1-08: `freeze:West`

That would lift the score to about 91 %.
