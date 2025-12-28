/**
 * Transaction/Order types matching backend
 */

export type TransactionStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_COMPLETED"
  | "AWAITING_SHIPMENT"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface Transaction {
  transactionId: number;
  productId: number;
  tenSanPham?: string; // productName
  anhDaiDienSanPham?: string;
  buyerId: string;
  tenNguoiMua?: string; // buyerName
  sellerId: string;
  tenNguoiBan?: string; // sellerName
  gia: number; // giaCuoiCung
  trangThai: TransactionStatus;
  diaChiGiaoHang?: string;
  maVanDon?: string;
  phuongThucThanhToan?: string; // paymentMethod
  thoiGianThanhToan?: string;
  thoiGianGiaoHang?: string;
  thoiGianNhanHang?: string;
  createdAt?: string;
  updatedAt?: string;

  // Aliases for backward compatibility
  productName?: string;
  buyerName?: string;
  sellerName?: string;
  giaCuoiCung?: number;
  paymentMethod?: string;
}

export interface PaymentRequest {
  transactionId: number;
  paymentMethod: "MOMO" | "ZALOPAY" | "VNPAY" | "STRIPE" | "PAYPAL";
  amount: number;
}

export interface ShippingAddressRequest {
  transactionId: number;
  diaChiGiaoHang: string;
}

export interface TrackingNumberRequest {
  transactionId: number;
  maVanDon: string;
}

export interface DeliveryConfirmRequest {
  transactionId: number;
}

export interface RatingRequest {
  transactionId: number;
  rating: number; // -1 or +1
  comment?: string;
}

export interface Rating {
  id: number;
  transactionId: number;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

// Helper to get step number from status
export function getStepFromStatus(status: TransactionStatus): number {
  switch (status) {
    case "PENDING_PAYMENT":
      return 0; // Thanh toán
    case "PAYMENT_COMPLETED":
      return 1; // Nhập địa chỉ giao hàng
    case "AWAITING_SHIPMENT":
      return 2; // Đã nhập địa chỉ, chờ seller gửi hàng
    case "SHIPPED":
      return 3; // Đã gửi hàng, chờ buyer xác nhận nhận hàng
    case "COMPLETED":
      return 4; // Hoàn tất - Kết thúc
    case "CANCELLED":
      return -1;
    default:
      return 0;
  }
}
