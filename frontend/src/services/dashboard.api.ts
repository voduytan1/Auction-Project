import api from "./api";

// Dashboard API types
export interface UpgradeRequestChartResponse {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface RevenueDataPoint {
  month: number;
  revenue: number;
}

export interface NewUserDataPoint {
  month: number;
  bidder: number;
  seller: number;
}

export interface ProductDataPoint {
  month: number;
  newProduct: number;
  completedProduct: number;
}

export interface CategoryDistribution {
  categoryId: number;
  tenDanhMuc: string;
  soLuongSanPham: number;
}

/**
 * Dashboard API Service
 */
export const dashboardApi = {
  /**
   * Lấy thống kê yêu cầu nâng cấp hôm nay
   */
  getUpgradeRequestToday: async () => {
    const response = await api.get<UpgradeRequestChartResponse>(
      "/admin/dashboard/upgrade-request/today"
    );
    return response.data;
  },

  /**
   * Lấy thống kê yêu cầu nâng cấp tuần này
   */
  getUpgradeRequestThisWeek: async () => {
    const response = await api.get<UpgradeRequestChartResponse>(
      "/admin/dashboard/upgrade-request/this-week"
    );
    return response.data;
  },

  /**
   * Lấy thống kê yêu cầu nâng cấp tháng này
   */
  getUpgradeRequestThisMonth: async () => {
    const response = await api.get<UpgradeRequestChartResponse>(
      "/admin/dashboard/upgrade-request/this-month"
    );
    return response.data;
  },

  /**
   * Lấy dữ liệu doanh thu theo tháng trong năm
   */
  getRevenueThisYear: async () => {
    const response = await api.get<RevenueDataPoint[]>(
      "/admin/dashboard/revenue/this-year"
    );
    return response.data;
  },

  /**
   * Lấy dữ liệu người dùng mới theo tháng trong năm
   */
  getNewUserThisYear: async () => {
    const response = await api.get<NewUserDataPoint[]>(
      "/admin/dashboard/new-user/this-year"
    );
    return response.data;
  },

  /**
   * Lấy dữ liệu sản phẩm mới/hoàn thành theo tháng trong năm
   */
  getProductThisYear: async () => {
    const response = await api.get<ProductDataPoint[]>(
      "/admin/dashboard/product/this-year"
    );
    return response.data;
  },

  /**
   * Lấy phân bố sản phẩm theo danh mục
   */
  getCategoryDistribution: async () => {
    const response = await api.get<CategoryDistribution[]>(
      "/admin/dashboard/categories"
    );
    return response.data;
  },
};
