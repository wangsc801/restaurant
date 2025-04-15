import { MenuItem } from '../../types/MenuItem';
import { useTranslation } from 'react-i18next';
import './MenuItemsGrid.css';

interface MenuItemsGridProps {
  selectedCategory: string;
  menuItems: MenuItem[];
  groupByCategory: Record<string, MenuItem[]>;
  // 移除 isRefreshing
  onRemarkClick: (item: MenuItem) => void;
  onAddToCheckoutList: (item: MenuItem) => void;
}

const MenuItemsGrid = ({
  selectedCategory,
  menuItems,
  groupByCategory,
  // 移除 isRefreshing
  onRemarkClick,
  onAddToCheckoutList
}: MenuItemsGridProps) => {
  const { t } = useTranslation();

  return (
    <div className="items-column">
      <div className="items-grid">
        {(selectedCategory === 'all' ? menuItems : groupByCategory[selectedCategory] || [])
          .map(item => (
            <div key={item.id} className="items-card">
              {item.image ? (
                <img 
                  src={`data:image/jpeg;base64,${item.image}`} 
                  alt={item.title} 
                />
              ) : (
                <div className="no-image-placeholder"></div>
              )}
              <div className="items-info">
                <h3>{item.title}</h3>
                <p className="price">
                  {item.moneySymbol + item.price}
                  <span className="unit"> / {item.unit}</span>
                </p>
                <p className="description">{item.description}</p>
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
  );
};

export default MenuItemsGrid;