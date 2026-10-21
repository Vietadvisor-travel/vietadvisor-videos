# Visual modes: show the idea, not just a photo with text on it

Read this before you write a single `# cine` line. Most bad films have the same fault. Every sentence becomes the same
picture: a photo, a slammed word, a stamp, a shake. Each shot looks fine on its own, but over ten minutes it's a slideshow.

The channels people study (Kurzgesagt, Vox, Johnny Harris, LEMMiNO, Polymatter, Wendover, MagnatesMedia, Coffeezilla,
Bloomberg Quicktake, Fern) all do one thing differently: **every sentence gets the picture that explains it.** A cause chain
is shown as dominoes. A route is a line drawn on a map. A lie is the post itself, quoted word for word. A price crash is a
line the camera chases down. A hidden problem is an iceberg the camera dives under.

This file is the full vocabulary of the engine, organised by the kind of content each mode shows. Each line gives what the
mode is, when to use it, and its syntax. Full parameter lists are in the header comment of each engine file.

## 0. The families (71 scene types + the free composer + custom code scenes + atmosphere)
| Family | What it is | Files |
|---|---|---|
| **BUILD (v5.2)** | the picture invented for this sentence: real images, icons, text, numbers, arrows + verbs on words (`build.md`) — **≥ 25 % of beats; invent first, use a template second** | `pp_build.js` |
| **CUSTOM (v6)** | the signature moments: an animation written as code for ONE sentence (`#! scene … #! end` + `fx="code:<name>"`), with real images, icons, text, counters, lines and atmosphere on word timing (`custom-scenes.md`). **3–6 per episode**, never reused | `pp_custom.js` |
| **LIVING PICTURE (v5)** | a sharp real photo with the subject lifted onto its own plane (rim light, contact shadow, breathing), a foreground element, depth-aware atmosphere and light; the camera rig flies through the planes | `pp_art.js` (`scene`, `air`) |
| **COLLAGE** | real photos as cut-outs and prints on 3 planes, with type, stamps, marker annotations and the v3 devices on top | `pp_cine*.js` (`device-catalog.md`) |
| **SET PIECE** | a 2D paper-cut world that *acts out* the idea: objects fall, tip, sink, pull, explode | `pp_sets.js`, `pp_modes2.js` |
| **SCREEN / DIAGRAM MODE** | the real artefact or the mechanism: a browser page, a post, a chat, an org chart, a funnel, a chased chart | `pp_modes.js`, `pp_modes2.js` |
| **3D SHOT** | a real perspective world with light and its own flying camera: desk, map table, globe, boardroom, skyline | `pp_3d.js` |
| **MAP (2D)** | the flat paper map with pins, routes and highlighted countries | `pp_cine2.js` (`bg=world`) |
| **FAST (v4.2)** | depth and motion drawn in 2D: isometric cities and bars, perspective cards, rollers, liquids, boards. They look 3D or animated and render 3–8× faster than real 3D | `pp_modes3.js` |

**Variety budget for a 10-minute episode (≈ 120–160 beats):**
- **LIVING PICTURES:** ≥ 20 % of beats. This is the default for a person, a place or a moment: real photo + depth + air.
- **COLLAGE:** at most 25 % of beats. That's the connective tissue, so it isn't the main show.
- **SET PIECES:** at least 6 different ones.
- **SCREEN/DIAGRAM MODES:** at least 6 different ones.
- **FAST MODES:** at least 6 different ones. They are the default way to give a beat depth or motion.
- **3D SHOTS:** 2–4 signature moments only (the opening, an act turn, the climax), **at most 10 % of beats**. A CPU-only
  render machine draws a 3D frame 3–8× slower than a 2D one; one 3D-heavy act can take an hour to render. Where a fast
  mode says the same thing, use it: `isocity` instead of `city3d`, `isobars` instead of `stacks3d`, `coverflow` instead
  of `gallery3d`, `spinpaper` instead of `title3d`, `candles` instead of `monitors3d`.
- **MAPS:** wherever a place or a journey matters. The 2D map (`bg=world`) is cached and fast; `map3d`/`globe3d` are 3D.

