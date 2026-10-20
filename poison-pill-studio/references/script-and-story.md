# Script & story — business case studies, 8–12 minutes

## 1. Topic scoring (make it at ≥ 75/100)
| Criterion | Pts |
|---|---|
| Clear rise AND clear fall/turn (or a "rose again") | 20 |
| A human at the centre (founder, CEO, rival) with real photos available | 15 |
| One number people can feel ($1.75B gone in 6 months) | 15 |
| A surprising thesis (not "they ran out of money") | 15 |
| Search/curiosity demand (people still ask "what happened to X?") | 15 |
| Visual material: places, products, headlines, documents | 10 |
| Lesson that transfers to the viewer's work/life | 10 |
Good veins: hyped startups that died (Quibi, Theranos, WeWork, FTX, Juicero), giants that missed the shift (Kodak, Nokia, Blockbuster, BlackBerry), comebacks (Apple 1997, Lego 2004, Marvel), rivalries (Adidas vs Puma, Pepsi vs Coke), founder sagas (Rockefeller, Ford, Ray Kroc).

## 2. Architecture (10 min ≈ 1,550 words at 2.6 words/s; ~120 beats)
| Act | Time | Job | Colour |
|---|---|---|---|
| 0 Cold open | 0:00–0:30 | the end first (the crash, the number), then "but to understand how, we go back to…" + date card; plant the open loop (a question answered at the end) | fall → setup |
| 1 Origin | 0:30–2:00 | the person, the problem, the idea; why it shouldn't have worked | setup |
| 2 Rise | 2:00–4:30 | the money, the growth, the glamour — make the viewer believe; 1 re-hook at ~3:00 | rise |
| 3 The crack | 4:30–6:30 | the hidden flaw the thesis is about; the warnings ignored; mid-point twist | doubt |
| 4 The fall | 6:30–8:30 | the collapse in dated steps; the biggest number; one word on black | fall |
| 5 Aftermath | 8:30–9:30 | where everyone is now; the cost | after |
| 6 The lesson | 9:30–10:00 | thesis stated in one line; payoff of the open loop; next-case tease | lesson |
Each act = its own `.story` file (`-a0` … `-a6`).

## 3. Line craft
- 6–14 words per line, one idea, one drawable noun. Contractions. Active voice. Numbers written as spoken in the VO ("one point seven five billion") — the engine shows them as captions; the hero type shows "$1.75B".
- BUT / THEREFORE between beats, never "and then".
- The narrator is a sharp analyst, not a hype man: dry, specific, a little ironic. No "insane", "crazy" more than once per film; no "let's dive in", "buckle up", "in today's video".
- Rule of three; the third item twists ("He blamed the pandemic. Then the phones. Then everyone but himself.").
- Re-hook lines every 60–90 s: "And that's when the real problem started." / "But the worst decision was still to come."
- End: thesis in ≤ 12 words, then the next-case tease, then the end card.

## 4. Hook (first 15 s) formulas
- **The end first**: "Six months. One point seven five billion dollars. Gone." → rewind.
- **The impossible number**: "This app had more money than Netflix had in its first ten years. It lasted six months."
- **The contradiction**: "The smartest people in Hollywood built a streaming service nobody wanted."
The hook beat must slam a hero number/word within 1.5 s (lint checks).

## 5. Packaging
- Title ≤ 60 chars: number + conflict ("The $1.75 Billion Bet That Died in 6 Months"). Avoid clickbait the film doesn't pay off.
- Thumbnail brief (same visual language): one face cut-out (BW, white border, expressive), one number in gold Anton, one red word or a red X, navy background, max 3 elements, readable at 160 px wide.
- Description: 2-line summary · timestamps per act (text only) · sources list · photo credits (`credits.txt`) · disclaimer "commentary & analysis".
- Pinned comment: the open question ("Was it the product — or the pandemic?").
