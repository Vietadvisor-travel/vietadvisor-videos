# WeWork episode 5 pack notes (research desk, 27 Oct 2026)

Slug: wework. Publish target: 5 Nov 2026. This is the round-1 pack under
MUSE_STANDING v6.6. Claude directs, scripts and renders; this pack is
research + sourcing only.

## Contents

- RESEARCH_wework.md: Story Mining Worksheet A-M, 40 facts, 10 key numbers,
  11 on-screen documents, 10 quotes, 3 decision moments, mechanism,
  counterfactual, comparisons, 9 myths, takeaways, gaps/risks, 17 figure
  traps, 3 candidate angles + 3 candidate hooks. 0 em dashes.
- desc.json: 142 entries (83 real photos, 36 real documents/screenshots,
  23 AI components). Descs in English.
- clips.json: 118 clips (a0 15, a1 18, a2 17, a3 17, a4 17, a5 18, a6 16).
  All H.264, no audio, 2-8 s, 108 at 1920x1080, 10 at 1280x720.
- Drive wework/: wework_assets_1.zip (293,887,775 bytes, 142 entries),
  wework_clips_1.zip (504,033,497 bytes, 118 clips + clips.json).
  Assets exceed 90 MB, so per MUSE_DRIVE v6.4 they live on Drive, not git.

## IMPORTANT: the schedule's $820M figure is UNVERIFIED, do not use it

No public source ties $820M to Neumann as money raised. Verified floor for
Flow: over $450M (a16z ~$350M Aug 2022 + over $100M Series B Apr 2025,
valuation ~$2.5B). Flowcarbon ($70M: $32M venture + $38M token sale, later
refunded) is a different company. The 2024 WeWork buyout bid (over $500M,
later $650M, claimed ceiling $900M) was an offer to SPEND, failed 28 May
2024, and must never be added to money raised. The only arithmetic reaching
$820M (470M a16z cumulative per a secondary podcast summary + 350M Neumann
family money) is inconsistent and mixes founder money with raised money.
RESEARCH_wework.md carries a rewritten hook: Neumann raised $350M for a new
company BEFORE the old one filed for bankruptcy in Nov 2023, and the market
called it a comeback. The timeline is the sharp point, not the number.
Before locking the script, listen to the Diary of a CEO episode 28 Sep 2026
directly to check whether Neumann actually said 470M and 350M, and whether
those are commitments, disbursed money, or asset values.

## Honesty notes for the director (all recorded in descs too)

- Photos: only Wikimedia Commons was usable (Openverse 403 from this VM).
  14 photos are below 1920px, mostly rare historical portraits and the
  415x88 logo; their true sizes are in the manifest. Neumann portraits are
  all from TechCrunch Disrupt New York 2015 plus Delhi Jan 2016; no
  verifiable free portrait exists for 2010-2014 or for the Flow era.
  Rebekah Neumann's photo is identified by source filename only, with no
  event or date: never caption it with an event or year.
- Documents: 2 FT files and 3 public-post files are NOT full-page original
  screenshots; they are header cards rebuilt from the original pages'
  elements because the bodies were paywalled or would not render. The FT
  images say so on the image, and the manifest says so. The SoftBank rescue
  release cover prints "October 23, 2018" in the original; that is the
  original's typo, not ours, and the manifest records it. Some PDF/web
  renders carry print headers/footers dated 27 Oct 2026 with file:// paths;
  those are render artifacts, the true dates are in the body text. The
  Wayback mission page is missing its video poster (Wayback 429 then 404)
  and has no footer (crop at 9000px); the Wayback home page has one grey
  image block. The Neumann CEO-exit file is an AP story on NPR Illinois
  24 Sep 2019, not a WeWork release. The a16z Flow post itself states no
  amount; $350M comes from NYT the same day and is in the manifest only,
  not on the image. The bid file is Straits Times 26 Mar 2024 carrying
  Reuters (bid over $500M); the original Reuters piece would not render.
  OSM map uses the S-1 address 115 West 18th Street; the 2023 bankruptcy
  petition lists 12 East 49th Street. Do not mix them up.
- Clips: all 118 are Pexels License with named authors; no Commons or
  archive.org footage survived the licence/quality bar. ALL 16 a6 clips are
  neutral stock, NOT real Flow buildings, NOT Neumann, NOT a16z offices:
  never caption them as such. The CLOSING DOWN SALE clip carries a small
  real retailer's URL in one corner: usable as a generic closing cutaway,
  never as a WeWork store. One IPO-analysis-desk clip shows a small EURUSD
  label on a side screen: present it as a generic analysis desk, never as
  WeWork stock. Two clips share Pexels source 3246669 but are different
  segments with different mid-frames (verified).
- AI components: 15 cut-outs, 4 textures, 5 plates, 3 full AI scenes
  (boardroom_night, empty_office_bankruptcy, event_crowd_far). Cut-outs
  have solid backgrounds (white, champagne on dark grey), NOT alpha
  transparency: composite accordingly. No AI real person, document, logo
  or headline anywhere. The whiteboard carries only the generic words
  ideas, plan, team plus abstract arrows, no real figures.

## MISSING (searched at least twice, not faked, not replaced with AI)

- Photos: Miguel McKelvey alone; Neumann 2010-2014 and Flow era 2020+;
  Summer Camp as its own event; WeLive coliving (Commons "WeLive" files are
  stills from a same-named film, rejected); the exact 115 W 18th St
  building; Meetup as its own product; WeWork London and Tel Aviv interiors
  (buildings and skylines only; Tel Aviv substitutes are Herzliya and
  Jerusalem).
- Documents: Reuters IPO 2019 piece (reuters.com 401, no usable Wayback
  snapshot); Reuters bankruptcy 2023 piece (same); WeWork 2019 roadshow
  deck (no verified public deck; a Castle Placement secondary-market
  document was rejected as not WeWork's deck).
- Footage: Neumann speaking/interviews/2010 openings at usable quality and
  licence (Boston 2014 City TV footage is 640x480 only); Masayoshi Son /
  Vision Fund press footage (only vertical/square Commons clips, rejected);
  real TV news footage of the 2019 IPO withdrawal and Nov 2023 bankruptcy
  (replaced with neutral NYSE, falling-chart, signing and empty-office
  stock, labelled as such); Neumann/Flow/a16z footage after 2022; elevator
  interiors, coworking desk setup, lights-out office, a lone sad press
  conference, a person carrying a box out of an office, a US courthouse
  exterior (nearest equivalents used and labelled).

## Generic beats the shared stock library already covers

Checked read-only with pp_stock.py coverage before hunting (library 3,999
clips): office 210, startup 77, bankruptcy 70, city 363, finance 160, money
210, people 242, event 50, news 40, media 48, documents 101, law 130,
court 93, luxury 40, realestate 60, construction 30. No library clip was
copied into this episode pack.
