import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { EXCHANGE_RATES } from '@/lib/utils';

type Currency = 'fcfa' | 'eur' | 'usd';

interface PreferencesContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: string;
  setLanguage: (lang: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  formatMoney: (amount: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  
  // Load from local storage or default
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('fleet_currency');
    return (saved as Currency) || 'fcfa';
  });

  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('fleet_language');
    return saved || i18n.language || 'fr';
  });

  const [companyName, setCompanyNameState] = useState<string>(() => {
    return localStorage.getItem('fleet_company_name') || 'NOM DE LA SOCIÉTÉ';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('fleet_currency', c);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('fleet_language', lang);
    i18n.changeLanguage(lang);
  };

  const setCompanyName = (name: string) => {
    setCompanyNameState(name);
    localStorage.setItem('fleet_company_name', name);
  };

  // Sync i18n initially
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []);

  const formatMoney = (amount: number) => {
    const converted = amount * EXCHANGE_RATES[currency];
    
    if (currency === 'fcfa') {
      return new Intl.NumberFormat('fr-FR').format(Math.round(converted)) + ' FCFA';
    } else if (currency === 'eur') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(converted);
    } else {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(converted);
    }
  };

  return (
    <PreferencesContext.Provider value={{ currency, setCurrency, language, setLanguage, companyName, setCompanyName, formatMoney }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
