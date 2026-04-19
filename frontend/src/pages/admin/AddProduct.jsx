import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";

import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { Loader2 } from "lucide-react";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    category: "",
    brand: "",
    productImg: [],
  });

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!productData.productName || !productData.productPrice) {
      toast.error("Please fill all required fields");
      return;
    }

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();

    formData.append("productName", productData.productName);
    formData.append("productPrice", Number(productData.productPrice));
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    productData.productImg.forEach((img) => {
      formData.append("productImg", img);
    });

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // 🔥 IMPORTANT FIX → fetch all products again
        const updated = await axios.get(
          "http://localhost:8000/api/v1/product/getallproducts",
        );

        dispatch(setProducts(updated.data.products));

        // reset form
        setProductData({
          productName: "",
          productPrice: "",
          productDesc: "",
          category: "",
          brand: "",
          productImg: [],
        });
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-[350px] py-10 pr-20 mx-auto px-4 bg-gray-100 min-h-screen">
      <form onSubmit={submitHandler}>
        <Card className="w-full my-20">
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>Enter product details below</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  type="text"
                  name="productName"
                  value={productData.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  name="productPrice"
                  value={productData.productPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Brand</Label>
                  <Input
                    type="text"
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input
                    type="text"
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                />
              </div>

              <ImageUpload
                productData={productData}
                setProductData={setProductData}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {loading ? (
                <span className="flex gap-2 items-center">
                  <Loader2 className="animate-spin" />
                  Please wait
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddProduct;
