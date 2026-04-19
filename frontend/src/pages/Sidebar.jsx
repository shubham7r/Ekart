import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PackagePlus, Users, Pencil } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="hidden md:block fixed border-r bg-pink-50 border-pink-200 w-[300px] p-6 h-screen">
      <h2 className="text-2xl font-bold text-center mb-10 text-pink-600">
        Admin Panel
      </h2>

      <div className="space-y-3">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-lg font-semibold transition ${
              isActive
                ? "bg-pink-600 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`
          }
        >
          <LayoutDashboard />
          Dashboard
        </NavLink>

        {/* Add Product */}
        <NavLink
          to="/dashboard/add-product"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-lg font-semibold transition ${
              isActive
                ? "bg-pink-600 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`
          }
        >
          <PackagePlus />
          Add Product
        </NavLink>

        {/* Products */}
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-lg font-semibold transition ${
              isActive
                ? "bg-pink-600 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`
          }
        >
          <LayoutDashboard />
          Products
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-lg font-semibold transition ${
              isActive
                ? "bg-pink-600 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`
          }
        >
          <Pencil />
          Orders
        </NavLink>

        {/* Users */}
        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-lg font-semibold transition ${
              isActive
                ? "bg-pink-600 text-white"
                : "text-gray-700 hover:bg-pink-100"
            }`
          }
        >
          <Users />
          Users
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
