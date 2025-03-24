import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import './FilterPrice.css';

const FilterPrice = ({ minPrice, maxPrice, setMinPrice, setMaxPrice, setPage, setBooks, setHasMore }) => {
  // Set reasonable default values
  const defaultMin = 0;
  const defaultMax = 1000000;

  // Price range state
  const [priceRange, setPriceRange] = useState({
    min: defaultMin,
    max: defaultMax,
    currentMin: minPrice,
    currentMax: maxPrice
  });

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '0đ';
    }
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const handleSliderChange = (event, newValue) => {
    console.log(newValue);
    setPriceRange(prev => ({
      ...prev,
      currentMin: newValue[0],
      currentMax: newValue[1]
    }));
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
    setPage(1);
    setBooks([]);
    setHasMore(true);
  };

  return (
    <div className="item-filter price-filter">
      <h6>GIÁ</h6>

      <div className="price-range">
        <div className="price-display">
          <span>{formatPrice(priceRange.currentMin)}</span> -
          <span>{formatPrice(priceRange.currentMax)}</span>
        </div>
        <Slider
          value={[priceRange.currentMin, priceRange.currentMax]}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={priceRange.min}
          max={priceRange.max}
        />
      </div>

      <hr />
    </div>
  );
};

export default FilterPrice;