Two more limits:
- No single mode may appear in more than about 15 % of beats.
- The same mode never appears 3 times in a row.

`pp_lint` and `pp_shotscript check` enforce these limits.

## 1. Choose by content (the decision table)
**The fast modes come first in each row.** Use a 3D shot only when the moment is a signature moment.

| The sentence is about… | Show it as… | Mode(s) |
|---|---|---|
| **a person at a moment** (the founder on launch day, the CEO the night it fell) | their real photo, lifted off its background, the camera pushing in, air and light of the moment | `scene` (plate + subj + air + light) |
| **a place / a mood** (the office, the city, the factory at night) | the real place photo with depth and atmosphere (rain, smoke, dust in light) | `scene` · `air` |
| **money pouring in / burning** | bills raining, embers, smoke over the real photo | `air:bills` · `air:embers,smoke` |
| **paper chaos / leaked documents** | papers flying over the document plate | `air:papers` |
| **a percentage / "X out of 100"** | an icon array, the share turning red | `units` |
| **one huge number** (raised, valued, paid) | mechanical rollers spinning to it | `rollnum` · `title3d` |
| **cash running out** | a glass tank draining | `tank` · `hourglass` |
| **who led, year by year** | a bar-chart race | `race` |
| **two people / companies head to head** | split-screen VERSUS; the loser goes grey | `faceoff` · `tugwar` |
| **what it all cost** | a receipt prints, the total gets stamped | `invoice` · `waterfall` |
| **a share price crash** | candlesticks and a ticker tape | `candles` · `trend` |
| **reserves / the war chest** | the vault door spins open, empty | `vault` · `stacks3d` |
| **a gamble / luck** | a slot machine decides | `slots` · `bet` |
| **viral growth / contagion** | a grid of dots catching it from neighbours | `outbreak` |
| **risk / pressure rising** | a gauge needle swinging into red | `meter` |
| **time passing** ("a year later") | desk-calendar pages tearing away | `calendar` · `days` |
| **launches cancelled / a slate of results** | an airport split-flap board | `flapboard` |
| **"it made the front page"** | the spinning newspaper lands | `spinpaper` · `headline` |
| **who is to blame** | a dark stage, the spotlight picks one | `spotlight` |
| **the options / the lineup of rivals** | photo cards in perspective, one steps forward | `coverflow` · `logos` |
| **expansion: stores, branches, a city of assets** | an isometric city rises block by block, then sinks | `isocity` · `city3d` |
| **a number over the years** | isometric 3D bars | `isobars` · `city` |
| **a new chapter / a breather** | layered paper landscape with the title | `papercut` |
| **a person** entering the story | their file, typed in, verdict stamped later | `profile` · collage cut-out + `lower` |
| a **group of people / hierarchy** | who reports to whom, who gets cut | `org` · `boardroom3d` |
| **a decision by a board / resignations** | the table, chairs emptying | `boardroom3d` |
| **a place** | a pin dropping on paper, the city plate | `bg=world` + `pin` · `map3d` |
| **a journey / expansion / supply route** | the route drawing itself, a plane/ship flying it | `map3d` (regional) · `globe3d` (intercontinental) · `route` |
| **a period of years** | driving down the road through time | `timeline3d` · `timeline` |
| **a number (big)** | a solid object: title, pile, stack, tower | `title3d` · `money3d` · `stacks3d` · `odo` |
| **a comparison of sizes** | towers side by side, coin stacks, circles | `stacks3d` · `city`/`city3d` · `circles` · `scale` |
| **growth over years** | a skyline that grows | `city3d` · `city` · `bars` |
| **a price / stock / curve** | the line the camera chases, events pinned on it | `trend` · `coaster` (volatility) · `monitors3d` (panic) |
| **market share** | a cake with one slice pulled out | `pie3d` · `donut` |
| **conversion / drop-off** | the funnel and the % lost at each step | `funnel` |
| **money in, money out / profit** | a waterfall; money flowing through pipes | `waterfall` · `pipes` · `coinflow` |
| **cash running out / deadline** | sand running out; the fuse | `hourglass` · `bomb` · `days` |
| **the business model / the original idea** | sketched in pen on a napkin; the flow of value | `napkin` · `flow` · `pipes` |
| **production / scale of output** | the conveyor counting | `conveyor3d` |
| **a cause chain** ("which led to…") | dominoes | `domino` |
| **a trade-off / verdict / imbalance** | the scale tipping | `scale` |
| **a fragile structure / one dependency** | the Jenga tower, the block pulled | `tower` |
| **what's hidden vs what's visible** | the iceberg, camera dives | `iceberg` · `zoomchain` |
| **hype / valuation / bubble** | the bubble inflating, then popping | `mania` |
| **a rivalry / strategy / the decisive move** | chess with photo pieces; tug of war | `chess` · `tugwar` · `versus` |
| **a reckless bet** | all in at the poker table | `bet` |
| **hidden control** | the puppet strings | `strings` |
| **collapse of the foundation** | the ground cracks | `crack` · `sinking` · `shatter` |
| **a company going under** | the ship takes on water, labels float | `sinking` |
| **a career rise and fall** | the ladder, and the slip | `ladder` |
| **a public statement / lie** | the post itself, verbatim, likes rolling | `post` · `quote` |
| **private messages / leaks** | the chat, typing dots, then the line | `chat` · `memo` |
| **a news report / article** | the browser scrolls to the paragraph, marker highlights it | `browser` · `headline` · `spin` |
| **a public event everyone saw** | the TV bulletin: BREAKING, ticker | `newsroom` · `matchstack` |
| **documents / investigation** | the case file opens on the desk | `desk3d` · `mark` · `lens` · `redact` · `scan` · `string` |
| **"inside that, there was…"** | infinite zoom through image after image | `zoomchain` |
| **a product / app** | the real phone with the real screen, turning; the screen cracks | `phone3d` · `search` · `notify` |
| **the HQ / the company as a place** | the tower at dusk, floors going dark, FOR SALE | `building3d` |
| **the competition / crowded market** | the grid of rivals, zoom into one | `logos` |
| **history / archive** | the projector beam, slides clicking | `projector` · `clip:` in a TV · `halftone` · `burn` |
| **a sequence of short beats** ("The pitch. The launch. The party.") | comic panels slamming in | `panels` · `polaroids` |
| **evidence connecting people** | the cork board, red string | `string` (bg=cork) |
| **the thesis / the lesson** | words on black, one at a time | `kin` |

