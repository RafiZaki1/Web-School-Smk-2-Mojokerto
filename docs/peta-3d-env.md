# Variabel Lingkungan Peta 3D (Dunia Bersama Realtime)

Dokumen ini menjelaskan variabel lingkungan untuk halaman Peta 3D (`/peta-3d` dan `/id/peta-3d`) beserta layanan Socket.IO (`frontend-next/realtime-server.mjs`).

## 1. Frontend (`frontend-next`)

| Variabel | Wajib | Keterangan | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_PETA3D_REALTIME_URL` | Wajib di production | Alamat layanan Socket.IO realtime. Pada halaman `https://`, wajib memakai `https://` / `wss://`. Jika kosong di production, Peta 3D berjalan sebagai denah statis dengan badge `Online: tidak tersedia`. | `https://realtime.domain-sekolah.sch.id` |
| `INTERNAL_API_URL` | Opsional | Base URL API Laravel internal untuk verifikasi sesi login (`/admin/auth/me`) oleh Next.js route `/api/peta-3d/session`. | `http://127.0.0.1:8000/api/v1` |
| `PETA3D_SESSION_SECRET` | Wajib di production | Kunci HMAC-SHA256 bersama antara Next.js `/api/peta-3d/session` dan `realtime-server.mjs` (isi dengan string acak panjang di environment server). | `<isi-kunci-acak-aman>` |

## 2. Layanan Realtime (`frontend-next/realtime-server.mjs`)

| Variabel | Wajib | Keterangan | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `PETA3D_SOCKET_PORT` | Opsional | Port server Socket.IO (default `3001`). | `3001` |
| `PETA3D_SESSION_SECRET` | Wajib di production | Harus sama persis dengan `PETA3D_SESSION_SECRET` pada `frontend-next`. | `<isi-kunci-acak-aman>` |
| `PETA3D_ALLOWED_ORIGINS` | Wajib di production | Daftar origin yang diizinkan oleh CORS (dipisahkan koma). Di mode development, `localhost` dan `127.0.0.1` otomatis diizinkan. | `https://smkn2mojokerto.sch.id,https://www.smkn2mojokerto.sch.id` |
