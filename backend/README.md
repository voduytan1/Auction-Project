# 🚀 Hướng dẫn cài đặt và chạy dự án

## 📋 Mục lục
1. [Clone dự án](#1️⃣-clone-dự-án)
2. [Tạo file .env](#2️⃣-tạo-file-env)
3. [Build các container](#3️⃣-build-các-container)
4. [Kiểm tra dịch vụ](#4️⃣-kiểm-tra-dịch-vụ)
5. [Cấu hình biến môi trường](#5️⃣-cấu-hình-biến-môi-trường)

---

## 1️⃣ Clone dự án

```bash
git clone https://github.com/voduytan1/Auction-Project.git
cd backend
```

---

## 2️⃣ Tạo file `.env`

```bash
cp .env.example .env
```

---

## 3️⃣ Build các container

```bash
docker compose up -d
```

> ⏳ **Lưu ý:** Lần chạy đầu tiên mất khá nhiều thời gian để Elasticsearch khởi động và script thiết lập user.

---

## 4️⃣ Kiểm tra dịch vụ

### 🔍 Elasticsearch
Mở trình duyệt tại:
```
http://localhost:9200
```

### 📊 Kibana
Mở trình duyệt tại:
```
http://localhost:5601
```

**Thông tin đăng nhập:**
- **Username:** `kibana_system`
- **Password:** (giá trị trong file `.env`)

### 📝 Logstash
Logstash tự động authenticate với Elasticsearch bằng user: `logstash_system`

---

## 5️⃣ Cấu hình biến môi trường

### ☁️ Cloudinary (Upload ảnh)

**Truy cập:** https://console.cloudinary.com/app/

1. Đăng nhập vào tài khoản Cloudinary
2. Copy **Cloud name** → Paste vào biến `CLOUD_NAME`
3. Chọn **Go to API Keys**
4. Chọn **Generate New API Key** (nếu chưa có)
5. Copy **API Key** → Paste vào biến `CLOUD_API_KEY`
6. Copy **API Secret** → Paste vào biến `CLOUD_API_SECRET`

---

### 📧 Email (Gửi email)

**Truy cập:** https://myaccount.google.com/apppasswords

1. Đăng nhập vào Gmail dùng để gửi email
2. Ở ô **tên ứng dụng** có thể để bất kỳ
3. Nhấn **Tiếp tục** → Nhận được mật khẩu gồm **16 ký tự**
4. Copy mật khẩu (không lấy khoảng trắng) → Paste vào biến `MAIL_APP_PASSWORD`
5. Nhập email vừa đăng nhập vào biến `MAIL_USERNAME`

---

### 🔐 reCAPTCHA (Bảo mật)

**Truy cập:** https://www.google.com/recaptcha/admin/create

1. **Label:** Điền bất kỳ
2. **reCAPTCHA type:** Chọn `v3`
3. **Domain:** Điền `localhost`
4. Copy **Secret key** → Paste vào biến `RECAPTCHA_SECRET`
5. Copy **Site key** → Paste vào env ở **frontend** (biến `VITE_RECAPTCHA_SITE_KEY`)

---

### 🔑 Google OAuth (Đăng nhập Google)

**Truy cập:** https://console.cloud.google.com

#### Bước 1: Tạo dự án
1. Đăng nhập vào tài khoản Google
2. Nhấn vào **danh sách dự án** (góc trên bên trái, giữa logo Google Cloud và thanh search)
3. Chọn **New Project** (Dự án mới)
4. Đặt tên dự án bất kỳ → Nhấn **Create**
5. Chờ dự án tạo xong → Nhấn **Select**

#### Bước 2: Cấu hình OAuth
1. Ở menu **Quick access** → Chọn **APIs & Services** → **OAuth consent screen**
2. Chọn **Get started**
3. **Bước 1:** Điền **App name** bất kỳ và chọn **user support email** là email của bạn
4. **Bước 2:** Chọn **External**
5. **Bước 3:** Chọn email liên lạc (nên chọn email đã điền ở bước 1)
6. Hoàn thành và nhấn **Create**

#### Bước 3: Tạo OAuth Client
1. Sau khi tạo xong → Nhấn nút **Create OAuth client**
2. **Application Type:** Chọn `Web application`
3. **Name:** Đặt tên bất kỳ
4. **Authorized JavaScript origins:** Nhấn **Add URI** và điền:
   ```
   http://localhost:5173
   ```
5. **Authorized redirect URIs:** Nhấn **Add URI** và điền:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
6. Nhấn **Create** và copy **Client ID**
7. Paste vào biến `GOOGLE_CLIENT_ID`

---

### 💳 Stripe (Thanh toán)

**Truy cập:** https://dashboard.stripe.com/

#### Bước 1: Lấy API Key
1. Đăng nhập vào Stripe
2. Ở góc bên trái chọn **API keys**
3. Copy **Secret key** → Paste vào biến `STRIPE_SECRET`

#### Bước 2: Cài đặt Stripe CLI
1. Truy cập: https://docs.stripe.com/stripe-cli/install
2. Tải và giải nén Stripe CLI
3. Mở **CMD** ở thư mục chứa `stripe.exe`
4. Chạy lệnh:
   ```bash
   stripe login
   ```
5. Hoàn thành xác thực

#### Bước 3: Cấu hình Webhook
1. **Khởi động backend** trước khi thực hiện bước này
```bash
mvn spring-boot:run
```
2. Ở CMD vừa login, chạy lệnh:
   ```bash
   stripe listen --forward-to localhost:8080/payment/webhook
   ```
3. Sau khi lệnh chạy → Nhận được **Webhook Key** (dạng `whsec_...`)
4. Copy key → Paste vào biến `WEBHOOK_SECRET`

> ⚠️ **Quan trọng:** Giữ cửa sổ CMD chạy. Nếu tắt, chức năng thanh toán Stripe sẽ không hoạt động.

---

## ✅ Hoàn tất

Setup env đã xong, có thể build và chạy backend!

```bash
mvn spring-boot:run
```

---

---
