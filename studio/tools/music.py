#!/usr/bin/env python3
"""Procedural background music, scored to the edit — royalty-free by construction (all synthesised here).
  python3 tools/music.py score out/x_cues.json out/x_music.wav [--mood adventure] [--seed title]
  python3 tools/music.py mix --vo out/x_vo.wav --music out/x_music.wav --sfx out/x_sfx.wav out/x_mix.wav
  python3 tools/music.py demo out/demos/            # one 20 s demo per mood
Moods: adventure cafe upbeat comedy epic emotional night chill quiz.
The arrangement follows the scenes: energy per beat type (hook/title/gag = full band, talk/dialogue = sparse),
drum fills before energy rises, a short music drop on big impacts, a resolved ending on the end frame.
A user track (mp3/wav, e.g. YouTube Audio Library) can replace it: `music: path/to/track.mp3` in the story header."""
import json, sys, os, hashlib
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
SR = 44100

def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR * .45), btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], btype='band', fs=SR, output='sos'), x)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(max(1, int(SR * d))) / SR

class Rng:
    def __init__(s, seed): s.r = np.random.default_rng(seed)
    def f(s, a=0., b=1.): return float(s.r.uniform(a, b))
    def i(s, n): return int(s.r.integers(0, n))
    def ch(s, xs): return xs[s.i(len(xs))]
    def noise(s, n): return s.r.uniform(-1, 1, n)

# ---------------------------------------------------------------- instruments (mono, return np arrays)
def pluck_fast(f, d, R, bright=.5, slide=0.):
    # vectorised approximation of Karplus-Strong: decaying harmonic stack with noisy attack (much faster for long scores)
    t = tt(d); x = np.zeros_like(t); ph = 0
    fr = f * (1 + slide * np.exp(-t * 16)) if slide else f
    for h in range(1, 9):
        amp = (1 / h ** (1.6 - bright)) * np.exp(-t * (1.6 + h * (1.1 - bright * .6)))
        x += amp * np.sin(2 * np.pi * np.cumsum(np.full_like(t, 1.0) * fr * h) / SR + R.f(0, 6.28))
    att = R.noise(len(t)) * np.exp(-t * 90) * .25; x += lp(att, 3000 + 4000 * bright, 1)
    return x * .5
def epiano(f, d, vel=1., R=None):
    t = tt(d); I = 2.2 * np.exp(-t * 3)
    x = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t)) * np.exp(-t * 1.6) + .3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 4)
    a = np.minimum(1, t / .004); return x * a * vel * .5
def marimba(f, d, vel=1.):
    t = tt(min(d, 1.2)); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 18) + .15 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t * 40)
    return x * vel * .6
def pizz(f, d, vel=1., R=None): return pluck_fast(f, min(d, .5), R, .75) * np.exp(-tt(min(d, .5)) * 7) * vel
def saw(f, t, R): ph = (f * t + R.f()) % 1.0; return 2 * ph - 1
def pad(fs, d, R, cutoff=1800, att=.4):
    t = tt(d); x = np.zeros_like(t)
    for f in fs:
        for det in (-.11, 0, .09): x += saw(f * 2 ** (det / 12), t, R)
    x = lp(x / (len(fs) * 3), cutoff, 2); e = np.minimum(1, t / att) * np.minimum(1, (d - t) / .35 + .001); return x * np.clip(e, 0, 1) * .55
def bass(f, d, vel=1., kind='round'):
    t = tt(d); x = np.sin(2 * np.pi * f * t) + (.35 * np.sin(2 * np.pi * f * 2 * t) if kind == 'round' else .0)
    if kind == 'saw': x = lp(np.sign(np.sin(2 * np.pi * f * t)) * .5 + np.sin(2 * np.pi * f * t), 600)
    e = np.minimum(1, t / .006) * np.exp(-t * 2.5) * np.minimum(1, (d - t) / .03 + .001); return x * np.clip(e, 0, 1) * vel * .7
