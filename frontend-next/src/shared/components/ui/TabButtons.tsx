"use client";

import { useState, type CSSProperties } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

export interface TabItem {
  id: string;
  label: string;
}

export type TabVariant = "filled" | "outline" | "outline-dark";

interface TabButtonsProps {
  tabs?: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
  variant?: TabVariant;
  activeColor?: string;
  className?: string;
}

/**
 * Tab pil dari DealTech UI (TabButtonsV1).
 * Bisa controlled (activeId + onChange) atau uncontrolled (defaultActiveId).
 * variant: "filled" (abu-abu, landing), "outline" (putih bergaris), "outline-dark" (aktif navy).
 * activeColor mengganti warna tab aktif untuk varian outline.
 */
export default function TabButtons({
  tabs = [],
  activeId,
  defaultActiveId,
  onChange,
  ariaLabel = "Pilihan tab",
  variant = "filled",
  activeColor,
  className = "",
}: TabButtonsProps) {
  const { t } = useTranslation();
  const [internalId, setInternalId] = useState(defaultActiveId ?? tabs[0]?.id ?? "");
  const selectedId = activeId ?? internalId;

  const selectTab = (id: string) => {
    if (activeId === undefined) setInternalId(id);
    onChange?.(id);
  };

  const style = activeColor ? ({ "--tab-active": activeColor } as CSSProperties) : undefined;

  return (
    <div
      className={`tab-buttons tab-buttons--${variant}${className ? ` ${className}` : ""}`}
      style={style}
      role="tablist"
      aria-label={t(ariaLabel)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === selectedId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? "tab-buttons__button tab-buttons__button--active" : "tab-buttons__button"}
            onClick={() => selectTab(tab.id)}
          >
            {t(tab.label)}
          </button>
        );
      })}
    </div>
  );
}
