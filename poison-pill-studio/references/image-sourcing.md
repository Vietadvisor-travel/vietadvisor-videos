# Finding real images automatically (v6)

**`tools/pp_find.py` does it** (production machine with internet). Set your contact once: `export PP_CONTACT=you@email`
(Wikimedia requires it).
```bash
python3 tools/pp_find.py search "Jeffrey Katzenberg" --kind person         # ranked candidates, licence, source (nothing downloaded)
python3 tools/pp_find.py get "Jeffrey Katzenberg" katzenberg --kind person --role cut
python3 tools/pp_find.py assets EPISODE_07_quibi.md                         # every real-image row of §2 → research/<slug>_assets_found.md
```
**How it works:**
- **Sources, in priority order:** Wikidata P18 (the entity's own image, plus a company's HQ building), the Wikipedia lead
  image (free files only), Wikimedia Commons search, then Openverse (commercial and modification allowed).
- **Licences:** only CC0, public domain, CC BY and CC BY-SA are accepted. Non-free, NC and ND files are rejected
  automatically.
- **Ranking:** subject match, resolution, aspect for the role, and source quality.
- **Import:** the chosen file is imported with its credit and licence, so `make.mjs` writes the credits file.

**What still needs a person:**
- screenshots (browser capture);
- press-kit or "editorial only" images;
- anything flagged `trademarked` or `personality` when it would appear in a thumbnail;
- a row that finds NOTHING. Rephrase the query, or generate the image ONLY if its role allows it (ai-images.md).

The full research behind these rules follows: APIs, licence tiers, per-asset-type source order, and ranking.

---
Researched 2026-10-21. **Status labels:** **[V]** means a web source confirmed it during this research. **[K]** means it comes from prior knowledge or API docs I could not open, so check it with one live call before relying on it.

> **Environment warning:** this sandbox's egress proxy **blocks every source host** (`api.openverse.org`, `commons.wikimedia.org`, `www.loc.gov`, `api.pexels.com`, `pixabay.com`, `api.unsplash.com`, `www.flickr.com`, `api.si.edu`, `collectionapi.metmuseum.org`, `www.wikidata.org`). Both `curl` and WebFetch got `CONNECT 403` or no DNS. None of the endpoints below could be tested live from here. The pipeline has to run on a machine with open egress, or after these hosts are added to the environment's network allowlist.

---

## 0. Licence policy for a monetized channel (put this in code)

| Tier | Licences / statuses | Use in video | Use in thumbnail |
|---|---|---|---|
| A (safest) | Public domain (PD-old, PD-USGov / `PD-USGov-*`, "No known copyright restrictions", Flickr 7/8/10), **CC0**, PDM, Met `isPublicDomain:true`, Smithsonian `CC0`, Pexels/Pixabay/Unsplash licence | yes | yes (still watch for trademarks and personality rights) |
| B | **CC BY** 2.0–4.0 | yes, with credit | yes, with credit in description |
| C | **CC BY-SA** | yes, with credit and licence link. ShareAlike risk: heavy edits such as crops, composites or colour grading could make the video "adapted material". Keep edits light and prefer tier A/B | avoid |
| Reject | Any **NC** (non-commercial: monetized YouTube counts as commercial), any **ND** (Ken Burns, crop and overlay are modifications), "All rights reserved", fair-use/non-free files (enwiki local logos, posters), GFDL-only (impractical: needs the full licence text) | no | no |

Always keep: source URL, landing page URL, author, licence short name, licence URL, retrieval date, and any modifications. Licences from aggregators (Openverse, pageimages) are hints. **Re-verify on the source page or API** (Openverse itself warns it does not verify).

---

## 1. Openverse (`api.openverse.org`): best single meta-search, no key needed

**Search endpoint [V]:** `GET https://api.openverse.org/v1/images/`

Key parameters (the [V] items are confirmed: `q`, `license`, `license_type`, `page_size`):
- `q`: free-text query.
- `license`: comma list from `cc0,pdm,by,by-sa,by-nc,by-nd,by-nc-sa,by-nc-nd,sampling+,nc-sampling+`.
- `license_type=commercial,modification`: drops NC and ND. **Always send it.**
- `source=wikimedia,flickr,smithsonian,met,...`, `excluded_source=` [K]. The list is at `GET /v1/images/stats/`.
- `category=photograph|digitized_artwork|illustration`, `aspect_ratio=wide|tall|square`, `size=large|medium|small`, `extension=jpg,png` [K].
- `mature=false`, `filter_dead=true` (default), `page`, `page_size` (anonymous max 20 [K]; registered up to 500 [V, third-party]).

