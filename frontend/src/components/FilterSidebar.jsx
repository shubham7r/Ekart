import React, { useState, useMemo } from "react";

function FilterSidebar({ allProducts = [], priceRange, setPriceRange }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  // Unique Categories
  const UniqueCategory = useMemo(() => {
    return [...new Set(allProducts.map((item) => item.category))];
  }, [allProducts]);

  // Unique Brands
  const UniqueBrand = useMemo(() => {
    return [...new Set(allProducts.map((item) => item.brand))];
  }, [allProducts]);

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setPriceRange([0, 99999]);
  };

  return (
    <div className="bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
      />

      {/* Category */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>

      <div className="flex flex-col gap-2 mt-3">
        {UniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value={item}
              checked={category === item}
              onChange={() => setCategory(item)}
            />
            <label>{item}</label>
          </div>
        ))}
      </div>

      {/* brands */}
      <h1 className="mt-5 font-semibold text-xl">Brand</h1>

      <select
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
      >
        <option value="">All Brands</option>

        {UniqueBrand.map((item, index) => {
          return <option key={index}>{item.toUpperCase()}</option>;
        })}
      </select>

      {/* price range */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>

      <div className="flex flex-col gap-2">
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="5000"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-20 p-1 border border-gray-300 rounded"
          />

          <span>-</span>

          <input
            type="number"
            min="0"
            max="999999"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-20 p-1 border border-gray-300 rounded"
          />
        </div>

        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange([Number(e.target.value), priceRange[1]])
          }
          className="w-full"
        />

        <input
          type="range"
          min="0"
          max="999999"
          step="100"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-full"
        />
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="bg-pink-600 text-white mt-5 cursor-pointer w-full p-2 rounded"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default FilterSidebar;
