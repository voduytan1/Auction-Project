export interface UserProfile {
  userid: string;
  username: string;
  email: string;
  hoVaTen?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
  anhDaiDien?: string;
  vaitro: string;
}

export interface UpdateProfileData {
  hoVaTen?: string;
  email?: string;
  diaChi?: string;
  soDienThoai?: string;
  ngaySinh?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
