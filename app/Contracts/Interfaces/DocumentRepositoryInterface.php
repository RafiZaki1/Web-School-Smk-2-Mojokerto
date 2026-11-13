<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Model;

interface DocumentRepositoryInterface extends ContentRepositoryInterface
{
    /**
     * Kontrak method incrementDownloads.
     *
     * @param  Model  $document
     * @return void
     */
    public function incrementDownloads(Model $document): void;
}