```bash
curl -s "https://api.openverse.org/v1/images/?q=ford%20model%20t%20assembly%20line&license_type=commercial,modification&category=photograph&aspect_ratio=wide&size=large&page_size=20"
# single item / related
curl -s "https://api.openverse.org/v1/images/{id}/"
curl -s "https://api.openverse.org/v1/images/{id}/related/"
```

**Response fields per `results[]`:**
- `id`, `title`
- `url`: the original file. Download this one.
- `thumbnail`: Openverse proxy.
- `foreign_landing_url`: the source page. Store it and use it to re-verify.
- `creator`, `creator_url`
- `license` (e.g. `by-sa`), `license_version`, `license_url`
- `attribution`: a ready-made credit string. Store it verbatim.
- `provider`, `source`
- `tags[] {name, accuracy}`: some are machine-generated and carry an accuracy value.
- `width`, `height`, `filesize`, `filetype`, `category`, `mature`

Top-level fields: `result_count`, `page_count`.

**Rate limits [V]:**
- Anonymous use is allowed and has a smaller per-IP limit.
- Registering gives "slightly higher" limits. More than that is granted case by case.
- 429 means too many requests. Check your usage with `GET /v1/rate_limit/`.
- Third-party READMEs quote different numbers, so read the response headers rather than trusting them.

Registration (free, about two minutes) [V]:
```bash
curl -X POST https://api.openverse.org/v1/auth_tokens/register/ -H 'Content-Type: application/json' \
  -d '{"name":"bizhistory-bot","description":"image sourcing for documentary","email":"you@example.com"}'
# verify the email, then:
curl -X POST https://api.openverse.org/v1/auth_tokens/token/ \
  -d 'grant_type=client_credentials&client_id=ID&client_secret=SECRET'
# then send: -H "Authorization: Bearer TOKEN"  (tokens expire, ~12h [K]; refresh automatically)
```

Caveats:
- Openverse's coverage of Commons and Flickr lags the live sources.
- Openverse does not catch person-specific restrictions such as personality rights or trademarks.
- For Commons-sourced hits, re-query the Commons API (section 2) to get `Restrictions`.

---

## 2. Wikimedia Commons, Wikipedia and Wikidata: the main source for people, companies, HQs and products

**Mandatory:** send a descriptive `User-Agent` such as `BizHistoryBot/1.0 (https://yoursite; you@example.com) python-requests/2.x`. Requests without one may be blocked, and since late 2025 Commons throttles unidentified server clients [V].

### 2a. Search files with licence metadata in one call
```bash
curl -s -A "BizHistoryBot/1.0 (you@example.com)" "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2\
&generator=search&gsrnamespace=6&gsrlimit=30\
&gsrsearch=Henry%20Ford%20filetype:bitmap%20filew:%3E1600\
&prop=imageinfo&iiprop=url|size|mime|sha1|extmetadata&iiurlwidth=1920\
&iiextmetadatafilter=LicenseShortName|License|LicenseUrl|UsageTerms|AttributionRequired|Copyrighted|NonFree|Restrictions|Artist|Credit|Attribution|ImageDescription|ObjectName|DateTimeOriginal|Categories"
```

Useful CirrusSearch keywords inside `gsrsearch` [K]:
- `filetype:bitmap`
- `filew:>1600` and `fileh:>900`
- `filemime:image/jpeg`
- `incategory:"Ford Model T"`
- `haswbstatement:P180=Q8768`: structured-data "depicts" = Wikidata item. This is the most precise way to match a subject.
- `-intitle:logo`

**Response:** `query.pages[].imageinfo[0]` contains:
- `url`: the **original file**. Download it.
- `thumburl` and `thumbwidth`: from `iiurlwidth`.
- `descriptionurl`: the file page to cite.
- `width`, `height`, `mime`, `sha1` (use it for dedup).
- `extmetadata.{Field}.value`

`extmetadata` fields [V for the meanings]:

| Field | Meaning and how to handle it |
|---|---|
| `LicenseShortName` | Human-readable name such as "CC BY-SA 4.0" or "Public domain". **More reliable than `License`.** |
| `License` | Machine code (best guess), e.g. `cc-by-sa-4.0`, `pd`, `cc0`. |
| `LicenseUrl` | Link to the licence. |
| `UsageTerms` | Long licence name. |
| `AttributionRequired` | `"true"`/`"false"`. |
| `Artist` | HTML. Strip the tags to get the author. |
| `Credit` | HTML source/credit. |
| `Attribution` | Custom credit line. When present, it **overrides** Artist + Credit. |
| `Copyrighted` | `"True"`/`"False"`. |
| `NonFree` | Present and `"true"` means fair-use material. **Reject.** |
| `Restrictions` | Pipe list such as `personality`, `trademarked`, `insignia`. **Flag it.** `trademarked` means logo or brand rules apply (section 6). `personality` means no endorsement-style use, especially in thumbnails. |
| `DateTimeOriginal`, `ImageDescription`, `ObjectName`, `Categories` | Used for subject matching and dating. |

