# AuctionHub - Hệ thống đấu giá trực tuyến

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
  - [Clone dự án](#clone-dự-án)
  - [Database & Backend](#database--backend)
  - [Frontend](#frontend)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Tech Stack](#tech-stack)

---

## Giới thiệu

AuctionHub là hệ thống đấu giá trực tuyến với các tính năng chính:

- Đăng ký/đăng nhập với xác thực OTP qua email
- Đăng nhập bằng Google OAuth
- Đấu giá thủ công và đấu giá tự động (Auto-bid)
- Mua ngay với giá cố định
- Chat realtime giữa người mua và người bán
- Quản lý giao dịch với theo dõi trạng thái
- Hệ thống đánh giá người dùng
- Tìm kiếm và lọc sản phẩm

---

## Yêu cầu hệ thống

| Thành phần | Phiên bản yêu cầu |
| ---------- | ----------------- |
| Node.js    | >= 20.x           |
| npm        | >= 10.x           |
| Java       | 21                |
| Maven      | >= 3.9.x          |
| MySQL      | >= 8.0            |
| Docker     | Latest            |

---

<div style="page-break-before: always;"></div>

## Cấu trúc dự án

```
Auction-Project/
├── backend/                 # Spring Boot API Server
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Source code Java
│   │   │   └── resources/  # Cấu hình (application.properties)
│   │   └── test/           # Unit tests
│   ├── pom.xml             # Maven dependencies
│   └── docker-compose.yml  # Docker config (MySQL, Redis, etc.)
│
├── frontend/               # React + TypeScript Client
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── features/       # Feature modules
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── types/          # TypeScript types
│   ├── package.json        # npm dependencies
│   └── vite.config.ts      # Vite configuration
│
└── README.md               # File này
```

---

<div style="page-break-before: always;"></div>

## Hướng dẫn cài đặt

### Clone dự án

```bash
git clone https://github.com/voduytan1/Auction-Project.git
cd Auction-Project
```

---

### Database & Backend

#### Yêu cầu

- Java 21
- Maven >= 3.9.x
- Docker & Docker Compose

#### Khởi động Database

```bash
cd backend
docker compose up -d
```

> **Lưu ý:** Lần chạy đầu tiên mất khá nhiều thời gian để Elasticsearch khởi động và script thiết lập user.

#### Kiểm tra dịch vụ

**Elasticsearch:** http://localhost:9200

**Kibana:** http://localhost:5601

- Username: `elastic`
- Password: (giá trị trong file `.env`)

**Logstash:** Tự động authenticate với Elasticsearch bằng user `logstash_system`

#### Tạo file `.env`

```bash
cp .env.example .env
```

#### Cấu hình biến môi trường Backend

##### Cloudinary (Upload ảnh)

1. Truy cập: https://console.cloudinary.com/app/
2. Đăng nhập vào tài khoản Cloudinary
3. Copy **Cloud name** → Paste vào biến `CLOUD_NAME`
4. Chọn **Go to API Keys**
5. Chọn **Generate New API Key** (nếu chưa có)
6. Copy **API Key** → Paste vào biến `CLOUD_API_KEY`
7. Copy **API Secret** → Paste vào biến `CLOUD_API_SECRET`

##### Email (Gửi email)

1. Truy cập: https://myaccount.google.com/apppasswords
2. Đăng nhập vào Gmail dùng để gửi email
3. Ở ô **tên ứng dụng** có thể để bất kỳ
4. Nhấn **Tiếp tục** → Nhận được mật khẩu gồm **16 ký tự**
5. Copy mật khẩu (không lấy khoảng trắng) → Paste vào biến `MAIL_APP_PASSWORD`
6. Nhập email vừa đăng nhập vào biến `MAIL_USERNAME`

##### reCAPTCHA (Bảo mật)

1. Truy cập: https://www.google.com/recaptcha/admin/create
2. **Label:** Điền bất kỳ
3. **reCAPTCHA type:** Chọn `v3`
4. **Domain:** Điền `localhost`
5. Copy **Secret key** → Paste vào biến `RECAPTCHA_SECRET`
6. Copy **Site key** → Paste vào env ở **frontend** (biến `VITE_RECAPTCHA_SITE_KEY`)

##### Google OAuth (Đăng nhập Google)

1. Truy cập: https://console.cloud.google.com
2. Đăng nhập vào tài khoản Google
3. Nhấn vào **danh sách dự án** (góc trên bên trái, giữa logo Google Cloud và thanh search)
4. Chọn **New Project** (Dự án mới)
5. Đặt tên dự án bất kỳ → Nhấn **Create**
6. Chờ dự án tạo xong → Nhấn **Select**

**Cấu hình OAuth:**

1. Ở menu **Quick access** → Chọn **APIs & Services** → **OAuth consent screen**
2. Chọn **Get started**
3. **Bước 1:** Điền **App name** bất kỳ và chọn **user support email** là email của bạn
4. **Bước 2:** Chọn **External**
5. **Bước 3:** Chọn email liên lạc (nên chọn email đã điền ở bước 1)
6. Hoàn thành và nhấn **Create**

**Tạo OAuth Client:**

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

##### Stripe (Thanh toán)

1. Truy cập: https://dashboard.stripe.com/
2. Đăng nhập vào Stripe
3. Ở góc bên trái chọn **API keys**
4. Copy **Secret key** → Paste vào biến `STRIPE_SECRET`

**Cài đặt Stripe CLI:**

1. Truy cập: https://docs.stripe.com/stripe-cli/install
2. Tải và giải nén Stripe CLI
3. Mở **CMD** ở thư mục chứa `stripe.exe`
4. Chạy lệnh:
   ```bash
   stripe login
   ```
5. Hoàn thành xác thực

**Cấu hình Webhook:**

1. **Khởi động backend** trước:
   ```bash
   mvn spring-boot:run
   ```
2. Ở CMD vừa login, chạy lệnh:
   ```bash
   stripe listen --forward-to localhost:8080/payment/webhook
   ```
3. Sau khi lệnh chạy → Nhận được **Webhook Key** (dạng `whsec_...`)
4. Copy key → Paste vào biến `WEBHOOK_SECRET`

> **Quan trọng:** Giữ cửa sổ CMD chạy. Nếu tắt, chức năng thanh toán Stripe sẽ không hoạt động.

#### Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

---

### Frontend

#### Yêu cầu

- Node.js >= 20.x
- npm >= 10.x

#### Cài đặt dependencies

```bash
cd frontend
npm install
```

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `frontend/`:

```env
# API Backend URL
VITE_API_URL=http://localhost:8080

# WebSocket URL
VITE_WS_URL=http://localhost:8080/ws

# Google reCAPTCHA v3 Site Key
VITE_RECAPTCHA_SITE_KEY=

# Google OAuth Client ID
VITE_OAUTH_GOOGLE_CLIENT_ID=
```

| Biến                          | Mô tả                        |
| ----------------------------- | ---------------------------- |
| `VITE_API_URL`                | URL của Backend API          |
| `VITE_WS_URL`                 | URL WebSocket endpoint       |
| `VITE_RECAPTCHA_SITE_KEY`     | Google reCAPTCHA v3 Site Key |
| `VITE_OAUTH_GOOGLE_CLIENT_ID` | Google OAuth Client ID       |

**Lưu ý:**

- `VITE_RECAPTCHA_SITE_KEY`: Lấy từ Backend config (đã cấu hình ở phần reCAPTCHA)
- `VITE_OAUTH_GOOGLE_CLIENT_ID`: Lấy từ Backend config (đã cấu hình ở phần Google OAuth)

#### Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## Chạy ứng dụng

### Development

**1. Khởi động Database:**

```bash
cd backend
docker compose up -d
```

**2. Khởi động Backend:**

```bash
cd backend
mvn spring-boot:run
```

> **Stripe Webhook:** Nhớ chạy `stripe listen --forward-to localhost:8080/payment/webhook` trong terminal riêng

**3. Khởi động Frontend:**

```bash
cd frontend
npm run dev
```

**4. Truy cập ứng dụng:** http://localhost:5173

---

## Tech Stack

### Frontend

- **Framework:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 7
- **State Management:** Redux Toolkit
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 4
- **Form Validation:** React Hook Form + Zod
- **HTTP Client:** Axios
- **WebSocket:** STOMP.js + SockJS

### Backend

- **Framework:** Spring Boot 4
- **Language:** Java 21
- **Database:** MySQL 8
- **Search:** Elasticsearch
- **Authentication:** JWT + OAuth2
- **WebSocket:** Spring WebSocket + STOMP

---

## Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo Issue trên GitHub repository.
