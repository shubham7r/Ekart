import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const { id: productId } = useParams();

  const { products } = useSelector((store) => store.product);

  const product = products?.find((item) => item._id === productId);

  // ✅ Prevent crash
  if (!product) {
    return <h1 className="text-center mt-20">Loading...</h1>;
  }

  return (
    <div className="pt-20 py-10 max-w-7xl mx-auto">
      <Breadcrumbs product={product} />

      <div className="mt-10 grid grid-cols-2 items-start gap-6">
        <ProductImg images={product?.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;
