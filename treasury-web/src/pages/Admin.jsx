import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Admin = () => {
  const navigate = useNavigate();
  const { transactions, fetchDashboardData } = useStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate, fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8 bg-surface p-4 rounded-2xl shadow-lg border border-surface-hover">
        <h1 className="text-2xl font-bold">Admin Control Panel</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="px-4 py-2 text-text hover:text-white transition-colors">
            Lihat Dashboard
          </button>
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all">
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4">Daftar Transaksi Terbaru</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-hover">
                    <th className="pb-3 text-text-muted font-medium">Tanggal</th>
                    <th className="pb-3 text-text-muted font-medium">Pemasukan</th>
                    <th className="pb-3 text-text-muted font-medium">Pengeluaran</th>
                    <th className="pb-3 text-text-muted font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b border-surface-hover/50 hover:bg-surface-hover/30 transition-colors">
                      <td className="py-4">{t.date}</td>
                      <td className="py-4 text-accent">Rp {t.terkumpul.toLocaleString()}</td>
                      <td className="py-4 text-primary">Rp {t.konsumsi.toLocaleString()}</td>
                      <td className="py-4">
                        <button className="text-info hover:text-white mr-3">Edit</button>
                        <button className="text-primary hover:text-red-400">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 border-t-4 border-info">
            <h2 className="text-xl font-bold mb-4">Input Transaksi Baru</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-text-muted">Tanggal</label>
                <input type="date" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-text-muted">Pemasukan (Rp)</label>
                <input type="number" className="input-field w-full" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-text-muted">Pengeluaran (Rp)</label>
                <input type="number" className="input-field w-full" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-text-muted">Keterangan</label>
                <textarea className="input-field w-full h-24 resize-none" placeholder="Catatan transaksi..."></textarea>
              </div>
              <button type="button" className="btn-primary w-full">Simpan Data</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
