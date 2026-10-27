# PUBLISH: the YouTube kit for every episode (v6.2)

The film ships with **no burned-in captions** (`captions: off` in every act header). YouTube gets a clean subtitle file
instead, and the owner gets one upload guide he can follow click by click. Both are made by Claude at the end of every
episode, in the owner's language (Vietnamese) for the instructions and English for everything the viewer sees.

## 1. Files Claude delivers
| File | Where | Notes |
|---|---|---|
| `<slug>_16x9_FINAL.mp4` | sent to the owner (never committed) | name for upload: `PoisonPill_EP<nn>_<Slug>_FULL_16x9.mp4` (the keyword in the file name helps) |
| 10 stills (JPG) | sent | the owner makes the thumbnail himself (Oct 2026): send strong frames, never a thumbnail |
| `<slug>_FULL.srt` | sent + `jobs/<slug>/` | `python3 tools/pp_publish.py <slug>` |
| `UPLOAD_GUIDE_<slug>.txt` | sent + `jobs/<slug>/` | the template in §3, every field filled |
| 10 stills | sent | one per act + the 3 reveals |

`pp_publish.py <slug>` joins the per-act `.srt` files with the real act lengths as offsets and re-cuts every cue the way
YouTube reads best: ≤ 42 characters a line, ≤ 2 lines, ≤ 6.5 s a cue, split at punctuation, never mid-word, zero-width
characters and stage marks removed. It also writes `out/<slug>_publish_facts.json`: act start times for the chapters,
total length, music credits, footage and image credits, AI images, quote voices, and CC BY items with no author name.
**A CC BY item without an author name blocks the upload.** Ask Muse for the author before delivering.

## 2. SEO rules (what actually moves search and suggested traffic)
- **Title:**
  - ≤ 60 characters, with the primary keyword in the first 3–5 words.
  - One curiosity gap, and no clickbait the film doesn't pay off.
  - Write 3 options; the guide picks number 1 and keeps the other 2 for "Test & compare" on the thumbnail, or a
    title change after 48 h if CTR is under 4 %.
- **Description:**
  - The first 2 lines (≈ 150 characters, the part shown in search) hold the primary keyword plus the hook.
  - Then a 2–3 line summary with 2 secondary keywords, written as plain sentences, never a keyword list.
  - Then chapters, then sources, then credits, then the disclosure line. No links in the first 2 lines.
- **Chapters:**
  - Start at 0:00, at least 3 chapters, each ≥ 10 s.
  - Use the act starts from `publish_facts.json`, and put a keyword in 2–3 chapter titles ("Theranos investors: …").
- **Tags:**
  - 12–18 tags, ≤ 450 characters in total.
  - Order: the exact primary keyword, the people's names, the event/scandal names, broad topics, then the channel name.
- **Hashtags:** exactly 3 at the end of the description (the first 3 show above the title): `#<Primary> #<Person> #BusinessDocumentary`.
- **Subtitles:**
  - Upload the `.srt` as English (manual captions are indexed; auto-captions are not).
  - Never burn captions into the picture.
- **Language:** video language, title and description language all English.
- **Category:** Education.
- **Pinned comment:** one question the viewer can answer in a sentence, pinned within the first hour.
- **Playlist:** "Business Case Studies", plus a second themed playlist when one exists ("Crypto Collapses", "Silicon Valley Frauds").
- **End screen** (last 20 s):
  - "Best for viewer" plus Subscribe;
  - a "Most recent upload" element only when the newest video is a better match than YouTube's choice.
- **Cards:** 1–2 cards to the most related earlier episode, at the midpoint twist (the timestamp is in the guide).

