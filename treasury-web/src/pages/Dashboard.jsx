import { useEffect } from 'react';
import useStore from '../store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { transactions, targetDana, fetchDashboardData } = useStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalTerkumpul = transactions.reduce((acc, curr) => acc + curr.terkumpul, 0);
  const totalPengeluaran = transactions.reduce((acc, curr) => acc + curr.konsumsi, 0);
  const saldoBersih = totalTerkumpul - totalPengeluaran;
  const progressPercent = Math.min((totalTerkumpul / targetDana) * 100, 100).toFixed(1);

  // Prepare chart data
  let cumulative = 0;
  const chartData = transactions.map(t => {
    cumulative += t.terkumpul;
    return { date: t.date, total: cumulative };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Dashboard 17 Agustusan
          </h1>
          <p className="text-text-muted mt-1">Transparansi Keuangan Warga Cihuyy</p>
        </div>
        <Link to="/login" className="btn-primary">
          Login Admin
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-text-muted text-sm uppercase tracking-wider">Total Terkumpul</h3>
          <p className="text-4xl font-bold text-accent mt-2">Rp {totalTerkumpul.toLocaleString()}</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-text-muted text-sm uppercase tracking-wider">Total Pengeluaran</h3>
          <p className="text-4xl font-bold text-primary mt-2">Rp {totalPengeluaran.toLocaleString()}</p>
        </div>
        <div className="glass-panel p-6 border-t-4 border-info">
          <h3 className="text-text-muted text-sm uppercase tracking-wider">Saldo Bersih</h3>
          <p className="text-4xl font-bold text-white mt-2">Rp {saldoBersih.toLocaleString()}</p>
        </div>
      </div>

      {/* Target Progress */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-xl font-medium">Target Dana (Rp {targetDana.toLocaleString()})</h3>
          <span className="text-accent font-bold text-xl">{progressPercent}%</span>
        </div>
        <div className="w-full bg-surface-hover rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel p-6 h-[400px]">
        <h3 className="text-xl font-medium mb-6">Grafik Pemasukan Dana</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area type="monotone" dataKey="total" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorTotal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
