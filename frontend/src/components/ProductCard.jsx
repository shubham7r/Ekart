import { ShoppingCart } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const ProductCard = ({ product, loading }) => {
  const { _id, productImg, productPrice, productName } = product || {};

  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  // 🛒 Add to Cart Function
  const addToCart = async () => {
    try {
      if (!accessToken) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId: _id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product added to cart");

        // ✅ Update Redux cart
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      {/* IMAGE */}
      <div className="w-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            src={productImg?.[0]?.url}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="px-3 py-3 space-y-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[120px] h-4" />
          <Skeleton className="w-full h-9" />
        </div>
      ) : (
        <div className="px-3 py-3 space-y-1">
          <h1 className="font-semibold line-clamp-2">{productName}</h1>
          <h2 className="font-bold text-lg">₹{productPrice}</h2>

          {/* 🛒 Add to Cart Button */}
          <Button
            onClick={addToCart}
            className="bg-pink-600 hover:bg-pink-700 w-full mt-2"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