## 3. UPLOAD_GUIDE_<slug>.txt (template; Claude fills every <…>)
```
HƯỚNG DẪN ĐĂNG TẬP <nn> · <SLUG IN CAPS>: <short name> · POISON PILL
Video: PoisonPill_EP<nn>_<Slug>_FULL_16x9.mp4 (<m:ss>)
Thumbnail: anh tự làm (10 ảnh tĩnh từ phim đã gửi kèm)
Phụ đề: <slug>_FULL.srt
Lịch đăng gợi ý: <date> <time> giờ Việt Nam (= <time> ET, khung giờ khán giả Mỹ/Anh xem nhiều nhất)

=== 1. TIÊU ĐỀ (dùng số 1) ===
1. <title 1>   ← dùng
2. <title 2>
3. <title 3>
(Sau 48 giờ nếu CTR < 4 %: đổi sang tiêu đề 2.)

=== 2. MÔ TẢ (copy nguyên khối) ===
<2 lines with the keyword and the hook>

<2–3 line summary>

<chapters, one per line, from 0:00>

Sources: <primary sources, short>
<legal line, when the subject is charged but not convicted>

Footage: <every clip with author and licence>
Photos: <every photo with author and licence>
Music: <every track, "Title by Artist (source)", licence + link>
Some illustrations of places and objects are AI-generated and are not archival images.
<if the narrator is Supertonic (voice: supertonic:…): The narration is an AI-generated (synthetic) voice. ← REQUIRED by the Supertonic OpenRAIL-M licence, never omit>
<if quote voices: Quoted lines are real words from <source>, read by a synthetic voice.>

#<Primary> #<Person> #BusinessDocumentary

=== 3. THẺ (dán vào ô Tags) ===
<tags, comma separated, ≤ 450 characters>

=== 4. CÁC Ô TRONG YOUTUBE STUDIO ===
- Thumbnail: tải thumbnail anh tự làm. Nếu có nhiều bản, bật "Test & compare".
- Audience: "No, it's not made for kids".
- Language: Video language = English; Title and description language = English.
- Subtitles: Subtitles → Add language → English → Upload file → "With timing" → <slug>_FULL.srt → Publish.
- Category: Education.
- Playlist: <playlist(s)>.
- License: Standard YouTube License. Allow embedding: bật. Publish to subscriptions feed: bật.
- Comments: Allow all comments (tắt "hold potentially inappropriate" nếu nó giữ quá nhiều bình luận). Sort by: Top.
- Altered or synthetic content: <Yes/No + one-line reason — see §4>.
- Paid promotion: không tích.

=== 5. END SCREEN VÀ CARDS ===
- End screen (từ <m:ss> đến hết): "Best for viewer" + nút Subscribe.
- Card 1 tại <m:ss> (<moment>): trỏ về <earlier episode>.
- Sau khi đăng: quay lại <earlier episode>, thêm card trỏ sang tập này tại <m:ss>.

=== 6. CHẾ ĐỘ HIỂN THỊ ===
<Public now | Schedule <date time>>

=== 7. PINNED COMMENT (dán rồi ghim) ===
<one question>

=== 8. 48 GIỜ ĐẦU ===
- Trả lời 10 bình luận đầu tiên trong 2 giờ đầu (tín hiệu tương tác mạnh nhất).
- Không chia sẻ link vào group spam; chia sẻ thật ở 1–2 cộng đồng đúng chủ đề (subreddit, forum) nếu luật cho phép.
- Sau 48 giờ, ghi vào jobs/nhat-ky.md: CTR, Average view duration, % viewed, nguồn traffic chính.
- Ngưỡng: CTR < 4 % → đổi tiêu đề 2 hoặc để Test & compare chạy xong; retention phút 1 < 55 % → báo Claude để sửa hook tập sau.
```

## 4. "Altered or synthetic content": decide, don't guess
YouTube requires "Yes" when realistic content could be mistaken for real people, places or events:
- **Yes** if the film has a quote voice reading a real person's words (`@speaker:` lines), or photorealistic AI
  illustrations of a real event or place (a woman in a red gown on a stage that stands for a real night).
- **No** only when the AI material is clearly stylised (drawn, diagrammatic, abstract) and the narrator is the only
  voice. A synthetic narrator alone does not require Yes.

Write the reason in the guide on one line.

## 5. Checklist before Claude says "delivered"
- [ ] `captions: off` in every act; no text in the bottom 12 % of the frame (player controls and YouTube's captions live there).
- [ ] `pp_publish.py` ran; the SRT opens in a player and lines up at 0:00, at the middle and at the last cue.
- [ ] Every chapter title ≤ 40 characters; 0:00 present; ≥ 3 chapters.
- [ ] Title ≤ 60 characters with the keyword up front; description lines 1–2 hold keyword plus hook.
- [ ] Every CC BY item credited with author + licence; music credits copied exactly (CC BY 4.0 wording + link).
- [ ] Altered-content decision written with its reason.
- [ ] Guide and SRT in `jobs/<slug>/` and committed; no thumbnail (the owner makes it); MP4 sent, never committed.
