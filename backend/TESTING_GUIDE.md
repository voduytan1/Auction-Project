# Hướng dẫn Test WebSocket với Postman

## Bước 1: Chuẩn bị Database

### 1.1. Tạo sample data trong database

Bạn cần có ít nhất:
- ✅ 1 user với role SELLER (để tạo product)
- ✅ 2-3 users với role BIDDER (để test bidding)
- ✅ 1 category
- ✅ 1 product đang ACTIVE

**SQL Script mẫu:**

```sql
-- 1. Tạo users (password: "123456" đã hash với bcrypt)
INSERT INTO users (userid, username, email, ho_va_ten, password, vaitro, created_at, updated_at) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'seller1', 'seller@test.com', 'Nguyễn Văn Seller', '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS', 'SELLER', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'bidder1', 'bidder1@test.com', 'Trần Thị Khoa', '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS', 'BIDDER', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'bidder2', 'bidder2@test.com', 'Lê Văn Tuấn', '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS', 'BIDDER', NOW(), NOW());

-- 2. Tạo category
INSERT INTO categories (categoryid, ten_danh_muc, parent_categoryid, created_at, updated_at)
VALUES (1, 'Điện tử', NULL, NOW(), NOW());

-- 3. Tạo product ACTIVE
INSERT INTO products (
  productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, 
  gia_mua_ngay, cho_phep_tu_dong_gia_han, cho_phep_bidder_chua_danh_gia,
  trang_thai, thoi_gian_ket_thuc, so_luot_ra_gia, categoryid, sellerid, 
  created_at, updated_at
)
VALUES (
  1, 
  'iPhone 15 Pro Max', 
  'iPhone 15 Pro Max 256GB màu Titan tự nhiên, máy mới 100%',
  10000000, -- giá khởi điểm 10tr
  100000,   -- bước giá 100k
  10000000, -- giá hiện tại 10tr
  25000000, -- giá mua ngay 25tr
  TRUE,     -- cho phép auto-extend
  TRUE,     -- cho phép bidder chưa đánh giá
  'ACTIVE', 
  DATE_ADD(NOW(), INTERVAL 7 DAY), -- hết hạn sau 7 ngày
  0,        -- chưa có lượt ra giá
  1,        -- categoryid
  '11111111-1111-1111-1111-111111111111', -- sellerid
  NOW(), 
  NOW()
);
```

---

## Bước 2: Start Backend Server

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Đợi server khởi động thành công. Kiểm tra log:
```
Started BackendApplication in X.XXX seconds
```

---

## Bước 3: Test REST API trước

### 3.1. Login để lấy JWT Token

**Request:**
```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "bidder1",
  "password": "123456"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "userid": "22222222-2222-2222-2222-222222222222"
}
```

✅ **Copy `accessToken` để dùng cho các request sau**

### 3.2. Test đặt giá thông thường

**Request:**
```http
POST http://localhost:8080/api/v1/bids
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json

{
  "productId": 1,
  "giaDat": 10100000
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đặt giá thành công",
  "bidHistory": {
    "bidHistoryid": 1,
    "tenBidder": "****Khoa",
    "giaDat": 10100000,
    "thoiGianDat": "2025-12-24T10:30:00"
  },
  "giaHienTai": 10100000,
  "soLuotRaGia": 1,
  "isExtended": false
}
```

### 3.3. Test đặt Auto-Bid

**Login as bidder2:**
```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "bidder2",
  "password": "123456"
}
```

**Place Auto-Bid:**
```http
POST http://localhost:8080/api/v1/bids/auto
Authorization: Bearer BIDDER2_ACCESS_TOKEN
Content-Type: application/json

{
  "productid": 1,
  "giaToiDa": 15000000
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đặt giá tự động thành công",
  "autoBid": {
    "autobidid": 1,
    "productid": 1,
    "tenSanPham": "iPhone 15 Pro Max",
    "giaToiDa": 15000000,
    "giaHienTai": 10200000,
    "isWinning": true
  },
  "giaHienTaiSanPham": 10200000,
  "currentWinner": "****Tuấn"
}
```

---

## Bước 4: Test WebSocket với Postman

### 4.1. Mở WebSocket Request trong Postman

1. Click **New** → **WebSocket Request**
2. URL: `ws://localhost:8080/ws`
3. Click **Connect**

✅ Nếu kết nối thành công, bạn sẽ thấy status: **Connected**

### 4.2. Subscribe to Topic

Sau khi connected, gửi STOMP frame để subscribe:

**Message 1: CONNECT**
```
CONNECT
accept-version:1.1,1.0
heart-beat:10000,10000

```

**Note:** Phải có 2 dòng trống ở cuối!

