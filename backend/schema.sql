-- ============================================
-- MySQL Database Schema for Auction System
-- Generated from JPA Entities
-- Date: January 10, 2026
-- ============================================

-- Drop existing database and create new one
DROP DATABASE IF EXISTS test;
CREATE DATABASE test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE test;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE users (
    userid CHAR(36) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    vai_tro ENUM('BIDDER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'BIDDER',
    thoi_han_ban_hang DATETIME NULL,
    ho_va_ten NVARCHAR(50) NULL,
    dia_chi NVARCHAR(255) NULL,
    so_dien_thoai VARCHAR(10) NULL,
    ngay_sinh DATE NULL,
    diem_danh_gia DOUBLE DEFAULT 0.0,
    so_luong_danh_gia INT DEFAULT 0,
    anh_dai_dien VARCHAR(255) NULL,
    provider ENUM('LOCAL', 'GOOGLE') DEFAULT 'LOCAL',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (userid),
    INDEX idx_user_hoVaTen (ho_va_ten),
    INDEX idx_user_vaitro (vai_tro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: categories
-- ============================================
CREATE TABLE categories (
    categoryid BIGINT AUTO_INCREMENT,
    ten_danh_muc NVARCHAR(100) NOT NULL,
    level INT NOT NULL COMMENT '1 = cấp cha, 2 = cấp con',
    parent_categoryid BIGINT NULL,
    mo_ta NVARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (categoryid),
    FOREIGN KEY (parent_categoryid) REFERENCES categories(categoryid) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE products (
    productid BIGINT AUTO_INCREMENT,
    ten_san_pham NVARCHAR(255) NOT NULL,
    mo_ta MEDIUMTEXT NULL,
    gia_khoi_diem DECIMAL(15, 2) NOT NULL,
    buoc_gia DECIMAL(15, 2) NOT NULL,
    gia_hien_tai DECIMAL(15, 2) NOT NULL,
    gia_mua_ngay DECIMAL(15, 2) NULL,
    cho_phep_tu_dong_gia_han BOOLEAN NOT NULL DEFAULT FALSE,
    cho_phep_bidder_chua_danh_gia BOOLEAN NOT NULL DEFAULT TRUE,
    trang_thai ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    thoi_gian_ket_thuc DATETIME NULL,
    so_luot_ra_gia INT DEFAULT 0,
    categoryid BIGINT NOT NULL,
    sellerid CHAR(36) NOT NULL,
    current_bidderid CHAR(36) NULL,
    search_text TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (productid),
    FOREIGN KEY (categoryid) REFERENCES categories(categoryid) ON DELETE RESTRICT,
    FOREIGN KEY (sellerid) REFERENCES users(userid) ON DELETE RESTRICT,
    FOREIGN KEY (current_bidderid) REFERENCES users(userid) ON DELETE SET NULL,
    INDEX idx_product_status (trang_thai),
    INDEX idx_product_end_time (thoi_gian_ket_thuc),
    INDEX idx_product_created (created_at),
    INDEX idx_product_category (categoryid),
    INDEX idx_product_seller (sellerid),
    FULLTEXT INDEX idx_search_text (search_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: product_images
-- ============================================
CREATE TABLE product_images (
    imageid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    url_anh VARCHAR(255) NOT NULL,
    public_id VARCHAR(255) NULL,
    thu_tu INT NULL,
    PRIMARY KEY (imageid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    INDEX idx_product_image_product (productid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: product_description_history
-- ============================================
CREATE TABLE product_description_history (
    desc_historyid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    noi_dung_them TEXT NOT NULL,
    thoi_gian_them DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (desc_historyid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    INDEX idx_desc_history_product (productid),
    INDEX idx_desc_history_time (thoi_gian_them)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: bid_history
-- ============================================
CREATE TABLE bid_history (
    bid_historyid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    bidderid CHAR(36) NOT NULL,
    gia_dat DECIMAL(15, 2) NOT NULL,
    thoi_gian_dat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bid_historyid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    FOREIGN KEY (bidderid) REFERENCES users(userid) ON DELETE CASCADE,
    INDEX idx_bid_history_product (productid),
    INDEX idx_bid_history_bidder (bidderid),
    INDEX idx_bid_history_time (thoi_gian_dat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: auto_bids
-- ============================================
CREATE TABLE auto_bids (
    autobidid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    bidderid CHAR(36) NOT NULL,
    gia_toi_da DECIMAL(15, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (autobidid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    FOREIGN KEY (bidderid) REFERENCES users(userid) ON DELETE CASCADE,
    INDEX idx_autobid_product (productid),
    INDEX idx_autobid_bidder (bidderid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: watch_list
-- ============================================
CREATE TABLE watch_list (
    watchlistid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    userid CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (watchlistid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    UNIQUE KEY unique_watchlist (productid, userid),
    INDEX idx_watchlist_user (userid),
    INDEX idx_watchlist_product (productid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: blocked_bidders
-- ============================================
CREATE TABLE blocked_bidders (
    blockid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    bidderid CHAR(36) NOT NULL,
    sellerid CHAR(36) NOT NULL,
    ly_do NVARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blockid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    FOREIGN KEY (bidderid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (sellerid) REFERENCES users(userid) ON DELETE CASCADE,
    UNIQUE KEY unique_blocked (productid, bidderid),
    INDEX idx_blocked_product (productid),
    INDEX idx_blocked_bidder (bidderid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: ratings
-- ============================================
CREATE TABLE ratings (
    ratingid BIGINT AUTO_INCREMENT,
    raterid CHAR(36) NOT NULL COMMENT 'Người đánh giá',
    rateeid CHAR(36) NOT NULL COMMENT 'Người được đánh giá',
    productid BIGINT NOT NULL,
    diem INT NOT NULL COMMENT '+1 hoặc -1',
    nhan_xet NVARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ratingid),
    FOREIGN KEY (raterid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (rateeid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    INDEX idx_rating_rater (raterid),
    INDEX idx_rating_ratee (rateeid),
    INDEX idx_rating_product (productid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: product_questions
-- ============================================
CREATE TABLE product_questions (
    questionid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    askerid CHAR(36) NOT NULL,
    noi_dung_cau_hoi TEXT NOT NULL,
    noi_dung_tra_loi TEXT NULL,
    thoi_gian_hoi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thoi_gian_tra_loi DATETIME NULL,
    PRIMARY KEY (questionid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE CASCADE,
    FOREIGN KEY (askerid) REFERENCES users(userid) ON DELETE CASCADE,
    INDEX idx_question_product (productid),
    INDEX idx_question_asker (askerid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: transactions
-- ============================================
CREATE TABLE transactions (
    transactionid BIGINT AUTO_INCREMENT,
    productid BIGINT NOT NULL,
    buyerid CHAR(36) NOT NULL,
    sellerid CHAR(36) NOT NULL,
    gia_cuoi_cung DECIMAL(15, 2) NOT NULL,
    trang_thai ENUM('PENDING_PAYMENT', 'PAYMENT_COMPLETED', 'AWAITING_SHIPMENT', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
    dia_chi_giao_hang NVARCHAR(500) NULL,
    ma_van_don VARCHAR(100) NULL,
    anh_van_don VARCHAR(255) NULL,
    payment_method VARCHAR(50) NULL,
    payment_transaction_id VARCHAR(255) NULL,
    thoi_gian_thanh_toan DATETIME NULL,
    thoi_gian_giao_hang DATETIME NULL,
    thoi_gian_nhan_hang DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (transactionid),
    FOREIGN KEY (productid) REFERENCES products(productid) ON DELETE RESTRICT,
    FOREIGN KEY (buyerid) REFERENCES users(userid) ON DELETE RESTRICT,
    FOREIGN KEY (sellerid) REFERENCES users(userid) ON DELETE RESTRICT,
    INDEX idx_transaction_product (productid),
    INDEX idx_transaction_buyer (buyerid),
    INDEX idx_transaction_seller (sellerid),
    INDEX idx_transaction_status (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: chat_messages
-- ============================================
CREATE TABLE chat_messages (
    messageid BIGINT AUTO_INCREMENT,
    transactionid BIGINT NOT NULL,
    senderid CHAR(36) NOT NULL,
    message_content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    message_type ENUM('TEXT', 'IMAGE', 'FILE', 'SYSTEM') DEFAULT 'TEXT',
    attachment_url VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (messageid),
    FOREIGN KEY (transactionid) REFERENCES transactions(transactionid) ON DELETE CASCADE,
    FOREIGN KEY (senderid) REFERENCES users(userid) ON DELETE CASCADE,
    INDEX idx_chat_transaction (transactionid),
    INDEX idx_chat_sender (senderid),
    INDEX idx_chat_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: upgrade_requests
-- ============================================
CREATE TABLE upgrade_requests (
    requestid BIGINT AUTO_INCREMENT,
    userid CHAR(36) NOT NULL,
    trang_thai ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ly_do NVARCHAR(500) NULL,
    approved_by_adminid CHAR(36) NULL,
    ghi_chu_admin NVARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (requestid),
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_adminid) REFERENCES users(userid) ON DELETE SET NULL,
    INDEX idx_upgrade_user (userid),
    INDEX idx_upgrade_status (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: configurations
-- ============================================
CREATE TABLE configurations (
    id BIGINT AUTO_INCREMENT,
    variable TINYINT NOT NULL COMMENT '0=HIGHLIGHT_MINUTES, 1=CHECK_PRODUCT_MINUTES, 2=EXTENSION_MINUTES',
    value INT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_configuration_variable (variable)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTE: Redis-based entities (OTP, JWTToken)
-- ============================================
-- The following entities are stored in Redis, not MySQL:
-- - OTP (otp_sessions): Email verification codes
-- - JWTToken (jwt:token): Authentication tokens
-- These do NOT require MySQL tables.

-- ============================================
-- End of Schema
-- ============================================
