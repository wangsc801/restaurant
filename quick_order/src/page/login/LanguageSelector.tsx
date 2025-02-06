import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="language-selector">
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </button>
      <button 
        className={`lang-btn ${i18n.language === 'zh' ? 'active' : ''}`}
        onClick={() => i18n.changeLanguage('zh')}
      >
        中
      </button>
    </div>
  );
} 