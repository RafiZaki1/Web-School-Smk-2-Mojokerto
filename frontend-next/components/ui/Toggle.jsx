"use client";

/** Saklar on/off dari dealtech-ui (ToggleOnOff). */
export default function Toggle({ checked, onChange, disabled = false, size, className = "", ...rest }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`toggleonoff${checked ? " is-on" : ""}${size === "lg" ? " toggleonoff--lg" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      <span className="toggleonoff__knob" />
    </button>
  );
}
