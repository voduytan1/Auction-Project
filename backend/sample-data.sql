-- =====================================================
-- SAMPLE DATA FOR TESTING WEBSOCKET REAL-TIME BIDDING
-- =====================================================

-- Clean up existing data (optional - use with caution!)
-- DELETE FROM bid_history;
-- DELETE FROM auto_bids;
-- DELETE FROM products;
-- DELETE FROM categories;
-- DELETE FROM users WHERE username LIKE 'test%';

-- =====================================================
-- 1. CREATE TEST USERS
-- =====================================================
-- Password for all users: "123456" (bcrypt hash)
-- Seller: thoi_han_ban_hang = 30 days from now

INSERT INTO users (userid, username, email, ho_va_ten, password, vaitro, dia_chi, ngay_sinh, thoi_han_ban_hang, created_at, updated_at) 
VALUES 
  (
    '11111111-1111-1111-1111-111111111111', 
    'testseller', 
    'seller@test.com', 
    'Nguyễn Văn Seller',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS',
    'SELLER',
    'TP.HCM',
    '1990-01-01',
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    NOW(), 
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222', 
    'testbidder1', 
    'bidder1@test.com', 
    'Trần Thị Khoa',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS',
    'BIDDER',
    'Hà Nội',
    '1995-05-15',
    NULL,
    NOW(), 
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'testbidder2', 
    'bidder2@test.com', 
    'Lê Văn Tuấn',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS',
    'BIDDER',
    'Đà Nẵng',
    '1992-08-20',
    NULL,
    NOW(), 
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444', 
    'testbidder3', 
    'bidder3@test.com', 
    'Phạm Minh Khánh',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye2J8OOtk0wfx5cAI/OJbSvQy8KXPkjvS',
    'BIDDER',
    'Cần Thơ',
    '1998-12-10',
    NULL,
    NOW(), 
    NOW()
  );

-- =====================================================
-- 2. CREATE CATEGORIES
-- =====================================================

INSERT INTO categories (categoryid, ten_danh_muc, parent_categoryid, created_at, updated_at)
VALUES 
  (100, 'Điện tử', NULL, NOW(), NOW()),
  (101, 'Điện thoại di động', 100, NOW(), NOW()),
  (102, 'Laptop', 100, NOW(), NOW()),
  (200, 'Thời trang', NULL, NOW(), NOW()),
  (201, 'Giày dép', 200, NOW(), NOW());

-- =====================================================
-- 3. CREATE TEST PRODUCTS
-- =====================================================

-- Product 1: iPhone 15 Pro Max (ACTIVE - ready for bidding)
INSERT INTO products (
  productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, 
  gia_mua_ngay, cho_phep_tu_dong_gia_han, cho_phep_bidder_chua_danh_gia,
  trang_thai, thoi_gian_ket_thuc, so_luot_ra_gia, categoryid, sellerid, 
  search_text, created_at, updated_at
)
VALUES (
  1, 
  'iPhone 15 Pro Max 256GB', 
  'iPhone 15 Pro Max 256GB màu Titan tự nhiên, máy mới 100%, fullbox, chính hãng VN/A',
  10000000,  -- 10 triệu
  100000,    -- 100k mỗi bước
  10000000,  -- giá hiện tại = giá khởi điểm
  25000000,  -- 25 triệu mua ngay
  TRUE,      -- cho phép auto-extend
  TRUE,      -- cho phép bidder chưa đánh giá
  'ACTIVE', 
  DATE_ADD(NOW(), INTERVAL 7 DAY), -- 7 ngày
  0, 
  101, 
  '11111111-1111-1111-1111-111111111111',
  'iphone 15 pro max 256gb mau titan tu nhien may moi 100 fullbox chinh hang vn a',
  NOW(), 
  NOW()
);

