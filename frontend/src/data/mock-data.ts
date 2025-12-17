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