## 2. The catalogue
Every mode goes in `fx=` as `name:x;key:val;…`. Use one main mode per beat, leave `mid=`/`fg=` empty, and add overlay
devices only when they serve the beat. Inside a mode, `~` separates list items. `|` always ends the event.

### Set pieces: acted metaphors (`pp_sets.js`, `pp_modes2.js`)
| Mode | Key params | Showpiece moment |
|---|---|---|
| `domino` | `n:6;lab:A,B,…;img:…;fall:<word>` | the chain falls on the word |
| `scale` | `left:LABEL\|@img;right:…;tip:<word>;to:-1..1` | the beam tips with a damped bounce |
| `tower` | `rows:9;lab:…;block:<n>;pull:<word>;fall:<word>` | the block slides out, then the collapse |
| `iceberg` | `tip:<label>;deep:a,b,c;dive:<word>` | the hidden labels appear under water (pair with a `drop` camera) |
| `mania` | `from:1;to:47;unit:B;lab:…;pop:<word>;after:$0` | the bubble inflates with a counter, then pops to $0 |
| `chess` | `a:@img;b:@img;move:<word>;take:<word>` | the king with the photo face takes the other |
| `city` | `vals:…;lab:…;unit:B;grow:<word>;fall:<n>@<word>` | the skyline grows, one tower topples |
| `hourglass` | `lab:…;left:9 MONTHS;dur:5` | the sand runs out |
| `strings` | `img:a,b,c;lab:<controller>;pull:<word>` | the bar jerks and the photos dance |
| `crack` | `img:<id>;lab:…;split:<word>` | the ground opens and the photo sinks |
| `pipes` | `nodes:A>B>C;img:…;cut:<word>` | coins flow, then the pipe breaks |
| `ladder` | `steps:6;img:<id>;lab:…;slip:<word>` | the climb, then the fall |
| `bet` | `lab:…;chips:3;allin:<word>;lose:<word>` | the chips slide in, then LOST |
| `sinking` | `lab:<ship>;notes:A~B~C;rise:<word>` | the hull tilts, the water rises, labels float |
| `coaster` | `pts:3,8,2,9,1;img:<rider>;lab:…` | the photo-cart rides the numbers |
| `tugwar` | `left:@img;right:@img;win:left\|right;pull:<word>` | the rope lurches, the loser leans in |
| `bomb` | `lab:…;secs:10;boom:<word>` | the fuse burns, the timer counts down, BOOM |

