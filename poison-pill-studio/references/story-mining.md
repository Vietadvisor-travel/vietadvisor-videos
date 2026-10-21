# Story mining: content with real value (v6)

The film is only as good as what was found. **Before Claude writes a word, Muse digs.**
- Muse fills the worksheet in §5 below and delivers `RESEARCH_<nn>_<slug>.md`.
- Claude writes the director package FROM that research. It picks the angle and the format, and keeps the best facts for
  the hook, the turn and the climax.
- The value rubric (§6) is the gate: **publish at ≥ 15/20, with no zero in rows 1–4.**

**Daily flow (v6):**
1. Muse: "nghiên cứu tập N" → `RESEARCH_<nn>_<slug>.md` (worksheet A–M, every row sourced and confidence-tagged) plus
   the output of `pp_history show`.
2. Owner: pastes both to Claude: "gói đạo diễn: ngày N".
3. Claude writes the package. It includes the format (one of the 12, not the last one used), the angle (it must pass the
   anti-Wikipedia test), custom scenes and the rubric self-score.
4. Muse builds it.

---
## 0. The core thesis in one paragraph

Formulaic business videos retell the Wikipedia arc: founded, grew, scandal, fell. Valuable ones answer a question the viewer did not know they had. They prove the answer with evidence the viewer has not seen, and they leave the viewer with a tool they can reuse. Acquired's hosts say that every time they put more work into an episode, both the qualitative reaction and the numbers went up **[sourced: Acquired / Fast Company / Cal Newport]**. Depth is the differentiator, and depth means three things:

1. **Primary-source evidence.** Use filings, court exhibits, archived pages and contemporaneous press, not summaries of summaries.
2. **A mechanism.** Explain *why* something happened, not just *what* happened.
3. **A human decision under uncertainty** at the center of the story.

---

## 1. Research methods

### 1.1 How the best creators actually research (sourced benchmarks)

| Creator | Method | Takeaway for us |
|---|---|---|
| **Acquired** (Gilbert & Rosenthal) | 200+ hours per episode (media kit). Rosenthal read about a dozen Nike books and used 3 as main sources. Gilbert's Nike research had 117 links, the original 1972 Swoosh trademark filing and many earnings reports. Output: a 39-page script plus a 4,000-word research report. They interviewed 20+ current and former employees for the Microsoft episode. **The hosts split research and don't tell each other what they found**, which creates real on-air surprise. | Use two research tracks: (a) the narrative and history track (books, press) and (b) the business-mechanics track (filings, numbers). Merge them late. Find the 3 load-bearing books, not 12 shallow ones. |
| **Coffeezilla** | "Read the documents, follow the money, ask the next question, wait." Uses on-chain transactions (e.g. he confronted a SafeMoon ex-CTO with a transaction showing 36.7T tokens leaving a liquidity pool), OSINT, court filings, domain records, and on-camera interviews (three with SBF). Uses animated graphics to show money flows. | Every claim in a video should point to a document you can put on screen. Use the confrontation and interview as the climax. |
| **Johnny Harris / Vox Borders** | Crowdsourced about 6,000 location suggestions from the audience and narrowed them to 6. Sent structured weekly "call-outs" before trips to find fixers and interviewees. Kept a 400-person waitlist of local contacts. Format: data viz + animation + sound design + expert interviews + narration. | Use the audience and comment sections as a lead-generation engine: people who worked at company X are watching. |
| **Kurzgesagt** | Publishes a **sources document** with every video. Small research team (head of research, 2 fact-checkers, 2 researchers). Sends drafts to outside experts. Documents its simplifications. Pulled its "Addiction" video after criticism. | Ship a public source sheet with each episode. Log every simplification you make. Have a retraction policy. |
| **Patrick Boyle** | Ex-hedge-fund founder and finance professor. Cites academic studies. Dry, measured delivery in contrast to the sensationalism common in the niche. | Credibility comes from expertise plus restraint. Understatement is a style that also signals rigor. |
| **Modern MBA** | Strength is "how quickly the creator can grasp an unfamiliar industry." Balances research with storytelling. Analysis rooted in corporate-management background. | Learn the industry's unit economics before writing a word of narrative. |
| **LEMMiNO** [observed] | Very long production cycles. Few videos, each researched for months. Mystery topics (D.B. Cooper, Cicada 3301, the Lost Cosmonauts). Publishes detailed source lists. Narration admits uncertainty instead of overclaiming. | Scarcity and depth beat cadence. "We don't know, and here is exactly where the evidence stops" is a satisfying ending when done honestly. |

