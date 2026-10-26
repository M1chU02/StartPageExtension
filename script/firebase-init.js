// Firebase configuration – public information (safe to expose)
const firebaseConfig = {
  apiKey: "AIzaSyBK18v4KIPIa6MughGaXVgz7Qmna-vrqec",
  authDomain: "michu-s-homepage.firebaseapp.com",
  projectId: "michu-s-homepage",
  storageBucket: "michu-s-homepage.firebasestorage.app",
  messagingSenderId: "332888546150",
  appId: "1:332888546150:web:e6441bf7387c9b1da9c6a7",
  measurementId: "G-3SDMPNBQWP"
};

// Initialize Firebase using the Compat SDK (which is loaded via <script> tags in index.html)
firebase.initializeApp(firebaseConfig);
// If you also load the analytics SDK you can enable it:
// firebase.analytics();
