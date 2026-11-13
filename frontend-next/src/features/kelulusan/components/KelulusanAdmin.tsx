"use client";

import PageTitle from "@/shared/components/admin/PageTitle";
import { useGraduationSettings } from "../hooks/useGraduationAdmin";
import { GraduateImportPanel } from "./GraduateImportPanel";
import { GraduateWorkTable } from "./GraduateWorkTable";
import { GraduateYearPanel } from "./GraduateYearPanel";
import { ReleaseSettingsPanel } from "./ReleaseSettingsPanel";

/** Halaman /admin/tu/kelulusan: pengaturan rilis, impor file, tabel kerja, dan arsip angkatan. */
export function KelulusanAdmin() {
  const activeYear = useGraduationSettings().data?.setting.active_year;

  return (
    <div className="grid gap-6">
      <PageTitle title="Kelulusan" subtitle="Data kelas XII untuk halaman Cek Kelulusan." />
      <ReleaseSettingsPanel />
      <GraduateImportPanel />
      <GraduateWorkTable activeYear={activeYear} />
      <GraduateYearPanel activeYear={activeYear} />
    </div>
  );
}
