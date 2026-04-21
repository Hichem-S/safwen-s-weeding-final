import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLang } from '../context/LangContext';
import {
  subscribeToWishes,
  addWish,
  likeWish,
  deleteWish,
} from '../firebase/firebaseConfig';
import './Wishes.css';

const initials = (name) =>
  name.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

const avatarColor = (id) => {
  const colors = ['#c8966a', '#9a5a20', '#6b3d1e', '#4a2c1a', '#b5a07a'];
  const hash = [...String(id)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function Wishes() {
  const { t } = useLang();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [liked, setLiked] = useLocalStorage('wedding-wishes-liked', []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // Real-time Firestore subscription
  useEffect(() => {
    const unsub = subscribeToWishes((data) => {
      setWishes(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) { showToast(t.fillWishFields); return; }
    setSubmitting(true);
    try {
      await addWish({ name: name.trim(), message: message.trim() });
      setName(''); setMessage(''); setShowForm(false);
      showToast(t.wishSent);
    } catch {
      showToast('Error saving wish. Check Firebase config.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (wish) => {
    if (liked.includes(wish.id)) return;
    try {
      await likeWish(wish.id, wish.likes || 0);
      setLiked(prev => [...prev, wish.id]);
    } catch { /* silent */ }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWish(id);
      showToast(t.wishRemoved);
    } catch { showToast('Error deleting wish.'); }
  };

  return (
    <div>
      <h2 className="section-title">
        {t.wellWishesEm
          ? <>{t.wellWishes} <em>{t.wellWishesEm}</em></>
          : <em>{t.wellWishes}</em>}
      </h2>
      <p className="section-subtitle">{t.leaveNote}</p>

      <div className="wishes-stats card">
        <div className="wstat">
          <div className="wstat-num">{wishes.length}</div>
          <div className="wstat-label">{t.wishesCount}</div>
        </div>
        <div className="wstat-divider" />
        <div className="wstat">
          <div className="wstat-num">{wishes.reduce((s, w) => s + (w.likes || 0), 0)}</div>
          <div className="wstat-label">{t.heartsGiven}</div>
        </div>
        <div className="wstat-divider" />
        <div className="wstat">
          <div className="wstat-num">{new Set(wishes.map(w => w.name)).size}</div>
          <div className="wstat-label">{t.people}</div>
        </div>
      </div>

      {showForm ? (
        <div className="wish-form card">
          <div className="wish-form-title">{t.writeWish}</div>
          <div className="wish-starters">
            {t.starters.map((s, i) => (
              <button key={i} className="wish-starter-btn" onClick={() => setMessage(s + ' ')}>{s}</button>
            ))}
          </div>
          <div className="form-field">
            <label className="form-label">{t.yourName}</label>
            <input className="form-input" type="text" placeholder={t.namePlaceholder} maxLength={50} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">{t.yourMessage}</label>
            <textarea className="form-input" rows={4} placeholder={t.msgPlaceholder} maxLength={300} value={message} onChange={e => setMessage(e.target.value)} />
            <div className="char-count">{message.length}/300</div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? '...' : t.sendWish}
            </button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setName(''); setMessage(''); }}>{t.cancel}</button>
          </div>
        </div>
      ) : (
        <button className="btn-outline-gold wish-add-btn" onClick={() => setShowForm(true)}>
          {t.leaveWishBtn}
        </button>
      )}

      {loading ? (
        <div className="wishes-empty"><div className="empty-icon">💌</div><p>Loading...</p></div>
      ) : wishes.length === 0 && !showForm ? (
        <div className="wishes-empty">
          <div className="empty-icon">💌</div>
          <p>{t.noWishes.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
        </div>
      ) : (
        <div className="wishes-list">
          {wishes.map(wish => (
            <div key={wish.id} className="wish-card card">
              <div className="wish-top">
                <div className="wish-avatar" style={{ background: avatarColor(wish.id) }}>
                  {initials(wish.name)}
                </div>
                <div className="wish-meta">
                  <div className="wish-name">{wish.name}</div>
                  <div className="wish-date">{wish.date}</div>
                </div>
                <button className="wish-delete" onClick={() => handleDelete(wish.id)} title={t.remove}>✕</button>
              </div>
              <p className="wish-message">{wish.message}</p>
              <div className="wish-footer">
                <button
                  className={`wish-like-btn ${liked.includes(wish.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(wish)}
                  title={liked.includes(wish.id) ? t.alreadyLiked : t.likeWish}
                >
                  {liked.includes(wish.id) ? '♥' : '♡'} {wish.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="wish-toast">{toast}</div>}
    </div>
  );
}