**Expected Response:**
```
CONNECTED
version:1.1
heart-beat:0,0

```

**Message 2: SUBSCRIBE to bid updates**
```
SUBSCRIBE
id:sub-0
destination:/topic/product/1/bids

```

**Message 3: SUBSCRIBE to bid history**
```
SUBSCRIBE
id:sub-1
destination:/topic/product/1/history

```

### 4.3. Test Real-time Updates

Giữ Postman WebSocket tab mở, sau đó:

1. **Mở tab REST API mới trong Postman**
2. **Place a new bid:**

```http
POST http://localhost:8080/api/v1/bids
Authorization: Bearer BIDDER1_ACCESS_TOKEN
Content-Type: application/json

{
  "productId": 1,
  "giaDat": 10300000
}
```

3. **Quay lại WebSocket tab**

✅ **Bạn sẽ thấy 2 messages real-time:**

**Message 1: Bid Update**
```
MESSAGE
destination:/topic/product/1/bids
content-type:application/json
subscription:sub-0
message-id:xyz

{
  "productId": 1,
  "giaHienTai": 10300000,
  "currentBidder": "****Khoa",
  "soLuotRaGia": 2,
  "thoiGianDat": "2025-12-24T10:35:00",
  "eventType": "NEW_BID",
  "message": "Có lượt đặt giá mới"
}
```

**Message 2: Bid History**
```
MESSAGE
destination:/topic/product/1/history
content-type:application/json
subscription:sub-1
message-id:abc

{
  "bidHistoryId": 2,
  "productId": 1,
  "bidderName": "****Khoa",
  "giaDat": 10300000,
  "thoiGianDat": "2025-12-24T10:35:00"
}
```

---

## Bước 5: Test Auto-Bid Competition

### 5.1. Setup 2 Auto-Bidders

**Bidder 1 (max: 12tr):**
```http
POST http://localhost:8080/api/v1/bids/auto
Authorization: Bearer BIDDER1_ACCESS_TOKEN

{
  "productid": 1,
  "giaToiDa": 12000000
}
```

**Bidder 2 (max: 15tr):**
```http
POST http://localhost:8080/api/v1/bids/auto
Authorization: Bearer BIDDER2_ACCESS_TOKEN

{
  "productid": 1,
  "giaToiDa": 15000000
}
```

### 5.2. Kiểm tra WebSocket

Sau khi bidder2 đặt auto-bid, WebSocket sẽ nhận:

```json
{
  "productId": 1,
  "giaHienTai": 12100000,  // bidder2 thắng với giá = max của bidder1 + bước giá
  "currentBidder": "****Tuấn",
  "eventType": "AUTO_BID",
  "message": "Giá được cập nhật tự động"
}
```

---

## Bước 6: Test Buy Now

```http
POST http://localhost:8080/api/v1/bids/buy-now/1
Authorization: Bearer BIDDER1_ACCESS_TOKEN
```

WebSocket sẽ nhận:
```json
{
  "productId": 1,
  "giaHienTai": 25000000,
  "eventType": "BUY_NOW",
  "message": "Sản phẩm đã được mua ngay"
}
```

Và status change:
```json
{
  "productId": 1,
  "status": "COMPLETED",
  "message": "Sản phẩm đã được mua ngay",
  "winnerId": "22222222-2222-2222-2222-222222222222",
  "winnerName": "****Khoa"
}
```

---

## Troubleshooting

### ❌ Lỗi: "WebSocket connection failed"
- Kiểm tra server đang chạy: `http://localhost:8080`
- Kiểm tra firewall/antivirus
- Thử URL khác: `ws://127.0.0.1:8080/ws`

### ❌ Lỗi: "401 Unauthorized" khi place bid
- JWT token đã expired
- Login lại để lấy token mới

### ❌ Không nhận được WebSocket messages
- Kiểm tra đã SUBSCRIBE đúng topic chưa
- Kiểm tra productId trong topic path
- Xem console log của backend

### ❌ Lỗi: "Product không trong trạng thái đấu giá"
- Kiểm tra `trang_thai` trong DB = 'ACTIVE'
- Kiểm tra `thoi_gian_ket_thuc` > NOW()

---

## Checklist trước khi test

- [ ] Database có sample data (users, category, product)
- [ ] Backend server đang chạy
- [ ] Đã login và có JWT token
- [ ] Product status = ACTIVE
- [ ] Product chưa hết hạn
- [ ] WebSocket connection thành công
- [ ] Đã subscribe topics

---

## Expected Flow

```
1. Connect WebSocket ✓
2. Subscribe topics ✓
3. Place bid via REST API ✓
4. WebSocket receives update instantly ✓
5. UI updates (your frontend) ✓
```

---

Chúc bạn test thành công! 🚀
