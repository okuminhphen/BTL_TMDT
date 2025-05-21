import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice"; // Nếu bạn có giỏ hàng
import userReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice";
const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer, // Thêm nếu có giỏ hàng
    user: userReducer,
    orders: orderReducer,
  },
});
export default store;
