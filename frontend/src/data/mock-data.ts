// ============================================================================
// MOCK DATA - TOÀN BỘ HỆ THỐNG
// Tất cả mock data cho UI được quản lý tập trung tại đây
// ============================================================================

// ============================================================================
// HOMEPAGE - Products
// ============================================================================

export interface HomeProduct {
  id: number;
  name: string;
  image: string;
  currentBid: number;
  bids: number;
  endTime: string;
}

// ============================================================================
// PRODUCT DETAIL - Chi tiết sản phẩm
// ============================================================================

export interface BidHistory {
  id: number;
  bidderName: string; // Masked name: ****Khoa
  amount: number;
  timestamp: string;
}

export interface ProductQuestion {
  id: number;
  askerName: string;
  askerRating: number;
  question: string;
  answer?: string;
  askedAt: string;
  answeredAt?: string;
}

export interface UserInfo {
  id: number;
  name: string;
  rating: number; // Điểm đánh giá: 8/10 = 80%
  totalRatings: number; // Tổng số lần đánh giá
}

export interface ProductDetail {
  id: number;
  name: string;
  mainImage: string;
  images: string[]; // Ít nhất 3 ảnh phụ
  currentBid: number;
  buyNowPrice?: number; // Giá mua ngay (optional)
  startingPrice: number;
  bidIncrement: number; // Bước giá
  category: string;
  subcategory: string;
  seller: UserInfo;
  highestBidder?: UserInfo; // Người đặt giá cao nhất
  postedAt: string;
  endTime: string; // ISO string
  description: string; // HTML content
  totalBids: number;
  bidHistory: BidHistory[];
  questions: ProductQuestion[];
  autoRenew: boolean;
}

export const productDetailData: ProductDetail = {
  id: 1,
  name: "iPhone 15 Pro Max 256GB - Like New",
  mainImage: "https://placehold.co/800x600/4a90e2/white?text=iPhone+15+Pro+Max",
  images: [
    "https://placehold.co/800x600/4a90e2/white?text=Front+View",
    "https://placehold.co/800x600/50c878/white?text=Back+View",
    "https://placehold.co/800x600/ff6b6b/white?text=Side+View",
    "https://placehold.co/800x600/ffd93d/white?text=Accessories",
  ],
  currentBid: 25000000,
  buyNowPrice: 28000000,
  startingPrice: 20000000,
  bidIncrement: 100000,
  category: "Điện tử",
  subcategory: "Điện thoại di động",
  seller: {
    id: 101,
    name: "Nguyễn Văn A",
    rating: 9.5,
    totalRatings: 243,
  },
  highestBidder: {
    id: 202,
    name: "****Khoa",
    rating: 8.7,
    totalRatings: 156,
  },
  postedAt: "2025-12-10T08:00:00Z",
  endTime: "2025-12-17T21:00:00Z", // 2 giờ nữa
  description: `
    <h3>Mô tả sản phẩm</h3>
    <p>iPhone 15 Pro Max 256GB màu Titan Tự Nhiên, máy like new 99%, sử dụng 2 tháng.</p>
    <ul>
      <li>✅ Chip A17 Pro mạnh mẽ</li>
      <li>✅ Camera 48MP chụp cực đẹp</li>
      <li>✅ Pin 100% dung lượng</li>
      <li>✅ Fullbox, còn nguyên seal phụ kiện</li>
      <li>✅ Bảo hành Apple còn 10 tháng</li>
    </ul>
    <p><strong>Phụ kiện đi kèm:</strong></p>
    <ul>
      <li>Hộp nguyên seal</li>
      <li>Cáp USB-C to USB-C</li>
      <li>Sách hướng dẫn</li>
      <li>Sim ghim</li>
    </ul>
    <p>Máy không trầy xước, không vết móp méo. Mua về xài ngay!</p>
  `,
  totalBids: 156,
  bidHistory: [
    {
      id: 1,
      bidderName: "****Khoa",
      amount: 25000000,
      timestamp: "2025-12-17T16:43:00Z",
    },
    {
      id: 2,
      bidderName: "****Kha",
      amount: 24900000,
      timestamp: "2025-12-17T15:20:00Z",
    },
    {
      id: 3,
      bidderName: "****Tuấn",
      amount: 24800000,
      timestamp: "2025-12-17T14:15:00Z",
    },
    {
      id: 4,
      bidderName: "****Khánh",
      amount: 24700000,
      timestamp: "2025-12-17T13:05:00Z",
    },
    {
      id: 5,
      bidderName: "****Minh",
      amount: 24600000,
      timestamp: "2025-12-17T11:30:00Z",
    },
  ],
  questions: [
    {
      id: 1,
      askerName: "Trần Văn B",
      askerRating: 9.2,
      question: "Máy có bị rơi vỡ hay sửa chữa gì không ạ?",
      answer:
        "Dạ máy chưa bao giờ rơi vỡ, không sửa chữa gì hết ạ. Máy còn rất mới.",
      askedAt: "2025-12-15T10:30:00Z",
      answeredAt: "2025-12-15T11:00:00Z",
    },
    {
      id: 2,
      askerName: "Lê Thị C",
      askerRating: 8.5,
      question: "Bảo hành còn bao lâu vậy shop?",
      answer:
        "Dạ bảo hành Apple chính hãng còn 10 tháng ạ, em check IMEI được luôn.",
      askedAt: "2025-12-16T14:20:00Z",
      answeredAt: "2025-12-16T14:45:00Z",
    },
    {
      id: 3,
      askerName: "Phạm Văn D",
      askerRating: 7.8,
      question: "Máy có lock mạng không ạ? Ship COD được không?",
      askedAt: "2025-12-17T09:00:00Z",
    },
  ],
  autoRenew: true,
};

