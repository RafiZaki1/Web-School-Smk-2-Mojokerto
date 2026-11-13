"use client";

import AdminButton from "@/shared/components/admin/AdminButton";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { useGraduateYearAction, useGraduateYears } from "../hooks/useGraduationAdmin";

/**
 * Data angkatan lama: arsipkan (tetap tersimpan, tidak bisa dicek lagi) atau hapus permanen.
 * Angkatan aktif tetap bisa diarsipkan setelah masa pengumuman selesai.
 */
export function GraduateYearPanel({ activeYear }: { activeYear: number | undefined }) {
  const years = useGraduateYears();
  const action = useGraduateYearAction();

  const run = (kind: "archive" | "delete", year: number, count: number) => {
    const question =
      kind === "archive"
        ? `Arsipkan ${count} siswa angkatan ${year}? Data tetap tersimpan, tetapi tidak bisa dicek lagi di halaman Cek Kelulusan.`
        : `Hapus permanen seluruh data angkatan ${year}? Tindakan ini tidak bisa dibatalkan.`;
    if (window.confirm(question)) action.mutate({ action: kind, year });
  };

  return (
    <section className="app-card p-5 sm:p-6" aria-labelledby="judul-angkatan">
      <h2 id="judul-angkatan" className="text-[18px] font-semibold text-[#0f172a]">
        Arsip angkatan
      </h2>
      <p className="mt-1 text-[14px] text-[#475569]">Setelah masa pengumuman selesai, arsipkan atau hapus data angkatan tersebut.</p>

      <div className="mt-4">
        {years.isPending ? <LoadingState label="Memuat daftar angkatan..." /> : null}
        {years.isError ? <ErrorState title="Daftar angkatan gagal dimuat" /> : null}
        {years.data && years.data.length === 0 ? <EmptyState title="Belum ada data kelulusan" /> : null}
        {years.data && years.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="svc-table min-w-[560px]">
              <thead>
                <tr>
                  <th scope="col">Tahun lulus</th>
                  <th scope="col">Data aktif</th>
                  <th scope="col">Diarsipkan</th>
                  <th scope="col" className="text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {years.data.map((row) => (
                  <tr key={row.year}>
                    <td className="font-semibold text-[#0f172a]">
                      {row.year}
                      {row.year === activeYear ? <span className="svc-tag svc-tag--info ml-2">Aktif</span> : null}
                    </td>
                    <td className="tabular-nums">{row.active}</td>
                    <td className="tabular-nums">{row.archived}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <AdminButton variant="ghost" disabled={row.active === 0 || action.isPending} onClick={() => run("archive", row.year, row.active)}>
                          Arsipkan
                        </AdminButton>
                        <AdminButton variant="danger" disabled={action.isPending} onClick={() => run("delete", row.year, row.active + row.archived)}>
                          Hapus
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
