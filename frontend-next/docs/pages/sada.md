# SADA Roomchat - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: SADA Roomchat - SMKN 2 Kota Mojokerto
- Route: `/sada`
- File: `src/app/sada/page.tsx`

## 2. Tujuan Halaman
SADA siap membantu menjawab pertanyaan seputar SMKN 2 Mojokerto.

## 3. Components
- `SadaRoom` dari `@/features/chatbot`

## 4. API
- `features/chatbot/api/chatbot.api.ts`
- `features/chatbot/hooks/useSadaChat.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "SADA Roomchat - SMKN 2 Kota Mojokerto"
- Description: "SADA siap membantu menjawab pertanyaan seputar SMKN 2 Mojokerto."
- Open Graph: title, description, `type: website`

## 8. Permission
Publik.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Kirim pesan SADA memakai useMutation di `useSadaChat`; indikator mengetik diturunkan dari `isPending`. Open Graph ditambahkan.