-- Product 2: MacBook Pro (ACTIVE - ready for bidding)
INSERT INTO products (
  productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, 
  gia_mua_ngay, cho_phep_tu_dong_gia_han, cho_phep_bidder_chua_danh_gia,
  trang_thai, thoi_gian_ket_thuc, so_luot_ra_gia, categoryid, sellerid, 
  search_text, created_at, updated_at
)
VALUES (
  2, 
  'MacBook Pro 14 M3 Pro', 
  'MacBook Pro 14 inch M3 Pro chip, 18GB RAM, 512GB SSD, Space Black. Bảo hành 12 tháng',
  30000000,  -- 30 triệu
  500000,    -- 500k mỗi bước
  30000000,
  50000000,  -- 50 triệu mua ngay
  FALSE,     -- không auto-extend
  FALSE,     -- chỉ cho bidder có rating >= 80%
  'ACTIVE', 
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  0, 
  102, 
  '11111111-1111-1111-1111-111111111111',
  'macbook pro 14 m3 pro chip 18gb ram 512gb ssd space black bao hanh 12 thang',
  NOW(), 
  NOW()
);

-- Product 3: Ending Soon (for testing auto-extend)
INSERT INTO products (
  productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, 
  gia_mua_ngay, cho_phep_tu_dong_gia_han, cho_phep_bidder_chua_danh_gia,
  trang_thai, thoi_gian_ket_thuc, so_luot_ra_gia, categoryid, sellerid, 
  search_text, created_at, updated_at
)
VALUES (
  3, 
  'AirPods Pro Gen 2', 
  'AirPods Pro thế hệ 2 với USB-C, nguyên seal chưa kích hoạt',
  3000000,   -- 3 triệu
  50000,     -- 50k
  3000000,
  6000000,   -- 6 triệu
  TRUE,      -- auto-extend enabled - test this!
  TRUE,
  'ACTIVE', 
  DATE_ADD(NOW(), INTERVAL 3 MINUTE), -- Kết thúc sau 3 phút - test auto-extend!
  0, 
  101, 
  '11111111-1111-1111-1111-111111111111',
  'airpods pro gen 2 voi usb c nguyen seal chua kich hoat',
  NOW(), 
  NOW()
);

-- =====================================================
-- 4. VERIFY DATA
-- =====================================================

-- Check users
SELECT userid, username, ho_va_ten, vaitro FROM users WHERE username LIKE 'test%';

-- Check categories
SELECT * FROM categories WHERE categoryid >= 100;

-- Check products
SELECT 
  p.productid,
  p.ten_san_pham,
  p.gia_khoi_diem,
  p.gia_hien_tai,
  p.trang_thai,
  p.thoi_gian_ket_thuc,
  u.username as seller
FROM products p
JOIN users u ON p.sellerid = u.userid
WHERE p.productid IN (1, 2, 3);

-- =====================================================
-- 5. SAMPLE RATINGS (Optional - to test rating validation)
-- =====================================================

-- Give bidder1 good ratings (8+, 2-)
-- Uncomment if you have ratings table set up

/*
INSERT INTO ratings (ratingid, rater_userid, ratee_userid, diem, nhan_xet, created_at)
VALUES 
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Good buyer', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Fast payment', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Recommended', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Great', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Perfect', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Excellent', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Very good', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 1, 'Awesome', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', -1, 'Late payment', NOW()),
  (UUID(), '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', -1, 'No response', NOW());
-- This gives bidder1: 8/10 = 80% rating
*/

-- =====================================================
-- DONE! Ready to test WebSocket
-- =====================================================

-- Login credentials:
-- Username: testseller    | Password: 123456 | Role: SELLER
-- Username: testbidder1   | Password: 123456 | Role: BIDDER
-- Username: testbidder2   | Password: 123456 | Role: BIDDER
-- Username: testbidder3   | Password: 123456 | Role: BIDDER

-- Products ready:
-- Product 1: iPhone 15 Pro Max (7 days remaining)
-- Product 2: MacBook Pro (5 days remaining, requires rating)
-- Product 3: AirPods Pro (3 minutes remaining - test auto-extend!)
