# HƯỚNG DẪN CẤU HÌNH & LƯU TRỮ API CHO HỆ THỐNG MẶT TRẬN SỐ
> **Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hưng**  
> Tài liệu hướng dẫn cán bộ quản trị hệ thống cấu hình các khóa API (Application Programming Interface) và biến môi trường bảo mật.

---

## 📌 Tổng quan các API trong hệ thống

Dự án **Mặt trận số Phường Chánh Hưng** sử dụng 4 hệ thống dịch vụ chính:

| Dịch vụ | Chức năng | Nơi cấu hình | Cách lấy key |
| :--- | :--- | :--- | :--- |
| **Google Gemini AI** | Cung cấp trí tuệ nhân tạo cho Trợ lý AI (soạn thảo, thẩm định văn bản, tóm tắt phản ánh) | File `.env.local` (`GEMINI_API_KEY`) | Miễn phí từ Google AI Studio |
| **Facebook Graph API** | Tự động đồng bộ tin tức, bài viết từ Fanpage MTTQ lên trang chủ | Trang web `/quan-ly-facebook` hoặc `.env.local` | Facebook Developer Portal |
| **Google Sheets** | Tự động đồng bộ Lịch công tác tuần của Thường trực Mặt trận | File `.env.local` (`GOOGLE_SHEET_ID`) | Chia sẻ quyền từ Google Sheets |
| **Firebase Cloud** | Cơ sở dữ liệu lưu trữ phản ánh của người dân và tài khoản cán bộ | File `lib/firebase.ts` & `.env.local` | Firebase Console |

---

## 🚀 HƯỚNG DẪN CHI TIẾT TỪNG BƯỚC

### 1️⃣ Cấu hình Google Gemini AI API (Trợ lý ảo AI)

Trợ lý AI giúp cán bộ soạn nhanh báo cáo, kiểm tra lỗi chính tả và thể thức hành chính theo Nghị định 30/2020/NĐ-CP.

- **Bước 1**: Truy cập vào trang Google AI Studio:  
  👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Bước 2**: Đăng nhập bằng tài khoản Google (Gmail).
- **Bước 3**: Nhấn nút **Create API key** (hoặc **Create key in new project**).
- **Bước 4**: Sao chép chuỗi mã API Key (dạng `AIzaSy...`).
- **Bước 5**: Mở file `.env.local` trong thư mục dự án và dán vào:
  ```bash
  GEMINI_API_KEY=AIzaSy...điền_mã_vừa_copy_vào_đây...
  ```
- **Bước 6**: Khởi động lại server hoặc lưu file. Trợ lý AI sẽ hoạt động ngay lập tức!

---

### 2️⃣ Cấu hình Facebook Graph API (Tin tức Fanpage)

Hệ thống cho phép hiển thị trực tiếp bài đăng từ Fanpage MTTQ Phường Chánh Hưng.

#### Cách 1: Cấu hình nhanh trực tiếp trên giao diện (Khuyên dùng cho Cán bộ)
1. Truy cập vào Cổng điều hành cán bộ → chọn **[Quản lý Facebook](http://localhost:3000/quan-ly-facebook)**.
2. Nhập **Page ID**: `61580661372890` (ID Fanpage MTTQ Chánh Hưng).
3. Nhập **Access Token**:
   - Vào [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Chọn ứng dụng Facebook của bạn → Chọn quyền `pages_read_engagement`, `pages_show_list`, `pages_read_user_content`
   - Bấm **Generate Access Token** và dán vào ô nhập trên web.
4. Bấm **Lưu cấu hình**. Hệ thống sẽ tự lưu vào trình duyệt của cán bộ.

#### Cách 2: Cấu hình qua biến môi trường (.env.local)
Thêm vào file `.env.local`:
```bash
NEXT_PUBLIC_FB_PAGE_ID=61580661372890
NEXT_PUBLIC_FB_ACCESS_TOKEN=EAA...chuỗi_token_facebook...
```

---

### 3️⃣ Cấu hình Lịch công tác tuần (Google Sheets)

Lịch công tác được cập nhật tự động 5 phút/lần từ bảng tính Google Sheets của đơn vị mà không cần nhập thủ công lại trên web.

- **Bước 1**: Mở bảng tính Google Sheets lịch tuần của Mặt trận.
- **Bước 2**: Bấm nút **Chia sẻ (Share)** ở góc trên bên phải:
  - Mục *Quyền truy cập chung*: chọn **Bất kỳ ai có đường liên kết (Anyone with the link)**.
  - Vai trò: **Người xem (Viewer)**.
- **Bước 3**: Lấy ID từ thanh địa chỉ trình duyệt:
  - Link ví dụ: `https://docs.google.com/spreadsheets/d/1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM/edit`
  - Chuỗi nằm giữa `/d/` và `/edit` chính là **Sheet ID** (`1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM`).
- **Bước 4**: Điền vào `.env.local`:
  ```bash
  GOOGLE_SHEET_ID=1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM
  ```

---

### 4️⃣ Cấu hình Firebase Cloud (Cơ sở dữ liệu)

Hệ thống đã được tích hợp sẵn với dự án Firebase của Mặt trận (`mttq-5032d`). Nếu đơn vị muốn đổi sang dự án Firebase mới:
1. Vào [Firebase Console](https://console.firebase.google.com/).
2. Chọn dự án → **Project settings (Cài đặt dự án)** → cuộn xuống phần **Your apps**.
3. Sao chép các thông số và điền vào `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   ```

---

## 🔒 NGUYÊN TẮC BẢO MẬT QUAN TRỌNG

> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG ĐƯỢC ĐẨY FILE `.env.local` LÊN GITHUB HOẶC MẠNG XÃ HỘI!**
> 
> File `.env.local` chứa API Key và Access Token bí mật. Hệ thống đã tự động cấu hình `.gitignore` để bỏ qua file này khi chạy lệnh Git.
> 
> Khi đưa dự án lên server hosting (như Vercel, Netlify hoặc máy chủ riêng), hãy vào mục **Environment Variables** trong phần cài đặt của hosting để dán các giá trị này vào.

---

## 🛠️ Hướng dẫn sao lưu & phục hồi nhanh

Khi chuyển sang máy tính mới:
1. Clone dự án về máy: `git clone https://github.com/chidoankhupho23phuongchanhhung/MTTQ-CHANHHUNG.git`
2. Tạo file cấu hình từ file mẫu:
   ```bash
   cp .env.example .env.local
   ```
3. Mở file `.env.local` bằng TextEdit hoặc VS Code để điền các key của bạn.
4. Chạy `npm run dev` để khởi động hệ thống.