### Screen and diagram modes (`pp_modes.js`, `pp_modes2.js`)
| Mode | Key params | Use |
|---|---|---|
| `browser` | `img:<screenshot>` or `title:…;src:…` · `url:…;hl:.42,.5;scroll:<word>;zoom:<word>` | the article, scrolled to the sentence, highlighted, zoomed |
| `post` | `name;handle;img;text;likes;date` | the public statement, typed in verbatim |
| `chat` | `msgs:A>text~B>text;names:A=CEO,B=CFO;rate:1` | leaked messages, typing dots first |
| `zoomchain` | `img:a,b,c;pts:x,y~x,y;go:<w>~<w>` | infinite zoom: each image hides the next |
| `trend` | `pts:…;lab:…;marks:3=IPO~5=SCANDAL;reveal:<word>` | the chart the camera chases; pull back at the end |
| `profile` | `img;name;role;stats:AGE=52~STAKE=31 %;verdict:FIRED;vat:<word>` | the person's file |
| `panels` | `img:a,b,c,d;lab:…;rate:.55` | comic grid for a staccato list |
| `org` | `nodes:CEO>CFO,CTO;CTO>A,B;img:CEO=id;cut:CFO@<word>` | hierarchy, someone gets crossed out |
| `funnel` | `steps:VISITS=1000000~PAYING=4000` | the drop-off, −% in red |
| `waterfall` | `bars:REVENUE=+100~COSTS=-70~RESULT=-15;pre:$;unit:M` | revenue to result |
| `napkin` | `draw:box>arrow>box>arrow>$;lab:A,B` | the idea sketched in pen |
| `newsroom` | `img:<photo\|clip:id>;head;ticker;tag:BREAKING` | the TV bulletin |
| `logos` | `img:…;lab:…;pick:<n>;zoom:<word>` | the crowded market, zoom into the one |
| `projector` | `img:a,b,c;rate:1.2` | archive slides in a projector beam |

### 3D shots (`pp_3d.js`): each has its own camera, so don't add `shot=`
| Mode | Key params | Camera |
|---|---|---|
| `desk3d` | `img:a,b,c,d;lab:<tab>;open:<word>;spread:<word>;hero:<n>` | top-down → crane down to the hero print |
| `map3d` | `box:lon0,lat0,lon1,lat1;route:lon,lat>lon,lat;by:plane\|ship;pins:…~…;hl:Country;go:<word>;dur:4` | over the start pin → chase the vehicle → wide |
| `globe3d` | `pins:lon,lat,LABEL~…;hl:Country;go:<w>~<w>` | from space, turning to each place; arcs fly |
| `gallery3d` | `img:…;lab:…;land:<word>` | dolly through floating prints to the last one |
| `timeline3d` | `years:…;img:…;go:<w>~<w>` | drive down the road from year to year |
| `city3d` | `vals;lab;unit;grow:<word>;fall:<n>@<word>` | low orbit around a data skyline |
| `title3d` | `text:$1.75B;sub:…;slam:<word>;drop:1` | swing round a solid title while the light sweeps it |
| `money3d` | `to:1;rain:<word>;burn:<word>` | bills rain onto a pile; the pile burns |
| `phone3d` | `img:<screenshot>;lab;turn:<word>;crack:<word>` | product reveal; the screen cracks |
| `boardroom3d` | `img:…;lab:…;head:<img>;empty:<word>;keep:1` | dolly down the table; chairs empty |
| `building3d` | `floors:22;lab:<sign>;dark:<word>;sale:<word>` | crane up the tower; floors go dark |
| `conveyor3d` | `to:175;unit:shows;lab;stop:<word>` | track along the line; the counter runs; it stops |
| `pie3d` | `shares:A=45~B=30~C=2;pull:<n>@<word>` | orbit; one slice slides out |
| `stacks3d` | `vals;lab;pre;unit` | low pan along coin towers |
| `monitors3d` | `img:…;tick:A,B;crash:<word>` | push into the trading wall; it turns red |

