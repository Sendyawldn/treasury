import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { fmtRupiah, fmtTanggal } from '../utils/format';

const Admin = () => {
  const navigate = useNavigate();
  const { 
    transactions, budgetItems, members, customRoles, 
    fetchDashboardData, addTransaction, deleteTransaction, 
    addBudgetItem, deleteBudgetItem, addMember, deleteMember, setTargetDana,
    addCustomRole, deleteCustomRole
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

  // Form Panitia
  const [memName, setMemName] = useState('');
  const [memRole, setMemRole] = useState('');
  const [memPhone, setMemPhone] = useState('');
  const [memColor, setMemColor] = useState('#6c63ff');

  // Pengaturan
  const [inputAnggaran, setInputAnggaran] = useState('');
  const [inputRoleBaru, setInputRoleBaru] = useState('');

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
    // Refresh data agar transaksi baru muncul di tabel
    await fetchDashboardData();
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

  const handleTambahPanitia = async (e) => {
    e.preventDefault();
    if (!memName) return;
    await addMember({
      name: memName,
      role: memRole || customRoles[0],
      phone: memPhone,
      avatarColor: memColor,
    });
    setMemName('');
    setMemPhone('');
  };

  const handleSimpanPengaturan = (e) => {
    e.preventDefault();
    const val = parseInt(inputAnggaran);
    if (!isNaN(val)) setTargetDana(val);
  };

  const handleTambahRole = (e) => {
    e.preventDefault();
    if (inputRoleBaru.trim()) {
      addCustomRole(inputRoleBaru.trim());
      setInputRoleBaru('');
    }
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
        {['transaksi', 'anggaran', 'panitia'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors capitalize ${activeTab === tab ? 'bg-bg-surface text-accent border-t-2 border-accent' : 'text-muted hover:bg-bg-hover'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Konten Utama Kiri */}
        <div className="lg:col-span-2 space-y-6">
          
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

          {activeTab === 'panitia' && (
            <>
              <div className="glass-panel p-6 border-t-2 border-success">
                <h2 className="text-xl font-medium mb-4 text-text">Tambah Panitia</h2>
                <form onSubmit={handleTambahPanitia} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-muted">Nama Anggota</label>
                    <input type="text" className="input-field w-full" value={memName} onChange={(e) => setMemName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Jabatan / Role</label>
                    <select 
                      className="input-field w-full" 
                      value={memRole || customRoles[0]} 
                      onChange={(e) => setMemRole(e.target.value)}
                    >
                      {customRoles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">No. Telepon</label>
                    <input type="text" className="input-field w-full" value={memPhone} onChange={(e) => setMemPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted">Warna Avatar (Hex)</label>
                    <div className="flex gap-2">
                      <input type="color" className="w-10 h-10 p-0 border-0 bg-transparent rounded cursor-pointer" value={memColor} onChange={(e) => setMemColor(e.target.value)} />
                      <input type="text" className="input-field flex-1" value={memColor} onChange={(e) => setMemColor(e.target.value)} />
                    </div>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <button type="submit" className="btn-primary w-full bg-success hover:bg-success/80">Simpan Panitia</button>
                  </div>
                </form>
              </div>

              <div className="glass-panel p-0 overflow-hidden border-t-2 border-border-md">
                <div className="p-6 border-b border-border"><h2 className="text-xl font-medium text-text">Daftar Panitia</h2></div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-bg-surface z-10">
                      <tr className="border-b border-border text-muted">
                        <th className="p-4 font-medium">Panitia</th><th className="p-4 font-medium">Role</th><th className="p-4 font-medium">Telepon</th><th className="p-4 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-text divide-y divide-border">
                      {members.map(m => (
                        <tr key={m.id} className="hover:bg-bg-hover">
                          <td className="p-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: m.avatarColor || '#ccc' }}>{m.name.charAt(0)}</span>
                            {m.name}
                          </td>
                          <td className="p-4 text-muted">{m.role}</td><td className="p-4 text-muted">{m.phone||'-'}</td>
                          <td className="p-4"><button onClick={() => deleteMember(m.id)} className="text-xs bg-bg-raised text-danger px-2 py-1 rounded hover:bg-danger/20">Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Kolom Kanan: Pengaturan Umum */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-t-2 border-warning">
            <h2 className="text-xl font-medium mb-4 text-text">Pengaturan Target</h2>
            <form onSubmit={handleSimpanPengaturan} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-muted">Target Dana Total (Rp)</label>
                <input 
                  type="number" 
                  className="input-field w-full" 
                  value={inputAnggaran}
                  onChange={(e) => setInputAnggaran(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full bg-warning hover:bg-warning/80 text-bg-base font-semibold">
                Simpan Target Dana
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 border-t-2 border-accent-3">
            <h2 className="text-xl font-medium mb-4 text-text">Kelola Role Panitia</h2>
            
            {/* List Role yang ada */}
            <div className="mb-4 space-y-2">
              <label className="block text-sm mb-2 text-muted">Daftar Role Aktif</label>
              <div className="flex flex-wrap gap-2">
                {customRoles.map(role => (
                  <div key={role} className="flex items-center gap-1 bg-bg-raised px-3 py-1 rounded-full text-sm">
                    <span className="text-text">{role}</span>
                    <button 
                      onClick={() => deleteCustomRole(role)}
                      className="ml-2 text-danger hover:text-white hover:bg-danger rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                      title="Hapus role"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleTambahRole} className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="block text-sm mb-1 text-muted">Tambah Role Baru</label>
                <input 
                  type="text" 
                  className="input-field w-full" 
                  placeholder="Ketik role baru..."
                  value={inputRoleBaru}
                  onChange={(e) => setInputRoleBaru(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full bg-accent-3 hover:bg-accent-3/80 font-semibold">
                Tambah Role
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
