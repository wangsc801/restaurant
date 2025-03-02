import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import CategoriesSelector from './CategoriesSelector';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const branchName = localStorage.getItem('branchName');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('dashboard.dashboard')}</h1>
        <CategoriesSelector />
        <button
          onClick={() => navigate('/orders/recent')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t('dashboard.viewRecentOrders')}
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 