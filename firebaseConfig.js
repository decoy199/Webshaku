// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClcc3_N7WbmMICfexx_lQi_IGrkl8vWhY",
  authDomain: "shakuhachiweb-c6f85.firebaseapp.com",
  projectId: "shakuhachiweb-c6f85",
  storageBucket: "shakuhachiweb-c6f85.firebasestorage.app",
  messagingSenderId: "536744242736",
  appId: "1:536744242736:web:2c95eb68d4cfd66a2a87f5",
  measurementId: "G-J9DCE1R7LT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { db };
