Đọc lại `jobs/MUSE_STANDING.md` (mục 2, 2a, 2b) và `jobs/STOCK_PLAN.md` vừa cập nhật v6.6 (git pull trước).

Từ nay mỗi tập:
- 100–200 clip footage thật và cụ thể (người, nơi, sự kiện có tên; stock đúng hành động trong truyện), mỗi nơi/sự kiện ≥ 3, mỗi hồi ≥ 15;
- 80–150 ảnh thật;
- 30–60 tài liệu / chụp màn hình thật: hồ sơ toà, thông cáo DOJ/cơ quan quản lý, web công ty đúng thời điểm qua archive.org,
  brochure, màn hình app, bài đăng có ngày, tít báo, poster truy nã (id `<slug>_doc_<what>`, desc ghi dòng quan trọng nằm ở đâu);
- 20–40 thành phần AI phụ (vật cắt nền, texture, khung thiết bị); cảnh AI nguyên tấm ≤ 10; không bao giờ AI người thật, tài liệu, logo.

Khi anh nhắn "bổ sung shotlist <slug>": mở `jobs/<slug>/SHOTLIST_<slug>.md`, tìm đúng từng dòng NEED, đóng gói
`<slug>_assets_2.zip` (git) + `<slug>_clips_2_*.zip` (Drive `<slug>/`), ghi FOUND <id> hoặc NONE <lý do> vào từng dòng, commit, push.

Việc kho chung: lấp các nhóm P3 mới trong STOCK_PLAN (crypto, scam, payment, investigation, escape, luxury, event, news, ui; 400 clip).
Mô tả mỗi clip P3 bắt đầu bằng ĐỘNG TỪ của hành động. Chạy `python3 tools/pp_stock.py coverage` để xem còn thiếu gì.