### 1.2 Primary-source playbook (where the "untold" details live)

**A. Securities filings (US: SEC EDGAR. Use full-text search at efts.sec.gov/LATEST/search-index or the EDGAR FTS UI.)**

- **S-1 / F-1 (IPO prospectus).** Read the founder letter (it shows the narrative they want). Read the Risk Factors (what lawyers forced them to admit). Read the cap table and related-party transactions. Example: WeWork's 2019 S-1 disclosed "Community Adjusted EBITDA" and that Adam Neumann had been paid $5.9M for the "We" trademark (later returned). That one filing became the story.
- **10-K.** Go straight to these sections:
  - Item 1A Risk Factors: diff them year over year. A **new** risk factor is a story.
  - MD&A: management's own causal explanation.
  - Segment footnotes: where profit really comes from.
  - Customer concentration.
  - Legal proceedings.
  - Subsequent events.
- **10-Q / 8-K.** 8-Ks are event-driven: executive departures (Item 5.02), material agreements (1.01), restatements (4.02 non-reliance) and auditor changes (4.01).
- **DEF 14A (proxy).** Exec pay, perks (private jet use), related-party deals, board ties.
- **13D / 13G / Form 4.** Activists and insider selling. Timing insider sales against bad news is a classic reveal.
- **Exhibits (EX-10, EX-99).** Actual contracts, employment agreements and merger agreements. Full-text search covers exhibits, so a **private** company's name shows up in a mutual fund or partner filing even though that company never filed itself **[sourced: business journalism guide]**.
- **Full-text search phrases worth trying:** "going concern", "material weakness", "substantial doubt", "restatement", "related party", "wind down", "we may not be able to", plus the competitor's name inside a company's filings.

**B. Earnings call transcripts** (company IR pages, Seeking Alpha, Motley Fool transcripts; old ones via Wayback)

- Line up what the CEO *said* in quarter N against what happened in N+4. The gap between promise and outcome is free drama and is fully sourced.
- Read the analyst Q&A. The hardest question asked, and the evasive answer, often marks the real turning point.

**C. Court records**

- US: PACER and CourtListener/RECAP (free mirror). Read complaints, exhibits (internal emails!), deposition transcripts and expert reports. Exhibits in antitrust and fraud cases (e.g. US v. Microsoft, FTX, Theranos) contain internal emails that are the best quotes you'll ever get.
- Bankruptcy dockets (Kroll, Stretto and Epiq claim-agent sites) list creditors. That list shows who really got hurt.

**D. Archived web (Wayback Machine, archive.today)**

- Workflow **[sourced: Bushe/EBU guides]**:
  1. Identify the URL.
  2. Check the calendar.
  3. Compare snapshots around key dates.
  4. Screenshot as evidence.
- Use wildcard URL patterns (`example.com/*`) to list every archived page under a domain. Filter by 14-digit timestamps.
- Uses for us:
  - Old pricing pages, which show business-model pivots.
  - "About" and team pages, which show who quietly left.
  - Deleted press releases.
  - Original pitch copy, which shows how the company described itself before hindsight.
- Limits: a Pew study (2024) found 38% of pages from a decade ago are gone. Robots.txt causes gaps, and some publishers now block the archive.

**E. Newspapers and magazines from the time**