Multi-licensed files report unreliable values [V]. If `LicenseShortName` contains several licences, pick the most permissive acceptable one.

**Thumbnails:** request only the **standard widths** 20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920 and 3840 [V]. Other widths are rounded up through the API or rejected when hotlinked, and they are rate-limited (2026). For 1080p video use `iiurlwidth=1920`, or the original when it is under about 25 MB.

**Robot policy for downloads** from `upload.wikimedia.org` [V]:
- At most 2 concurrent downloads and 25 Mbps in total.
- Use standard thumbnail sizes or originals, and prefer thumbnails.
- At most 1 request per second to the API, with retry and backoff on 429.

### 2b. Main image of a Wikipedia article (person, company)
```bash
curl -s -A "BizHistoryBot/1.0 (you@example.com)" "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1\
&titles=Ray%20Kroc&prop=pageimages&piprop=original|thumbnail|name&pithumbsize=1920&pilicense=free"
```
- `pilicense=free` is the default. **Keep it**: `any` would return non-free fair-use files that are only legal on Wikipedia [V].
- `pages[].pageimage` gives the file name. Then run 2a with `titles=File:<name>` on Commons to get licence fields. The page image is usually on Commons. If it's a local file on Wikipedia, query `en.wikipedia.org` imageinfo instead.
- To list every image in an article: `prop=images&imlimit=50`, then filter through imageinfo.

### 2c. Wikidata (canonical images per entity, language-independent)
```bash
# find entity
curl -s "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=McDonald%27s&language=en&type=item&format=json"
# claims: P18 image, P154 logo image, P159 HQ location, P571 inception, P169 CEO, P112 founder
curl -s "https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=Q38076&property=P18&format=json"
# file -> direct URL (standard width)
curl -sL "https://commons.wikimedia.org/wiki/Special:FilePath/FILE_NAME.jpg?width=1920"
```
Chain: company Q-id gives P159 (HQ item), whose P18 gives a building photo. Founder Q-id from P112 gives P18, a portrait. Commons search with `haswbstatement:P180=Q…` returns more photos depicting the item.

---

## 3. Archival and museum sources (public domain-heavy; great for history)

### Library of Congress (`loc.gov` JSON) — no key
- **Rate limit [V]:** 20 requests per minute for the JSON API. Going over it blocks you **for one hour**. Image and IIIF downloads allow 150 per minute.
- Under load the API may return 429 or an HTML CAPTCHA page. Detect both and pause.
```bash
curl -s "https://www.loc.gov/photos/?q=woolworth%20building&fo=json&c=50&fa=online-format:image|access-restricted:false"
curl -s "https://www.loc.gov/item/2016800172/?fo=json"
```

Search `results[]` fields [K, check against a live response]:
- `id`, `url`, `title`, `date`
- `image_url[]`: several sizes. The last one is usually the largest. Prefer the IIIF/`tile.loc.gov` full size.
- `online_format`, `access_restricted`, `partof`

The item JSON has `item.rights_advisory` [K], plus `rights`, `item.notes`, and `resources[].files[]` (TIFF/JPEG with dimensions).

**Rights:** accept only when `rights_advisory` contains "No known restrictions on publication", or the work is a US federal-government work. Reject or flag "Rights status not evaluated", "Publication may be restricted" and anything naming an outside copyright holder [V for the HABS wording]. LoC never grants rights. The burden is on you.

The legacy `https://www.loc.gov/pictures/search/?q=...&fo=json` (PPOC) still works and is a "work in progress" [V].

### US National Archives (NARA Catalog API v2)
- **Key:** free. Email `Catalog_API@nara.gov` with your name and the email to tie to the key (read-only). Allow a few days [V].
- **Limit:** 10,000 queries per month per key. Going over blocks the key until the 1st of the next month [V].
```bash
curl -s -H "x-api-key: $NARA_KEY" "https://catalog.archives.gov/api/v2/records/search?q=Lockheed%20assembly&typeOfMaterials=Photographs%20and%20other%20Graphic%20Materials&availableOnline=true&limit=50"
```
- **Fields [K]:** `body.hits.hits[]._source.record`: `title`, `naId`, `digitalObjects[].objectUrl`, `useRestriction.status` (`Unrestricted` vs `Restricted - Partly/Fully`), `accessRestriction`.
- **Rights:** most federal records are public domain (17 USC 105), but donated collections can carry copyright. Accept `useRestriction.status == "Unrestricted"`.
- Cite as: "National Archives, NAID <id>".

