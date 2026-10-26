# VOICE MODELS: the best FREE narrator voice for Poison Pill

Date: 26 Oct 2026. Task: jobs/MUSE_VOICE_TASK.md (parts A-D).
Research detail: ~/workspace/pp-voice/research.md (working file, not committed).

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
  the owner's decision and were never scored.
- Consequence, stated plainly: **no subjective /10 scores exist for any
  model.** The listen-test agent produced objective measurements only
  (duration, pace, pitch, pause length; see section 4). This file does
  NOT invent scores for models that were never scored, and a ranked
  "top 4" was never produced. The comparison set below is: the owner's
  pick, plus the 3 other models with rendered samples, plus the research
  shortlist that was never listen-tested.

## 1. The pick: KittenTTS nano-0.1 (NOT KittenTTS 2)

- Model: `KittenML/kitten-tts-nano-0.1`, the KittenTTS 0.8 line.
- Voices: `expr-voice-2-m` (male) and `expr-voice-2-f` (female).
  Full built-in list: expr-voice-2/3/4/5, each in -m and -f.
- Parameters: 15M. Weights: `kitten_tts_nano_v0_1.onnx` (23,847,845 bytes)
  + `voices.npz` (10,294 bytes). Output 24 kHz WAV, CPU-only, ONNX.
- Package: `kittentts==0.1.3` (PyPI). System dependency: espeak-ng
  (phonemizer's EspeakBackend raises "espeak not installed" without it).
- Sampling settings used for the approved samples: voice as above,
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

### WARNING: KittenTTS 2 is a different model

KittenTTS 2 (released 22 Oct 2026) is NOT what the owner heard and NOT
what is delivered here. It is a 1.7B model with person-named voices
(Bruno, Bella...), 10 emotion tags, an expressive preset, and a
DIFFERENT licence: Stellon Labs Community License. Its commercial grant
ends above USD 1,000,000 annual revenue or total cumulative funding, it
requires registration with Stellon Labs for commercial use, and it
carries "Powered by KittenML" attribution duties for distributed products
or docs. None of those conditions apply to the nano-0.1 pack delivered
here. Do not swap in KittenTTS 2 weights expecting the approved voice:
the voice will change, and the licence will change.

## 2. Candidate table

CPU figures marked (secondary) come from an independent 4-core Xeon
benchmark or vendor-adjacent reports, NOT from vendor-published 4-core
figures (no vendor publishes one). "Listen status" is the honest state
of Part B for each model.

| Model | Licence (weights) | Params / size | CPU-only? / speed | Emotion control | Listen status |
|---|---|---|---|---|---|
| KittenTTS nano-0.1 (PICK) | Apache-2.0 (HF metadata, 26 Oct 2026) | 15M / ~24 MB | Yes; RTF 0.45-0.59 measured on this box | None | Full samples (10 files), OWNER PICK by ear |
| Kokoro-82M (incumbent baseline) | Apache-2.0 | 82M / 327 MB | Yes; RTF ~0.64 (secondary) | None (voice + speed only) | Full samples (10 files), not scored |
| Chatterbox Turbo | MIT | 350M / ~3.8 GB (secondary) | Yes, slow (~15-25 s per 10 s audio, secondary) | Inline tags (Turbo); exaggeration + cfg_weight (base) | Full samples (10 files), not scored |
| Supertonic 3 (M1/F1) | OpenRAIL-M (code MIT) | 99M / ~400 MB | Yes; RTF ~0.121 at 2 steps (secondary) | 10 inline tags | Samples rendered (10 files), NOT scored, NOT part of owner decision |
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
clip exists for Kitten: its voices are built-in embeddings.

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

## 6. Drive delivery (PoisonPill_Media/_voice/, verified by ls)

- `_voice/voice_samples.zip` (7.5 MB): ALL 40 rendered samples
  (4 models x 2 voices x 5 lines), filenames kept as
  `<model>__<voice>__<line1-5>.wav` under `samples/` inside the zip.
- `_voice/kitten/kitten_weights_1.zip` (19.6 MB): everything needed to
  run the approved voice OFFLINE: `kitten_tts_nano_v0_1.onnx`,
  `voices.npz`, `HOWTO.md`, `LICENSE` (Apache-2.0 text),
  `LICENSE-NOTE.md`. Single part (far under the 1.9 GB split limit).
- `_voice/reference_voices.zip` (0.4 MB): README stating Kitten uses
  built-in voices (no clone clip exists) + the 2 approved voice markers
  (line 1, male and female). No real person's voice anywhere.
- Verified 26 Oct 2026 with `python3 tools/pp_drive.py ls _voice`:
  3 files, 0.03 GB total, matching the sizes above.

## 7. HOWTO for the delivered model (summary; full text inside the zip)

```bash
pip install "kittentts==0.1.3" soundfile numpy onnxruntime phonemizer huggingface_hub
apt-get install -y espeak-ng   # REQUIRED at OS level, see below
```

```python
import os
os.environ["HF_HUB_OFFLINE"] = "1"   # belt and braces; local paths bypass HF entirely

import soundfile as sf
from kittentts import KittenTTS

m = KittenTTS(
    model_path="kitten_tts_nano_v0_1.onnx",
    voices_path="voices.npz",
)
audio = m.generate("The plan worked. Almost to the word.",
                   voice="expr-voice-2-m", speed=1.0)
sf.write("one_sentence.wav", audio, 24000)
```

Caveats verified the hard way:
- The model card's `KittenTTS("KittenML/kitten-tts-nano-0.1")` form does
  NOT work with kittentts 0.1.3 (its first argument is a local file path).
  Use the local-path form above, or no-arg `KittenTTS()` only when the
  files are already in the HF cache.
- The first offline test failed ONLY because espeak-ng was missing from
  the OS ("RuntimeError: espeak not installed on your system"). After
  `apt-get install -y espeak-ng` the identical command passed with
  `HF_HUB_OFFLINE=1` and explicit local paths. The render machine MUST
  have espeak-ng installed at OS level; the model zip alone is not enough.

## 8. Licence doubts and open points (do not skip)

1. Nano-0.1 vs KittenTTS 2 confusion (section 1) is the biggest trap in
   this whole task. Everything with a revenue cap, registration duty, or
   "Powered by KittenML" attribution belongs to KittenTTS 2, NOT to the
   delivered nano-0.1 pack.
2. Nano-0.1 output ownership: UNVERIFIED as an explicit clause.
3. Chatterbox (not delivered): MIT, but published audio carries the PerTh
   watermark, and the base model is far too slow on CPU for 8-12 minute
   narration (30-45+ min per 10 min audio).
4. Supertonic (not delivered): commercial use under OpenRAIL-M requires
   an express, intelligible AI-generated-audio disclosure (Attachment A
   (e)); never use it to impersonate anyone.
5. Free-tier commercial-use/YouTube clauses: none found on the pricing
   pages themselves for Chirp 3: HD, Polly Generative, or Gemini TTS.
6. All research snippets were adapted from official quickstarts and were
   NOT locally tested except the Kitten nano-0.1 offline path in section
   7. Any future model adoption must verify its own offline load first.
7. No weights are in git. Weights live only on Drive (section 6).
