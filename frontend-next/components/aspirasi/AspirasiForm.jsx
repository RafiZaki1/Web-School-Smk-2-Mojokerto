"use client";

import { useId, useState } from "react";
import { CheckCircle2, ImageIcon, Loader2, SendHorizontal, X } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import TabButtons from "@/components/ui/TabButtons";
import Toggle from "@/components/ui/Toggle";

const field =
  "w-full rounded-xl border border-[#c3c6d7] bg-page px-5 text-base text-ink outline-none placeholder:text-[#8a8fa3] focus:border-blue-deep focus:ring-2 focus:ring-blue-deep/15 sm:text-lg lg:text-[22px]";
const label = "block text-base font-medium text-heading sm:text-lg lg:text-[22px]";

export default function AspirasiForm({ kategori }) {
  const baseId = useId();
  const [form, setForm] = useState({ kategori: kategori[0], judul: "", detail: "", anonim: true, pengirim: "" });
  const [foto, setFoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.judul.trim()) nextErrors.judul = "Judul singkat wajib diisi.";
    if (form.detail.trim().length < 10) nextErrors.detail = "Ceritakan detailnya minimal 10 karakter.";
    if (!form.anonim && !form.pengirim.trim()) nextErrors.pengirim = "Isi nama & kelas bila tidak mengirim secara anonim.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const body = new FormData();
    body.append("category", form.kategori);
    body.append("title", form.judul.trim());
    body.append("detail", form.detail.trim());
    body.append("is_anonymous", form.anonim ? "1" : "0");
    if (!form.anonim) body.append("sender_name", form.pengirim.trim());
    if (foto?.file) body.append("photos[0]", foto.file);

    setSending(true);
    try {
      await apiClient("/api/v1/public/aspirations", { method: "POST", body });
      setSent(true);
      setForm({ kategori: kategori[0], judul: "", detail: "", anonim: true, pengirim: "" });
      setFoto(null);
    } catch (error) {
      // Tampilkan galat validasi server di field terkait
      const serverErrors = error.errors ?? {};
      setErrors({
        judul: serverErrors.title?.[0],
        detail: serverErrors.detail?.[0],
        pengirim: serverErrors.sender_name?.[0],
        foto: serverErrors["photos.0"]?.[0],
        form: Object.keys(serverErrors).length ? undefined : error.message || "Aspirasi gagal dikirim, coba lagi.",
      });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[#c3c6d7] bg-page px-6 py-12 text-center">
        <CheckCircle2 size={48} className="text-[#16a34a]" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-bold text-heading sm:text-2xl">Aspirasi terkirim</h3>
        <p className="mt-2 max-w-md text-base text-[#4b5563]">Terima kasih! Tim sekolah akan meninjau laporanmu dan menindaklanjutinya secepatnya.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 cursor-pointer font-semibold text-blue-deep hover:underline">
          Kirim aspirasi lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-7">
      <div>
        <span className={label}>Kategori masalah</span>
        <TabButtons
          variant="outline"
          activeColor="var(--color-blue-deep)"
          className="mt-4"
          ariaLabel="Kategori masalah"
          tabs={kategori.map((item) => ({ id: item, label: item }))}
          activeId={form.kategori}
          onChange={(value) => update("kategori", value)}
        />
      </div>

      <div>
        <label htmlFor={`${baseId}-judul`} className={label}>
          Judul singkat
        </label>
        <input
          id={`${baseId}-judul`}
          value={form.judul}
          onChange={(event) => update("judul", event.target.value)}
          placeholder="Contoh: AC kelas XI RPL 2 rusak"
          aria-invalid={Boolean(errors.judul)}
          className={`mt-4 h-14 lg:h-[86px] ${field}`}
        />
        {errors.judul && <p className="mt-2 text-sm text-[#dc2626]">{errors.judul}</p>}
      </div>

      <div>
        <label htmlFor={`${baseId}-detail`} className={label}>
          Ceritakan detailnya
        </label>
        <textarea
          id={`${baseId}-detail`}
          rows={4}
          value={form.detail}
          onChange={(event) => update("detail", event.target.value)}
          placeholder="Jelaskan masalah yang kamu alami selengkap mungkin, biar sekolah bisa segera menindaklanjuti..."
          aria-invalid={Boolean(errors.detail)}
          className={`mt-4 py-4 lg:min-h-[216px] lg:py-6 ${field}`}
        />
        {errors.detail && <p className="mt-2 text-sm text-[#dc2626]">{errors.detail}</p>}
      </div>

      <div>
        <span className={label}>Lampiran foto (opsional)</span>
        {foto ? (
          <div className="relative mt-4 w-fit">
            <img src={foto.url} alt="Pratinjau lampiran" className="h-48 rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => setFoto(null)}
              aria-label="Hapus lampiran"
              className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label className="mt-4 flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#c3c6d7] bg-page text-center text-[#6b7280] hover:border-blue-deep lg:h-[180px]">
            <ImageIcon size={20} aria-hidden="true" />
            <span className="text-base sm:text-lg lg:text-[22px]">Klik untuk unggah foto pendukung</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setFoto({ file, url: URL.createObjectURL(file) });
              }}
            />
          </label>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-[#c3c6d7] bg-page px-5 py-4 lg:px-7 lg:py-5">
        <div>
          <p id={`${baseId}-anonim`} className="text-base font-medium text-heading sm:text-lg lg:text-[22px]">
            Kirim secara anonim
          </p>
          <p className="text-sm text-[#4b5563] sm:text-base lg:text-lg">Identitasmu tidak akan ditampilkan</p>
        </div>
        <Toggle size="lg" checked={form.anonim} onChange={(value) => update("anonim", value)} aria-labelledby={`${baseId}-anonim`} />
      </div>

      {!form.anonim ? (
        <div>
          <label htmlFor={`${baseId}-pengirim`} className={label}>
            Nama &amp; kelas
          </label>
          <input
            id={`${baseId}-pengirim`}
            value={form.pengirim}
            onChange={(event) => update("pengirim", event.target.value)}
            placeholder="Contoh: Budi Santoso, XI RPL 1"
            aria-invalid={Boolean(errors.pengirim)}
            className={`mt-4 h-14 lg:h-[72px] ${field}`}
          />
          {errors.pengirim && <p className="mt-2 text-sm text-[#dc2626]">{errors.pengirim}</p>}
        </div>
      ) : null}

      {errors.foto || errors.form ? (
        <p role="alert" className="rounded-xl bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {errors.foto || errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-blue-deep text-lg font-semibold text-white transition-colors hover:bg-[#003a9e] disabled:cursor-wait disabled:opacity-70 lg:h-[70px] lg:text-[22px]"
      >
        {sending ? "Mengirim..." : "Kirim Aspirasi"}
        {sending ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <SendHorizontal size={20} aria-hidden="true" />}
      </button>
    </form>
  );
}
