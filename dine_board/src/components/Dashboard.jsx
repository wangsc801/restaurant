import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import CategoriesSelector from './CategoriesSelector';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const branchName = localStorage.getItem('branchName');

  const menuItems = [
    {
      title: 'All Recent Orders',
      description: 'View all orders from today',
      path: '/orders/recent',
      icon: '📋'
    },
    {
      title: 'View By Categories',
      description: 'Filter and view orders by categories',
      path: '/orders/categories/汤面',
      icon: '🔍'
    },
    {
      title: 'Settings',
      description: 'Configure branch settings',
      path: '/settings',
      icon: '⚙️'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('dashboard.dashboard')}</h1>
        <CategoriesSelector />
      </div>
    </div>
  );
};

export default Dashboard; 