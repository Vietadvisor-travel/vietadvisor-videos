# VOICE DIRECTION: cast and direct the read like a real narrator (v6)

The voice is half the film. A flat read at one speed makes the best pictures feel cheap. v6 directs Kokoro (free,
offline, Apache-2.0) the way a director coaches a narrator:
- **cast** a voice per episode;
- **set** the read of each act;
- **shape** every sentence by what it does;
- **mark** the few moments that need a special touch.

All of it is plain text in the story file. `tools/voice.py` does the rest. Word timing (words.json) stays exact, so
visuals still land on their words.

## 1. Cast the narrator: one per episode, chosen by ear
`voice:` in the header takes a name, a **blend** or a **prosody mix**:

| Spec | What it is | Use for |
|---|---|---|
| `am_michael` | A US male, clear and neutral | Default explainer |
| `am_michael*.7+bm_george*.3` | A blend: US clarity with British gravitas | Corporate fraud, serious falls |
| `am_michael~am_puck*.2` | Michael's timbre with 20 % of Puck's pitch and pacing: brighter, more movement | Comedy-heavy, absurd stories |
| `am_michael~bm_george*.2` | The same man with a flatter, slower read | Slow-burn, tragic |
| `bm_george` / `bm_lewis*.6+am_michael*.4` | British storyteller | History-heavy, old-money empires |
| `am_fenrir` | Deeper US male | Thriller, crime |
| `af_heart` / `bf_emma` | Female narrators (A-grade / British) | Consumer, fashion, food, any story where it fits |

Rules:
- **Audition before you cast.** `python3 tools/voice.py audition "<the hook line>" out/aud` writes the same line in 8 casts.
  Muse listens and picks one.
- Keep the opposite-gender share in a blend ≤ 0.25, or the voice sounds androgynous.
- **Rotate the narrator across episodes** only when the content asks for it. The channel may keep one signature narrator
  and vary the *read* (`delivery:` and the prosody mix) instead. Both are recorded in the director package.

## 2. Set the episode's read: `delivery:`
`delivery: calm | lively | tense | wry | warm` scales speed, pauses and pitch for the whole episode:
- **calm:** slow, long pauses, slightly lower. Tragic or reflective stories.
- **lively:** quicker, tighter and brighter. Booms, manias, comedy.
- **tense:** slightly slow and low. Fraud, investigations, countdowns.
- **wry:** neutral pace, a little more air. Deadpan humour, the channel default.
- **warm:** slow and open. Founders' dreams, human stories.

## 3. The act sets the read (automatic)
Every `# cine act=…` passes its act to the voice. The same narrator reads:

| act | speed | pauses | pitch |
|---|---|---|---|
| hook | +2 % | tighter | – |
| setup | −2 % | normal | – |
| rise | +4 % | tighter | +0.15 st, brighter |
| peak | +3 % | tighter | +0.1 st |
| doubt | −4 % | +15 % | −0.15 st |
| fall / crash | −7 / −8 % | +25 / +30 % | −0.35 / −0.4 st, heavier |
| after / lesson / verdict | −8 to −9 % | +20 to +30 % | −0.2 to −0.25 st, reflective |

**Pitch** uses formant-preserving rubberband, so the voice gets lower without sounding like a different person. It does
not change the timing.

## 4. Each sentence is read by what it does (automatic)

| role (detected) | read |
|---|---|
| scene-setting (> 20 words) | slower, a long pause after |
| fact (has a number) | neutral, clear |
| build-up | faster, short pauses: momentum |
| **reveal (≤ 5 words)** | slow, **with a held silence before it**. The silence before a reveal is the device. |
| question | slightly slower, the question hangs |
| quote (a cast voice) | slightly slower, a breath before |

