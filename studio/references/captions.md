# Captions — subtitles that help, never fight the picture

Most short-form viewers start with sound off; captions keep them, lettering wows them. Sources: subclip / Submagic style
guides, platform safe-zone specs (TikTok, Reels, Shorts), Netflix timed-text principles.

## What the engine does (engine/ui.js)
- **FIXED (Oct 2026, user rule): small and always in the same place.** Vertical: 34 u Be Vietnam Pro ExtraBold, max width 80 %,
  baseline at 81.5 % of the height. 16:9: 30 u, 48 u from the bottom, max width 70 %. 1–2 lines. `capY=` is ignored.
- Thin dark stroke + soft shadow, white text; pop-in (0.2 s) and quick fade-out (0.15 s); timed to the real voice.
- **One accent colour, automatic**: words containing digits (numbers, years, prices) turn yellow. Manual control:
  `*word*` = yellow, `[word]` = brand orange (punchlines, prices); any manual mark switches the automatic accent off for that line.
- `captions=karaoke` in `look:` highlights the spoken word; use it for hooks and fast lists, not for whole films.
- Captions never move. Keep the picture out of the caption band (vis beats do this by construction).

## Writing rules
1. One caption = one voice line = one idea, **3–7 words per line, ≤ 2 lines** (hooks 2–5 words).
2. Break at phrase boundaries (never between article and noun, number and unit).
3. Reading speed ≤ 3.5 words/s (lint warns above). If it's too fast, cut words — not time.
4. Highlight sparingly: ≤ 1 accent per caption; the number or the contrast word ("*never*", "[$2]").
5. Captions = the voice exactly (accessibility + sync). Lettering is where you paraphrase.
6. When big lettering is on screen, the caption can drop: put the line in the lettering and set `caps=off` on that beat if the voice repeats it.
7. Vietnamese names keep diacritics in captions (Hoàn Kiếm), the voice respells them.
8. No subject in the caption band — move the subject, never the caption.

## Safe zones
- 9:16 (1080×1920): keep captions inside x 14–86 %, y 62–80 %; lettering y 12–40 %; nothing in the right 12 % (buttons) or bottom 18 % (description).
- 16:9: 5 % title-safe margin; leave the bottom-right corner free for YouTube end-screen elements in the last 20 s.
