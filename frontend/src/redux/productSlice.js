import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  cart: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // 📦 Set Products
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // 🛒 Set Cart (🔥 IMPORTANT FIX)
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // 🛒 Add to Cart (local)
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.cart.find((p) => p._id === item._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
    },

    // ❌ Remove from Cart
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },

    // 🔄 Clear Cart
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// ✅ Export actions
export const {
  setProducts,
  setCart, // 🔥 ADD THIS
  addToCart,
  removeFromCart,
  clearCart,
} = productSlice.actions;

// ✅ Export reducer
export default productSlice.reducer;
