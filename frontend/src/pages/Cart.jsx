import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const userLogo = "https://via.placeholder.com/100";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((store) => store.product);
  const items = cart?.items || [];

  const API = "http://localhost:8000/api/v1/cart";
  const accessToken = localStorage.getItem("accessToken");

  // ================= LOAD CART =================
  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log("LOAD CART ERROR:", error.response?.data || error.message);
    }
  };

  // ================= UPDATE =================
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= REMOVE =================
  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      toast.error("Failed to remove product");
    }
  };

  // ================= CALCULATIONS =================
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : items.length > 0 ? 10 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  // ================= USE EFFECT =================
  useEffect(() => {
    if (accessToken) {
      loadCart();
    }
  }, [dispatch]);

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {items.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>

            {items.map((product, index) => {
              const productData = product?.productId;

              return (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    {/* LEFT */}
                    <div className="flex items-center gap-4 w-[350px]">
                      <img
                        src={productData?.productImg?.[0]?.url || userLogo}
                        alt="product"
                        className="w-20 h-20 rounded"
                      />

                      <div>
                        <h1 className="font-semibold">
                          {productData?.productName}
                        </h1>
                        <p>₹{productData?.productPrice}</p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">
                      {/* Quantity */}
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(productData?._id, "decrease")
                          }
                        >
                          -
                        </Button>

                        <span>{product.quantity}</span>

                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(productData?._id, "increase")
                          }
                        >
                          +
                        </Button>
                      </div>

                      {/* Price */}
                      <p className="font-semibold">
                        ₹
                        {(productData?.productPrice || 0) *
                          (product.quantity || 1)}
                      </p>

                      {/* Remove */}
                      <p
                        onClick={() => handleRemove(productData?._id)}
                        className="flex text-red-500 items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* RIGHT */}
          <div>
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length})</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="Promo Code" />
                  <Button variant="outline">Apply</Button>
                </div>

                <Button className="w-full bg-pink-600 text-white">
                  PLACE ORDER
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <ShoppingCart className="w-16 h-16 text-pink-600" />
          <h2 className="mt-4 text-xl font-bold">Your Cart is Empty</h2>

          <Button
            onClick={() => navigate("/products")}
            className="mt-4 bg-pink-600 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
