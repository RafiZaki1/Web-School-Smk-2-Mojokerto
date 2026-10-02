"use client";

import Link from "next/link";
import AdminListPage, { RowActions, lastUpdated } from "../AdminListPage";
import { StatusBadge } from "../ui/Badge";
import { adminApi } from "@/lib/api/adminApi";
import { toAdminAspirasi, toBerita, toEkstra, toJurusan, toLowongan, toPrestasiCard } from "@/lib/api/adapters";
import { KATEGORI_ASPIRASI_TONES } from "@/lib/data/aspirasiData";

const count = (rows, status) => rows.filter((row) => row.status === status).length;
const Muted = ({ children }) => <span className="mt-0.5 block text-[13px] text-[#64748b]">{children}</span>;

// Pemuat data stabil (di luar komponen) agar tidak memicu muat ulang berulang
const loadJurusan = async () => (await adminApi.majors.list()).map(toJurusan);
const loadPrestasi = async () => (await adminApi.achievements.list()).map(toPrestasiCard);
const loadEkstra = async () => (await adminApi.extracurriculars.list()).map(toEkstra);
const loadBerita = async () => (await adminApi.articles.list()).map(toBerita);
const loadLoker = async () => (await adminApi.jobs.list()).map(toLowongan);
const loadAspirasi = async () => (await adminApi.aspirations.list()).items.map(toAdminAspirasi);

