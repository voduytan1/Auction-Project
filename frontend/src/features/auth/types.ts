export interface User {
  userid: string;
  username: string;
  email: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  avatar?: string;
  hoVaTen?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  hoVaTen?: string;
}

export interface LoginResponse {
  accessToken: string;
  userid: string;
  username: string;
  vaitro: "BIDDER" | "SELLER" | "ADMIN";
  avatar?: string;
  email: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
