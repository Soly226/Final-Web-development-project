import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('educore_theme') || 'dark';
  });

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('educore_language') || 'en';
  });

  // Apply theme class to document element
  const applyTheme = (currentTheme) => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply language direction to document element
  const applyLanguage = (currentLang) => {
    document.documentElement.lang = currentLang;
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Run on mount
  useEffect(() => {
    applyTheme(theme);
    applyLanguage(language);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('educore_theme', newTheme);
    applyTheme(newTheme);
  };

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('educore_language', newLang);
    applyLanguage(newLang);
  };

  // Translation helper
  const t = (key) => {
    if (!key) return '';
    const localized = translations[language]?.[key] || translations['en']?.[key] || key;
    return localized;
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
