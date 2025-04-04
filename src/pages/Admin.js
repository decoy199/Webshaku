import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // 修正: firebaseファイルからインポート
import AdminAuth from '../AdminAuth';
import AdminPanel from '../AdminPanel';

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h1>尺八イベント管理</h1>
      {!user ? (
        <AdminAuth setUser={setUser} />
      ) : (
        <AdminPanel />
      )}
    </div>
  );
}

export default Admin;