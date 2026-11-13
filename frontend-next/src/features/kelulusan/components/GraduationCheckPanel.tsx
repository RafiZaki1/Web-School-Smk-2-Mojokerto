"use client";

import { useCallback } from "react";
import { Home } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { SkeletonBlock } from "@/shared/components/feedback/StatusState";
import { contactLinks } from "@/shared/utils/contact-links";
import { useCheckGraduation, useGraduationStatus } from "../hooks/useGraduationPublic";
import { formatReleaseAt } from "../utils/countdown";
import { GraduationCheckForm } from "./GraduationCheckForm";
import { GraduationCountdown } from "./GraduationCountdown";
import { GraduationPortalCard } from "./GraduationPortalCard";
import { GraduationResultDetails } from "./GraduationResultDetails";

const DEFAULT_CLOSED = "Cek kelulusan baru bisa dilakukan saat jadwal pengumuman dibuka. Pantau pengumuman resmi sekolah untuk tanggalnya.";
const WHATSAPP_TU = contactLinks().find((link) => link.key === "whatsapp")?.href ?? "/";

function ClosedActions() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button href="/">
        <span className="inline-flex items-center gap-2">
          <Home size={18} aria-hidden="true" />
          Kembali ke Beranda
        </span>
      </Button>
      <Button href={WHATSAPP_TU} variant="outline" withArrow>
        Hubungi TU
      </Button>
    </div>
  );
}

/**
 * Kartu Cek Kelulusan. Isi mengikuti mode rilis dari TU:
 * draft -> belum dibuka, timer -> hitung mundur, open -> form nama + NISN, lalu hasil.
 */
export function GraduationCheckPanel() {
  const status = useGraduationStatus();
  const check = useCheckGraduation();
  const { refetch } = status;
  const reload = useCallback(() => void refetch(), [refetch]);

  if (status.isPending) return <SkeletonBlock className="mx-auto h-[420px] max-w-[840px] rounded-3xl" />;

  if (status.isError) {
    return (
      <GraduationPortalCard eyebrow="Gagal memuat" title="Status pengumuman belum bisa dimuat" description="Periksa koneksi internet, lalu coba lagi." tone="danger">
        <button type="button" className="btn btn--primary" onClick={reload}>
          <span>Coba lagi</span>
        </button>
      </GraduationPortalCard>
    );
  }

  const data = status.data;

  if (check.data) {
    const passed = check.data.status === "passed";
    return (
      <GraduationPortalCard
        eyebrow={`Hasil kelulusan ${check.data.graduation_year}`}
        title={passed ? "Selamat, kamu dinyatakan LULUS" : "Kelulusan DITUNDA"}
        description={passed ? undefined : "Ikuti arahan pada catatan di bawah, lalu temui pihak sekolah."}
        tone={passed ? "success" : "danger"}
      >
        <GraduationResultDetails result={check.data} onReset={check.reset} />
      </GraduationPortalCard>
    );
  }

  if (data.mode === "timer" && !data.is_open) {
    return (
      <GraduationPortalCard
        eyebrow="Segera dibuka"
        title={`Pengumuman Kelulusan ${data.active_year}`}
        description={
          <>
            Form cek kelulusan terbuka otomatis pada <span className="font-semibold text-heading">{formatReleaseAt(data.release_at)}</span>.
          </>
        }
      >
        <GraduationCountdown secondsUntilRelease={data.seconds_until_release} fetchedAt={status.dataUpdatedAt} onElapsed={reload} />
        <div className="mt-7">
          <ClosedActions />
        </div>
      </GraduationPortalCard>
    );
  }

  if (!data.is_open) {
    return (
      <GraduationPortalCard eyebrow="Belum dibuka" title="Portal Pengumuman Kelulusan Belum Dibuka" description={data.closed_message || DEFAULT_CLOSED}>
        <ClosedActions />
      </GraduationPortalCard>
    );
  }

  return (
    <GraduationPortalCard
      eyebrow="Sudah dibuka"
      title={`Pengumuman Kelulusan ${data.active_year}`}
      description="Masukkan nama lengkap sesuai rapor dan NISN untuk melihat hasil kelulusan. Hasil hanya tampil di perangkat ini."
    >
      <GraduationCheckForm check={check} onClosed={reload} />
    </GraduationPortalCard>
  );
}
