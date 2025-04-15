import { useTranslation } from 'react-i18next';
import './MenuNavColumn.css';

interface MenuNavColumnProps {
  selectedCategory: string;
  isSearching: boolean;
  isRefreshing: boolean;
  groupByCategory: { [category: string]: any[] };
  onCategoryClick: (category: string) => void;
  onSearchClick: () => void;
  onCustomizeClick: () => void;
  onRefresh: () => void;
}

const MenuNavColumn: React.FC<MenuNavColumnProps> = ({
  selectedCategory,
  isSearching,
  isRefreshing,
  groupByCategory,
  onCategoryClick,
  onSearchClick,
  onCustomizeClick,
  onRefresh
}) => {
  const { t } = useTranslation();

  return (
    <div className="nav-column">
      <nav>
        <ul>
          <li>
            <button
              className={`nav-button ${selectedCategory === 'all' && !isSearching ? 'active' : ''}`}
              onClick={() => onCategoryClick('all')}
            >
              {t('menu.allItems')}
            </button>
          </li>
          {Object.keys(groupByCategory).map(category => (
            <li key={category}>
              <button
                className={`nav-button ${selectedCategory === category && !isSearching ? 'active' : ''}`}
                onClick={() => onCategoryClick(category)}
              >
                {category}
              </button>
            </li>
          ))}
          <li>
            <button
              className={`nav-button search-button ${isSearching ? 'active' : ''}`}
              onClick={onSearchClick}
            >
              {t('menu.search')}
            </button>
          </li>
          <li>
            <button
              className="nav-button customize-button"
              onClick={onCustomizeClick}
            >
              {t('menu.customizeItem')}
            </button>
          </li>
          <li>
            <button
              className={`nav-button refresh-button ${isRefreshing ? 'loading' : ''}`}
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? t('common.loading') : t('menu.refresh')}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuNavColumn;
