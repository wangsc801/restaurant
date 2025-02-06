import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Modals
import RemarkModal from './RemarkModal';
// import CheckoutModal from '../components/CheckoutModal';
import CustomizeItemModal from './CustomizeItemModal';
import CheckoutSlide from './CheckoutSlide';

// TypeScript Types
import { OrderItem } from '../../types/Order';
import { MenuItem } from '../../types/MenuItem';

import './MenuPage.css';

import { useNavigate } from 'react-router-dom';
import MenuItemsGrid from './MenuItemsGrid';
import MenuItemSearch from './MenuItemSearch';

const MenuPage = () => {
  const { t } = useTranslation();

  const [selectedItem, setselectedItem] = useState<MenuItem | null>(null);

  const [orders, setOrders] = useState<OrderItem[]>([]);

  const [isCheckoutSlideOpen, setIsCheckoutSlideOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [groupByCategory, setGroupByCategory] = useState<{ [category: string]: MenuItem[] }>({});

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const navigate = useNavigate();

  // Add loading state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add payment method state
  const [paymentMethod, setPaymentMethod] = useState('');

  // Add state
  const [isSearching, setIsSearching] = useState(false);

  // Load saved state and menu items when component mounts
  useEffect(() => {
    const initializeState = async () => {
      try {
        const savedMenuPageState = localStorage.getItem('menuPageState');
        if (savedMenuPageState) {
          const parsedState = JSON.parse(savedMenuPageState);
          if (parsedState && parsedState.orders) {
            setOrders(parsedState.orders);
          }
        }
        await fetchMenuItems();
      } catch (error) {
        console.error('In MenuPage.tsx: Error initializing state:', error);
      }
    };
    initializeState();
  }, []);

  // Save state when orders changes
  useEffect(() => {
    if (orders.length > 0) {  // Only save if there are orders
      try {
        localStorage.setItem('menuPageState', JSON.stringify({ orders: orders }));
      } catch (error) {
        console.error('In MenuPage: Error saving state:', error);
      }
    }
  }, [orders]);

  // Update the fetch function

  const fetchMenuItems = async () => {
    try {
      setIsRefreshing(false);
      const response = await fetch('http://localhost:8080/api/menu-items');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Group items by category
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

    // const groupedTags = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    //   item.tags.forEach(tag => {
    //     if (!acc[tag]) {
    //       acc[tag] = [];
    //     }
    //     acc[tag].push(item);
    //   });
    //   return acc;
    // }, {});

    setGroupByCategory(groupedCategories);
    // setGroupByTags(groupedTags);
  }, [menuItems]);

  const handleRemarkClick = (item: MenuItem) => {
    setselectedItem(item);
  };

  const handleModalClose = () => {
    setselectedItem(null);
  };

  const handleOrderSubmit = async (orderItem: OrderItem) => {
    setOrders(prev => [...prev, orderItem]);
    setselectedItem(null);
  };

  const handleAddToCheckoutList = (item: MenuItem) => {
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
    setOrders(prev => [...prev, orderItem]);
  };

  const handleDeleteOrder = (index: number) => {
    setOrders(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    setIsCheckoutSlideOpen(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutSlideOpen(false);
  };

  const handleCheckoutConfirm = () => {
    setIsCheckoutSlideOpen(false);
    localStorage.removeItem('menuPageState');  // Clear storage after checkout
    setOrders([]);
  };

  const handleCustomizeClick = () => {
    setIsCustomizeOpen(true);
  };

  const handleCustomizeClose = () => {
    setIsCustomizeOpen(false);
  };

  const handleBackToMain = () => {
    navigate('/home');
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setIsSearching(false);  // Exit search mode when category is selected
  };

  // Add refresh handler
  const handleRefresh = () => {
    fetchMenuItems();
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleQuantityChange = (index: number, change: number) => {
    setOrders(prev => prev.map((order, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, order.quantity + change); // Prevent going below 1
        return { ...order, quantity: newQuantity };
      }
      return order;
    }));
  };

  // Add handler
  const handleSearchClick = () => {
    setIsSearching(true);
  };

  return (
    <div className="menu-page">
      {/* Left Column - Navigation */}
      <div className="nav-column">
        <nav>
          <ul>
            <li>
              <button
                className="nav-button"
                onClick={handleBackToMain}
              >
                {t('common.backToMain')}
              </button>
            </li>
            <li>
              <button
                className={`nav-button ${selectedCategory === 'all' && !isSearching ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                {t('menu.allItems')}
              </button>
            </li>
            {Object.keys(groupByCategory).map(category => (
              <li key={category}>
                <button
                  className={`nav-button ${selectedCategory === category && !isSearching ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              </li>
            ))}
            <li>
              <button
                className={`nav-button search-button ${isSearching ? 'active' : ''}`}
                onClick={handleSearchClick}
              >
                {t('menu.search')}
              </button>
            </li>
            <li>
              <button
                className="nav-button customize-button"
                onClick={handleCustomizeClick}
              >
                {t('menu.customizeItem')}
              </button>
            </li>
            <li>
              <button
                className={`nav-button refresh-button ${isRefreshing ? 'loading' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? t('common.loading') : t('menu.refresh')}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Middle Column - Dish Cards */}
      {isSearching ? (
        <MenuItemSearch
          menuItems={menuItems}
          isRefreshing={isRefreshing}
          onRemarkClick={handleRemarkClick}
          onAddToCheckoutList={handleAddToCheckoutList}
          onClose={() => setIsSearching(false)}
        />
      ) : (
        <MenuItemsGrid
          selectedCategory={selectedCategory}
          menuItems={menuItems}
          groupByCategory={groupByCategory}
          isRefreshing={isRefreshing}
          onRemarkClick={handleRemarkClick}
          onAddToCheckoutList={handleAddToCheckoutList}
        />
      )}

      {/* Right Column - Checkout */}
      <div className="checkout-column">
        <div className="order-list">
          <h2>{t('menu.checkoutList')}</h2>
          <div className="orders">
            {orders.map((order, index) => (
              <div key={index} className="order-item">
                <div className="order-item-header">
                  <span className="item-name">{order.title + " (" + order.price + ")"}</span>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                    <span>{order.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                  </div>
                  <span className="item-price">{(order.price * order.quantity).toFixed(2)}</span>
                </div>
                {((order.seasoning?.length > 0) ||
                  (order.ingredients?.length > 0) ||
                  order.customRemark) && (
                    <div className="item-remarks">
                      {order.seasoning?.map(item => <span key={item}>{item}</span>)}
                      {order.ingredients?.map(item => <span key={item}>{item}</span>)}
                      {order.customRemark && <span>{order.customRemark}</span>}
                    </div>
                  )}
                <button className="delete-button" onClick={() => handleDeleteOrder(index)}>×</button>
              </div>
            ))}
          </div>
        </div>
        <div className="checkout-box">
          <div className="total">
            <span>{t('common.total')}: </span>
            <span>{ }</span>
            <span>{orders.reduce((sum, order) => sum + (order.price * order.quantity), 0).toFixed(2)}</span>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={orders.length === 0}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>

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

      <CheckoutSlide
        orderItems={orders}
        totalPrice={orders.reduce((sum, order) => sum + order.quantity * order.price, 0)}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        onClose={handleCheckoutClose}
        onConfirm={handleCheckoutConfirm}
        isOpen={isCheckoutSlideOpen}
      />

      {isCustomizeOpen && (
        <CustomizeItemModal
          onClose={handleCustomizeClose}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default MenuPage; 