- Archives: Google News Archive, Newspapers.com, ProQuest, NYT TimesMachine, LIFE (Google Books), Byte and InfoWorld (Google Books), trade journals.
- Rule: **quote what people said *before* they knew the ending.** Contemporaneous predictions that turned out wrong are irony gold (e.g. analysts on the iPhone in 2007).

**F. Books, oral histories, conference talks**

- Business-history books, founder memoirs (they show the intended myth), journalist books (e.g. *Bad Blood*), Computer History Museum oral histories, and YouTube archives of old conference keynotes.
- Patents and trademark filings (USPTO TSDR, Google Patents). These date ideas and name the individuals behind them.

**G. Interviews and human sources**

- LinkedIn search for "former [Company] [Role] 2012-2016". Comment sections and subreddits of ex-employees. Glassdoor reviews dated around key events.
- Ask: "What does everyone get wrong about this story?" and "What was the meeting where it changed?"

**H. Data sources for original charts**

- Company filings (build your own time series), Macrotrends/Stockanalysis (cross-check against filings), FRED, World Bank, Our World in Data, Statista (cite the underlying source), Google Trends, app-store rank archives, SimilarWeb.

**I. Vietnam and SE Asia equivalents** (relevant for the VietAdvisor channel)

- Listed company disclosures: HOSE, HNX and SSC filings; annual reports and prospectuses (bản cáo bạch); financial statements on Vietstock, CafeF and FiinGroup.
- Business registry: National Business Registration Portal (dangkykinhdoanh.gov.vn).
- Court judgments: congbobanan.toaan.gov.vn.
- Press archives: VnExpress, Tuổi Trẻ, Thanh Niên, Saigon Times. Pre-1975 and colonial-era material: Gallica (BnF) and Vietnamese National Archives.
- Investor letters from foreign funds (VinaCapital, Dragon Capital) are on the LSE/RNS.

### 1.3 Finding the "untold" detail: techniques

1. **Diff the documents.** Compare consecutive 10-K risk factors, old and new website versions, and the S-1 against the first 10-K. What changed is the story.
2. **Read the footnotes, not the headlines.** Segment data, deferred revenue, related parties and lease obligations.
3. **Follow the money to a person.** Who got paid, when, and how much, relative to everyone else?
4. **Find the "before they knew" artifact.** Use the memo, pitch deck or keynote from before the outcome.
5. **Find the loser's version.** Use the competitor, the fired exec or the plaintiff. Every founder myth has a counter-memoir.
6. **Find the number nobody computed.** Examples: revenue per employee, cost per customer acquired, the share of profit from one product. Original arithmetic on public data counts as original reporting.
7. **Chase the oddly specific.** Small anomalies in filings (a weird subsidiary, a one-off payment, an unusual auditor) tend to pay off.
8. **Ask the comment section.** Pin a call-out comment that says "Did you work at X between 2010 and 2015?"

### 1.4 Verification protocol

