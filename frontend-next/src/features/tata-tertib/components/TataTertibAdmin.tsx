"use client";

import PageTitle from "@/shared/components/admin/PageTitle";
import { SchoolRulesPanel } from "./SchoolRulesPanel";
import { UniformPanel } from "./UniformPanel";

/** Halaman /admin/tu/tata-tertib: poin tata tertib, jadwal seragam harian, dan seragam praktik. */
export function TataTertibAdmin() {
  return (
    <div className="grid gap-6">
      <PageTitle title="Tata Tertib & Seragam" subtitle="Isi halaman publik /tata-tertib." />
      <SchoolRulesPanel />
      <UniformPanel kind="schedule" />
      <UniformPanel kind="practice" />
    </div>
  );
}
