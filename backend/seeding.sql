-- Đặt charset và collation cho connection
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Tắt kiểm tra khóa ngoại để tránh lỗi khi insert thứ tự
SET FOREIGN_KEY_CHECKS = 0;

-- Chuyển sang database auction_db (đã được tạo bởi schema.sql)
USE auction_db;

-- ======================================================================================
-- 1. SEED DATA USERS (1 Admin, 1 Seller, 2 Bidders)
-- Password mặc định là "auction" (BCrypt hash)
-- ======================================================================================

INSERT INTO users (userid, username, password, email, vai_tro, ho_va_ten, dia_chi, so_dien_thoai, created_at, provider) 
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', '$2a$10$WVc5WFoZua4dxGh3lZaQfOvAiT91LbiqIL96RXCnslqV2y769WVuK', 'admin@gmail.com', 'ADMIN', 'Quản Trị Viên', 'Hồ Chí Minh', '0912345678', NOW(), 'LOCAL'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'shopdunk', '$2a$10$WVc5WFoZua4dxGh3lZaQfOvAiT91LbiqIL96RXCnslqV2y769WVuK', 'shopdunk@gmail.com', 'SELLER', 'Cửa hàng ShopDunk', 'TP.HCM', '0923456781', NOW(), 'LOCAL'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'nguoimua1', '$2a$10$WVc5WFoZua4dxGh3lZaQfOvAiT91LbiqIL96RXCnslqV2y769WVuK', 'bidder1@gmail.com', 'BIDDER', 'Nguyễn Văn A', 'Đà Nẵng', '0934567812', NOW(), 'LOCAL'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'nguoimua2', '$2a$10$WVc5WFoZua4dxGh3lZaQfOvAiT91LbiqIL96RXCnslqV2y769WVuK', 'bidder2@gmail.com', 'BIDDER', 'Trần Thị B', 'Cần Thơ', '0945678123', NOW(), 'LOCAL');

-- ======================================================================================
-- 2. SEED DATA CATEGORIES (Danh mục cấp 1 và cấp 2)
-- ======================================================================================

-- Cấp 1
INSERT INTO categories (categoryid, ten_danh_muc, level, parent_categoryid, mo_ta, created_at) VALUES 
(1, 'Điện thoại', 1, NULL, 'Các loại Smartphone mới nhất', NOW()),
(2, 'Laptop', 1, NULL, 'Máy tính xách tay văn phòng, gaming', NOW()),
(3, 'Tai nghe', 1, NULL, 'Tai nghe bluetooth, có dây', NOW()),
(4, 'Đồng hồ', 1, NULL, 'Đồng hồ thông minh và thời trang', NOW()),
(5, 'Tablet', 1, NULL, 'Máy tính bảng giải trí', NOW());

-- Cấp 2
INSERT INTO categories (categoryid, ten_danh_muc, level, parent_categoryid, mo_ta, created_at) VALUES 
-- Con của Điện thoại (1)
(6, 'iPhone', 2, 1, 'Apple iPhone', NOW()),
(7, 'Oppo', 2, 1, 'Oppo Smartphone', NOW()),
-- Con của Laptop (2)
(8, 'MacBook', 2, 2, 'Apple MacBook', NOW()),
(9, 'Asus', 2, 2, 'Laptop Asus', NOW()),
-- Con của Tai nghe (3)
(10, 'JBL', 2, 3, 'Tai nghe JBL', NOW()),
(11, 'UGREEN', 2, 3, 'Tai nghe UGREEN', NOW()),
-- Con của Đồng hồ (4)
(12, 'CASIO', 2, 4, 'Đồng hồ Casio', NOW()),
(13, 'CITIZEN', 2, 4, 'Đồng hồ Citizen', NOW()),
-- Con của Tablet (5)
(14, 'iPad', 2, 5, 'Apple iPad', NOW()),
(15, 'Samsung', 2, 5, 'Samsung Galaxy Tab', NOW());

-- ======================================================================================
-- 3. SEED DATA PRODUCTS (20 Sản phẩm)
-- ======================================================================================

-- --- NHÓM 1: ĐIỆN THOẠI (iPhone, Oppo) ---
INSERT INTO products (productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, gia_mua_ngay, so_luot_ra_gia, categoryid, sellerid, current_bidderid, trang_thai, thoi_gian_ket_thuc, search_text, created_at) VALUES
(1, 'Điện thoại iPhone 15 Plus 128GB', '<ul>
    <li data-list-item-id="ebd243b83aec3fe959349438b709d63d7">
        Màn hình Dynamic Island thay thế tai thỏ đầy tiện lợi
    </li>
    <li data-list-item-id="e848fbea5e6eefb74062b09d448df9fb0">
        5 phiên bản màu đặc sắc với thiết kế mặt kính pha màu đầu tiên trên thị trường
    </li>
    <li data-list-item-id="e68b7fcb80ebd4c6ae350c268f02a2f64">
        Sử dụng chip A16 Bionic cho hiệu năng vượt trội
    </li>
    <li data-list-item-id="e9418cf608514f5c3c4f6e86361075a96">
        Hệ thống camera 48MP, Telephoto 2x giúp chụp ảnh chân thực, sắc nét
    </li>
    <li data-list-item-id="ef7d16182e9efb9a4c90a2cc97dd62845">
        Màn hình OLED Super Retina XDR cho chất lượng đồ họa lý tưởng<br>
        Ứng dụng hệ điều hành iOS 17 mới nhất
    </li>
</ul>', 28000000, 500000, 31000000, 35000000, 6, 6, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 3 DAY), 'dien thoai iphone 15 plus 128gb', NOW()),

(2, 'Điện thoại iPhone 13 128GB', 
'<ul>
    <li>Hệ điều hành: iOS 17</li>
    <li>Chip xử lý (CPU): Apple A15 Bionic</li>
    <li>Tốc độ CPU: 3.22 GHz</li>
    <li>Chip đồ họa (GPU): Apple GPU 4 nhân</li>
    <li>RAM: 4 GB</li>
    <li>Dung lượng lưu trữ: 128 GB</li>
    <li>Dung lượng còn lại (khả dụng) khoảng: 113 GB</li>
    <li>Danh bạ: Không giới hạn</li>
</ul>', 
11000000, 200000, 12600000, 13140000, 8, 6, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 2 DAY), 'dien thoai iphone 13 128gb', NOW()),

