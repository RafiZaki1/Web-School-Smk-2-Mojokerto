import type { GraduationResult } from "../types/kelulusan.type";

interface GraduationResultDetailsProps {
  result: GraduationResult;
  onReset: () => void;
}

/** Rincian hasil di dalam kartu: identitas, status administrasi, dan catatan dari TU bila ada. */
export function GraduationResultDetails({ result, onReset }: GraduationResultDetailsProps) {
  const passed = result.status === "passed";
  const cleared = result.administration_status === "cleared";

  return (
    <div className="mx-auto max-w-[560px] text-left">
      <dl className="svc-rows rounded-2xl border border-line px-5 py-2">
        <dt>Nama</dt>
        <dd className="font-semibold">{result.full_name}</dd>
        <dt>NISN</dt>
        <dd className="svc-code">{result.nisn}</dd>
        <dt>Kelas</dt>
        <dd>
          {result.class_name}
          {result.major_label ? <span className="text-muted"> · {result.major_label}</span> : null}
        </dd>
        <dt>Status</dt>
        <dd>
          <span className={`svc-tag ${passed ? "svc-tag--ok" : "svc-tag--bad"}`}>{result.status_label ?? (passed ? "Lulus" : "Ditunda")}</span>
        </dd>
        {passed ? (
          <>
            <dt>Administrasi</dt>
            <dd>
              <span className={`svc-tag ${cleared ? "svc-tag--ok" : "svc-tag--warn"}`}>{result.administration_label ?? (cleared ? "Beres" : "Belum beres")}</span>
            </dd>
          </>
        ) : null}
      </dl>

      {result.note ? (
        <div className="mt-4 rounded-2xl border border-line bg-[var(--color-surface-alt)] px-5 py-4">
          <p className="text-[14px] font-semibold text-heading">Catatan dari TU</p>
          <p className="mt-1 text-[15px] leading-relaxed text-body">{result.note}</p>
        </div>
      ) : null}

      {passed && cleared ? <p className="mt-4 text-center text-[15px] text-body">SKL dapat diambil di ruang TU pada jam kerja dengan membawa kartu pelajar.</p> : null}

      <div className="mt-6 flex justify-center">
        <button type="button" className="btn btn--outline" onClick={onReset}>
          <span>Cek siswa lain</span>
        </button>
      </div>
    </div>
  );
}
