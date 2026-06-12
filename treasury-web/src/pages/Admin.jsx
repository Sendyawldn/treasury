import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmtRupiah, fmtTanggal } from '../utils/format';

const Admin = () => {
  const navigate = useNavigate();
  const { transactions, targetDana, fetchDashboardData, addTransaction, deleteTransaction, setTargetDana } = useStore();

  const [inputTgl, setInputTgl] = useState(new Date().toISOString().split('T')[0]);
  const [inputTer, setInputTer] = useState('');
  const [inputKon, setInputKon] = useState('');
  const [inputKet, setInputKet] = useState('');
  
  const [inputAnggaran, setInputAnggaran] = useState(targetDana.toString());

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

  const handleTambah = async (e) => {
    e.preventDefault();
    if (!inputTgl) return;
    await addTransaction({
      date: new Date(inputTgl).toISOString(),
      terkumpul: parseInt(inputTer) || 0,
      konsumsi: parseInt(inputKon) || 0,
      notes: inputKet,
    });
    setInputTer('');
    setInputKon('');
    setInputKet('');
  };

  const handleSimpanPengaturan = (e) => {
    e.preventDefault();
    const val = parseInt(inputAnggaran);
    if (!isNaN(val)) setTargetDana(val);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-bg-surface p-4 rounded-xl shadow-lg border border-border">
        <h1 className="text-2xl font-bold text-text mb-4 md:mb-0">Panel Admin</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="px-4 py-2 text-text hover:text-white hover:bg-bg-hover rounded-lg transition-colors">
            Lihat Dashboard
          </button>
          <button onClick={handleLogout} className="bg-danger/20 text-danger hover:bg-danger hover:text-white px-4 py-2 rounded-lg transition-all">
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Form & Daftar Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 border-t-2 border-accent">
            <h2 className="text-xl font-medium mb-4 text-text">Input Transaksi Baru</h2>
            <form onSubmit={handleTambah} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-muted">Tanggal</label>
                <input 
                  type="date" 
                  className="input-field w-full" 
                  value={inputTgl}
                  onChange={(e) => setInputTgl(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted">Pemasukan (Rp)</label>
                <input 
                  type="number" 
                  className="input-field w-full" 
                  placeholder="0"
                  value={inputTer}
                  onChange={(e) => setInputTer(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted">Pengeluaran (Rp)</label>
                <input 
                  type="number" 
                  className="input-field w-full" 
                  placeholder="0"
                  value={inputKon}
                  onChange={(e) => setInputKon(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted">Keterangan</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  placeholder="Catatan..."
                  value={inputKet}
                  onChange={(e) => setInputKet(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <button type="submit" className="btn-primary w-full">Simpan Data Transaksi</button>
              </div>
            </form>
          </div>

          <div className="glass-panel p-0 overflow-hidden border-t-2 border-border-md">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-medium text-text">Daftar Transaksi Tersimpan</h2>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-bg-surface z-10">
                  <tr className="border-b border-border">
                    <th className="p-4 text-muted font-medium">Tanggal</th>
                    <th className="p-4 text-muted font-medium">Pemasukan</th>
                    <th className="p-4 text-muted font-medium">Pengeluaran</th>
                    <th className="p-4 text-muted font-medium">Keterangan</th>
                    <th className="p-4 text-muted font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-text divide-y divide-border">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-bg-hover transition-colors">
                      <td className="p-4 whitespace-nowrap">{fmtTanggal(t.date)}</td>
                      <td className="p-4 text-accent whitespace-nowrap">{fmtRupiah(t.terkumpul)}</td>
                      <td className="p-4 text-danger whitespace-nowrap">{fmtRupiah(t.konsumsi)}</td>
                      <td className="p-4 text-muted truncate max-w-[150px]">{t.notes || '-'}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => deleteTransaction(t.id)} 
                          className="px-3 py-1 bg-bg-raised hover:bg-danger/20 text-danger rounded transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-muted">Belum ada data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-t-2 border-warning">
            <h2 className="text-xl font-medium mb-4 text-text">Pengaturan Anggaran</h2>
            <form onSubmit={handleSimpanPengaturan} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-muted">Total Anggaran (Rp)</label>
                <input 
                  type="number" 
                  className="input-field w-full" 
                  value={inputAnggaran}
                  onChange={(e) => setInputAnggaran(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full bg-warning hover:bg-warning/80 text-bg-base font-semibold">
                Simpan Pengaturan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
