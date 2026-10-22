#!/usr/bin/env python3
"""Generate references/asset-catalog.md from assets/catalog.json"""
import json, sys
c = json.load(open(sys.argv[1])); o = []
o.append("# Asset Catalog\n\nEvery id below can be used in episode files. PNGs live in `assets/` (characters, props, places) and overview sheets in `reference_sheets/`.\n")
o.append("## Characters (`type:'char', id`)\n\n| id | name | group | description |\n|---|---|---|---|")
for ch in c["characters"]: o.append(f"| `{ch['id']}` | {ch['name']} | {ch['group']} | {ch['desc']} |")
o.append("\n## Expressions (`expr`)\n\n" + " · ".join(f"`{e}`" for e in c["expressions"]))
o.append("\n## Poses (`pose`)\n\n" + " · ".join(f"`{p}`" for p in c["poses"]) + "\n\nPlus `ride: 1` on any character (motorbike / scooter / cyclo).")
cats = {}
for p in c["props"]: cats.setdefault(p["cat"], []).append(p)
o.append("\n## Props (`type:'prop', name`)")
for cat, ps in cats.items():
    o.append(f"\n### {cat}\n\n| name | label |\n|---|---|")
    for p in ps: o.append(f"| `{p['name']}` | {p['label']} |")
o.append("\n## Places (`place`) — all support `time: 'day'|'sunset'|'night'`, 16:9 and 9:16\n\n| id | label | description |\n|---|---|---|")
for p in c["places"]: o.append(f"| `{p['id']}` | {p['label']} | {p['desc']} |")
o.append("\n## UI components (`type:'ui', name`)\n\n" + " · ".join(f"`{u}`" for u in c["ui"]))
o.append("\n## Transitions\n\n" + " · ".join(f"`{u}`" for u in c["transitions"]))
o.append("\n## Camera moves\n\n" + " · ".join(f"`{u}`" for u in c["cameraMoves"]))
o.append("\n## Particles\n\n" + " · ".join(f"`{u}`" for u in c["particles"]))
o.append("\n## Map cities (`map.o.cities`)\n\n" + " · ".join(f"`{u}`" for u in c["cities"]) + "\n\nAdd more with `CITY.myid = ['Label', lon, lat]` in the episode file.")
print("\n".join(o))
