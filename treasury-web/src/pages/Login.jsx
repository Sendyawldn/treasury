import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch {
      console.warn("Backend auth failed, using mock auth fallback");
      if (username === 'admin01' && password === 'cihuy01') {
        localStorage.setItem('token', 'fallback-token');
        navigate('/admin');
      } else {
        alert('Kredensial tidak valid (gunakan admin01 / cihuy01 jika backend offline)');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-500">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-3/10 rounded-full blur-[100px]"></div>

      <div className="glass-panel p-8 w-full max-w-md relative z-10 border-t-2 border-accent">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-3xl mx-auto mb-4 shadow-lg shadow-accent/20">
            P
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-text">Admin Login</h2>
          <p className="text-muted">Sistem Keuangan Cihuyy</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted">Username</label>
            <input 
              type="text" 
              className="input-field w-full bg-bg-base" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-muted">Password</label>
            <input 
              type="password" 
              className="input-field w-full bg-bg-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4 text-base font-semibold shadow-lg shadow-accent/20">
            Masuk ke Panel Admin
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-muted hover:text-text text-sm transition-colors">
            &larr; Kembali ke Dashboard Warga
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