- **Two independent sources** for every claim that carries weight. One of them should be primary where possible.
- **Trace every number to its origin document**, including page and line. Never cite an aggregator as the final source.
- **Tag confidence for each fact:** Confirmed (primary doc) / Reported (credible journalism) / Claimed (party's own assertion) / Disputed. Narrate in matching language ("according to the lawsuit…", "Neumann later claimed…").
- **Watch for myths.** Founder origin stories are often PR. Examples: the eBay Pez-dispenser story was invented by a PR person. The Netflix late-fee origin story is disputed by co-founder Marc Randolph. Debunking a myth makes a great segment.
- **Legal hygiene:** describe allegations as allegations. Name sources for any accusation. Avoid stating intent unless documented. (Coffeezilla was sued for defamation in 2024. Assume scrutiny.)
- **Publish a source sheet** (Kurzgesagt model) with timestamps → URLs/documents, plus a list of the simplifications made.

---

## 2. Angle selection

### 2.1 Angle types (pick one per episode; state it in one sentence before writing)

| Angle type | Template | Example |
|---|---|---|
| **Contrarian thesis** | "Everyone thinks X killed it. It was actually Y." | "Netflix didn't kill Blockbuster. Blockbuster's own late-fee dependence did: late fees were a large share of revenue, so fixing the customer's biggest complaint meant cutting its own profit." |
| **Mechanism ("why it really happened")** | "Here's the machine that made this inevitable." | Costco: the membership fee *is* the profit. The merchandise margin is roughly break-even by design. |
| **Second-order effects** | "X happened, which caused Y, which nobody expected to cause Z." | Containerization → collapse of port-city labor → rise of inland logistics hubs. |
| **The human decision** | "One meeting, one person, one choice." | Kodak engineer Steve Sasson builds the first digital camera in 1975, and management's response defines the next 35 years. |
| **The number** | "This single number explains the company." | Amazon's negative cash conversion cycle. |
| **The paradox / irony** | "The thing that made them great is what killed them." | Nokia's hardware excellence vs. software culture. |
| **The hidden system** | "You use this daily and never see who controls it." | Visa/Mastercard interchange; Luxottica in eyewear. |
| **The lesson** | "What this teaches you to do / avoid." | Every episode should still end here, whichever angle it uses. |

### 2.2 The anti-Wikipedia test (apply before greenlighting)

Kill or rework the angle if any of these are true:

- The thesis can be stated by reading the first two paragraphs of the Wikipedia page.
- No fact in the top-10 surprise list is missing from the Wikipedia article.
- The video works as pure chronology. If no question pulls the viewer forward, there's no angle.
- There is no original chart or calculation.
- The ending lesson is generic ("innovate or die", "never give up").
- You can't name the single **decision** the story hinges on.

**Angle generation prompts for the agent:**

- What do most people believe about this company that the documents contradict?
- What is the most surprising *number* in its filings?
- Who lost the most, and why haven't we heard their version?
- What would have happened if one decision had gone the other way?
- What does this story share with a totally different company or era?
- What is the viewer doing *right now* that this story explains?

---

## 3. Insight density

Target: **one "I didn't know that" every 60–90 seconds** and **1–3 reusable mental models per episode.**

### 3.1 Frameworks worth teaching (name them on screen; explain via the story, not a lecture)

- **Strategy:**
  - Hamilton Helmer's *7 Powers*: scale economies, network effects, counter-positioning, switching costs, branding, cornered resource, process power. Acquired uses this explicitly in its "Power" analysis segment [observed].
  - Christensen's disruption theory (low-end/new-market) and the jobs-to-be-done lens.
  - Porter's five forces (use sparingly).
  - Ben Thompson's aggregation theory.
  - Razor-and-blades.
  - Counter-positioning: the incumbent *can't* copy you without hurting itself (Blockbuster late fees, Kodak film margins).
- **Finance:**
  - Unit economics (CAC/LTV).
  - Operating leverage.
  - Cash conversion cycle.
  - Float (Berkshire insurance).
  - Survivorship bias.
  - Reflexivity (Soros).
  - Incentive structures and Goodhart's law (Wells Fargo's account-opening quotas).
- **Behavior and organizations:**
  - Innovator's dilemma.
  - Sunk-cost fallacy.
  - Principal–agent problems.
  - Founder-mode vs. professional management.
  - Conway's law.
  - Regulatory capture.
- **History:**
  - Path dependence (QWERTY, rail gauges).
  - Base rates (how often do turnarounds succeed?).
  - Counterfactual reasoning.

### 3.2 Original data analysis (the cheapest way to beat 90% of channels)

- **Chart from filings.** Build 10–20-year series yourself: revenue by segment, margin, R&D % of revenue, share count (buybacks/dilution), debt, employees, revenue per employee.
- **Annotate charts with decisions.** Overlay the moments ("CEO change here", "price hike here"). A chart with an arrow pointing at a decision *is* the insight.
- **Normalize.** Inflation-adjust old dollars (CPI) and express values per user, per store or per employee. Raw big numbers are noise. Normalized comparisons are insight.
- **Compare across companies or eras.**
  - Same metric for Company vs. its rival.
  - Same strategy in two eras: Sears catalog (1890s) vs. Amazon (1990s). Standard Oil vs. modern platform monopolies.
  - Same industry in two countries: US vs. Vietnam retail, Grab vs. Uber.
