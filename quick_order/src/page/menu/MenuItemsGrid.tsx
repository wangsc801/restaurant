import { MenuItem } from '../../types/MenuItem';
import { useTranslation } from 'react-i18next';
import './MenuItemsGrid.css';

interface MenuItemsGridProps {
  selectedCategory: string;
  menuItems: MenuItem[];
  groupByCategory: Record<string, MenuItem[]>;
  isRefreshing: boolean;
  onRemarkClick: (item: MenuItem) => void;
  onAddToCheckoutList: (item: MenuItem) => void;
}

const MenuItemsGrid = ({
  selectedCategory,
  menuItems,
  groupByCategory,
  isRefreshing,
  onRemarkClick,
  onAddToCheckoutList
}: MenuItemsGridProps) => {
  const { t } = useTranslation();

  return (
    <div className={`items-column ${isRefreshing ? 'loading' : ''}`}>
      <div className="items-grid">
        {(selectedCategory === 'all' ? menuItems : groupByCategory[selectedCategory] || [])
          .map(item => (
            <div key={item.id} className="items-card">
              <img src={'http://localhost:8080' + item.imagePath} alt={item.title} />
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