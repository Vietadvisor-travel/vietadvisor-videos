#!/usr/bin/env python3
"""Motion and repetition gate for an episode (v6.6). Stills hide a static film; this measures the video itself.
  python3 tools/pp_motion.py <slug> [--draft]        reads out/<slug>-aN_16x9.mp4 (or _lite with --draft) + out/<slug>-aN_cues.json
  python3 tools/pp_motion.py file <video.mp4>        one file, no beats
Per second: mean absolute frame difference (96×54 grey, 10 fps). A second under STILL is "nearly still" to the eye.
Report per beat (still seconds, longest still run), per act and for the film, plus effect repetition from the stories.
GATE (motion-doctrine.md §8): still seconds ≤ 15 % of the film · no still run > 2.0 s except beats whose card says HOLD
(≤ 2 per act) · no effect on more than 10 % of the beats · at least 2 effects per act that appear in no other act.
Writes out/<slug>_motion.md and prints the verdict.
"""
import glob, json, os, re, subprocess, sys, collections
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
STILL, FPS, W, H = 0.6, 10, 96, 54


def motion(path):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', path, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    d = np.abs(np.diff(a, axis=0)).mean(axis=(1, 2))
    return np.concatenate([[d[0] if len(d) else 0], d])   # one value per 0.1 s


def runs(still):
    out, s = [], None
    for i, v in enumerate(list(still) + [False]):
        if v and s is None: s = i
        if not v and s is not None: out.append((s, i - s)); s = None
    return out


if len(sys.argv) > 2 and sys.argv[1] == 'file':
    m = motion(sys.argv[2]); st = m < STILL; r = [x for x in runs(st) if x[1] >= 20]
    print(f'{len(m) / FPS:.0f} s · nearly still {st.mean() * 100:.0f} % · still runs ≥ 2 s: {len(r)} · longest {max([x[1] for x in r], default=0) / FPS:.1f} s'); sys.exit()
slug = sys.argv[1]; draft = '--draft' in sys.argv
acts = sorted(int(re.search(r'-a(\d+)\.story$', f).group(1)) for f in glob.glob(f'stories/{slug}-a*.story') if re.search(r'-a\d+\.story$', f))
rep, fx_all, fx_act, beats_total, still_total, secs_total, long_runs, holds_over = [], collections.Counter(), {}, 0, 0, 0, [], []
for n in acts:
    story = open(f'stories/{slug}-a{n}.story', encoding='utf-8').read()
    cards = re.findall(r'^// CARD (\S+)[^\n]*', story, re.M); hold = {c for c, l in zip(cards, re.findall(r'^// CARD [^\n]*', story, re.M)) if re.search(r'\bHOLD\b', l)}
    fx = re.findall(r'fx="code:@?([a-z_0-9]+)', story); fx_all.update(fx); fx_act[n] = set(fx)
    vid = f'out/{slug}-a{n}_16x9{"_lite" if draft else ""}.mp4'
    if not os.path.exists(vid): vid = f'out/{slug}-a{n}_16x9_FINAL.mp4'
    cues = f'out/{slug}-a{n}_cues.json'
    if not (os.path.exists(vid) and os.path.exists(cues)): rep.append(f'a{n}: no video or cues yet'); continue
    m = motion(vid); st = m < STILL; scenes = json.load(open(cues))['scenes']
    rep.append(f'\n## a{n} · {len(m) / FPS:.0f} s · nearly still {st.mean() * 100:.0f} %\n| beat | s | still % | longest still | effect |\n|---|---|---|---|---|')
    still_total += st.sum() / FPS; secs_total += len(m) / FPS; nh = 0
    for i, s in enumerate(scenes):
        a, b = int(s['start'] * FPS), int((s['start'] + s['dur']) * FPS); seg = st[a:b]; beats_total += 1
        lr = max([x[1] for x in runs(seg)], default=0) / FPS; cid = cards[i] if i < len(cards) else f'a{n}-b{i + 1}'
        flag = ''
        if lr > 2.0:
            if cid in hold and nh < 2: nh += 1; flag = ' (HOLD)'
            else: long_runs.append((cid, lr)); flag = ' ⚠'
        rep.append(f'| {cid} | {s["dur"]:.1f} | {seg.mean() * 100 if len(seg) else 0:.0f} | {lr:.1f}{flag} | {fx[i] if i < len(fx) else ""} |')
still_pct = still_total / max(secs_total, 1) * 100
top = fx_all.most_common(); over = [(f, c) for f, c in top if c > 0.10 * max(beats_total, 1)]
own = {n: [f for f in fx_act[n] if all(f not in fx_act[m] for m in fx_act if m != n)] for n in fx_act}; few = [n for n in own if len(own[n]) < 2]
ok = still_pct <= 15 and not long_runs and not over and not few
head = [f'# Motion & repetition gate · {slug}', '',
        f'- nearly still: **{still_pct:.0f} %** of {secs_total:.0f} s (gate ≤ 15 %)',
        f'- still runs > 2 s outside HOLD beats: **{len(long_runs)}** (gate 0)' + (': ' + ', '.join(f'{c} {l:.1f}s' for c, l in sorted(long_runs, key=lambda x: -x[1])[:12]) if long_runs else ''),
        f'- effects: {len(fx_all)} distinct over {beats_total} beats; over 10 %: ' + (', '.join(f'@{f} ×{c}' for f, c in over) or 'none') + ' (gate none)',
        '- effects only this act has: ' + ' · '.join(f'a{n}: {len(own[n])}' for n in sorted(own)) + (f' (gate ≥ 2; short: {", ".join("a" + str(n) for n in few)})' if few else ' (gate ≥ 2)'),
        f'- usage: ' + ', '.join(f'@{f} {c}' for f, c in top), '', f'**VERDICT: {"PASS" if ok else "FAIL"}**']
open(f'out/{slug}_motion.md', 'w').write('\n'.join(head + rep) + '\n')
print('\n'.join(head)); print(f'(per-beat table: out/{slug}_motion.md)')
sys.exit(0 if ok else 1)
