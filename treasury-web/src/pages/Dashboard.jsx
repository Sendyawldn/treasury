import { useEffect } from "react";
import useStore from "../store/useStore";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { fmtRupiah, fmtShort, fmtTanggal } from "../utils/format";

const C = {
  terkumpul: "#6c63ff",
  konsumsi: "#f87171",
  saldo: "#38bdf8",
  grid: "rgba(255,255,255,0.06)",
  tick: "#64748b",
};

const Dashboard = () => {
  const { transactions, targetDana, fetchDashboardData, isLoading } =
    useStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalTerkumpul = transactions.reduce((s, t) => s + t.terkumpul, 0);
  const totalKonsumsi = transactions.reduce((s, t) => s + t.konsumsi, 0);
  const saldoAkhir = totalTerkumpul - totalKonsumsi;
  const rataRata = transactions.length
    ? Math.round(totalTerkumpul / transactions.length)
    : 0;
  const pct =
    targetDana > 0 ? Math.min(100, (totalTerkumpul / targetDana) * 100) : 0;

  // Data for Bar Chart
  const barData = transactions.map((t) => ({
    date: fmtTanggal(t.date),
    terkumpul: t.terkumpul,
    konsumsi: t.konsumsi,
  }));

  // Data for Line Chart
  const lineData = transactions.reduce((acc, t) => {
    const lastKum = acc.length > 0 ? acc[acc.length - 1].saldo : 0;
    const currentKum = lastKum + (t.terkumpul - t.konsumsi);
    acc.push({ date: fmtTanggal(t.date), saldo: currentKum });
    return acc;
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold text-text flex items-center justify-center md:justify-start gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-base md:text-lg">
              P
            </span>
            Pemuda Cihuyy
          </h1>
          <p className="text-sm md:text-base text-muted mt-1">
            Dana 17 Agustusan 2026
          </p>
        </div>
        <div className="flex gap-2 md:gap-3 justify-center items-center flex-wrap">
          <Link
            to="/anggaran"
            className="btn-primary bg-bg-raised text-text border border-border-md hover:bg-bg-hover text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
          >
            Rincian Anggaran
          </Link>
          <Link
            to="/panitia"
            className="btn-primary bg-bg-raised text-text border border-border-md hover:bg-bg-hover text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
          >
            Struktur Panitia
          </Link>
          <Link
            to="/login"
            className="text-muted hover:text-accent p-2 rounded-lg transition-colors"
            title="Panel Akses"
          >
            <Lock size={18} />
          </Link>
        </div>
      </header>

      {isLoading && <p className="text-muted text-center">Memuat data...</p>}

      {!isLoading && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div
              className="glass-panel p-4 md:p-6 border-t-2"
              style={{ borderTopColor: C.terkumpul }}
            >
              <h3 className="text-muted text-xs md:text-sm tracking-wide">
                Terkumpul
              </h3>
              <p className="text-2xl md:text-3xl font-medium text-text mt-2">
                {fmtRupiah(totalTerkumpul)}
              </p>
            </div>
            <div
              className="glass-panel p-4 md:p-6 border-t-2"
              style={{ borderTopColor: C.konsumsi }}
            >
              <h3 className="text-muted text-xs md:text-sm tracking-wide">
                Konsumsi
              </h3>
              <p className="text-2xl md:text-3xl font-medium text-text mt-2">
                {fmtRupiah(totalKonsumsi)}
              </p>
            </div>
            <div
              className="glass-panel p-4 md:p-6 border-t-2"
              style={{ borderTopColor: C.saldo }}
            >
              <h3 className="text-muted text-xs md:text-sm tracking-wide">
                Saldo Akhir
              </h3>
              <p className="text-2xl md:text-3xl font-medium text-text mt-2">
                {fmtRupiah(saldoAkhir)}
              </p>
            </div>
            <div className="glass-panel p-4 md:p-6 border-t-2 border-border-md">
              <h3 className="text-muted text-xs md:text-sm tracking-wide">
                Rata-rata / Hari
              </h3>
              <p className="text-2xl md:text-3xl font-medium text-text mt-2">
                {fmtRupiah(rataRata)}
              </p>
            </div>
          </div>

          {/* Target Progress */}
          <div className="glass-panel p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-2 sm:mb-3 gap-1 sm:gap-0">
              <h3 className="text-base md:text-lg font-medium text-text">
                Progress Pencapaian Anggaran
              </h3>
              <span className="text-warning font-semibold text-base md:text-lg">
                {pct.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-3 overflow-hidden">
              <div
                className="bg-warning h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <p className="text-xs md:text-sm text-muted mt-2">
              Target: {fmtRupiah(targetDana)}
            </p>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Bar Chart */}
            <div className="glass-panel p-4 md:p-6 h-[300px] md:h-[400px] flex flex-col">
              <h3 className="text-base md:text-lg font-medium text-text mb-4">
                Terkumpul vs Konsumsi
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={C.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={C.tick}
                      tick={{ fill: C.tick, fontSize: 10 }}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke={C.tick}
                      tickFormatter={fmtShort}
                      tick={{ fill: C.tick, fontSize: 10 }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#1a1e28",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#f1f5f9" }}
                      formatter={(val) => fmtRupiah(val)}
                    />
                    <Bar
                      dataKey="terkumpul"
                      name="Pemasukan"
                      fill="#6c63ff88"
                      stroke={C.terkumpul}
                      strokeWidth={1}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="konsumsi"
                      name="Pengeluaran"
                      fill="#f8717144"
                      stroke={C.konsumsi}
                      strokeWidth={1}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart */}
            <div className="glass-panel p-4 md:p-6 h-[300px] md:h-[400px] flex flex-col">
              <h3 className="text-base md:text-lg font-medium text-text mb-4">
                Saldo Kumulatif
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={lineData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSaldo"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={C.saldo}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={C.saldo}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={C.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={C.tick}
                      tick={{ fill: C.tick, fontSize: 10 }}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke={C.tick}
                      tickFormatter={fmtShort}
                      tick={{ fill: C.tick, fontSize: 10 }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#1a1e28",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#f1f5f9" }}
                      formatter={(val) => fmtRupiah(val)}
                    />
                    <Area
                      type="monotone"
                      dataKey="saldo"
                      name="Kumulatif"
                      stroke={C.saldo}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSaldo)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="glass-panel p-0 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-border">
              <h3 className="text-base md:text-lg font-medium text-text">
                Rincian Per Hari
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-hover text-muted text-xs md:text-sm">
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">
                      Tanggal
                    </th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">
                      Terkumpul
                    </th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">
                      Konsumsi
                    </th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">
                      Saldo Hari Ini
                    </th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">
                      Kumulatif
                    </th>
                    <th className="p-3 md:p-4 font-medium whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-text divide-y divide-border text-xs md:text-sm">
                  {(() => {
                    let k = 0;
                    return transactions.map((t, i) => {
                      const sHariIni = t.terkumpul - t.konsumsi;
                      k += sHariIni;
                      const isSurplus = sHariIni >= 0;
                      return (
                        <tr
                          key={t.id || i}
                          className="hover:bg-bg-raised transition-colors"
                        >
                          <td className="p-3 md:p-4 whitespace-nowrap">
                            {fmtTanggal(t.date)}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap text-accent font-medium">
                            {fmtRupiah(t.terkumpul)}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap text-danger font-medium">
                            {fmtRupiah(t.konsumsi)}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap font-medium">
                            {fmtRupiah(sHariIni)}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap text-accent-3">
                            {fmtRupiah(k)}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap">
                            <span
                              className={`px-2 md:px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium ${isSurplus ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}
                            >
                              {isSurplus ? "Surplus" : "Minus"}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                  {transactions.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-4 md:p-6 text-center text-muted"
                      >
                        Belum ada data riwayat transaksi.
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

export default Dashboard;
