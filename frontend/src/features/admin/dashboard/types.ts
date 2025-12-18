export interface DashboardStats {
  totalUsers: number;
  activeAuctions: number;
  totalBids: number;
  revenue: string;
}

export interface Activity {
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
