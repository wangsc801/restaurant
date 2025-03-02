import { useState } from 'react';
import BranchSelectModal from './BranchSelectModal';
import './LoginPage.css';
import { Branch } from '../../types/Branch';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import config from '../../config'

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [password, setPassword] = useState('');

  const handleBranchSelect = async (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(false);
    localStorage.setItem('branch', JSON.stringify(branch));
  };

  const handleLogin = async () => {
    if (!employeeName || !password || !selectedBranch) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/employee/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch_id: selectedBranch.id,
          name: employeeName,
          password: password
        })
      });

      if (response.ok) {
        const employeeData = await response.json();
        // Save employee info to electron global state
        localStorage.setItem('employee', JSON.stringify(employeeData));
        // Navigate to menu page
        navigate('/home');
      } else {
        // alert('Login failed');
        console.error('Login failed:', await response.text());
        // Optionally show error to user
      }
    } catch (error) {
      console.error('Login error:', error);
      // Optionally show error to user
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{t('login.title')}</h1>
        <LanguageSelector />

        <div className="branch-section">
          {selectedBranch ? (
            <div className="selected-branch">
              <div className="branch-header">
                <span className="branch-name">{selectedBranch.name}</span>
                <span className="branch-code">#{selectedBranch.code}</span>
              </div>
              <div className="branch-address">{selectedBranch.address}</div>
              <button
                className="change-branch-button"
                onClick={() => setIsModalOpen(true)}
              >
                {t('login.changeBranch')}
              </button>
            </div>
          ) : (
            <button
              className="select-branch-button"
              onClick={() => setIsModalOpen(true)}
            >
              {t('login.selectBranch')}
            </button>
          )}
        </div>

        {selectedBranch && (
          <div className="login-form">
            <div className="input-group">
              <label>{t('login.employeeName')}</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder={t('login.enterName')}
              />
            </div>

            <div className="input-group">
              <label>{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('login.enterPassword')}
              />
            </div>

            <div className="login-button-container">
              <button
                className="login-button"
                onClick={handleLogin}
                disabled={!employeeName || !password}
              >
                {t('login.login')}
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <BranchSelectModal
          onClose={() => setIsModalOpen(false)}
          onSelect={handleBranchSelect}
        />
      )}
    </div>
  );
};

export default LoginPage; 