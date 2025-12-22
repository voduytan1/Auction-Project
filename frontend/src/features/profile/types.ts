export interface UserProfile {
  userid: string;
  username: string;
  email: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  anhDaiDien?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  hoVaTen?: string;
  email?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  avatar?: string;
  anhDaiDien?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserRating {
  id: string;
  fromUser: {
    userid: string;
    username: string;
    avatar?: string;
  };
  type: "like" | "dislike";
  comment?: string;
  createdAt: string;
}

export interface RatingStats {
  positive: number;
  negative: number;
  total: number;
  percentage: number;
}
