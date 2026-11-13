<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Model;

interface DocumentServiceInterface extends ContentServiceInterface
{
    /** Catat unduhan berkas yang terbit lalu kembalikan record-nya. */
    public function recordDownload(int|string $identifier): Model;
}
