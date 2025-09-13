import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    resources: {
      en: {
        translation: {}
      },
      es: {
        translation: {}
      }
    }
  });

// Load translations dynamically
const loadTranslations = async () => {
  try {
    const [enTranslation, esTranslation] = await Promise.all([
      fetch('/locales/en/translation.json').then(res => res.json()),
      fetch('/locales/es/translation.json').then(res => res.json())
    ]);

    i18n.addResourceBundle('en', 'translation', enTranslation);
    i18n.addResourceBundle('es', 'translation', esTranslation);
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

loadTranslations();

export default i18n;