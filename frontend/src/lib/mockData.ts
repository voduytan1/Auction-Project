// Mock data for development and testing

export interface MockProduct {
  id: string;
  tenSanPham: string;
  moTa: string;
  hinhAnh: string[];
  giaKhoiDiem: number;
  giaHienTai: number;
  soLuotDauGia: number;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  thoiGianTao: string; // When product was created
  trangThai: "ACTIVE" | "COMPLETED" | "CANCELLED";
  buocGia: number;
  tuDongGiaHan: boolean;
  nguoiBan: {
    userid: string;
    username: string;
    hoVaTen: string;
    anhDaiDien?: string;
  };
  danhMuc: {
    id: string;
    tenDanhMuc: string;
  };
  nguoiThang?: {
    userid: string;
    username: string;
    hoVaTen: string;
  };
}

export interface MockBid {
  id: string;
  productId: string;
  nguoiDauGia: {
    userid: string;
    username: string;
  };
  giaRa: number;
  thoiGian: string;
}

export interface MockQuestion {
  id: string;
  productId: string;
  cauHoi: string;
  cauTraLoi?: string;
  nguoiHoi: {
    userid: string;
    username: string;
  };
  thoiGianHoi: string;
  thoiGianTraLoi?: string;
}

// Mock products
export const mockProducts: MockProduct[] = [
  {
    id: "1",
    tenSanPham: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
    moTa: "iPhone 15 Pro Max phiên bản Titan Tự Nhiên, 256GB. Máy mới 100%, fullbox, chưa active. Bảo hành chính hãng Apple 12 tháng.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1696446702183-cbd50c06e3e6?w=800",
      "https://images.unsplash.com/photo-1695048064803-afd67129af4b?w=800",
    ],
    giaKhoiDiem: 25000000,
    giaHienTai: 28500000,
    soLuotDauGia: 12,
    thoiGianBatDau: "2024-12-20T10:00:00",
    thoiGianKetThuc: "2024-12-25T18:00:00",
    thoiGianTao: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 phút trước - MỚI
    trangThai: "ACTIVE",
    buocGia: 500000,
    tuDongGiaHan: true,
    nguoiBan: {
      userid: "seller-001",
      username: "techstore",
      hoVaTen: "Nguyễn Văn Tech",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=techstore",
    },
    danhMuc: {
      id: "cat-1",
      tenDanhMuc: "Điện thoại",
    },
  },
  {
    id: "2",
    tenSanPham: "MacBook Pro M3 14 inch - Space Black",
    moTa: "MacBook Pro 14 inch với chip M3, 16GB RAM, 512GB SSD. Màu Space Black sang trọng. Hàng chính hãng VN/A, bảo hành 12 tháng.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
    ],
    giaKhoiDiem: 35000000,
    giaHienTai: 37200000,
    soLuotDauGia: 8,
    thoiGianBatDau: "2024-12-21T09:00:00",
    thoiGianKetThuc: "2024-12-26T20:00:00",
    thoiGianTao: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
    trangThai: "ACTIVE",
    buocGia: 1000000,
    tuDongGiaHan: false,
    nguoiBan: {
      userid: "seller-001",
      username: "techstore",
      hoVaTen: "Nguyễn Văn Tech",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=techstore",
    },
    danhMuc: {
      id: "cat-2",
      tenDanhMuc: "Laptop",
    },
  },
  {
    id: "3",
    tenSanPham: "Sony WH-1000XM5 - Tai nghe chống ồn cao cấp",
    moTa: "Tai nghe Sony WH-1000XM5 với công nghệ chống ồn hàng đầu. Pin 30 giờ, hỗ trợ LDAC, multipoint. Fullbox nguyên seal.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800",
    ],
    giaKhoiDiem: 5000000,
    giaHienTai: 5500000,
    soLuotDauGia: 15,
    thoiGianBatDau: "2024-12-19T14:00:00",
    thoiGianKetThuc: "2024-12-24T22:00:00",
    thoiGianTao: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 phút trước - MỚI
    trangThai: "ACTIVE",
    buocGia: 200000,
    tuDongGiaHan: true,
    nguoiBan: {
      userid: "seller-002",
      username: "audiomart",
      hoVaTen: "Trần Thị Audio",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=audiomart",
    },
    danhMuc: {
      id: "cat-3",
      tenDanhMuc: "Âm thanh",
    },
  },
  {
    id: "4",
    tenSanPham: "iPad Air M2 2024 - 128GB",
    moTa: "iPad Air M2 mới nhất 2024, 128GB WiFi. Màn hình 11 inch Liquid Retina. Hàng chính hãng Apple VN/A.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    ],
    giaKhoiDiem: 12000000,
    giaHienTai: 14500000,
    soLuotDauGia: 20,
    thoiGianBatDau: "2024-12-10T10:00:00",
    thoiGianKetThuc: "2024-12-15T18:00:00",
    thoiGianTao: "2024-12-10T09:30:00", // 5 ngày trước
    trangThai: "COMPLETED",
    buocGia: 500000,
    tuDongGiaHan: false,
    nguoiBan: {
      userid: "seller-001",
      username: "techstore",
      hoVaTen: "Nguyễn Văn Tech",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=techstore",
    },
    danhMuc: {
      id: "cat-4",
      tenDanhMuc: "Máy tính bảng",
    },
    nguoiThang: {
      userid: "bidder-001",
      username: "bidder123",
      hoVaTen: "Nguyễn Văn A",
    },
  },
  {
    id: "5",
    tenSanPham: "Samsung Galaxy S24 Ultra",
    moTa: "Samsung Galaxy S24 Ultra 12GB/256GB. Hàng chính hãng Samsung Việt Nam. Bảo hành 12 tháng.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    ],
    giaKhoiDiem: 20000000,
    giaHienTai: 23800000,
    soLuotDauGia: 18,
    thoiGianBatDau: "2024-12-08T09:00:00",
    thoiGianKetThuc: "2024-12-13T20:00:00",
    thoiGianTao: "2024-12-08T08:00:00", // 7 ngày trước
    trangThai: "COMPLETED",
    buocGia: 500000,
    tuDongGiaHan: false,
    nguoiBan: {
      userid: "seller-003",
      username: "mobileshop",
      hoVaTen: "Lê Văn Mobile",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=mobileshop",
    },
    danhMuc: {
      id: "cat-1",
      tenDanhMuc: "Điện thoại",
    },
    nguoiThang: {
      userid: "bidder-002",
      username: "buyer456",
      hoVaTen: "Trần Thị B",
    },
  },
  {
    id: "6",
    tenSanPham: "AirPods Pro 2nd Gen",
    moTa: "AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động, case sạc USB-C. Fullbox chính hãng Apple.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
    ],
    giaKhoiDiem: 4500000,
    giaHienTai: 4500000,
    soLuotDauGia: 0,
    thoiGianBatDau: "2024-12-05T10:00:00",
    thoiGianKetThuc: "2024-12-10T18:00:00",
    thoiGianTao: "2024-12-05T09:00:00", // 10 ngày trước
    trangThai: "CANCELLED",
    buocGia: 200000,
    tuDongGiaHan: false,
    nguoiBan: {
      userid: "seller-002",
      username: "audiomart",
      hoVaTen: "Trần Thị Audio",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=audiomart",
    },
    danhMuc: {
      id: "cat-3",
      tenDanhMuc: "Âm thanh",
    },
  },
  {
    id: "7",
    tenSanPham: "Samsung Galaxy Watch 6 Classic",
    moTa: "Galaxy Watch 6 Classic 47mm. Chống nước 5ATM, đo SpO2, ECG. Hàng chính hãng Samsung.",
    hinhAnh: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    ],
    giaKhoiDiem: 6000000,
    giaHienTai: 6800000,
    soLuotDauGia: 10,
    thoiGianBatDau: "2024-12-22T08:00:00",
    thoiGianKetThuc: "2024-12-27T16:00:00",
    thoiGianTao: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    trangThai: "ACTIVE",
    buocGia: 200000,
    tuDongGiaHan: true,
    nguoiBan: {
      userid: "seller-003",
      username: "mobileshop",
      hoVaTen: "Lê Văn Mobile",
      anhDaiDien: "https://api.dicebear.com/7.x/avataaars/svg?seed=mobileshop",
    },
    danhMuc: {
      id: "cat-5",
      tenDanhMuc: "Đồng hồ thông minh",
    },
  },
];

