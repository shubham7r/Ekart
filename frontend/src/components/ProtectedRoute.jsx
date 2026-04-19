import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((store) => store.user);

  // 🚫 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
