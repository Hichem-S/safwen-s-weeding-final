import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { subscribeToGuests, addGuest, deleteGuest } from '../firebase/firebaseConfig';
import './Guests.css';

export default function Guests() {
  const { t } = useLang();
  const [guests, setGuests]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]     = useState('');

  // Real-time Firestore subscription
  useEffect(() => {
    const unsub = subscribeToGuests((data) => {
      setGuests(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAdd = async () => {
    const name = input.trim();
    if (!name) return;
    const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    setSubmitting(true);
    try {
      await addGuest({ name, initials, roleKey: 'guest' });
      setInput('');
      showToast(`${name} ${t.add}!`);
    } catch {
      showToast('Error saving. Check Firebase config.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGuest(id);
    } catch {
      showToast('Error deleting guest.');
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') handleAdd(); };
  const roleLabel = key => ({ groom: t.groom, bride: t.bride, guest: t.guest }[key] || t.guest);

  // Safwen & Joumana are shown as static pinned cards (not from DB)
  const pinnedParty = [
    { id: 'safwen',  initials: 'SJ', name: 'Safwen',  roleKey: 'groom' },
    { id: 'joumana', initials: 'JO', name: 'Joumana', roleKey: 'bride' },
  ];
  const allGuests = [...pinnedParty, ...guests];

  return (
    <div>
      <h2 className="section-title">
        {t.ourGuestsEm
          ? <>{t.ourGuests} <em>{t.ourGuestsEm}</em></>
          : <em>{t.ourGuests}</em>}
      </h2>
      <p className="section-subtitle">{t.shareTheDay}</p>

      <div className="guests-stats card">
        <div className="stat-cell">
          <div className="stat-num">{allGuests.length}</div>
          <div className="stat-label">{t.guestsAdded}</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-cell">
          <div className="stat-num">{Math.ceil(allGuests.length / 10) || '—'}</div>
          <div className="stat-label">{t.tablesEst}</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-cell">
          <div className="stat-num">Jul 12</div>
          <div className="stat-label">{t.weddingDay}</div>
        </div>
      </div>

      <div className="guest-add card">
        <label className="form-label">{t.addGuest}</label>
        <div className="guest-add-row">
          <input
            className="form-input"
            type="text"
            placeholder={t.fullName}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={60}
          />
          <button className="btn-primary" onClick={handleAdd} disabled={submitting}>
            {submitting ? '...' : t.add}
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', padding: '1rem' }}>
          Loading...
        </p>
      ) : (
        <div className="guests-grid">
          {allGuests.map(g => (
            <div key={g.id} className="guest-pill">
              <div className="guest-avatar">{g.initials}</div>
              <div className="guest-info">
                <div className="guest-name">{g.name}</div>
                <div className="guest-role">{roleLabel(g.roleKey)}</div>
              </div>
              {g.id !== 'safwen' && g.id !== 'joumana' && (
                <button className="guest-remove" onClick={() => handleDelete(g.id)}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <div className="guest-toast">{toast}</div>}
    </div>
  );
}
