import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';  // Firebaseの初期化
import App from './App';
import reportWebVitals from './reportWebVitals';

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
const app = initializeApp(firebaseConfig);  // ここでFirebaseを初期化
console.log("Firebase app initialized:", app); // ログを出力して初期化確認

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// reportWebVitals を呼び出す
reportWebVitals();
