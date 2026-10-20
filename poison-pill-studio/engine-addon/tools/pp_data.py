#!/usr/bin/env python3
"""Real data → ready-to-paste Poison Pill events (charts drawn from the true shape of the numbers).
  python3 tools/pp_data.py chart data.csv --col close [--down auto] [--n 12] [--lab "-90%"]   → chart:down;pts:…;lab:…
  python3 tools/pp_data.py bars  data.csv --label name --value revenue [--unit "$B"] [--top 5] → bars:A=$3B~B=$2B…
  python3 tools/pp_data.py circles data.csv --label name --value value [--unit "$B"]         → circles:A=…~B=…
  python3 tools/pp_data.py tally "Raised=1.75e9" "Sold=1e8" [--unit $]                         → tally:Raised=$1.75B~Sold=$100M;total:…
CSV: any comma-separated file with a header row (e.g. a stock history export, a revenue table from a filing).
Numbers are formatted the channel way ($1.75B, $400M, 3,000). The chart keeps the REAL shape (resampled to n points, scaled 0–100)."""
import sys, csv
def fmt(v, unit='$'):
    a = abs(v); s = '-' if v < 0 else ''
    if unit != '$': return f'{s}{a:,.0f}{unit}' if a >= 100 else f'{s}{a:g}{unit}'
    for d, suf in ((1e12, 'T'), (1e9, 'B'), (1e6, 'M'), (1e3, 'K')):
        if a >= d: x = a / d; return f'{s}${x:.2f}'.rstrip('0').rstrip('.') + suf
    return f'{s}${a:,.0f}'
def rows(path): return list(csv.DictReader(open(path, encoding='utf-8-sig')))
def num(x):
    try: return float(str(x).replace(',', '').replace('$', '').strip())
    except ValueError: return None
if __name__ == '__main__':
    a = sys.argv[1:]; opt = lambda k, d='': a[a.index('--' + k) + 1] if '--' + k in a else d
    if not a: print(__doc__); sys.exit()
    if a[0] == 'chart':
        vals = [v for v in (num(r[opt('col', 'close')]) for r in rows(a[1])) if v is not None]; n = int(opt('n', 12))
        pts = [vals[round(i * (len(vals) - 1) / (n - 1))] for i in range(n)]; lo, hi = min(pts), max(pts); sc = [round(4 + 92 * (p - lo) / ((hi - lo) or 1)) for p in pts]
        down = pts[-1] < pts[0] if opt('down', 'auto') == 'auto' else opt('down') == 'yes'; ch = (pts[-1] - pts[0]) / (pts[0] or 1) * 100
        print(f"chart:{'down' if down else 'up'};pts:{','.join(map(str, sc))};lab:{opt('lab', f'{ch:+.0f}%')}")
    elif a[0] in ('bars', 'circles'):
        R = [(r[opt('label', 'name')], num(r[opt('value', 'value')])) for r in rows(a[1])]; R = [x for x in R if x[1] is not None]; R.sort(key=lambda x: -x[1]); R = R[:int(opt('top', 6))]
        unit = opt('unit', '$'); mult = {'$B': 1e9, '$M': 1e6}.get(unit, 1); print(f"{a[0]}:" + '~'.join(f'{k}={fmt(v * mult) if unit.startswith("$") else fmt(v, unit)}' for k, v in R))
    elif a[0] == 'tally':
        items = [x.split('=') for x in a[1:] if '=' in x and not x.startswith('--')]; vals = [(k, float(v)) for k, v in items]
        tot = vals[-1][1] / vals[0][1] * 100 - 100 if len(vals) > 1 and vals[0][1] else 0
        print('tally:' + '~'.join(f'{k}={fmt(v)}' for k, v in vals) + f';total:{tot:+.0f}%')
    else: print(__doc__)
