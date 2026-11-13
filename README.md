# 🏫 Portal Web Resmi SMK Negeri 2 Kota Mojokerto

Portal web modern, interaktif, dan responsif untuk **SMK Negeri 2 Kota Mojokerto** dengan arsitektur decoupled modern (**Next.js 16 App Router + React** di presentation layer dan **Laravel RESTful API** di backend data layer).

---

## 🌟 Arsitektur & Teknologi

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Frontend** | Next.js 16 (App Router), React, Tailwind CSS | Single Page Landing, 3D Arc Carousel, Denah Interaktif, Chatbot SADA AI, Modal PPDB & Jurusan |
| **Backend** | Laravel 13, PHP 8.5 | RESTful API Engine, Service & Repository Pattern, Dijkstra Shortest Path Engine |
| **Database** | MySQL / MariaDB | Relasional database untuk profil, hero, jurusan, ruangan denah, waypoint navigasi, dan chatbot |
| **Routing Map** | Algoritma Dijkstra Pathfinding | Navigasi presisi mengikuti koridor pejalan kaki fisik (*paving walkway*) tanpa menembus dinding gedung |

---

## ✨ Fitur Unggulan

### 1. 🚀 Modern Hero Section & 3D Arc Carousel
- Banner utama beresolusi tinggi dengan tagline resmi *"DISIPLIN • BERAKHLAK • BERPRESTASI"*.
- **Arc Carousel 3D**: Karusel lengkung 60fps dengan kartu foto kegiatan siswa beresolusi HD, fitur *pause on hover*, dan *click-to-center*.
- Tombol aksi cepat pendaftaran *Informasi PPDB*.

### 2. ✍️ Sambutan Kepala Sekolah (Live Typewriter Effect)
- Kutipan inspiratif dari Kepala Sekolah (**Bapak Iswahyudi, S.ST.**) yang tampil dengan **efek animasi mengetik (*Typewriter*)** berurutan (*sequential typing*) dan kursor berkedip.
- 5 Indikator Statistik Utama Sekolah (*Siswa Aktif, Guru & Tenaga Pendidik, Tahun Berdiri, Program Keahlian, Alumni Kerja*).

### 3. 🎓 Program Keahlian (Jurusan) & Modal Detail
- Slider responsif untuk 5 jurusan unggulan:
  - **APHP** (Agribisnis Pengolahan Hasil Pertanian)
  - **LPS** (Layanan Perbankan Syariah)
  - **RPL** (Rekayasa Perangkat Lunak)
  - **DKV** (Desain Komunikasi Visual)
  - **Tata Boga / Kuliner** (Kuliner & Tata Hidang)
- **Modal Detail Jurusan**: Klik nama atau foto jurusan untuk membuka popup lengkap berisi profil, kompetensi keahlian, prospek karir lulusan, fasilitas laboratorium, dan tautan langsung ke denah.

### 4. 🗺️ Denah Interaktif Sekolah (Interactive Campus Map)
- Blueprint denah presisi rasio `1540x752` (Denah Ruang Pembelajaran, mulai 5 Oktober 2026) dengan hotspot transparan pada setiap ruangan.
- **Dijkstra Walkway Routing**: Pencarian rute pejalan kaki dari Gerbang Utama menuju ruangan mana pun (seperti Lab RPL 1, Bengkel APHP, Ruang Guru) melalui jalur paving luar ruangan tanpa menembus gedung.
- Pencarian cerdas (*instant search*) dengan autocomplete, filter kategori ruangan, kontrol zoom, dan panel detail ruangan.

### 5. 🤖 SADA Virtual Assistant (AI Chatbot)
- Asisten virtual pintar sekolah dengan tutur kata ramah, sopan, dan hangat.
- **Proteksi Lengkap**: Dilengkapi *Cooldown Timer*, *Rate Limiter (5 pesan/menit)*, *Duplicate Question Guard*, dan *Filter Bahasa Santun (Toxic Guard)*.
- Terintegrasi langsung dengan denah untuk merekomendasikan dan membuka rute ruangan secara otomatis.

