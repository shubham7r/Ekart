import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Verify from "@/pages/verify";
import VerifyEmail from "@/pages/VerifyEmail";
import Profile from "@/pages/Profile";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import SingleProduct from "@/pages/SingleProduct";

// Dashboard Layout + Admin Pages
import Dashboard from "@/pages/Dashboard";
import AdminSales from "@/pages/admin/AdminSales";
import AddProduct from "@/pages/admin/AddProduct";
import AdminProduct from "@/pages/admin/AdminProduct";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";

const router = createBrowserRouter([
  // 🌐 Home
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },

  // 🔐 Auth
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // 📧 Verify
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/verify/:token",
    element: <VerifyEmail />,
  },

  // 👤 Profile
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <Profile />
          <Footer />
        </>
      </ProtectedRoute>
    ),
  },

  // 🛍️ Products
  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
      </>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        <SingleProduct />
      </>
    ),
  },

  // 🛒 Cart
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <Cart />
        </>
      </ProtectedRoute>
    ),
  },

  // 📊 Dashboard (Admin)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "sales", // ✅ Now /dashboard/sales works
        element: <AdminSales />,
      },
      {
        index: true, // default page (/dashboard)
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
