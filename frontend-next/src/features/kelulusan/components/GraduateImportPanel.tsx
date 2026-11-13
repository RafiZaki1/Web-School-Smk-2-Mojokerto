"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import { ApiError } from "@/shared/lib/http/api-error";
import { toast } from "@/shared/lib/toast";
import { handleApiError } from "@/shared/utils/error-handler";
import { IMPORT_TEMPLATE_HREF } from "../constants/kelulusan-keys";
import { useImportGraduates } from "../hooks/useGraduationAdmin";

const ACCEPT = ".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv";
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Satu pintu input data kelas XII: unggah satu file Excel/CSV. Baris dengan NISN yang sudah ada
 * diperbarui, baris baru ditambahkan, baris rusak dilewati dan dilaporkan nomornya.
 */
export function GraduateImportPanel() {
  const importer = useImportGraduates();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const summary = importer.data;
  const serverError = importer.error instanceof ApiError && importer.error.status === 422 ? (importer.error.fieldErrors?.file?.[0] ?? importer.error.message) : null;

  const pick = (next: File | null) => {
    importer.reset();
    setLocalError(next && next.size > MAX_BYTES ? "Ukuran file maksimal 5 MB." : null);
    setFile(next);
  };

  const upload = () => {
    if (!file || localError) return;
    importer.mutate(file, {
      onSuccess: (result) => {
        toast.success(`${result.created} siswa ditambahkan, ${result.updated} diperbarui.`);
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      },
      onError: (error) => {
        if (!(error instanceof ApiError && error.status === 422)) handleApiError(error);
      },
    });
  };

  return (
    <section className="app-card p-5 sm:p-6" aria-labelledby="judul-impor">
      <h2 id="judul-impor" className="text-[18px] font-semibold text-[#0f172a]">
        Impor data kelas XII
      </h2>
      <p className="mt-1 text-[14px] leading-relaxed text-[#475569]">
        Kolom: nisn, nama_lengkap, tanggal_lahir, kelas, jurusan, tahun_lulus, status (Lulus/Ditunda), status_administrasi (Beres/Belum), catatan.{" "}
        <a href={IMPORT_TEMPLATE_HREF} download className="svc-link">
          Unduh format CSV
        </a>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="adm-btn adm-btn--ghost cursor-pointer">
          <Upload aria-hidden="true" />
          <span>{file ? "Ganti file" : "Pilih file"}</span>
          <input ref={inputRef} type="file" accept={ACCEPT} className="sr-only" onChange={(event) => pick(event.target.files?.[0] ?? null)} />
        </label>
        <span className="min-w-0 truncate text-[14px] text-[#334155]">{file ? `${file.name} (${Math.ceil(file.size / 1024)} KB)` : "Belum ada file dipilih"}</span>
        <AdminButton onClick={upload} disabled={!file || Boolean(localError)} loading={importer.isPending} className="ml-auto">
          Unggah dan proses
        </AdminButton>
      </div>

      {localError || serverError ? (
        <p role="alert" className="svc-error mt-3">
          {localError ?? serverError}
        </p>
      ) : null}

      {summary ? (
        <div className="mt-4 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[14px] text-[#334155]" role="status">
          <p>
            {summary.total} baris dibaca: <strong>{summary.created}</strong> baru, <strong>{summary.updated}</strong> diperbarui, <strong>{summary.skipped}</strong> dilewati.
          </p>
          {summary.errors.length > 0 ? (
            <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5 text-[13px] text-[#b91c1c]">
              {summary.errors.map((item) => (
                <li key={`${item.row}-${item.message}`}>
                  Baris {item.row}: {item.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