// 5 sản phẩm liên quan (cùng category)
export const relatedProducts: HomeProduct[] = [
  {
    id: 2,
    name: "iPhone 14 Pro 128GB",
    image: "https://placehold.co/400x300/5856d6/white?text=iPhone+14+Pro",
    currentBid: 18000000,
    bids: 98,
    endTime: "1 ngày",
  },
  {
    id: 3,
    name: "iPhone 13 Pro Max 256GB",
    image: "https://placehold.co/400x300/3867d6/white?text=iPhone+13+Pro+Max",
    currentBid: 15000000,
    bids: 134,
    endTime: "2 ngày",
  },
  {
    id: 11,
    name: "iPhone 15 Plus 128GB",
    image: "https://placehold.co/400x300/fd79a8/white?text=iPhone+15+Plus",
    currentBid: 20000000,
    bids: 87,
    endTime: "3 giờ",
  },
  {
    id: 12,
    name: "iPhone 14 128GB",
    image: "https://placehold.co/400x300/0abde3/white?text=iPhone+14",
    currentBid: 14000000,
    bids: 76,
    endTime: "12 giờ",
  },
  {
    id: 13,
    name: "iPhone 15 Pro 256GB",
    image: "https://placehold.co/400x300/00d2ff/white?text=iPhone+15+Pro",
    currentBid: 23000000,
    bids: 145,
    endTime: "1 ngày",
  },
];

// Top 5 sản phẩm gần kết thúc
export const endingSoonProducts: HomeProduct[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    image: "https://placehold.co/400x300/png",
    currentBid: 25000000,
    bids: 156,
    endTime: "2 giờ",
  },
  {
    id: 2,
    name: "MacBook Pro M3 16GB",
    image: "https://placehold.co/400x300/png",
    currentBid: 35000000,
    bids: 98,
    endTime: "3 giờ",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    image: "https://placehold.co/400x300/png",
    currentBid: 22000000,
    bids: 142,
    endTime: "5 giờ",
  },
  {
    id: 4,
    name: "iPad Pro 12.9 M2",
    image: "https://placehold.co/400x300/png",
    currentBid: 18000000,
    bids: 87,
    endTime: "6 giờ",
  },
  {
    id: 5,
    name: "Apple Watch Ultra 2",
    image: "https://placehold.co/400x300/png",
    currentBid: 15000000,
    bids: 64,
    endTime: "8 giờ",
  },
];

// Top 5 sản phẩm có nhiều lượt ra giá nhất
export const mostBidsProducts: HomeProduct[] = [
  {
    id: 6,
    name: "Sony PlayStation 5",
    image: "https://placehold.co/400x300/png",
    currentBid: 12000000,
    bids: 234,
    endTime: "1 ngày",
  },
  {
    id: 7,
    name: "Nintendo Switch OLED",
    image: "https://placehold.co/400x300/png",
    currentBid: 7500000,
    bids: 198,
    endTime: "2 ngày",
  },
  {
    id: 8,
    name: "Rolex Submariner",
    image: "https://placehold.co/400x300/png",
    currentBid: 180000000,
    bids: 167,
    endTime: "3 ngày",
  },
  {
    id: 9,
    name: "Canon EOS R5",
    image: "https://placehold.co/400x300/png",
    currentBid: 45000000,
    bids: 156,
    endTime: "1 ngày",
  },
  {
    id: 10,
    name: "DJI Mavic 3 Pro",
    image: "https://placehold.co/400x300/png",
    currentBid: 38000000,
    bids: 143,
    endTime: "4 ngày",
  },
];

