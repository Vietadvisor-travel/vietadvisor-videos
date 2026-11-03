#!/usr/bin/env python3
"""Turn a cues JSON (from `render.mjs --cues`) into an SRT subtitle / voice-over script.
usage: python3 tools/srt.py out/episode_cues.json > out/episode.srt"""
import json, sys
def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60); ms = int(round((s - int(s)) * 1000))
    return f"{int(h):02}:{int(m):02}:{int(s):02},{ms:03}"
d = json.load(open(sys.argv[1]))
for i, s in enumerate(d["subs"], 1):
    print(i); print(f"{ts(s['t0'])} --> {ts(s['t1'])}"); print((s["who"] + ": " if s.get("who") else "") + s["text"]); print()
