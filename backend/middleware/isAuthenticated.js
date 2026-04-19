import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// ================= AUTH MIDDLEWARE =================
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ❌ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ❌ Find user
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Attach user data
    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    // 🔥 Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// ================= ADMIN MIDDLEWARE =================
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
