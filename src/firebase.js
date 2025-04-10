import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyClcc3_N7WbmMICfexx_lQi_IGrkl8vWhY",
  authDomain: "shakuhachiweb-c6f85.firebaseapp.com",
  projectId: "shakuhachiweb-c6f85",
  storageBucket: "shakuhachiweb-c6f85.appspot.com",
  messagingSenderId: "536744242736",
  appId: "1:536744242736:web:2c95eb68d4cfd66a2a87f5",
  measurementId: "G-J9DCE1R7LT"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
