import React, { useEffect, useState } from "react";
import axios from "axios";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/productSlice";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 99999]);  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const dispatch = useDispatch(); 
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getallproducts",
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  console.log(allProducts);

  return (
    <div className="pt-20 pb-10">

      <div className="max-w-7xl mx-auto flex gap-7">
        {/* Sidebar */}
        <FilterSidebar allProducts={allProducts} priceRange={priceRange} setPriceRange={setPriceRange} search={search} setSearch={setSearch} category={category} setCategory={setCategory} brand={brand} setBrand={setBrand}/>

        {/* Main Section */}
        <div className="flex flex-col flex-1">
          {/* Sort */}
          <div className="flex justify-end mb-4">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowtohigh">Price: Low to High</SelectItem>
                  <SelectItem value="hightolow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} loading={loading} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
