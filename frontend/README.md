# Auction Project Frontend

Ứng dụng web frontend cho sàn đấu giá trực tuyến.

## Công nghệ sử dụng

### Core

- **React 19** - Thư viện UI với các tính năng mới nhất
- **TypeScript 5.7** - Kiểm tra kiểu tĩnh
- **Vite 7.3** - Build tool và development server hiệu năng cao

### Routing & State

- **React Router v7** - Điều hướng client-side
- **Redux Toolkit 2.5** - Quản lý state có thể dự đoán
- **React Hook Form 7.54** - Xử lý form hiệu năng cao

### UI & Styling

- **Tailwind CSS v4** - Framework CSS utility-first
- **Radix UI** - Component primitives không style, accessible
- **shadcn/ui** - Bộ sưu tập component có thể tái sử dụng
- **Lucide React** - Thư viện icon

### Data & Validation

- **Axios 1.7** - HTTP client dựa trên Promise
- **Zod 3.24** - Schema validation ưu tiên TypeScript
- **date-fns 4.1** - Thư viện xử lý date hiện đại

### Real-time & Security

- **WebSocket** - Cập nhật đấu giá theo thời gian thực
- **reCAPTCHA v3** - Bảo vệ chống bot cho form đăng nhập
- **Google OAuth** - Xác thực qua mạng xã hội

## Cấu trúc dự án

```
frontend/
├── public/                     # Tài nguyên tĩnh
├── src/
│   ├── components/            # Component UI tái sử dụng
│   │   ├── auth/             # Component xác thực
│   │   ├── layout/           # Component layout (Header, Footer, Sidebar)
│   │   └── ui/               # Component cơ bản shadcn/ui
│   ├── config/               # File cấu hình
│   │   └── env.ts            # Export biến môi trường
│   ├── contexts/             # React contexts
│   │   └── WebSocketContext.tsx
│   ├── features/             # Module theo tính năng
│   │   ├── admin/           # Dashboard và quản lý admin
│   │   ├── auth/            # Đăng nhập, đăng ký, đặt lại mật khẩu
│   │   ├── bidder/          # Hồ sơ bidder, danh sách theo dõi
│   │   ├── home/            # Component trang chủ
│   │   ├── product-detail/  # Trang chi tiết sản phẩm
│   │   ├── profile/         # Quản lý hồ sơ người dùng
│   │   ├── search/          # Chức năng tìm kiếm
│   │   ├── seller/          # Quản lý sản phẩm seller
│   │   └── transaction/     # Đơn hàng và thanh toán
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Hàm tiện ích và helper
│   ├── routes/               # Định nghĩa route
│   ├── services/             # Tầng service API
│   │   ├── api.ts           # Axios instance và interceptors
│   │   ├── auth.api.ts      # API xác thực
│   │   ├── product.api.ts   # API sản phẩm
│   │   └── ...              # Module API khác
│   ├── store/                # Redux store
│   │   ├── index.ts         # Cấu hình store
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── slices/          # Redux slices
│   ├── types/                # Định nghĩa kiểu TypeScript
│   ├── App.tsx               # Component gốc
│   └── main.tsx              # Entry point ứng dụng
├── .env.example              # Template biến môi trường
├── .env.local                # Biến môi trường local (gitignored)
├── package.json              # Dependencies và scripts
├── tsconfig.json             # Cấu hình TypeScript
├── tailwind.config.js        # Cấu hình Tailwind CSS
└── vite.config.ts            # Cấu hình Vite
```

## Bắt đầu

### Yêu cầu

- Node.js 18.x hoặc cao hơn
- npm 9.x hoặc cao hơn
- Backend API server đang chạy (mặc định: http://localhost:8080)

### Cài đặt

1. Clone repository và di chuyển vào thư mục frontend:

```bash
cd frontend
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file cấu hình môi trường:

```bash
cp .env.example .env.local
```

4. Cấu hình biến môi trường trong `.env.local`:

```env
# Cấu hình Backend API
VITE_API_URL=
VITE_WS_URL=

# Bảo mật & Xác thực
VITE_RECAPTCHA_SITE_KEY=
VITE_OAUTH_GOOGLE_CLIENT_ID=
```

**Biến môi trường bắt buộc:**

- `VITE_API_URL` - URL gốc của Backend API
- `VITE_WS_URL` - WebSocket endpoint cho cập nhật real-time
- `VITE_RECAPTCHA_SITE_KEY` - Site key của Google reCAPTCHA v3 (lấy từ https://www.google.com/recaptcha/admin)
- `VITE_OAUTH_GOOGLE_CLIENT_ID` - Client ID của Google OAuth (lấy từ https://console.cloud.google.com/apis/credentials)

### Development

Khởi chạy development server:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### Build Production

Tạo bản build production đã tối ưu:

```bash
npm run build
```

Output build sẽ nằm trong thư mục `dist/`.

Xem trước bản build production ở local:

```bash
npm run preview
```

### Kiểm tra chất lượng code

Chạy TypeScript type checking:

```bash
npm run type-check
```

Chạy linting:

```bash
npm run lint
```

## Tính năng chính

### Xác thực & Phân quyền

- Xác thực dựa trên JWT với access token và refresh token
- Tự động làm mới token khi hết hạn
- Kiểm soát truy cập dựa trên vai trò (ADMIN, SELLER, BIDDER)
- Tích hợp Google OAuth
- Bảo vệ reCAPTCHA v3

### Quản lý sản phẩm

- Duyệt sản phẩm theo danh mục
- Chức năng tìm kiếm full-text
- Cập nhật sản phẩm real-time qua WebSocket
- Theo dõi trạng thái sản phẩm (PENDING, ACTIVE, COMPLETED, CANCELLED)
- Upload và quản lý hình ảnh

### Hệ thống đấu giá

- Cập nhật giá đấu real-time
- Theo dõi lịch sử đấu giá
- Xác thực giá đấu tự động
- Đồng hồ đếm ngược
- Chức năng danh sách theo dõi

### Vai trò người dùng

**Guest:**

- Duyệt sản phẩm và danh mục
- Xem chi tiết sản phẩm
- Tìm kiếm sản phẩm

**Bidder:**

- Đặt giá đấu cho sản phẩm
- Quản lý danh sách theo dõi
- Xem lịch sử đấu giá
- Yêu cầu nâng cấp lên seller
- Quản lý giao dịch

**Seller:**

- Tạo và quản lý sản phẩm
- Xem hoạt động đấu giá
- Trả lời câu hỏi
- Hủy sản phẩm
- Bổ sung mô tả sản phẩm

**Admin:**

- Quản lý người dùng
- Kiểm duyệt sản phẩm
- Phê duyệt nâng cấp seller
- Cấu hình hệ thống
- Dashboard phân tích

## License

Dự án này là một phần của WNC Final Project.
