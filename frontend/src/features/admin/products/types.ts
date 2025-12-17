export interface Product {
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
