import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  User,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types";
import { authAPI } from "@/services/auth.api";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);

      const user: User = {
        userid: response.userid,
        username: response.username,
        email: response.email,
        vaitro: response.vaitro,
        anhDaiDien: response.anhDaiDien,
        hoVaTen: response.hoVaTen,
        tyLeDanhGiaTot: 85,
        diemDanhGia: 85,
        soLuotDanhGia: 20,
      };

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

      const user: User = {
        userid: response.userid,
        username: response.username,
        email: response.email,
        vaitro: response.vaitro,
        anhDaiDien: response.anhDaiDien,
        hoVaTen: response.hoVaTen,
        tyLeDanhGiaTot: 85,
        diemDanhGia: 85,
        soLuotDanhGia: 20,
      };

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
      if (!userId) throw new Error("User ID is invalid");

      const response = await authAPI.refreshToken(userId);
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
    console.warn("Logout API failed, clearing local state anyway:", error);
  }
  return null;
});

// State interface
interface AuthState {
  userId: string | null;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const initialState: AuthState = {
  userId: null,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitializing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string | null }>
    ) => {
      state.userId = action.payload.user.userid; // Lấy trực tiếp, không clean
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setUserIdFromUser: (state, action: PayloadAction<string>) => {
      // Listener middleware sẽ gọi action này để extract userId từ user.userid
      state.userId = action.payload;
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
        state.userId = action.payload.user.userid;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
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
        state.userId = action.payload.user.userid;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userId = null;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
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
        state.userId = null;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // REHYDRATE được handle bởi listener middleware ở store/index.ts
  },
});

export const { clearError, setCredentials, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
