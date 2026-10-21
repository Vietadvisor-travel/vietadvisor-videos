# HƯỚNG DẪN POISON PILL v6: làm một lần, rồi mỗi ngày 2 bước

## A. CÀI ĐẶT (chỉ làm 1 lần)

**1. Claude (claude.ai)**
- Vào Project "Poison Pill" → Instructions → xóa nội dung cũ → dán toàn bộ file `PROJECT_INSTRUCTIONS.md`.
- Bật skill `poison-pill-studio` bản mới: tải `POISON_PILL_v6.zip` lên phần Skills, thay bản cũ.

**2. Muse**
- Gửi cho Muse file `POISON_PILL_v6.zip` và file `MUSE_STANDING.md`, kèm câu:
  > Đây là hướng dẫn thường trực và bộ skill v6. Cài theo engine-addon/INSTALL.md (mục nâng cấp từ v5.x), chạy `python3 tools/voice.py setup`, rồi chạy `node tools/pp_doctor.mjs` đến khi ALL PASS. Sau đó chạy thử `python3 tools/pp_find.py search "Theranos headquarters" --kind place` và `node tools/make.mjs stories/voice_demo.story --fmt 16x9 --jobs 2`. Gửi lại cho anh kết quả cả 3 lệnh và video demo.
- Nếu `pp_find` báo lỗi, chuyển nguyên văn lỗi cho Claude Code (phiên này) để sửa.

**3. Thư viện nhạc** (một lần, nếu Muse chưa làm): nói với Muse:
  > Dựng thư viện nhạc theo references/music.md: mỗi mood ít nhất 3 bản nhạc không lời từ nguồn an toàn, giữ giấy phép.

## B. MỖI TUẦN 1 LẦN: nghiên cứu (Muse)
1. Nói với Muse:
   > nghiên cứu tuần: ngày 8 → 14 trong lịch (hoặc ghi thẳng 7 chủ đề)
2. Muse trả về 7 file `RESEARCH_<tên-chủ-đề>.md`.
3. Tải 7 file đó lên Project "Poison Pill" của Claude (phần Files).

## C. MỖI NGÀY: 2 bước
**Bước 1, Claude:** mở một chat mới trong Project và gửi:
```
gói đạo diễn: ngày 8

<dán khối HISTORY ở cuối báo cáo hôm trước của Muse; tập đầu tiên thì bỏ qua>
```
Claude trả về file `EPISODE_08_<tên>.md`. Nếu dài, Claude chia thành PART 1/3, 2/3…; anh gõ "tiếp" cho đến hết.
Tải về.

**Bước 2, Muse:** gửi file `EPISODE_08_<tên>.md` (đủ các PART) cho Muse, kèm câu:
> Dựng tập này.

Muse làm toàn bộ: kiểm tra sự thật, tự tìm ảnh thật, tạo ảnh AI cho chỗ thiếu, đọc giọng, dựng, render, chấm điểm.
Muse gửi lại:
- video 16:9 và 10 ảnh tĩnh;
- thumbnail, 3 tiêu đề, phần mô tả;
- bảng kiểm tra sự thật và điểm chấm;
- **khối HISTORY ở cuối:** giữ lại để dán cho Claude ngày mai.

## D. KHI MUỐN CHỈNH (không bắt buộc)
- Muốn Claude duyệt trước khi render: gửi Claude các ảnh xem trước từng cảnh (`pp_sheet`) mà Muse gửi, kèm chữ "duyệt". Claude trả về 6 chỗ cần sửa; anh dán cho Muse.
- Video xong mà không ưng: gửi Claude 3–5 ảnh chụp chỗ không ưng, kèm một câu anh thấy sai ở đâu. Claude viết lệnh sửa; anh dán cho Muse.
- Hết lịch 30 ngày: nói với Muse "nghiên cứu chủ đề tháng", gửi file kết quả cho Claude kèm câu "lịch 30 ngày".
- Sau khi đăng (mỗi tuần): bảo Muse cập nhật lượt xem, CTR và thời gian xem vào `nhat-ky.md`. Claude đọc file này để viết các tập sau tốt hơn.

## E. LƯU Ý
- Muse KHÔNG được sửa câu, cảnh, thứ tự trong gói đạo diễn; chỉ sửa lỗi cú pháp và số liệu sai (có ghi lại).
- Tập có giọng đọc trích lời người thật hoặc ảnh AI trông như thật: khi đăng YouTube nhớ tích ô "altered or synthetic content".
- Máy Muse bị khởi động lại giữa chừng: bảo Muse chạy lại đúng lệnh cũ kèm `--resume`; phần đã render được giữ lại.
