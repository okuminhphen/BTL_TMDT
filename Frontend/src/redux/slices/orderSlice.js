import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder,
  updateOrderStatus,
  getOrdersByUserId,
} from "../../service/orderService";

// 📌 Lấy danh sách đơn hàng của người dùng
// export const fetchOrders = createAsyncThunk(
//   "orders/fetchOrders",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const userId = getState().user.currentUser?.userId;
//       if (!userId) return rejectWithValue("Người dùng chưa đăng nhập!");

//       const response = await fetchOrder(`${API_URL}?userId=${userId}`);

//       if (response.data?.EC === 0) {
//         return response.data.DT;
//       } else {
//         return rejectWithValue(response.data?.EM || "Không thể lấy đơn hàng!");
//       }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng!"
//       );
//     }
//   }
// );
export const fetchOrdersUserThunk = createAsyncThunk(
  "order/fetchOrdersUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.currentUser?.userId;
      if (!userId) return rejectWithValue("Người dùng chưa đăng nhập!");
      const response = await getOrdersByUserId(userId);
      if (response.data.EC !== "0" || !response.data.DT) {
        return rejectWithValue(response.data);
      }

      return response.data.DT;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng!"
      );
    }
  }
);
// 📌 Tạo đơn hàng mới
export const createOrderThunk = createAsyncThunk(
  "order/createOrder",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.currentUser?.userId;
      if (!userId) return rejectWithValue("Người dùng chưa đăng nhập!");

      const response = await createOrder(orderData);

      if (response.data.EC !== "0") {
        return rejectWithValue(response.data); // 🔥 Lỗi sẽ bị đẩy vào `handleError`
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo đơn hàng!"
      );
    }
  }
);

// 📌 Cập nhật đơn hàng
export const updateOrderStatusThunk = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, updatedData);
      if (response.data?.EC === "0") {
        return response.data.DT;
      } else {
        return rejectWithValue(
          response.data?.EM || "Không thể cập nhật đơn hàng!"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật đơn hàng!"
      );
    }
  }
);

// 📌 Xóa đơn hàng
// export const deleteOrder = createAsyncThunk(
//   "order/deleteOrder",
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(`${API_URL}/${orderId}`);

//       if (response.data?.EC === 0) {
//         return orderId; // Trả về ID để xóa khỏi Redux store
//       } else {
//         return rejectWithValue(response.data?.EM || "Không thể xóa đơn hàng!");
//       }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Lỗi khi xóa đơn hàng!"
//       );
//     }
//   }
// );

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    tempOrder: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    addOrderTemp: (state, action) => {
      state.tempOrder = action.payload; // Lưu đơn hàng tạm thời vào Redux
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 Lấy danh sách đơn hàng người dùng
      .addCase(fetchOrdersUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersUserThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrdersUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // 📌 Tạo đơn hàng
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orders.push(action.payload); // Thêm đơn hàng vào Redux khi backend trả về
        state.tempOrder = null; // Xóa đơn hàng tạm khi đã lưu thành công
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 📌 Cập nhật đơn hàng
      // 📌 Cập nhật đơn hàng
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const updatedOrder = action.payload; // Lấy đơn hàng đã cập nhật từ backend
        const index = state.orders.findIndex(
          (order) => order.id === updatedOrder.id
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder; // Cập nhật đơn hàng trong danh sách
        } else {
          state.orders.push(updatedOrder); // Nếu chưa có, thêm vào danh sách
        }
      })

      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { addOrderTemp } = orderSlice.actions;
export default orderSlice.reducer;
