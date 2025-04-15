import React, { useEffect, useState } from 'react';

// Modals
import RemarkModal from './RemarkModal';
import CustomizeItemModal from './CustomizeItemModal';

// TypeScript Types
import { OrderItem } from '../../types/Order';
import { MenuItem } from '../../types/MenuItem';
import { CategoriesSortWeight } from '../../types/CategoriesSortWeight';

import './MenuPage.css';
import config from '../../config';

import MenuItemsGrid from './MenuItemsGrid';
import MenuItemSearch from './MenuItemSearch';
import MenuNavColumn from './MenuNavColumn';

interface MenuProps {
  onOrderItemAdd?: (orderItem: OrderItem) => void;
}

const Menu: React.FC<MenuProps> = ({ onOrderItemAdd }) => {

  const [selectedItem, setselectedItem] = useState<MenuItem | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [groupByCategory, setGroupByCategory] = useState<{ [category: string]: MenuItem[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoriesSortWeight, setCategoriesSortWeight] = useState<CategoriesSortWeight>();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const initializeState = async () => {
      try {
        await fetchMenuItems();
        await fetchCategoriesSortWeight();
      } catch (error) {
        console.error('In Menu.tsx: Error initializing state:', error);
      }
    };
    initializeState();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/menu-items`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchCategoriesSortWeight = async () => {
    const localStorageBranch = localStorage.getItem('branch');
    const branch = localStorageBranch ? JSON.parse(localStorage.getItem('branch') || '') : null;
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/categories/sort-weight/branch-id/${branch.id}`);
      const data = await response.json();
      setCategoriesSortWeight(data);
    } catch (error) {
      console.error('Error fetching CategoriesSortWeight:', error);
    }
  };

  useEffect(() => {
    const groupedCategories = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      item.categories.forEach(category => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
      });
      return acc;
    }, {});

    const sortedGroupedCategories = Object.fromEntries(
      Object.entries(groupedCategories).sort((a, b) => {
        if (!categoriesSortWeight?.categories) return 0;
        const weightA = categoriesSortWeight.categories.find(c => c.name === a[0])?.sortWeight || Number.MAX_VALUE;
        const weightB = categoriesSortWeight.categories.find(c => c.name === b[0])?.sortWeight || Number.MAX_VALUE;
        return weightA - weightB;
      })
    );

    setGroupByCategory(sortedGroupedCategories);
  }, [menuItems, categoriesSortWeight]);

  const handleRemarkClick = (item: MenuItem) => {
    setselectedItem(item);
  };

  const handleModalClose = () => {
    setselectedItem(null);
  };

  const handleOrderSubmit = (orderItem: OrderItem) => {
    if (onOrderItemAdd) {
      onOrderItemAdd(orderItem);
    }
    setselectedItem(null);
  };

  const handleAddToCheckoutList = (item: MenuItem) => {
    if (onOrderItemAdd) {
      const orderItem: OrderItem = {
        id: null,
        menuItemId: item.id,
        title: item.title,
        price: item.price,
        quantity: 1,
        categories: item.categories,
        spiciness: '',
        seasoning: [],
        ingredients: [],
        customRemark: '',
        plated: false,
        delivered: false
      };
      onOrderItemAdd(orderItem);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setIsSearching(false);
  };

  const handleRefresh = () => {
    fetchMenuItems();
  };

  const handleSearchClick = () => {
    setIsSearching(true);
  };

  const handleCustomizeClick = () => {
    setIsCustomizeOpen(true);
  };

  const handleCustomizeClose = () => {
    setIsCustomizeOpen(false);
  };

  return (
    <div className="menu-container">
      <MenuNavColumn 
        selectedCategory={selectedCategory}
        isSearching={isSearching}
        isRefreshing={false}
        groupByCategory={groupByCategory}
        onCategoryClick={handleCategoryClick}
        onSearchClick={handleSearchClick}
        onCustomizeClick={handleCustomizeClick}
        onRefresh={handleRefresh}
      />

      {isSearching ? (
        <MenuItemSearch
          menuItems={menuItems}
          isRefreshing={false}
          onRemarkClick={handleRemarkClick}
          onAddToCheckoutList={handleAddToCheckoutList}
          onClose={() => setIsSearching(false)}
        />
      ) : (
        <MenuItemsGrid
          selectedCategory={selectedCategory}
          menuItems={menuItems}
          groupByCategory={groupByCategory}
          onRemarkClick={handleRemarkClick}
          onAddToCheckoutList={handleAddToCheckoutList}
        />
      )}

      {selectedItem && (
        <RemarkModal
          itemId={selectedItem.id}
          itemName={selectedItem.title}
          categories={selectedItem.categories}
          price={selectedItem.price}
          onClose={handleModalClose}
          onSubmit={handleOrderSubmit}
        />
      )}

      {isCustomizeOpen && (
        <CustomizeItemModal
          onClose={handleCustomizeClose}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default Menu;