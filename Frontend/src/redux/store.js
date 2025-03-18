import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice"; // Nếu bạn có giỏ hàng
import userReducer from "./slices/userSlice";
const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer, // Thêm nếu có giỏ hàng
    user: userReducer,
  },
});
export default store;