// Top 5 sản phẩm có giá cao nhất
export const highestPriceProducts: HomeProduct[] = [
  {
    id: 11,
    name: "Rolex Daytona Gold",
    image: "https://placehold.co/400x300/png",
    currentBid: 250000000,
    bids: 89,
    endTime: "5 ngày",
  },
  {
    id: 12,
    name: "Mercedes-Benz S-Class 2024",
    image: "https://placehold.co/400x300/png",
    currentBid: 2800000000,
    bids: 45,
    endTime: "7 ngày",
  },
  {
    id: 13,
    name: "Tranh Sơn Dầu Cổ",
    image: "https://placehold.co/400x300/png",
    currentBid: 150000000,
    bids: 23,
    endTime: "10 ngày",
  },
  {
    id: 14,
    name: "Đồng hồ Patek Philippe",
    image: "https://placehold.co/400x300/png",
    currentBid: 120000000,
    bids: 56,
    endTime: "3 ngày",
  },
  {
    id: 15,
    name: "Túi Hermès Birkin",
    image: "https://placehold.co/400x300/png",
    currentBid: 95000000,
    bids: 78,
    endTime: "2 ngày",
  },
];

// ============================================================================
// ADMIN - Dashboard
// ============================================================================

export interface DashboardActivity {
  id: number;
  type: "user_registered" | "auction_created" | "upgrade_request";
  message: string;
  timestamp: string;
  color: "green" | "blue" | "yellow" | "red";
}

export interface TopAuction {
  title: string;
  bids: number;
  price: string;
}

export const mockDashboardActivities: DashboardActivity[] = [
  {
    id: 1,
    type: "user_registered",
    message: "User mới đăng ký",
    timestamp: "2 phút trước",
    color: "green",
  },
  {
    id: 2,
    type: "auction_created",
    message: "Auction mới được tạo",
    timestamp: "15 phút trước",
    color: "blue",
  },
  {
    id: 3,
    type: "upgrade_request",
    message: "Yêu cầu upgrade seller",
    timestamp: "1 giờ trước",
    color: "yellow",
  },
];

export const mockTopAuctions: TopAuction[] = [
  { title: "iPhone 15 Pro Max", bids: 156, price: "25M VNĐ" },
  { title: "MacBook Pro M3", bids: 98, price: "35M VNĐ" },
  { title: "PS5 Gaming Console", bids: 76, price: "12M VNĐ" },
];

// ============================================================================
// ADMIN - Users
// ============================================================================

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "BIDDER" | "SELLER" | "ADMIN";
  rating: number;
  status: "active" | "suspended" | "banned";
}

export interface UpgradeRequest {
  id: number;
  userId: number;
  userName: string;
  email: string;
  currentRole: "BIDDER";
  requestedRole: "SELLER";
  reason: string;
  rating: number;
  totalBids: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "BIDDER",
    rating: 85,
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "SELLER",
    rating: 92,
    status: "active",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "BIDDER",
    rating: 78,
    status: "suspended",
  },
];

export const mockUpgradeRequests: UpgradeRequest[] = [
  {
    id: 1,
    userId: 4,
    userName: "Hoàng Văn D",
    email: "hoangvand@example.com",
    currentRole: "BIDDER",
    requestedRole: "SELLER",
    reason: "Tôi muốn bán các sản phẩm công nghệ chính hãng",
    rating: 95,
    totalBids: 156,
    requestDate: "2025-12-15",
    status: "pending",
  },
  {
    id: 2,
    userId: 5,
    userName: "Vũ Thị E",
    email: "vuthie@example.com",
    currentRole: "BIDDER",
    requestedRole: "SELLER",
    reason: "Có nhiều sản phẩm thời trang cần bán",
    rating: 88,
    totalBids: 89,
    requestDate: "2025-12-16",
    status: "pending",
  },
  {
    id: 3,
    userId: 6,
    userName: "Đỗ Văn F",
    email: "dovanf@example.com",
    currentRole: "BIDDER",
    requestedRole: "SELLER",
    reason: "Kinh doanh đồ cũ, cần tài khoản seller",
    rating: 76,
    totalBids: 45,
    requestDate: "2025-12-14",
    status: "approved",
  },
];

