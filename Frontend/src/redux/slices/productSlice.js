import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../service/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    let response = await getProducts();

    return response.data.DT;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [], // Danh sách sản phẩm
    status: "idle", // Trạng thái: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productSlice.reducer;
