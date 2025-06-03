import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import App from './App';
import reportWebVitals from './reportWebVitals';


// Firebaseの設定を最優先で実行
const firebaseConfig = {
  apiKey: "AIzaSyClcc3_N7WbmMICfexx_lQi_IGrkl8vWhY",
  authDomain: "shakuhachiweb-c6f85.firebaseapp.com",
  projectId: "shakuhachiweb-c6f85",
  storageBucket: "shakuhachiweb-c6f85.appspot.com",
  messagingSenderId: "536744242736",
  appId: "1:536744242736:web:2c95eb68d4cfd66a2a87f5",
  measurementId: "G-J9DCE1R7LT"
};

// Firebase初期化を最初に確実に実行
const app = initializeApp(firebaseConfig);
console.log("Firebase initialized in index.js:", !!app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();