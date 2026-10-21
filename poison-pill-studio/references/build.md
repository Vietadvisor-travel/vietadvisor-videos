# BUILD: invent the picture of each sentence (v5.2)

**The rule:**
- **Invent first. Use a template second.**
- The 70 ready-made scene types are a vocabulary, not the film. If an episode is assembled only from them, it looks like
  the last episode.
- **At least 25 % of beats are composed with `build`** from their own sentence. `pp_lint` and `pp_history` check this
  against the last 3 episodes.

## 1. The grammar
```
# cine act=rise fx="build:x;el:<K>=<element>,x,y,size~<K>=…;do:<K>.<verb>[:<arg>]@<word>~…"
```
- **Elements:**
  - `@<image>,x,y,h`: a real photo, cut-out or generated prop. `h` is its height as a fraction of the frame.
  - `icon:<name>[*N],x,y,h`: one of 24 drawn icons, or a crowd or pile of N of them. The icons are:
    - people and money: person, coin, dollar, crown, key, lock;
    - places: building, house, factory, store, bank, globe;
    - transport: car, truck, ship, plane;
    - devices and paper: phone, laptop, doc;
    - ideas and danger: chart_up, chart_down, bulb, gear, bomb.
  - `txt:<TEXT>,x,y,size[,red|gold|ink|paper]`: kinetic text that types itself in.
  - `num:<value>[:pre[:unit]],x,y,size`: a number that counts up on `count`.
  - `tag:<LABEL>,x,y,size`: a label card.
  - `arrow:<A>><B>` and `line:<A>-<B>`: connectors that draw themselves between two elements.
- **Entrance verbs:** pop, rise, drop, slideL, slideR, unfold, zoom, fade, type, draw. Without one, an element pops in
  automatically, staggered.
- **Action verbs:**
  - size: `grow[:k]`, `shrink[:k]`, pulse;
  - motion: shake, spin, flip, tilt, swing, float, `move:x,y`, `follow:<K>`;
  - more of it: `multiply:N`, count;
  - attention: glow, dim;
  - judgement: red, gray, `stamp:<TEXT>`;
  - destruction: crack, burn, explode, fall, vanish.
- **Always alive:** every element breathes and floats. Each verb lands on its spoken word, 3 frames early, with its own
  sound (whoosh, thump, glass, fire, stamp…).
- **Combine freely** with `scene` (real-photo plate) and `air` (atmosphere). The camera rig `shot=` works on all of it.

## 2. From sentence to picture: the method
1. **Find the nouns** that can be objects: company, money, people, places, products, documents, numbers.
2. **Find the verbs** in the sentence and map them to engine verbs:

   | In the sentence | Verb |
   |---|---|
   | raised, poured in | multiply, follow |
   | grew | grow |
   | collapsed | crack, fall |
   | burned through | burn |
   | sued | stamp |
   | ignored | dim, gray |
   | moved to | move, follow |
   | went viral | multiply |
   | hid | vanish |
   | exploded | explode |
3. **Place them like a sentence is read:** cause on the left, effect on the right; before at the top, after at the bottom.
   The camera leads the eye.
4. **Time each verb to its word.** Let the last verb land on the sentence's **hit word**.
5. **Never reuse a composition.** If two beats would look the same, change the metaphor, the layout or the verbs.

## 3. Twenty-five sentences, invented (patterns, not templates; recombine them)
| Sentence | Picture (`el` → `do`) |
|---|---|
| "They raised $1.75 billion, spent it on ads, and it was gone in six months." | coins ×14 → phone; `N.count@raised · C.multiply@raised · R.draw@spent · C.follow:A@spent · A.burn@gone · N.red@gone` |
| "One factory fed a new store every week." | factory + stores on lines; `S1.pop@every · S2.pop@week · S3.multiply:9@stores` |
| "She went to the bank for a $4B loan; then the bank collapsed." | photo cut-out + bank icon + tag; `B.drop@bank · K.swing@loan · B.crack@collapsed · P.gray@collapsed · K.stamp:DEFAULT@collapsed` |
| "Every user cost them $40 to win, and paid them $3." | person; coin ×8 flows in, coin ×1 flows out; `C1.follow:P@cost · C2.follow:B@paid · N1.count · N2.count · N2.red` |
| "The CEO sold his shares a week before the crash." | CEO photo + chart_up turning chart_down; `doc.slideR@sold · chart.flip@crash · chart.red@crash` |
| "Three founders, one company, and only one of them stayed." | person ×3; `P2.vanish@only · P3.vanish@only · P1.glow@stayed` |
| "The app went viral in a week." | phone + person ×40; `crowd.multiply:40@viral · phone.pulse@week` |
| "Investors were told it was safe." | lock icon + doc; `lock.glow@safe`, later `lock.crack@…` in the next beat (callback) |
| "The warehouse held 40,000 unsold juicers." | warehouse plate (`scene`) + juicer cut-out; `J.multiply:40@unsold · num.count@40,000` |
| "Shipping costs doubled overnight." | ship + num; `ship.move:.7,.5@shipping · num.count@doubled · num.grow:1.6@overnight` |
| "Regulators were watching." | bank or building + three person icons fading in at the edges; `P.dim→glow@watching` |
| "He promised a car for everyone." | car icon; `car.multiply:30@everyone` |
| "Then the lawsuits started." | doc ×12 dropping in; `docs.drop@lawsuits · docs.stamp:SUED@started` |
| "The bubble popped." | coin pile; `pile.grow:1.8@bubble · pile.explode@popped` |
| "Nobody noticed the small print." | doc; `doc.zoom@small · txt.type@print` |
| "A single email changed everything." | doc → arrow → globe; `doc.pop@email · R.draw@changed · globe.shake@everything` |
| "They bet the company on one product." | factory → phone; `factory.shrink:.6@bet · phone.grow:1.8@one` |
| "Their rivals copied it in months." | phone ×1 → phone ×6 (gray); `copies.multiply:6@copied · copies.gray` |
| "The stock fell 90 % in a day." | chart_down + num; `num.count@90 · chart.fall@day` |
| "They hid the losses in a second company." | building A + building B + coins; `coins.follow:B@hid · B.dim@second` |
| "The founder walked away with $300 million." | founder cut-out + coin pile; `pile.follow:F@away · F.slideR@walked` |
| "Employees found out on Twitter." | phone + person ×20; `phone.pulse@twitter · crowd.red@found` |
| "The idea was simple." | bulb; `bulb.glow@idea · bulb.pulse@simple` |
| "Then the money ran out." | coin pile; `pile.shrink:.1@ran · pile.vanish@out` |
| "It all started in a garage." | `scene` garage plate + bulb `build` overlay; `bulb.rise@started` |

## 4. Freshness rules (within one episode and across episodes)
- **No two beats with the same composition.** Lint flags identical `fx` strings.
- **Rotate the metaphor families:** objects and money, people and crowds, places and maps, documents, data, destruction.
  Don't run three beats from the same family.
- **The engine varies its own accents per episode:** the hit-word accent style, the chapter-transition order and the
  entrance staggers come from the episode title seed. Two episodes never share the same rhythm.
- **`pp_history`** remembers the last episodes' openings, looks, signature template scenes and music tracks.
  - Lint warns when you reuse them.
  - The music picker avoids the last 3 episodes' tracks.
  - Before writing a package, read `node tools/pp_history.mjs show` (Muse pastes it into the request) and choose
    differently.