### 6. 🏆 Prestasi, Berita & Ekstrakurikuler
- **Prestasi & Kejuaraan**: Kartu foto utama peraih juara dengan badge emas dan garis waktu (*timeline*) penghargaan siswa.
- **Berita & Artikel**: Tata letak *Bento Grid* warna biru dengan filter pill kategori interaktif (*Informasi umum, Prestasi, Agenda, Pengumuman, Karya siswa*).
- **Ekstrakurikuler**: Showcase kegiatan non-akademik siswa (*Paskibra, Futsal, Tari Tradisional, PIK-R, dll.*).

---

## 📁 Struktur Direktori

```text
JHIC/
├── app/                        # Backend Laravel Logic
│   ├── Http/Controllers/Api/  # REST API Controllers (Public & Admin)
│   ├── Models/                 # Eloquent Models (Room, MapNode, MapEdge, Chatbot, etc.)
│   ├── Repositories/           # Data Access Layer
│   └── Services/               # Business Logic & Pathfinding Services
├── database/                   # Migrasi & Seeders (InteractiveMapSeeder, dll.)
├── routes/
│   ├── api.php                 # Endpoint REST API (/api/v1/...)
│   └── web.php                 # API Health Check Endpoint
│
└── frontend-next/              # Presentation Layer (Next.js 16 + React)
    ├── app/                    # Next.js App Router (Layout & Pages)
    ├── components/             # Reusable UI Components
    │   ├── chatbot/            # SADA AI Chatbot Widget
    │   ├── denah/              # Interactive Map, Canvas, SVG Route, Hotspots
    │   ├── home/               # Hero, ArcCarousel, Sambutan, Jurusan, Prestasi, Berita
    │   └── layout/             # Navbar, Footer, Mobile Drawer
    ├── lib/api/                # API Client Services
    └── public/                 # HD Assets, Logos, Blueprint Map
```

---

## ⚡ Panduan Instalasi & Menjalankan

### 1. Menjalankan Backend (Laravel API)
Pastikan PHP 8.5+, Composer, dan MySQL telah terpasang (misalnya via Laragon/XAMPP):

```bash
# Masuk ke direktori root project
cd /path/to/JHIC

# Salin file konfigurasi environment
cp .env.example .env

# Install dependensi PHP
composer install

# Generate Application Key
php artisan key:generate

# Jalankan migrasi dan seeder denah & data sekolah
php artisan migrate:fresh --seed

# Jalankan server API backend (Port 8000)
php artisan serve
```
> Server API akan berjalan di: `http://127.0.0.1:8000`

---

### 2. Menjalankan Frontend (Next.js)
Buka terminal baru untuk menjalankan frontend:

```bash
# Masuk ke direktori frontend
cd frontend-next

# Install dependensi Node.js
npm install

# Jalankan development server (Port 3000)
npm run dev
```
> Buka browser Anda di: `http://localhost:3000`

Untuk membangun bundle produksi:
```bash
npm run build
npm run start
```

---

## 🔌 Ringkasan REST API Endpoint

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/v1/public/home` | Agregasi data landing page (hero, profil, galeri, statistik) |
| `GET` | `/api/v1/public/school-profile` | Informasi visi, misi, dan identitas sekolah |
| `GET` | `/api/v1/public/rooms` | Daftar seluruh ruangan denah dan koordinat hotspot |
| `GET` | `/api/v1/public/rooms/{slug}` | Detail informasi ruangan, deskripsi, dan fasilitas |
| `GET` | `/api/v1/public/map/route?from={origin}&to={dest}` | Jalur navigasi Dijkstra koridor pejalan kaki |
| `POST` | `/api/v1/public/chatbot/message` | Interaksi chat cerdas dengan SADA AI |

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk **SMK Negeri 2 Kota Mojokerto**.  
*Disiplin • Berakhlak • Berprestasi*
