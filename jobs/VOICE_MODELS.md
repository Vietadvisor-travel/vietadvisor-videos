# VOICE MODELS: the best FREE narrator voice for Poison Pill

Date: 26 Oct 2026. Task: jobs/MUSE_VOICE_TASK.md (parts A-D).
Research detail: ~/workspace/pp-voice/research.md (working file, not committed).
REVISED same day: the Kitten pick below (section 1A) was revoked by the
owner after re-listening; the current pick is the trio in section 1B.

## 0. What actually happened (read this first)

- Part A (research) ran to completion: 21 models surveyed, licences quoted,
  CPU figures collected, free tiers verified on official pricing pages on
  26 Oct 2026.
- Part B (listen test) was CUT SHORT by the owner. The owner listened to
  30 samples (3 models x 2 voices x 5 lines: Kokoro, Kitten, Chatterbox
  Turbo) and decided on the spot: **Kitten only, both male and female
  voices. Stop there.**
- Supertonic's 10 samples finished rendering around the same time and are
  included in voice_samples.zip for reference, but they were NOT part of
  the owner's first decision and were never scored.
- REVERSAL, 26 Oct 2026: the owner listened again, judged the Kitten
  voice poor ("lởm"), and admitted the earlier decision was a mistake.
  The Kitten decision is REVOKED (section 1A). The owner's NEW decision,
  by ear: adopt ALL THREE remaining models that have rendered samples,
  each in both a male and a female voice (section 1B). There was no
  re-scoring round: the test was cut before the scoring step, so
  **no subjective /10 scores exist for any model**, and this file does
  NOT invent any. The comparison set below is: the revoked pick, plus
  the 3-model pick, plus the research shortlist that was never
  listen-tested.
- Consequence, stated plainly: every model in section 1B was chosen by
  the owner's ear from the rendered samples, not by a ranked score.
  Objective measurements only (duration, pace, pitch, pause length;
  see section 4) exist for the samples. A ranked "top 4" was never
  produced, because Part B never reached scoring.

## 1A. REVOKED: KittenTTS nano-0.1 (NOT KittenTTS 2) - DO NOT USE

- Model: `KittenML/kitten-tts-nano-0.1`, the KittenTTS 0.8 line.
- Voices that were approved, then revoked: `expr-voice-2-m` (male) and
  `expr-voice-2-f` (female).
  Full built-in list: expr-voice-2/3/4/5, each in -m and -f.
- Parameters: 15M. Weights: `kitten_tts_nano_v0_1.onnx` (23,847,845 bytes)
  + `voices.npz` (10,294 bytes). Output 24 kHz WAV, CPU-only, ONNX.
