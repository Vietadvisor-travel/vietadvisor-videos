# Poison Pill schedule: rolling 7 days (owner decision, 27 Oct 2026)

This file is the schedule authority for BOTH agents. It replaces the 30-day
schedule. If any older doc says otherwise, this file wins.

## The rule

- No more fixed 30-day calendar. Planning horizon is 7 days only, so the
  channel can ride what is actually trending right now, including AI, where
  everything moves fast.
- Publish cadence stays Tue / Thu / Sat, 3 episodes per week. Only the
  TOPIC CHOICE window changed, not the cadence, the format (8-12 min,
  16:9, English) or the v6.6 pack spec.
- Every Sunday, Muse scans trends and publishes `jobs/SCHEDULE_WEEK_<monday-yyyy-mm-dd>.md`
  for the FOLLOWING week (trigger: the owner writes "nghiên cứu tuần", and
  automatically every Sunday via cron `poison-pill-weekly-trend-scan`). That
  file is the ONLY schedule for the coming 7 days. There is no longer a
  month file.

## What a week file contains

For each publish slot in the next 7 days (usually 3 slots):

- topic, slug, publish date;
- WHY NOW, with dated trend evidence (news date, earnings date, viral
  moment, search spike, competitor video taking off, AI event). A topic
  with no dated "why now" does not get a slot;
- angle, thesis, hook, archetype, 3 signature shots;
- a score out of 100 (trend heat + rise-fall clarity + asset
  feasibility);
- one speed slot rule: if a big business/AI story breaks mid-week, it may
  displace the next slot, and the displaced topic returns to the idea pool.

Also in the week file: a short trend watchlist (stories heating up that
could take a slot next week, especially AI: model releases, AI company
drama, AI regulation, AI bubble debate, AI-driven collapses and comebacks).

## The old 30-day schedule: retired, with 5 exceptions

`lich-30-ngay.md` (Oct 2026) is RETIRED as a plan on 27 Oct 2026. Its
unproduced topics (Nintendo, Thomas Cook, Nikola, Luckin, FTX, and all
later ones) are NOT scheduled anymore. They survive only as an IDEA POOL:
usable again if, and only if, they trend in some future week.

The 5 already-produced episodes KEEP their dates, because the work is done:

- 27 Oct 2026: Jio vs Airtel (produced)
- 29 Oct 2026: Theranos (produced)
- 31 Oct 2026: AMD vs Intel (produced)
- 03 Nov 2026: OneCoin (produced)
- 05 Nov 2026: WeWork (research pack pushed 27 Oct 2026)

The first slot chosen purely by the new system is 07 Nov 2026, picked by
the trend scan of Sun 01 Nov 2026.

Owner decision, 30 Oct 2026: Nike vs Adidas (research ordered 30 Oct
2026) is the LAST episode taken from the retired 30-day list. From the
week of 02 Nov 2026 onward, the idea pool is CLOSED as a source for the
Sunday scan: picks come only from fresh trend findings of that week. A
retired pool topic is no longer eligible even if it trends. This does not
limit owner orders: if the owner names any topic by name, the owner's
words still win.

## How "làm tập <slug>" works now

When the owner writes "làm tập <slug>" to Claude, Claude reads:

1. the CURRENT `jobs/SCHEDULE_WEEK_*.md` for that slug's slot (topic,
   angle, thesis, hook), and
2. the episode pack in `jobs/<slug>/` (RESEARCH, desc.json, clips.json,
   NOTES) plus the Drive zips in `PoisonPill_Media/<slug>/`.

If the owner names a topic that is not in the current week file, the
owner's words win: Claude makes that episode, and Muse adds it to the week
file afterwards so the record stays true. Nobody needs to re-explain the
schedule change in chat; this file IS the explanation, and it lives in the
repo both agents read.

## What did NOT change

- Research pack spec (v6.6), Drive layout (v6.4), voice picks
  (VOICE_MODELS.md), stock library, and the two-agent split (Muse
  researches and sources, Claude directs, scripts and renders).
- "bổ sung shotlist <slug>" still works exactly as in MUSE_STANDING §2b.
