<?php

namespace App\Helpers;

class TicketCodeHelper
{
    /** Huruf yang mirip angka (O, I, L) dan angka 0/1 tidak dipakai agar mudah dibacakan. */
    private const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    /**
     * Buat kode tiket pendek seperti TU-7KQ2MX. Keunikan dijaga unique index kolom ticket_code;
     * dengan 31^6 kombinasi, peluang tabrakan dapat diabaikan untuk volume layanan TU.
     *
     * @param  string  $prefix
     * @param  int  $length
     * @return string
     */
    public static function generate(string $prefix = 'TU-', int $length = 6): string
    {
        $code = $prefix;
        $max = strlen(self::ALPHABET) - 1;

        for ($i = 0; $i < $length; $i++) {
            $code .= self::ALPHABET[random_int(0, $max)];
        }

        return $code;
    }
}
