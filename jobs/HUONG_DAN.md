# HƯỚNG DẪN POISON PILL v6

## CÀI ĐẶT (1 lần)
1. **Claude:** vào Project "Poison Pill" → Instructions → xóa nội dung cũ → dán file `PROJECT_INSTRUCTIONS.md`.
   Thay skill cũ bằng `POISON_PILL_v6.zip`.
2. **Muse:** gửi `POISON_PILL_v6.zip` + `MUSE_STANDING.md`, kèm câu:
   > Đây là hướng dẫn thường trực và skill v6. Cài theo engine-addon/INSTALL.md, chạy `python3 tools/voice.py setup` rồi `node tools/pp_doctor.mjs` đến khi ALL PASS. Báo lại cho anh.

## MỖI TẬP: 3 bước

**Bước 1. Gửi Muse:**
```
nghiên cứu tập 3
```
(hoặc ghi thẳng tên chủ đề: `nghiên cứu: Nokia`)
→ Muse gửi lại 1 file `RESEARCH_….md`.

*Muốn dùng "tập 3" thì làm 1 lần trước: bảo Claude "lịch 30 ngày", rồi gửi file `lich-30-ngay.md` cho Muse kèm câu "đây là lịch 30 ngày, giữ lại".*

**Bước 2. Gửi Claude** (chat mới trong Project): đính kèm file đó, gõ:
```
gói đạo diễn
```
→ Claude gửi lại file `EPISODE_xx_theranos.md`. Nếu Claude chia thành nhiều phần, anh gõ "tiếp" cho đến hết.

**Bước 3. Gửi Muse:** đính kèm file `EPISODE_…`, gõ:
```
dựng tập này
```
→ Muse gửi lại video, thumbnail, tiêu đề và phần mô tả.

Xong. Tập sau làm lại từ bước 1.
