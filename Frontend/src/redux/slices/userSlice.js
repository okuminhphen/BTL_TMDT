import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  updateUserById,
  updatePasswordById,
  fetchAllUsers,
} from "../../service/userService";
import { toast } from "react-toastify";

// Async thunk để lấy danh sách người dùng
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAllUsers();
      console.log("response", response.data); // Log toàn bộ response

      if (response.data.EC === "0") {
        // Kiểm tra dữ liệu trả về có hợp lệ không
        console.log("users data:", response.data.DT);
        return response.data.DT;
      } else {
        return thunkAPI.rejectWithValue(response.data.EM);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Không thể kết nối đến server");
    }
  }
);
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
export const updateUserThunk = createAsyncThunk(
  "user/update",
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateUserById(userId, updatedData);

      if (response && response.data && +response.data.EC === 0) {
        const updatedUser = response.data.DT;

        // Cập nhật sessionStorage nếu cần
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
      } else {
        return rejectWithValue(response.data.EM || "Cập nhật thất bại");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.EM || "Lỗi khi cập nhật thông tin"
      );
    }
  }
);
export const updatePasswordThunk = createAsyncThunk(
  "user/updatePassword",
  async ({ userId, updatedPassword }, { rejectWithValue }) => {
    try {
      const response = await updatePasswordById(userId, updatedPassword);

      if (response && response.data) {
        const updatedPassword = response.data.DT;

        if (+response.data.EC === 0) {
          toast.success(response.data.EM);
          return updatedPassword;
        } else if (+response.data.EC === 1) {
          toast.error(response.data.EM);
          return rejectWithValue(response.data.EM);
        }
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.EM || "Lỗi khi cập nhật mật khẩu"
      );
    }
  }
);
const initialState = {
  currentUser: JSON.parse(sessionStorage.getItem("user")) || null,
  isAuthenticated: !!sessionStorage.getItem("user"),
  users: [], // 👈 Thêm dòng này
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        state.users = action.payload;
        console.log("Fetched users in reducer", action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Cập nhật thất bại";
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
