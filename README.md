# AuctionHub - Hệ thống đấu giá trực tuyến

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
  - [1. Database](#1-database)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Chạy ứng dụng](#chạy-ứng-dụng)

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

---

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

## Hướng dẫn cài đặt

### 1. Database

---

### 2. Backend

---

### 3. Frontend

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
VITE_API_URL=

# WebSocket URL
VITE_WS_URL=

# Google reCAPTCHA v3 Site Key
VITE_RECAPTCHA_SITE_KEY=

# Google OAuth Client ID
VITE_OAUTH_GOOGLE_CLIENT_ID=
```

| Biến                         | Mô tả                        |
| ---------------------------- | ---------------------------- |
| `VITE_API_URL`               | URL của Backend API          |
| `VITE_WS_URL`                | URL WebSocket endpoint       |
| `VITE_RECAPTCHA_SITE_KEY`    | Google reCAPTCHA v3 Site Key |
| `VITE_OAUTH_GOOGLE_CLIENT_ID`| Google OAuth Client ID       |

#### Lấy reCAPTCHA Site Key

1. Truy cập [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Tạo site mới với loại **reCAPTCHA v3**
3. Thêm domain: `localhost` (development) và domain production
4. Copy **Site Key** vào `VITE_RECAPTCHA_SITE_KEY`

#### Lấy Google OAuth Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Web application**
6. Thêm **Authorized JavaScript origins**:
   - `http://localhost:5173` (development)
   - URL production (nếu có)
7. Copy **Client ID** vào `VITE_OAUTH_GOOGLE_CLIENT_ID`

#### Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## Chạy ứng dụng

### Development

1. **Khởi động Database** (xem hướng dẫn Backend)

2. **Khởi động Backend** (xem hướng dẫn Backend)

3. **Khởi động Frontend:**

```bash
cd frontend
npm run dev
```

4. **Truy cập ứng dụng:** http://localhost:5173

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
