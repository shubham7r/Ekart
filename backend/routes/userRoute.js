import express from "express";
import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

/* ================= PASSWORD ================= */
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);

/* ================= USER ================= */
router.get("/all-users", isAuthenticated, allUser);
router.get("/get-user/:userId", isAuthenticated, getUserById);

/* ================= PROFILE UPDATE ================= */
router.put(
  "/update/:id",
  isAuthenticated,
  singleUpload, // multer image upload
  updateUser,
);

export default router;
