# BRIEF KÊNH MỚI: THE IF MACHINE (sếp chốt 03/11/2026)

Brief này là căn cứ duy nhất cho kênh mới. Claude Code đọc brief này là hiểu toàn bộ, không cần hỏi lại sếp những gì đã ghi ở đây.

## 1. Kênh này là gì

- Kênh mới, tách riêng khỏi Poison Pill. Poison Pill giữ nguyên lịch và phong cách, brief này không sửa gì của Poison Pill.
- Tên: The If Machine. Handle gợi ý: @theifmachine (chốt lúc tạo kênh; tên hiển thị được trùng, handle thì không).
- Lời hứa: Một câu hỏi không tưởng. Một đáp án bất ngờ.
- Khán giả: người lớn tò mò, tiếng Anh, chủ yếu US/UK/CA/AU.
- Dạng: giải trí, kiến thức hay ho, giả định. Không lộ mặt, sếp không lên hình, không lên tiếng công khai dưới bất kỳ hình thức nào. Chỉ dùng giọng AI.

## 2. Chuẩn sản phẩm

- Video dài: 16:9, 5-6 phút, hoạt hình canvas (mục 3).
- Bản dọc: 60-90 giây, 9:16, cắt từ video dài, hook riêng, caption riêng, không dính watermark của app khác.
- Ảnh cover: 1 frame tĩnh mỗi video (làm cover Instagram và nền thumbnail). Sếp tự làm thumbnail YouTube cuối cùng; Claude không giao thumbnail trong gói.
- Phụ đề: file .srt tiếng Anh cho mỗi video dài.
- File .story lưu kèm mỗi video (yêu cầu của engine).
- Cấu trúc: hook trong 3 giây đầu; một câu hỏi, một đáp án twist; kết bằng end frame thương hiệu.
- Luật hình ảnh (theo engine canvas Vietadvisor): hình chính mỗi beat phải vẽ đúng CHỦ THỂ của câu thoại đó; talking head tối đa 35% số beat, không hai beat liên tiếp; phụ đề nhỏ, cố định vùng dưới.
- Sự thật: claim nào hành động được thì verify từ nguồn thật, claim nặng ký cần 2 nguồn. Không bịa số. Không dùng ảnh AI về người thật, tài liệu thật, logo, headline giả làm bằng chứng. Hoạt hình là minh họa, không bao giờ giả làm tư liệu.
- Giọng đọc: chỉ dùng bộ giọng đã duyệt trong jobs/VOICE_MODELS.md (Kokoro, Chatterbox Turbo, Supertonic 3). Dùng Supertonic 3 thì mô tả video khi đăng phải ghi rõ âm thanh tạo bởi máy (yêu cầu licence OpenRAIL-M). Giọng Kitten đã bị thu hồi, cấm dùng.

## 3. Engine sản xuất (quan trọng: KHÔNG phải engine Poison Pill)

- Sản xuất dùng engine hoạt hình CANVAS của studio Vietadvisor cũ (skill local-vietadvisor-motion-studio), KHÔNG dùng engine điện ảnh footage thật của Poison Pill.
- Engine này render bản YouTube 16:9 (tối đa 10 phút) và bản dọc 9:16 (tối đa 3 phút). Mục tiêu của mình (dài 5-6 phút, dọc 60-90 giây) nằm trong giới hạn.
- Cổng chất lượng của engine đó: lint bằng node tools/lint.mjs, review bằng node tools/review.mjs đạt 85+, QA từng giây bằng python3 tools/qa.py ít nhất 2 vòng. Không nén ép dưới 30 MB.
- Nếu không chạy được engine canvas từ repo này thì báo thẳng và dừng, không tự ý chuyển sang engine Poison Pill.

## 4. Phân công (lệnh của sếp)

- Muse (bàn nghiên cứu): làm gói nghiên cứu nhẹ mỗi tập (mục 5), rồi lấy video hoàn chỉnh đi đăng mọi nền tảng sau khi sếp duyệt. Muse không viết kịch bản, không render.
- Claude Code (repo này): làm toàn bộ sản xuất: kịch bản, storyboard, cảnh, giọng đọc, render, critic. Claude không đăng gì lên đâu cả.
- Sếp: chỉ duyệt. Sếp duyệt video hoàn chỉnh (và tự làm thumbnail YouTube). Chưa có duyệt thì không đăng.

## 5. Gói nghiên cứu nhẹ (Muse giao, Claude đọc)

- Vị trí: jobs/the-if-machine/research/<topic-slug>.md, commit lên git.
- Mỗi tập gồm: một câu hỏi; một twist bất ngờ; khoảng 10 fact đã verify kèm nguồn; list beat canvas (mỗi beat vẽ cái gì); 3 option tiêu đề; hook bản dài; hook bản dọc.
- KHÔNG yêu cầu: không worksheet 40 fact, không săn clip, không săn ảnh, không săn tài liệu. Canvas vẽ hết.
- Chấm chủ đề theo thang cũ của engine Vietadvisor: tò mò/click 40, vẽ được bằng canvas 20, khoảng trống so với kênh lớn 20, rẻ và verify được 20. Chỉ làm chủ đề từ 70 điểm trở lên.
- Tỉ lệ bank: khoảng 60% evergreen what-if/kiến thức, 30% trend/mốc tin, 10% thử nghiệm.
- Mỗi tuần Muse làm mới bank 10-15 chủ đề đã chấm; nhịp 3 video/tuần.
- Tránh: chủ đề kênh lớn đã có video trên 10 triệu view (trừ khi góc khác hẳn); chủ đề bắt buộc phải có footage thật; chủ đề nhạy cảm (chính trị, thảm kịch, tư vấn y tế).

