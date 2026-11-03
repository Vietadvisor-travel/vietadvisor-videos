# "Nutshell" style — big-picture explainers in the spirit of Kurzgesagt

Kurzgesagt – In a Nutshell (youtube.com/@kurzgesagt) turns big questions into calm, beautiful, rigorously sourced
animation. We borrow the *method and the visual grammar*, never their characters, birds, layouts or music.

## How they work (from kurzgesagt.org "what we do", toolfarm, animationexplainers — checked Oct 2026)
1. **Research** — books and papers, expert checks, a public source sheet for every video.
2. **Script** — around a dozen drafts; a fresh angle, useful insight, never lecturing; rational tone + optimism.
3. **Illustration** — visual metaphors sketched per scene, then vector art (Illustrator), pixel art and infographics.
4. **Voice, then animation** — one narrator for every video; the voice track sets the timing; 2D flat animation in
   After Effects with some 3D elements.
5. **Music & SFX** — a score composed for each video (Epic Mountain), tailored to its mood.
Videos run ~4–16 min on the main channel.

## Visual grammar we use
- Flat shapes, **no outlines**, soft rounded geometry; light comes from rim highlights and glows, not line work.
- **Deep, saturated grounds** (navy, indigo, violet, teal) with one bright complementary hero colour per scene.
- **Glow everywhere**: radial gradients behind subjects, bloom on highlights (`grade=nutshell`).
- **Constant gentle motion**: twinkling stars, drifting motes, slow parallax; nothing is ever fully still.
- **Scale as story**: zoom from a person to a city to a planet (mapdive / orbit), comparisons that make numbers tangible.
- Diagrams that build piece by piece, numbers that count up (`stat`), the same metaphor carried through the video.

## Script grammar
- Open with a big, simple question; answer it in layers ("At first… but then… which means…").
- Address the viewer ("you"), translate numbers into felt comparisons ("fifty kilometres — a morning on a bike").
- Calm narrator, dry wit, no shouting; end on perspective and a hopeful note.
- Sources on screen (small, corner) or in the description; every claim checkable.

## In the studio
```
charstyle: nutshell
look: grade=nutshell captions=karaoke
# talk place=nutshell_lab host=linh pose=present …
# moment kind=mapdive to=hanoi place=orbit …
# talk place=cosmos …
```
Places: `cosmos` (space, planets), `nutshell_lab` (gradient stage for diagrams/characters), `orbit` (Earth's night side).
Use it for: why Vietnam has three climates, how monsoons work, how a karst bay forms, how big Sơn Đoòng really is.
Don't mix it with the chibi gag style in the same video.
