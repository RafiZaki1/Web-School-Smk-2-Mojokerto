<?php

namespace App\Exceptions\BankMini;

use RuntimeException;

/**
 * Sebagian bulan pilihan sudah lunas atau sedang dikunci transaksi lain saat UPDATE atomic dijalankan.
 */
class TagihanTidakTersediaException extends RuntimeException {}
