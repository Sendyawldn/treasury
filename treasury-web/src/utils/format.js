export const fmtRupiah = (n) =>
  'Rp ' + Math.round(n).toLocaleString('id-ID');

export const fmtShort = (n) => {
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1) + 'jt';
  if (n >= 1e3) return 'Rp ' + Math.round(n / 1e3) + 'rb';
  return 'Rp ' + Math.round(n);
};

export const fmtTanggal = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
