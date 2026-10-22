# Vietadvisor Motion Studio — skill dựng video hoạt hình

Bộ skill hoàn chỉnh để dựng video hoạt hình 2D phong cách "OverSimplified" về du lịch Việt Nam cho
Vietadvisor: nhân vật, đồ vật, địa danh, bản đồ, UI, góc máy, chuyển động, chuyển cảnh, phụ đề.
Xuất được cả 16:9 (YouTube) và 9:16 (Reels / TikTok / Shorts) từ cùng một file kịch bản.

## Trong gói có gì

| Thư mục | Nội dung |
|---|---|
| `SKILL.md` | Quy trình đạo diễn + luật dựng (đọc đầu tiên — dành cho AI agent: Muse, Claude…) |
| `references/` | Brand rules · style bible · camera & motion · công thức cảnh · schema tập phim · danh mục asset · hướng dẫn Muse |
| `engine/` | Engine vẽ & dựng (JavaScript, Canvas 2D) |
| `stories/` | Storyboard mẫu (`ha-giang-loop.story`, `bun-cha.story`) |
| `episodes/` | Tập viết tay bằng JS: `ha-giang-loop.js`, `camera-reel.js`, `_template.js` |
| `engine/library/` | Asset tự thêm (ví dụ: night_market, banh_cuon, tour_guide) |
| `player.html` | Mở bằng Chrome: xem trước, đổi 16:9/9:16, xuất MP4 ngay trong trình duyệt — không cần cài gì |
| `tools/` | Render MP4 (Node), xuất asset PNG, xuất phụ đề SRT, build player |
| `assets/` | PNG nền trong suốt: 30 nhân vật (+ sheet biểu cảm), 88 props, 21 địa danh × (16:9, 9:16), brand |
| `reference_sheets/` | Ảnh tổng hợp để upload cho Muse làm tham chiếu style |
| `fonts/` | Baloo 2, Be Vietnam Pro, Kanit (SIL OFL — dùng thương mại miễn phí) |
| `demo/` | Video mẫu + cue sheet + SRT |

## Cách dùng nhanh

1. Chọn format theo nội dung (`references/directing.md`): explainer · countdown · myth · food · history · guide ·
   versus · story · night · quiz — mỗi format có cấu trúc, màu, chuyển cảnh, nhạc và giọng đọc riêng.
2. Viết storyboard (`stories/<tên>.story`, xem `references/storyboard.md`).
3. `node tools/lint.mjs stories/<tên>.story` → báo lỗi (cả vật thể lơ lửng, chữ đè mặt, trùng cấu trúc với video cũ)
   + 1 ảnh contact sheet (16:9 và 9:16).
4. `python3 tools/voice.py setup` (1 lần) rồi `node tools/make.mjs stories/<tên>.story` → MP4 16:9 + 9:16 có
   **giọng đọc tiếng Anh miễn phí (Kokoro)**, **nhạc nền tự sáng tác theo cảnh**, SFX, mix chuẩn −14 LUFS + file SRT.

Không cài gì: mở `player.html` bằng Chrome → nạp `.story` hoặc `.js` → xem → Export MP4.
Thêm asset mới: `references/asset-authoring.md` + `node tools/preview.mjs char|prop|place <id>`.
Dùng với Muse: `references/muse-guide.md`.

## Render bằng máy (Node 18+)

```bash
npm install                      # playwright + fonts
npx playwright install chromium  # nếu máy chưa có Chromium
node tools/render.mjs episodes/ha-giang-loop.js --fmt 16x9 --out out/hg_16x9.mp4
node tools/render.mjs episodes/ha-giang-loop.js --fmt 9x16 --out out/hg_9x16.mp4
node tools/render.mjs episodes/ha-giang-loop.js --cues out/hg_cues.json && python3 tools/srt.py out/hg_cues.json > out/hg.srt
node tools/export_assets.mjs assets   # xuất lại toàn bộ PNG sau khi thêm asset mới
```
Cần `ffmpeg` trong PATH. Nếu Chromium nằm chỗ khác, sửa `executablePath` trong `tools/*.mjs`
(hoặc xoá dòng đó để Playwright tự tìm).

## Điện ảnh, ảnh thật, nhân vật & bối cảnh không giới hạn
- **Ngôn ngữ điện ảnh tự động**: mỗi cảnh được cắt như phim (toàn cảnh → trung cảnh → cận cảnh, đối thoại góc-ngược-góc),
  hậu cảnh có chiều sâu (lens), xoá phông khi cận cảnh, ánh sáng theo giờ (đổ bóng + viền sáng), nhân vật diễn có đà
  (lấy đà, vượt, dội), quay đầu 3/4, nhép miệng theo giọng đọc thật, chuyển cảnh điện ảnh (vật tiền cảnh lướt qua, light leak,
  mực loang, cháy phim, xé giấy, bay xuyên vào chi tiết, glitch). Chi tiết: `references/film-language.md`.
