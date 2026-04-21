import { useLang } from '../context/LangContext';
import './Overview.css';

export default function Overview() {
  const { t } = useLang();
  const d = t.details;

  const DETAILS = [
    { icon: '💍', label: d.weddingDate,    value: d.weddingDateVal },
    { icon: '📍', label: d.location,       value: d.locationVal },
    { icon: '🌵', label: d.region,         value: d.regionVal },
    { icon: '🕊️', label: d.ceremonyStyle,  value: d.ceremonyStyleVal },
    { icon: '🌹', label: d.weddingColors,  value: d.weddingColorsVal },
    { icon: '☀️', label: d.season,         value: d.seasonVal },
    { icon: '✨', label: d.madeBy,         value: d.madeByVal },
  ];

  return (
    <div>
      <h2 className="section-title">
        {t.ourStoryEm ? <>{t.ourStory} <em>{t.ourStoryEm}</em></> : <em>{t.ourStory}</em>}
      </h2>
      <p className="section-subtitle">{t.twoHearts}</p>

      <div className="location-banner card">
        <div className="location-pin">📍</div>
        <div>
          <div className="location-main">{t.locationMain}</div>
          <div className="location-sub">{t.locationSub}</div>
        </div>
      </div>

      <div className="quote-block">
        <p>{t.quote}</p>
        <span>{t.quoteAttr}</span>
      </div>

      <div className="love-letter card">
        <div className="letter-header">
          <span className="letter-seal">💕</span>
          <span className="letter-label">{t.letterFrom}</span>
        </div>
        <div className="letter-body">
          <p className="letter-salutation">{t.letterSalutation}</p>
          <p className="letter-text">{t.letterText}</p>
          <p className="letter-closing">{t.letterClosing}</p>
          <p className="letter-signature">{t.letterSignature}</p>
        </div>
      </div>

      <div className="details-list card">
        {DETAILS.map((item, i) => (
          <div key={i} className="detail-row">
            <div className="detail-icon">{item.icon}</div>
            <div>
              <div className="detail-label">{item.label}</div>
              <div className="detail-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
