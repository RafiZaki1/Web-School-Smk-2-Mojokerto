interface Timestamped {
  updatedAt?: string | null;
}

/** "27 Agu" dari tanggal ISO terbaru pada daftar. */
export function lastUpdated(rows: Timestamped[]): string {
  const latest = rows
    .map((row) => row.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  return latest ? new Date(latest).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-";
}