### Smithsonian Open Access
- **Key:** free and instant from `https://api.data.gov/signup` [V]. The api.data.gov default limit is 1,000 requests per hour [K].
```bash
curl -s "https://api.si.edu/openaccess/api/v1.0/search?q=Edison%20AND%20online_media_type:Images&rows=50&api_key=$DATAGOV_KEY"
curl -s "https://api.si.edu/openaccess/api/v1.0/content/{id}?api_key=$DATAGOV_KEY"
```
- **Rights field [K]:** `content.descriptiveNonRepeating.metadata_usage.access == "CC0"`. Smithsonian only provides media files for CC0 objects [V].
- **Media:** `content.descriptiveNonRepeating.online_media.media[].content` or `.resources[].url`. Large JPEGs come from `https://ids.si.edu/ids/deliveryService?id=<idsId>&max=3000`.

### The Met Collection API — no key
- **Base URL [V]:** `https://collectionapi.metmuseum.org/public/collection/v1`
- **Rate:** advisory limit of 80 requests per second [V].
```bash
curl -s "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=steam%20engine"   # -> objectIDs[]
curl -s "https://collectionapi.metmuseum.org/public/collection/v1/objects/12345"
```
- **Object fields:** `isPublicDomain` (accept only `true`, which means CC0), `primaryImage` (full size; can be empty even with `hasImages=true` [V]), `primaryImageSmall`, `additionalImages[]`, `title`, `artistDisplayName`, `objectDate`, `creditLine`, `rightsAndReproduction`, `objectURL`.
- Mostly art and decorative objects. Useful for early-commerce eras such as trade, ships, coins and advertising prints.

### Rijksmuseum — no key (new Linked Art Search API, beta)
- `GET https://data.rijksmuseum.nl/search/collection?title=...&creator=...&type=...&imageAvailable=true` [V for the endpoint, no key and beta status; the parameter names are K].
- Returns Linked Art IDs. Resolve each ID, adding `?_profile=…` to choose a format.
- The museum placed most images in the public domain in 2013 [V]. Good for the VOC and Dutch trade history.

Other free PD sources worth adding later [K]:
- Europeana API (free key, `rights` field with RightsStatements URIs)
- Internet Archive (`archive.org/advancedsearch.php`, rights vary)
- NYPL Digital Collections (free token, `rightsStatement`)
- State/US agency Flickr accounts (NASA, NOAA)

---

## 4. Flickr, Unsplash, Pexels, Pixabay

### Flickr (Flickr Commons and CC photos)
- **Key [K]:** free from `https://www.flickr.com/services/apps/create/`, non-commercial tier. Flickr has tightened key access, so a Pro account and an application may be needed for commercial use. Check the current terms.
- **Rate [K]:** about 3,600 queries per hour per key.
```bash
curl -s "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=$FLICKR_KEY&format=json&nojsoncallback=1\
&text=pan%20am%20boeing%20707&license=4,5,7,8,9,10,11,12&content_types=0&media=photos&sort=relevance&per_page=100\
&extras=license,owner_name,url_o,url_l,url_k,o_dims,tags,date_taken,description,path_alias"
# Flickr Commons only (institutions; "no known copyright restrictions"):  &is_commons=true   [K]
# authoritative id->licence table:
curl -s "https://www.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key=$FLICKR_KEY&format=json&nojsoncallback=1"
```
- **License IDs [K, rebuild the table from `getInfo` on startup]:**
  - Reject (NC or ND): 0 All Rights Reserved, 1 BY-NC-SA 2.0, 2 BY-NC 2.0, 3 BY-NC-ND 2.0, 6 BY-ND 2.0, 13 BY-ND 4.0, 14 BY-NC 4.0, 15 BY-NC-SA 4.0, 16 BY-NC-ND 4.0
  - Accept: 4 BY 2.0, 5 BY-SA 2.0, 7 No known copyright restrictions (Commons), 8 US Government Work, 9 CC0, 10 Public Domain Mark, 11 BY 4.0, 12 BY-SA 4.0
