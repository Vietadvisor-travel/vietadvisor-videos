# Sound & voice: SFX (music: music.md · voice direction: voice-direction.md)

## 1. Automatic SFX per event (pp_cine sends cues; the sound pass mixes them with the VO)
| Event | Cue (sfx_pro name) |
|---|---|
| cut-out slaps | `impact_thump` (rise: `whoosh_up`) |
| FG lands | `foley_coins` (cash/coins) · `foley_paper` |
| hero slam | `whoosh_reverse` 0.25 s before + `impact_cinematic` on the word |
| hero count | + `ui_counter` |
| burn-swap | `whoosh_fire` 0.9 s before + `hit_sub_drop` on the swap |
| support line | `ui_text_reveal` |
| stamp | `stamp` (thump) |
| strike | `ui_error` (buzzer) |
| bubble | `ui_pop` |
| quote | `foley_pen_write` |
| headline | `foley_paper_flutter` |
| chart | `ui_data_blip` |
| line | `foley_marker` |
| shatter | `battle_glass_break` |
| drop | `whoosh_down` + `battle_glass_break` on landing |
| flash | `hit_braam` (red: + `hit_boom`) |
| red creep | `riser_tension` |
| date | `ui_typing` |
| crash zoom | `whoosh_slash` |
| end card | `whoosh_down` · `impact_cinematic` · `ui_text_reveal` |
Override any event with `sfx:<name>` (list: `python3 tools/sfx_pro.py list`). Ambience beds are allowed only as low room tone for flashbacks (`amb_room_tone`, `amb_traffic_far`) — never a music bed.

## 2. Silence is the loudest sound
- 0.3–0.5 s of nothing before the biggest slam (write `…` in the VO line).
- After the company dies: one beat with only a sub drop and the VO.
- Don't stack more than 2 hits within 0.3 s — remove the weaker event or move it to the next word.

## 3. Voice
- `am_michael` (default, neutral US) · `bm_george` (British, heavier, for old-money / historical cases). One voice per film.
- Pace `--speed 1.0` (≈ 150 wpm). Punch lines ≤ 5 words. Names and numbers spelled for the TTS ("twenty twenty", "one point seven five billion").
- Loudness: −14 LUFS integrated, true peak ≤ −1.5 dBTP (make.mjs does it for 16:9).