### Fast modes (`pp_modes3.js`): depth and motion at 2D speed (~40–110 ms a frame)
`at:<word>` is when the mode starts (default: the beat start). `go:<word>` is its payoff moment. Add `shot=` like any
2D mode; the camera rig moves them.

| Mode | Key params | Showpiece moment |
|---|---|---|
| `isocity` | `n:16;hi:<n>;lab:<label on hi>;grow:<word>;fall:<word>` | isometric blocks spring up; on the word they sink, back to front, in red |
| `isobars` | `bars:2019=12~2020=30~2021=80~2022=20;pre:$;unit:B` | isometric 3D bars rise; a final drop goes red |
| `coverflow` | `img:a,b,c,d,e;lab:…;pick:3;go:<word>` | cards slide past in perspective; the pick steps forward |
| `spinpaper` | `head:…;sub:…;img:<photo>;name:THE DAILY;date:…;at:<word>` | the newspaper spins in, flash on landing |
| `spotlight` | `img:a,b,c,d;lab:…;pick:2;go:<word>` | dark stage; the light sweeps and lands on one |
| `units` | `n:100;hit:37;lab:<what>;icon:person\|coin\|house;go:<word>` | 37 of 100 icons turn red, the % counts up |
| `tank` | `from:1750;to:120;pre:$;unit:M;lab:CASH LEFT;go:<word>` | the liquid drains through the tap; red below 25 % |
| `race` | `years:2017,2018,2019;rows:A=1,5,9~B=3,4,2;pre:$;unit:B` | bars re-rank across the years |
| `rollnum` | `to:1750000000;pre:$;lab:…;at:<word>` | odometer rollers spin, right to left, and lock |
| `faceoff` | `left:<img>,<LABEL>,<stat>;right:…;win:left\|right;go:<word>` | panels slide in, VS slams; the loser goes grey |
| `invoice` | `items:Content=1100000000~Ads=400000000;total:SPENT;stamp:LOST;go:<word>` | the receipt prints line by line; the stamp hits |
| `candles` | `pts:10,12,15,20,8,3;lab:<ticker>;crash:<word>` | candlesticks build; red after the crash; ticker tape |
| `vault` | `lab:…;open:<word>;inside:empty\|gold\|<img>` | the wheel spins, the door swings open |
| `slots` | `reels:A~B~C;lab:<what is gambled>;go:<word>` | the reels spin and stop one by one |
| `outbreak` | `seeds:3;lab:USERS;to:1000000;at:<word>;speed:9` | it spreads dot to dot; the counter climbs |
| `meter` | `from:20;to:96;lab:RISK;at:<word>` | the needle swings into red and trembles |
| `calendar` | `from:2019-10;n:12;at:<word>` | months tear off and fly |
| `papercut` | `lab:<title>;sub:<line>;rise:<word>` | paper hills rise in layers with parallax, the sun comes up |
| `flapboard` | `title:DEPARTURES;rows:QUIBI=CANCELLED~VINE=CLOSED;at:<word>` | letters flip into place; failures in red |

### Living pictures & atmosphere (`pp_art.js`): real photos made alive (~150–220 ms a frame with camera)
| Mode | Key params | Showpiece moment |
|---|---|---|
| `scene` | `plate:<photo>;clean:<photo without subject>;subj:<cutout>@x,y,h~…;in:<word>;fg:<element>@x,y,h;air:dust,rays;light:sweep@<word>\|sun@.7,.2\|flicker\|neon` | the subject floats off the photo with rim light; air drifts at three depths; light sweeps on the word |
| `air` (overlay, any beat) | `kind:dust\|bokeh\|smoke\|fog\|rays\|rain\|snow\|embers\|ash\|sparks\|papers\|bills\|confetti\|leak\|lightning;dens:1;at:<word>` | atmosphere with depth over collage, sets or modes |

