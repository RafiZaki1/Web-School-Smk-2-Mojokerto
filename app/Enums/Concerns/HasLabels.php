<?php

namespace App\Enums\Concerns;

trait HasLabels
{
    /**
     * Label Bahasa Indonesia untuk ditampilkan di antarmuka.
     */
    abstract public function label(): string;

    /**
     * Daftar pilihan untuk dropdown: [{value, label}].
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }

    /**
     * Cocokkan teks bebas (nilai atau label, tidak peka huruf besar) ke case enum.
     * Dipakai saat impor Excel yang diisi manual, mis. "Lulus" atau "BELUM".
     */
    public static function fromInput(?string $input): ?self
    {
        $needle = mb_strtolower(trim((string) $input));

        if ($needle === '') {
            return null;
        }

        foreach (self::cases() as $case) {
            if ($needle === mb_strtolower($case->value) || $needle === mb_strtolower($case->label())) {
                return $case;
            }
        }

        return null;
    }
}
