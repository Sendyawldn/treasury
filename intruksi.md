INSTRUKSI PROYEK: SISTEM INFORMASI KEUANGAN PEMUDA PEMUDI CIHUYY
Single Source of Truth — Dokumen ini adalah acuan utama pengerjaan konversi Dashboard 17 Agustusan Cihuyy dari Vanilla HTML ke ekosistem Full Stack.

Posisi Asisten: Senior Full Stack Developer (React + Node.js Expert).

1. Ringkasan Proyek & Role Pengguna
   Membangun platform manajemen keuangan berbasis web untuk mendigitalisasi proses pencatatan penarikan dana iuran, manajemen anggaran kegiatan 17 Agustusan, dan pelacakan kontribusi panitia secara real-time.

Peran Pengguna (Hanya 2):

Panitia / Publik (Viewer): Mengakses halaman utama untuk melihat progress penarikan dana, transparansi sisa saldo, rincian pengeluaran, dan leaderboard kontribusi anggota secara visual tanpa bisa mengubah data.

Admin (Bendahara / Ketua): Melakukan login ke protected route (/admin) untuk menginput data penarikan iuran harian, menambah/menghapus item anggaran, mengatur peran anggota panitia, dan mengelola konfigurasi target dana.

2. Struktur Folder Proyek
   Proyek ini menggunakan arsitektur decoupled untuk memisahkan logika client-side dan server-side.

treasury/
├── treasury-api/ # Backend (Node.js + Express + PostgreSQL)
└── treasury-web/ # Frontend (React + Vite + Tailwind CSS)

3. Stack Teknologi
   Backend (API)

Environment: Node.js.

Framework: Express.js untuk membangun RESTful API yang ringan.

Database: PostgreSQL (Relasional, sangat ideal untuk integritas data keuangan).

Auth: JSON Web Token (JWT) untuk proteksi halaman admin.

Frontend (Client)

Framework: React (menggunakan Vite untuk build yang sangat cepat).

Styling: Tailwind CSS (menggantikan custom variables CSS lama).

UI Components: Recharts atau react-chartjs-2 untuk visualisasi data grafik.

State Management: Zustand atau React Context API.

Development & Deployment Tools

Environment: Native/Local Node.js (Berjalan langsung di OS lokal tanpa menggunakan Docker untuk meminimalisir overhead di tahap development).

IDE: VS Code.

Hosting: Vercel untuk Frontend (React), dan Railway untuk Backend (Express) serta Database (Postgres).

4. Workflow Operasional (Standard Pengembangan)
   Local Development: Seluruh kode dieksekusi secara native menggunakan npm run dev pada masing-masing repository (frontend dan backend) secara paralel di VS Code.

API Documentation: Menggunakan Postman untuk mengetes endpoint CRUD (Penarikan, Anggaran, Anggota) sebelum diintegrasikan ke React.

Database Migration: Menggunakan tools seperti Prisma ORM atau Sequelize untuk menyinkronkan skema tabel ke database PostgreSQL secara rapi.

5. Fitur Monitoring (Dashboard)
   Financial Metrics: Kalkulasi otomatis perbandingan total dana terkumpul vs target anggaran, serta kalkulasi sisa saldo bersih.

Visualisasi Dinamis: Rendering grafik kumulatif saldo, distribusi anggaran per kategori (Konsumsi, Panggung, dll.), dan grafik batang sebaran tugas anggota.

Admin Control Panel: Form terpusat yang menggantikan modal pop-up HTML sebelumnya, diamankan dengan login session, langsung terhubung dengan database utama.

6. Database Schema (Core Entities)
   Berikut adalah gambaran relasi data menggunakan sintaks model deklaratif:

model Member {
id Int @id @default(autoincrement())
name String
role String // "Ketua", "Bendahara", "Anggota", dll
phone String?
avatarColor String // "v", "b", "g", dll
}

model Transaction {
id Int @id @default(autoincrement())
date DateTime
terkumpul Int @default(0) // Pemasukan harian
konsumsi Int @default(0) // Pengeluaran harian
notes String?
}

model BudgetItem {
id Int @id @default(autoincrement())
name String
category String // "Konsumsi", "Dekorasi", dll
unit String
volume Int
price Int // Harga satuan
}

7. Timeline Pengembangan
   Minggu 1: Inisiasi proyek React dengan Vite dan Tailwind. Setup server Express.js lokal dan koneksi ke PostgreSQL lokal.

Minggu 2: Membangun endpoint API (CRUD) untuk Anggota, Transaksi, dan Anggaran. Pengetesan dengan Postman.

Minggu 3: Konversi komponen UI HTML "Cihuyy" ke dalam React Components. Implementasi routing dasar.

Minggu 4: Integrasi API ke Frontend, menggantikan localStorage dengan data asli dari PostgreSQL. Implementasi Chart dan State Management.

Minggu 5: Pembuatan halaman Admin terproteksi (JWT Login). Deployment Frontend ke Vercel dan Backend+DB ke Railway.

Catatan Khusus:

Akses publik hanya bersifat read-only. Semua manipulasi data keuangan wajib melalui authentication (login).

Data divisualisasikan se-interaktif mungkin agar seluruh panitia bisa memantau progress secara transparan dari HP masing-masing.
