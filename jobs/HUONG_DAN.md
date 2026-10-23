# HƯỚNG DẪN POISON PILL v6: Claude làm phim, Muse nghiên cứu và gom nguồn

**Muse:** nghiên cứu sâu, tìm thật nhiều video stock và tư liệu (60–150 clip mỗi tập), tìm ảnh thật, tạo ảnh AI cho chỗ thiếu, gom nhạc, rồi đóng gói và đẩy lên GitHub.
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
Muse làm xong sẽ báo slug (ví dụ `nokia`), số ảnh, số clip và 5 sự thật bất ngờ nhất.

**Câu 2, mở phiên Claude Code mới với repo `vietadvisor-videos`, nhắn:**
```
làm tập nokia
```
Claude tự làm hết, rồi gửi anh:
- video (không có chữ phụ đề trên hình);
- file phụ đề `.srt` để tải lên YouTube;
- thumbnail (kèm 1–2 bản thử nghiệm);
- file `UPLOAD_GUIDE_<slug>.txt`: hướng dẫn đăng từng ô trong YouTube Studio, tiêu đề, mô tả có chương và ghi công, tag, bình luận ghim, việc cần làm trong 48 giờ đầu.
Một tập 10 phút mất khoảng 1–2 tiếng, phần lớn là thời gian render. Anh không cần ngồi chờ.

## THƯ VIỆN VIDEO STOCK DÙNG CHUNG
Ngoài video riêng của từng tập, Muse dựng một kho video stock dùng chung cho cả kênh và bổ sung dần (mục "Shared stock library" trong `MUSE_STANDING.md`).
Để Muse bổ sung kho, nhắn: `bổ sung thư viện stock: <chủ đề, ví dụ: tiền mặt, sàn chứng khoán, sân bay>`.
Claude tự lấy clip trong kho khi làm tập mới, và tránh dùng lại clip đã xuất hiện trong 3 tập gần nhất.

## VIDEO STOCK NẰM TRÊN GOOGLE DRIVE (từ v6.4)
- Video stock và footage từng tập (có thể vài GB) không đưa lên git nữa. Muse tải lên Drive vào thư mục
  `PoisonPill_Media`, còn Claude đọc thẳng từ Drive và chỉ kéo đúng những clip phim dùng.
- **Cài 1 lần:** làm theo `jobs/DRIVE_SETUP.md` (khoảng 15 phút: tạo chìa khoá Google, rồi cất 3 biến `GDRIVE_*` vào
  môi trường của cả Claude Code lẫn Muse).
- **Gửi Muse:** file `jobs/MUSE_DRIVE.md`, kèm lời nhắn:
  > Từ giờ video stock và footage tải lên Google Drive theo file này, không đưa lên git nữa. Những gì em đã đào xong thì đóng gói và tải lên luôn theo mục 2 và 3, rồi báo anh.
- **Kiểm tra:** mở phiên Claude Code mới, nhắn `kiểm tra drive`.

## KHÁC (khi cần)
- **Lên lịch tháng:** nhắn Muse `nghiên cứu chủ đề tháng`, rồi nhắn Claude Code `lịch 30 ngày từ jobs/TOPICS_<tháng>.md`.
- **Muốn sửa video:** trong cùng phiên Claude Code, nhắn chỗ chưa ưng (kèm ảnh chụp càng tốt).
- **Khi đăng YouTube:** làm đúng theo file `UPLOAD_GUIDE_<slug>.txt` của tập đó (đã ghi sẵn có tích ô "altered or synthetic content" hay không, và lý do).
- **Khi đổi hướng dẫn thường trực cho Muse:** gửi lại file `MUSE_STANDING.md` mới cho Muse (bản v6.2 có phần đóng gói video stock).