- **Do a "promise vs. reality" table.** Put management's guidance next to actuals for every year.
- **Kill your chart if** it shows what the narration already said without adding a new dimension.

### 3.3 Density techniques in scripting

- Replace adjectives with numbers ("huge losses" → "$1.6B, more than its entire revenue that year").
- Every fact must do work: advance the question, raise stakes or set up a payoff. Cut "and then" facts. Use the **"therefore / but" rule** from Trey Parker and Matt Stone: beats connected by *and then* are boring, and beats connected by *therefore* or *but* create causation and tension **[sourced]**.
- Put the insight in the **turn**: "Here's what everyone missed…"

---

## 4. Emotional engine

### 4.1 The four parts

1. **Character.** Someone with a want, a flaw and a choice. Companies aren't characters, people are. Even a "system" video needs a human face: the engineer, the regulator, the short-seller, the customer.
2. **Stakes.** Make them concrete: jobs, life savings, a town, a family fortune, a country's growth. Tie them to a person ("the 23-year-old who put her savings in…").
3. **Dramatic question.** Pose it in the first 30–60 seconds and resolve it near the end, e.g. "How did a company worth $47B lose 80% in six weeks?" Smaller open loops ("we'll come back to that memo") sustain it in the middle.
4. **Irony.** The gap between what people believed then and what we know now. Contemporaneous quotes create dramatic irony: the viewer knows the ending and the character doesn't.

### 4.2 Structure without formula

- **Keep the invisible skeleton:** hook → question → escalation → turn/reveal → consequence → meaning.
- **Vary the visible shape every episode:** the entry point, time order, protagonist count, narrator stance and ending type.
- **Rotate opening types:**
  - Cold open on the decision moment.
  - A document on screen.
  - A number.
  - A contemporaneous quote that aged badly.
  - A present-day scene (an abandoned store).
  - A question to the viewer.
- **Rotate ending types:**
  - Verdict (grading the decision).
  - Open question (LEMMiNO-style honest uncertainty).
  - Callback to the opening image.
  - "Where they are now."
  - The lesson as a rule.
  - A forward-looking prediction with stated confidence.
- **Avoid these tics:**
  - "But that's when everything changed."
  - The rags-to-riches-to-ruin arc on every topic.
  - Ominous music under every sentence.
  - Villain-izing without evidence.
  - Fake cliffhangers before sponsor reads.
  - Ending every video with "the lesson is to adapt."

---

## 5. Story Mining Worksheet (for the AI research agent)

Fill out one per topic. Deliver it as a structured doc. Every row needs a source link and a confidence tag (C = Confirmed primary, R = Reported, A = Claimed by party, D = Disputed).

### Section A: Topic framing

- **Topic:**
- **One-sentence Wikipedia version** (what we must go beyond):
- **Candidate angles (3)**, one each of: contrarian / mechanism / human decision:
- **Chosen angle and dramatic question** (one sentence each):
- **Why now?** (news hook, anniversary, relevance to viewer):
- **Who is the viewer, and what do they walk away able to do or see?**

### Section B: 40 facts ranked by surprise

| # | Fact | Source (doc, page) | Conf. | Surprise 1–5 | Type (number/quote/irony/mechanism/character) | Use (hook/turn/payoff/cut) |
|---|---|---|---|---|---|---|

Rules:

- At least 10 facts must be **absent from Wikipedia**.
- At least 5 must come from primary documents.
- At least 3 must be ironies (then vs. now).
- The top 3 by surprise go to: hook, midpoint turn, climax.

### Section C: 10 numbers with sources

| # | Number | What it means (normalized/comparative) | Source + page | Chart idea |
|---|---|---|---|---|

Include at least one each of:

