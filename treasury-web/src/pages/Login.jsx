import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual JWT authentication here
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'dummy-token');
      navigate('/admin');
    } else {
      alert('Invalid credentials (use admin/admin for now)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]"></div>

      <div className="glass-panel p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
          <p className="text-text-muted">Sistem Keuangan Cihuyy</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-muted">Username</label>
            <input 
              type="text" 
              className="input-field w-full" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-muted">Password</label>
            <input 
              type="password" 
              className="input-field w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4 text-lg">
            Masuk ke Panel Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