(3, 'Điện thoại OPPO A6 Pro 8GB/128GB', 
'<ul>
    <li>Màn hình: AMOLED 6.57", Full HD+, 120Hz</li>
    <li>Chip xử lý (CPU): MediaTek Helio G100 8 nhân</li>
    <li>RAM: 8 GB</li>
    <li>Dung lượng lưu trữ: 128 GB</li>
    <li>Camera sau: Chính 50 MP & Phụ 2 MP</li>
    <li>Camera trước: 16 MP</li>
    <li>Pin, Sạc: 7000 mAh, Sạc siêu nhanh SuperVOOC 80W</li>
    <li>Tiện ích: Kháng nước bụi IP69, Độ bền chuẩn quân đội MIL-STD 810H</li>
</ul>', 
7200000, 100000, 7800000, 8290000, 6, 7, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 5 DAY), 'dien thoai oppo a6 pro 8gb/128gb man hinh amoled 120hz pin 7000mah ip69', NOW()),

(4, 'Điện thoại OPPO Reno14 5G 12GB/512GB', 
'<ul>
    <li>Hệ điều hành: Android 15</li>
    <li>Chip xử lý (CPU): MediaTek Dimensity 8350 5G 8 nhân</li>
    <li>Tốc độ CPU: 3.35 GHz</li>
    <li>Chip đồ họa (GPU): Mali-G615 MC6</li>
    <li>RAM: 12 GB</li>
    <li>Dung lượng lưu trữ: 512 GB</li>
    <li>Dung lượng còn lại (khả dụng) khoảng: 470 GB</li>
    <li>Danh bạ: Không giới hạn</li>
</ul>', 
15000000, 400000, 17400000, 17740000, 6, 7, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 4 DAY), 'dien thoai oppo reno14 5g 12gb/512gb dimensity 8350 android 15', NOW());

-- --- NHÓM 2: LAPTOP (MacBook, Asus) ---
INSERT INTO products (productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, gia_mua_ngay, so_luot_ra_gia, categoryid, sellerid, current_bidderid, trang_thai, thoi_gian_ket_thuc, search_text, created_at) VALUES

(5, 'Laptop MacBook Air 15 inch M4 16GB/256GB', 
'<ul>
    <li>Công nghệ CPU: Apple M4</li>
    <li>Số nhân: 10</li>
    <li>Số luồng: Hãng không công bố</li>
    <li>Tốc độ CPU: 120 GB/s memory bandwidth</li>
</ul>', 
26500000, 500000, 30500000, 30848000, 8, 8, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 3 DAY), 'laptop macbook air 15 inch m4 16gb/256gb apple m4', NOW()),

