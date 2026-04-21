import { useLang } from '../context/LangContext';
import LanguageToggle from './LanguageToggle';
import './Hero.css';

export default function Hero() {
  const { t } = useLang();
  return (
    <div className="hero">
      <LanguageToggle />

      {/* Botanical corner decorations — pure CSS/SVG */}
      <div className="botanical botanical-tl" aria-hidden="true">
        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="20" rx="28" ry="18" fill="#d4c4a0" opacity="0.55" transform="rotate(-30 30 20)"/>
          <ellipse cx="70" cy="10" rx="22" ry="14" fill="#c8b48a" opacity="0.45" transform="rotate(15 70 10)"/>
          <ellipse cx="15" cy="60" rx="32" ry="20" fill="#e0d0b0" opacity="0.5" transform="rotate(-50 15 60)"/>
          <ellipse cx="55" cy="45" rx="18" ry="11" fill="#bfaa80" opacity="0.4" transform="rotate(20 55 45)"/>
          <ellipse cx="10" cy="100" rx="24" ry="15" fill="#d4c4a0" opacity="0.35" transform="rotate(-65 10 100)"/>
          {/* stems */}
          <path d="M40 80 Q55 55 70 30" stroke="#a08050" strokeWidth="1.2" fill="none" opacity="0.5"/>
          <path d="M20 90 Q35 70 50 50" stroke="#a08050" strokeWidth="1" fill="none" opacity="0.4"/>
          {/* tiny flowers */}
          <circle cx="72" cy="28" r="3" fill="#c8b48a" opacity="0.6"/>
          <circle cx="68" cy="22" r="2" fill="#bfaa80" opacity="0.5"/>
          <circle cx="76" cy="24" r="2" fill="#d4c4a0" opacity="0.5"/>
          {/* leaf shapes */}
          <path d="M5 130 Q20 110 35 120 Q20 135 5 130Z" fill="#c8b48a" opacity="0.4"/>
          <path d="M0 110 Q18 95 28 108 Q15 120 0 110Z" fill="#d4c4a0" opacity="0.35"/>
        </svg>
      </div>

      <div className="botanical botanical-tr" aria-hidden="true">
        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="130" cy="20" rx="28" ry="18" fill="#d4c4a0" opacity="0.55" transform="rotate(30 130 20)"/>
          <ellipse cx="90"  cy="10" rx="22" ry="14" fill="#c8b48a" opacity="0.45" transform="rotate(-15 90 10)"/>
          <ellipse cx="145" cy="60" rx="32" ry="20" fill="#e0d0b0" opacity="0.5" transform="rotate(50 145 60)"/>
          <ellipse cx="105" cy="45" rx="18" ry="11" fill="#bfaa80" opacity="0.4" transform="rotate(-20 105 45)"/>
          <ellipse cx="150" cy="100" rx="24" ry="15" fill="#d4c4a0" opacity="0.35" transform="rotate(65 150 100)"/>
          <path d="M120 80 Q105 55 90 30" stroke="#a08050" strokeWidth="1.2" fill="none" opacity="0.5"/>
          <path d="M140 90 Q125 70 110 50" stroke="#a08050" strokeWidth="1" fill="none" opacity="0.4"/>
          <circle cx="88" cy="28" r="3" fill="#c8b48a" opacity="0.6"/>
          <circle cx="92" cy="22" r="2" fill="#bfaa80" opacity="0.5"/>
          <circle cx="84" cy="24" r="2" fill="#d4c4a0" opacity="0.5"/>
          <path d="M155 130 Q140 110 125 120 Q140 135 155 130Z" fill="#c8b48a" opacity="0.4"/>
          <path d="M160 110 Q142 95 132 108 Q145 120 160 110Z" fill="#d4c4a0" opacity="0.35"/>
        </svg>
      </div>

      <div className="botanical botanical-bl" aria-hidden="true">
        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="20" cy="140" rx="30" ry="19" fill="#c8b48a" opacity="0.5" transform="rotate(40 20 140)"/>
          <ellipse cx="55" cy="150" rx="24" ry="14" fill="#d4c4a0" opacity="0.45" transform="rotate(-10 55 150)"/>
          <ellipse cx="10" cy="105" rx="26" ry="16" fill="#e0d0b0" opacity="0.4" transform="rotate(60 10 105)"/>
          <path d="M45 130 Q60 110 75 90" stroke="#a08050" strokeWidth="1.2" fill="none" opacity="0.45"/>
          <circle cx="77" cy="88" r="3" fill="#c8b48a" opacity="0.55"/>
          <circle cx="73" cy="83" r="2" fill="#bfaa80" opacity="0.45"/>
          <path d="M5 70 Q22 85 15 100 Q2 88 5 70Z" fill="#d4c4a0" opacity="0.38"/>
        </svg>
      </div>

      <div className="botanical botanical-br" aria-hidden="true">
        <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="140" cy="140" rx="30" ry="19" fill="#c8b48a" opacity="0.5" transform="rotate(-40 140 140)"/>
          <ellipse cx="105" cy="150" rx="24" ry="14" fill="#d4c4a0" opacity="0.45" transform="rotate(10 105 150)"/>
          <ellipse cx="150" cy="105" rx="26" ry="16" fill="#e0d0b0" opacity="0.4" transform="rotate(-60 150 105)"/>
          <path d="M115 130 Q100 110 85 90" stroke="#a08050" strokeWidth="1.2" fill="none" opacity="0.45"/>
          <circle cx="83" cy="88" r="3" fill="#c8b48a" opacity="0.55"/>
          <circle cx="87" cy="83" r="2" fill="#bfaa80" opacity="0.45"/>
          <path d="M155 70 Q138 85 145 100 Q158 88 155 70Z" fill="#d4c4a0" opacity="0.38"/>
        </svg>
      </div>

      {/* Invitation text layout */}
      <div className="hero-invite-label">{t.pleaseJoinUs || 'Please join us for the'}</div>
      <div className="hero-wedding-of">{t.weddingOf || 'Wedding of'}</div>

      <h1 className="hero-names">
        <span className="hero-name-script">Safwen</span>
        <span className="hero-and-script">{t.andWord || 'and'}</span>
        <span className="hero-name-script">Joumana</span>
      </h1>

      <div className="hero-date-block">
        <div className="hero-month">{t.heroMonth || 'July'}</div>
        <div className="hero-date-row">
          <div className="hero-day-label">{t.heroDay || 'Saturday'}</div>
          <div className="hero-date-num">12</div>
          <div className="hero-time-label">{t.heroTime || 'At 9 PM'}</div>
        </div>
        <div className="hero-year">2026</div>
        <div className="hero-location">Sned, Gafsa · Tunisia</div>
      </div>
    </div>
  );
}