- Package: `kittentts==0.1.3` (PyPI). System dependency: espeak-ng
  (phonemizer's EspeakBackend raises "espeak not installed" without it).
- Sampling settings used for the (revoked) samples: voice as above,
  speed=1.0, 24 kHz. Nano-0.1 has NO emotion control: no tags, no preset,
  no exaggeration slider. Delivery is steered only by punctuation and
  phrasing.
- Measured on the 2-core test box, 26 Oct 2026: model load ~4 s;
  render RTF ~0.45 (male) / ~0.59 (female), i.e. a 10-minute script renders
  in roughly 4.5-6 minutes plus chunking overhead.
- Licence: Apache-2.0, verified 26 Oct 2026 from the Hugging Face model
  metadata API for KittenML/kitten-tts-nano-0.1 (`"license": "apache-2.0"`).
  The repo itself ships no LICENSE file (files: README.md, config.json,
  onnx, voices.npz); the LICENSE in the Drive zip is the canonical
  Apache-2.0 text. Output ownership: UNVERIFIED as an explicit clause
  (Apache-2.0 covers code/weights, not output ownership).
- REVOCATION STATUS: the Drive pack `_voice/kitten/kitten_weights_1.zip`
  (19.6 MB) is STILL ON DRIVE, because `tools/pp_drive.py` has NO delete
  command (its commands are put / ls / check / get / init / selftest /
  share; only selftest deletes, and only its own `_selftest` pack).
  The pack is therefore left in place but is REVOKED: DO NOT USE IT for
  narration. Its samples in `voice_samples.zip` are historical reference
  only. The old `reference_voices.zip` (Kitten markers only) has been
  REPLACED (section 6); do not use any surviving local copy of the old
  reference zip.

### WARNING: KittenTTS 2 is a different model

KittenTTS 2 (released 22 Oct 2026) is NOT what the owner heard and NOT
what was ever delivered here. It is a 1.7B model with person-named voices
(Bruno, Bella...), 10 emotion tags, an expressive preset, and a
DIFFERENT licence: Stellon Labs Community License. Its commercial grant
ends above USD 1,000,000 annual revenue or total cumulative funding, it
requires registration with Stellon Labs for commercial use, and it
carries "Powered by KittenML" attribution duties for distributed products
or docs. None of those conditions apply to the revoked nano-0.1 pack.
Do not swap in KittenTTS 2 weights expecting the approved voice:
the voice will change, and the licence will change. KittenTTS 2 was
never listen-tested in this task and is not part of the current pick.

## 1B. THE CURRENT PICK (owner decision, 26 Oct 2026, by ear): three models, both voices each

No /10 scores exist. The owner chose all three models below after
re-listening, each in a male and a female voice. All three packs were
verified offline from their own zips on 26 Oct 2026 (section 7).

### 1B.1 Kokoro-82M: male am_michael, female af_heart

- Model: Kokoro-82M v1.0, 82M parameters, ONNX weights
  (`kokoro-v1.0.onnx` 325,505,369 bytes + `voices-v1.0.bin`
  28,214,398 bytes). Output 24 kHz WAV, CPU-only.
- This is the channel's INCUMBENT baseline voice, not a new discovery.
- Package used for the samples: `kokoro-onnx==0.6.1` (not the PyTorch
  `kokoro` package from research.md; the ONNX path is what rendered
  the samples and what the Drive pack reproduces).
- System dependency, REQUIRED at OS level: espeak-ng. Verified
  26 Oct 2026: a fresh install needed `apt-get update` first before
  espeak-ng (1.51) became locatable, then the offline test passed.
  The render machine MUST have espeak-ng installed; the model zip
  alone is not enough.
- Sampling settings used for the samples: `voice="am_michael"` /
  `"af_heart"`, `speed=1.0`, `lang="en-us"`, 24 kHz.
- Emotion control: NONE. Controls are voice, speed and
  phrasing/punctuation only. Voice blending of two presets is possible
  but creates a mixed preset, not an emotion.
- Licence (weights): Apache-2.0, the cleanest licence in the trio.
  Model card: "With Apache-licensed weights, Kokoro can be deployed
  anywhere from production environments to personal projects" and
  "This is an Apache-licensed model, and Kokoro has been deployed in
  numerous projects and commercial APIs." The `kokoro-onnx` loader
  package is separately MIT; that does not change the weights licence.
  Output ownership: UNVERIFIED as an explicit clause (Apache-2.0
  covers the weights, not output ownership).
- Speed: no vendor 4-core figure exists. Independent 4-core Xeon
  benchmark (secondary): ONNX RTF ~0.64, i.e. ~6.4 minutes per
  10-minute script plus chunking overhead. Benchmark locally.

### 1B.2 Chatterbox Turbo: male am_michael, female af_heart (synthetic reference clips)

- Model: Chatterbox Turbo (Resemble AI), 350M parameters, ~2.99 GB total.
- Voices: the sample labels `am_michael` / `af_heart` are the NAMES OF
  THE SYNTHETIC REFERENCE CLIPS, not built-in Chatterbox voices. Turbo
  clones from a reference clip (zero-shot, ~5 s). The reference clips
  used are SYNTHETIC Kokoro clips (no real person), shipped in the
  pack and in `reference_voices.zip`. To reproduce the sample voices
  you MUST pass one of those clips as `audio_prompt_path`; without a
  reference clip, Turbo's fallback default voice is UNVERIFIED.
- Package: `chatterbox-tts==0.1.7`, class `ChatterboxTurboTTS`,
  `from_local(<folder with both parts>, device="cpu")`.
  Torch CPU build used for the samples: torch 2.6.0+cpu,
  torchaudio 2.6.0+cpu. No extra OS package was needed.
- Sampling settings used for the samples: Turbo defaults
  (temperature 0.8, top_p 0.95, top_k 1000, repetition_penalty 1.2),
  24 kHz WAV. Turbo IGNORES `exaggeration` / `cfg_weight` (those
  belong to the base model); it uses INLINE paralinguistic tags
  ([sigh] [gasp] [cough] [laugh] [whisper] [breath] [chuckle]).
- Licence: MIT. Vendor quote (Turbo page): "Yes. Chatterbox Turbo
  ships under the MIT license. You can use it in personal, research,
  and commercial projects - including closed-source products - subject
  to the license terms on GitHub." Output ownership: UNVERIFIED as an
  explicit clause.
- WATERMARK (do not skip): every audio file generated by Chatterbox
  includes Resemble AI's Perth (Perceptual Threshold) Watermarker:
  "imperceptible neural watermarks that survive MP3 compression,
  audio editing, and common manipulations while maintaining nearly
  100% detection accuracy." (PyPI page.) The watermark is inaudible
  but detectable; do not promise "unwatermarked" Chatterbox audio.
  The offline test log confirms it: "loaded PerthNet (Implicit)".
- Speed: SLOWEST of the trio on CPU, by a wide margin. Secondary
  Ryzen 9 figures (research.md): Turbo ~15-25 s per 10 s of audio
  (~15-25 min per 10 min narration). On this 2-core test box the
  offline verification was far slower still (section 7: 85.9 s for a
  2.50 s sentence, male; 59.2 s for a 2.46 s sentence, female, plus
  66.1 s model load). Do not use Turbo for bulk narration without a
  time budget; Kokoro and Supertonic are both faster.
- Known workaround (test-only, package untouched): on the
  torch/librosa combo used here, the reference-mel path hit a
  float64/float32 matmul mismatch ("expected scalar type Double but
  found Float"). The verification forced float32 audio at the
  S3Tokenizer mel entry and cast `norm_loudness` output back to
  float32. Root cause: `norm_loudness` multiplies float32 audio by a
  numpy float64 gain, promoting the reference to float64. Apply the
  same two casts only if you hit the same error on the render machine.

### 1B.3 Supertonic 3: male M1, female F1

- Model: Supertonic 3, 99M parameters, ONNX Runtime design target,
  ~382 MB (onnx + voice styles + config). Output 44.1 kHz WAV,
  CPU-only. The pack also contains M2/F2 voice-style files that were
  downloaded with the model; the decision covers M1/F1 only.
- Package: `supertonic==1.3.1`, `TTS(model="supertonic-3",
  model_dir=<unzipped pack>, auto_download=False)`.
  No extra OS package was needed for the offline test.
- Sampling settings used for the samples: `voice M1` / `F1`,
  `total_steps=8`, `speed=1.0`, `lang="en"`, 44.1 kHz. (The research
  snippet used speed=1.05; the samples used speed=1.0, and 1.0 is the
  setting that reproduces them.)
- Emotion control: 10 inline expression tags in v3 (only `<laugh>`,
  `<breath>`, `<sigh>` are named in the primary sources checked; the
  other seven are UNVERIFIED, do not invent them). Plus `total_steps`
  (5 low to 12 high, default 8) and `speed` (0.7-2.0).
- Licence (weights): OpenRAIL-M (code MIT). THIS IS NOT MIT:
  OpenRAIL-M imposes use-based restrictions, and it is the most
  conditioned licence in the trio. Site summary: "The trained
  Supertonic 3 model is released under the OpenRAIL-M license. Weights
  are open and usable commercially, with use-based restrictions (no
  harm, no impersonation without consent) and an attribution
  requirement." Full text:
  https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE
  (re-checked verbatim 26 Oct 2026; the LICENSE file in the Drive zip
  is a transcription of that BigScience Open RAIL-M text, dated
  18 August 2022).
- DISCLOSURE CONDITION (do not skip): OpenRAIL-M Attachment A (e)
  forbids generating or disseminating content "without expressly and
  intelligibly disclaiming that the information and/or content is
  machine generated". A documentary published with Supertonic audio
  MUST therefore carry an express, intelligible AI-generated-audio
  disclosure. Attachment A (g) bars impersonation without consent.
- Output: Section 6 states the licensor claims no rights in the
  output you generate, but you are accountable for that output and
  its subsequent uses.
- Speed: no vendor 4-core figure exists. Independent 4-core Xeon
  benchmark (secondary): v3 2-step RTF ~0.121 (~1.2 min synthesis per
  10 min narration), 5-step RTF ~0.240. Vendor M4 Pro figures are much
  faster and must not be promised on a 4-core VM. Benchmark locally.
- Cloning: the package alone has no direct reference-audio cloning
  call. M1/F1 are built-in voices; no cloning was used for these
  samples, and Voice Builder commercial terms were UNVERIFIED in
  research.md.

## 2. Candidate table

CPU figures marked (secondary) come from an independent 4-core Xeon
benchmark or vendor-adjacent reports, NOT from vendor-published 4-core
figures (no vendor publishes one). "Listen status" is the honest state
of Part B for each model. NO model carries a subjective /10 score.

| Model | Licence (weights) | Params / size | CPU-only? / speed | Emotion control | Listen status |
|---|---|---|---|---|---|
| Kokoro-82M (PICK) | Apache-2.0 | 82M / 327 MB | Yes; RTF ~0.64 (secondary) | None (voice + speed only) | Full samples (10 files), OWNER PICK by ear |
| Chatterbox Turbo (PICK) | MIT | 350M / ~2.99 GB | Yes, SLOW (see 1B.2; 59-86 s per ~2.5 s sentence on this 2-core box) | Inline tags (Turbo); NO exaggeration/cfg_weight | Full samples (10 files), OWNER PICK by ear |
| Supertonic 3 (PICK, M1/F1) | OpenRAIL-M (code MIT) | 99M / ~400 MB | Yes; RTF ~0.121 at 2 steps (secondary) | 10 inline tags | Samples rendered (10 files), OWNER PICK by ear (second decision) |
| KittenTTS nano-0.1 (REVOKED) | Apache-2.0 (HF metadata, 26 Oct 2026) | 15M / ~24 MB | Yes; RTF 0.45-0.59 measured on this box | None | Full samples (10 files), FIRST pick, REVOKED after re-listen (voice judged poor) |
| KittenTTS 2 | Stellon Labs Community License | 1.7B / 947 MiB default, 506 MiB emb4 | Yes, CPU-designed; no 4-core figure | 10 emotion tags + inline events + expressive preset | NOT listen-tested |
| MeloTTS (EN) | MIT | ~158M / ~500-600 MB (unverified exact) | Yes, CPU real-time claim | None | NOT listen-tested |
| Parler-TTS Mini v1.1 | Apache-2.0 | 938M / ~1.9 GB bf16 (unverified exact) | Path exists; no speed figure | Description prompt | NOT listen-tested (never Expresso: CC BY-NC data) |
| StyleTTS2 original | MIT code; weights licence partially verified | ~144M / unverified | Plausible; no 4-core figure | alpha/beta/embedding_scale + reference style | NOT listen-tested |
| Sesame CSM-1B | Apache-2.0 (reported; card gated, not directly verified) | ~1B / ~2 GB est. | Path exists; no speed figure | None (context only) | NOT listen-tested |
| Magpie-Multilingual 357M | NVIDIA Open Model License | 357M / ~0.7 GB est. | Via NeMo-Speech.cpp; PyTorch CPU speed unverified | Limited ("expressive", no tag API) | NOT listen-tested |
| Ming-3.0-tts 0.5B | MIT | 0.5B backbone / ~2.96 GB (secondary) | Unverified; tested on H800/H20 | Emotion/speed/pitch/volume + 14 tags | NOT listen-tested |
| Qwen3-TTS 0.6B/1.7B | Apache-2.0 (secondary-verified only) | 0.6B/1.7B / 2.5/4.5 GB | Possible offline, slow; no primary figure | Natural-language instruct | NOT listen-tested |
| Maya1 | Apache-2.0 (card FAQ) | ~3.3B / ~7 GB | No (official: 16 GB+ VRAM BF16) | 20+ tokens + description | NOT listen-tested |
| Step-Audio-EditX | Apache-2.0 (secondary only; card metadata empty) | 3B / 8.31 GB | No (official: CUDA, 12-16 GB) | Dozens of emotions + tags | NOT listen-tested |

Scores: NONE. No model in this file carries a subjective /10 score, because
Part B was stopped before scoring. Any score quoted elsewhere for these
models did not come from this task's listen test.

## 3. Rejected models and why

- F5-TTS: weights CC-BY-NC (code MIT does not save it).
- IndexTTS-2: weights require written commercial authorisation
  (bilibili Index-TTS Model License); the project's "Free for Commercial
  Use!" line describes the code licence only.
- Higgs Audio V2: licence conflict (Apache-2.0 vs research-only), LICENSE
  link on the card 404 on 26 Oct 2026, ~12 GB VRAM at fp16.
- VibeVoice 1.5B/7B: card restricts to research/development, 16 GB GPU
  class, CPU 10-100x slower than GPU; Realtime variant inserts an audible
  disclaimer into every file.
- Zonos-v0.1: Apache-2.0 but GPU-first, CPU 10-20x slower (est. 50-100 min
  per 10 min narration), and it has no built-in narrator voice (a
  reference clip is mandatory).
- Dia 1.6B: Apache-2.0 but GPU-only per card, ~10 GB VRAM, CPU support
  "to be added soon".
- Breeze TTS 2: research/non-commercial weights licence.
- Fish Audio Drama 3: min 48 GB GPU. Fish Audio S2 Pro: research licence.
- Voxtral TTS: CC BY-NC 4.0 (TTS weights). OpenAudio S1 Mini: CC-BY-NC-SA.
- XTTS v2: Coqui CPML.
- Orpheus 3B: HOLD, not fully rejected. Apache-2.0 tag conflicts with its
  Llama 3 base (Canopy admitted the tag is a mistake); official vLLM path
  needs >12 GB VRAM.

## 4. Listen test: what was actually measured

Test lines (same for every candidate):
1. `Picture an arena in London. Packed. Dark. Waiting.` (tense, slow)
2. `She promised them that in two years, nobody would speak about Bitcoin anymore.` (wry)
3. `Her mother lost everything she had saved for thirty years.` (sad)
4. `The plan worked. Almost to the word.` (grave, held pause before "Almost")
5. `Ruja Ignatova sold OneCoin to three million people and took four billion euros.` (pronunciation)

Voices: male documentary narrator + one female alternative per model.
Cloning: never a real identifiable person. Kokoro and Chatterbox-Turbo
samples used synthetic Kokoro voices (am_michael / af_heart) as reference;
Kitten and Supertonic used their own built-in voices. No clone reference
clip exists for Kitten: its voices are built-in embeddings. Chatterbox's
reference clips are synthetic Kokoro clips, shipped in
`reference_voices.zip`.

Objective measurements (from the listen-test analysis; NOT subjective
scores). Line 4 pause before "Almost" is the most documentary-relevant
number: Kokoro male 0.45 s, Chatterbox-Turbo male 0.41 s, Kitten male
0.29 s, Supertonic male 0.48 s (female: Kokoro 0.32 s, Chatterbox 0.31 s,
Kitten 0.35 s, Supertonic 0.49 s). Pace on line 1 (male): Kitten 122 wpm,
Kokoro 119 wpm, Chatterbox-Turbo 113 wpm, Supertonic ~104 wpm (F1).
Full per-file measurements live in the working files, not in git.

## 5. Free cloud tiers (comparison only, verified 26 Oct 2026)

- Google Cloud Chirp 3 HD: YES, 0-1M characters free, monthly recurring
  (page header establishes monthly billing; billing must be enabled;
  overage auto-charged at $30/1M). Source:
  https://cloud.google.com/text-to-speech/pricing. Commercial use on
  YouTube: UNVERIFIED from the pricing page itself.
- Amazon Polly Generative: YES as worded for classic Free Tier accounts
  (100k chars/month, first 12 months), BUT new accounts after 15 July
  2025 move to a $200 Free Tier credit scheme (free plan 6 months,
  credits usable within 12 months), so 100k/month cannot be quoted
  unconditionally for a new account. Source:
  https://aws.amazon.com/polly/pricing/. Output ownership: UNVERIFIED
  from a primary AWS terms page.
- Gemini TTS (Gemini API / AI Studio): NO fixed monthly quota to quote.
  Free tier is "Free of charge" subject to unpublished per-project rate
  limits; paid rates $0.50 text / $9.00 audio per 1M tokens through
  31 Dec 2026, doubling 1 Jan 2027. On Cloud Text-to-Speech the same
  Gemini rows say free usage "Not available". Free-tier content is used
  to improve Google's products (paid tier: no). Source:
  https://ai.google.dev/gemini-api/docs/pricing.
- Practical takeaway: Chirp 3: HD's 1M/month is the cleanest recurring
  free tier; Polly Generative is scheme-dependent for new accounts;
  Gemini TTS free tier is rate-limited testing, not production volume.

## 6. Drive delivery (PoisonPill_Media/_voice/, verified by ls 26 Oct 2026)

- `_voice/voice_samples.zip` (7.5 MB): ALL 40 rendered samples
  (4 models x 2 voices x 5 lines), filenames kept as
  `<model>__<voice>__<line1-5>.wav` under `samples/` inside the zip.
  UNCHANGED from the first delivery (not re-uploaded). Kitten samples
  inside are historical reference only after the revocation.
- `_voice/kitten/kitten_weights_1.zip` (19.6 MB): REVOKED, DO NOT USE.
  Still on Drive only because `pp_drive.py` has no delete command
  (section 1A). Everything needed to run the revoked voice offline
  (`kitten_tts_nano_v0_1.onnx`, `voices.npz`, `HOWTO.md`, `LICENSE`
  Apache-2.0, `LICENSE-NOTE.md`).
- `_voice/kokoro/kokoro_weights_1.zip` (353.7 MB): everything needed
  to run Kokoro OFFLINE: `kokoro-v1.0.onnx`, `voices-v1.0.bin`,
  `HOWTO.md`, `LICENSE` (Apache-2.0 weights text), `LICENSE-NOTE.md`.
  Single part.
- `_voice/chatterbox-turbo/chatterbox-turbo_weights_1.zip` (1,917.0 MB)
  + `_voice/chatterbox-turbo/chatterbox-turbo_weights_2.zip`
  (1,071.6 MB): everything needed to run Chatterbox Turbo OFFLINE,
  split across two parts that must be unzipped into ONE folder.
  Part 1: `t3_turbo_v1.safetensors`, `t3_turbo_v1.yaml`, tokenizer
  files, `HOWTO.md`, `LICENSE` (MIT). Part 2:
  `s3gen_meanflow.safetensors`, `ve.safetensors`, `conds.pt`, the
  two synthetic Kokoro reference clips, `HOWTO.md`, `LICENSE` (MIT).
  SIZE NOTE: part 1 is 1,917.0 MB in decimal bytes (1,828.2 MiB)
  because the single `t3_turbo_v1.safetensors` file itself is
  1,915,480,052 bytes, just over a decimal 1.9 GB. A single checkpoint
  file cannot be split across model zips without breaking it, so
  part 1 is one file over the decimal limit but under 1.9 GiB and
  under Drive's 2 GB easy limit. Part 2 is under the limit.
- `_voice/supertonic/supertonic_weights_1.zip` (399.6 MB): everything
  needed to run Supertonic 3 OFFLINE: `config.json`, `onnx/` (4
  models + `tts.json` + `unicode_indexer.json`), `voice_styles/`
  (M1, M2, F1, F2), `HOWTO.md`, `LICENSE` (OpenRAIL-M transcription),
  `LICENSE-NOTE.md`. Single part.
- `_voice/reference_voices.zip` (1.6 MB): REPLACED 26 Oct 2026 via
  `pp_drive.py put` (same name, new content, new md5; the tool
  replaces a same-name file whose md5 differs). New contents: README
  (stating the Kitten replacement) + line-1 voice markers for the
  3 picked models, male and female (6 files) + the 2 synthetic Kokoro
  clips used as Chatterbox references. NO Kitten markers remain in
  this zip. No real person's voice anywhere.
- Verified 26 Oct 2026 with `python3 tools/pp_drive.py ls _voice`:
  7 files (kitten pack, kokoro pack, 2 chatterbox parts, supertonic
  pack, reference_voices.zip, voice_samples.zip); sizes as above.

## 7. Offline verification, REAL, from the zips themselves (26 Oct 2026)

Each model was verified by unzipping ITS OWN Drive zip into a fresh
folder (not the original work directory) and rendering the test
sentence "The plan worked. Almost to the word." with offline
environment variables (`HF_HUB_OFFLINE=1`, plus
`TRANSFORMERS_OFFLINE=1` for Chatterbox). All three models PASSED.
No model in the pick failed offline verification, so no failure
needs to be recorded here; the two attempts rule was not triggered.

| Model | Load | Test render (male / female) | Output | OS package needed |
|---|---|---|---|---|
| Kokoro-82M | 2.1 s | male 2.3 s for 2.69 s audio; female 2.4 s for 2.30 s audio | 24 kHz WAV, both voices | YES: espeak-ng (1.51, after `apt-get update`); without it phonemisation fails |
| Chatterbox Turbo | 66.1 s | male 85.9 s for 2.50 s audio; female 59.2 s for 2.46 s audio | 24 kHz WAV, both voices, PerTh watermark loaded | NO extra OS package; float32 workaround needed on this torch/librosa combo (see 1B.2) |
| Supertonic 3 | 1.5-2.3 s | male 1.7 s for 3.17 s audio; female 1.7 s for 3.17 s audio | 44.1 kHz WAV, both voices | NO extra OS package |

Test files (verify_*.wav) were working outputs only and are not
delivered; the delivered samples are the 40 files in
`voice_samples.zip`.

HOWTO summaries (full text inside each zip):

```bash
# Kokoro
pip install "kokoro-onnx==0.6.1" soundfile numpy onnxruntime
apt-get install -y espeak-ng   # REQUIRED at OS level
```

```python
# Kokoro, offline, local paths
import os
os.environ["HF_HUB_OFFLINE"] = "1"
import soundfile as sf
from kokoro_onnx import Kokoro
kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
samples, sr = kokoro.create("The plan worked. Almost to the word.",
                            voice="am_michael", speed=1.0, lang="en-us")
sf.write("one_sentence.wav", samples, sr)  # 24000
```

```bash
# Chatterbox Turbo (both parts unzipped into ONE folder first)
pip install "chatterbox-tts==0.1.7" torchaudio soundfile numpy
```

```python
# Chatterbox Turbo, offline
import os
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
import soundfile as sf
from chatterbox.tts_turbo import ChatterboxTurboTTS
model = ChatterboxTurboTTS.from_local("./chatterbox-turbo", device="cpu")
wav = model.generate("The plan worked. Almost to the word.",
                     audio_prompt_path="./chatterbox-turbo/ref_synthetic_kokoro_am_michael.wav")
audio = wav.squeeze(0).numpy() if hasattr(wav, "numpy") else wav
sf.write("one_sentence.wav", audio, model.sr)  # 24000
```

```bash
# Supertonic 3
pip install "supertonic==1.3.1" soundfile numpy onnxruntime
```

```python
# Supertonic 3, offline
import os
os.environ["HF_HUB_OFFLINE"] = "1"
import numpy as np, soundfile as sf
from supertonic import TTS
tts = TTS(model="supertonic-3", model_dir="./supertonic3",
          auto_download=False)
style = tts.get_voice_style(voice_name="M1")  # or "F1"
wav, duration = tts.synthesize("The plan worked. Almost to the word.",
                               voice_style=style, total_steps=8,
                               speed=1.0, lang="en")
sf.write("one_sentence.wav", np.asarray(wav).squeeze(0), 44100)
```

Caveats verified the hard way:
- Kokoro (like the revoked Kitten before it) fails without espeak-ng
  at OS level. The model zip alone is not enough; install espeak-ng
  on the render machine first.
- Chatterbox Turbo's float64/float32 mismatch (section 1B.2) is
  specific to this torch/librosa combo; apply the casts only if the
  same error appears.
- The model card's `KittenTTS("KittenML/kitten-tts-nano-0.1")` form
  does NOT work with kittentts 0.1.3 (its first argument is a local
  file path). This matters only for the REVOKED Kitten pack, not for
  the current pick.

## 8. Licence doubts and open points (do not skip)

1. KITTEN REVOCATION (section 1A) is the biggest change in this
   revision. The Kitten pack stays on Drive only because the Drive
   tool has no delete command. Treat `_voice/kitten/` as revoked and
   unusable, whatever its files say; any local copy of the old
   Kitten-only `reference_voices.zip` is likewise superseded.
2. KittenTTS 2 confusion (section 1A) remains the biggest licence
   trap in this task. Everything with a revenue cap, registration
   duty, or "Powered by KittenML" attribution belongs to KittenTTS 2,
   NOT to the revoked nano-0.1 pack and NOT to the current pick.
3. Supertonic (PICKED): commercial use under OpenRAIL-M requires an
   express, intelligible AI-generated-audio disclosure (Attachment A
   (e)); never use it to impersonate anyone (Attachment A (g)).
   OpenRAIL-M is NOT MIT; do not quote it as MIT.
4. Chatterbox (PICKED): MIT, but published audio carries the PerTh
   watermark, and Turbo is far too slow on CPU for bulk 8-12 minute
   narration on a small box (section 7 timings). Budget time
   accordingly, or prefer Kokoro/Supertonic for long scripts.
5. Kokoro (PICKED): Apache-2.0, cleanest licence in the trio, but
   output ownership is UNVERIFIED as an explicit clause, and it has
   no emotion control.
6. Free-tier commercial-use/YouTube clauses: none found on the pricing
   pages themselves for Chirp 3: HD, Polly Generative, or Gemini TTS.
7. All research snippets were adapted from official quickstarts and
   were NOT locally tested except the offline paths in section 7,
   which WERE locally tested from the delivered zips for all three
   picked models. Any future model adoption must verify its own
   offline load first.
8. No weights are in git. Weights live only on Drive (section 6).
   This file's revision commit contains only jobs/VOICE_MODELS.md.
