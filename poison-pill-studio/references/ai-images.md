# Generated images (v5 rules, widened in v6.1)

> **v6.1: AI moment art is welcome.** Muse illustrates the episode's key moments (25–40 images) in one style bible, and
> the film may use AI art on up to ~40 % of beats (final-cut.md §5). Two things are unchanged:
> - Real people, documents, logos, events and evidence stay real.
> - Art never pretends to be archive.
>
> The table below lists what must never be generated.

The owner's rule: **"ảnh vẫn cần lấy ảnh thật"**, meaning real images first. The production agent can generate images,
but it uses them only to fill gaps and add life. They never replace evidence.

## 1. Allowed vs forbidden
| ✅ Allowed (role in §2 ASSETS) | ❌ Never |
|---|---|
| `clean`: the background of a real photo with the person removed (AI fill), so the cut-out can float in parallax | a real, identifiable person (face or body), even "in their style" |
| `env`: an environment with no usable real photo (a 1970s trading floor, a server room at night, a desert at dawn) | a real document, letter, screenshot, headline, chart or logo |
| `prop`: a generic object (a ledger, a rotary phone, a cargo ship, a stack of contracts, a broken piggy bank) | a specific real event that viewers could read as a photo of record |
| `texture`: paper, fabric, metal, a wall | a real product shown as evidence (use the real product photo) |
| `fg`: a foreground element for depth (plant, desk lamp, blinds, rain on glass) | "aged" or "archival-looking" fakes |

## 2. Make it read as illustration, not as a fake archive
- Use one **style bible** per episode, taken from the look (below). Every generated image uses the same prefix, so the
  images match each other and the film.
- Never fake film age, archival grain or old-print damage on an AI image.
- The engine's finish pass (one grade, one light, grain) makes them sit with the real photos.
- **Disclosure:**
  - `pp_img.py add … --gen "<tool>"` logs the image as AI.
  - `make.mjs` lists the AI images in the credits file.
  - Tick YouTube's "altered or synthetic content" box when any generated image is photorealistic.

## 3. Style bible per look (prompt prefix, then subject, then the suffix)
| Look | Prefix |
|---|---|
| dossier | "editorial collage illustration, matte paper texture, warm muted palette of manila, kraft and ink navy, soft top-left window light," |
| noir | "cinematic film-noir illustration, deep navy and black, single hard top-left light, rain-wet surfaces, desaturated," |
| editorial | "clean modern editorial illustration, off-white background, crisp shadows, restrained black ink with one red accent," |
| tech | "cinematic dark tech environment, slate and near-black, cyan and violet rim light, subtle haze, shallow depth of field," |
| luxury | "luxurious low-key photograph style, black and champagne gold, soft specular highlights, elegant and quiet," |
| vintage | "early 20th-century illustration style, sepia ink wash, soft engraving texture, warm brown paper," |
| retro | "1980s synthwave illustration, purple night, hot pink and cyan neon glow, grid horizon," |
| broadcast | "clean newsroom photography style, cool white and navy, even soft light," |
| eastern | "East Asian ink-wash illustration, rice paper, vermilion accents, gold leaf details," |
| ledger | "old-bank interior illustration, banker's green and brass gold, ruled-paper texture, lamp light," |
| blueprint | "technical blueprint illustration, engineering blue, white line work, grid paper," |

**Suffix (always):** ", no text, no letters, no logos, no watermark, no people's faces, 16:9, high detail".

**For cut-outs** (`prop` and `fg`), add: ", isolated on a plain flat #00FF00 background, soft even light".
`pp_img.py add <file> <id> --role cut --gen "<tool>"` then removes the background.

## 4. How the director writes it (§2 ASSETS)
| id | role | exactly what it must show | prompt (subject part only) | beats |
|---|---|---|---|---|
| `wework_floor_clean` | clean | the WeWork lobby photo `wework_lobby` with the people removed | "fill the area behind the removed people with the matching floor and wall" | a2-4 |
| `server_room_night` | env | a server room at night, rows of blinking racks, one aisle | "a long data-centre aisle at night, blinking rack lights, haze" | a3-2 |
| `broken_piggy` | prop | a cracked porcelain piggy bank, coins spilling | "a cracked porcelain piggy bank with coins spilling out" | a5-1 |

The production agent prepends the look's prefix and appends the suffix. Keep at most **1 generated image per 4 beats**.
Real photos stay the backbone (≥ 60 % of beats carry a real image).
