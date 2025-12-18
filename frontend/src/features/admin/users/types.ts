export interface User {
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
