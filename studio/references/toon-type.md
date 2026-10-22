# Toon type — lettering designed into every shot (v10, Oct 2026)

User verdict: "fonts not impressive; a few words in a fixed place is boring — design the type per scene like a cartoon".
So: no fixed headline band on acted scenes. Every word on screen is placed, animated and voiced by the scene.

Fonts (all with full Vietnamese, preloaded with a Vietnamese sample in studio.html):
`toon` = Paytone One (house cartoon face) · `round` = Coiny (bubbly; its V reads like U — avoid words with V) ·
`comic` = Bangers (onomatopoeia: RẦM! WHOOOSH! HONK!) · `display` = Baloo 2.

`engine/library/toontype.js` → `TOON.word / burst / bubble / nametag / tape`
- **word**: per-letter pop / drop / slam / wave entries (staggered), wobble / bounce / wave idle, 3D extrusion, gradient, shine,
  auto-fit to 90 % width, staggered exit. Use for years, numbers, the one phrase of the beat ("ON A RAILWAY?!").
- **burst**: comic starburst + Bangers text for sounds and shocks (DING DING!, MOVE!, CRACK!, TWEET!). ≤ 1.2 s on screen.
- **bubble**: speech bubble with a tail to the speaker's mouth — gives the cast lines without voices ("Cà phê không?").
- **nametag**: introduce a character with a hand-drawn arrow ("DAVE").
- **tape**: a measuring tape that unrolls between two points with the number riding on it (1.5 M, 8.6 M).

Placement rules: near the thing it describes (on the wall, by the mouth, along the train, on the ground), never on a face, never
in the caption band; one hero word per beat + bursts/bubbles as reactions; enter on the stressed word, leave before the next idea.

# Hook — the first 3 seconds (v10)
Open INSIDE the moment, not on a title: an extreme close-up that already moves (the coffee rippling to the thud of an unseen
train — Jurassic-Park style), a question the picture asks, then a whip-out reveal at ~1.3 s into the wide shot with the hero
already acting, a name tag, and the payoff word slamming in by 3 s ("ON A RAILWAY?!"). Sound: thuds on the ripples, whoosh on the whip.

# Continuous action — every second (v10)
- The camera never stops (slow breathing push + drift on every acted shot; zooms on beats).
- Background life is always on: birds, a waiter crossing the far kerb, extras cycling sip → laugh → sip, lanterns swaying, steam.
- Every caption line triggers at least one action AND one lettering reaction (burst/bubble/word) — count them in the frame plan.
- No beat shows the same picture for > 1.5 s.

# Layout guard — nothing overlaps (v10.1)
- `toontype.js` keeps a per-frame box list (keyed by the scene's `lt`): every top-level `TOON.word` registers its box; `burst` / `bubble`
  check it and slide down (or up when that would enter the caption band) until clear, then register themselves. Draw big words
  FIRST, then bursts/bubbles, so the guard can move the small things.
- The guard only knows lettering. Keep bubbles and bursts off faces yourself: place them beside heads (tail to the head), never on them;
  measurement labels go on empty pavement or in the top band, never on a character.
- A character a bubble points at must stay on screen for the whole bubble (walk paths are timed to the caption length, not fixed seconds).
- After `sheet.mjs`, pull `frames.mjs` at every lettering beat in BOTH formats — positions that clear on 9:16 can collide on 16:9.
