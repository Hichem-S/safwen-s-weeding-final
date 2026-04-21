import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('wedding-lang') || 'en');

  const t = translations[lang];

  // Apply RTL / LTR to the document
  useEffect(() => {
    document.documentElement.setAttribute('dir', t.dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('wedding-lang', lang);
  }, [lang, t.dir]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
