import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './translations/en.json';
import zhTranslations from './translations/zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      zh: {
        translation: zhTranslations
      }
    },
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 