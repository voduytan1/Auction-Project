export interface Auction {
  id: number;
  title: string;
  seller: string;
  currentBid: string;
  bids: number;
  endDate: string;
  status: "active" | "ending_soon" | "ended";
}
