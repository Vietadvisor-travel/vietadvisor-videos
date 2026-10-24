# Giọng đọc tự nhiên (Google) · cài một lần

Giọng Kokoro hiện tại là mô hình nhỏ chạy offline nên nghe vẫn "máy". Máy làm phim không tải được mô hình giọng mở
lớn hơn (mạng chặn HuggingFace), nhưng gọi được API giọng của Google. Có 2 loại, dùng chung một khoá:
- **Gemini TTS**: đọc theo chỉ dẫn bằng lời ("buồn, chậm, trầm"), nên các thẻ cảm xúc {sad} {grave} {wry} đổi thật
  cách đọc. Tự nhiên nhất.
- **Chirp 3 HD** (Cloud Text-to-Speech): rất tự nhiên, ổn định, nhưng ít điều khiển cảm xúc hơn.

Chi phí ước tính: dưới khoảng 1 USD cho một tập 10 phút. Kiểm tra lại giá hiện tại trên trang của Google trước khi dùng.

## Các bước (anh làm, khoảng 5 phút)
1. Vào https://aistudio.google.com/apikey → **Create API key** → chọn đúng project Google Cloud đang dùng cho Drive.
   (Muốn dùng thêm Chirp 3 HD: trong console.cloud.google.com của project đó, bật **Cloud Text-to-Speech API**.)
2. Giới hạn khoá: trong console → APIs & Services → Credentials → bấm vào khoá → API restrictions → chỉ chọn
   **Generative Language API** (và **Cloud Text-to-Speech API** nếu bật).
3. Lưu khoá vào **cài đặt môi trường** của Claude Code (giống các biến GDRIVE_*), tên biến: `GOOGLE_TTS_API_KEY`.
   Không dán khoá vào chat.
4. Mở phiên mới (biến chỉ có ở phiên mở sau khi lưu), rồi nhắn: **"thử giọng"**.

## Khi anh nhắn "thử giọng"
Claude chạy:
```
cd studio && python3 tools/voice.py audition "<3 câu của tập gần nhất: mở đầu, đoạn buồn, câu kết>" out/voice_test \
  --casts "am_michael*.7+bm_george*.3,gemini:Charon,gemini:Orus,gemini:Algenib,gemini:Iapetus,google:en-US-Chirp3-HD-Charon"
```
rồi gửi anh các file để nghe và chọn. Giọng anh chọn ghi vào header của story: `voice: gemini:Charon`. Lời trích dẫn
vẫn có giọng riêng: `voices: ruja=gemini:Kore`.