(6, 'Laptop MacBook Air 13 inch M2 16GB/256GB', '<ul><li>Công nghệ CPU: Apple M2</li><li>Số nhân: 8</li><li>Số luồng: Hãng không công bố</li><li>Tốc độ CPU: 100GB/s</li></ul>', 18500000, 300000, 20600000, 21140000, 7, 8, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 5 DAY), 'laptop macbook air 13 inch m2 16gb/256gb apple m2', NOW()),
(7, 'Laptop Asus Gaming ROG Strix G615JMR - S5155W', '<ul><li>Công nghệ CPU: Intel Core i7 Raptor Lake - 14650HX</li><li>Số nhân: 16</li><li>Số luồng: 24</li><li>Tốc độ CPU: 2.20 GHz (Lên đến 5.20 GHz khi tải nặng)</li></ul>', 42000000, 500000, 47000000, 47924000, 10, 9, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 4 DAY), 'laptop asus gaming rog strix g615jmr s5155w intel core i7 raptor lake 14650hx', NOW()),
(8, 'Laptop Asus Vivobook S14 S3407VA - LY053W', '<ul><li>Công nghệ CPU: Intel Core i7 Raptor Lake - 13620H</li><li>Số nhân: 10</li><li>Số luồng: 16</li><li>Tốc độ CPU: 2.40 GHz (Lên đến 4.90 GHz khi tải nặng)</li></ul>', 20000000, 300000, 22700000, 23210000, 9, 9, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 2 DAY), 'laptop asus vivobook s14 s3407va ly053w intel core i7 raptor lake 13620h', NOW());
-- --- NHÓM 3: TAI NGHE (JBL, UGREEN) ---
INSERT INTO products (productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, gia_mua_ngay, so_luot_ra_gia, categoryid, sellerid, current_bidderid, trang_thai, thoi_gian_ket_thuc, search_text, created_at) VALUES
(9, 'Tai nghe Bluetooth Chụp Tai JBL Tune 520BT', '<ul><li>Thời gian dùng: 57 giờ - Sạc 2 giờ</li><li>Cổng sạc: Type-C</li><li>Công nghệ âm thanh: JBL Pure Bass Sound</li><li>Kết nối: Bluetooth 5.3, Kết nối cùng lúc 2 thiết bị</li><li>Tiện ích: Có mic thoại, Sạc nhanh, Tương thích trợ lý ảo</li><li>Ứng dụng kết nối: JBL Headphones</li><li>Khối lượng: 157 g</li></ul>', 500000, 50000, 800000, 990000, 6, 10, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 3 DAY), 'tai nghe bluetooth chup tai jbl tune 520bt pin 57 gio pure bass sound', NOW()),
(10, 'Tai nghe Bluetooth Open-Ear OWS JBL Endurance Pace', '<ul><li>Thời gian dùng: 10 giờ - Sạc 2 giờ</li><li>Công nghệ âm thanh: JBL OpenSound, Driver 18x11mm</li><li>Kết nối: Bluetooth 5.4, Kết nối cùng lúc 2 thiết bị</li><li>Tiện ích: Chống nước & bụi IP68, 2 Micro chống ồn, Sạc nhanh</li><li>Tương thích: Google Fast Pair, Microsoft Swift Pair</li><li>Khối lượng: 32 g</li></ul>', 1500000, 50000, 1800000, 1990000, 6, 10, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 5 DAY), 'tai nghe bluetooth open ear ows jbl endurance pace ip68 opensound', NOW()),
(11, 'Tai nghe Bluetooth Chụp Tai Ugreen HiTune Max5c HP203', '<ul><li>Thời gian dùng: 75 giờ - Sạc 1.5 giờ</li><li>Công nghệ âm thanh: Chống ồn chủ động ANC, Hi-Res Audio</li><li>Mic: 4 mic chống ồn cuộc gọi thông minh</li><li>Kết nối: Bluetooth 5.4, Kết nối cùng lúc 2 thiết bị</li><li>Tiện ích: Game Mode, Sạc nhanh, App UGREEN</li><li>Cổng sạc: Type-C</li><li>Khối lượng: 264 g</li></ul>', 250000, 20000, 410000, 470000, 8, 11, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 2 DAY), 'tai nghe bluetooth chup tai ugreen hitune max5c hp203 anc hi-res', NOW()),
(12, 'Tai nghe Bluetooth True Wireless Ugreen HiTune T3 Pro WS206 35725', '<ul><li>Thời gian dùng: 7.5 giờ - Hộp sạc 30 giờ</li><li>Công nghệ âm thanh: Chống ồn chủ động ANC, 4 mic đàm thoại</li><li>Tiện ích: Chống nước IPX5, Game Mode, App UGREEN</li><li>Kết nối: Bluetooth 5.4, 1 thiết bị</li><li>Điều khiển: Cảm ứng</li><li>Cổng sạc: Type-C</li></ul>', 450000, 20000, 570000, 590000, 6, 11, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 3 DAY), 'tai nghe bluetooth true wireless ugreen hitune t3 pro ws206 35725 anc ipx5', NOW());

-- --- NHÓM 4: ĐỒNG HỒ (Casio, Citizen) ---
INSERT INTO products (productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, gia_mua_ngay, so_luot_ra_gia, categoryid, sellerid, current_bidderid, trang_thai, thoi_gian_ket_thuc, search_text, created_at) VALUES
(13, 'Đồng hồ CASIO 45 x 42.1 mm Nam AE-1200WHD', '<ul><li>Đối tượng: Nam</li><li>Kích thước mặt: 45 x 42.1 mm, Dày 12.5 mm</li><li>Chất liệu: Dây hợp kim, Khung viền Nhựa PC</li><li>Kháng nước: 10 ATM - Tắm, bơi</li><li>Tuổi thọ pin: Khoảng 10 năm</li><li>Tiện ích: Báo thức, Bấm giờ thể thao, Đèn nền, Lịch ngày - thứ</li><li>Bộ máy: Pin (Quartz)</li></ul>', 800000, 50000, 1050000, 1075000, 5, 12, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 4 DAY), 'dong ho casio 45 x 42.1 mm nam ae-1200whd pin 10 nam 10 atm', NOW()),

(14, 'Đồng hồ G-Shock 40.5 mm Nữ GMA-P2110-1ADR', '<ul><li>Đối tượng: Nữ</li><li>Kích thước mặt: 40.5 mm, Dày 11.3 mm</li><li>Chất liệu: Dây Nhựa, Khung viền Nhựa, Kính khoáng Mineral</li><li>Kháng nước: 20 ATM - Bơi, lặn</li><li>Pin: Khoảng 3 năm (CR1025)</li><li>Tiện ích: Báo thức, Đèn LED, Giờ thế giới, Lịch ngày - tháng</li><li>Thương hiệu: Nhật Bản</li></ul>', 2500000, 100000, 3100000, 3234000, 6, 12, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 6 DAY), 'dong ho g-shock 40.5 mm nu gma-p2110-1adr 20 atm', NOW()),

