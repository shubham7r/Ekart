import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

// ✅ ADD PRODUCT
router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);

// ✅ GET ALL PRODUCTS
router.get("/getallproducts", getAllProduct);

// ✅ DELETE PRODUCT
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteProduct);

// ✅ UPDATE PRODUCT 
router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  updateProduct,
);

export default router;
