<?php

namespace App\Exceptions\BankMini;

use RuntimeException;

/**
 * Tripay menolak atau tidak bisa dihubungi. Pesan berisi status HTTP dan body untuk log, jangan ditampilkan ke pengguna.
 */
class GatewayPembayaranException extends RuntimeException {}
