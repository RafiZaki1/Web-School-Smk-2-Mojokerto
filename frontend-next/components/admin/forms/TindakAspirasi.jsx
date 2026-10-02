"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, UserRound } from "lucide-react";
import AdminButton from "../ui/AdminButton";
import LoadErrorNotice from "../ui/LoadErrorNotice";
import { StatusBadge } from "../ui/Badge";
import { ChoiceChips, InputLongText, InputText } from "../ui/Fields";
import { useAdminSession } from "../AdminSession";
import { adminApi } from "@/lib/api/adminApi";
import { toAdminAspirasi } from "@/lib/api/adapters";
import { KATEGORI_ASPIRASI_TONES } from "@/lib/data/aspirasiData";

const STATUS_OPTIONS = ["Baru", "Sedang Diproses", "Selesai"];
const TO_OPTION = { new: "Baru", in_progress: "Sedang Diproses", resolved: "Selesai" };
const TO_KEY = { Baru: "new", "Sedang Diproses": "in_progress", Selesai: "resolved" };

export default function TindakAspirasi({ id }) {
  const router = useRouter();
  const { refreshSummary } = useAdminSession();
  const [aspirasi, setAspirasi] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [status, setStatus] = useState("Baru");
  const [catatan, setCatatan] = useState("");
  const [tanggapan, setTanggapan] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.aspirations
      .get(id)
      .then((record) => {
        const item = toAdminAspirasi(record);
        setAspirasi(item);
        setStatus(TO_OPTION[item.statusKey] ?? "Baru");
        setCatatan(item.catatan);
        setTanggapan(item.tanggapan);
      })
      .catch((err) => setLoadError(err.status === 404 ? "Aspirasi tidak ditemukan." : err.message));
  }, [id]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await adminApi.aspirations.respond(id, { status: TO_KEY[status], admin_note: catatan || null, public_response: tanggapan || null });
      refreshSummary();
      setSaved(true);
      setTimeout(() => router.push("/admin/aspirasi"), 1200);
    } catch (err) {
      setSaving(false);
      setError(err.message || "Gagal menyimpan perubahan.");
    }
  };

  if (loadError) return <LoadErrorNotice message={loadError} backHref="/admin/aspirasi" />;

  if (!aspirasi) {
    return (
      <p className="flex items-center justify-center gap-2 py-24 text-[15px] text-[#64748b]" role="status">
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        Memuat aspirasi...
      </p>
    );
  }

  return (
    <>
      <button type="button" onClick={() => router.push("/admin/aspirasi")} className="adm-btn adm-btn--text mb-4 px-0">
        <ArrowLeft aria-hidden="true" />
        <span>Kembali</span>
      </button>

      <article className="app-card stepform">
        <header className="space-y-5 p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-md px-3 py-1 text-[14px] font-medium ${KATEGORI_ASPIRASI_TONES[aspirasi.kategori]}`}>{aspirasi.kategori}</span>
              <span className="flex items-center gap-2 text-[15px] text-[#475569]">
                Status: <StatusBadge status={aspirasi.status} />
              </span>
            </div>
            <time className="text-[15px] text-[#64748b]">{aspirasi.waktu}</time>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] lg:text-[28px]">{aspirasi.judul}</h1>
          <div className="flex items-center gap-4 rounded-[14px] bg-[#f8fafc] p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f0] text-[#475569]">
              <UserRound size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[16px] font-semibold text-[#0f172a]">{aspirasi.anonim ? "Pengirim anonim" : aspirasi.pengirim}</span>
              <span className="block text-[14px] text-[#64748b]">
                {aspirasi.anonim ? "Identitas dirahasiakan sesuai permintaan pengirim" : "Identitas pengirim ditampilkan"}
              </span>
            </span>
          </div>
        </header>

        <div className="stepform__body border-t border-[#e2e8f0] lg:p-8">
          <section>
            <h2 className="field__label field__label--caps">Detail laporan</h2>
            <p className="text-[16px] leading-relaxed whitespace-pre-line text-[#1e293b]">{aspirasi.detail}</p>
          </section>

          {aspirasi.foto.length > 0 ? (
            <section>
              <h2 className="field__label field__label--caps">Lampiran foto</h2>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {aspirasi.foto.map((src, index) => (
                  <li key={src}>
                    <a href={src} target="_blank" rel="noreferrer">
                      <img src={src} alt={`Lampiran ${index + 1}`} className="aspect-[4/3] w-full rounded-[12px] object-cover" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-5 border-t border-[#e2e8f0] pt-6">
            <h2 className="stepform__section-title">Update status &amp; tindak lanjut</h2>
            <ChoiceChips label="Status" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <InputText
              label="Tanggapan publik (opsional)"
              hint='Tampil di halaman Kotak Aspirasi, mis. "Perbaikan selesai 25 Agustus 2026". Kosongkan untuk teks otomatis.'
              value={tanggapan}
              onChange={(event) => setTanggapan(event.target.value)}
              maxLength={255}
            />
            <InputLongText
              label="Catatan tindak lanjut (opsional, tidak publik)"
              rows={4}
              placeholder="Contoh: Sudah diteruskan ke bagian sarana prasarana, estimasi perbaikan 2 hari kerja..."
              value={catatan}
              onChange={(event) => setCatatan(event.target.value)}
            />
            {error ? (
              <p role="alert" className="rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
                {error}
              </p>
            ) : null}
          </section>
        </div>

        <footer className="stepform__footer justify-end">
          <AdminButton variant="ghost" onClick={() => router.push("/admin/aspirasi")}>
            Batal
          </AdminButton>
          <AdminButton onClick={save} loading={saving}>
            Simpan Perubahan
          </AdminButton>
        </footer>
      </article>

      {saved ? (
        <div className="toast" role="status">
          <CheckCircle2 size={20} className="text-[#4ade80]" aria-hidden="true" />
          Status aspirasi diperbarui menjadi &ldquo;{status}&rdquo;.
        </div>
      ) : null}
    </>
  );
}
