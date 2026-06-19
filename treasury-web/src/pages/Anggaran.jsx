import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';
import { fmtRupiah } from '../utils/format';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#6c63ff', '#38bdf8', '#f87171', '#fbbf24', '#a78bfa', '#34d399'];

const Anggaran = () => {
  const { budgetItems, targetDana, fetchDashboardData, isLoading, transactions } = useStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Kelompokkan berdasarkan kategori
  const categoryMap = budgetItems.reduce((acc, item) => {
    const totalItemPrice = item.price * item.volume;
    if (!acc[item.category]) acc[item.category] = 0;
    acc[item.category] += totalItemPrice;
    return acc;
  }, {});

  const dataGrafik = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  })).sort((a, b) => b.value - a.value);

  const totalAnggaran = dataGrafik.reduce((sum, item) => sum + item.value, 0);
  const totalTerkumpul = transactions.reduce((s, t) => s + t.terkumpul, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-8">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-bg-surface border border-border-md text-muted hover:text-text hover:bg-bg-hover transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-text">
              Rincian Anggaran
            </h1>
            <p className="text-sm md:text-base text-muted mt-1">
              Kebutuhan & Perencanaan 17 Agustusan
            </p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <p className="text-muted text-center">Memuat data anggaran...</p>
      ) : (
        <>
          {/* Ringkasan Anggaran */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="glass-panel p-6 border-t-2 border-accent">
              <h3 className="text-muted text-sm tracking-wide">Total Estimasi Anggaran</h3>
              <p className="text-3xl font-medium text-text mt-2">{fmtRupiah(totalAnggaran)}</p>
            </div>
            <div className="glass-panel p-6 border-t-2 border-warning">
              <h3 className="text-muted text-sm tracking-wide">Target Pengumpulan Dana</h3>
              <p className="text-3xl font-medium text-text mt-2">{fmtRupiah(targetDana)}</p>
            </div>
            <div className="glass-panel p-6 border-t-2 border-success">
              <h3 className="text-muted text-sm tracking-wide">Total Dana Terkumpul</h3>
              <p className="text-3xl font-medium text-text mt-2">{fmtRupiah(totalTerkumpul)}</p>
            </div>
          </div>

          {/* Grafik Anggaran */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="glass-panel p-6 h-[400px] flex flex-col">
              <h3 className="text-lg font-medium text-text mb-4">Proporsi per Kategori</h3>
              {dataGrafik.length > 0 ? (
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataGrafik}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {dataGrafik.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#1a1e28",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "#f1f5f9" }}
                        formatter={(val) => fmtRupiah(val)}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted">Belum ada data anggaran</div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="glass-panel p-6 h-[400px] flex flex-col">
              <h3 className="text-lg font-medium text-text mb-4">Perbandingan Kategori</h3>
              {dataGrafik.length > 0 ? (
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dataGrafik}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#64748b" tickFormatter={(val) => `Rp${val/1000}k`} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" width={100} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#1a1e28",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        itemStyle={{ color: "#f1f5f9" }}
                        formatter={(val) => fmtRupiah(val)}
                      />
                      <Bar dataKey="value" name="Total Estimasi" radius={[0, 4, 4, 0]}>
                        {dataGrafik.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted">Belum ada data anggaran</div>
              )}
            </div>
          </div>

          {/* Rincian Item */}
          <div className="glass-panel p-0 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-medium text-text">Rincian Item Anggaran</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-hover text-muted text-sm">
                    <th className="p-4 font-medium whitespace-nowrap">Nama Barang / Kebutuhan</th>
                    <th className="p-4 font-medium whitespace-nowrap">Kategori</th>
                    <th className="p-4 font-medium whitespace-nowrap">Volume</th>
                    <th className="p-4 font-medium whitespace-nowrap">Harga Satuan</th>
                    <th className="p-4 font-medium whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody className="text-text divide-y divide-border text-sm">
                  {budgetItems.map((b) => (
                    <tr key={b.id} className="hover:bg-bg-raised transition-colors">
                      <td className="p-4 font-medium">{b.name}</td>
                      <td className="p-4 text-muted">
                        <span className="bg-bg-hover px-2 py-1 rounded text-xs">{b.category}</span>
                      </td>
                      <td className="p-4">{b.volume} {b.unit}</td>
                      <td className="p-4 text-muted">{fmtRupiah(b.price)}</td>
                      <td className="p-4 text-accent font-medium">{fmtRupiah(b.price * b.volume)}</td>
                    </tr>
                  ))}
                  {budgetItems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-muted">
                        Belum ada item anggaran yang ditambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Anggaran;
