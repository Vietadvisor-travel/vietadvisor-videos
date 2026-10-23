# VIDEO STOCK TRÊN GOOGLE DRIVE: cài đặt 1 lần (khoảng 15 phút)

**Vì sao:**
- Video stock có thể lên tới vài GB. Git không nên chứa (GitHub chặn file > 100 MB, và repo phình ra mỗi phiên).
- Từ v6.4, mọi file media lớn nằm trên Google Drive 2 TB của anh. Git chỉ giữ chữ và file nhỏ: nghiên cứu, kịch bản,
  thư viện hiệu ứng, và 1 file `jobs/_drive.json` ghi mã thư mục Drive.

**Cách hoạt động:**
```
Muse ──(tải lên bằng pp_drive.py put)──▶ Google Drive: PoisonPill_Media/
                                           ├─ _stock/stock_library_1.zip, _2.zip …   (kho stock dùng chung)
                                           ├─ <slug>/<slug>_clips_1.zip …              (footage riêng từng tập)
                                           └─ <slug>/<slug>_assets.zip                  (nếu > 90 MB)
Claude Code ──(đọc qua Drive API)──▶ chỉ đọc mục lục (vài KB mỗi zip) và chỉ kéo đúng những clip phim dùng
```
- Claude **không tải cả zip vài GB**. Thử nghiệm: một zip 300 MB chỉ tốn 2 KB để đọc mục lục và khoảng 1 MB để lấy
  1 clip.
- Muse tải lên được tiếp tục nếu đứt mạng giữa chừng, và tự bỏ qua file đã có trên Drive.

---

## Bước 1. Tạo "chìa khoá" Google (máy tính, trình duyệt)
1. Vào https://console.cloud.google.com, đăng nhập **đúng tài khoản Google có Drive 2 TB**.
2. Bấm chọn project ở thanh trên → **New project** → tên `poisonpill` → Create → chọn project vừa tạo.
3. Ô tìm kiếm → gõ **Google Drive API** → bấm vào → **Enable**.
4. Menu trái → **APIs & Services → OAuth consent screen** (bản mới gọi là **Google Auth Platform**):
   - User type: **External** → Create.
   - App name `poisonpill`; email hỗ trợ và email liên hệ: email của anh → Save.
   - Phần **Audience** (hoặc Test users): bấm **Publish app → Confirm** để chuyển sang **In production**.
   - **Bắt buộc:** nếu để chế độ "Testing", chìa khoá tự hết hạn sau 7 ngày.
5. Menu trái → **Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**;
   - **Authorized redirect URIs → Add URI:** `https://developers.google.com/oauthplayground`;
   - bấm Create, rồi chép lại **Client ID** và **Client secret** (để ở chỗ an toàn, ví dụ Ghi chú riêng).

## Bước 2. Lấy refresh token (cũng trên trình duyệt)
1. Vào https://developers.google.com/oauthplayground.
2. Bấm **bánh răng ⚙ góc phải trên** → tích **Use your own OAuth credentials** → dán Client ID và Client secret →
   Close.
3. Ô **"Input your own scopes"** ở cột trái, dán đúng dòng này:
   `https://www.googleapis.com/auth/drive.file`
   rồi bấm **Authorize APIs**.
4. Chọn tài khoản Drive 2 TB.
   - Nếu hiện "Google hasn't verified this app": bấm **Advanced → Go to poisonpill (unsafe)**. Đây là app của chính anh
     nên an toàn.
   - Sau đó bấm **Continue/Allow**.
5. Bấm **Exchange authorization code for tokens**, rồi chép **Refresh token** (chuỗi dài bắt đầu bằng `1//`).

**Vì sao an toàn:** quyền `drive.file` chỉ cho công cụ thấy **những file do chính nó tải lên**. Ảnh, tài liệu và mọi
thứ khác trong Drive của anh đều vô hình với nó. Thư mục vẫn riêng tư, không cần chia sẻ công khai.

## Bước 3. Cất 3 chìa khoá vào môi trường (KHÔNG dán vào khung chat)
Làm cho **cả 2 nơi**: môi trường của Claude Code (repo `vietadvisor-videos`) và môi trường của Muse.

| Tên biến | Giá trị |
|---|---|
| `GDRIVE_CLIENT_ID` | Client ID ở bước 1 |
| `GDRIVE_CLIENT_SECRET` | Client secret ở bước 1 |
| `GDRIVE_REFRESH_TOKEN` | Refresh token ở bước 2 |

- **Claude Code trên web:** bấm tên môi trường trên thanh tiêu đề phiên → **Edit** → mục biến môi trường (hoặc
  Network secrets nếu có) → thêm 3 dòng trên → Save.
- **Network access:** phải cho phép `www.googleapis.com` và `oauth2.googleapis.com`. Môi trường hiện tại đã vào được;
  nếu sau này bị chặn thì thêm 2 tên miền này vào Allowed domains.
- Phiên mới sẽ tự nhận biến; phiên đang mở thì không.

## Bước 4. Kiểm tra
- Lần tải lên đầu tiên của Muse sẽ **tự tạo thư mục `PoisonPill_Media`** trong My Drive của anh, rồi đẩy mã thư mục lên
  git (`jobs/_drive.json`).
- Sau đó mở phiên Claude Code mới và nhắn: `kiểm tra drive`. Claude chạy `python3 tools/pp_drive.py check` và báo lại
  những gì đang có.

## Lưu ý
- **Đừng tự kéo thả file vào `PoisonPill_Media` bằng tay:**
  - quyền `drive.file` không nhìn thấy file do anh tải thủ công;
  - mọi file phải đi qua `pp_drive.py put`, tức là để Muse làm.
  - Xoá hay xem trong Drive thì thoải mái.
- **Đừng đổi tên file trong thư mục:** Claude tìm theo tên (`stock_library_*.zip`, `<slug>_clips_*.zip`).
- Nếu lỡ lộ chìa khoá: vào https://myaccount.google.com/permissions → xoá quyền của `poisonpill` → làm lại bước 2.
