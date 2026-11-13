<?php

namespace App\Services\LandingPage;

use DateTimeInterface;
use Illuminate\Support\Facades\Cache;

/**
 * Batas pemakaian API AI per hari: per IP untuk mencegah spam, dan total seluruh
 * situs untuk membatasi tagihan API key. Hitungan di-reset setiap tengah malam.
 */
class AiUsageLimiter
{
    /**
     * Catat satu pemanggilan AI bila masih di bawah batas.
     * Kembalikan 'ip' atau 'total' bila batas terlampaui, atau null bila boleh lanjut.
     * Batas yang bernilai null dilewati dan tidak dihitung.
     */
    public function allow(string $scope, ?string $ip, ?int $perIpLimit, ?int $totalLimit): ?string
    {
        $date = now()->format('Y-m-d');
        $ttl = now()->endOfDay();

        $ipKey = "ai_usage:{$scope}:{$date}:ip:{$ip}";
        $totalKey = "ai_usage:{$scope}:{$date}:total";

        $countsByIp = $ip !== null && $perIpLimit !== null;

        if ($countsByIp && ! $this->reserve($ipKey, $perIpLimit, $ttl)) {
            return 'ip';
        }

        if ($totalLimit !== null && ! $this->reserve($totalKey, $totalLimit, $ttl)) {
            if ($countsByIp) {
                Cache::decrement($ipKey);
            }

            return 'total';
        }

        return null;
    }

    /**
     * Tambah satu hitungan secara atomic dan batalkan bila hasilnya melewati batas.
     */
    private function reserve(string $key, int $limit, DateTimeInterface $ttl): bool
    {
        Cache::add($key, 0, $ttl);

        if (Cache::increment($key) > $limit) {
            Cache::decrement($key);

            return false;
        }

        return true;
    }
}
