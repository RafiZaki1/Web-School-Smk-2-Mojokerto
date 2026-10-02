"use client";

import { useState } from "react";

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
}) {
  const [internalId, setInternalId] = useState(defaultActiveId ?? tabs[0]?.id ?? "");
  const selectedId = activeId ?? internalId;

  const selectTab = (id) => {
    if (activeId === undefined) setInternalId(id);
    onChange?.(id);
  };

  return (
    <div
      className={`tab-buttons tab-buttons--${variant}${className ? ` ${className}` : ""}`}
      style={activeColor ? { "--tab-active": activeColor } : undefined}
      role="tablist"
      aria-label={ariaLabel}
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
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
