"use client";

import { AutoSaveSelect, AutoSaveText } from "@/shared/components/admin/AutoSaveField";
import AutoSaveIndicator from "@/shared/components/admin/AutoSaveIndicator";
import PageTitle from "@/shared/components/admin/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { PORTAL_SCOPE, useAutoSavePortalLink, usePortalLinksAdmin } from "../hooks/useTataUsaha";

const VISIBILITY = [
  { value: "1", label: "Tampil" },
  { value: "0", label: "Sembunyikan" },
];

/** Halaman /admin/tu/portal: tombol pintasan navbar ke E-Learning. */
export function PortalLinkAdmin() {
  const links = usePortalLinksAdmin();
  const autoSave = useAutoSavePortalLink();

  return (
    <div className="grid gap-6">
      <PageTitle title="Pintasan Portal" subtitle="Tombol di menu Kesiswaan pada navbar yang membuka domain E-Learning." />

      <section className="app-card p-5 sm:p-6">
        <AutoSaveIndicator scope={PORTAL_SCOPE} />
        <div className="mt-4">
          {links.isPending ? <LoadingState label="Memuat pintasan..." /> : null}
          {links.isError ? <ErrorState /> : null}
          {links.data && links.data.length === 0 ? <EmptyState title="Belum ada pintasan portal" /> : null}
          {links.data && links.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="svc-table min-w-[760px]">
                <thead>
                  <tr>
                    <th scope="col" className="w-[240px]">
                      Teks tombol
                    </th>
                    <th scope="col">Alamat (URL)</th>
                    <th scope="col" className="w-[160px]">
                      Di navbar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {links.data.map((link) => (
                    <tr key={link.id}>
                      <td>
                        <AutoSaveText label={`Teks tombol ${link.label}`} value={link.label} maxLength={100} onSave={(label) => autoSave.save(link.id, { label: label.trim() })} />
                      </td>
                      <td>
                        <AutoSaveText label={`Alamat ${link.label}`} value={link.url} maxLength={255} placeholder="https://" onSave={(url) => autoSave.save(link.id, { url: url.trim() })} />
                      </td>
                      <td>
                        <AutoSaveSelect label={`Tampilkan ${link.label}`} value={link.is_active ? "1" : "0"} options={VISIBILITY} onSave={(value) => autoSave.save(link.id, { is_active: value === "1" })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <p className="mt-4 text-[13px] text-[#64748b]">Alamat harus diawali https:// atau http://. Perubahan tampil di navbar pengunjung setelah halaman dimuat ulang.</p>
      </section>
    </div>
  );
}
