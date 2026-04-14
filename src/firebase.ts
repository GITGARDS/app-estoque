import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Note: In AI Studio, these values are usually injected or provided in firebase-applet-config.json
// If the file doesn't exist yet, we'll use placeholders that will be replaced or handled.
const firebaseConfig = {
  apiKey: "AIzaSyDl0SF8APmDbCotEM5jSZ8huRZ0b_hPJMM",
  authDomain: "portifolio-2362e.firebaseapp.com",
  projectId: "portifolio-2362e",
  storageBucket: "portifolio-2362e.firebasestorage.app",
  messagingSenderId: "169087849079",
  appId: "1:169087849079:web:7ec63e869546eace122c72",
  firestoreDatabaseId: "(default)",
  measurementId: "G-KKPJV03WEQ"
};

// Try to load from config file if it exists (standard AI Studio pattern)
const config = firebaseConfig;
// try {
//   // @ts-expect-error - Dynamic import might not be resolved during lint
//   // import configData from './firebase-applet-config.json';
//   config = configData;
// } catch {
//   console.warn("firebase-applet-config.json not found, using default config");
// }

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
