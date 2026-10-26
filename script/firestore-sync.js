// script/firestore-sync.js – syncs localStorage data (bookmarks, notes, theme, background) with
// Cloud Firestore for the signed‑in user.  It loads the user’s document on sign‑in,
// updates the UI, and then periodically pushes any changes back to Firestore.

(() => {
  // Keep the last snapshot we have pushed – helps avoid needless writes.
  const lastSynced = {
    bookmarks: null,
    notes: null,
    selectedTheme: null,
    backgroundImage: null,
  };

  // Helper to safely store JSON objects in localStorage.
  const setLocal = (key, value) => {
    if (value !== undefined && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  // Load remote data into localStorage and refresh the UI.
  function loadRemoteData(uid) {
    const userDoc = firebase.firestore().collection('users').doc(uid);
    return userDoc.get()
      .then(doc => {
        if (!doc.exists) {
          // No data yet – seed Firestore with whatever the user already has locally.
          return pushAllLocalData(uid);
        }
        const data = doc.data();
        if (data.bookmarks) setLocal('bookmarks', data.bookmarks);
        if (data.notes) setLocal('notepadNotes', data.notes);
        if (data.selectedTheme) localStorage.setItem('selectedTheme', data.selectedTheme);
        if (data.backgroundImage) localStorage.setItem('backgroundImage', data.backgroundImage);

        // Refresh UI – calling the globally‑available render functions.
        if (typeof renderBookmarks === 'function') renderBookmarks();
        // A full reload guarantees every component (bookmarks, notepad, theme, …) reads the newest data.
        location.reload();
      })
      .catch(console.error);
  }

  // Push the entire current local data set to Firestore (used when the user has no remote doc yet).
  function pushAllLocalData(uid) {
    const payload = {
      bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
      notes: JSON.parse(localStorage.getItem('notepadNotes') || '[]'),
      selectedTheme: localStorage.getItem('selectedTheme') || null,
      backgroundImage: localStorage.getItem('backgroundImage') || null,
    };
    return firebase.firestore().collection('users').doc(uid).set(payload, { merge: true })
      .catch(console.error);
  }

  // Periodic sync – runs every 5 seconds while the user stays signed in.
  function startSyncLoop() {
    const user = firebase.auth().currentUser;
    if (!user) {
      // Not signed in – wait and retry later.
      setTimeout(startSyncLoop, 5000);
      return;
    }
    const uid = user.uid;
    const db = firebase.firestore();

    const cur = {
      bookmarks: localStorage.getItem('bookmarks'),
      notes: localStorage.getItem('notepadNotes'),
      selectedTheme: localStorage.getItem('selectedTheme'),
      backgroundImage: localStorage.getItem('backgroundImage'),
    };

    const updates = {};
    if (cur.bookmarks !== lastSynced.bookmarks) {
      updates.bookmarks = cur.bookmarks ? JSON.parse(cur.bookmarks) : [];
      lastSynced.bookmarks = cur.bookmarks;
    }
    if (cur.notes !== lastSynced.notes) {
      updates.notes = cur.notes ? JSON.parse(cur.notes) : [];
      lastSynced.notes = cur.notes;
    }
    if (cur.selectedTheme !== lastSynced.selectedTheme) {
      updates.selectedTheme = cur.selectedTheme;
      lastSynced.selectedTheme = cur.selectedTheme;
    }
    if (cur.backgroundImage !== lastSynced.backgroundImage) {
      updates.backgroundImage = cur.backgroundImage;
      lastSynced.backgroundImage = cur.backgroundImage;
    }

    if (Object.keys(updates).length > 0) {
      db.collection('users').doc(uid).set(updates, { merge: true }).catch(console.error);
    }

    // Schedule next tick.
    setTimeout(startSyncLoop, 5000);
  }

  // Listen for auth changes – when a user signs in we fetch their data and start syncing.
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      loadRemoteData(user.uid).then(() => {
        // Kick off the periodic sync after initial load.
        startSyncLoop();
      });
    } else {
      // Signed out – nothing to sync.
    }
  });
})();
