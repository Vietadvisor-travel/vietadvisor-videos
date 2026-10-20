# Directing per second — the shot list method

The engine renders exactly what you write. The difference between "slideshow" and "sống động từng giây" is decided here.

## 1. The shot list (one row per SENTENCE, written before the storyboard)
```
# | mm:ss | sentence (VO) | SHOT size + camera | BG | MID | FG | HERO / SUP (word) | EVENTS (word → event) | SFX notes | CUT out
1 | 0:00 | In 2020, two Hollywood legends bet $1.75B on a crazy idea. | WIDE · push | Hollywood sign plate, blur 10 | Katzenberg L-third (two), Whitman R-third flipped (legends) | cash stack (dollars) | $1.75B count-slam (billion) / ON ONE IDEA (crazy) | date APRIL 2020 types (0.0) · ALL IN stamp gold (bet) | impact on billion | hard cut
```
Rules: every row fills every column; if a column is empty you must say why ("solo — one word on black"). Then translate each row 1:1 into a `# cine` line with a `// mm:ss` frame line above it.

## 2. Word → event dictionary
| The VO says… | Show it as | `# cine` |
|---|---|---|
| a number / money | it counts and slams; cash/coins land | `hero="$X;fx:count"` · `fg="@cash"` |
| a person's name (first mention) | real cut-out slaps on a third + nameplate | `mid="id;lab:NAME"` |
| a date / year | typed date card | `date="MARCH 1987"` or `fx=date:` |
| a place | real plate behind, blurred | `bg=<plate>` |
| "but", "until", "then" (the turn) | colour changes; red creep starts (crisis) | next beat `act=doubt` / `fx=red;at:but` |
| a claim, a promise | bubble on the speaker / quote card | `bubble:` / `quote:` |
| a lie / excuse / failure | red X strikes it on the next word | `strike:b1` |
| growth | chart draws up, gold | `chart:up` |
| decline / losses | chart draws down, red label | `chart:down;lab:-90%` |
| press / public opinion | headline storm, wall of photos | `headline:` ×3 · `bg="wall:…"` |
| acquisition / money moving | gold leading line A → B, whip cut | `line:1>2` · `trans=whip` |
| a rival appears | slides in from the opposite side, flipped | `in:slideR;flip` |
| power lost / fired | stamp VOTED OUT / FIRED, grey | `stamp:` |
| death of the company | shatter + burn-swap to $0 + red flash, then 1 word on black | `shatter:` `to:$0` `flash:red` · S18 |
| the lesson | spotlight, one red word, the pill drops | S21 |
| a punch word | crash zoom | `crash=<word>` |
| a place / expansion | real map, pin drops, route arcs, countries light up | `bg=world` · `pin:` · `route:` · `hl=` |
| "the document says…" | real scan, highlight the line, magnify it | `mid=<scan>;style:print` · `mark:1` · `lens:1` |
| an archive moment (ad, interview, news) | the real clip plays in a TV | `mid="clip:<id>;style:tv"` |
| years passing | timeline marker races | `timeline:` · `trans=whip` |
| the market reacts | ticker + chart | `ticker:` · `chart:` |
| the bill / the cost | receipt tally, total slams | `tally:` |
| then vs now | split, halftone vs colour | `split:` · `tone:halftone` |
| the culprit / the one person | light closes on one face | `spot:` |
| into the past | film burn + paper + halftone | `burn` · `act=flash` |
| the thesis | words build on black | `kin:` |
| "look at this" on a document | marker circle, arrow, underline | `circle:` `arrow:` `underline:` |
| hidden / covered up | black bars, then revealed | `redact:` (`reveal:`) · `scan:` |
| who is connected | cork board, pinned prints, red string | `bg=cork` · `string:1>2>3` |
| a partnership breaks | the photo tears in half | `rip:1` · `trans=tear` |
| the past is destroyed | the photo burns away | `burnaway:1` · `embers` · `smoke` |
| everyone said the same | screenshots slam on one spot, faster | `matchstack:` |
| the cast of the story | polaroids drop on a desk | `bg=wood` · `polaroids:` |
| compared with giants | bar race, area circles, market share | `bars:` `circles:` `donut:` |
| how many people | unit chart / crowd, the losers turn red | `dots:;people` · `crowd:;gone:` |
| money burning per day | mechanical counter, cash tower | `odo:` `stack:` `pulse` |
| how long it lasted | days crossed out | `days:` |
| the business model | flow diagram, the broken step red, coins moving | `flow:` `coinflow:` |
| the internal truth | a memo types itself, stamp | `memo:` |
| the news breaks | spinning front page | `spin:` |
| the public asks | search bar + notification | `search:` `notify:` |
| a person introduced | documentary lower third | `lower:Name~Role` |
| the unknown player | black silhouette + spotlight | `tone:shadow` · `spot:` |
| the realisation | dolly zoom + heartbeat + selective focus | `cam=vertigo` · `pulse` · `focus:` |
| an era | VHS / halftone / sepia + typed date | `vhs` · `tone:halftone|sepia` · `date` |
| a raid / crisis | police strobe, flicker | `siren` · `flicker` |
| the party / the hype | money rain, confetti, light rays | `moneyrain` `confetti` `rays` |
| into a detail and out | infinite zoom then smash cut | `zoomto:` · `trans=slam` |

## 3. Rhythm
- 4–6 s per beat; 3–6 events per beat (lint ev/s 0.9–1.6). Events on STRESSED words — read the line aloud and mark the stresses first.
- Max 1.5 s between events in the hook minute, 2 s elsewhere; a payoff may hold ≤ 2.5 s at the end of a beat.
- Alternate: wide → close · left subject → right subject · photo-heavy → type-heavy · busy → empty.
- Every 60–90 s: a re-hook beat (new number, new question, a twist) — mark them in the treatment.
- Every 2–3 min: a burst (S23) or headline storm (S11).
- Before the biggest hit: 0.3–0.5 s silence in the VO (`…`) + a dark, nearly empty frame; then the slam.

## 4. Act colour across a 10-minute film
setup (0:00–1:30 warm) → rise (1:30–4:30 gold) → doubt (4:30–6:30 teal, red X allowed) → fall (6:30–8:30 black/red) → after (8:30–9:30 desaturated) → lesson (9:30–10:00 spot). The cold open (first 20 s) may flash-forward into `fall` and then cut to `setup` with a date card — the contrast IS the hook.

## 5. Self-review before lint (5 questions per beat)
1. What is the ONE thing the viewer must understand in this sentence — is it the biggest thing on screen?
2. Which word is stressed — what lands on it?
3. Is there a real photo, and is it staged (cut, toned, bordered, on a third)?
4. Is the colour the act's colour?
5. Is this composition different from the previous beat (camera, side, scale)?
