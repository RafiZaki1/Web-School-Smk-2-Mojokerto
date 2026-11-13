"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpRight, Search, Users, X } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import GuruCard from "@/features/portal-belajar/components/GuruCard";
import { ELEARNING_TEACHERS } from "@/features/portal-belajar/constants/guru-kejuruan-data";
import {
  ELEARNING,
  E_LEARNING_COURSES_URL,
  TEACHER_GROUPS,
  elearningCategoryUrl,
} from "@/features/portal-belajar/constants/portal-belajar-data";
import type { TeacherGroupKey } from "@/features/portal-belajar/types/portal-belajar.type";
import { useTranslation } from "@/shared/hooks/useTranslation";

/** Direktori interaktif Bapak & Ibu Guru SMKN 2 Kota Mojokerto di e-Learning (smkn2mojokerto.my.id). */
export default function GuruExplorer() {
  const { t } = useTranslation();
  const [activeGroup, setActiveGroup] = useState<TeacherGroupKey>("semua");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const groupCounts = useMemo(() => {
    const counts: Record<TeacherGroupKey, number> = {
      semua: ELEARNING_TEACHERS.length,
      rpl: 0,
      dkv: 0,
      kuliner: 0,
      lps: 0,
      aphp: 0,
      umum: 0,
      "bk-kik": 0,
    };
    for (const teacher of ELEARNING_TEACHERS) {
      counts[teacher.group] += 1;
    }
    return counts;
  }, []);

  const filteredGroups = useMemo(() => {
    const targetGroups =
      activeGroup === "semua"
        ? TEACHER_GROUPS.filter((g) => g.id !== "semua")
        : TEACHER_GROUPS.filter((g) => g.id === activeGroup);

    return targetGroups
      .map((group) => {
        const teachers = ELEARNING_TEACHERS.filter((teacher) => {
          if (teacher.group !== group.id) return false;
          if (!normalizedQuery) return true;
          const haystack = `${teacher.name} ${teacher.role} ${teacher.subjects.join(" ")}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });
        return { group, teachers };
      })
      .filter((entry) => entry.teachers.length > 0);
  }, [activeGroup, normalizedQuery]);

  const totalShown = useMemo(
    () => filteredGroups.reduce((sum, entry) => sum + entry.teachers.length, 0),
    [filteredGroups],
  );

  return (
    <div className="mt-8 lg:mt-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Cari nama Bapak/Ibu Guru atau mata pelajaran (mis. Matematika, RPL, Kuliner, BK)...")}
              aria-label={t("Cari nama Bapak/Ibu Guru atau mata pelajaran")}
              className="h-11 w-full rounded-full border border-line bg-surface pr-10 pl-11 text-sm text-heading placeholder:text-muted focus:border-primary focus:bg-card focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("Hapus pencarian")}
                className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-line hover:text-heading"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted sm:px-2">
            <Users size={16} className="text-primary" aria-hidden="true" />
            <span>
              {t("Menampilkan {shown} dari {total} Bapak & Ibu Guru", {
                shown: totalShown,
                total: ELEARNING_TEACHERS.length,
              })}
            </span>
          </div>
        </div>

        <div role="group" aria-label={t("Filter rumpun mata pelajaran")} className="flex flex-wrap gap-1.5 pt-1">
          {TEACHER_GROUPS.map((group) => {
            const isActive = activeGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveGroup(group.id)}
                className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface text-body hover:bg-tint hover:text-heading"
                }`}
              >
                <span>{t(group.shortLabel)}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-card text-muted"
                  }`}
                >
                  {groupCounts[group.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {totalShown === 0 ? (
        <div className="mt-8 rounded-3xl border border-line bg-card p-8 text-center sm:p-12">
          <p className="text-lg font-bold text-heading">
            {t('Tidak ditemukan guru atau mata pelajaran untuk "{q}".', { q: query })}
          </p>
          <p className="mx-auto mt-2 max-w-[480px] text-sm text-muted">
            {t("Coba kata kunci lain atau buka langsung daftar seluruh kategori pembelajaran di portal e-Learning.")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => { setQuery(""); setActiveGroup("semua"); }}>
              {t("Tampilkan Semua Guru")}
            </Button>
            <Button href={E_LEARNING_COURSES_URL} variant="accent" size="sm">
              {t("Buka Katalog {nama}", { nama: ELEARNING.shortName })}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {filteredGroups.map(({ group, teachers }) => (
            <section key={group.id} aria-labelledby={`grup-guru-${group.id}`}>
              <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${group.badgeClass}`}>
                    {teachers.length} {t("Pendidik Pengampu")}
                  </span>
                  <h3 id={`grup-guru-${group.id}`} className="mt-2 text-xl font-bold text-heading sm:text-2xl">
                    {t(group.label)}
                  </h3>
                </div>
                <a
                  href={elearningCategoryUrl(group.categoryId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  {t("Buka Kategori di E-Learning")}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>

              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                  <li key={teacher.id}>
                    <GuruCard teacher={teacher} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