def lead(f, d, R, vel=1., kind='pluck'):
    if kind == 'saw':
        t = tt(d); x = lp(sum(saw(f * 2 ** (dt / 12), t, R) for dt in (-.06, .06)) / 2, 2600); vib = 1
        return x * np.minimum(1, t / .03) * np.clip((d - t) / .08, 0, 1) * vel * .35
    if kind == 'marimba': return marimba(f, d, vel)
    if kind == 'sao':      # bamboo flute: breathy sine, scoop into pitch, delayed vibrato
        t = tt(d + .25); scoop = 1 - .03 * np.exp(-t * 18); vib = 1 + .006 * np.sin(2 * np.pi * 5.4 * t) * np.clip((t - .18) / .3, 0, 1)
        ph = np.cumsum(f * scoop * vib) / SR; x = np.sin(2 * np.pi * ph) + .18 * np.sin(4 * np.pi * ph) + .05 * np.sin(6 * np.pi * ph)
        br = bp(R.noise(len(t)), max(200, f * 1.5), min(15000, f * 5)) * .12
        e = np.minimum(1, t / .06) * np.clip((d + .25 - t) / .2, 0, 1); return (x + br) * e * vel * .32
    if kind == 'danbau':   # monochord: pure tone, wide expressive bends, tremolo
        t = tt(d + .3); bend = 2 ** ((R.ch([0, 0, 1, -1, 2]) * np.exp(-t * 4) * -1 + .3 * np.sin(2 * np.pi * 1.2 * t) * np.clip(t - .3, 0, 1)) / 12)
        ph = np.cumsum(f * bend) / SR; x = np.sin(2 * np.pi * ph) + .1 * np.sin(4 * np.pi * ph); trem = 1 + .12 * np.sin(2 * np.pi * 6 * t) * np.clip(t - .25, 0, 1)
        return x * trem * np.minimum(1, t / .02) * np.exp(-t * .9) * vel * .34
    if kind == 'tranh':    # 16-string zither: pluck with a quick grace-note glissando
        x = pluck_fast(f, d + .4, R, .8) * vel
        if R.f() < .3: g = pluck_fast(f * 2 ** (-2 / 12), .25, R, .8) * .5; x[:len(g)] = x[:len(g)] * .6 + g[:len(x)]
        return x
    return pluck_fast(f, d + .3, R, .7, slide=R.ch([0, 0, 0, .06, -.04])) * vel
# drums
def kick(R, vel=1.):
    t = tt(.4); f = 48 + 90 * np.exp(-t * 35); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7); x += R.noise(len(t)) * np.exp(-t * 200) * .15; return np.tanh(x * 1.6) * vel * .9
def snare(R, vel=1.):
    t = tt(.3); x = bp(R.noise(len(t)), 900, 7000) * np.exp(-t * 16) * .8 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * .5; return x * vel * .6
def clap(R, vel=1.):
    t = tt(.3); e = sum(np.exp(-np.clip(t - k * .011, 0, None) * 60) * (t >= k * .011) for k in range(3)) + np.exp(-t * 14) * .5; return bp(R.noise(len(t)), 900, 5000) * e * vel * .45
def hat(R, vel=1., open_=False):
    t = tt(.35 if open_ else .06); return hp(R.noise(len(t)), 7000) * np.exp(-t * (9 if open_ else 70)) * vel * .28
def shaker(R, vel=1.): t = tt(.09); return bp(R.noise(len(t)), 4000, 11000) * np.sin(np.pi * np.minimum(1, t / .09)) * vel * .2
def taiko(R, vel=1., f=62):
    t = tt(.9); x = np.sin(2 * np.pi * np.cumsum(f + 30 * np.exp(-t * 20)) / SR) * np.exp(-t * 4.5) + lp(R.noise(len(t)), 900) * np.exp(-t * 18) * .5; return np.tanh(x * 1.4) * vel * .85
