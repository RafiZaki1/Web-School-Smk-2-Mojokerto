import Select, { type SelectOption } from "@/shared/components/ui/Select";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  label?: string;
  className?: string;
}

/** Dropdown filter daftar (kategori, tahun, lokasi) memakai Select kustom. */
export default function SelectField({ value, onChange, options = [], label, className = "" }: SelectFieldProps) {
  return <Select label={label} value={value} onChange={onChange} options={options} className={`min-w-[150px] sm:min-w-[180px] ${className}`} />;
}
