# Sistem Informasi Keuangan Pemuda Pemudi Cihuyy

Platform manajemen keuangan berbasis web untuk mendigitalisasi proses pencatatan penarikan dana iuran, manajemen anggaran kegiatan 17 Agustusan, dan pelacakan kontribusi panitia secara real-time.

Proyek ini menggunakan arsitektur Decoupled (Terpisah):
- **Frontend (Web)**: React, Vite, Tailwind CSS, Zustand, Recharts, Axios.
- **Backend (API)**: Node.js, Express, PostgreSQL, Prisma ORM, JSON Web Token (JWT).

## Fitur Utama

- **Public Dashboard (Transparansi)**: Grafik pemasukan dana, kalkulasi sisa saldo, dan progress bar target dana. Akses read-only untuk publik.
- **Admin Control Panel**: Halaman terproteksi JWT untuk mengelola transaksi keuangan harian dan item anggaran.
- **Smart Fallback System**: Jika Backend atau Database tidak bisa dihubungi, Frontend secara otomatis menggunakan *Mock Data* (Data Simulasi) agar UI tetap dapat dirender dan ditinjau.

## Prasyarat (Prerequisites)

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/en/) (Versi 18+)
- [PostgreSQL](https://www.postgresql.org/) (Harus berjalan di lokal pada port `5432`)

## Panduan Instalasi & Menjalankan Aplikasi

Aplikasi ini terdiri dari dua bagian yang harus dijalankan secara paralel.

### 1. Setup Backend (Database & API)

Buka terminal dan masuk ke folder `treasury-api`:
```bash
cd treasury-api
```

Konfigurasi Database:
Pastikan PostgreSQL Anda menyala. Cek file `.env` dan pastikan `DATABASE_URL` sesuai dengan kredensial PostgreSQL lokal Anda. Format default yang digunakan:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/treasury_cihuyy?schema=public"
```

Install dependensi, jalankan migrasi database, dan jalankan server:
```bash
npm install
npx prisma db push   # Membuat tabel-tabel di database PostgreSQL
npm run dev          # Menjalankan server backend di port 5000
```
*Backend akan berjalan di `http://localhost:5000`*

### 2. Setup Frontend (Web Dashboard)

Buka terminal **baru** dan masuk ke folder `treasury-web`:
```bash
cd treasury-web
```

Install dependensi dan jalankan development server:
```bash
npm install
npm run dev
```
*Frontend akan berjalan di `http://localhost:5173`*

## Akses Admin & Autentikasi

- **URL Dashboard Public**: `http://localhost:5173/`
- **URL Login Admin**: `http://localhost:5173/login`
- **Kredensial Default** (untuk testing/fallback):
  - Username: `admin`
  - Password: `admin`

## Struktur Direktori

```text
treasury/
├── treasury-api/              # Backend Express + Prisma
│   ├── controllers/           # Logika bisnis API
│   ├── middleware/            # JWT Auth Middleware
│   ├── prisma/                # Schema database PostgreSQL
│   ├── routes/                # Definisi Endpoint API
│   └── index.js               # Entry point Backend
│
└── treasury-web/              # Frontend React + Vite
    ├── src/
    │   ├── pages/             # Komponen Halaman (Dashboard, Admin, Login)
    │   ├── store/             # Zustand State Management + Axios Fetcher
    │   ├── App.jsx            # React Router
    │   └── index.css          # Tailwind CSS & Global Styles (Glassmorphism)
```

## Status Proyek

Telah diimplementasikan sesuai instruksi (Minggu 1 hingga Minggu 5). Seluruh logic integrasi API dan autentikasi telah tertulis. Jika koneksi database putus, sistem fallback Mock Data di Frontend akan otomatis aktif untuk demonstrasi antarmuka.
