# HƯỚNG DẪN POISON PILL v6: Claude làm phim, Muse nghiên cứu và gom nguồn

**Muse:** nghiên cứu sâu, tìm ảnh thật, tạo ảnh AI cho chỗ thiếu, gom nhạc, rồi đóng gói và đẩy lên GitHub.
**Claude Code:** đạo diễn, viết kịch bản, dựng cảnh, đọc giọng, render, tự chấm điểm, rồi gửi video cho anh.

## CÀI ĐẶT (1 lần)
1. (Không cần làm gì với GitHub: nhánh mặc định của repo đã có sẵn bộ dựng phim.)
2. **Muse:** gửi file `MUSE_STANDING.md`, nhắn:
   > Đây là hướng dẫn thường trực mới của em. Làm phần "Setup, once", sau đó dựng thư viện nhạc theo mục "Music library" và đẩy lên. Báo lại cho anh.
3. **Claude Code:** không cần cài gì. Mỗi phiên mới tự đọc `CLAUDE.md` trong repo và tự cài.

## MỖI TẬP: 2 câu
**Câu 1, nhắn Muse:**
```
nghiên cứu và đóng gói: Nokia
```
Muse làm xong sẽ báo slug (ví dụ `nokia`), số ảnh và 5 sự thật bất ngờ nhất.

**Câu 2, mở phiên Claude Code mới với repo `vietadvisor-videos`, nhắn:**
```
làm tập nokia
```
Claude tự làm hết, rồi gửi anh video, thumbnail, 3 tiêu đề, phần mô tả kèm ghi công ảnh và nhạc, và tag SEO.
Một tập 10 phút mất khoảng 1–2 tiếng, phần lớn là thời gian render. Anh không cần ngồi chờ.

## KHÁC (khi cần)
- **Lên lịch tháng:** nhắn Muse `nghiên cứu chủ đề tháng`, rồi nhắn Claude Code `lịch 30 ngày từ jobs/TOPICS_<tháng>.md`.
- **Muốn sửa video:** trong cùng phiên Claude Code, nhắn chỗ chưa ưng (kèm ảnh chụp càng tốt).
- **Khi đăng YouTube:** nếu tập có giọng trích lời người thật hoặc ảnh AI trông như thật, nhớ tích ô "altered or synthetic content".