- A seeded jitter (±2 % speed, ±50 ms pauses) keeps the rhythm human. Re-renders stay identical.
- **Write for this:** mix sentence lengths (5 / 18 / 9 words). A reveal gets its own short sentence ("Six months later?
  Gone."). `…` and ` — ` give a held beat, and `[BEAT]` gives a 0.6 s pause with a music dip.
- Punctuation drives the intonation:
  - `?` rises (yes/no questions) or falls (wh- questions);
  - `:` sets up a reveal ("There was one problem: the money.");
  - use `!` at most once a minute.

## 5. Mark the moments that need a special touch: `{tags}`
Tags go anywhere in a caption line and are removed from the caption. **Use at most 1 in 8 lines.** The automatic read
is already directed.

| tag | effect |
|---|---|
| `{hold}` | 0.7 s of silence before the line: the room holds its breath |
| `{hit}` | Punchline: slower, a held beat before it and room after |
| `{slow}` / `{fast}` | ±10 % speed for this line |
| `{low}` | −0.5 semitone: gravity, a verdict |
| `{up}` | +0.4 semitone: surprise, irony |
| `{soft}` | A gentler, slower read |
| `{archive}` | A band-limited "read document" colour, for letters, memos and court filings |

**v6.3 emotions** (`content-and-audience.md` §5): `{excited}` `{urgent}` `{tense}` `{grave}` `{sad}` `{warm}`
`{wry}` `{awe}`.
- Each one sets speed, pauses and pitch, and lends the narrator the prosody of a matching voice (`narrator~donor*w`).
  The narrator's timbre stays.
- They are not capped at 1 in 8. They follow the emotional arc; `pp_lint` warns only above 60 %.
- Combine with a device: `{sad,hold}`.

```
# cine act=fall fx="build:x;el:N=num:0;do:N.count@zero~N.red@zero"
And the company's value? {hit} Zero.
```

## 6. Quote voices: real people's words, read by a cast voice
```
voices: musk=bm_lewis; holmes=bf_emma
…
# cine act=doubt fx="quote:We will be profitable next year.;by:Elon Musk"
@musk: We will be profitable next year.
```
- `@<speaker>:` at the start of a caption → that line is read by the cast voice. The caption shows the words with a small
  **"WORDS OF MUSK · VOICED"** tag above them.
- An uncast speaker automatically gets a contrasting voice with the other accent.
- **Rules (legal and trust):**
  1. Quote voices only for **real, sourced, verbatim words** (filings, letters, interviews, posts), with the source in the
     research file.
  2. Always attribute on screen (the quote fx with `by:` plus the VOICED tag) **and** in the narration ("In his words:").
  3. **Never cast or tune a voice to sound like the real person.** Choose by contrast (gender match, opposite accent),
     not by imitation.
  4. One voice per person, the same across the whole episode. **At most 3 voices** in an episode, including the narrator.
  5. Use a quote voice only for quotes of more than one clause. A short quote reads better in the narrator's voice.
  6. Tick YouTube's **"altered or synthetic content"** box in an episode that uses quote voices.

## 7. The finish (automatic)
- **Room tone:** a quiet bed at about −62 dBFS under the whole voice track, so there is no dead digital silence between
  lines.
- **Narrator EQ:** warmth at 120 Hz, less box at 250 Hz, presence at 3.2 kHz.
- `sound_design.py` then de-esses, compresses and sets the voice bus to −16 LUFS, with the music ducked underneath.
- `PP_VO_DRY=1` skips the room tone and EQ.

## 8. Speed on Muse
- v6 uses the **fp32** Kokoro model (`kokoro-v1.0.onnx`, 326 MB). On x86 CPUs it is about 4× faster than the old int8
  file: about 0.6 s of compute per second of audio on 4 cores.
- `python3 tools/voice.py setup` downloads it once. `PP_VOICE_INT8=1` keeps the small int8 file on a machine short on
  disk.
- Every line is cached by text, voice, act, tags and delivery. Editing one line re-voices only that line.

## 9. Director checklist (in the director package)
- [ ] `voice:` cast chosen for this content, with one line on why, auditioned on the hook line.
- [ ] `delivery:` chosen.
- [ ] `voices:` for any real quotes, with each quote sourced.
- [ ] Reveals written as their own short sentences, with a `{hit}` or `{hold}` on at most 1 in 8 lines.
- [ ] The read changes with the acts: the rise sounds different from the fall. Listen to one line from each act.
