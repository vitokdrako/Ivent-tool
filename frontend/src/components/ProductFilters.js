import React from 'react';
import './ProductFilters.css';

const ProductFilters = ({ 
  categories,
  subcategories,
  colors,
  selectedCategory,
  selectedSubcategory,
  selectedColor,
  onCategoryChange,
  onSubcategoryChange,
  onColorChange
}) => {
  return (
    <div className="product-filters">
      <div className="filter-group">
        <label className="filter-label">Категорія</label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="filter-select"
        >
          <option value="">Всі категорії</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Підкатегорія</label>
        <select
          value={selectedSubcategory || ''}
          onChange={(e) => onSubcategoryChange(e.target.value || null)}
          className="filter-select"
          disabled={!subcategories.length}
        >
          <option value="">Всі підкатегорії</option>
          {subcategories.map((subcat, index) => (
            <option key={index} value={subcat}>
              {subcat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Колір</label>
        <select
          value={selectedColor || ''}
          onChange={(e) => onColorChange(e.target.value || null)}
          className="filter-select"
        >
          <option value="">Всі кольори</option>
          {colors.map((color, index) => (
            <option key={index} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
