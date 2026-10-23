# CONTENT, AUDIENCE, PLATFORM, EMOTION: the other half of the film (v6.3)

**The owner (Oct 2026):**
- Content and SEO matter as much as the picture.
- Every episode must:
  - have its own character;
  - suit what viewers like to watch, and even just to listen to;
  - suit the platform.
- The voice must carry the right emotion: sad, happy, excited, all of them.

This file runs **in parallel with `scene-script.md`**, from the first minute of directing to the upload guide. Its
partners:
- `story-mining.md`: the angle and value rubric;
- `script-masterclass.md`: line craft;
- `voice-direction.md`: casting and the emotion tags;
- `publish.md`: the upload kit.

## 1. Packaging first: decide the click before the script
YouTube decides a video's life with two numbers: CTR (does the title + thumbnail earn the click?) and retention (does
the film keep the promise?). So:
1. **Search and demand (10 minutes, before the angle is final):**
   - If a keyword connector is available (Semrush `keyword_research`, Ubersuggest `keyword_overview` or
     `google_suggestions`), pull:
     - volume and difficulty for the subject's main phrases;
     - the questions people ask;
     - the related searches.
   - If no connector is available, run a web search for the subject on YouTube and Google autocomplete (`<subject> why`,
     `<subject> how`, `<subject> explained`, `what happened to <subject>`).
   - Write it into META → SEO:
     - the primary keyword (the phrase people actually type, not our clever name);
     - 3 secondary keywords;
     - the top 3 questions the audience asks;
     - the 3 biggest competing videos, each with its angle.
2. **The gap:**
   - What do the competing videos all say? That is the Wikipedia version we must not make.
   - Our angle answers a question they leave open (`story-mining.md` §2). Write it in one line: "Everyone says X. The
     real story is Y."
3. **Title + thumbnail before the script:**
   - Write 3 titles and 1 thumbnail concept now. The hook (first 30 s) must pay off the title's promise in its first
     sentence, so the viewer who clicked hears they came to the right place.
   - Titles:
     - keyword in the first 5 words;
     - ≤ 60 characters;
     - one curiosity gap the film really answers.
   - Thumbnail: ≤ 3 elements (one face or object, one number or word, one contrast colour). It must read at phone size.
     It must not repeat the title: it adds the emotion the title cannot.

## 2. Written for the ear: the film must work with the screen off
A large share of long YouTube is heard, not watched: on a phone in a pocket, on a TV across the room, in the car.
The script must survive the **listen-only test**:
- **Never point at the screen:**
  - no "as you can see";
  - no "look at this chart";
  - no "here".
  - Say what the picture shows: "the price went up every single month, by hand".
  - `pp_scriptlint` flags these phrases.
- **Numbers are said in a way the ear keeps:**
  - round and compare them: "four billion dollars, more than the GDP of Montenegro";
  - one number per sentence;
  - repeat the key number once, later, as a callback.
- **Names:**
  - full name and role on first mention, then the same short name every time;
  - never "he" across a cut, because the listener has no face to hold on to.
