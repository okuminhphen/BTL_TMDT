import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../service/userService";
// Async thunk để đăng nhập người dùng
export const loginByUser = createAsyncThunk(
  "user/login",
  async ({ emailOrPhone, password }, { rejectWithValue }) => {
    try {
      let response = await loginUser(emailOrPhone, password);

      // Kiểm tra kết quả phản hồi
      if (response && response.data && +response.data.EC === 0) {
        // Lưu vào sessionStorage nếu cần thiết

        let userData = response.data.DT; // Trả về dữ liệu người dùng
        sessionStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else {
        // Nếu API trả về lỗi
        return rejectWithValue(response.data.EM || "Đăng nhập thất bại");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.EM || "Lỗi kết nối đến server"
      );
    }
  }
);

const initialState = {
  currentUser: JSON.parse(sessionStorage.getItem("user")) || null,
  isAuthenticated: !!sessionStorage.getItem("user"),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      sessionStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Đảm bảo mỗi addCase đều nhận được một action type hợp lệ
    builder
      .addCase(loginByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
