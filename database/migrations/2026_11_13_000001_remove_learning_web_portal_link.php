<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Hapus pintasan "Web Pembelajaran": URL-nya hanya contoh dan tidak ada domainnya.
     */
    public function up(): void
    {
        DB::table('portal_links')->where('key', 'learning_web')->delete();
    }

    public function down(): void
    {
        // Data contoh tidak dikembalikan.
    }
};