- **Signposts the ear needs:**
  - one sentence at each act turn that says where we are ("So that's the machine. Now watch what happens when it
    breaks.");
  - the open loop restated before the midpoint.
- **Sound carries the picture's jokes:** a laugh that depends only on the image must also have a line or a sound cue.
- **Listen pass:** before directing visuals, play the voice track alone at 1×, start to end (`out/<slug>-aN_vo.wav`).
  Every sentence where your attention drifts gets one fix:
  - a sharper word;
  - a turn (BUT / SO);
  - a pause;
  - a cut.

## 3. Its own character: the channel voice, not a generic explainer
`jobs/channel.md` is the bible. On top of it, every episode has:
- **One original thing nobody else has:** a computed number, a timeline we built, a document read closely, a
  comparison. It is written in META as "original analysis".
- **A point of view:**
  - the narrator has an opinion, earned by the evidence and said plainly once per act;
  - not neutral Wikipedia, not a rant.
- **Recurring channel signatures** (keep them, the audience learns them):
  - the cold open with the end first;
  - the thesis line near the end;
  - the "poison pill": the one decision that killed the company, named in a sentence the viewer could repeat to a
    friend.
- **Specific over clever:** a sentence with a name, a date, a place and a number beats any metaphor.

## 4. What viewers like (and the platform rewards)
- **0–30 s:** the title's promise, plus the most surprising fact or the end-state, plus a question. No logo, no "hello".
- **Every 20–40 s:** something new, either a fact, a turn, a scene or a joke. Re-hooks at about 3:00 and 6:00 ("but that
  wasn't even the strangest part").
- **About 50 %:** the twist that reframes the first half.
- **Ending:**
  - pay off the opening loop;
  - land the thesis in ≤ 15 words;
  - one line that sends viewers to the comments (the pinned question).
  - No long outro; the end screen does the rest.
- **Length:** 8–12 min. Longer only if retention earns it, never padding.
- **Humour:** one laugh about every 45–90 s in playful tone (`humor.md`). People share what made them laugh.
- **Respect:** victims are people, not punchlines. Jokes are aimed at the powerful and the absurd.
- **After 48 h, read the numbers** (`jobs/nhat-ky.md`):
  - CTR;
  - average view duration;
  - the retention graph's drops.
  - Write one lesson. The next episode reads the last 3 lessons before directing (`pp_history`).

## 5. The emotional arc: the voice must feel what the story feels
Every film is a ride: curiosity → excitement → doubt → dread → loss → understanding. Plan it like the reveal ladder.
1. **In META, write the emotion per act** (one word each, from the list below), and the 3 moments of strongest feeling
   with their emotion: a1 warm · a2 excited · a3 tense · a4 grave · a5 sad · a6 wry.
2. **The engine reads acts already** (rise = faster and brighter, fall = slower and lower: `voice-direction.md` §3).
3. **Mark emotion on the lines that carry it** with a tag. The narrator keeps their timbre, and the read borrows the
   intonation and pacing of a matching voice, plus speed, pause and pitch:

| tag | when | what happens to the read |
|---|---|---|
| `{excited}` | the rise, the money pouring in, the impossible growth | faster, brighter, lifted pitch, lively prosody |
| `{urgent}` | the clock is running: the raid, the escape | fastest, tight pauses |
| `{tense}` | something is wrong and only we know | a little slower, low, a held breath before |
| `{grave}` | the verdict, the number of victims, the law | slow, lower, weight on each word |
| `{sad}` | real loss: a family's savings, a death, a life wasted | slowest, softer, low, room after the line |
| `{warm}` | the founder's dream, the human detail, the thank-you | gentle, unhurried, slightly bright |
| `{wry}` | irony, the absurd detail, the joke | a beat before, a light lift |
| `{awe}` | scale beyond belief, the reveal of the true size | slow, open, a pause before and after |

   - Emotion tags may sit on many lines in an emotional passage; they are not limited like `{hit}`/`{hold}`.
   - An emotion on every line is no emotion: `pp_lint` warns above 60 %.
   - Combine with a device when needed: `{sad,hold}`, `{excited,fast}`.
   - Test a tag by ear: `python3 tools/voice.py say "<line>" out/t.wav --voice <narrator> --dir sad`.
4. **The picture and the music follow the same arc:** the music mood per act (`music.md`); the stillness before the
   climax (`motion-doctrine.md` §3); the colour of the grade.
5. **Contrast makes feeling:** the sad line lands after an excited passage, so place the emotional turns where the
   story turns.

## 6. In the package
- META:
  - **SEO block:** primary + secondary keywords, audience questions, competing videos and their angles, "Everyone says
    X. The real story is Y."
  - 3 titles + thumbnail concept (before the script).
  - **Emotion per act + the 3 strongest moments.**
- Script: emotion tags on the lines that carry feeling; listen-only test passed (`pp_scriptlint` 0 screen-pointing).
- Delivery report: what the keyword research found and how the title uses it.
