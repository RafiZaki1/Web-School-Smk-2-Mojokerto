import Select from "@/components/ui/Select";

/** Dropdown filter daftar (kategori, tahun, lokasi) memakai Select kustom. */
export default function SelectField({ value, onChange, options = [], label, className = "" }) {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      className={`min-w-[150px] sm:min-w-[180px] ${className}`}
    />
  );
}
