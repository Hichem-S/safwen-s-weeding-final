import { useLang } from '../context/LangContext';
import './Venue.css';

const LAT = 34.4233789;
const LNG = 8.7571166;

export default function Venue() {
  const { t } = useLang();
  const googleMapsUrl =
    'https://www.google.com/maps/place/La+Reine+Gafsa+salle+des+f%C3%AAtes/@34.4233789,8.7571166,17z';
  const embedUrl = `https://maps.google.com/maps?q=${LAT},${LNG}&z=17&output=embed`;

  return (
    <div>
      <h2 className="section-title">
        {t.theVenueEm
          ? <>{t.theVenue} <em>{t.theVenueEm}</em></>
          : <em>{t.theVenue}</em>}
      </h2>
      <p className="section-subtitle">{t.whereItHappens}</p>

      <div className="venue-card card">
        <div className="venue-header">
          <div className="venue-icon">🏛️</div>
          <div>
            <div className="venue-name">{t.venueName}</div>
            <div className="venue-type">{t.venueType}</div>
          </div>
        </div>
        <div className="venue-details">
          <div className="venue-detail-row"><span className="venue-detail-icon">📍</span><span>{t.venueLocation}</span></div>
          <div className="venue-detail-row"><span className="venue-detail-icon">📅</span><span>{t.venueDate}</span></div>
          <div className="venue-detail-row"><span className="venue-detail-icon">🕐</span><span>{t.venueTime}</span></div>
        </div>
        <a className="venue-directions-btn" href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          {t.getDirections}
        </a>
      </div>

      <div className="map-container">
        <iframe
          title="La Reine Gafsa — Wedding Venue"
          src={embedUrl}
          width="100%"
          height="360"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="quote-block">
        <p>{t.venueQuote}</p>
        <span>{t.venueQuoteAttr}</span>
      </div>
    </div>
  );
}
