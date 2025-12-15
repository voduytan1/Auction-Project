# Auction Project Frontend

Ứng dụng frontend cho sàn đấu giá trực tuyến AuctionHub.

## 🚀 Công nghệ sử dụng

- **React 19** - Library UI
- **TypeScript** - Type safety
- **Vite 7** - Build tool & dev server
- **React Router v7** - Routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS v4** - Styling
- **Radix UI** - Component primitives
- **shadcn/ui** - UI components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **date-fns** - Date formatting

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── product/         # Product-related components
│   ├── theme/           # Theme provider
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── auth/            # Auth pages (Login, Register)
│   ├── bidder/          # Bidder pages (Profile, WatchList)
│   ├── guest/           # Public pages (Home, ProductList)
│   └── seller/          # Seller pages (AddProduct, MyProducts)
├── routes/              # Route configuration
├── services/            # API services
│   ├── api.ts           # Axios instance & interceptors
│   ├── authService.ts   # Authentication APIs
│   ├── productService.ts # Product APIs
│   └── ...
├── store/               # Redux store
│   ├── index.ts         # Store configuration
│   ├── hooks.ts         # Typed hooks
│   └── slices/          # Redux slices
└── App.tsx              # Root component
```

## ✨ Các tính năng

### 1. Phân hệ Guest (Người dùng ẩn danh)

- ✅ Trang chủ với Top 5 sản phẩm
- ✅ Xem danh sách sản phẩm theo danh mục
- ✅ Xem chi tiết sản phẩm
- ✅ Tìm kiếm sản phẩm (Full-text search)
- ✅ Menu danh mục 2 cấp

### 2. Phân hệ Bidder (Người mua)

- ✅ Đăng nhập / Đăng ký
- ✅ Quản lý hồ sơ cá nhân
- ✅ Danh sách yêu thích (Watch List)
- 🚧 Đặt giá sản phẩm
- 🚧 Đấu giá tự động

### 3. Phân hệ Seller (Người bán)

- 🚧 Đăng sản phẩm
- 🚧 Quản lý sản phẩm
- 🚧 Trả lời câu hỏi

### 4. Phân hệ Admin (Quản trị viên)

- 🚧 Dashboard thống kê
- 🚧 Quản lý danh mục
- 🚧 Quản lý người dùng

## 🛠️ Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Tạo file `.env`:

```bash
cp .env.example .env
```

3. Cấu hình API URL trong `.env`:

```
VITE_API_URL=http://localhost:8080/api
```

4. Chạy development server:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173/

5. Build production:

```bash
npm run build
```

## 🔧 API Integration

### Authentication

- JWT AccessToken & RefreshToken
- Auto refresh token khi hết hạn
- Interceptor xử lý 401 errors

### State Management

- Redux Toolkit cho global state
- LocalStorage cho persistent data
- Optimistic updates

## 🎨 UI/UX

### Theme

- Light / Dark mode support
- Consistent design language
- Responsive design (Mobile-first)

### Components

- shadcn/ui components
- Custom components với Radix UI
- Accessible (ARIA, keyboard navigation)

## 📝 Tác giả

AuctionHub Team - WNC Final Project
