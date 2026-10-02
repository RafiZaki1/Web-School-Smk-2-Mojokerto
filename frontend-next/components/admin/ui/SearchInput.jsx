import { Search } from "lucide-react";

/** Kolom pencarian dari dealtech-ui (SearchInput). */
export default function SearchInput({ value, onChange, placeholder = "Cari...", className = "" }) {
  return (
    <label className={`search-input-wrap ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <Search className="search-input__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </label>
  );
}
