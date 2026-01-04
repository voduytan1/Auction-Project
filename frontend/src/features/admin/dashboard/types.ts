// Dashboard stats matching backend WebStat DTO
export interface DashboardStats {
  usersCount: number;
  userGrowth: number;
  auctionsCount: number;
  newAuctionsCount: number;
  bidsCount: number;
  newBidsCount: number;
  revenue: number;
  revenueGrowth: number;
}

// Top auction matching backend TopAuctionsResponse DTO
export interface TopAuction {
  tenSanPham: string;
  giaHienTai: number;
  soLuotRaGia: number;
}

// Upgrade request chart data
export interface UpgradeRequestChart {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

// Revenue data point
export interface RevenueDataPoint {
  month: number;
  revenue: number;
}

// New user data point
export interface NewUserDataPoint {
  month: number;
  bidder: number;
  seller: number;
}

// Product data point
export interface ProductDataPoint {
  month: number;
  newProduct: number;
  completedProduct: number;
}

// Category distribution
export interface CategoryDistribution {
  categoryId: number;
  tenDanhMuc: string;
  soLuongSanPham: number;
}

export interface Activity {
  id: number;
  type: "user_registered" | "auction_created" | "upgrade_request";
  message: string;
  timestamp: string;
  color: "green" | "blue" | "yellow" | "red";
}
