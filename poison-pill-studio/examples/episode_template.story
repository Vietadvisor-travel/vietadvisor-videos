title: <Company> — <the number + the conflict>
channel: poisonpill
look: dossier            # pick by CONTENT: dossier noir editorial tech luxury vintage retro broadcast eastern ledger blueprint (references/look.md)
tone: playful            # playful (default) | dry — references/humor.md
voice: am_michael
music: none
endcard: off
sources: <primary url> — <press url> — checked <Mon YYYY>
// ===================================================================================================
// EPISODE TEMPLATE — 10 min ≈ 1,550 words ≈ 120 beats. Split into 7 files: <slug>-a0 … -a6 (this file = act 0).
// Remove `endcard: off` only in the LAST act file.
// THESIS    <one surprising truth — the film argues this>
// LOOP      <question planted in a0, paid in a6>
// CURVE     a0 cold open (fall→setup) 0:00–0:30 · a1 origin setup 0:30–2:00 · a2 rise gold 2:00–4:30 ·
//           a3 crack doubt 4:30–6:30 · a4 fall red 6:30–8:30 · a5 after 8:30–9:30 · a6 lesson 9:30–10:00
// RE-HOOKS  ~1:30 · ~3:00 · ~4:30 (mid twist) · ~6:00 · ~7:30 · ~9:00
// BURSTS    ~2:45 (S23 acquisitions) · ~5:30 (S11 headline storm) · ~8:00 (S23 the dominoes)
// PHOTOS    people: … · places: … · documents/press: …   (≥ 70 % of beats with a real photo)
// ===================================================================================================

// 0:00 COLD OPEN — S01: black, $0 red burns back into the peak value on "worth#2", founder cut-out slaps
# cine act=fall bg=black cam=push solo=1 mid="<founder>;x:.28;h:.62;at:worth;tone:bw" hero="$0;at:c1;col:red;pos:r;to:$<PEAK>;toAt:worth#2;toCol:#c9a227" fx="date:<YEAR>;at:<word>|flash:white;at:worth#2"
<This company is worth nothing today.> <Years ago it was worth ... billion.>

// 0:06 THE QUESTION — S11-style press wall, the open loop as a hero "?"
# cine act=doubt bg="wall:<press_1>,<press_2>,<plate>" bgBlur=9 cam=pull mid="<founder>;x:.3;h:.6;at:<word>;tone:teal" fg="<headline_print>;x:.82;y:.99;h:.3;at:<word>;style:torn;tape" hero="?;at:<word>;pos:r;size:180;col:paper" fx="headline:<real headline>;src:<OUTLET>;at:<word>;x:.66;y:.4;rot:3"
<So how does ... lose ... in ... ?>

// 0:10 CASE FILE — the episode sting, right after the cold open
# ppcase n=<NN> title="<Company>" sub="<one-line promise>" photo=<slug_hero> stamp=OPEN
Case number <NN>. <Company>.

// 0:14 REWIND — whip, setup warm, date card types; the origin begins
# cine act=setup bg=<plate_era> bgBlur=10 cam=panR trans=whip date="<YEAR>" mid="<founder_young>;x:.3;h:.64;in:rise;at:<word>;lab:<NAME>" fg="<early_doc>;x:.82;y:.98;h:.28;at:<word>;style:polaroid;rot:6" hero="<1–3 WORDS>;at:<word>" sup="<SUPPORT LINE>;at:<word>"
<To understand it, we have to go back to ...>

// … continue: one `# cine` per sentence, recipes from references/shot-library.md, never the same recipe twice in a row.