- scale
- unit economics
- a growth rate
- a before/after
- a cross-company comparison
- an inflation-adjusted historical figure
- the single "defining number"

### Section D: Key documents (put on screen)

- Filings (form, year, section)
- Court docs (case no., exhibit no.)
- Archived pages (Wayback URL + timestamp)
- Contemporaneous articles (publication, date)
- Patents, trademarks, letters, memos, internal emails
- Each with: **what it proves**, plus a visual treatment note (highlight line, zoom, redline diff)

### Section E: Quotes

- 5–10 quotes. Each needs speaker, date, source, and the context of what they knew at the time.
- Tag each one: *aged badly* / *prophetic* / *revealing motive* / *the other side*.
- Include at least one quote from the losing or opposing side.

### Section F: Cast

- Protagonist(s): want, flaw, the decision they faced.
- Antagonist or force (person, competitor, regulator, physics of the market).
- Witnesses (journalists, employees, short-sellers, customers).
- For each: a role in the story and a source for every claim about them.

### Section G: The 3 decision moments

For each moment:

- Date, place, who was in the room.
- Options available at the time, with what was knowable *then*, not hindsight.
- What they chose, and why (stated reason vs. likely real incentive).
- Immediate effect and second-order effect.
- Evidence (document or quote).

### Section H: Mechanism

