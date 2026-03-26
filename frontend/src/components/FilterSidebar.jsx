import React, { useMemo } from "react";

function FilterSidebar({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  allProducts = [],
  priceRange,
  setPriceRange,
}) {
  const UniqueCategory = useMemo(() => {
    return [...new Set(allProducts.map((item) => item.category))];
  }, [allProducts]);

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
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="category"
            value=""
            checked={category === ""}
            onChange={() => setCategory("")}
          />
          <label>All</label>
        </div>

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

      {/* Brand */}
      <h1 className="mt-5 font-semibold text-xl">Brand</h1>

      <select
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
      >
        <option value="">All Brands</option>

        {UniqueBrand.map((item, index) => (
          <option key={index} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>

      <div className="flex flex-col gap-2">
        <label>
          ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= priceRange[1]) {
                setPriceRange([value, priceRange[1]]);
              }
            }}
            className="w-20 p-1 border rounded"
          />

          <span>-</span>

          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= priceRange[0]) {
                setPriceRange([priceRange[0], value]);
              }
            }}
            className="w-20 p-1 border rounded"
          />
        </div>

        {/* Sliders */}
        <input
          type="range"
          min="0"
          max="5000"
          value={priceRange[0]}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value <= priceRange[1]) {
              setPriceRange([value, priceRange[1]]);
            }
          }}
        />

        <input
          type="range"
          min="0"
          max="99999"
          value={priceRange[1]}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= priceRange[0]) {
              setPriceRange([priceRange[0], value]);
            }
          }}
        />
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="bg-pink-600 text-white mt-5 w-full p-2 rounded"
      >
        Reset Filters
      </button>
    </div>
  );
}

export default FilterSidebar;
