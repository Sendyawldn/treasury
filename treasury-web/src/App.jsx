import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Panitia from './pages/Panitia';
import Anggaran from './pages/Anggaran';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-base text-text">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/panitia" element={<Panitia />} />
          <Route path="/anggaran" element={<Anggaran />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
