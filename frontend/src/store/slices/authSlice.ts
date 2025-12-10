import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { User, JWTPayload } from "../../features/auth/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
  loading: false,
};

// Check if token is valid on init
if (initialState.accessToken) {
  try {
    const decoded = jwtDecode<JWTPayload>(initialState.accessToken);
    if (decoded.exp * 1000 > Date.now()) {
      initialState.isAuthenticated = true;
      initialState.user = {
        id: decoded.sub,
        email: decoded.email,
        fullName: decoded.fullName,
        role: decoded.role,
        rating: decoded.rating || 0,
        totalRatings: decoded.totalRatings || 0,
      };
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      initialState.accessToken = null;
      initialState.refreshToken = null;
    }
  } catch {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    initialState.accessToken = null;
    initialState.refreshToken = null;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, updateUser, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
