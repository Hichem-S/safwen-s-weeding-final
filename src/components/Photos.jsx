import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { subscribeToPhotos, uploadPhoto, deletePhoto } from '../firebase/firebaseConfig';
import './Photos.css';

const PLACEHOLDERS = [
  { emoji: '💐', label: 'Ceremony' },
  { emoji: '👰', label: 'Joumana'  },
  { emoji: '🤵', label: 'Safwen'   },
  { emoji: '💍', label: 'Rings'    },
  { emoji: '🎂', label: 'Cake'     },
  { emoji: '🌹', label: 'Flowers'  },
  { emoji: '💃', label: 'Dance'    },
  { emoji: '🥂', label: 'Toast'    },
];

export default function Photos() {
  const { t } = useLang();
  const [photos, setPhotos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]     = useState('');
  const inputRef = useRef();

  // Real-time Firestore subscription
  useEffect(() => {
    const unsub = subscribeToPhotos((data) => {
      setPhotos(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const readAsDataURL = (file) =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target.result);
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const dataURL = await readAsDataURL(file);
        await uploadPhoto({ name: file.name, dataURL });
      }
      showToast(files.length === 1 ? `${t.addPhoto}!` : `${files.length} photos uploaded!`);
    } catch {
      showToast('Upload failed. Check Firebase Storage config.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (photo) => {
    try {
      await deletePhoto(photo.id, photo.storagePath);
      showToast('Photo removed.');
    } catch {
      showToast('Error deleting photo.');
    }
  };

  return (
    <div>
      <h2 className="section-title">
        {t.photoGalleryEm
          ? <>{t.photoGallery} <em>{t.photoGalleryEm}</em></>
          : <em>{t.photoGallery}</em>}
      </h2>
      <p className="section-subtitle">{t.momentsFrozen}</p>

      {loading ? (
        <p className="photo-loading">{t.loadingPhotos}</p>
      ) : (
        <div className="photo-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-card real-photo">
              <img src={photo.url} alt={photo.name} />
              <div className="photo-overlay">
                <span className="photo-name">{photo.name}</span>
                <button className="photo-delete" onClick={() => handleDelete(photo)}>✕</button>
              </div>
            </div>
          ))}

          {photos.length === 0 && PLACEHOLDERS.map((p, i) => (
            <div key={i} className={`photo-card placeholder ph-${(i % 5) + 1}`}>
              <span className="ph-emoji">{p.emoji}</span>
              <span className="ph-label">{p.label}</span>
            </div>
          ))}

          <div
            className={`photo-card add-card ${uploading ? 'uploading' : ''}`}
            onClick={() => !uploading && inputRef.current.click()}
          >
            <span className="add-icon">{uploading ? '⏳' : '+'}</span>
            <span className="add-label">{uploading ? 'Uploading...' : t.addPhoto}</span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <p className="photo-hint">Photos are stored in Firebase — visible to everyone.</p>
      {toast && <div className="photo-toast">{toast}</div>}
    </div>
  );
}
