export interface User {
  userid: string;
  username: string;
  email: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  thoiHanBanHang?: string; // LocalDateTime - seller expiration date
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string; // LocalDate
  anhDaiDien?: string;
  diemDanhGia?: number; // Rating score (Double)
  createdAt?: string;
  updatedAt?: string;
  // Computed fields for UI
  soLuongDanhGia?: number; // Number of ratings received (computed)
  tyLeDanhGiaTot?: number; // Percentage of positive ratings 0-100 (computed)
}

export interface LoginRequest {
  username: string;
  password: string;
  recaptchaToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string; // LocalDate format: YYYY-MM-DD
  recaptchaToken?: string; // reCAPTCHA v3 token
  otp?: string; // OTP code from email
}

export interface LoginResponse {
  accessToken: string;
  userid: string;
  username: string;
  email: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  thoiHanBanHang?: string; // LocalDateTime
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string; // LocalDate
  diemDanhGia?: number;
  anhDaiDien?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  userid: string;
  username: string;
  email: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  thoiHanBanHang?: string;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diemDanhGia?: number;
  soLuongDanhGia?: number;
  anhDaiDien?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
