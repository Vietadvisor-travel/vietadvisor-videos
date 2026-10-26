# Muse task: the best FREE narrator voice for Poison Pill (A to Z)

**Goal:** find, test and deliver the most natural free text-to-speech voice for an 8–12 minute English YouTube business
documentary, with real emotion (grave, sad, tense, wry, excited), usable commercially. Claude's render machine cannot
reach HuggingFace, Azure, ElevenLabs or Edge, but it can reach **Google Drive, PyPI, npm, GitHub and Google APIs**. So
you fetch everything, test it, and put it on Drive. Claude installs Python packages from PyPI itself; you only bring
the model files. Take your time, use parallel agents, depth matters.

## A. Research (write `jobs/VOICE_MODELS.md`)
1. Survey today's open TTS models and free tiers. Start with these and add any newer/better ones you find:
   - **Chatterbox** (Resemble AI): the base, Turbo and Multilingual variants. It has an emotion "exaggeration" control and clones a voice from about 5 s of audio.
   - Supertonic (1/2/3), Kokoro-82M (all English voices), Kitten TTS, IndexTTS-2, Zonos, Higgs Audio, VibeVoice, Sesame CSM, F5-TTS, StyleTTS2, MeloTTS, Parler-TTS, Orpheus, Dia.
   - Any 2026 model that ranks high in blind tests (TTS Arena, Artificial Analysis).
2. For each model, record:
   - the **license**, with a link and the exact words about commercial use and about the generated audio;
   - the parameter count and file size;
   - whether it runs on **CPU only**: speed on a 4-core CPU if you can measure it, else a published figure with its source;
   - emotion/style control (tags, prompts, exaggeration), voice cloning, English accents;
   - the PyPI package and version that loads it, plus the exact Python snippet to synthesize one sentence to WAV from LOCAL files (no network).
3. **Reject:**
   - anything non-commercial (CC-BY-NC, Coqui CPML / XTTS, Fish Audio research license…);
   - anything that needs a paid key;
   - anything that cannot run without a large GPU (> 8 GB VRAM). Say why you rejected each one.
4. **Free cloud tiers**, for comparison only (Claude already supports Google):
   - Google Cloud Chirp 3 HD: 1M chars/month free;
   - Amazon Polly Generative: 100k chars/month for 12 months;
   - Gemini TTS: the current free quota.
   Confirm these on the official pricing pages and write the date you checked.

## B. Listen test (the deciding step)
1. Use these 4 test lines for EVERY candidate:
   - `Picture an arena in London. Packed. Dark. Waiting.` (tense, slow)
   - `She promised them that in two years, nobody would speak about Bitcoin anymore.` (wry)
   - `Her mother lost everything she had saved for thirty years.` (sad)
   - `The plan worked. Almost to the word.` (grave, a held pause before "Almost")
2. **Voices:**
   - use a deep, warm male documentary narrator, plus one female alternative;
   - for models that clone, use ONLY a synthetic reference voice (for example a Kokoro `am_michael` or `bm_george` clip you generate), or a recording whose licence explicitly allows voice cloning and commercial use;
   - **never clone a real, identifiable person's voice.**
3. Render every candidate × voice × line to WAV at 24–48 kHz.
4. Score each one /10 on naturalness, emotion and pronunciation (numbers, names like "Ruja Ignatova", "OneCoin").
5. Keep the top 4 and say which you recommend, and why.

## C. Deliver to Google Drive (folder `_voice/` in the PoisonPill_Media folder, same tool as the stock library)
```bash
cd studio
# 1) the listen-test samples
mkdir -p ../voice_pack/samples && cp <your wavs> ../voice_pack/samples/   # name: <model>__<voice>__<line1-4>.wav
zip -r ../voice_pack/voice_samples.zip ../voice_pack/samples
python3 tools/pp_drive.py put ../voice_pack/voice_samples.zip --to _voice
# 2) each recommended model (top 2-3), with every file needed to run OFFLINE, plus its LICENSE file
#    zip per model, split into parts of ≤ 1.9 GB if needed: <model>_weights_1.zip, _2.zip …
python3 tools/pp_drive.py put ../voice_pack/<model>_weights_*.zip --to _voice/<model>
# 3) the reference voice clips you used for cloning (synthetic or licensed), with their source
python3 tools/pp_drive.py put ../voice_pack/reference_voices.zip --to _voice
```
- Inside every model zip, add a `HOWTO.md`:
  - the folder layout;
  - `pip install <package>==<version>`;
  - the offline load code, using environment variables like `HF_HUB_OFFLINE=1` and a local path;
  - the sampling settings you used (temperature, exaggeration, cfg weight…).
- Check: `python3 tools/pp_drive.py ls _voice` lists everything with sizes.

## D. Report
- Commit and push `jobs/VOICE_MODELS.md`. It should contain:
  - the table of all candidates with license, CPU speed and score;
  - the rejected models and why;
  - the top 4;
  - the Drive paths;
  - the HOWTO for each delivered model.
- Reply to the owner with:
  - your #1 pick and the runner-up;
  - the Drive path of `voice_samples.zip`, so he can listen;
  - any licence doubts.

**Never:**
- clone a real person's voice;
- deliver a model whose licence forbids commercial use;
- put model weights in git (Drive only);
- guess a licence: quote it.
