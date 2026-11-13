"use client";

import { ArrowUpRight, BookOpen, CalendarCheck2 } from "lucide-react";
import {
  TEACHER_GROUP_MAP,
  elearningCategoryUrl,
} from "@/features/portal-belajar/constants/portal-belajar-data";
import type { ElearningTeacher } from "@/features/portal-belajar/types/portal-belajar.type";
import { useTranslation } from "@/shared/hooks/useTranslation";

function getTeacherInitials(name: string): string {
  const cleaned = name.replace(/^(Drs\.|Dra\.|M\.)\s*/i, "").split(",")[0].trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "GR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

/** Kartu profil satu Bapak/Ibu Guru pengampu beserta tautan langsung ke ruang kelasnya di smkn2mojokerto.my.id. */
export default function GuruCard({ teacher }: { teacher: ElearningTeacher }) {
  const { t } = useTranslation();
  const groupMeta = TEACHER_GROUP_MAP[teacher.group];
  const initials = getTeacherInitials(teacher.name);

  return (
    <a
      href={elearningCategoryUrl(teacher.categoryId)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-5 transition duration-200 hover:border-brand/50 hover:shadow-[0_14px_32px_rgba(8,53,75,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-heading text-sm font-extrabold ${groupMeta.badgeClass}`}
              aria-hidden="true"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${groupMeta.badgeClass}`}>
                {t(groupMeta.shortLabel)}
              </span>
              <h3 className="mt-1.5 text-base leading-snug font-bold text-heading group-hover:text-primary">
                {teacher.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-muted">{t(teacher.role)}</p>
            </div>
          </div>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted transition-colors group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>

        <div className="mt-4 border-t border-line/70 pt-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <BookOpen size={13} className="shrink-0 text-primary" aria-hidden="true" />
            {t("Mata Pelajaran yang Diampu:")}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={t("Mata pelajaran")}>
            {teacher.subjects.map((subject) => (
              <li
                key={subject}
                className="rounded-lg bg-surface px-2.5 py-1 text-xs font-medium text-body"
              >
                {t(subject)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line/60 pt-3 text-xs">
        <span className="flex items-center gap-1.5 text-muted">
          <CalendarCheck2 size={13} className="shrink-0 text-emerald-600" aria-hidden="true" />
          {t(teacher.semesterInfo ?? "Semester Ganjil & Genap")}
        </span>
        <span className="font-semibold text-primary group-hover:underline">
          {t("Buka Kelas Guru")}
        </span>
      </div>
    </a>
  );
}
