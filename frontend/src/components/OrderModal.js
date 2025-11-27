import React, { useState } from 'react';
import './OrderModal.css';

const OrderModal = ({ isOpen, onClose, board, onSubmit }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    city: '',
    delivery_address: '',
    delivery_type: 'self_pickup',
    customer_comment: '',
    event_type: '',
    guests_count: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !board) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Введіть ім'я";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Введіть телефон";
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Невірний формат телефону";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "Введіть місто";
    }
    
    if (formData.delivery_type === 'delivery' && !formData.delivery_address.trim()) {
      newErrors.delivery_address = "Введіть адресу доставки";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = board.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h2>Оформлення замовлення</h2>
          <button className="order-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="order-modal-body">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Інформація про замовлення</h3>
            <div className="order-summary-grid">
              <div className="summary-item">
                <span className="summary-label">Назва:</span>
                <span className="summary-value">{board.board_name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Кількість товарів:</span>
                <span className="summary-value">{totalItems} шт</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Дата видачі:</span>
                <span className="summary-value">
                  {board.rental_start_date ? new Date(board.rental_start_date).toLocaleDateString('uk-UA') : '-'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Дата повернення:</span>
                <span className="summary-value">
                  {board.rental_end_date ? new Date(board.rental_end_date).toLocaleDateString('uk-UA') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-section">
              <h3>Контактні дані</h3>
              
              <div className="form-group">
                <label htmlFor="customer_name">
                  Ім'я <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Введіть ваше ім'я"
                  className={errors.customer_name ? 'error' : ''}
                />
                {errors.customer_name && <span className="error-message">{errors.customer_name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Телефон <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380 XX XXX XX XX"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Адреса отримання</h3>
              
              <div className="form-group">
                <label htmlFor="delivery_type">Тип отримання</label>
                <select
                  id="delivery_type"
                  name="delivery_type"
                  value={formData.delivery_type}
                  onChange={handleChange}
                >
                  <option value="self_pickup">Самовивіз</option>
                  <option value="delivery">Доставка</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">
                  Місто <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Введіть місто"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              {formData.delivery_type === 'delivery' && (
                <div className="form-group">
                  <label htmlFor="delivery_address">
                    Адреса доставки <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="delivery_address"
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    placeholder="Вулиця, будинок, квартира"
                    className={errors.delivery_address ? 'error' : ''}
                  />
                  {errors.delivery_address && <span className="error-message">{errors.delivery_address}</span>}
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>Додаткова інформація</h3>
              
              <div className="form-group">
                <label htmlFor="event_type">Тип заходу</label>
                <select
                  id="event_type"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                >
                  <option value="">Оберіть тип заходу</option>
                  <option value="wedding">Весілля</option>
                  <option value="birthday">День народження</option>
                  <option value="corporate">Корпоратив</option>
                  <option value="party">Вечірка</option>
                  <option value="other">Інше</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="guests_count">Кількість гостей</label>
                <input
                  type="number"
                  id="guests_count"
                  name="guests_count"
                  value={formData.guests_count}
                  onChange={handleChange}
                  placeholder="Приблизна кількість"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer_comment">Коментар</label>
                <textarea
                  id="customer_comment"
                  name="customer_comment"
                  value={formData.customer_comment}
                  onChange={handleChange}
                  placeholder="Додаткові побажання або питання"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Оформлення...' : 'Оформити замовлення'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
