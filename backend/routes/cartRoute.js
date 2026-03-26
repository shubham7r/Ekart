import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// ✅ Correct usage (middleware, NOT function call)
router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateQuantity);
router.delete("/remove", isAuthenticated, removeFromCart);
router.delete("/clear", isAuthenticated, clearCart);

export default router;