- **Result fields:** `photos.photo[]`: `id`, `owner`, `ownername`, `license`, `title`, `url_o`, `width_o`, `height_o` (original; may be missing if the owner disabled it), `url_k`/`url_l`, `tags`, `datetaken`. The photo page is `https://www.flickr.com/photos/{owner}/{id}`.

### Unsplash (generic B-roll stills only)
- **Key:** free and instant at unsplash.com/developers.
- **Rate:** demo mode allows **50 requests per hour**. Production mode, once approved, allows 5,000 per hour [V]. Image file requests do not count [V].
```bash
curl -s -H "Authorization: Client-ID $UNSPLASH_KEY" "https://api.unsplash.com/search/photos?query=stock%20exchange%20floor&orientation=landscape&per_page=30&content_filter=high"
# REQUIRED when you actually use one (counts as a download) [V]:
curl -s -H "Authorization: Client-ID $UNSPLASH_KEY" "<photo.links.download_location>"
```
- **Fields:** `results[]`: `id`, `width`, `height`, `description`, `alt_description`, `urls.raw|full|regular`, `links.html`, `links.download_location`, `user.name`, `user.links.html`. Skip any result flagged `premium`/`plus` (Unsplash+) [K].
- **Licence (Unsplash License) [K]:** free for commercial use including video, attribution not legally required. You may not sell unaltered copies or build a competing service. Trademarks and people in shots are not released.
- **API Guidelines [V]:** apps must hotlink `photo.urls` and attribute "Photo by X on Unsplash" with UTM links. For an offline video render, download through the trigger endpoint and **still credit the photographer and Unsplash** in the description.

### Pexels
- **Key:** free and instant with a Pexels account [V].
- **Rate:** 200 requests per hour and 20,000 per month by default. Unlimited for free if you qualify. Successful responses carry the headers `X-Ratelimit-Limit`, `X-Ratelimit-Remaining` and `X-Ratelimit-Reset` [V].
```bash
curl -s -H "Authorization: $PEXELS_KEY" "https://api.pexels.com/v1/search?query=office%20skyscraper&orientation=landscape&size=large&per_page=80"
```
- **Fields:** `photos[]`: `id`, `width`, `height`, `url` (page), `photographer`, `photographer_url`, `alt`, `avg_color`, `src.original|large2x|large|landscape`.
- **Credit format [V]:** "Photo by {photographer} on Pexels", linked. Pexels also has a video API (`/videos/search`).

### Pixabay
- **Key:** free with an account, shown on `https://pixabay.com/api/docs/`.
- **Rate:** about 100 requests per 60 seconds per key [V, multiple third-party sources].
- **Usage rules:**
  - Results **must be cached for 24 hours** [V].
  - **Download the images; don't hotlink them** [V].
  - No systematic mass downloading [V].
```bash
curl -s "https://pixabay.com/api/?key=$PIXABAY_KEY&q=oil+refinery&image_type=photo&orientation=horizontal&min_width=1920&safesearch=true&per_page=200"
```
- **Fields:** `hits[]`: `id`, `pageURL`, `tags`, `webformatURL` (640), `largeImageURL` (1280 max on the standard API [V]), `imageWidth`, `imageHeight`, `user`, `user_id`. `fullHDURL`/`imageURL` need approved full access [K].
- **Licence [K]:** Pixabay Content License allows commercial use with no attribution required (credit anyway). It forbids selling unaltered copies and implying endorsement by depicted people or brands.

**Rule:** stock sites (Unsplash, Pexels, Pixabay) are for **generic mood shots only**: money, offices, factories, cities, abstract tech. Never present a stock image as a specific real company, person or event. That is misleading, and stock licences exclude trademark and personality clearance.

---

## 5. News and press photos, press kits, and fair use (cautious)

- **Agency and newspaper photos** (AP, Reuters, Getty, AFP, Bloomberg) are copyrighted and actively enforced. Getty and its agents send claims and invoices. "Editorial use only" licences exclude commercial use, and stock providers treat **monetized vlogs and YouTube as commercial** [V].
- **Never scrape Google Images or news sites automatically.**
- **Company newsrooms and press kits:**
  - Images are usually licensed for **editorial or press coverage only**. Some forbid commercial use and editing (e.g. GSK: use only "in connection with articles referring to" the company, no commercial use or editing [V]).
  - Terms vary per company and are usually on the download page.
  - Risk: monetized, edited video with Ken Burns and grading may fall outside "editorial" in the strict sense.
  - Pipeline: do **not** auto-include. Put candidates in a `needs_review` bucket with the terms URL saved, so a human checks each one, or emails press@ for written permission.