(15, 'Đồng hồ Citizen Tsuyosa 40 mm Nam NJ0152-51X', '<ul><li>Bộ sưu tập: Tsuyosa</li><li>Máy: Cơ tự động (Automatic) Caliber 8210, Trữ cót 40h</li><li>Kính: Sapphire chống trầy</li><li>Chất liệu: Thép không gỉ mạ PVD vàng</li><li>Đường kính mặt: 40 mm</li><li>Kháng nước: 5 ATM</li><li>Tiện ích: Lịch ngày</li></ul>', 8500000, 200000, 9700000, 10059000, 6, 13, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 5 DAY), 'dong ho citizen tsuyosa 40 mm nam nj0152-51x automatic sapphire', NOW()),

(16, 'Đồng hồ Citizen Mechanical 40 mm Nam NH7501-85H', '<ul><li>Máy: Cơ tự động (Automatic) Caliber 8200, Trữ cót 40h</li><li>Kính: Sapphire</li><li>Chất liệu: Thép không gỉ</li><li>Kích thước mặt: 40 mm, Dày 10.7 mm</li><li>Kháng nước: 5 ATM</li><li>Tiện ích: Kim dạ quang, Lịch ngày - thứ</li></ul>', 5500000, 100000, 6300000, 6942000, 8, 13, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 2 DAY), 'dong ho citizen mechanical 40 mm nam nh7501-85h automatic sapphire', NOW());

-- --- NHÓM 5: TABLET (iPad, Samsung) ---
INSERT INTO products (productid, ten_san_pham, mo_ta, gia_khoi_diem, buoc_gia, gia_hien_tai, gia_mua_ngay, so_luot_ra_gia, categoryid, sellerid, current_bidderid, trang_thai, thoi_gian_ket_thuc, search_text, created_at) VALUES
(17, 'Máy tính bảng iPad mini 7 WiFi 128GB', '<ul><li>Màn hình: LED-backlit IPS LCD, 8.3 inch</li><li>Độ phân giải: 1488 x 2266 Pixels</li><li>Hệ điều hành: iPadOS 18</li><li>CPU: Apple A17 Pro 6 nhân, 3.78 GHz</li><li>GPU: Apple GPU 5 nhân</li></ul>', 10500000, 200000, 12100000, 12540000, 8, 14, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 3 DAY), 'may tinh bang ipad mini 7 wifi 128gb apple a17 pro', NOW()),

(18, 'Máy tính bảng iPad A16 5G 128GB', '<ul><li>Màn hình: Retina IPS LCD, 11 inch, 60 Hz</li><li>Độ phân giải: 1640 x 2360 Pixels</li><li>Hệ điều hành: iPadOS 18</li><li>CPU: Apple A16 5 nhân</li><li>GPU: Apple GPU 4 nhân</li><li>Kết nối: 5G</li></ul>', 11500000, 200000, 12700000, 13740000, 6, 14, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 2 DAY), 'may tinh bang ipad a16 5g 128gb retina ips lcd', NOW()),

(19, 'Máy tính bảng Samsung Galaxy Tab A11 4G 4GB/64GB', '<ul><li>Màn hình: TFT LCD, 8.7 inch, 90 Hz</li><li>Độ phân giải: 800 x 1340 Pixels</li><li>RAM: 4 GB</li><li>Dung lượng lưu trữ: 64 GB (Khả dụng 44.9 GB)</li><li>Thẻ nhớ: Micro SD, hỗ trợ tối đa 2 TB</li><li>Kết nối: 4G</li></ul>', 4500000, 100000, 5300000, 6040000, 8, 15, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 4 DAY), 'may tinh bang samsung galaxy tab a11 4g 4gb/64gb tft lcd', NOW()),

(20, 'Máy tính bảng Samsung Galaxy Tab A11+ 5G 6GB/128GB', '<ul><li>Màn hình: TFT LCD, 11 inch, 90 Hz</li><li>Độ phân giải: 1200 x 1920 Pixels</li><li>Hệ điều hành: Android 16</li><li>CPU: MediaTek Dimensity 7300 8 nhân</li><li>GPU: Mali-G615 MP2</li><li>RAM/ROM: 6GB/128GB</li></ul>', 7000000, 150000, 8200000, 8590000, 8, 15, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 5 DAY), 'may tinh bang samsung galaxy tab a11+ 5g 6gb/128gb dimensity 7300', NOW()),

(21, 'iPad Pro M4 13 inch Wifi 256GB', '<ul><li>Màn hình: 13 inch Ultra Retina XDR, 120Hz ProMotion, 1000 nits</li><li>Chip: Apple M4 (9 lõi CPU)</li><li>RAM/ROM: 8GB/256GB</li><li>Camera: Sau 12MP, Trước 12MP Ultra Wide</li><li>Hệ điều hành: iPadOS 17</li><li>Tương thích: Apple Pencil Pro, Magic Keyboard M4</li></ul>', 31000000, 500000, 34500000, 36290000, 7, 14, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 4 DAY), 'ipad pro m4 13 inch wifi 256gb ultra retina xdr apple m4', NOW());
-- ======================================================================================
-- 4. SEED DATA PRODUCT IMAGES (4 ảnh mỗi sản phẩm)
-- ======================================================================================

INSERT INTO product_images (productid, url_anh, thu_tu) VALUES
-- 1. Điện thoại iPhone 15 Plus 128GB
(1, 'https://cdn.tgdd.vn/Products/Images/42/303891/Slider/vi-vn-iphone-15-plus-slider--(2).jpg', 1),
(1, 'https://cdn.tgdd.vn/Products/Images/42/303891/Slider/iphone-15-slider-3--2--1020x570.png', 2),
(1, 'https://cdn.tgdd.vn/Products/Images/42/303891/Slider/vi-vn-iphone-15-plus-slider--(9).jpg', 3),
(1, 'https://cdn.tgdd.vn/Products/Images/42/303891/Slider/vi-vn-iphone-15-plus-slider--(8).jpg', 4),

