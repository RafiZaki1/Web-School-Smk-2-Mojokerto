"use client";

import { useEffect, useState } from "react";
import { useAdminSession } from "../AdminSession";

/**
 * State form admin untuk satu record.
 * - id kosong: form tambah dengan nilai awal `empty`.
 * - id terisi: data dimuat dari API lalu diubah ke bentuk form lewat `fromApi`.
 * save(payload) membuat atau memperbarui record lewat `resource` (adminApi.xxx).
 */
export default function useAdminForm(resource, id, { empty, fromApi }) {
  const { refreshSummary } = useAdminSession();
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    resource
      .get(id)
      .then((record) => active && setData({ ...empty, ...fromApi(record) }))
      .catch((error) => active && setLoadError(error.status === 404 ? "Data tidak ditemukan." : error.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // Dimuat sekali per id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /** set("judul")(event | nilai) */
  const set = (key) => (eventOrValue) =>
    setData((prev) => ({ ...prev, [key]: eventOrValue?.target ? eventOrValue.target.value : eventOrValue }));

  const save = async (payload) => {
    const record = id ? await resource.update(id, payload) : await resource.create(payload);
    refreshSummary();
    return record;
  };

  return { data, setData, set, loading, loadError, save, isEdit: Boolean(id) };
}