- **Fair use (US) in documentaries:**
  - Courts weigh four factors: purpose/transformativeness, nature of the work, amount used, and market harm. Documentaries with real commentary are often found fair use even when monetized [V]. But it is a **defence decided case by case, not a licence**.
  - A news photo used just to illustrate the same event is weak after *Warhol* (2023).
  - YouTube's Content ID is its own policy, not fair use. Claims can become strikes [V].
  - If ever relied on:
    - The image must be the *subject of commentary*.
    - Show it briefly, at reduced size, with on-screen discussion.
    - No thumbnail use.
    - Log the justification.
  - Recommendation: **the automated pipeline never selects fair-use material.** A human opts in manually.

---

## 6. Logos and product images

- **Copyright vs trademark:**
  - Simple wordmarks and geometric logos are often below the copyright threshold. Commons tags them `PD-textlogo` and sets `Restrictions=trademarked`.
  - Complex logos are copyrighted. They are only on enwiki as non-free, which you reject.
- **Trademark: nominative use [V].** In the US you may use a mark to *refer to* the company when:
  1. the company can't be identified easily without it;
  2. you use only as much as needed;
  3. nothing suggests sponsorship or endorsement.

  Journalism and commentary about a company is the classic safe case [V].
- **Rules for the pipeline:**
  - Show the logo unaltered, as an identifier, in context ("the company").
  - Don't make it the channel's branding.
  - Don't put it in the thumbnail in a way that implies partnership.
  - Optionally add an on-screen note such as "X is a trademark of Y; no affiliation".
- **Sources, in order:**
  1. Commons file from Wikidata **P154** with `LicenseShortName` PD/`PD-textlogo` or CC.
  2. Commons search `"<company> logo" filetype:drawing` (SVG).
  3. Company brand-asset page → human review.
