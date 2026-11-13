"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, type LucideIcon } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface SelectProps {
  value?: string | null;
  onChange?: (value: string) => void;
  options?: readonly (string | SelectOption)[];
  placeholder?: string;
  label?: string;
  icon?: LucideIcon;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

interface Position {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
}

const MAX_HEIGHT = 300;
const GAP = 6;

const normalize = (option: string | SelectOption): SelectOption => (typeof option === "string" ? { value: option, label: option } : option);

/**
 * Pengganti <select> native: tombol + listbox (pola ARIA "select-only combobox").
 * - Keyboard: ↑/↓, Home/End, Enter/Spasi memilih, Esc menutup, ketik huruf untuk melompat.
 * - searchable: kotak cari di dalam popover untuk daftar panjang.
 * - option: { value, label, description?, group?, icon?, disabled? } atau string.
 * Popover dirender di portal (position: fixed) agar tidak terpotong kontainer overflow.
 */
export default function Select({
  value,
  onChange,
  options = [],
  placeholder: rawPlaceholder = "Pilih...",
  label: rawLabel,
  icon: LeadingIcon,
  searchable = false,
  searchPlaceholder: rawSearchPlaceholder = "Cari...",
  emptyText: rawEmptyText = "Tidak ada pilihan.",
  disabled = false,
  invalid = false,
  className = "",
  triggerClassName = "",
  id,
  "aria-label": rawAriaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SelectProps) {
  const { t } = useTranslation();
  const placeholder = t(rawPlaceholder);
  const searchPlaceholder = t(rawSearchPlaceholder);
  const emptyText = t(rawEmptyText);
  const label = rawLabel && t(rawLabel);
  const ariaLabel = rawAriaLabel && t(rawAriaLabel);
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listId = `${autoId}-list`;
  // Value tetap; hanya teks yang tampil yang diterjemahkan.
  const items = useMemo(
    () =>
      options.map(normalize).map((option) => ({
        ...option,
        label: t(option.label),
        description: option.description && t(option.description),
        group: option.group && t(option.group),
      })),
    [options, t],
  );
  const selected = items.find((option) => option.value === (value ?? ""));

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typeahead = useRef<{ text: string; timer: ReturnType<typeof setTimeout> | null }>({ text: "", timer: null });

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((option) => `${option.label} ${option.description ?? ""} ${option.group ?? ""}`.toLowerCase().includes(term));
  }, [items, query]);

  const enabledIndex = useCallback(
    (from: number, step: number) => {
      for (let i = 1; i <= visible.length; i++) {
        const index = (from + step * i + visible.length * 2) % visible.length;
        if (!visible[index]?.disabled) return index;
      }
      return -1;
    },
    [visible],
  );

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const below = window.innerHeight - rect.bottom - GAP;
    const above = rect.top - GAP;
    const flip = below < Math.min(MAX_HEIGHT, 220) && above > below;
    const width = Math.min(Math.max(rect.width, 220), window.innerWidth - 16);
    setPosition({
      left: Math.min(Math.max(8, rect.left), window.innerWidth - width - 8),
      width,
      maxHeight: Math.max(160, Math.min(MAX_HEIGHT, flip ? above : below) - 8),
      ...(flip ? { bottom: window.innerHeight - rect.top + GAP } : { top: rect.bottom + GAP }),
    });
  }, []);

  const mounted = open && position !== null;

  const openMenu = () => {
    if (disabled) return;
    const index = items.findIndex((option) => option.value === (value ?? ""));
    setQuery("");
    setActive(index >= 0 ? index : items.findIndex((option) => !option.disabled));
    setOpen(true);
  };

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    setPosition(null);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const choose = (option: SelectOption | undefined) => {
    if (!option || option.disabled) return;
    onChange?.(option.value);
    close();
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  // Fokus dipindah setelah popover benar-benar dirender (posisinya dihitung dulu)
  useEffect(() => {
    if (!mounted) return;
    if (searchable) searchRef.current?.focus();
    else listRef.current?.focus({ preventScroll: true });
  }, [mounted, searchable]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popoverRef.current?.contains(target)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  // Pastikan opsi aktif terlihat saat bernavigasi dengan keyboard
  useEffect(() => {
    if (!mounted || active < 0) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, mounted]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => enabledIndex(index, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => enabledIndex(index < 0 ? 0 : index, -1));
        break;
      case "Home":
        event.preventDefault();
        setActive(enabledIndex(-1, 1));
        break;
      case "End":
        event.preventDefault();
        setActive(enabledIndex(visible.length, -1));
        break;
      case "Enter":
        event.preventDefault();
        choose(visible[active]);
        break;
      case " ":
        if (!searchable) {
          event.preventDefault();
          choose(visible[active]);
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default: {
        // Ketik huruf untuk melompat ke opsi (tanpa kotak cari)
        if (!searchable && event.key.length === 1 && /\S/.test(event.key)) {
          const state = typeahead.current;
          if (state.timer) clearTimeout(state.timer);
          state.text += event.key.toLowerCase();
          state.timer = setTimeout(() => {
            state.text = "";
          }, 600);
          const match = visible.findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(state.text));
          if (match >= 0) setActive(match);
        }
      }
    }
  };

  const activeId = open && active >= 0 && visible[active] ? `${autoId}-opt-${active}` : undefined;
  const SelectedIcon = selected?.icon ?? LeadingIcon;

  const onOptionPointerDown = (event: ReactPointerEvent<HTMLLIElement>) => event.preventDefault();

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={searchable ? undefined : activeId}
        aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? label)}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
        className={`ui-select__trigger ${open ? "is-open" : ""} ${invalid ? "is-invalid" : ""} ${triggerClassName}`}
      >
        {SelectedIcon ? <SelectedIcon size={16} className="ui-select__lead" aria-hidden="true" /> : null}
        <span className={`ui-select__value ${selected ? "" : "is-placeholder"}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={16} className="ui-select__chevron" aria-hidden="true" />
      </button>

      {open && position
        ? createPortal(
            <div
              ref={popoverRef}
              className="ui-select__popover"
              style={{ position: "fixed", left: position.left, width: position.width, top: position.top, bottom: position.bottom }}
            >
              {searchable ? (
                <div className="ui-select__search">
                  <Search size={15} aria-hidden="true" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    aria-controls={listId}
                    aria-activedescendant={activeId}
                    role="searchbox"
                  />
                </div>
              ) : null}

              <ul
                ref={listRef}
                id={listId}
                role="listbox"
                tabIndex={-1}
                aria-labelledby={triggerId}
                aria-activedescendant={searchable ? undefined : activeId}
                onKeyDown={searchable ? undefined : onKeyDown}
                className="ui-select__list"
                style={{ maxHeight: position.maxHeight - (searchable ? 52 : 0) }}
              >
                {visible.length === 0 ? <li className="ui-select__empty">{emptyText}</li> : null}
                {visible.map((option, index) => {
                  const isSelected = option.value === (value ?? "");
                  const header = option.group && option.group !== visible[index - 1]?.group ? option.group : null;
                  const OptionIcon = option.icon;
                  return [
                    header ? (
                      <li key={`group-${header}`} role="presentation" className="ui-select__group">
                        {header}
                      </li>
                    ) : null,
                    <li
                      key={option.value}
                      id={`${autoId}-opt-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      onPointerDown={onOptionPointerDown}
                      onClick={() => choose(option)}
                      onMouseMove={() => active !== index && !option.disabled && setActive(index)}
                      className={`ui-select__option ${index === active ? "is-active" : ""} ${isSelected ? "is-selected" : ""}`}
                    >
                      {OptionIcon ? <OptionIcon size={15} className="ui-select__option-icon" aria-hidden="true" /> : null}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{option.label}</span>
                        {option.description ? <span className="ui-select__description">{option.description}</span> : null}
                      </span>
                      {isSelected ? <Check size={15} className="ui-select__check" aria-hidden="true" /> : null}
                    </li>,
                  ];
                })}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