def wood(R, vel=1.): t = tt(.08); return (np.sin(2 * np.pi * 1250 * t) + .5 * np.sin(2 * np.pi * 2600 * t)) * np.exp(-t * 60) * vel * .3
def crash(R, vel=1.): t = tt(2.2); return hp(R.noise(len(t)), 5000) * np.exp(-t * 2.2) * vel * .22
def crackle(n, R):
    x = np.zeros(n); k = R.r.integers(0, n, n // 2500); x[k] = R.noise(len(k)); return hp(lp(x, 4000), 800) * .25 + lp(R.noise(n), 500) * .004

# ---------------------------------------------------------------- moods
MAJ, MIN = [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10]
MOODS = {
  'adventure': dict(bpm=112, root=62, scale=MAJ, prog=[0, 4, 5, 3], keys='epiano', arp='pluck', lead='tranh', drums='pop', bass='round', swing=0),
  'cafe':      dict(bpm=84, root=65, scale=MAJ, prog=[0, 5, 1, 4], sev=True, keys='epiano', arp=None, lead='tranh', drums='lofi', bass='round', swing=.18, crackle=True),
  'upbeat':    dict(bpm=122, root=60, scale=MAJ, prog=[5, 3, 0, 4], keys='pad', arp='pluck16', lead='pluck', drums='four', bass='off', swing=0),
  'comedy':    dict(bpm=104, root=60, scale=MAJ, prog=[0, 3, 4, 0], keys='pizz', arp=None, lead='marimba', drums='wood', bass='oompah', swing=.1),
  'epic':      dict(bpm=88, root=57, scale=MIN, prog=[0, 5, 2, 6], keys='pad', arp='pluck', lead='sao', drums='taiko', bass='saw', swing=0),
  'emotional': dict(bpm=72, root=60, scale=MAJ, prog=[0, 4, 5, 3], keys='epiano', arp='piano', lead='sao', drums='soft', bass='round', swing=0),
  'night':     dict(bpm=86, root=57, scale=MIN, prog=[0, 3, 5, 4], sev=True, keys='epiano', arp='pluck', lead='danbau', drums='lofi', bass='round', swing=.16, crackle=True),
  'chill':     dict(bpm=96, root=64, scale=MAJ, prog=[3, 0, 4, 5], keys='pad', arp='pluck', lead='sao', drums='soft', bass='round', swing=.08),
  'quiz':      dict(bpm=120, root=62, scale=MIN, prog=[0, 0, 5, 4], keys='pizz', arp='pluck16', lead='marimba', drums='tick', bass='pulse', swing=0),
}
ALIAS = {'food': 'cafe', 'history': 'epic', 'story': 'emotional', 'guide': 'chill', 'myth': 'comedy', 'countdown': 'upbeat', 'versus': 'upbeat'}
ENERGY = {'hook': 3, 'title': 3, 'countdown': 3, 'gag': 3, 'montage': 3, 'quiz': 2, 'route': 3, 'ride': 3, 'stat': 3, 'compare': 3, 'payoff': 3,
          'intro': 2, 'price': 2, 'reveal': 2, 'steps': 2, 'budget': 2, 'myth': 2, 'list': 2, 'map': 2, 'timeline': 2, 'calendar': 2, 'scale': 2, 'chapter': 2,
          'talk': 1, 'dialogue': 1, 'social': 1, 'raw': 2, 'end': 0}

def chord(m, deg, sev=False):
    sc, r = m['scale'], m['root']; notes = [sc[(deg + k) % 7] + 12 * ((deg + k) // 7) for k in (0, 2, 4) + ((6,) if sev else ())]; return [r + n for n in notes]
def penta(m):
    base = [0, 2, 4, 7, 9] if m['scale'] is MAJ else [0, 3, 5, 7, 10]; return [m['root'] + 12 + b + 12 * o for o in (0, 1) for b in base]

def score(cues, mood='adventure', seed='va'):
    mood = ALIAS.get(mood, mood); m = MOODS.get(mood, MOODS['adventure']); R = Rng(int(hashlib.md5(seed.encode()).hexdigest()[:8], 16))
    D = cues.get('duration') or (cues['scenes'][-1]['start'] + cues['scenes'][-1]['dur']); n = int(SR * (D + 3)); L = np.zeros(n); Rr = np.zeros(n)
    beat = 60 / m['bpm']; bar = beat * 4; nb = int(np.ceil(D / bar)) + 1
    scenes = cues['scenes']
    def energy_at(t):
        e = 2
        for s in scenes:
            if s['start'] <= t + 1e-6: e = ENERGY.get(s.get('beat') or s['id'].split('_', 1)[-1], 2)
        return e
    end_t = next((s['start'] for s in scenes if s['id'] == 'end' or s.get('beat') == 'end'), D)
    def add(x, t, pan=0., g=1.):
        i = int(t * SR); j = min(n, i + len(x));
        if i >= n or j <= i: return
        L[i:j] += x[:j - i] * g * (1 - max(0, pan)); Rr[i:j] += x[:j - i] * g * (1 + min(0, pan))
    sw = lambda k, sub=2: (beat / sub) * m['swing'] if k % 2 else 0
    # motif: 2 bars of 8ths from the pentatonic set, re-used with variations → it sounds composed, not random
    pent = penta(m); motif = []
    for k in range(16):
        if R.f() < (.55 if k % 2 == 0 else .3): motif.append((k, R.i(6) + 2, R.ch([.5, .5, 1, 1.5])))
    for b in range(nb):
        t0 = b * bar
        if t0 >= end_t + bar: break
        e = energy_at(t0 + .01); ending = t0 >= end_t - .01
        deg = m['prog'][b % len(m['prog'])]; ch = chord(m, deg, m.get('sev'))
        e_next = energy_at(t0 + bar + .01)
        if ending:  # final resolved chord + crash
            fin = chord(m, 0, m.get('sev'))
            for f in fin: add(epiano(mtof(f), 3.2, .8), t0, R.f(-.3, .3), .55)
            add(pad([mtof(f) for f in fin], 3.2, R, 1400, .05), t0, 0, .5); add(bass(mtof(m['root'] - 24), 2.5), t0, 0, .8); add(crash(R), t0, 0, .8); add(kick(R), t0, 0, .9); break
        # keys / chords
        if m['keys'] == 'pad' or e >= 2 or mood in ('emotional', 'night', 'cafe'):
            if m['keys'] == 'epiano':
                hits = [0, 1.5, 2.5] if e >= 2 and mood not in ('emotional',) else [0, 2]
                for h in hits:
                    for f in ch: add(epiano(mtof(f), beat * 1.6, .55 if h else .7), t0 + h * beat + sw(int(h * 2)), R.f(-.25, .25), .32)
            elif m['keys'] == 'pizz':
                for k in (1, 3):
                    for f in ch: add(pizz(mtof(f), beat * .5, .7, R), t0 + k * beat, R.f(-.3, .3), .3)
            add(pad([mtof(f - 12) for f in ch], bar + .4, R, 900 + 700 * e, .5 if e < 3 else .25), t0, 0, .22 if m['keys'] == 'pad' else .1)
        # arpeggio / ostinato
        if m['arp'] and e >= 1:
            sub = 4 if m['arp'] == 'pluck16' and e >= 2 else 2; seq = (ch + [ch[1] + 12, ch[2] + 12])
            for k in range(4 * sub):
                if e == 1 and k % 2: continue
                f = mtof(seq[[0, 1, 2, 3, 2, 1, 4, 2][k % 8] % len(seq)] + (12 if m['arp'] == 'piano' else 0))
                x = epiano(f, beat, .5) if m['arp'] == 'piano' else pluck_fast(f, beat * 1.5, R, .55)
                add(x, t0 + k * beat / sub + sw(k, sub), (-.35 if k % 2 else .35), .2 if e < 3 else .24)
        # bass
        if e >= 2 or (e == 1 and mood in ('cafe', 'night', 'chill')):
            r = ch[0] - 24
            pats = {'round': [(0, 1.5), (1.5, .5), (2, 1.5), (3.5, .5)], 'off': [(k + .5, .45) for k in range(4)], 'oompah': [(0, .5), (2, .5)], 'saw': [(k * .5, .45) for k in range(8)], 'pulse': [(k * .5, .3) for k in range(8)]}[m['bass']]
            for st, du in pats: add(bass(mtof(r + (7 if m['bass'] == 'oompah' and st == 2 else 0)), du * beat, .8, 'saw' if m['bass'] == 'saw' else 'round'), t0 + st * beat + sw(int(st * 2)), 0, .55)
        # drums
        dr = m['drums']; fill = e_next > e and e_next >= 2
        for k in range(16):  # 16ths
            tk = t0 + k * beat / 4 + (beat / 4 * m['swing'] * 2 if k % 2 else 0); q = k % 4 == 0; bt = k // 4
            if dr == 'pop' and e >= 2:
                if k in (0, 8) or (e == 3 and k == 10): add(kick(R), tk, 0, .8)
                if k in (4, 12): add(snare(R), tk, .05, .55)
                if k % 2 == 0: add(hat(R, .8 if q else .5), tk, -.2, .7 if e == 3 else .4)
            elif dr == 'four' and e >= 2:
                if q: add(kick(R), tk, 0, .85)
                if k in (4, 12): add(clap(R), tk, 0, .6)
                if k % 4 == 2: add(hat(R, .9, True), tk, .2, .35)
                if e == 3 and k % 2: add(hat(R, .4), tk, -.2, .3)
            elif dr == 'lofi' and e >= 1:
                if k in (0, 7, 10) and e >= 2: add(lp(kick(R), 2500), tk, 0, .7)
                if k in (4, 12): add(lp(snare(R), 4500), tk, .05, .4 if e >= 2 else .22)
                if k % 2 == 0: add(lp(hat(R, .6), 8000), tk, -.15, .35)
            elif dr == 'taiko' and e >= 2:
                if k in (0, 6, 8) or (e == 3 and k in (11, 14)): add(taiko(R, 1, 58 if k in (0, 8) else 72), tk, R.f(-.2, .2), .8 if k in (0, 8) else .5)
                if e == 3 and k % 4 == 2: add(hat(R, .5), tk, .3, .25)
            elif dr == 'wood' and e >= 1:
                if k in (0, 8): add(kick(R, .7), tk, 0, .5)
                if k in (4, 12) or (e == 3 and k in (6, 14)): add(wood(R), tk, R.f(-.4, .4), .7)
                if e >= 2 and k % 2 == 0: add(shaker(R), tk, .3, .6)
            elif dr == 'soft' and e >= 2:
                if k in (0, 10): add(lp(kick(R, .7), 1800), tk, 0, .55)
                if k in (8,): add(lp(snare(R, .6), 3000), tk, 0, .3)
                if k % 2 == 0: add(shaker(R), tk, .25, .7)
            elif dr == 'tick':
                add(hat(R, .7 if q else .35), tk, .25, .5)
                if q and e >= 2: add(kick(R, .8), tk, 0, .6)
            if fill and bt == 3 and dr in ('pop', 'four', 'taiko', 'lofi') and k % 2 == 1:  # fill into a bigger section
                add(snare(R, .5 + .1 * (k - 12)), tk, R.f(-.3, .3), .4) if dr != 'taiko' else add(taiko(R, .6, 80), tk, 0, .5)
        if b > 0 and energy_at(t0 - .01) < e and e == 3: add(crash(R), t0, .3, .7)
        # lead melody on high-energy and lift sections
        if e >= 3 or (e == 2 and b % 4 >= 2):
            var = (b // 2) % 3
            for k, dg, du in motif:
                if (k < 8) != (b % 2 == 0): continue
                kk = k % 8; idx = min(len(pent) - 1, dg + (var == 1) * 1 - (var == 2) * 1)
                f = mtof(pent[idx]); add(lead(f, du * beat, R, .8, m['lead']), t0 + kk * beat / 2 + sw(kk), R.f(-.2, .2), {'saw': .26, 'sao': .3, 'danbau': .3}.get(m['lead'], .2))
    st = np.stack([L, Rr])
    if MOODS.get(mood, {}).get('crackle'): st += crackle(n, R)[None, :] * .6
    # space: stereo convolution reverb (decaying noise IR)
    irn = int(SR * 1.6); te = np.arange(irn) / SR; ir = [lp(R.noise(irn), 6000) * np.exp(-te * 3.4) for _ in range(2)]
    wet = np.stack([fftconvolve(st[c], ir[c])[:n] for c in range(2)]) * .045
    st = st + wet
    # impacts → brief music dip (comedic space) ; fade out after the end frame
    env = np.ones(n)
    for c in cues.get('cues', []):
        if c.get('sfx') in ('impact',) and c.get('gain', 1) > .7:
            i = int(c['t'] * SR); j = min(n, i + int(SR * .5)); env[i:j] = np.minimum(env[i:j], np.linspace(.35, 1, j - i) if j > i else 1)
    fe = int((D + .2) * SR); env[fe:] *= np.linspace(1, 0, n - fe) if n > fe else 1
    st *= env[None, :]
    st /= max(1e-6, np.percentile(np.abs(st), 99.95)) / .8; st = np.tanh(st * 1.05) / np.tanh(1.05); st /= max(1e-6, np.abs(st).max()) / .89
    return st

def write(path, st):
    from scipy.io import wavfile
    wavfile.write(path, SR, (np.clip(st.T, -1, 1) * 32767).astype(np.int16))
def read(path, n=None):
    from scipy.io import wavfile
    if not path or not os.path.exists(path): return None
    sr, x = wavfile.read(path); x = x.astype(np.float32) / 32768
    if x.ndim == 1: x = np.stack([x, x], 1)
    if sr != SR: idx = np.linspace(0, len(x) - 1, int(len(x) * SR / sr)); x = np.stack([np.interp(idx, np.arange(len(x)), x[:, c]) for c in range(2)], 1)
    return x.T

def load_user_track(path, D):
    import subprocess, tempfile
    tmp = tempfile.mktemp(suffix='.wav'); subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-stream_loop', '-1', '-i', path, '-t', str(D + 3), '-ar', str(SR), '-ac', '2', tmp])
    x = read(tmp); os.remove(tmp); n = x.shape[1]; fe = int((D + .3) * SR); x[:, fe:] *= np.linspace(1, 0, max(0, n - fe)); return x

def mix(vo, music, sfx, out, music_db=-17., duck_db=-11., amb=None, amb_db=-21.):
    V, M, S, A = read(vo), read(music), read(sfx), read(amb); n = max(x.shape[1] for x in (V, M, S, A) if x is not None)
    pad = lambda x: np.zeros((2, n)) if x is None else np.pad(x, ((0, 0), (0, n - x.shape[1])))
    V, M, S, A = pad(V), pad(M), pad(S), pad(A)
    if np.abs(V).max() > 0: V = V / np.abs(V).max() * .9
    # ducking envelope from the voice (attack 40 ms, release 350 ms)
    v = np.abs(V).max(0); hop = 441; fr = v[: n // hop * hop].reshape(-1, hop).max(1); act = (fr > .04).astype(float)
    sm = np.zeros_like(act); a, r = 1 - np.exp(-1 / 4), 1 - np.exp(-1 / 35)
    for i in range(1, len(act)): sm[i] = sm[i - 1] + (a if act[i] > sm[i - 1] else r) * (act[i] - sm[i - 1])
    duck = 10 ** ((duck_db * np.repeat(sm, hop)) / 20); duck = np.pad(duck, (0, n - len(duck)), constant_values=1)
    vo_present = np.abs(V).max() > 0
    g = 10 ** (music_db / 20) if vo_present else 10 ** ((music_db + 7) / 20)
    out_ = V + M * g * duck[None, :] + S * .55 + A * 10 ** (amb_db / 20) * np.sqrt(duck)[None, :]
    out_ = np.tanh(out_ * 1.1) / 1.1; out_ /= max(1e-6, np.abs(out_).max()) / .9
    write(out, out_); print('mix:', out)

if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d=None: a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__); sys.exit()
    if a[0] == 'score':
        cues = json.load(open(a[1], encoding='utf-8')); mood = opt('mood') or cues.get('music') or 'adventure'; D = cues.get('duration') or 60
        if os.path.exists(mood) or mood.endswith(('.mp3', '.wav', '.m4a', '.ogg')): write(a[2], load_user_track(mood, D))
        elif mood in ('none', 'off'): write(a[2], np.zeros((2, int(SR * (D + 1)))))
        else: write(a[2], score(cues, mood, opt('seed') or cues.get('title') or a[1]))
        print('music:', a[2], mood)
    elif a[0] == 'mix': mix(opt('vo'), opt('music'), opt('sfx'), a[-1], float(opt('music-db', -17)), float(opt('duck-db', -11)), opt('amb'))
    elif a[0] == 'demo':
        os.makedirs(a[1], exist_ok=True)
        cues = {'duration': 20, 'scenes': [{'id': '1_title', 'start': 0, 'dur': 4}, {'id': '2_talk', 'start': 4, 'dur': 5}, {'id': '3_reveal', 'start': 9, 'dur': 5}, {'id': '4_gag', 'start': 14, 'dur': 4}, {'id': 'end', 'start': 18, 'dur': 2}]}
        for md in MOODS: write(os.path.join(a[1], md + '.wav'), score(cues, md, md)); print(md)
