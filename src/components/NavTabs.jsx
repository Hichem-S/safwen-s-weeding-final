import { useLang } from '../context/LangContext';
import './NavTabs.css';

export default function NavTabs({ tabs, activeTab, onTabChange }) {
  const { t } = useLang();
  return (
    <nav className="nav-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {t.tabs[tab.id]}
        </button>
      ))}
    </nav>
  );
}
