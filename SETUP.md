# Wedding App — Setup Guide

## 1. Install dependencies

```bash
cd wedding-app
npm install
```

---

## 2. Set up Firebase (for shared Wishes database)

### Step 1 — Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it (e.g. `safwen-joumana-wedding`)
3. Disable Google Analytics (optional) → click **Create project**

### Step 2 — Create a Firestore database
1. In the left sidebar: **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows all reads/writes for 30 days — good for the wedding period)
4. Select a region close to you (e.g. `europe-west1`) → **Enable**

### Step 3 — Register a Web app
1. In Project Overview, click the **</>** (Web) icon
2. Give it a nickname (e.g. `wedding-web`)
3. Copy the `firebaseConfig` object that appears — it looks like:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 4 — Paste config into the app
Open `src/firebase/firebaseConfig.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "AIza...",          // ← paste yours
  authDomain:        "your-project...",  // ← paste yours
  projectId:         "your-project-id", // ← paste yours
  storageBucket:     "...",
  messagingSenderId: "...",
  appId:             "...",
};
```

---

## 3. Set up Background Music (YouTube)

1. Find the YouTube video you want as background music
2. Copy the **Video ID** — it's the part after `?v=` in the URL
   - Example URL: `https://www.youtube.com/watch?v=E0vdHE4BXXY`
   - Video ID: `E0vdHE4BXXY`
3. Open `src/components/BackgroundMusic.jsx`
4. Replace the VIDEO_ID value at the top:

```js
const VIDEO_ID = 'PASTE_YOUR_VIDEO_ID_HERE';
```

> **Note:** Browsers require a user gesture before playing audio.
> The music will start automatically after the visitor's first click, tap, or keypress.
> A floating ♪ button in the bottom-left lets them toggle music on/off at any time.

---

## 4. Run the app locally

```bash
npm start
```

Opens at http://localhost:3000

---

## 5. Deploy to the web (free hosting)

### Option A — Firebase Hosting (recommended, same project)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting       # select your project, set build/ as public dir, SPA: yes
npm run build
firebase deploy
```

### Option B — Vercel (simplest)
```bash
npm install -g vercel
vercel
```

### Option C — Netlify
```bash
npm run build
# drag and drop the build/ folder to https://app.netlify.com/drop
```

---

## 6. Firestore Security Rules (before going live)

Once the wedding is over, update your Firestore rules to prevent spam.
In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{wishId} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.message is string
                    && request.resource.data.name.size() <= 50
                    && request.resource.data.message.size() <= 300;
      allow update: if request.resource.data.likes is number;
      allow delete: if false;
    }
  }
}
```

---

## Feature Summary

| Feature | Storage | Shared? |
|---|---|---|
| Wishes / Congratulations | Firebase Firestore | ✅ All visitors see same data |
| Photos | IndexedDB (browser) | ❌ Per device |
| Memories | localStorage | ❌ Per device |
| Guest list | localStorage | ❌ Per device |
| Music note | localStorage | ❌ Per device |
| Language preference | localStorage | ❌ Per device |
| Background music | YouTube IFrame API | — |

---

## Language Support

The app supports **English**, **French**, and **Arabic** (with full RTL layout).
The language toggle is in the top-right corner of the hero header.
The selected language is remembered via localStorage.
