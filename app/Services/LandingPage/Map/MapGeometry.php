<?php

namespace App\Services\LandingPage\Map;

class MapGeometry
{
    public const EPS = 0.0001;

    public float $metersPerX;

    public float $metersPerY;

    /**
     * Inisialisasi MapGeometry dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct()
    {
        $width = (float) config('map.width_meters', 200);

        $this->metersPerX = $width / 100;
        $this->metersPerY = $width * (float) config('map.image_aspect', 752 / 1540) / 100;
    }

    /**
     * Jarak dua titik dalam meter.
     *
     * @param  array{x: float, y: float}  $a
     * @param  array{x: float, y: float}  $b
     */
    public function meters(array $a, array $b): float
    {
        $dx = ($b['x'] - $a['x']) * $this->metersPerX;
        $dy = ($b['y'] - $a['y']) * $this->metersPerY;

        return sqrt($dx * $dx + $dy * $dy);
    }

    /**
     * Panjang total sebuah polyline dalam meter.
     *
     * @param  array<int, array{x: float, y: float}>  $points
     */
    public function polylineMeters(array $points): float
    {
        $total = 0.0;

        for ($i = 1; $i < count($points); $i++) {
            $total += $this->meters($points[$i - 1], $points[$i]);
        }

        return $total;
    }

    /**
     * Vektor arah dalam meter. Sumbu y gambar mengarah ke bawah.
     *
     * @param  array{x: float, y: float}  $from
     * @param  array{x: float, y: float}  $to
     * @return array{0: float, 1: float}
     */
    public function vector(array $from, array $to): array
    {
        return [($to['x'] - $from['x']) * $this->metersPerX, ($to['y'] - $from['y']) * $this->metersPerY];
    }

    /**
     * Periksa apakah tiga titik berurutan membentuk garis lurus.
     *
     * @param  array{x: float, y: float}  $a
     * @param  array{x: float, y: float}  $b
     * @param  array{x: float, y: float}  $c
     */
    public function isStraight(array $a, array $b, array $c): bool
    {
        $v1 = $this->vector($a, $b);
        $v2 = $this->vector($b, $c);
        $cross = $v1[0] * $v2[1] - $v1[1] * $v2[0];
        $dot = $v1[0] * $v2[0] + $v1[1] * $v2[1];
        $norm = hypot($v1[0], $v1[1]) * hypot($v2[0], $v2[1]);

        return $norm > 0 && $dot > 0 && abs($cross) / $norm < 0.035;
    }

    /**
     * Proyeksikan titik ke ruas garis. Mengembalikan t yang dipotong ke 0..1 dan t aslinya.
     *
     * @param  array{x: float, y: float}  $p
     * @param  array{x: float, y: float}  $a
     * @param  array{x: float, y: float}  $b
     * @return array{0: float, 1: float}
     */
    public function projectT(array $p, array $a, array $b): array
    {
        $ax = $a['x'] * $this->metersPerX;
        $ay = $a['y'] * $this->metersPerY;
        $dx = $b['x'] * $this->metersPerX - $ax;
        $dy = $b['y'] * $this->metersPerY - $ay;
        $lengthSq = $dx * $dx + $dy * $dy;

        if ($lengthSq < self::EPS) {
            return [0.0, 0.0];
        }

        $t = (($p['x'] * $this->metersPerX - $ax) * $dx + ($p['y'] * $this->metersPerY - $ay) * $dy) / $lengthSq;

        return [max(0.0, min(1.0, $t)), $t];
    }

    /**
     * Jarak terpendek dari titik ke persegi ruangan dalam meter.
     *
     * @param  array{x1: float, y1: float, x2: float, y2: float}  $rect
     * @param  array{x: float, y: float}  $point
     */
    public function rectDistanceMeters(array $rect, array $point): float
    {
        $dx = max($rect['x1'] - $point['x'], 0, $point['x'] - $rect['x2']) * $this->metersPerX;
        $dy = max($rect['y1'] - $point['y'], 0, $point['y'] - $rect['y2']) * $this->metersPerY;

        return sqrt($dx * $dx + $dy * $dy);
    }

    /**
     * Bulatkan koordinat titik untuk respons publik.
     *
     * @param  array{x: float, y: float}  $point
     * @return array{x: float, y: float}
     */
    public function publicPoint(array $point): array
    {
        return ['x' => round($point['x'], 2), 'y' => round($point['y'], 2)];
    }

    /**
     * Kaki jalur dari pusat ruangan ke titik di koridor. Untuk koridor lurus horizontal atau vertikal
     * dibuat siku agar tidak memotong bangunan di sebelahnya.
     *
     * @param  array{x: float, y: float}  $center
     * @param  array{x: float, y: float}  $point
     * @param  array{x: float, y: float}  $a
     * @param  array{x: float, y: float}  $b
     * @return array<int, array{x: float, y: float}>
     */
    public function entryLeg(array $center, array $point, array $a, array $b): array
    {
        $aligned = abs($center['x'] - $point['x']) < self::EPS || abs($center['y'] - $point['y']) < self::EPS;

        if ($aligned) {
            return [$center, $point];
        }

        $horizontal = abs($a['y'] - $b['y']) < self::EPS;
        $vertical = abs($a['x'] - $b['x']) < self::EPS;

        if ($horizontal) {
            return [$center, ['x' => $point['x'], 'y' => $center['y']], $point];
        }

        if ($vertical) {
            return [$center, ['x' => $center['x'], 'y' => $point['y']], $point];
        }

        return [$center, $point];
    }
}