export function JurusanList() {
  return (
    <AdminListPage
      title="Kelola Jurusan"
      subtitle="Tambah, ubah, atau hapus data program keahlian."
      addLabel="Tambah Jurusan"
      addHref="/admin/jurusan/tambah"
      load={loadJurusan}
      remove={(row) => adminApi.majors.remove(row.id)}
      metrics={(rows) => [
        { value: rows.length, label: "Total jurusan" },
        { value: count(rows, "Aktif"), label: "Ditampilkan di web" },
        { value: count(rows, "Draf"), label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["code", "fullName"]}
      searchPlaceholder="Cari jurusan..."
      columns={(remove) => [
        {
          key: "code",
          label: "Kode",
          render: (row) => (
            <span className="flex items-center gap-4">
              <img src={row.image} alt="" className="h-[45px] w-[45px] rounded-lg object-cover object-top" />
              <span className="text-base font-semibold text-[#0f172a]">{row.code}</span>
            </span>
          ),
        },
        { key: "fullName", label: "Nama Jurusan", render: (row) => <span className="font-medium">{row.fullName}</span> },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "aksi", label: "Aksi", render: (row) => <RowActions label={row.code} editHref={`/admin/jurusan/${row.id}`} onDelete={() => remove(row.id)} /> },
      ]}
    />
  );
}

export function PrestasiList() {
  return (
    <AdminListPage
      title="Kelola Prestasi"
      subtitle="Tambah, ubah, atau hapus data prestasi siswa."
      addLabel="Tambah Prestasi"
      addHref="/admin/prestasi/tambah"
      load={loadPrestasi}
      remove={(row) => adminApi.achievements.remove(row.slug)}
      metrics={(rows) => [
        { value: rows.length, label: "Total prestasi" },
        { value: rows.filter((row) => ["Nasional", "Internasional"].includes(row.level)).length, label: "Tingkat nasional+" },
        { value: count(rows, "Draf"), label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["title", "siswa"]}
      searchPlaceholder="Cari prestasi..."
      columns={(remove) => [
        {
          key: "title",
          label: "Prestasi",
          render: (row) => (
            <span className="block max-w-[280px]">
              <span className="font-semibold text-[#0f172a]">{row.title}</span>
              <Muted>{row.date}</Muted>
            </span>
          ),
        },
        {
          key: "siswa",
          label: "Siswa",
          render: (row) => (
            <span>
              {row.siswa}
              <Muted>{row.kelas}</Muted>
            </span>
          ),
        },
        { key: "level", label: "Tingkat" },
        { key: "badge", label: "Predikat" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "aksi", label: "Aksi", render: (row) => <RowActions label={row.title} editHref={`/admin/prestasi/${row.slug}`} onDelete={() => remove(row.id)} /> },
      ]}
    />
  );
}

export function EkstraList() {
  return (
    <AdminListPage
      title="Kelola Ekstrakurikuler"
      subtitle="Tambah, ubah, atau hapus data program ekstra."
      addLabel="Ekstrakurikuler"
      addHref="/admin/ekstrakurikuler/tambah"
      load={loadEkstra}
      remove={(row) => adminApi.extracurriculars.remove(row.id)}
      metrics={(rows) => [
        { value: rows.length, label: "Total ekstra" },
        { value: count(rows, "Aktif"), label: "Ditampilkan di web" },
        { value: count(rows, "Draf"), label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["name", "subtitle"]}
      searchPlaceholder="Cari ekstrakurikuler..."
      columns={(remove) => [
        { key: "name", label: "Nama", render: (row) => <span className="font-semibold text-[#0f172a]">{row.name}</span> },
        { key: "subtitle", label: "Fokus" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "aksi", label: "Aksi", render: (row) => <RowActions label={row.name} editHref={`/admin/ekstrakurikuler/${row.id}`} onDelete={() => remove(row.id)} /> },
      ]}
    />
  );
}

export function BeritaList() {
  return (
    <AdminListPage
      title="Kelola Berita & Artikel"
      subtitle="Tambah, ubah, atau hapus berita dan artikel sekolah."
      addLabel="Tambah Berita"
      addHref="/admin/berita/tambah"
      load={loadBerita}
      remove={(row) => adminApi.articles.remove(row.slug)}
      metrics={(rows) => [
        { value: rows.length, label: "Total berita" },
        { value: count(rows, "Aktif"), label: "Ditampilkan di web" },
        { value: count(rows, "Draf"), label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["title", "category"]}
      searchPlaceholder="Cari berita..."
      columns={(remove) => [
        { key: "title", label: "Berita", render: (row) => <span className="line-clamp-2 block max-w-[320px] font-semibold text-[#0f172a]">{row.title}</span> },
        { key: "category", label: "Kategori" },
        { key: "author", label: "Penulis" },
        { key: "date", label: "Tanggal", className: "whitespace-nowrap" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "aksi", label: "Aksi", render: (row) => <RowActions label={row.title} editHref={`/admin/berita/${row.slug}`} onDelete={() => remove(row.id)} /> },
      ]}
    />
  );
}

export function LokerList() {
  return (
    <AdminListPage
      title="Kelola Loker & BKK"
      subtitle="Tambah, ubah, atau hapus lowongan kerja yang tampil di halaman BKK."
      addLabel="Tambah Lowongan"
      addHref="/admin/bkk/tambah"
      load={loadLoker}
      remove={(row) => adminApi.jobs.remove(row.slug)}
      metrics={(rows) => [
        { value: rows.length, label: "Total lowongan" },
        { value: count(rows, "Aktif"), label: "Aktif ditampilkan" },
        { value: count(rows, "Tutup"), label: "Sudah tutup" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["title", "company", "kategori"]}
      searchPlaceholder="Cari lowongan..."
      columns={(remove) => [
        { key: "title", label: "Lowongan", render: (row) => <span className="font-semibold text-[#0f172a]">{row.title}</span> },
        {
          key: "company",
          label: "Perusahaan",
          render: (row) => (
            <span>
              {row.company}
              <Muted>{row.location}</Muted>
            </span>
          ),
        },
        { key: "kategori", label: "Kategori" },
        { key: "tutup", label: "Tutup", className: "whitespace-nowrap" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "aksi", label: "Aksi", render: (row) => <RowActions label={row.title} editHref={`/admin/bkk/${row.slug}`} onDelete={() => remove(row.id)} /> },
      ]}
    />
  );
}

export function AspirasiList() {
  return (
    <AdminListPage
      title="Kelola Aspirasi"
      subtitle="Tinjau dan tindak lanjuti aspirasi yang masuk dari siswa."
      load={loadAspirasi}
      remove={(row) => adminApi.aspirations.remove(row.id)}
      metrics={(rows) => [
        { value: rows.length, label: "Total aspirasi" },
        { value: count(rows, "Baru"), label: "Belum ditinjau" },
        { value: count(rows, "Diproses"), label: "Sedang diproses" },
        { value: count(rows, "Selesai"), label: "Selesai ditangani" },
      ]}
      searchKeys={["judul", "kategori"]}
      searchPlaceholder="Cari aspirasi..."
      columns={() => [
        {
          key: "judul",
          label: "Aspirasi",
          render: (row) => (
            <span className="flex items-start gap-3">
              {row.status === "Baru" ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#dc2626]" aria-label="Baru" /> : <span className="w-2 shrink-0" />}
              <span>
                <span className="font-semibold text-[#0f172a]">{row.judul}</span>
                <Muted>{row.tanggal}</Muted>
              </span>
            </span>
          ),
        },
        {
          key: "kategori",
          label: "Kategori",
          render: (row) => <span className={`rounded-md px-2.5 py-1 text-[13px] font-medium ${KATEGORI_ASPIRASI_TONES[row.kategori]}`}>{row.kategori}</span>,
        },
        { key: "pengirim", label: "Pengirim", render: (row) => (row.anonim ? "Anonim" : row.pengirim) },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => (
            <Link href={`/admin/aspirasi/${row.id}`} className="font-semibold text-[#2563eb] hover:underline">
              Tinjau
            </Link>
          ),
        },
      ]}
    />
  );
}
