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

// Register user
router.post("/register", register);

// Verify email
router.post("/verify", verify);

// Resend verification
router.post("/reverify", reVerify);

// Login
router.post("/login", login);

// Logout (protected)
router.post("/logout", isAuthenticated, logout);

/* ================= PASSWORD ================= */

// Forgot password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Change password
router.post("/change-password", changePassword);

/* ================= USER ================= */

// Get all users (protected)
router.get("/all-users", isAuthenticated, allUser);

// Get single user (protected)
router.get("/get-user/:userId", isAuthenticated, getUserById);

/* ================= PROFILE UPDATE ================= */

// Update user profile (protected + image upload)
router.put("/update/:id", isAuthenticated, singleUpload, updateUser);

export default router;
