import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Branch } from '../../types/Branch';
import { Employee } from '../../types/Employee';
import './HomePage.css';
import dayjs from 'dayjs';

const MainPage = () => {
  const { date } = useParams();
  console.log(date)
  const formattedDate = dayjs().format('YYYY-MM-DD');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const loadInfo = async () => {
      const localStorageBranch = localStorage.getItem('branch');
      const branch = localStorageBranch ? JSON.parse(localStorage.getItem('branch') || '') : null;
      const employee = localStorageBranch ? JSON.parse(localStorage.getItem('employee') || '') : null;
      // const branch = await window.electronAPI.getBranchInfo();
      // const employee = await window.electronAPI.getEmployeeInfo();
      setBranch(branch);
      setEmployee(employee);
    };
    loadInfo();
  }, []);

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="branch-info">
          <h3>{branch?.name}</h3>
          <span className="branch-details">
            #{branch?.code} | {branch?.address}
          </span>
        </div>
        <div className="employee-info">
          <span className="employee-name">{employee?.name}</span>
          <span className="employee-role">{employee?.role}</span>
        </div>
      </header>

      <div className="main-content">
        <div className="options-grid">
          <button
            className="option-button order-button"
            onClick={() => navigate('/menu')}
          >
            <span className="icon">🛍️</span>
            <span className="text">{t('main.order')}</span>
          </button>

          <div className="secondary-options">
            <button
              className="option-button"
            // onClick={() => navigate('/order-management')}
            >
              <span className="icon">📋</span>
              <span className="text">{t('main.orderManagement')}</span>
            </button>

            <button
              className="option-button"
            onClick={() => navigate('/category-statistics/'+formattedDate)}
            >
              <span className="icon">📅</span>
              <span className="text">Today</span>
            </button>

            <button
              className="option-button"
              // onClick={() => navigate('/add-item')}
            >
              <span className="icon">➕</span>
              <span className="text">{t('main.addItem')}</span>
            </button>

            <button
              className="option-button"
            // onClick={() => navigate('/transactions')}
            >
              <span className="icon">💰</span>
              <span className="text">{t('main.transactionRecord')}</span>
            </button>
          </div>
        </div>

        <div className="docker-nav">
          <a href="#" className="docker-item">
            <span className="docker-icon">🏠</span>
            <span className="docker-text">Home</span>
          </a>
          <a href="#" className="docker-item">
            <span className="docker-icon">📊</span>
            <span className="docker-text">Statistics</span>
          </a>
          <a href="#" className="docker-item">
            <span className="docker-icon">⚙️</span>
            <span className="docker-text">Settings</span>
          </a>
          <a href="#" className="docker-item">
            <span className="docker-icon">👥</span>
            <span className="docker-text">Users</span>
          </a>
          <a href="#" className="docker-item">
            <span className="docker-icon">📱</span>
            <span className="docker-text">Apps</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 