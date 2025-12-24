import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  User,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types";
import { authAPI } from "@/services/auth.api";

// Async thunks - Connect với real Backend API
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // Backend trả về: { accessToken, userid, username, vaitro, anhDaiDien, email, hoVaTen }
      // Refresh token được lưu trong HTTP-only cookie
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userId", response.userid);

      const user: User = {
        userid: response.userid,
        username: response.username,
        email: response.email,
        vaitro: response.vaitro,
        anhDaiDien: response.anhDaiDien,
        hoVaTen: response.hoVaTen,
        // Add mock rating data for demo (would come from backend in production)
        tyLeDanhGiaTot: 85, // 85% positive ratings
        diemDanhGia: 85,
        soLuotDanhGia: 20,
      };

      // Lưu user info vào localStorage để restore sau khi F5
      localStorage.setItem("user", JSON.stringify(user));

      return {
        user,
        token: response.accessToken,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userId", response.userid);

      const user: User = {
        userid: response.userid,
        username: response.username,
        email: response.email,
        vaitro: response.vaitro,
        anhDaiDien: response.anhDaiDien,
        hoVaTen: response.hoVaTen,
        // Add mock rating data for demo (would come from backend in production)
        tyLeDanhGiaTot: 85, // 85% positive ratings
        diemDanhGia: 85,
        soLuotDanhGia: 20,
      };

      // Lưu user info vào localStorage để restore sau khi F5
      localStorage.setItem("user", JSON.stringify(user));

      return {
        user,
        token: response.accessToken,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken(userId);
      localStorage.setItem("accessToken", response.accessToken);
      return {
        token: response.accessToken,
        expiresIn: response.expiresIn,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Refresh token thất bại"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    // Ignore logout errors - we still want to clear local state
    console.warn(
      "Logout API call failed, but clearing local state anyway:",
      error
    );
  }
  // Clear all auth data from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  return null;
});

// State interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Helper function để restore user từ localStorage
const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr) as User;
      // Add default rating for demo if not present
      if (user.tyLeDanhGiaTot === undefined) {
        user.tyLeDanhGiaTot = 85; // Default 85% good rating for demo
        user.diemDanhGia = 85;
        user.soLuotDanhGia = 20;
      }
      return user;
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
  }
  return null;
};

// Initial state - Restore từ localStorage nếu có
const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

// Slice - Flux pattern với Redux Toolkit
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      if (action.payload.user?.userid) {
        localStorage.setItem("userId", action.payload.user.userid);
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem("userId", action.payload.user.userid);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem("userId", action.payload.user.userid);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    });

    // Refresh Token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
