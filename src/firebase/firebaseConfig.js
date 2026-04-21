// ─────────────────────────────────────────────────────────────────
//  FIREBASE SETUP — Firestore ONLY (FREE)
// ─────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCNRzjdcp-qQDvHNx-ff8ex8LWV52mbOzo",
  authDomain: "safwen-s-wedding.firebaseapp.com",
  projectId: "safwen-s-wedding",
  storageBucket: "safwen-s-wedding.firebasestorage.app",
  messagingSenderId: "575108015435",
  appId: "1:575108015435:web:820123127f84346f1c74ce",
  measurementId: "G-0HPGCXZMT6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── helpers ────────────────────────────────────────────────────────
const col = (name) => collection(db, name);
const makeDocRef = (collectionName, id) => doc(db, collectionName, id);

function toDate(ts) {
  return ts
    ? ts.toDate().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';
}

function subscribe(colName, orderField, callback) {
  const q = query(col(colName), orderBy(orderField, 'desc'));
  return onSnapshot(q, snap =>
    callback(
      snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: toDate(d.data()[orderField])
      }))
    )
  );
}

// ══════════════════════════════════════════════════════════════════
//  WISHES
// ══════════════════════════════════════════════════════════════════
export const subscribeToWishes = (cb) =>
  subscribe('wishes', 'createdAt', cb);

export async function addWish({ name, message }) {
  return addDoc(col('wishes'), {
    name,
    message,
    likes: 0,
    createdAt: serverTimestamp()
  });
}

// ✅ FIXED (safe increment)
export async function likeWish(id) {
  return updateDoc(makeDocRef('wishes', id), {
    likes: increment(1)
  });
}

export async function deleteWish(id) {
  return deleteDoc(makeDocRef('wishes', id));
}

// ══════════════════════════════════════════════════════════════════
//  MEMORIES
// ══════════════════════════════════════════════════════════════════
export const subscribeToMemories = (cb) =>
  subscribe('memories', 'createdAt', cb);

export async function addMemory({ title, body }) {
  return addDoc(col('memories'), {
    title,
    body,
    createdAt: serverTimestamp()
  });
}

export async function deleteMemory(id) {
  return deleteDoc(makeDocRef('memories', id));
}

// ══════════════════════════════════════════════════════════════════
//  GUESTS
// ══════════════════════════════════════════════════════════════════
export const subscribeToGuests = (cb) =>
  subscribe('guests', 'createdAt', cb);

export async function addGuest({ name, initials, roleKey }) {
  return addDoc(col('guests'), {
    name,
    initials,
    roleKey,
    createdAt: serverTimestamp()
  });
}

export async function deleteGuest(id) {
  return deleteDoc(makeDocRef('guests', id));
}

// ══════════════════════════════════════════════════════════════════
//  PHOTOS (🔥 FULLY FREE — stored in Firestore)
// ══════════════════════════════════════════════════════════════════
export const subscribeToPhotos = (cb) => {
  const q = query(col('photos'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap =>
    cb(
      snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: toDate(d.data().createdAt)
      }))
    )
  );
};

// ✅ Upload photo (base64 directly)
export async function uploadPhoto({ name, dataURL }) {
  const docSnap = await addDoc(col('photos'), {
    name,
    dataURL, // 🔥 image stored directly
    createdAt: serverTimestamp(),
  });

  return {
    id: docSnap.id,
    name,
    dataURL
  };
}

// ✅ Delete photo
export async function deletePhoto(id) {
  return deleteDoc(makeDocRef('photos', id));
}