- Explain in 3–5 causal links why it happened ("A → therefore B → but C → therefore D").
- Name the framework (e.g. counter-positioning, innovator's dilemma).
- Draft the diagram this needs.

### Section I: Counterfactual

- The most plausible alternative decision.
- Evidence it was feasible (someone proposed it; a rival did it).
- Estimated outcome, with reasoning and a confidence level.
- A real-world parallel where the other path was taken (e.g. Fujifilm vs. Kodak).

### Section J: Comparisons

- A cross-company parallel (same era).
- A cross-era parallel (same pattern, different century).
- A cross-country parallel (e.g. a Vietnam/SE Asia analogue).

### Section K: Myths and corrections

- Popular claims that are false or unproven, with evidence for each.

### Section L: Takeaways

- 1–3 mental models taught (name + one-line definition + where it shows up in the story).
- 1 practical lesson the viewer can apply (career, investing, business, consumer behavior).
- 1 open question or prediction.

### Section M: Gaps and risks

- Claims needing verification.
- Legal-sensitivity flags (living persons, allegations).
- Missing visuals or documents.
- Who to interview.

---

## 6. Episode Value Rubric (score 0–2 each; 20 max; publish at ≥15, no zeros in rows 1–4)

| # | Criterion | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | **Angle** | Chronological retelling | Clear thesis but conventional | Thesis that reframes the topic; passes the anti-Wikipedia test |
| 2 | **Primary evidence** | Secondary summaries only | Some primary docs | Load-bearing claims shown from primary docs on screen |
| 3 | **Accuracy and sourcing** | Unsourced numbers | Sourced, not tagged | Source sheet published; confidence language in narration; myths corrected |
| 4 | **Mechanism** | What happened | Partial why | Clear causal chain + named framework |
| 5 | **Novelty** | Nothing new to an informed viewer | 1–3 fresh facts | 5+ facts or analyses not available in top search results |
| 6 | **Original analysis** | No charts or stock charts | Charts of existing data | Original calculation/normalization/comparison that produces a new insight |
| 7 | **Human decision and character** | Faceless company | Characters named | Decision moment dramatized with what was knowable then |
| 8 | **Dramatic engine** | No question | Question posed, weak payoff | Strong question in the first 60s, escalation, satisfying payoff, real irony |
| 9 | **Transferable takeaway** | None or a cliché | Generic lesson | Specific, reusable model/lesson the viewer can apply |
| 10 | **Fairness and structure freshness** | One-sided; same template as the last episode | Some balance or variation | Opposing view represented; format differs from the last 3 episodes |

**Quick self-tests before publishing:**

- Can a viewer explain the mechanism to a friend in two sentences?
- What's the one screenshot people would share?
- Would an industry insider learn something?
- Would the subject's lawyer find an unsupported claim?

---

## 7. Episode structures to rotate (12 formats)

| # | Format | Shape | Best for | Example pattern |
|---|---|---|---|---|
| 1 | **Investigation** | Question → follow the documents → dead ends → reveal → confrontation/response | Fraud, scams, hidden ownership | Coffeezilla-style: "Where did the money go?" |
| 2 | **Countdown / Clock** | Fixed timeline ("The 72 hours before…"), with timestamps on screen | Collapses, bank runs, launches | SVB's final 48 hours; Lehman weekend |
| 3 | **Rivalry (two protagonists)** | Intercut A and B; each choice mirrors the other; the verdict at the end | Market battles | Kodak vs. Fujifilm; Grab vs. Uber in SE Asia; Pepsi vs. Coke |
| 4 | **A single day** | One day as the frame, with flashbacks explaining how we got there | Turning points | The day the iPhone launched; IPO day; the day of a recall |
| 5 | **A single number** | Open on a number; each act re-explains it at a deeper level | Business-model deep dives | "Why Costco makes almost nothing on what it sells" |
| 6 | **Mystery** | Unknown → hypotheses → evidence for/against each → honest verdict with confidence | Unexplained successes or vanishings | LEMMiNO-style; "What actually happened to [company]?" |
| 7 | **The decision (counterfactual)** | Reconstruct one decision; play out both paths; grade it | Strategy lessons | "Should Blockbuster have bought Netflix for $50M?" |
| 8 | **Autopsy (reverse chronology)** | Start at the corpse; peel back causes layer by layer to the root cause | Failures | Toys"R"Us leveraged buyout → debt → no capex → collapse |
| 9 | **The hidden system / map** | Follow a product or dollar through the system (Johnny Harris map style) | Supply chains, payments, logistics | "Follow one bag of Vietnamese coffee to a Starbucks" |
| 10 | **Era comparison** | Same pattern in two centuries; alternate between them | Showing that history rhymes | Railroad mania vs. dot-com vs. AI capex |
| 11 | **Myth-busting / Trial** | Charges against a popular myth; evidence for prosecution and defense; verdict | Overrated or contested stories | "Did Jack Welch really make GE great?" |
| 12 | **Playbook / anthology** | 5–7 lessons, each told through a mini-story | Founder or company lessons; series recaps | Acquired-style "playbook" segment expanded into a full episode |

**Rotation rule:** never use the same format twice in a row, and use at least 4 different formats per 6 episodes. Track the format in a content log alongside these fields: protagonist count, opening type, ending type and primary-document type. Vary them all.

**Format-specific must-haves:**

- **Investigation:** a request for comment, documented.
- **Countdown:** an on-screen clock.
- **Rivalry:** a scoreboard graphic.
- **Single number:** the number on screen at open and close.
- **Mystery:** a hypothesis board with explicit probability.
- **Autopsy:** a cause-tree graphic.
- **Trial:** a fair "defense."

---

## 8. Production workflow (research → script)

1. **Day 1–2. Scan.** Read Wikipedia, 3 overview articles and 1 long-form piece only to map the terrain and collect the myths. Draft 3 candidate angles.
2. **Day 3–7. Dig, on two tracks** (Acquired split):
   - Track A, narrative: books, contemporaneous press, interviews, quotes.
   - Track B, mechanics: filings, transcripts, data, charts.
   Keep the tracks separate until merge.
3. **Merge.** Fill out the worksheet. Rank facts by surprise. Pick the angle, the format (Section 7) and the dramatic question.
4. **Beat sheet.** Connect beats only with *therefore* or *but*. Place the top-3 facts at the hook, the turn and the climax.
5. **Script.** Every claim gets an inline source tag. Mark the "on-screen document" moments.
6. **Verification pass.** A separate agent or person checks each number against its primary doc and flags allegation language.
7. **Score** against the rubric. Below 15 means go back to step 2 for the weakest row.
8. **Publish** with a source sheet and a pinned call-out comment for insiders (this feeds future episodes).

---

## Sources

- [How Acquired became the No. 1 Tech podcast (Chris Chow)](https://chrischow.substack.com/p/how-acquired-became-the-no-1-tech)
- [Fast Company on Acquired](https://www.fastcompany.com/90927453/acquired-number-1-tech-podcast-sensation)
- [GeekWire: Ben Gilbert shifts focus to Acquired](https://www.geekwire.com/2023/acquired-co-host-ben-gilbert-shifting-roles-at-pioneer-square-labs-to-focus-on-popular-podcast/)
- [Cal Newport: How the Acquired podcast became a sensation](https://calnewport.com/how-the-acquired-podcast-became-a-sensation/)
- [Acquired media kit](https://acquired.fm/press)
- [Dissecting Acquired](https://thepodcastlife.beehiiv.com/p/dissecting-acquired)
- [Acquired: The Playbook, lessons from 200 company stories](https://audioscrape.com/podcast/acquired/episode/the-playbook-lessons-from-200-company-stories)
- [Coffeezilla (Wikipedia)](https://en.wikipedia.org/wiki/Coffeezilla)
- [Yespress profile of Coffeezilla](https://yespress.io/coffeezilla)
- [Lex Fridman #345 with Coffeezilla](https://lexfridman.com/coffeezilla/)
- [Arkham: how to be a blockchain investigator](https://info.arkm.com/research/online-sleuth-how-to-be-a-blockchain-and-crypto-investigator)
- [Nieman Lab on Vox Borders crowdsourcing](https://www.niemanlab.org/?p=162382)
- [journalism.co.uk: Vox reporter uses social audiences](https://www.journalism.co.uk/news/how-a-vox-reporter-uses-social-audiences-to-inspire-his-latest-video-series/s2/a709068/)
- [Why the best journalists on YouTube are former Vox employees](https://thelongstory.substack.com/p/why-the-best-journalists-on-youtube)
- [How Johnny Harris makes maps](https://aescripts.com/learn/how-johnny-harris-makes-maps/)
- [Is Kurzgesagt reliable? (factually.co)](https://factually.co/fact-checks/media/is-kurzgesagt-reliable-5abc91)
- [Kurzgesagt (Wikipedia)](https://www.Wikipedia.org/wiki/Kurzgesagt)
- [YouTube Favorites: Patrick Boyle on Finance](https://henry.precheur.org/youtube/1/)
- [Honest finance YouTube channels (Substack)](https://smartidiot.substack.com/p/top-honest-and-engaging-youtube-channels)
- [A studied contention (on Modern MBA)](https://internetstuff.substack.com/p/a-studied-contention)
- [Modern MBA on Patreon](https://www.patreon.com/modernmba/about)
- [Plugged In review of Fern](https://www.pluggedin.com/youtube-reviews/fern/)
- [YouTube documentary channels TV producers should know](https://businessoftv.substack.com/p/youtube-documentary-channels-tv-producers)
- [Faceless business documentary channels: format teardown (OutlierKit)](https://outlierkit.com/resources/faceless-business-documentary-channels/)
- [Finding and searching SEC filings (Business Journalism)](https://businessjournalism.org/?p=69262)
- [EBU: Advanced Wayback Machine and archival OSINT](https://spotlight.ebu.ch/p/advanced-wayback-machine-and-archival)
- [How journalists use the Wayback Machine to find deleted content (Bushe)](https://bushe.co/blog/how-journalists-use-wayback-machine-to-find-deleted-content/)
- [Internet Archive: 9 ways web archives are used in investigations](https://blog.archive.org/2026/02/02/follow-the-changes/)
- [Matt Rickard: But / Therefore](https://cdn.matt-rickard.com/but-therefore)
- [No Film School: use "therefore" and "but" instead of "and then"](https://nofilmschool.com/2015/04/tony-zhou-storytelling-video-essay-f-fake-therefore-but-and-then)
