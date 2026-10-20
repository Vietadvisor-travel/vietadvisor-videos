# The look: the dossier (v4 default). 16:9 only.

The channel looks like a **case file on an investigator's desk**. The owner asked for it to be matte, warm and readable,
and neither dark and gloomy nor glossy and glaring. The engine applies the look automatically. Don't fight it.

| Element | Dossier look (default) |
|---|---|
| Backdrops | manila folder with tab and crease (`cream`/`navy`), aged newsprint (`news`), green graph paper (`chart`), kraft under a desk lamp (`spot`), dark kraft (`black`), the paper map (`world`) |
| Photo plates (`bg=`) | printed *onto* the folder (multiply), warm toned, lightly blurred, so photos sit in the paper |
| Cut-outs & prints | "aged" archive print: half saturation, warm paper cast, white border, tape or paper clip |
| Type | ink navy `#14213d` with cream stroke; ochre support lines; red `#c0392b` for crisis and stamps only |
| Grades per act | gentle multiply tints: setup amber, rise gold, doubt sea-green, fall brick red with a red-edged vignette, after slate, lesson warm |
| 3D shots | the same materials: wood desk, manila, kraft, paper map, warm key light with soft shadows, ACES tone mapping |
| Never | glowing white centres, neon, glossy gradients, pure black frames (except `kin` on black for the thesis) |

- **`look: noir`** in the story header switches back to the v3 dark navy look, for a deliberately dark episode such as a
  fraud or a death.
- **Format:** this skill makes **16:9 only** (1920×1080 final). No vertical cuts and no Shorts.
- **Captions:** one style, bottom 10 %, white with a dark stroke, numbers in gold, never moved.
- **Missing photos:**
  - A missing photo shows as a neutral "PHOTO NEEDED" card: a dashed frame with the id.
  - The draft stays watchable, but `pp_lint` still errors until every image is imported.
  - Never ship a card.