- **Products:**
  - Prefer Commons photos (users' photos of products, museums, car shows), which are CC BY/BY-SA.
  - Then museum PD (Smithsonian, Met) for historical products.
  - Then Flickr CC.
  - Packaging photographed by others still contains trademarks; nominative-use rules apply.
  - Watch Commons "freedom of panorama" deletions for buildings and artworks in some countries: `Restrictions` or the category may show it.

---

## 7. Scoring, ranking and dedup (all free and local)

**Hard filters, applied first:**
- Licence is in the allow-list (section 0).
- `NonFree` is not present.
- Min long edge ≥ 1280 px (prefer ≥ 1920 for full-frame; ≥ 960 is acceptable for a framed "photo on desk" look).
- File is not SVG unless it's a logo.
- MIME is jpeg, png or tiff.
- Not a scan of a newspaper page with a modern copyright notice.

**Score**, with each feature normalised to 0–1:
```
score = 0.30*subject_match + 0.20*resolution + 0.15*aspect_fit + 0.15*license_tier
      + 0.10*face_term + 0.05*source_trust + 0.05*era_match  - penalties
```

- **subject_match**: the maximum of three signals:
  - (a) Commons `haswbstatement:P180=Q…` hit = 1.0;
  - (b) token overlap between entity name or aliases and title, description, tags, categories (rapidfuzz `token_set_ratio`/100);
  - (c) CLIP similarity using `open_clip` ViT-B-32, local and free: cosine(image, "a photo of {entity}, {context}"), rescaled.
- **resolution**: `min(1, long_edge/3840)`.
- **aspect_fit**: `1 - min(1, |log(ar/ (16/9))|)`. For portraits, which are used framed or with a blurred background, don't penalise 3:4.
- **license_tier**: PD/CC0 = 1.0, BY = 0.8, BY-SA = 0.5.
- **face_term**: from OpenCV `cv2.FaceDetectorYN` (YuNet), mediapipe, or insightface.
  - Person asset: 1 face → 1.0, face area 3–40 % of the frame preferred, 2–3 faces → 0.5, 0 faces → 0.
  - Optional: insightface embedding compared with a reference portrait from Wikidata P18 (cosine > 0.4 means same person) to avoid misidentifying people.
  - Building, product or document asset: faces dominating the frame → penalty.
- **era_match**: `DateTimeOriginal` or `date` within the period the script describes.
- **source_trust**: Commons-with-depicts or LoC/NARA = 1.0, Flickr Commons = 0.9, Openverse aggregate = 0.7, stock = 0.4 (for specific entities 0, so stock is excluded).
- **Penalties:**
  - Watermark or caption text: OCR with `tesseract`; text area > 10 % gives −0.2 unless the asset type is a document.
  - Blur: Laplacian variance below a threshold gives −0.1.
  - Greyscale: allowed for history.
  - Heavy border: auto-crop it.

**Dedup:**
- Exact duplicates: Commons `sha1` or file hash.
- Near duplicates: perceptual hash (`imagehash.phash`, Hamming ≤ 8), or CLIP cosine > 0.95 to collapse crops.
- Across sources, keep the highest-resolution, most permissive copy. The same Commons file often appears through Openverse, Flickr and Wikipedia.
- Diversity across a video: maximal-marginal-relevance on CLIP embeddings, and never reuse the same image twice in one video unless it's intentional.

---

## 8. Recommended pipeline

**Keys to get (all free):**
- Pexels: instant.
- Pixabay: instant.
- Unsplash: instant; production approval later.
- api.data.gov for Smithsonian: instant.
- Openverse token: minutes.
- Flickr: check terms.
- NARA: email; takes days.

No key needed for Commons, Wikipedia, Wikidata, LoC, the Met or Rijksmuseum.

**Source priority by asset type** (stop when ≥ N good candidates score above the threshold):

| Asset type | Priority order |
|---|---|
| **Person** (founder, CEO) | 1. Wikidata P18 → Commons imageinfo. 2. Wikipedia pageimages (`pilicense=free`). 3. Commons search `haswbstatement:P180=Q…` / `incategory:"<Name>"`. 4. LoC and NARA (pre-1980 and US government photos). 5. Smithsonian NPG (CC0 only). 6. Flickr (Commons + 4,5,7–12). 7. Openverse. **Never stock.** Thumbnails only from tier A/B. |
| **Company HQ / building / factory** | 1. Wikidata company → P159 item → P18. 2. Commons `incategory:` / depicts. 3. LoC (HABS/HAER, Detroit Publishing). 4. NARA. 5. Flickr CC. 6. Openverse. 7. Generic stock exterior, used only when narration is generic. |
| **Product** | 1. Commons (depicts / category). 2. Smithsonian and Met PD (historic products, ads). 3. LoC ads and trade catalogs. 4. Flickr CC. 5. Openverse. 6. Press kit → human review. Logo: Wikidata P154 → Commons. |
| **Document** (patent, ad, stock certificate, letter, newspaper) | 1. Google Patents/USPTO drawings (US patents generally PD [K]). 2. LoC (Chronicling America newspapers pre-1931, PD; Prints & Photographs). 3. NARA. 4. Commons `incategory:"Stock certificates"` etc. 5. Internet Archive (pre-1931 or verified PD). |
| **Place / city / era scene** | 1. LoC (historic). 2. NARA. 3. Commons. 4. Flickr Commons. 5. Rijksmuseum/Met (pre-1900). 6. Openverse. 7. Pexels/Unsplash/Pixabay for modern skylines. |
| **Generic object / mood** (money, charts, office, factory floor) | 1. Pexels. 2. Unsplash. 3. Pixabay. 4. Openverse (`category=photograph`). 5. Commons. |

**Flow per script beat:**
1. **Parse** the beat into `{asset_type, entity, wikidata_qid, era, query_variants[]}`, with an LLM step plus `wbsearchentities`.
2. **Query** sources in priority order. Run them asynchronously with per-host rate limiters: Commons 1 rps, LoC 20/min with a 60-minute lockout guard, Pexels 200/h, Pixabay 100/min, Unsplash 50/h until approved.
3. **Normalise** every hit into one record:
   `{source, source_id, title, landing_url, file_url, width, height, mime, author, author_url, license_short, license_url, attribution_text, restrictions[], date, tags[], sha1}`.
4. **Hard-filter** (section 0 and section 7), then **re-verify the licence** at the authoritative API (Commons imageinfo, Flickr `getInfo`, Met `isPublicDomain`, LoC `rights_advisory`).
5. **Download the top-k** to `assets/<video>/<beat>/` at a standard width. Honour Wikimedia concurrency ≤ 2. Call Unsplash `download_location` for each Unsplash image used.
6. **Score and dedup** (section 7). Select one primary and two alternates per beat. Send anything flagged `needs_review` (press kit, `trademarked`, `personality` for thumbnails, BY-SA with heavy edits) to a review list.
7. **Record credits.** Write `credits.json` and `credits.csv` per video, one row per used asset:
   ```json
   {"beat":12,"file":"assets/v07/b12_ford_1919.jpg","source":"Wikimedia Commons",
    "title":"Henry Ford 1919","author":"Hartsook (photographer)","license":"Public domain",
    "license_url":"https://creativecommons.org/publicdomain/mark/1.0/",
    "landing_url":"https://commons.wikimedia.org/wiki/File:Henry_ford_1919.jpg",
    "file_url":"https://upload.wikimedia.org/...","retrieved":"2026-10-21",
    "modifications":"cropped, pan/zoom, color graded","timecode":"03:12-03:18",
    "restrictions":[], "attribution_text":"Hartsook, Public domain, via Wikimedia Commons"}
   ```
8. **Generate** the YouTube description "Image credits" block from `credits.json`, using the TASL format (Title, Author, Source, Licence) [K: CC best practice]:
   `03:12 "Henry Ford 1919" by Hartsook, Public domain, via Wikimedia Commons, https://commons.wikimedia.org/wiki/File:...`
   - For CC BY/BY-SA, include the licence URL and "modified: cropped/animated".
   - For Unsplash and Pexels: "Photo by X on Unsplash/Pexels" with a link.
   - Pinned comment or website page as an overflow when the description exceeds 5,000 characters.
9. **Archive** the source JSON response and a screenshot or HTML of each landing page (licence evidence) next to `credits.json`. Licences on Commons and Flickr can change later.

---

## Sources
- [Openverse API mirror docs (Jentic)](https://jentic.com/apis/openverse.org/openverse) · [Openverse auth API (apis.io)](https://apis.io/apis/openverse/openverse-auth-api/) · [Openverse provider](https://apis.io/providers/openverse/) · [mcp-openverse](https://www.npmjs.com/package/mcp-openverse)
- [Extension:CommonsMetadata](https://www.mediawiki.org/wiki/Extension:CommonsMetadata/en) · [Openverse Commons provider handbook](https://make.wordpress.org/openverse/handbook/openverse-catalog/provider-api-wikimedia-commons/) · [Wikimedia API access policy](https://www.mediawiki.org/wiki/Wikimedia_APIs/Access_policy) · [Instant Commons](https://www.mediawiki.org/wiki/Instant_Commons) · [Common thumbnail sizes](https://www.mediawiki.org/wiki/Common_thumbnail_sizes) · [T408062](https://phabricator.wikimedia.org/T408062) · [pageimages API help](https://kumu.tru.ca/Special:ApiHelp/query%2Bpageimages)
- [loc.gov working within limits](https://www.loc.gov/apis/json-and-yaml/working-within-limits/) · [LoC PPOC API](https://www.loc.gov/pictures/api) · [NARA API getting started](https://www.archives.gov/research/catalog/help/api-getting-started) · [NARA API](https://www.archives.gov/research/catalog/help/api)
- [Smithsonian Open Access devtools](https://www.si.edu/openaccess/devtools) · [Met API (publicapi.dev)](https://publicapi.dev/metropolitan-museum-of-art-api) · [met-api notes](https://github.com/mike-dresser/met-api) · [Rijksmuseum search tutorial](https://data.rijksmuseum.nl/tutorials/search/) · [Rijksmuseum API docs](https://data.rijksmuseum.nl/docs/api)
- [Flickr::License](https://metacpan.org/pod/Flickr::License) · [flickr-photos-api](https://pypi.org/project/flickr-photos-api/1.14.1)
- [Unsplash docs](https://unsplash.com/documentation) · [Unsplash rate limit FAQ](https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit) · [Unsplash download trigger](https://help.unsplash.com/api-guidelines/more-on-each-guideline/guideline-triggering-a-download) · [Unsplash hotlinking](https://help.unsplash.com/api-guidelines/guideline-hotlinking-images) · [Pexels API docs](https://pexels.com/api/documentation/) · [Pixabay API summary](https://freeapihub.com/apis/pixabay-api)
- [EFF on Content ID vs fair use](https://www.eff.org/deeplinks/2020/01/tool-removes-copyrighted-works-not-substitute-fair-use) · [Documentary fair use after Warhol](https://www.jdsupra.com/topics/transformative-use/copyright/youtube/) · [Motion Array editorial use](https://help.motionarray.com/hc/en-us/articles/8995512354461) · [Getty: using files](https://www.gettyimages.com/faq/working-files) · [GSK media library](https://www.gsk.com/en-gb/media/media-library/)
- [Nominative use (Wikipedia)](https://en.wikipedia.org/wiki/Nominative_use) · [Nominative fair use of logos](https://www.duetsblog.com/2020/03/articles/advertising/nominative-fair-use-of-anothers-logo/) · [Romano Law on trademark fair use](https://www.romanolaw.com/can-someone-use-your-trademark-without-permission-under-the-fair-use-doctrine/)

*Not legal advice. Have a lawyer review the licence policy table once before scaling the channel.*
