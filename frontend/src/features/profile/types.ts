export interface UserProfile {
  userid: string;
  username: string;
  email: string;
  hoVaTen?: string;
  ngaySinh?: string;
  avatar?: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  diemDanhGia?: number;
  soLanDanhGia?: number;
}

export interface UpdateProfileData {
  hoVaTen?: string;
  email?: string;
  ngaySinh?: string;
  avatar?: string;
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
