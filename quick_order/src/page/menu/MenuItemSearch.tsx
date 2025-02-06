import { useState, useEffect } from 'react';
import { MenuItem } from '../../types/MenuItem';
import { useTranslation } from 'react-i18next';
import './MenuItemSearch.css';

interface MenuItemSearchProps {
  menuItems: MenuItem[];
  isRefreshing: boolean;
  onRemarkClick: (item: MenuItem) => void;
  onAddToCheckoutList: (item: MenuItem) => void;
  onClose: () => void;
}

const MenuItemSearch = ({
  menuItems,
  isRefreshing,
  onRemarkClick,
  onAddToCheckoutList,
  onClose
}: MenuItemSearchProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const filtered = menuItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.abbr && item.abbr.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchTerm, menuItems]);

  return (
    <div className="search-page">
      <div className="search-header">
        <button className="back-button" onClick={onClose}>
          {t('common.back')}
        </button>
        <input
          type="text"
          className="search-input"
          placeholder={t('menu.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      <div className={`items-column ${isRefreshing ? 'loading' : ''}`}>
        <div className="items-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="items-card">
              <img src={'http://localhost:8080' + item.imagePath} alt={item.title} />
              <div className="items-info">
                <h3>{item.title}</h3>
                {item.abbr && <span className="abbr">{item.abbr}</span>}
                <p className="price">
                  {item.moneySymbol + item.price}
                  <span className="unit"> / {item.unit}</span>
                </p>
                <div className="button-group">
                  <button
                    className="remark-button"
                    onClick={() => onRemarkClick(item)}
                  >
                    {t('menu.remarks')}
                  </button>
                  <button 
                    className="add-to-checkout-list"
                    onClick={() => onAddToCheckoutList(item)}
                  >
                    {t('menu.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuItemSearch; 