"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import { MetricGrid, type MetricItem } from "@/shared/components/admin/MetricCard";
import PageTitle from "@/shared/components/admin/PageTitle";
import TableList, { type TableColumn } from "@/shared/components/admin/TableList";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { useAdminDelete, useAdminList } from "../hooks/useAdminResource";

interface AdminListPageProps<TRow extends { id: number | string | null }> {
  resource: string;
  title: string;
  subtitle?: string;
  addLabel?: string;
  addHref?: string;
  metrics?: (rows: TRow[]) => MetricItem[];
  load: () => Promise<TRow[]>;
  remove: (row: TRow) => Promise<void>;
  columns: (requestRemove: (row: TRow) => void) => TableColumn<TRow>[];
  searchKeys: (keyof TRow & string)[];
  searchPlaceholder: string;
}

/** Tombol ubah & hapus di kolom aksi tabel. */
export function RowActions({ label, editHref, onDelete }: { label: string; editHref: string; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <Link href={editHref} className="adm-icon-btn" aria-label={`Ubah ${label}`}>
        <Pencil size={18} aria-hidden="true" />
      </Link>
      <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={onDelete} aria-label={`Hapus ${label}`}>
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Kerangka halaman daftar admin: judul + tombol tambah, kartu metrik, tabel.
 * load() mengambil baris dari API; remove(row) menghapus lewat API.
 * columns(requestRemove) menerima fungsi hapus agar kolom aksi bisa memanggilnya.
 */
export default function AdminListPage<TRow extends { id: number | string | null }>({
  resource,
  title,
  subtitle,
  addLabel,
  addHref,
  metrics,
  load,
  remove,
  columns,
  searchKeys,
  searchPlaceholder,
}: AdminListPageProps<TRow>) {
  const list = useAdminList(resource, load);
  const deleteRow = useAdminDelete(resource, remove);
  const rows = useMemo(() => list.data ?? [], [list.data]);
  const metricItems = useMemo(() => (metrics && list.isSuccess ? metrics(rows) : null), [metrics, list.isSuccess, rows]);

  const requestRemove = (row: TRow) => {
    if (window.confirm("Hapus data ini? Tindakan ini tidak bisa dibatalkan.")) deleteRow.mutate(row);
  };

  return (
    <div className="space-y-8 lg:space-y-9">
      <PageTitle
        title={title}
        subtitle={subtitle}
        action={
          addHref ? (
            <AdminButton href={addHref} icon={Plus}>
              {addLabel}
            </AdminButton>
          ) : null
        }
      />
      {metricItems ? <MetricGrid items={metricItems} /> : null}
      {list.isPending ? <LoadingState label="Memuat data..." /> : null}
      {list.isError ? (
        <ErrorState
          title="Gagal memuat data"
          description={list.error instanceof Error ? list.error.message : undefined}
          action={
            <AdminButton variant="ghost" onClick={() => void list.refetch()}>
              Coba lagi
            </AdminButton>
          }
        />
      ) : null}
      {list.isSuccess && rows.length === 0 ? <EmptyState title="Belum ada data" description="Tambahkan data pertama dengan tombol di atas." /> : null}
      {list.isSuccess && rows.length > 0 ? (
        <TableList
          columns={columns(requestRemove)}
          rows={rows}
          searchKeys={searchKeys}
          searchPlaceholder={searchPlaceholder}
          rowKey="id"
        />
      ) : null}
    </div>
  );
}
