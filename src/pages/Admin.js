import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminAuth from '../../public/AdminAuth';
import AdminPanel from '../../public/AdminPanel';

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
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