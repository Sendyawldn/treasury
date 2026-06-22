import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmtRupiah, fmtTanggal } from '../utils/format';

const Admin = () => {
  const navigate = useNavigate();
  const { 
    transactions, budgetItems, 
    fetchDashboardData, addTransaction, deleteTransaction, 
    addBudgetItem, deleteBudgetItem
  } = useStore();

  const [activeTab, setActiveTab] = useState('transaksi');

  // Form Transaksi
  const [inputTgl, setInputTgl] = useState(new Date().toISOString().split('T')[0]);
  const [inputTer, setInputTer] = useState('');
  const [inputKon, setInputKon] = useState('');
  const [inputKet, setInputKet] = useState('');
  
  // Form Anggaran
  const [budName, setBudName] = useState('');
  const [budCategory, setBudCategory] = useState('Konsumsi');
  const [budUnit, setBudUnit] = useState('');
  const [budVolume, setBudVolume] = useState('');
  const [budPrice, setBudPrice] = useState('');



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

  const handleTambahTransaksi = async (e) => {
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

  const handleTambahAnggaran = async (e) => {
    e.preventDefault();
    if (!budName) return;
    await addBudgetItem({
      name: budName,
      category: budCategory,
      unit: budUnit,
      volume: parseInt(budVolume) || 1,
      price: parseInt(budPrice) || 0,
    });
    setBudName('');
    setBudUnit('');
    setBudVolume('');
    setBudPrice('');
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-border">
        {['transaksi', 'anggaran'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors capitalize ${activeTab === tab ? 'bg-bg-surface text-accent border-t-2 border-accent' : 'text-muted hover:bg-bg-hover'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Konten Utama Kiri */}
        <div className="space-y-6">
          
          {activeTab === 'transaksi' && (
            <>
              <div className="glass-panel p-6 border-t-2 border-accent">
                <h2 className="text-xl font-medium mb-4 text-text">Input Transaksi Baru</h2>
                <form onSubmit={handleTambahTransaksi} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-muted">Tanggal</label>
                    <input type="date" className="input-field w-full" value={inputTgl} onChange={(e) => setInputTgl(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Pemasukan (Rp)</label>
                    <input type="number" className="input-field w-full" placeholder="0" value={inputTer} onChange={(e) => setInputTer(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Pengeluaran (Rp)</label>
                    <input type="number" className="input-field w-full" placeholder="0" value={inputKon} onChange={(e) => setInputKon(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Keterangan</label>
                    <input type="text" className="input-field w-full" placeholder="Catatan..." value={inputKet} onChange={(e) => setInputKet(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <button type="submit" className="btn-primary w-full">Simpan Transaksi</button>
                  </div>
                </form>
              </div>

              <div className="glass-panel p-0 overflow-hidden border-t-2 border-border-md">
                <div className="p-6 border-b border-border"><h2 className="text-xl font-medium text-text">Daftar Transaksi</h2></div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-bg-surface z-10">
                      <tr className="border-b border-border text-muted">
                        <th className="p-4 font-medium">Tanggal</th><th className="p-4 font-medium">Masuk</th><th className="p-4 font-medium">Keluar</th><th className="p-4 font-medium">Ket</th><th className="p-4 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-text divide-y divide-border">
                      {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-bg-hover">
                          <td className="p-4">{fmtTanggal(t.date)}</td><td className="p-4 text-accent">{fmtRupiah(t.terkumpul)}</td><td className="p-4 text-danger">{fmtRupiah(t.konsumsi)}</td><td className="p-4 text-muted max-w-[150px] truncate">{t.notes||'-'}</td>
                          <td className="p-4"><button onClick={() => deleteTransaction(t.id)} className="text-xs bg-bg-raised text-danger px-2 py-1 rounded hover:bg-danger/20">Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'anggaran' && (
            <>
              <div className="glass-panel p-6 border-t-2 border-info">
                <h2 className="text-xl font-medium mb-4 text-text">Input Item Anggaran</h2>
                <form onSubmit={handleTambahAnggaran} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-muted">Nama Barang/Keperluan</label>
                    <input type="text" className="input-field w-full" value={budName} onChange={(e) => setBudName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Kategori</label>
                    <select className="input-field w-full" value={budCategory} onChange={(e) => setBudCategory(e.target.value)}>
                      <option value="Konsumsi">Konsumsi</option>
                      <option value="Perlengkapan dan Dekorasi">Perlengkapan dan Dekorasi</option>
                      <option value="Perlombaan dan Hadiah">Perlombaan dan Hadiah</option>
                      <option value="Panggung dan Hiburan">Panggung dan Hiburan</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm mb-1 text-muted">Volume</label>
                      <input type="number" className="input-field w-full" value={budVolume} onChange={(e) => setBudVolume(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-muted">Satuan</label>
                      <input type="text" className="input-field w-full" placeholder="Box, Pcs, dll" value={budUnit} onChange={(e) => setBudUnit(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Harga Satuan (Rp)</label>
                    <input type="number" className="input-field w-full" value={budPrice} onChange={(e) => setBudPrice(e.target.value)} />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <button type="submit" className="btn-primary w-full bg-info hover:bg-info/80">Simpan Item Anggaran</button>
                  </div>
                </form>
              </div>

              <div className="glass-panel p-0 overflow-hidden border-t-2 border-border-md">
                <div className="p-6 border-b border-border"><h2 className="text-xl font-medium text-text">Daftar Anggaran</h2></div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-bg-surface z-10">
                      <tr className="border-b border-border text-muted">
                        <th className="p-4 font-medium">Nama</th><th className="p-4 font-medium">Kategori</th><th className="p-4 font-medium">Vol</th><th className="p-4 font-medium">Harga/Satuan</th><th className="p-4 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-text divide-y divide-border">
                      {budgetItems.map(b => (
                        <tr key={b.id} className="hover:bg-bg-hover">
                          <td className="p-4">{b.name}</td><td className="p-4 text-muted">{b.category}</td><td className="p-4">{b.volume} {b.unit}</td><td className="p-4 text-accent">{fmtRupiah(b.price)}</td>
                          <td className="p-4"><button onClick={() => deleteBudgetItem(b.id)} className="text-xs bg-bg-raised text-danger px-2 py-1 rounded hover:bg-danger/20">Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
