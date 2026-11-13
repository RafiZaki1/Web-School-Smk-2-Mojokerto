"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function MitraSearch({ items }: { items: string[] }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const visible = items.filter((name) => name.toLowerCase().includes(term.trim().toLowerCase()));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTerm(query);
  };

  return (
    <>
      <form role="search" className="mt-6 flex gap-2" onSubmit={onSubmit}>
        <label className="flex-1">
          <span className="sr-only">{t("Cari perusahaan atau sektor")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setTerm(event.target.value);
            }}
            placeholder={t("Cari perusahaan atau sektor...")}
            className="h-[54px] w-full rounded-xl border border-[var(--color-line)] bg-card px-5 text-base text-ink placeholder:text-[var(--color-muted)] focus:border-blue focus:ring-2 focus:ring-blue/15"
          />
        </label>
        <button
          type="submit"
          aria-label={t("Cari")}
          className="flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue text-white transition-colors hover:bg-blue-dark"
        >
          <Search size={22} aria-hidden="true" />
        </button>
      </form>

      <ul className="mt-6 flex flex-wrap gap-3">
        {visible.map((name) => (
          <li key={name} className="rounded-xl border border-[var(--color-line)] bg-card px-5 py-2.5 text-[15px] text-[var(--color-body)]">
            {name}
          </li>
        ))}
        {visible.length === 0 && <li className="text-[15px] text-[var(--color-muted)]">{t("Perusahaan tidak ditemukan.")}</li>}
      </ul>
    </>
  );
}