- **Ảnh thật làm sticker**: `python3 tools/sticker.py make anh.jpg ten_id --credit "..." --license "..."` (tự xoá nền) →
  dùng `photo=ten_id`, cảnh `# collage` (dán ảnh kiểu Johnny Harris) hoặc `# photo` (ảnh full khung + nhân vật hoạt hình đứng trước).
- **Nhân vật & bối cảnh mới bằng 1 dòng**: `cast: ...` và `set: ...` trong storyboard — không bị giới hạn bởi thư viện có sẵn.

## Bản final (v5) — dọc 9:16 là mặc định
- `make.mjs` chỉ dựng bản dọc (thêm `--both` nếu cần 16:9). Contact sheet dọc to, dễ duyệt.
- **Film look**: mỗi khung hình qua 1 pass WebGL — bloom, quầng sáng ấm quanh đèn, chỉnh màu theo format, vân giấy, grain, vignette.
- **Thế giới sống**: người đi bộ & xe máy chạy ngang phía sau ở phố; mưa có giọt bắn, sương, cánh hoa; cảnh timelapse ngày→đêm;
  phố phối cảnh sâu (`kit=street3d`); ảnh thật → nền vẽ tay (`sticker.py plate` + `bgphoto=`); nhân vật quay lưng (`back=`).
- **Diễn xuất**: khẩu hình theo âm vị thật (M/B/P, F/V, A, E, O…) + gật đầu theo nhịp nói.
- **Âm thanh**: tiếng nền theo địa điểm (phố, chợ, quê, núi, đêm, sông, biển, mưa, trong nhà) vào trước hình 0,6 s như phim;
  nhạc có sáo trúc, đàn bầu, đàn tranh.

## Lưu ý
- Giọng đọc: Kokoro-82M (Apache-2.0), chạy offline, không tốn phí. Tên tiếng Việt được phiên âm cho giọng Anh
  trong `tools/pron_vi.json` — thêm từ mới vào đó. Nhạc: tổng hợp bằng code nên không vướng bản quyền;
  muốn dùng nhạc riêng: `music: duong/dan/track.mp3` (chỉ dùng nhạc có quyền sử dụng). Chi tiết: `references/audio.md`.
- Logo trong `assets/brand/` là bản dựng tạm (pin + ngôi sao + chữ). Thay bằng logo chính thức nếu có.
- Giá trong tập Hà Giang lấy từ guide công khai, kiểm tra tháng 10/2026. Cần kiểm lại trước khi đăng.

## Bản Director's Cut (v6) — đạo diễn như phim hoạt hình
- **13 khoảnh khắc đỉnh (`# moment kind=…`)**, mỗi cái có camera, ánh sáng, chiều sâu và âm thanh riêng: băng qua đường
  phố Hà Nội giữa dòng xe máy · lao từ bản đồ xuống điểm đến · xe máy leo đèo lúc hoàng hôn · bát ăn "hero shot"
  (rau rơi, bắn nước, khói bốc) · mưa rào ập xuống phố · thuyền chèo ra khỏi hang đá · thả hoa đăng trên sông đêm ·
  ruộng bậc thang chuyển xanh → vàng · bình minh · tàu chạy qua phố · pháo hoa Tết · cửa sổ xe giường nằm · chia đôi màn hình.
- **Tiền cảnh** `fg=` (lá, tre, đèn lồng, dây điện, khung cửa, hoa, đám đông, bokeh…) và **tia nắng** `rays=` cho mọi cảnh.
- **Camera mới**: crane, vertigo (dolly zoom), arc, whip, snap, breathe — kết hợp bằng `+`.
- **Diễn xuất**: thêm 38 hành động (ăn bằng đũa, chèo thuyền, selfie, mặc cả, thắp hương, thả đèn, ngã, giật mình…),
  chuỗi hành động `act="dave:walk:1>stop:.3>wave"`, nhân vật tự ra cử chỉ tay khi nói.
- **Biên kịch**: `references/script-craft.md` (9 cấu trúc truyện, kho hook, 8 kiểu gag, thoại, đường cảm xúc, kết) và
  `references/shot-recipes.md` (chuỗi cảnh dựng sẵn).
- **Vòng duyệt đạo diễn**: `node tools/review.mjs stories/<tên>.story` (~10 giây) dựng animatic, chấm điểm nhịp, cảnh chết,
  độ đơn điệu, đỉnh/đáy cảm xúc, cận cảnh, ánh sáng, chiều sâu → sửa tới khi ≥ 85 điểm rồi mới render.

- **Thiết kế nhân vật đổi theo từng video** (`charstyle:`): chibi · storybook (sách tranh) · flat (phẳng hiện đại) ·
  paper (giấy cắt) · ink (khắc gỗ/thuỷ mặc) · anime · toy (đồ chơi/đất sét) · noir · retro (hoạt hình 1930). Cùng một dàn
  nhân vật nhưng tỷ lệ, nét, mắt, màu và chất liệu khác hẳn. Mỗi format tự chọn sẵn một kiểu, có thể đổi riêng từng nhân vật.
