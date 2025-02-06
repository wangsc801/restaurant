import { useEffect, useRef, useState } from 'react';
import { OrderItem } from '../../types/Order';
import { useTranslation } from 'react-i18next';
import './CustomizeItemModal.css';

interface CustomizeProductModalProps {
  onClose: () => void;
  onSubmit: (orderItem: OrderItem) => void;
}

const CustomizeProductModal = ({ onClose, onSubmit }: CustomizeProductModalProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState('');
  const [remark, setRemark] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    // Fetch categories only
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/menu-items/categories');
        const categories = await response.json();
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    const orderItem: OrderItem = {
      id: null,
      menuItemId: 'custom-' + Date.now(),
      title: title || 'Customize Product',
      categories: selectedCategories,
      price: Number(price),
      quantity: 1,
      seasoning: [],
      ingredients: [],
      customRemark: remark,
      plated: false,
      delivered: false
    };

    onSubmit(orderItem);
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      onClose();
    }
  };

  return (
    <dialog ref={dialogRef} className="customize-modal" onClick={handleModalClick}>
      <div className="customize-content">
        <h3>{t('menu.customizeItem')}</h3>

        <div className="customize-form">
          <div className="form-group">
            <label htmlFor="title">{t('addItem.name')}</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('menu.customizeItem')}
            />
          </div>

          <div className="form-group">
            <label>{t('addItem.categories')}</label>
            <div className="options-grid">
              {availableCategories.map(category => (
                <button
                  type="button"
                  key={category}
                  className={`option-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">{t('addItem.price')}</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="remark">{t('menu.remarks')}</label>
            <textarea
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={t('menuRemark.customRemarkPlaceholder')}
              rows={3}
            />
          </div>
        </div>

        <div className="customize-actions">
          <button className="cancel-button" onClick={onClose}>{t('common.cancel')}</button>
          <button className="confirm-button" onClick={handleSubmit}>{t('common.confirm')}</button>
        </div>
      </div>
    </dialog>
  );
};

export default CustomizeProductModal; 