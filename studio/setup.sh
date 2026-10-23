#!/usr/bin/env bash
# Poison Pill studio — one-time setup in a fresh Claude Code cloud session (or any Linux box with Node 20+, Python 3.10+, ffmpeg).
#   bash studio/setup.sh            → deps, voice model, image bundle, pp_doctor (ALL PASS = ready)
# Safe to re-run: every step skips what is already there.
set -e
cd "$(dirname "$0")"
[ -d node_modules/playwright ] || npm install --no-audit --no-fund --silent
python3 -c "import numpy, scipy, PIL, kokoro_onnx, soundfile" 2>/dev/null || pip install -q numpy scipy pillow kokoro-onnx soundfile --break-system-packages 2>/dev/null || pip install -q numpy scipy pillow kokoro-onnx soundfile
python3 -c "import rembg" 2>/dev/null || pip install -q "rembg[cpu]" --break-system-packages 2>/dev/null || echo "note: rembg not installed (only needed to cut out NEW photos; packs from Muse are already cut out)"
python3 tools/voice.py setup
python3 tools/pp_img.py sync >/dev/null
ls ../jobs/_music/music_library*.zip >/dev/null 2>&1 && [ ! -f music/library.json ] && python3 tools/pp_pack.py music-import ../jobs/_music/music_library*.zip || true
ls ../jobs/_stock/stock_library_*.zip >/dev/null 2>&1 && python3 tools/pp_stock.py index || true   # v6.2 shared stock library: catalogue only, clips are pulled per episode
node tools/pp_doctor.mjs
