# STOCK LIBRARY PLAN: the complete shared library (target ≈ 1,500 clips)

This is the finished shape of the channel's shared stock library: what a business, money and crime documentary needs
again and again, minute after minute. Muse fills it until every row is green. Claude then never waits for generic
footage, and Muse researches only each episode's own people, places and events.

**Progress:** `cd studio && python3 tools/pp_stock.py coverage` reads this table and counts the library on Drive by
id prefix (`stock_<category>_…`). Each row shows have / target and the gap. The table below is the source of truth:
- the **category** column is the exact id prefix;
- the **target** column is the number of clips wanted;
- **what** lists the subjects to cover;
- **search** gives starting queries.

## Three phases, then demand-driven
1. **Phase 1, breadth (this table, about 1,500 clips):** every category usable.
2. **Phase 2, depth (target about 3,000):** the categories every episode leans on go to 2–3× their target, so a
   viewer who watches every episode does not see the same shot again within a month:
   - office, money, screen, phone, finance, people and city to ×3;
   - law, documents, tech, texture, archive and emotion to ×2.
3. **Phase 3, precision (v6.6, the owner's call: "still too few, needs to be more varied and more specific"):** the
   rows marked P3 below. They are the concrete actions business-crime stories narrate (sign, wire, pack a suitcase,
   board a jet, raid, pitch on stage, log in, get frozen out), shot so a sentence can be illustrated literally. Each
   P3 clip's `desc` starts with the VERB of the action ("signs a contract at a glass desk, close-up on the pen…").
4. **Always, demand-driven:** each film logs the shots it needed and could not find
   (`pp_stock.py want …` → `jobs/STOCK_WISHLIST.md`). Muse fills the wishlist FIRST, before any plan gap. Real need
   beats guessing.

More is not automatically better. 50 clips that look alike are worth less than 15 different ones. Depth means new
angles, places, light and actions, never near-duplicates.

## Rules for every clip (same as MUSE_DRIVE.md)
- **Format:**
  - 2–8 s, trimmed to the best moment;
  - H.264, CRF ≈ 20, no audio;
  - **≥ 1920 px wide preferred**, ≥ 1280 px minimum;
  - a real camera, no AI video, no visible logos as the subject, no faces looking into the lens selling something.
- **Id:** `stock_<category>_<what>_<nn>` with the category exactly as written here, for example
  `stock_money_cash_counting_03` or `stock_screen_stock_ticker_02`.
- **`clips.json` per clip:** `desc` (what, shot size, direction of movement, where the subject sits), `tags`, `author`,
  `source`, `source_url`, `license`. No author, no entry.
- **`desc` describes what the 2–8 s actually SHOW, after watching them, never the source video's title:**
  - Bad: "2014-06-21 President Obama's Weekly Address. Use for beats about workplaces…".
  - Good: "slow push along an empty open-plan office at night, monitors glowing, no people; light from the left".
  - The director picks clips from the catalogue by this text, so a title-only desc makes the clip unfindable.
- **The generic library holds NO identifiable real people or real named events:**
  - no politicians, CEOs or celebrities;
  - no real trials or hearings of named people;
  - no conference talks;
  - no product-launch or expo videos.
  - A generic clip reused in another story would put a real person into a story that is not theirs (misleading and a
    legal risk).
  - Crowds, hands, backs, silhouettes and distant people are fine.
  - Real people belong only in an episode's own clips pack, for that episode's story.
- **Variety inside a category:** every subject in 3–4 shot sizes (wide / medium / close / macro), moving in different
  directions, day and night, different countries. Never 5 clips that look the same.
- **Sources:**
  - Pexels, Pixabay, Mixkit, Coverr, Videvo (free-licence clips only);
  - Wikimedia Commons and archive.org for archival and public-domain material;
  - NASA, ESA and US government footage (public domain).
  - Record the licence exactly.
- **Packing:** zips ≤ 1.9 GB, numbered after the last one on Drive. Upload with `pp_drive.py put … --to _stock`.

## The plan
Older ids count toward these rows (no repack needed; new clips use the plan names):
aliases: bank=finance, crowds=people, datacenter=tech, hotel=place, smartphone=phone, warehouse=logistics, weather=nature

| category | target | what | search |
|---|---|---|---|
| office | 70 | open-plan offices full and empty, desks at night, typing hands, meetings, whiteboards, glass corridors, lobby, elevator, boardroom table, coffee, people leaving at night | office night empty, typing keyboard close, business meeting, boardroom |
| money | 70 | cash counting by hand and machine, banknote close-ups (several currencies), coins falling, stacks, wallets, card payment, ATM, gold bars, piggy bank, burning money (prop) | cash counting machine, money close up, coins falling, gold bars |
| screen | 80 | stock tickers, trading charts going up and down, code scrolling, spreadsheets, dashboards, loading bars, emails arriving, glitch screens, old CRT monitors, laptop in the dark | stock market screen, trading chart, code scrolling, spreadsheet monitor |
| phone | 50 | smartphone in hands, notifications, scrolling feeds, typing messages, phone face down buzzing, old mobile phones, phone call at night | smartphone hands scrolling, phone notification, texting close up |
| finance | 50 | stock exchange floors, traders, Wall Street signs, bank exteriors, vault doors, safe deposit boxes, signing contracts, handshake, calculator, receipts | stock exchange floor, bank vault door, signing contract, handshake business |
| tech | 60 | servers, data centres, circuit boards, chips macro, cables, fibre optics, robots, assembly of electronics, LED lights blinking, startup office | server room, circuit board macro, fiber optic, data center aisle |
| factory | 60 | assembly lines, robots welding, conveyor belts, packaging, steel mill, workers with helmets, machines close-up, quality control | assembly line factory, robotic arm, conveyor belt, steel mill |
| retail | 50 | shop aisles, checkout, shopping bags, mall crowds, empty mall, online order boxes, delivery vans, closing-down sale, shelves restocked | supermarket aisle, shopping mall crowd, empty mall, delivery boxes |
| logistics | 50 | container ports, cranes, cargo ships, trucks on highways, warehouses, forklifts, parcels on belts, delivery driver | container port, cargo ship, warehouse forklift, parcel conveyor |
| law | 60 | courthouse exteriors, gavel, courtroom (empty), police cars and lights, handcuffs, police tape, prison bars and corridors, FBI-style raid (staged stock), documents in boxes, press outside court | courthouse steps, gavel close up, police lights night, prison corridor |
| documents | 50 | paper shredder, stamps, files and folders, newspapers printing and stacks, typewriter, signature pen, envelopes, magnifying glass on text, highlighted lines | shredder paper, newspaper printing press, signing document pen, files folders |
| media | 40 | press conference cameras, flashing photographers, microphones, TV studio, news van, interview setup, applause, conference stage | press conference cameras, paparazzi flash, microphone podium, conference stage |
| people | 80 | crowds walking (no faces in close-up), commuters, silhouettes, a person alone at a window, hands close-up, worried person at night, celebration, applause, sad person, people waiting in a queue, protest | crowd walking street, silhouette window, hands close up, queue people |
| emotion | 40 | rain on a window, empty chair, clock ticking, candle going out, broken glass, door closing, light switching off, sunrise hope, storm arriving | rain window, clock ticking close, empty chair, door closing |
| city | 120 | skylines and aerials by day and night: New York, London, Hong Kong, Tokyo, Singapore, Dubai, Shanghai, San Francisco, Frankfurt, Seoul; plus streets, traffic, timelapses | city aerial night, skyline timelapse, downtown drone |
| place | 60 | Silicon Valley campuses, suburban houses, villas and mansions, yachts, private jets, luxury hotels, casinos, deserts, small towns, abandoned buildings | mansion aerial, yacht ocean, private jet, abandoned building |
| airplane | 40 | takeoff, landing, wing in flight, cabin, departures board, passport control, private jet | airplane takeoff, departures board, passport stamp |
| airport | 20 | terminals, crowds with luggage, runways, security check | airport terminal, luggage carousel |
| train | 25 | stations, platforms, passing trains, subway | train station platform, subway crowd |
| traffic | 25 | highways, intersections, timelapse lights, taxis | highway traffic timelapse, intersection aerial |
| construction | 30 | cranes, building rising, demolition, workers, blueprints | construction crane timelapse, building demolition |
| energy | 40 | oil rigs, refineries, pipelines, gas stations, wind turbines, solar farms, power lines, electricity pylons, coal | oil rig, refinery night, power lines, solar farm aerial |
| food | 30 | restaurant kitchens, fast food, coffee shop, farms and fields, supermarket food, delivery bikes | restaurant kitchen, coffee shop barista, farm field aerial |
| health | 30 | labs, pipettes, blood samples, microscopes, hospitals, pills, syringes, test tubes | laboratory pipette, microscope, test tubes, hospital corridor |
| car | 30 | car factories, cars on roads, electric charging, showroom, crash test (stock), dashboards | car assembly line, electric car charging, car showroom |
| nature | 40 | storms, waves, clouds timelapse, fire and embers, smoke, fog, sunset, ice cracking, drought | storm clouds timelapse, fire embers, smoke black background, waves crashing |
| texture | 50 | film grain, light leaks, dust in light, ink in water, paper textures moving, bokeh, glitch, smoke on black, sparks: overlays for compositing | light leak overlay, ink in water, dust particles light, sparks black background |
| abstract | 30 | lines of light, data flows, particles on black, graphs drawn by light, slow motion liquids | light trails, abstract data, slow motion liquid |
| archive | 60 | public-domain archival: 1920s–1990s offices, stock exchanges, factories, ads, city streets, computers of each decade (Prelinger / archive.org, NASA, US gov) | Prelinger archives office, 1980s computer, vintage stock exchange |
| crypto | 60 | P3: crypto apps and wallet screens on phones (no brand as subject), hardware wallets, mining rigs, crypto ATMs, candlestick charts on a phone in hand, QR-code payments, seed phrase on paper (blank/fake words) | crypto wallet app phone, mining rig, crypto atm |
| scam | 50 | P3: a pitch on a stage to an audience seen from behind, seminar rooms, people signing up on laptops, cash handed over a table, a recruiter on the phone, a slideshow of promises, a fake-luxury lifestyle shoot, victims reading bad news | seminar audience from behind, signing up laptop, cash handover |
| payment | 40 | P3: online banking login, wire transfer form being filled, transfer confirmed, card declined, bank statement scrolled, receipts printing, money app balance going to zero | online banking transfer, card declined, bank statement |
| investigation | 40 | P3: evidence boxes, documents spread on a table, hands turning pages, evidence bags, redacted pages, corkboard with strings, archive shelves, a detective's desk lamp, a laptop being imaged | evidence boxes, corkboard strings, redacted document |
| escape | 40 | P3: packing a suitcase at night, passport into a pocket, boarding a small jet, a car leaving a garage at night, an empty apartment, a burner phone, a boat leaving a harbour at dusk, airport taxi rank | packing suitcase night, boarding private jet, empty apartment |
| luxury | 40 | P3: champagne poured, gala dinner tables, penthouse view, yacht deck, jewellery, supercars, designer bags, a party crowd, a private chef | champagne pouring, gala dinner, penthouse night view |
| event | 50 | P3: arena and conference stages, keynote lights, audience from behind, confetti, stage smoke, LED walls, award ceremony, backstage corridors | conference stage lights, audience from behind, confetti stage |
| news | 40 | P3: newsrooms, printing presses, headline on a phone, reporters outside a courthouse, TV studio without channel logos, breaking-news style screen (no brand) | newsroom, printing press newspaper, reporters courthouse |
| ui | 40 | P3: browser loading, login and password screens, error pages, account frozen, inbox filling up, chat typing, social feed scrolling, notifications stacking (no real brand as subject) | login screen, error page, inbox notifications |
| world | 40 | globes, Earth from space (NASA), map-like aerials, borders, flags waving (no logos), world landmarks | earth from space NASA, globe spinning, flag waving |
