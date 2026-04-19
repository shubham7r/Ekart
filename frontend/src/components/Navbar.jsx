import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);
  const admin = user?.role === "admin" ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ get fresh token

      if (!token) {
        toast.error("Session expired. Please login again.");
        dispatch(setUser(null));
        navigate("/login");
        return;
      }

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        localStorage.removeItem("accessToken"); // ✅ remove token
        dispatch(setUser(null)); // ✅ clear redux
        toast.success(res.data.message);
        navigate("/login"); // ✅ redirect
      }
    } catch (error) {
      console.error("Logout error:", error);

      // ✅ handle invalid/expired token
      localStorage.removeItem("accessToken");
      dispatch(setUser(null));
      navigate("/login");
    }
  };

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        <div>
          <img src="/Ekart.png" alt="logo" className="w-[100px]" />
        </div>

        <nav className="flex gap-10 items-center">
          <ul className="flex gap-7 items-center text-xl font-semibold">
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/products">Products</Link>
            </li>

            {user && (
              <li>
                <Link to={`/profile/${user._id}`}>Hello {user.firstName}</Link>
              </li>
            )}
            {admin && (
              <li>
                <Link to="/dashboard/sales">Dashboard</Link>
              </li>
            )}
          </ul>

          <Link to="/cart" className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 text-sm">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-pink-600 text-white cursor-pointer"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="bg-gradient-to-l from-blue-600 to-purple-600 text-white cursor-pointer">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
