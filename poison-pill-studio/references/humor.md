# Tone: playful. Funny, clear, entertaining, never dry (v4.2)

The owner's direction: *"hài một chút, dễ hiểu, giải trí thay vì quá khô khan"*, meaning a little funny, easy to
understand, entertaining rather than too dry. Set it in the story header and in META of the director package:

```
tone: playful        ← default from v4.2 (use `tone: dry` only for a death, a disaster with victims, a tragedy)
```

**Hard rule from the owner: no cartoon characters, no mascots, no bouncing host figures, ever.** The comedy lives in the
**writing** and in the **edit** (timing, cuts, sound, real photos used cleverly), the way the big explainer and geography
channels do it.

## 1. Why it works
A joke is a reward for paying attention. Each small laugh resets the viewer's attention clock, so a light moment every
20–40 s keeps retention high without making the film silly. **Clarity first.** A joke never replaces the explanation; it
lands *after* the point is clear, or it *is* the point said in a surprising way.

## 2. Ten techniques that work in business and geography explainers
| # | Technique | Example line | Picture |
|---|---|---|---|
| 1 | **Deadpan understatement** | "The launch went… less well." | hard cut to the crash chart; `aside:(It went badly.)` |
| 2 | **Absurdly specific comparison** (do the arithmetic and put it in §1 FACTS) | "$1.75 billion. That's a 10-minute show every day for 4,000 years." | `rollnum`, then `math` |
| 3 | **Rule of three with a twist** | "Hollywood stars, ten-minute shows, and a phone you had to hold sideways… wait, no, *upright*." | `panels` / `math` |
| 4 | **The freeze-frame intro** | "Yep. That's Jeff. You're probably wondering how he lost a billion dollars." | `freeze` |
| 5 | **Expectation vs reality** | "What they pitched… and what they got." | `expect` |
| 6 | **The mock-dramatic beat** | "And then… she read the numbers." | `dramatic` (once per film) |
| 7 | **The silly equation** | "Stars plus short shows equals… zero dollars." | `math` |
| 8 | **Running gag / callback** | a phrase from minute 1 returns at minute 7 with a new meaning | same picture, new label |
| 9 | **Talking to the viewer** | "Now, you might think: just make longer shows. They did not think that." | `meme` / `aside` |
| 10 | **"Meanwhile…" cutaway** | "Meanwhile, at Netflix, nobody was worried." | `cutaway` → `logos` |

**Imagined dialogue** ("Basically, the pitch was: *it's Netflix, but shorter*") must be clearly marked as a paraphrase,
not a quote. Real quotes stay verbatim and sourced (facts rule 10). Comparisons must be computed exactly, and the
arithmetic goes in §1 FACTS TO VERIFY.

## 3. Comedy tools in the engine (`pp_fun.js`, real photos only)
| Tool | Syntax | Max |
|---|---|---|
| `freeze` | `img:<photo>;pt:.42,.35;cap:Yep. That's Jeff.;sub:You're probably wondering…;at:<word>` | 1 per act |
| `expect` | `left:<img>,EXPECTATION;right:<img>,REALITY;go:<word>` | 1 per act |
| `cutaway` | `text:MEANWHILE…;sub:AT NETFLIX;at:<word>` | 2 per film |
| `dramatic` | `img:<face>;pt:.5,.35` | 1 per film |
| `math` | `eq:STARS+SHORT SHOWS=$0;go:<word>` (or `@img` terms) | 2 per film |
| `meme` (overlay) | `text:EVERYTHING IS FINE;at:<word>` | 1 per 2 min |
| `aside` (overlay) | `text:(It was not fine.);at:<word>` | 1 per min |

Comic sounds (record scratch, sad trombone, pop, boing) come with the tools. Never add them by hand to serious beats.

## 4. Where NOT to joke
- **Victims:** people who lost jobs, savings or lives. Joke about decisions and the powerful, never about the hurt.
- **Looks, accents, nationality, gender.** Never.
- **The thesis and the final lesson** are said straight. The laugh earns the audience; the ending keeps their respect.
- **Fraud details** are told exactly. The irony comes from the facts themselves.

## 5. Density and rhythm
- Hook: the first line can be a joke *if* it also states the stakes ("This app burned $1.75 billion in six months. That's
  impressive, actually.").
- About one light beat every 20–40 s, none in the 10 s before the biggest reveal (let the drop land).
- After a joke, go straight to the next fact. Never explain the joke.
- `pp_lint` warns when the comedy tools exceed their caps.

## 6. Checklist for the director package
- META has `tone: playful` (or `dry` with a reason).
- §3 SCRIPT marks every intended laugh with `(J)` at the end of the line, about 15–25 per 10-minute film.
- Every `(J)` line still teaches something. If you delete the joke, the fact must still be there.
- No cartoon characters or mascots anywhere.