// Mock bids
export const mockBids: MockBid[] = [
  {
    id: "bid-1",
    productId: "1",
    nguoiDauGia: {
      userid: "bidder-001",
      username: "buyer2024",
    },
    giaRa: 28500000,
    thoiGian: "2024-12-23T14:30:00",
  },
  {
    id: "bid-2",
    productId: "1",
    nguoiDauGia: {
      userid: "current-user",
      username: "myusername",
    },
    giaRa: 28000000,
    thoiGian: "2024-12-23T13:45:00",
  },
  {
    id: "bid-3",
    productId: "1",
    nguoiDauGia: {
      userid: "bidder-002",
      username: "auctionlover",
    },
    giaRa: 27500000,
    thoiGian: "2024-12-23T12:20:00",
  },
];

// Mock questions & answers
export const mockQuestions: MockQuestion[] = [
  {
    id: "q-1",
    productId: "1",
    cauHoi: "Máy có còn bảo hành không ạ?",
    cauTraLoi:
      "Dạ máy còn nguyên seal, chưa active nên bảo hành 12 tháng tính từ ngày kích hoạt ạ.",
    nguoiHoi: {
      userid: "bidder-001",
      username: "buyer2024",
    },
    thoiGianHoi: "2024-12-22T10:00:00",
    thoiGianTraLoi: "2024-12-22T10:15:00",
  },
  {
    id: "q-2",
    productId: "1",
    cauHoi: "Shop có hỗ trợ ship COD không ạ?",
    cauTraLoi: "Dạ có ạ, shop hỗ trợ COD toàn quốc. Phí ship tùy theo khu vực.",
    nguoiHoi: {
      userid: "bidder-002",
      username: "techfan",
    },
    thoiGianHoi: "2024-12-22T15:30:00",
    thoiGianTraLoi: "2024-12-22T16:00:00",
  },
  {
    id: "q-3",
    productId: "1",
    cauHoi: "Máy có phụ kiện gì đi kèm ạ?",
    nguoiHoi: {
      userid: "bidder-003",
      username: "shopper123",
    },
    thoiGianHoi: "2024-12-23T09:00:00",
  },
];

// Helper functions
export const getMockProductsByStatus = (
  status: "ACTIVE" | "COMPLETED" | "CANCELLED"
) => {
  return mockProducts.filter((p) => p.trangThai === status);
};

export const getMockProductById = (id: string) => {
  return mockProducts.find((p) => p.id === id);
};

export const getMockBidsByProductId = (productId: string) => {
  return mockBids.filter((b) => b.productId === productId);
};

export const getMockQuestionsByProductId = (productId: string) => {
  return mockQuestions.filter((q) => q.productId === productId);
};
