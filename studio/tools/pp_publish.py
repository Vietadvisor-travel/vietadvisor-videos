#!/usr/bin/env python3
"""YouTube publishing kit for one episode (references/publish.md).
  python3 tools/pp_publish.py <slug> [--acts 7] [--chapters "0:Title A|2:Title B|…"] → out/<slug>_FULL.srt + out/<slug>_publish_facts.json

1. Joins the per-act subtitle files (out/<slug>-aN.srt, written by make.mjs) into ONE file for the whole film, using each
   act's real video length as the offset, and re-cuts the cues the way YouTube reads best: ≤ 42 characters a line,
   ≤ 2 lines, ≤ 6.5 s a cue, split at punctuation, never mid-word; zero-width characters and [BEAT] marks removed.
2. Collects the facts the upload guide needs: act start times (chapters), total length, music credits (pp_music.py),
   image / footage credits (out/<slug>-aN_credits.txt + images.json), AI images used, quote voices used.
Claude then writes jobs/<slug>/UPLOAD_GUIDE_<slug>.txt from references/publish.md, using these facts.
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ts(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"


def parse_srt(p):
    out = []
    for blk in re.split(r"\n\s*\n", open(p, encoding="utf-8").read().strip()):
        ln = blk.strip().split("\n")
        if len(ln) < 3:
            continue
        m = re.match(r"(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)", ln[1])
        if not m:
            continue
        g = list(map(int, m.groups()))
        a = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000; b = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        out.append([a, b, " ".join(ln[2:])])
    return out


def clean(s):
    s = re.sub(r"[​‌‍﻿]", "", s)
    s = re.sub(r"\[(BEAT|DROP|SWELL|SFX[^\]]*|TEXT[^\]]*)\]|\(J\)|\{[a-z]+\}|\*\*", "", s)
    return re.sub(r"\s+", " ", s).strip()


def wrap2(s, n=42):
    """Two balanced lines of ≤ n characters, or None when the text needs more than two lines."""
    if len(s) <= n:
        return [s]
    w = s.split(" "); best = None
    for i in range(1, len(w)):
        a, b = " ".join(w[:i]), " ".join(w[i:])
        if len(a) <= n and len(b) <= n:
            sc = abs(len(a) - len(b)) - (8 if re.search(r"[,;:]$", a) else 0)
            if best is None or sc < best[0]:
                best = (sc, [a, b])
    return best[1] if best else None


def split_cue(a, b, s, n=42, maxdur=6.5):
    """Split a long cue at sentence / clause punctuation, timing each part by its share of characters."""
    if wrap2(s, n) and b - a <= maxdur:
        return [[a, b, s]]
    parts = [p for p in re.split(r"(?<=[.!?…])\s+|(?<=[,;:—])\s+", s) if p]
    chunks, cur = [], ""
    for p in parts:
        cand = (cur + " " + p).strip()
        if cur and not wrap2(cand, n):
            chunks.append(cur); cur = p
        else:
            cur = cand
    if cur:
        chunks.append(cur)
    fixed = []
    for c in chunks:                      # still too long (no punctuation): split on words
        while not wrap2(c, n):
            w = c.split(" "); k = len(w) // 2
            fixed.append(" ".join(w[:k])); c = " ".join(w[k:])
        fixed.append(c)
    tot = sum(len(c) for c in fixed) or 1; t = a; out = []
    for c in fixed:
        d = (b - a) * len(c) / tot; out.append([t, t + d, c]); t += d
    return out


def dur_of(p):
    try:
        return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())
    except Exception:
        return None


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    slug = sys.argv[1]; os.chdir(ROOT)
    acts = int(sys.argv[sys.argv.index("--acts") + 1]) if "--acts" in sys.argv else 99
    cues, starts, off, act = [], [], 0.0, 0
    while act < acts and os.path.exists(f"out/{slug}-a{act}.srt"):
        cj = f"out/{slug}-a{act}_cues.json"
        d = dur_of(f"out/{slug}-a{act}_16x9.mp4") or (json.load(open(cj))["duration"] if os.path.exists(cj) else None)
        if d is None:
            sys.exit(f"no video or cues for act {act}: render it first")
        starts.append(round(off, 2))
        for a, b, s in parse_srt(f"out/{slug}-a{act}.srt"):
            s = clean(s)
            if s:
                cues += split_cue(a + off, min(b, d) + off, s)
        off += d; act += 1
    if not starts:
        sys.exit(f"no out/{slug}-a0.srt — run make.mjs on the acts first")
    for i in range(len(cues) - 1):        # no overlaps, at least 2 frames between cues
        cues[i][1] = min(cues[i][1], cues[i + 1][0] - .067)
    with open(f"out/{slug}_FULL.srt", "w", encoding="utf-8") as f:
        for i, (a, b, s) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n" + "\n".join(wrap2(s) or [s]) + "\n\n")
    music = "".join(subprocess.run([sys.executable, "tools/pp_music.py", "credits", f"stories/{slug}-a{k}.story"], capture_output=True, text=True).stdout for k in range(act))
    music = sorted(set(l.strip() for l in music.splitlines() if l.strip()))
    reg = json.load(open("engine/library/images.json")); used = set()
    for k in range(act):
        txt = open(f"stories/{slug}-a{k}.story", encoding="utf-8").read()
        used |= set(re.findall(r"\b(" + re.escape(slug) + r"_[a-z0-9_]+?)(?:__\d+)?\b", txt))
    credits, ai, clips = [], [], []
    for i in sorted(used):
        m = reg.get(i) or reg.get(i + "__000")
        if not m:
            continue
        cr = (m.get("credit") or "").strip(); lic = (m.get("license") or "").strip()
        if "AI-generated" in cr or "generate" in cr.lower():
            ai.append(i)
        elif m.get("role") == "clip" or i + "__000" in reg:
            clips.append((i, cr, lic))
        else:
            credits.append((i, cr, lic))
    voices = set()
    for k in range(act):
        voices |= set(re.findall(r"^\s*@([\w-]+)\s*:", open(f"stories/{slug}-a{k}.story", encoding="utf-8").read(), re.M))
    facts = {"slug": slug, "duration": round(off, 2), "act_starts": starts,
             "chapters_mmss": [f"{int(s // 60)}:{int(s % 60):02d}" for s in starts],
             "srt": f"out/{slug}_FULL.srt", "cues": len(cues), "music": music,
             "footage": [{"id": i, "credit": c, "license": l} for i, c, l in clips],
             "images": [{"id": i, "credit": c, "license": l} for i, c, l in credits],
             "ai_images": ai, "quote_voices": sorted(voices),
             "missing_authors": [i for i, c, l in clips + credits if "BY" in l.upper() and ("/" not in c and " by " not in c.lower())]}
    json.dump(facts, open(f"out/{slug}_publish_facts.json", "w"), indent=1, ensure_ascii=False)
    print(f"out/{slug}_FULL.srt: {len(cues)} cues, {off / 60:.1f} min · chapters at {', '.join(facts['chapters_mmss'])}")
    print(f"out/{slug}_publish_facts.json: {len(music)} music credits, {len(clips)} clips, {len(credits)} images, {len(ai)} AI images, voices {sorted(voices) or '-'}")
    if facts["missing_authors"]:
        print("WARNING: CC BY items without an author name (ask Muse):", ", ".join(facts["missing_authors"]))


if __name__ == "__main__":
    main()
