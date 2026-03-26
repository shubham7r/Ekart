import React, { useEffect, useState, useMemo } from "react";
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
  const [sortOrder, setSortOrder] = useState("");

  const dispatch = useDispatch();

  // 🔥 Fetch Products
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
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // 🔥 FILTER + SORT LOGIC
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // 🔍 Search
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 📂 Category
    if (category !== "") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // 🏷️ Brand
    if (brand !== "") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    // 💰 Price Range
    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    // 🔃 Sorting
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    return filtered;
  }, [allProducts, search, category, brand, priceRange, sortOrder]);

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* Sidebar */}
        <FilterSidebar
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
        />

        {/* Main Section */}
        <div className="flex flex-col flex-1">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">
              {filteredProducts.length} Products Found
            </h2>

            {/* Sort Dropdown */}
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Loading */}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
