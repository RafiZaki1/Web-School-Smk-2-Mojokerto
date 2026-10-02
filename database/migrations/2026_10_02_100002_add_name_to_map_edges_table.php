<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('map_edges', function (Blueprint $table) {
            // Nama jalur untuk petunjuk arah, mis. "Koridor Depan Kantin"
            $table->string('name')->nullable()->after('to_node_id');
        });
    }

    public function down(): void
    {
        Schema::table('map_edges', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
