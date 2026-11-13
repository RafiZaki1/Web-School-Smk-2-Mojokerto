<?php

namespace App\Services\LandingPage\Map;

class MapPhrases
{
    /**
     * Inisialisasi MapPhrases dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapGeometry $geometry,
    ) {}

    /**
     * Kata kerja belokan dalam bahasa Indonesia.
     */
    public function turnWord(string $turn): string
    {
        return match ($turn) {
            'turn-left' => 'belok kiri',
            'turn-right' => 'belok kanan',
            'slight-left' => 'serong ke kiri',
            'slight-right' => 'serong ke kanan',
            'u-turn' => 'putar balik',
            default => 'jalan lurus',
        };
    }

    /**
     * Judul langkah belokan, disertai nama jalur bila tersedia.
     *
     * @param  array<string, mixed>  $leg
     */
    public function turnTitle(string $turn, array $leg): string
    {
        $word = ucfirst($this->turnWord($turn));
        $name = $leg['names'][0] ?? null;

        if ($turn === 'straight') {
            return $name ? "Lurus terus ke {$name}" : 'Lurus terus';
        }

        return $name ? "{$word} ke {$name}" : $word;
    }

    /**
     * Frasa belokan untuk kalimat deskripsi, disertai nama jalur bila tersedia.
     *
     * @param  array<string, mixed>  $leg
     */
    public function turnPhrase(string $turn, array $leg): string
    {
        $name = $leg['names'][0] ?? null;

        return $this->turnWord($turn).($name ? " ke {$name}" : '');
    }

    /**
     * Posisi ruangan tujuan relatif terhadap arah jalan terakhir.
     */
    public function sidePhrase(string $turn): string
    {
        return match ($turn) {
            'turn-left', 'slight-left' => 'di sebelah kiri Anda',
            'turn-right', 'slight-right' => 'di sebelah kanan Anda',
            'u-turn' => 'di belakang Anda',
            default => 'tepat di depan Anda',
        };
    }

    /**
     * Arah mata angin dominan sebuah leg.
     *
     * @param  array<string, mixed>  $leg
     */
    public function compass(array $leg): string
    {
        [$dx, $dy] = $this->geometry->vector($leg['from'], $leg['to']);

        if (abs($dx) >= abs($dy)) {
            return $dx > 0 ? 'timur' : 'barat';
        }

        return $dy > 0 ? 'selatan' : 'utara';
    }

    /**
     * Jarak dalam bentuk pembulatan yang mudah dibaca, misalnya "±15 m".
     */
    public function formatDistance(float $meters): string
    {
        $rounded = $meters >= 20 ? (int) (round($meters / 5) * 5) : max(1, (int) round($meters));

        return "±{$rounded} m";
    }

    /**
     * Gabungkan daftar nama dengan koma dan kata "dan".
     *
     * @param  array<int, string>  $names
     */
    public function joinNames(array $names): string
    {
        if (count($names) <= 1) {
            return $names[0] ?? '';
        }

        $last = array_pop($names);

        return implode(', ', $names).' dan '.$last;
    }

    /**
     * Gabungkan bagian kalimat menjadi satu kalimat dengan huruf kapital dan titik di akhir.
     *
     * @param  array<int, string>  $parts
     */
    public function sentence(array $parts): string
    {
        $text = implode(', ', array_filter($parts));

        return ucfirst($text).'.';
    }
}
