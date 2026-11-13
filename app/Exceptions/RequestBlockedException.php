<?php

namespace App\Exceptions;

use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

class RequestBlockedException extends RuntimeException
{
    /**
     * @param  array<string, mixed>|null  $data
     */
    public function __construct(
        string $message,
        protected int $statusCode = Response::HTTP_TOO_MANY_REQUESTS,
        protected ?array $data = null,
    ) {
        parent::__construct($message);
    }

    /**
     * Ambil kode status HTTP yang dipakai untuk membalas permintaan yang diblokir.
     */
    public function statusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * Ambil data tambahan untuk respons, misalnya waktu tunggu.
     *
     * @return array<string, mixed>|null
     */
    public function data(): ?array
    {
        return $this->data;
    }
}
