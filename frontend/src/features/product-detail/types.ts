export interface BidHistory {
  bidHistoryid: number;
  tenBidder: string;
  giaDat: number;
  thoiGianDat: string;
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