-- 2. Điện thoại iPhone 13 128GB
(2, 'https://cdn.tgdd.vn/Products/Images/42/223602/Slider/vi-vn-iphone-13-up-2.jpeg', 1),
(2, 'https://cdn.tgdd.vn/Products/Images/42/223602/Slider/iphone-13-up-3-new-1933x982.jpg', 2),
(2, 'https://cdn.tgdd.vn/Products/Images/42/223602/Slider/vi-vn-iphone-13-up-4.jpg', 3),
(2, 'https://cdn.tgdd.vn/Products/Images/42/223602/Slider/vi-vn-iphone-13-up-5.jpg', 4),

-- 3. Điện thoại OPPO A6 Pro 8GB/128GB
(3, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/344651/oppo-a6-pro-pink-1-638947499173723583-750x500.jpg', 1),
(3, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/344651/oppo-a6-pro-pink-3-638947499131531656-750x500.jpg', 2),
(3, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/344651/oppo-a6-pro-pink-5-638947499117649104-750x500.jpg', 3),
(3, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/344651/oppo-a6-pro-pink-6-638947499109674831-750x500.jpg', 4),

-- 4. Điện thoại OPPO Reno14 5G 12GB/512GB
(4, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/339174/oppo-reno14-5g-white-1-638882710375348526-750x500.jpg', 1),
(4, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/339174/oppo-reno14-5g-white-4-638882710400457780-750x500.jpg', 2),
(4, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/339174/oppo-reno14-5g-white-5-638882710407058674-750x500.jpg', 3),
(4, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/339174/oppo-reno14-5g-white-6-638882710413425159-750x500.jpg', 4),

-- 5. MacBook Air M4
(5, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335372/macbook-air-15-inch-m4-tgdd-1-638768973171263878-750x500.jpg', 1),
(5, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335372/macbook-air-15-inch-m4-tgdd-2-638768973181643538-750x500.jpg', 2),
(5, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335372/macbook-air-15-inch-m4-tgdd-5-638768973201611750-750x500.jpg', 3),
(5, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335372/macbook-air-15-inch-m4-tgdd-6-638768973207581962-750x500.jpg', 4),

-- 6. Laptop MacBook Air 13 inch M2 16GB/256GB
(6, 'https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-16gb-256gb-1-2-750x500.jpg', 1),
(6, 'https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-16gb-256gb-2-2-750x500.jpg', 2),
(6, 'https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-16gb-256gb-3-2-750x500.jpg', 3),
(6, 'https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-16gb-256gb-4-2-750x500.jpg', 4),

-- 7. Laptop Asus Gaming ROG Strix G615JMR - S5155W
(7, 'https://cdn.tgdd.vn/Products/Images/44/341861/Slider/vi-vn-asus-g615jmr-i7-14650hx-s5155w-slider-1.jpg', 1),
(7, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/341861/asus-g615jmr-i7-14650hx-s5155w-1-638905084471918165-750x500.jpg', 2),
(7, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/341861/asus-g615jmr-i7-14650hx-s5155w-2-638905084478067529-750x500.jpg', 3),
(7, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/341861/asus-g615jmr-i7-14650hx-s5155w-3-638905084442992924-750x500.jpg', 4),

-- 8. Laptop Asus Vivobook S14 S3407VA - LY053W
(8, 'https://cdn.tgdd.vn/Products/Images/44/342749/Slider/vi-vn-asus-vivobook-s14-s3407va-i7-13620h-ly053w-slider-1.jpg', 1),
(8, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/342749/asus-vivobook-s14-s3407va-i7-13620h-ly053w-1-638918042830741639-750x500.jpg', 2),
(8, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/342749/asus-vivobook-s14-s3407va-i7-13620h-ly053w-2-638918042823311586-750x500.jpg', 3),
(8, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/342749/asus-vivobook-s14-s3407va-i7-13620h-ly053w-3-638918042817033064-750x500.jpg', 4),

-- 9. Tai nghe Bluetooth Chụp Tai JBL Tune 520BT
(9, 'https://cdn.tgdd.vn/Products/Images/54/312518/tai-nghe-bluetooth-chup-tai-jbl-tune-520bt-den-1-750x500.jpg', 1),
(9, 'https://cdn.tgdd.vn/Products/Images/54/312518/tai-nghe-bluetooth-chup-tai-jbl-tune-520bt-den-2-750x500.jpg', 2),
(9, 'https://cdn.tgdd.vn/Products/Images/54/312518/tai-nghe-bluetooth-chup-tai-jbl-tune-520bt-den-3-750x500.jpg', 3),
(9, 'https://cdn.tgdd.vn/Products/Images/54/312518/tai-nghe-bluetooth-chup-tai-jbl-tune-520bt-den-4-750x500.jpg', 4),

-- 10. Tai nghe Bluetooth Open-Ear OWS JBL Endurance Pace
(10, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/359059/tai-nghe-bluetooth-jbl-endurance-pace-den-1-639017555338975689-750x500.jpg', 1),
(10, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/359059/tai-nghe-bluetooth-jbl-endurance-pace-den-2-639017555348102569-750x500.jpg', 2),
(10, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/359059/tai-nghe-bluetooth-jbl-endurance-pace-den-3-639017555354906635-750x500.jpg', 3),
(10, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/359059/tai-nghe-bluetooth-jbl-endurance-pace-den-4-639017555360390071-750x500.jpg', 4),

-- 11. Tai nghe Bluetooth Chụp Tai Ugreen HiTune Max5c HP203
(11, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360084/tai-nghe-bluetooth-chup-tai-ugreen-hitune-max5c-hp203-den-1-639010498397077361-750x500.jpg', 1),
(11, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360084/tai-nghe-bluetooth-chup-tai-ugreen-hitune-max5c-hp203-den-2-639010498405407330-750x500.jpg', 2),
(11, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360084/tai-nghe-bluetooth-chup-tai-ugreen-hitune-max5c-hp203-den-3-639010498411755297-750x500.jpg', 3),
(11, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360084/tai-nghe-bluetooth-chup-tai-ugreen-hitune-max5c-hp203-den-99-639009233043919790-750x500.jpg', 4),

-- 12. Tai nghe Bluetooth True Wireless Ugreen HiTune T3 Pro WS206 35725
(12, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360080/tai-nghe-bluetooth-true-wireless-ugreen-hitune-t3-pro-ws206-35725-1-639009231757490499-750x500.jpg', 1),
(12, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360080/tai-nghe-bluetooth-true-wireless-ugreen-hitune-t3-pro-ws206-35725-2-639010464367508942-750x500.jpg', 2),
(12, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360080/tai-nghe-bluetooth-true-wireless-ugreen-hitune-t3-pro-ws206-35725-3-639010464375011708-750x500.jpg', 3),
(12, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/360080/tai-nghe-bluetooth-true-wireless-ugreen-hitune-t3-pro-ws206-35725-99-639009231765281410-750x500.jpg', 4),

-- 13. Đồng hồ CASIO 45 x 42.1 mm Nam AE-1200WHD
(13, 'https://cdn.tgdd.vn/Products/Images/7264/199485/casio-ae-1200whd-1avdf-bac-up-1-750x500.jpg', 1),
(13, 'https://cdn.tgdd.vn/Products/Images/7264/199485/casio-ae-1200whd-1avdf-bac-up-2-750x500.jpg', 2),
(13, 'https://cdn.tgdd.vn/Products/Images/7264/199485/casio-ae-1200whd-1avdf-bac-up-6-750x500.jpg', 3),
(13, 'https://cdn.tgdd.vn/Products/Images/7264/199485/casio-ae-1200whd-1avdf-bac-up-8-org.jpg', 4),

-- 14. Đồng hồ G-Shock 40.5 mm Nữ GMA-P2110-1ADR
(14, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/358741/casio-gma-p2110-1adr-nu-1-638981265384068906-750x500.jpg', 1),
(14, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/358741/g-shock-gma-p2110-1adr-nu-4-638989733207444699-750x500.jpg', 2),
(14, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/358741/g-shock-gma-p2110-1adr-nu-5-638989733217997723-750x500.jpg', 3),
(14, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/358741/g-shock-gma-p2110-1adr-nu-7-638989733236222809-750x500.jpg', 4),

-- 15. Đồng hồ Citizen Tsuyosa 40 mm Nam NJ0152-51X
(15, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-1-638629597821954665-750x500.jpg', 1),
(15, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-2-638629597827422902-750x500.jpg', 2),
(15, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-8-638629597840150714-750x500.jpg', 3),
(15, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/330001/citizen-nj0152-51x-nam-9-638629597846393245-750x500.jpg', 4),

-- 16. Đồng hồ Citizen Mechanical 40 mm Nam NH7501-85H
(16, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/304060/citizen-nh7501-85h-nam-1-638695351856640053-750x500.jpg', 1),
(16, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/304060/citizen-nh7501-85h-nam-6-638695351862882041-750x500.jpg', 2),
(16, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/304060/citizen-nh7501-85h-nam-7-638695351847877582-750x500.jpg', 3),
(16, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/304060/citizen-nh7501-85h-nam-8-638695351872923997-750x500.jpg', 4),

-- 17. Máy tính bảng iPad mini 7 WiFi 128GB
(17, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/331229/ipad-mini-7-wifi-purple-1-638651174600667416-750x500.jpg', 1),
(17, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/331229/ipad-mini-7-wifi-purple-2-638651174612580000-750x500.jpg', 2),
(17, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/331229/ipad-mini-7-wifi-purple-3-638651174619400915-750x500.jpg', 3),
(17, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/331229/ipad-mini-7-wifi-purple-4-638651174626053692-750x500.jpg', 4),

-- 18. Máy tính bảng iPad A16 5G 128GB
(18, 'https://cdn.tgdd.vn/Products/Images/522/335311/Slider/ipad-a16-thumbvideo-1920x1080.jpg', 1),
(18, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/335311/ipad-11-a16-5g-silver-3-638772993273701364-750x500.jpg', 2),
(18, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/335311/ipad-11-a16-5g-silver-4-638772993280723126-750x500.jpg', 3),
(18, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/335311/ipad-11-a16-5g-silver-7-638772993295096287-750x500.jpg', 4),

-- 19. Máy tính bảng Samsung Galaxy Tab A11 4G 4GB/64GB
(19, 'https://cdn.tgdd.vn/Products/Images/522/345548/Slider/samsung-galaxy-tab-a11-4g-4gb-64gb639035542834730849.jpg', 1),
(19, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/345548/samsung-galaxy-tab-a11-4g-xam-1-639027101340074295-750x500.jpg', 2),
(19, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/345548/samsung-galaxy-tab-a11-4g-xam-2-639027101333752250-750x500.jpg', 3),
(19, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/345548/samsung-galaxy-tab-a11-4g-xam-4-639027101318198884-750x500.jpg', 4),

-- 20. Máy tính bảng Samsung Galaxy Tab A11+ 5G 6GB/128GB
(20, 'https://cdn.tgdd.vn/Products/Images/522/359089/Slider/samsung-galaxy-tab-a11-plus-tong-quan-1020x570.jpg', 1),
(20, 'https://cdn.tgdd.vn/Products/Images/522/359089/Slider/samsung-galaxy-tab-a11-plus-5g-6gb-128gb639035482461379637.jpg', 2),
(20, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/359089/samsung-galaxy-tab-a11-plus-5g-xam-4-639027061820273937-750x500.jpg', 3),
(20, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/522/359089/samsung-galaxy-tab-a11-plus-5g-xam-5-639027061813477313-750x500.jpg', 4),

(21, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_100_1_2__2.png', 1),
(21, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-m4-13-inch_4_.png', 2),
(21, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-m4-13-inch_5_.png', 3),
(21, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-pro-m4-13-inch_6_.png', 4);
-- ======================================================================================
-- 5. SEED DATA CONFIGURATIONS (Cấu hình hệ thống)
-- ======================================================================================

INSERT INTO configurations (variable, value) VALUES
(0, 20),    -- HIGHLIGHT_MINUTES = 20 phút
(1, 5),    -- CHECK_PRODUCT_MINUTES = 5 phút
(2, 10);   -- EXTENSION_MINUTES = 10 phút

-- ======================================================================================
-- 6. SEED DATA BID HISTORY (Lịch sử đấu giá - ít nhất 5 lượt mỗi sản phẩm)
-- ======================================================================================

-- Product 1: iPhone 15 Plus (6 lượt) - current_bidderid: c0eebc99
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(1, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 28000000, DATE_SUB(NOW(), INTERVAL 50 HOUR)),
(1, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 28500000, DATE_SUB(NOW(), INTERVAL 45 HOUR)),
(1, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 29500000, DATE_SUB(NOW(), INTERVAL 30 HOUR)),
(1, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 30000000, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(1, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 30500000, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(1, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 31000000, DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- Product 2: iPhone 13 (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(2, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 11000000, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(2, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 11200000, DATE_SUB(NOW(), INTERVAL 35 HOUR)),
(2, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 11600000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(2, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 11800000, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(2, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 12000000, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(2, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 12200000, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(2, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 12400000, DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(2, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 12600000, DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- Product 3: OPPO A6 Pro (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(3, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 7200000, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(3, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 7300000, DATE_SUB(NOW(), INTERVAL 42 HOUR)),
(3, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 7500000, DATE_SUB(NOW(), INTERVAL 32 HOUR)),
(3, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 7600000, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(3, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 7700000, DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(3, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 7800000, DATE_SUB(NOW(), INTERVAL 8 HOUR));

-- Product 4: OPPO Reno14 (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(4, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 15000000, DATE_SUB(NOW(), INTERVAL 52 HOUR)),
(4, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 15400000, DATE_SUB(NOW(), INTERVAL 46 HOUR)),
(4, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 16200000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(4, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 16600000, DATE_SUB(NOW(), INTERVAL 26 HOUR)),
(4, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 17000000, DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(4, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 17400000, DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Product 5: MacBook Air M4 (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(5, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 26500000, DATE_SUB(NOW(), INTERVAL 55 HOUR)),
(5, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 27000000, DATE_SUB(NOW(), INTERVAL 50 HOUR)),
(5, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 28000000, DATE_SUB(NOW(), INTERVAL 42 HOUR)),
(5, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 28500000, DATE_SUB(NOW(), INTERVAL 35 HOUR)),
(5, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 29000000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(5, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 29500000, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(5, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 30000000, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(5, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 30500000, DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- Product 6: MacBook Air M2 (7 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(6, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 18500000, DATE_SUB(NOW(), INTERVAL 58 HOUR)),
(6, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 18800000, DATE_SUB(NOW(), INTERVAL 52 HOUR)),
(6, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 19400000, DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(6, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 19700000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(6, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 20000000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(6, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 20300000, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(6, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 20600000, DATE_SUB(NOW(), INTERVAL 9 HOUR));

-- Product 7: Asus ROG Strix (10 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(7, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 42000000, DATE_SUB(NOW(), INTERVAL 60 HOUR)),
(7, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 42500000, DATE_SUB(NOW(), INTERVAL 56 HOUR)),
(7, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 43500000, DATE_SUB(NOW(), INTERVAL 50 HOUR)),
(7, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 44000000, DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(7, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 44500000, DATE_SUB(NOW(), INTERVAL 38 HOUR)),
(7, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 45000000, DATE_SUB(NOW(), INTERVAL 30 HOUR)),
(7, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 45500000, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(7, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 46000000, DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(7, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 46500000, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(7, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 47000000, DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- Product 8: Asus Vivobook (9 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(8, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 20000000, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(8, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 20300000, DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(8, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 20900000, DATE_SUB(NOW(), INTERVAL 38 HOUR)),
(8, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 21200000, DATE_SUB(NOW(), INTERVAL 32 HOUR)),
(8, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 21500000, DATE_SUB(NOW(), INTERVAL 26 HOUR)),
(8, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 21800000, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(8, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 22100000, DATE_SUB(NOW(), INTERVAL 14 HOUR)),
(8, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 22400000, DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(8, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 22700000, DATE_SUB(NOW(), INTERVAL 3 HOUR));

-- Product 9: JBL Tune 520BT (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(9, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 500000, DATE_SUB(NOW(), INTERVAL 46 HOUR)),
(9, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 550000, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(9, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 650000, DATE_SUB(NOW(), INTERVAL 30 HOUR)),
(9, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 700000, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(9, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 750000, DATE_SUB(NOW(), INTERVAL 14 HOUR)),
(9, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 800000, DATE_SUB(NOW(), INTERVAL 7 HOUR));

-- Product 10: JBL Endurance Pace (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(10, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 1500000, DATE_SUB(NOW(), INTERVAL 54 HOUR)),
(10, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 1550000, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(10, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 1650000, DATE_SUB(NOW(), INTERVAL 38 HOUR)),
(10, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 1700000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(10, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 1750000, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(10, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 1800000, DATE_SUB(NOW(), INTERVAL 9 HOUR));

-- Product 11: Ugreen HiTune Max5c (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(11, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 250000, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(11, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 270000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(11, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 310000, DATE_SUB(NOW(), INTERVAL 30 HOUR)),
(11, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 330000, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(11, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 350000, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(11, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 370000, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(11, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 390000, DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(11, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 410000, DATE_SUB(NOW(), INTERVAL 3 HOUR));

-- Product 12: Ugreen HiTune T3 Pro (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(12, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 450000, DATE_SUB(NOW(), INTERVAL 42 HOUR)),
(12, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 470000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(12, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 510000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(12, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 530000, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(12, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 550000, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(12, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 570000, DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- Product 13: Casio AE-1200WHD (5 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(13, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 800000, DATE_SUB(NOW(), INTERVAL 38 HOUR)),
(13, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 850000, DATE_SUB(NOW(), INTERVAL 30 HOUR)),
(13, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 950000, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(13, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 1000000, DATE_SUB(NOW(), INTERVAL 14 HOUR)),
(13, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 1050000, DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Product 14: G-Shock GMA-P2110 (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(14, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 2500000, DATE_SUB(NOW(), INTERVAL 56 HOUR)),
(14, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 2600000, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(14, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 2800000, DATE_SUB(NOW(), INTERVAL 38 HOUR)),
(14, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 2900000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(14, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 3000000, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(14, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 3100000, DATE_SUB(NOW(), INTERVAL 8 HOUR));

-- Product 15: Citizen Tsuyosa (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(15, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 8500000, DATE_SUB(NOW(), INTERVAL 52 HOUR)),
(15, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 8700000, DATE_SUB(NOW(), INTERVAL 46 HOUR)),
(15, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 9100000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(15, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 9300000, DATE_SUB(NOW(), INTERVAL 26 HOUR)),
(15, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 9500000, DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(15, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 9700000, DATE_SUB(NOW(), INTERVAL 7 HOUR));

-- Product 16: Citizen NH7501 (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(16, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 5500000, DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(16, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 5600000, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(16, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 5800000, DATE_SUB(NOW(), INTERVAL 34 HOUR)),
(16, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 5900000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(16, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 6000000, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(16, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 6100000, DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(16, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 6200000, DATE_SUB(NOW(), INTERVAL 9 HOUR)),
(16, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 6300000, DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- Product 17: iPad mini 7 (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(17, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 10500000, DATE_SUB(NOW(), INTERVAL 50 HOUR)),
(17, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 10700000, DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(17, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 11100000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(17, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 11300000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(17, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 11500000, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(17, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 11700000, DATE_SUB(NOW(), INTERVAL 13 HOUR)),
(17, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 11900000, DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(17, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 12100000, DATE_SUB(NOW(), INTERVAL 3 HOUR));

-- Product 18: iPad A16 (6 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(18, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 11500000, DATE_SUB(NOW(), INTERVAL 42 HOUR)),
(18, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 11700000, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(18, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 12100000, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(18, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 12300000, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(18, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 12500000, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(18, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 12700000, DATE_SUB(NOW(), INTERVAL 5 HOUR));

-- Product 19: Samsung Tab A11 (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(19, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 4500000, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(19, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 4600000, DATE_SUB(NOW(), INTERVAL 42 HOUR)),
(19, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 4800000, DATE_SUB(NOW(), INTERVAL 34 HOUR)),
(19, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 4900000, DATE_SUB(NOW(), INTERVAL 26 HOUR)),
(19, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 5000000, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(19, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 5100000, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(19, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 5200000, DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(19, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 5300000, DATE_SUB(NOW(), INTERVAL 3 HOUR));

-- Product 20: Samsung Tab A11+ (8 lượt)
INSERT INTO bid_history (productid, bidderid, gia_dat, thoi_gian_dat) VALUES
(20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 7000000, DATE_SUB(NOW(), INTERVAL 54 HOUR)),
(20, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 7150000, DATE_SUB(NOW(), INTERVAL 48 HOUR)),
(20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 7450000, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(20, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 7600000, DATE_SUB(NOW(), INTERVAL 32 HOUR)),
(20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 7750000, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(20, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 7900000, DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(20, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 8050000, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(20, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 8200000, DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;