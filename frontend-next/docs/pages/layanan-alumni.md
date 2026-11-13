# Layanan Berkas Alumni

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: Publik (alumni, tanpa login)
- Menu: Navbar > Informasi > Layanan Berkas Alumni; tautan dari lonceng notifikasi
- Halaman: Layanan Berkas Alumni
- Route: `/layanan-alumni`
- File: `src/app/[locale]/layanan-alumni/page.tsx`

## 2. Tujuan Halaman
Alumni mengajukan Ambil Ijazah, Cap Tiga Jari, atau Legalisir, lalu memantau status dari perangkat yang sama dan menerima notifikasi HP saat disetujui.

## 3. Components
- `LayananAlumniView` dari `@/features/layanan-alumni`
- `AlumniServiceForm`, `ServiceTypeField`, `MyServiceRequests`, `PushNotificationToggle` (internal fitur)
- `FormText`, `FormSelect`, `FormTextarea` (`shared/components/form`)

## 4. API
- `POST /api/v1/public/alumni-services` + header `X-Device-Token` -> `submitAlumniServiceApi`
- `GET /api/v1/public/device-notifications` (lonceng, `shared/services/device-inbox.api.ts`)
- `GET /api/v1/public/push/key`, `POST/DELETE /api/v1/public/push/subscriptions` (Web Push)

## 5. Technical Flow
Token perangkat (UUID) dibuat saat pengajuan pertama dan disimpan di localStorage (`shared/lib/device/device-token.ts`). Setelah kirim, cache lonceng di-invalidate. Tombol notifikasi HP mendaftarkan service worker `/sw.js` dan langganan push ke server.

## 6. State Management
Server state: TanStack Query (`device-inbox`, `push-state`). Form: RHF + zod `alumniServiceSchema`. Token perangkat: `useSyncExternalStore` atas localStorage.

## 7. SEO Metadata
- Title: "Layanan Berkas Alumni - SMKN 2 Kota Mojokerto"
- Description: "Ajukan pengambilan ijazah, cap tiga jari, atau legalisir ... tanpa login."
- Lainnya: canonical `/layanan-alumni`

## 8. Permission
Publik. Daftar pengajuan dan lonceng hanya berisi data milik token perangkat ini.

## 9. Loading Strategy
Teks status di panel pengajuan; tombol "Mengirim..." saat submit.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global) atau ditampilkan di form (422 per kolom, 404/403/429 sebagai pesan). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- Web Push butuh HTTPS (atau localhost) dan izin notifikasi. Browser yang tidak mendukung mendapat penjelasan, status tetap ada di lonceng.

## 12. Changelog
- 2026-11-12: Halaman baru.
