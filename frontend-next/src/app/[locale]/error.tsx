"use client";

import { ErrorState } from "@/shared/components/feedback/StatusState";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function Error({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-16">
      <ErrorState
        action={
          <button type="button" onClick={reset} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
            {t("Coba lagi")}
          </button>
        }
      />
    </div>
  );
}
