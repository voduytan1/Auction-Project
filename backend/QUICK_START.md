# 🚀 Quick Start - Test WebSocket Ngay Lập Tức

## Chuẩn bị trong 5 phút ⏱️

### Bước 1: Insert Sample Data (1 phút)
```bash
# Mở MySQL Workbench hoặc terminal
mysql -u root -p your_database_name < sample-data.sql
```

**Hoặc copy-paste SQL từ file [sample-data.sql](sample-data.sql)**

✅ Data được tạo:
- 4 users (1 seller, 3 bidders) - password: `123456`
- 3 products đang ACTIVE
- Categories

### Bước 2: Start Backend (1 phút)
```bash
cd backend
mvn spring-boot:run
```

Đợi thấy: `Started BackendApplication`

### Bước 3: Import Postman Collection (30 giây)
1. Mở Postman
2. Import → File → Chọn `Auction-WebSocket-Testing.postman_collection.json`
3. Done!

### Bước 4: Login & Get Tokens (30 giây)
Trong Postman:
1. Folder **"1. Authentication"**
2. Chạy **"Login as Bidder 1"**
3. Chạy **"Login as Bidder 2"**

✅ Tokens tự động lưu vào variables!

### Bước 5: Test WebSocket (2 phút)

#### 5.1. Mở WebSocket Connection
1. **New** → **WebSocket**
2. URL: `ws://localhost:8080/ws`
3. Click **Connect**

#### 5.2. Send CONNECT frame
```
CONNECT
accept-version:1.1,1.0
heart-beat:10000,10000

```
**⚠️ Quan trọng: 2 dòng trống ở cuối!**

#### 5.3. Subscribe to product 1
```
SUBSCRIBE
id:sub-0
destination:/topic/product/1/bids

```

```
SUBSCRIBE
id:sub-1
destination:/topic/product/1/history

```

#### 5.4. Test Real-time!
Mở tab mới, chạy request **"Place Bid (Bidder 1) - 10.1M"**

👀 **Quay lại WebSocket tab → Bạn sẽ thấy message real-time!**

```json
{
  "productId": 1,
  "giaHienTai": 10100000,
  "currentBidder": "****Khoa",
  "soLuotRaGia": 1,
  "eventType": "NEW_BID",
  "message": "Có lượt đặt giá mới"
}
```

---

## 🎯 Test Scenarios

### Scenario 1: Manual Bidding Race
```
1. Bidder 1 đặt 10.1M
2. Bidder 2 đặt 10.2M  
3. Bidder 1 đặt 10.3M
→ Xem WebSocket updates real-time!
```

### Scenario 2: Auto-Bid Competition
```
1. Bidder 1 auto-bid max 12M
2. Bidder 2 auto-bid max 15M
→ Giá tự động nhảy lên 12.1M (bidder 2 thắng)
```

### Scenario 3: Buy Now
```
1. Bidder 1 buy now product 1
→ Product status = COMPLETED
→ WebSocket broadcast status change
```

---

## 📋 Checklist

- [ ] Database có sample data
- [ ] Backend đang chạy
- [ ] Postman collection imported
- [ ] Đã login (có tokens)
- [ ] WebSocket connected
- [ ] Đã subscribe topics
- [ ] **TEST THÀNH CÔNG!** 🎉

---

## 🐛 Troubleshooting Nhanh

**WebSocket không connect?**
→ Kiểm tra backend đang chạy: `http://localhost:8080`

**401 Unauthorized?**
→ Chạy lại Login để refresh token

**Không nhận message?**
→ Kiểm tra đã subscribe đúng topic: `/topic/product/1/bids`

---

## 📚 Tài liệu đầy đủ

- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Hướng dẫn chi tiết
- [WEBSOCKET_GUIDE.md](WEBSOCKET_GUIDE.md) - Frontend integration
- [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md) - Tổng quan

---

**Tất cả chỉ mất 5 phút! Let's go! 🚀**
