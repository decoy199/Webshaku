// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


