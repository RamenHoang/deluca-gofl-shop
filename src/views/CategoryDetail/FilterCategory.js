import React from 'react';

const FilterCategory = ({ categories, selectedCategories, setSelectedCategories, setPage, setBooks, setHasMore }) => {

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const isChecked = e.target.checked;

    let newSelectedCategories;
    if (isChecked) {
      newSelectedCategories = [...selectedCategories, categoryId];
    } else {
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId);
    }

    setPage(1);
    setBooks([]);
    setHasMore(true);
    setSelectedCategories(newSelectedCategories);
  };

  return <>
    {
      categories.length > 0 && (
        <div className="item-filter">
          <h6>DANH MỤC</h6>
          <div>
            {categories.map((category) => (
              <div className="form-check" key={category._id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={category._id}
                  id={`category-${category._id}`}
                  onChange={handleCategoryChange}
                  checked={selectedCategories.includes(category._id)}
                />
                <label className="form-check-label" htmlFor={`category-${category._id}`}>
                  {category.c_name}
                </label>
              </div>
            ))}
          </div>
          <hr />
        </div>
      )
    }
  </>
};

export default FilterCategory;
