/**
 * Helper functions for search feature
 */

/**
 * Chuyển tiếng Việt có dấu sang không dấu
 * Hỗ trợ full-text search tiếng Việt
 */
export const removeVietnameseTones = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

/**
 * Format tiền tệ theo định dạng VND
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Tính thời gian còn lại của phiên đấu giá
 */
export const getTimeRemaining = (endTime: string) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  if (diff <= 0) return "Đã kết thúc";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} ngày ${hours} giờ`;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  return `${minutes} phút`;
};

/**
 * Check xem sản phẩm có phải là mới đăng hay không
 * @param createdAt - Thời điểm tạo sản phẩm
 * @param thresholdMinutes - Ngưỡng phút để coi là "mới" (default: 10 phút)
 */
export const isNewProduct = (createdAt: string, thresholdMinutes = 10) => {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const diffMinutes = (now - created) / (1000 * 60);
  return diffMinutes <= thresholdMinutes;
};
