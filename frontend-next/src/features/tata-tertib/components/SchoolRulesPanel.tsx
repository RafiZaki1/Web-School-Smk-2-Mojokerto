"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { useDeleteSchoolRule, useSchoolRulesAdmin } from "../hooks/useTataTertibAdmin";
import { groupRules } from "../services/tata-tertib.service";
import type { SchoolRule } from "../types/tata-tertib.type";
import { RuleFormModal } from "./RuleFormModal";

type Editing = SchoolRule | null | undefined;

/** Kelola poin tata tertib, dikelompokkan per bagian seperti tampilan di website. */
export function SchoolRulesPanel() {
  const rules = useSchoolRulesAdmin();
  const remove = useDeleteSchoolRule();
  const [editing, setEditing] = useState<Editing>(undefined);
  const sections = groupRules(rules.data ?? []);

  const confirmRemove = (rule: SchoolRule) => {
    if (window.confirm("Hapus poin tata tertib ini?")) remove.mutate(rule);
  };

  return (
    <section className="app-card p-5 sm:p-6" aria-labelledby="judul-kelola-tata-tertib">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="judul-kelola-tata-tertib" className="text-[18px] font-semibold text-[#0f172a]">
          Tata tertib siswa
        </h2>
        <AdminButton icon={Plus} onClick={() => setEditing(null)}>
          Tambah poin
        </AdminButton>
      </div>

      <div className="mt-4">
        {rules.isPending ? <LoadingState label="Memuat tata tertib..." /> : null}
        {rules.isError ? <ErrorState /> : null}
        {rules.data && rules.data.length === 0 ? <EmptyState title="Belum ada poin tata tertib" /> : null}
        <div className="grid gap-5">
          {sections.map((group) => (
            <div key={group.section}>
              <h3 className="text-[15px] font-semibold text-[#0f172a]">{group.section}</h3>
              <ol className="mt-2 divide-y divide-[#e5e7eb] rounded-md border border-[#e5e7eb]">
                {group.rules.map((rule, index) => (
                  <li key={rule.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="w-6 shrink-0 pt-0.5 text-[14px] font-semibold text-[#64748b] tabular-nums">{index + 1}.</span>
                    <p className={`min-w-0 flex-1 text-[15px] leading-relaxed ${rule.is_active ? "text-[#0f172a]" : "text-[#94a3b8] line-through"}`}>{rule.content}</p>
                    {!rule.is_active ? <span className="svc-tag svc-tag--neutral shrink-0">Disembunyikan</span> : null}
                    <div className="flex shrink-0 gap-1">
                      <button type="button" className="adm-icon-btn" onClick={() => setEditing(rule)} aria-label={`Ubah poin ${index + 1} ${group.section}`}>
                        <Pencil size={18} aria-hidden="true" />
                      </button>
                      <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => confirmRemove(rule)} aria-label={`Hapus poin ${index + 1} ${group.section}`}>
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {editing !== undefined ? <RuleFormModal rule={editing} sections={sections.map((group) => group.section)} onClose={() => setEditing(undefined)} /> : null}
    </section>
  );
}