## 6. Bank khởi động (10 chủ đề, sếp duyệt 03/11/2026)

Điểm theo thang tò mò / vẽ canvas / khoảng trống / rẻ và verify được.

1. ai-runs-a-country (AI điều hành một quốc gia trong 1 năm thì sao?): 87 (37/17/16/17), trend.
2. internet-shutdown-24h (Internet tắt toàn cầu 24 giờ thì sao?): 86 (36/17/15/18), trend.
3. money-disappears (Tiền biến mất, mọi thứ miễn phí thì sao?): 83 (35/17/13/18), evergreen.
4. phone-battery-never-dies (Điện thoại không bao giờ hết pin thì sao?): 83 (32/16/16/19), evergreen.
5. humans-never-sleep (Con người không bao giờ ngủ thì sao?): 82 (34/16/14/18), evergreen.
6. time-freezes-except-you (Thời gian đóng băng với mọi người trừ bạn, trong 1 năm?): 82 (38/18/9/17), lưu ý kênh Curiosity Hub vừa làm bản 24 giờ nên bản 1 năm này phải khác hẳn.
7. why-say-cheese (Vì sao chụp ảnh lại nói "cheese"?): 81 (30/15/17/19), kiến thức đời thường.
8. living-on-mars-one-year (Sống trên sao Hỏa 1 năm thì sao?): 81 (34/18/13/16), trend.
9. earth-two-suns (Trái đất có 2 mặt trời thì sao?): 80 (33/19/11/17), evergreen.
10. dinosaurs-survive (Khủng long không tuyệt chủng thì sao?): 78 (35/18/8/17), evergreen nhưng kênh lớn làm nhiều rồi nên điểm khoảng trống thấp.

Tập đầu tiên mặc định là chủ đề điểm cao nhất (ai-runs-a-country, 87 điểm) trừ khi sếp chỉ đích danh chủ đề khác.

## 7. Hợp đồng bàn giao (Claude giao cho Muse)

- Upload file hoàn chỉnh bằng pp_drive.py vào thư mục Drive the-if-machine/ (chưa có thì tạo): MP4 dài, MP4 dọc, ảnh cover, .srt, .story.
- Commit note bàn giao jobs/the-if-machine/DELIVERY_<topic-slug>.md ghi: tên file, Drive file ID, thời lượng, độ phân giải, giọng đọc đã dùng, ghi chú trung thực (ví dụ hình minh họa thay thế).
- Cấm commit file video hoặc zip lên git. Chỉ commit note bàn giao và gói nghiên cứu.
- Sau bàn giao, Muse đi đăng; Claude không đăng.

## 8. Ma trận đăng (Muse chạy sau khi sếp duyệt)

- Bản dài 16:9: YouTube (qua connector YouTube Data API tự build, sếp bấm OAuth một lần) + Facebook Page (facebook-cli, đăng MP4 hoặc tạo draft).
- Bản dọc 60-90 giây: Instagram Reels (connector đã nối), TikTok (giai đoạn đầu dùng chế độ draft hoặc trình duyệt; app tự build không có đường auto-post trực tiếp), Facebook Reels.
- Caption, hook, nhạc viết riêng từng nền tảng; không copy y nguyên một caption khắp nơi; không đăng file dính watermark app khác.
- Chặn hiện tại, không tìm cách lách: chân Facebook chờ sếp báo tài khoản ổn lại (cảnh báo bảo mật 06/10/2026, login lưu sẵn chết 01/11/2026); TikTok không có đường auto-post thực tế cho app tự build.

## 9. Tài khoản (sếp tạo, hiện chưa có cái nào)

Kênh YouTube mới, Page Facebook mới, tài khoản Instagram mới, tài khoản TikTok mới. Một video một ngôn ngữ; sau này muốn bản tiếng Việt thì làm video riêng trên Page riêng, không gắn track tiếng thứ hai.

## 10. Tiêu chí 10 tập đầu

Median view vượt median 3 tập đầu của Poison Pill; CTR trong band 2-10% mà YouTube công bố; giữ chân 30 giây từ 50% trở lên; ít nhất 1 tập vượt tập tốt nhất hiện tại của Poison Pill.
Không đạt thì Muse báo và sếp quyết; Claude không tự đổi format.

## 11. Câu lệnh kích hoạt

Sếp kích hoạt kênh này trong chat cũ bằng đúng một câu:

"Từ nay làm thêm kênh mới The If Machine theo đúng brief trong jobs/THE_IF_MACHINE_BRIEF.md, mọi thứ theo brief đó trừ khi anh nói khác."

Kèm tên chủ đề nếu muốn chọn tập, không kèm thì lấy chủ đề điểm cao nhất còn chưa làm trong bank khởi động.
