import { useLang } from '../context/LangContext';
import './LanguageToggle.css';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'ع' },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-toggle" role="group" aria-label="Language selector">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
