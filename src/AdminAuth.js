import React from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebase"; // 修正: firebaseファイルからインポート

const provider = new GoogleAuthProvider();

const AdminAuth = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <div className="auth-buttons">
      <button onClick={handleLogin}>Googleでログイン</button>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default AdminAuth;
