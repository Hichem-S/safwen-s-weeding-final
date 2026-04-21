import { useLang } from '../context/LangContext';
import './Schedule.css';

export default function Schedule() {
  const { t } = useLang();

  return (
    <div>
      <h2 className="section-title">
        {t.dayScheduleEm
          ? <>{t.daySchedule} <em>{t.dayScheduleEm}</em></>
          : <em>{t.daySchedule}</em>}
      </h2>
      <p className="section-subtitle">{t.everyMoment}</p>

      <div className="timeline">
        {t.events.map((event, i) => (
          <div key={i} className="timeline-item">
            <div className="tl-time">{event.time}</div>
            <div className="tl-line-col">
              <div className="tl-dot" />
              {i < t.events.length - 1 && <div className="tl-line" />}
            </div>
            <div className="tl-content">
              <div className="tl-title">{event.title}</div>
              <div className="tl-desc">{event.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
