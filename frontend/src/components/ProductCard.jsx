import { ShoppingCart } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product || {};

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

          <Button className="bg-pink-600 hover:bg-pink-700 w-full mt-2">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
