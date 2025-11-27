import React, { useState } from 'react';
import AvailabilityBadge from './AvailabilityBadge';
import { useAvailability } from '../hooks/useAvailability';
import './ProductCard.css';

const ProductCard = ({ product, onAddToBoard, boardDates }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { availability, loading } = useAvailability(
    product.product_id,
    1,
    boardDates?.startDate,
    boardDates?.endDate
  );

  const handleAdd = async () => {
    if (!boardDates?.startDate || !boardDates?.endDate) {
      alert('Спочатку оберіть дати оренди в мудборді!');
      return;
    }

    if (availability && !availability.is_available) {
      alert(availability.message || 'Товар недоступний на вибрані дати');
      return;
    }

    setIsAdding(true);
    try {
      await onAddToBoard(product);
    } catch (error) {
      console.error('Failed to add:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const getImageUrl = () => {
    if (product.image_url) {
      // Single source of truth: warehouse static directory via backend
      // image_url from DB: static/images/products/image/59/kreslo-2.jpg
      return `${process.env.REACT_APP_BACKEND_URL}/${product.image_url}`;
    }
    return null;
  };

  return (
    <div className="product-card">
      <div className="product-card-image">
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={product.name}
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'product-card-image-placeholder';
              placeholder.textContent = '🎨';
              e.target.parentElement.appendChild(placeholder);
            }}
          />
        ) : (
          <div className="product-card-image-placeholder">🎨</div>
        )}
        
        {/* Compact availability counter in corner */}
        {product.available !== undefined && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 10px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            fontSize: '11px',
            fontWeight: '600',
            color: product.available > 0 ? '#2e7d32' : '#d32f2f',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: `1px solid ${product.available > 0 ? '#a5d6a7' : '#ffcdd2'}`
          }}>
            {product.available}/{product.quantity}
          </div>
        )}
      </div>
      
      <div className="product-card-body">
        <h3 className="product-card-title" title={product.name}>
          {product.name}
        </h3>
        <p className="product-card-sku">{product.sku}</p>
        
        <div className="product-card-info">
          <span className="product-card-price">
            ₴{product.rental_price}
            <span className="product-card-price-unit">/день</span>
          </span>
        </div>
        
        <button
          onClick={handleAdd}
          disabled={isAdding || (boardDates?.startDate && boardDates?.endDate && availability && !availability.is_available)}
          className={`product-card-button ${isAdding ? 'adding' : ''}`}
        >
          {isAdding ? 'Додавання...' : 'Додати в підбірку'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;