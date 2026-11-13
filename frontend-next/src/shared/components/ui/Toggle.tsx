"use client";

import type { ButtonHTMLAttributes } from "react";

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "md" | "lg";
  className?: string;
}

/** Saklar on/off dari dealtech-ui (ToggleOnOff). */
export default function Toggle({ checked, onChange, disabled = false, size, className = "", ...rest }: ToggleProps) {
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`toggleonoff${checked ? " is-on" : ""}${size === "lg" ? " toggleonoff--lg" : ""}${className ? ` ${className}` : ""}`}
    >
      <span className="toggleonoff__knob" />
    </button>
  );
}
