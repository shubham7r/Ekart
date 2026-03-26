import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// 🔐 AUTH MIDDLEWARE
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// 🔐 ADMIN MIDDLEWARE (🔥 THIS WAS MISSING)
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