Recipe: `shot="ms|mcu:pt:.5,.4@<word>/dolly"` + `scene` gives the classic documentary 2.5D push. Use 2–3 planes, keep the
subject-to-background parallax at about 2–3:1, and use one light idea per shot (motion.md §5).

### Comedy tools (`pp_fun.js`): real photos and edit timing only, never cartoon characters (`humor.md`)
| Mode | Key params | The laugh |
|---|---|---|
| `freeze` | `img;pt:.42,.35;cap:Yep. That's Jeff.;sub:…;at:<word>` | record scratch, freeze-frame, red circle |
| `expect` | `left:<img>,EXPECTATION;right:<img>,REALITY;go:<word>` | the sad reality drops in |
| `cutaway` | `text:MEANWHILE…;sub:AT NETFLIX` | the comic title card |
| `dramatic` | `img:<face>;pt:.5,.35` | three punch-ins: dun… dun… DUN |
| `math` | `eq:STARS+SHORT SHOWS=$0;go:<word>` | the silly equation |
| `meme` (overlay) | `text:EVERYTHING IS FINE;at:<word>` | the bold caption |
| `aside` (overlay) | `text:(It was not fine.);at:<word>` | the deadpan narrator |

### Collage and overlay devices (v3, still the glue): `device-catalog.md`
Real cut-outs (`mid=`), prints (`fg=`), plates (`bg=`), and these overlays:
- **Marker on documents:** `circle`, `arrow`, `underline`, `scribble`, `redact`, `scan`, `mark`, `lens`
- **Paper:** `headline`, `spin`, `memo`, `quote`, `seal`, `receipt`
- **Data:** `bars`, `donut`, `dots`, `circles`, `odo`, `days`, `crowd`, `stack`, `gauge`, `stockcard`, `tally`, `chart`
- **Evidence:** `string`, `callout`, `lower`
- **Image FX:** `rip`, `burnaway`, `glitchimg`, `matchstack`, `polaroids`
- **Atmosphere:** `letterbox`, `focus`, `vhs`, `rain`, `smoke`, `rays`, `embers`, `pulse`…
- **Type:** `kin`, `hero=`, `sup=`

## 3. Sequencing: how modes follow each other
- **Alternate scale and family.** A 3D establishing shot goes to a close collage, then a screen mode, then a set piece. Never
  run three diagrams in a row.
- **Bridge on meaning** (`shot-script.md` §4). You can zoom through the print in `desk3d` into the `browser` page. The
  `trend` line can turn into the `coaster` track. The last domino falls and the cut goes to `crack`. A pin on `map3d`
  leads to a `profile` of the person there.
- **One signature 3D shot per act turn.** Keep them rare enough to land.
- **Overlays are seasoning.** In a set piece or 3D shot, add at most one overlay: a `lower` name, a `kin` word, or a
  `letterbox`.
- **Restraint.** `shake`, `flash`, `stamp`, `glitch` and hero slams are punctuation (`pp_lint` caps them per minute). The
  modes carry the energy. A film that shakes every 5 seconds feels cheap, the "rung rung giật giật" effect.

## 4. When nothing fits
0. **v6: write it.** If the sentence deserves a picture no template has, write a custom scene (custom-scenes.md): the
   exact animation, on its words. The other steps below are fallbacks, not the first choice.
1. Ask what the viewer should see if this sentence were a scene in a film. It might be an object, a place, a document,
   or a change in a number.
2. If that's a mechanism, use a diagram mode (`napkin`, `org`, `pipes`, `waterfall`).
3. If it's a feeling or a judgement, use a set-piece metaphor.
4. If the moment needs depth, use a fast mode; if it is a signature moment of the film, use a 3D shot.
5. If it's a person or a plain fact, use the collage with a real camera move (`camera.md`).

Write the choice in the visual script (`shot-script.md`) before storyboarding.
