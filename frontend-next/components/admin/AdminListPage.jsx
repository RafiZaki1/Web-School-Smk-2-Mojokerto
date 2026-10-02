"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import AdminButton from "./ui/AdminButton";
import PageTitle from "./ui/PageTitle";
import { MetricGrid } from "./ui/MetricCard";
import TableList from "./ui/TableList";
import { useAdminSession } from "./AdminSession";

/** Tombol ubah & hapus di kolom aksi tabel. */
export function RowActions({ label, onDelete, editHref }) {
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

/** "27 Agu" dari tanggal ISO terbaru pada daftar. */
export function lastUpdated(rows) {
  const latest = rows.map((row) => row.updatedAt).filter(Boolean).sort().at(-1);
  return latest ? new Date(latest).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-";
}

/**
 * Kerangka halaman daftar admin: judul + tombol tambah, kartu metrik, tabel.
 * load() mengambil baris dari API; remove(row) menghapus lewat API.
 * columns(remove) menerima fungsi hapus agar kolom aksi bisa memanggilnya.
 */
export default function AdminListPage({ title, subtitle, addLabel, addHref, metrics, load, remove: removeRow, columns, searchKeys, searchPlaceholder, rowKey = "id" }) {
  const { refreshSummary } = useAdminSession();
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });
  const [toast, setToast] = useState(null);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    load()
      .then((result) => {
        if (!active) return;
        setRows(result);
        setState({ loading: false, error: null });
      })
      .catch((error) => active && setState({ loading: false, error: error.message || "Gagal memuat data." }));
    return () => {
      active = false;
    };
  }, [load, attempt]);

  const reload = () => {
    setState({ loading: true, error: null });
    setAttempt((value) => value + 1);
  };

  const remove = async (key) => {
    const row = rows.find((item) => item[rowKey] === key);
    if (!row || !window.confirm("Hapus data ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      await removeRow(row);
      setRows((prev) => prev.filter((item) => item[rowKey] !== key));
      setToast("Data berhasil dihapus.");
      refreshSummary();
      setTimeout(() => setToast(null), 2500);
    } catch (error) {
      window.alert(error.message || "Gagal menghapus data.");
    }
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
      {metrics ? <MetricGrid items={metrics(rows)} /> : null}
      {state.error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] text-[#b91c1c]">
          {state.error}
          <AdminButton variant="ghost" onClick={reload}>
            Coba lagi
          </AdminButton>
        </div>
      ) : null}
      <TableList
        columns={columns(remove)}
        rows={rows}
        rowKey={rowKey}
        searchKeys={searchKeys}
        searchPlaceholder={searchPlaceholder}
        emptyText={state.loading ? "Memuat data..." : "Data tidak ditemukan."}
      />
      {toast ? (
        <div className="toast" role="status">
          <CheckCircle2 size={20} className="text-[#4ade80]" aria-hidden="true" />
          {toast}
        </div>
      ) : null}
    </div>
  );
}
