import type { Product } from "../types";

// Mock data - Top 5 sản phẩm gần kết thúc
export const endingSoonProducts: Product[] = [
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

// Mock data - Top 5 sản phẩm có nhiều lượt ra giá nhất
export const mostBidsProducts: Product[] = [
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

// Mock data - Top 5 sản phẩm có giá cao nhất
export const highestPriceProducts: Product[] = [
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