// ============================================================================
// ADMIN - Auctions
// ============================================================================

export interface AdminAuction {
  id: number;
  title: string;
  seller: string;
  currentBid: string;
  bids: number;
  endDate: string;
  status: "active" | "ending_soon" | "ended";
}

export const mockAdminAuctions: AdminAuction[] = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    seller: "Nguyễn Văn A",
    currentBid: "25,000,000 VNĐ",
    bids: 156,
    endDate: "2025-12-20 14:30",
    status: "active",
  },
  {
    id: 2,
    title: "MacBook Pro M3 16GB",
    seller: "Trần Thị B",
    currentBid: "35,000,000 VNĐ",
    bids: 98,
    endDate: "2025-12-19 10:00",
    status: "active",
  },
  {
    id: 3,
    title: "PS5 Console",
    seller: "Lê Văn C",
    currentBid: "12,000,000 VNĐ",
    bids: 76,
    endDate: "2025-12-18 20:00",
    status: "ending_soon",
  },
];

// ============================================================================
// ADMIN - Categories
// ============================================================================

export interface AdminCategory {
  id: number;
  name: string;
  parentId: number | null;
  parentName?: string;
  productCount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockAdminCategories: AdminCategory[] = [
  {
    id: 1,
    name: "Điện tử",
    parentId: null,
    productCount: 156,
    description: "Các sản phẩm điện tử",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: 2,
    name: "Điện thoại",
    parentId: 1,
    parentName: "Điện tử",
    productCount: 45,
    description: "Điện thoại thông minh",
    createdAt: "2025-01-02",
    updatedAt: "2025-01-02",
  },
  {
    id: 3,
    name: "Laptop",
    parentId: 1,
    parentName: "Điện tử",
    productCount: 32,
    description: "Máy tính xách tay",
    createdAt: "2025-01-02",
    updatedAt: "2025-01-02",
  },
  {
    id: 4,
    name: "Thời trang",
    parentId: null,
    productCount: 89,
    description: "Thời trang nam nữ",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: 5,
    name: "Gia dụng",
    parentId: null,
    productCount: 0,
    description: "Đồ gia dụng",
    createdAt: "2025-01-03",
    updatedAt: "2025-01-03",
  },
];

// ============================================================================
// ADMIN - Products
// ============================================================================

export interface AdminProduct {
  id: number;
  title: string;
  category: string;
  seller: string;
  currentBid: string;
  startPrice: string;
  bids: number;
  endDate: string;
  status: "active" | "ended" | "removed";
  createdAt: string;
}

export const mockAdminProducts: AdminProduct[] = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    category: "Điện thoại",
    seller: "Nguyễn Văn A",
    startPrice: "20,000,000 VNĐ",
    currentBid: "25,000,000 VNĐ",
    bids: 156,
    endDate: "2025-12-20 14:30",
    status: "active",
    createdAt: "2025-12-10",
  },
  {
    id: 2,
    title: "MacBook Pro M3 16GB",
    category: "Laptop",
    seller: "Trần Thị B",
    startPrice: "30,000,000 VNĐ",
    currentBid: "35,000,000 VNĐ",
    bids: 98,
    endDate: "2025-12-19 10:00",
    status: "active",
    createdAt: "2025-12-11",
  },
  {
    id: 3,
    title: "PS5 Console",
    category: "Gaming",
    seller: "Lê Văn C",
    startPrice: "10,000,000 VNĐ",
    currentBid: "12,000,000 VNĐ",
    bids: 76,
    endDate: "2025-12-18 20:00",
    status: "active",
    createdAt: "2025-12-12",
  },
  {
    id: 4,
    title: "Samsung Galaxy S24 Ultra",
    category: "Điện thoại",
    seller: "Phạm Văn D",
    startPrice: "18,000,000 VNĐ",
    currentBid: "18,000,000 VNĐ",
    bids: 0,
    endDate: "2025-12-15 18:00",
    status: "ended",
    createdAt: "2025-12-08",
  },
];
