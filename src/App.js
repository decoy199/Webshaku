import React, { useState } from 'react';
import AdminAuth from './components/AdminAuth';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <h1>Shakuhachi Admin</h1>
      <AdminAuth setUser={setUser} />
      {user && <AdminPanel />}
    </div>
  );
}

export default App;