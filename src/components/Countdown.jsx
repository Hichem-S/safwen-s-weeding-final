import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import './Countdown.css';

const WEDDING_DATE = new Date('2026-07-12T18:00:00');

function getTimeLeft() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    total:   diff,
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function Countdown() {
  const { t } = useLang();
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isOver = time.total <= 0;

  return (
    <div>
      <h2 className="section-title">
        {t.theCountdownEm
          ? <>{t.theCountdown} <em>{t.theCountdownEm}</em></>
          : <em>{t.theCountdown}</em>}
      </h2>
      <p className="section-subtitle">{t.everySecond}</p>

      <div className="gold-badge">
        <div className="big-num">{time.days}</div>
        <div className="badge-label">{isOver ? t.todayIsTheDay : t.daysUntil}</div>
      </div>

      <div className="countdown-grid">
        {[
          { value: time.days,    label: t.days    },
          { value: time.hours,   label: t.hours   },
          { value: time.minutes, label: t.minutes },
          { value: time.seconds, label: t.seconds },
        ].map(({ value, label }) => (
          <div key={label} className="countdown-cell card">
            <div className="cd-num">{String(value).padStart(2, '0')}</div>
            <div className="cd-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="quote-block">
        <p>{t.countdownQuote}</p>
        <span>{t.countdownQuoteAttr}</span>
      </div>
    </div>
  );
}
