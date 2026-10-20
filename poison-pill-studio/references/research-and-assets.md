# Research & real-photo assets

## 1. Research dossier (`research/<slug>.md`, before any script)
```
# <Company> — dossier (checked <Mon YYYY>)
THESIS (draft): …
TIMELINE   YYYY-MM-DD · event · number · source A · source B · confidence (high/med/low)
MONEY      raised / peak valuation / revenue / losses / final price — each with date + 2 sources
PEOPLE     name · role · years · 1-line why they matter · photo lead (where a usable photo is)
QUOTES     "verbatim" — speaker, where, date, URL (only verbatim; paraphrase is narration, not a quote card)
DOCUMENTS  filings, letters, memos, court docs, headlines (exact headline text + outlet + date)
VISUAL LEADS  places, products, ads, offices, events that exist as real photos/footage stills
OPEN QUESTIONS  what could not be verified → stays out of the film
```
Source ladder: primary (SEC/EDGAR filings, annual reports, shareholder letters, court records, the company's own announcements, contemporary interviews) → quality press (WSJ, FT, Bloomberg, Reuters, NYT, The Information) → books by reporters → Wikipedia only as a map to the primary sources. Every number on screen: 2 sources, the date it refers to, the currency, nominal vs inflation-adjusted stated in the VO when it matters.
Legal tone: facts as facts, analysis as analysis ("the evidence suggests", "critics argued"). Allegations stay allegations ("was accused of", "denied"). No claims about private lives that are not on the record.

## 2. Real photos — what each layer needs
| Layer | Real-photo content | Role in `pp_img.py` | Typical style |
|---|---|---|---|
| BG | the HQ, the city of the era, the factory, the trading floor, the launch event, the store; or 3–6 period photos as a `wall:` | `plate` | blurred 8–12 px, dimmed, toned by act |
| MID | the founder/CEO/rival (cut-out); a product shot; a key document or newspaper front page as a print | `cut` for people/objects · `prop` for rectangles | BW / duotone cut-out with white border; prints `style:torn|polaroid|print`, `tape` |
| FG | a contract, a cheque, a share certificate, the product box, a magazine cover, a ticket, a phone screenshot | `cut` (object) or `prop` (rectangle) | colour, small, bottom band, `rot:` ±4–10° |
Rule of thumb per beat: at least one real image; per act: at least one real face, one real place, one real document.

## 3. Where to get them (in this order) + licence rules
1. **Public domain / free licence**: Wikimedia Commons (`python3 tools/sticker.py search "<query>"` lists URL + licence + credit), Library of Congress, National Archives, Flickr Commons, government sites (US gov works = PD), company press kits/newsrooms (press use).
2. **Editorial fair use (commentary/criticism)**: screenshots of headlines, logos, product UI, short stills of public appearances — used small, transformed (cut, toned, framed), commented on by the VO, never as the whole frame for long, never in a way that substitutes for the original. Note each in `credits.txt`.
3. **User-supplied files** from the channel owner (own licences).
4. **AI-generated images — only** for generic backgrounds (an empty boardroom, a stormy sky over a skyline), textures and symbolic objects (a pill, money). **Never** an AI face of a real person, never an AI "document" or "headline" that looks real, never AI product shots of a real product.
Never: stock-agency watermarked images, social-media photos of private people, paparazzi shots.
Credits go in `--credit "Photo: <author> / <source>" --license "<licence>"`; `make.mjs` writes `out/<slug>_credits.txt` for the description.

## 4. Import pipeline (this is what fixes "ảnh hiện thành chữ")
```bash
# people / objects → background removed, trimmed, sticker-ready
python3 tools/pp_img.py add ~/dl/katzenberg_2019.jpg katzenberg --role cut --credit "Photo: J. Doe / Wikimedia Commons" --license "CC BY-SA 4.0"
# places → full rectangle kept, the engine blurs/tones it
python3 tools/pp_img.py add ~/dl/hollywood_sign.jpg quibi_bg_hollywood --role plate --credit "…" --license "CC BY 2.0"
# documents / prints / screenshots → rectangle kept, framed as print/torn/polaroid by the beat
python3 tools/pp_img.py add ~/dl/wsj_front.png quibi_wsj_front --role prop --credit "Screenshot: WSJ, 21 Oct 2020 (editorial)"
python3 tools/pp_img.py check stories/<slug>-a1.story    # every id → OK, before rendering
```
- Ids: lowercase + digits + underscores only, prefixed by the episode (`quibi_…`) so the library stays sorted.
- `sync` after ANY manual change to `engine/library/images.json` or `img/` (the renderer reads only `images.js`).
- Cut-out quality: source ≥ 800 px tall, subject well lit, simple background. Check the cut (`python3 tools/sticker.py list`, open the PNG). Hair halo or missing hands → crop tighter (bust), or use `--role prop` with `style:torn`.
- Keep a 3 : 2 mix: for every 3 people photos, 2 place/document photos — faces alone get monotonous.
- Contact-sheet test before the storyboard: render one beat per image (frames tool) to see how each photo looks in BW / duo / gold.

## 4b. Real footage (archive news, ads, keynotes, interviews)
```bash
ffmpeg -ss 00:01:12 -t 4 -i source.mp4 -c copy clip_raw.mp4          # cut the moment (or pass --start/--dur)
python3 tools/pp_clip.py add clip_raw.mp4 quibi_ad_2020 --dur 3 --fps 12 --width 720 --credit "Footage: Quibi ad, 2020 (editorial)"
```
Use 2–4 s moments the narration comments on (editorial fair use), public-domain archives (Prelinger, NARA, C-SPAN public events) or licensed footage. Show it framed (`style:tv`/`polaroid`), toned if needed, never as a full-screen re-upload. One clip ≈ 30–50 frames; keep ≤ 6 clips per act.

## 4c. Maps
No assets needed: `bg=world` uses public-domain Natural Earth borders. Put coordinates in the dossier (§1 MAP).

## 5. Asset list format (part of the shot list)
```
id                    role   layer  source / search terms                         licence        used in
quibi_katzenberg      cut    MID    Commons "Jeffrey Katzenberg 2019"             CC BY-SA 4.0   a1 b1,b5 · a3 b2
quibi_bg_hollywood    plate  BG     Commons "Hollywood Sign"                      CC BY 2.0      a1 b1
quibi_wsj_shutdown    prop   FG     screenshot WSJ 2020-10-21 headline            editorial      a4 b3
```
