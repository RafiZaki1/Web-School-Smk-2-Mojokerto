"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

/** Modal dari dealtech-ui: tirai gelap, kartu tengah, tutup dengan Esc. */
export default function Modal({ open, onClose, title, children, footer, maxWidth = "max-w-[1024px]" }: ModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`modal app-card ${maxWidth}`}>
        <header className="stepform__header">
          <h2 className="stepform__title">{title}</h2>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div className="stepform__body pt-2">{children}</div>
        {footer ? <footer className="stepform__footer justify-end">{footer}</footer> : null}
      </div>
    </div>
  );
}
