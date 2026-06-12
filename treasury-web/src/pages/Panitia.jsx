import { useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';

const Panitia = () => {
  const { members, fetchDashboardData, isLoading } = useStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Kelompokkan anggota berdasarkan Role
  const groupedMembers = useMemo(() => {
    const groups = {};
    members.forEach(m => {
      const role = m.role || 'Lain-lain';
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(m);
    });
    
    // Custom sort untuk role: Ketua pertama, Wakil kedua, dsb.
    const order = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Anggota'];
    
    return Object.keys(groups)
      .sort((a, b) => {
        let idxA = order.indexOf(a);
        let idxB = order.indexOf(b);
        if (idxA === -1) idxA = 99;
        if (idxB === -1) idxB = 99;
        if (idxA !== idxB) return idxA - idxB;
        return a.localeCompare(b);
      })
      .map(role => ({
        role,
        members: groups[role]
      }));
  }, [members]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-lg">P</span>
            Struktur Kepanitiaan
          </h1>
          <p className="text-muted mt-1">Pemuda Pemudi Cihuyy 2025</p>
        </div>
        <div className="flex gap-3">
          <Link to="/" className="btn-primary bg-bg-raised text-text border border-border-md hover:bg-bg-hover">
            &larr; Kembali ke Dashboard
          </Link>
        </div>
      </header>

      {isLoading ? (
        <p className="text-muted text-center py-10">Memuat data panitia...</p>
      ) : (
        <div className="space-y-10">
          {groupedMembers.length === 0 ? (
            <div className="glass-panel p-10 text-center text-muted">
              Belum ada data anggota panitia yang terdaftar.
            </div>
          ) : (
            groupedMembers.map(group => (
              <div key={group.role} className="space-y-4">
                <div className="border-b border-border pb-2">
                  <h2 className="text-xl font-medium text-accent-3 uppercase tracking-wider">{group.role}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {group.members.map(m => (
                    <div key={m.id} className="glass-panel p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-3xl shadow-lg mb-4"
                        style={{ backgroundColor: m.avatarColor || '#6c63ff' }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-lg font-medium text-text">{m.name}</h3>
                      {m.phone && <p className="text-sm text-muted mt-2 bg-bg-raised px-3 py-1 rounded-full">{m.phone}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Panitia;
