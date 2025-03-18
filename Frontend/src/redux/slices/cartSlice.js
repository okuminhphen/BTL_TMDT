import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addItemToCart,
  getCart,
  updateItemInCart,
  deleteItemInCart,
} from "../../service/cartService";

// Async action để lấy giỏ hàng từ API
// Lấy giỏ hàng từ API
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.currentUser?.userId;

      let response = await getCart(userId);

      if (response?.data?.EC === 0 && Array.isArray(response.data.DT)) {
        return response.data.DT; // Lấy đúng mảng sản phẩm
      } else {
        return rejectWithValue("Dữ liệu giỏ hàng không hợp lệ!");
      }
      // Nếu API trả về null/undefined, trả về mảng rỗng
    } catch (error) {
      return rejectWithValue("Lỗi khi lấy giỏ hàng!");
    }
  }
);

// Async action để thêm sản phẩm vào giỏ hàng API
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (cartItem, { rejectWithValue, dispatch }) => {
    try {
      let response = await addItemToCart(cartItem);
      if (!response || !response.data || response.data.EC !== 0) {
        throw new Error(response.data?.EM || "Thêm vào giỏ hàng thất bại!");
      }

      // Nếu thêm thành công, gọi lại fetchCart để cập nhật danh sách
      dispatch(fetchCart());

      return cartItem; // Trả về sản phẩm vừa thêm để cập nhật state ngay lập tức
    } catch (error) {
      return rejectWithValue("Lỗi khi thêm vào giỏ hàng!");
    }
  }
);

// Cập nhật số lượng sản phẩm
export const updateCartItemQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartProductSizeId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      let response = await updateItemInCart({
        cartProductSizeId,
        quantity,
      });
      if (!response || !response.data || response.data.EC !== 0) {
        throw new Error(response.data?.EM || "Cập nhật số lượng thất bại!");
      }

      // Sau khi cập nhật thành công, lấy lại giỏ hàng
      dispatch(fetchCart());
      return { cartProductSizeId, quantity };
    } catch (error) {
      return rejectWithValue("Lỗi khi cập nhật số lượng!");
    }
  }
);

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItem",
  async (cartProductSizeId, { rejectWithValue, dispatch }) => {
    try {
      let response = await deleteItemInCart(cartProductSizeId);
      if (!response || !response.data || response.data.EC !== 0) {
        throw new Error(response.data?.EM || "Xóa sản phẩm thất bại!");
      }
      // Sau khi xóa thành công, lấy lại giỏ hàng
      dispatch(fetchCart());
      return cartProductSizeId;
    } catch (error) {
      return rejectWithValue("Lỗi khi xóa sản phẩm khỏi giỏ hàng!");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    error: null, // Lưu lỗi nếu có
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý khi lấy giỏ hàng thành công
      .addCase(fetchCart.fulfilled, (state, action) => {
        const cartData = action.payload || []; // Đảm bảo cartData luôn là mảng

        state.cartItems = cartData.map((item) => ({
          ...item,
          images: item.images ? JSON.parse(item.images) : [], // Parse JSON ảnh nếu có
        }));

        state.totalQuantity = state.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.totalPrice = state.cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Xử lý khi thêm sản phẩm thành công
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        console.log("Sản phẩm vừa thêm vào giỏ hàng:", action.payload);

        // Cập nhật ngay lập tức vào Redux state (trước khi fetchCart hoàn thành)
        const existingItem = state.cartItems.find(
          (item) =>
            item.productId === action.payload.productId &&
            item.sizeId === action.payload.sizeId
        );

        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.cartItems.push(action.payload);
        }

        state.totalQuantity += action.payload.quantity;
        state.totalPrice += action.payload.quantity * action.payload.price;

        state.error = null;
      })
      // Xử lý khi thêm sản phẩm thất bại
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
