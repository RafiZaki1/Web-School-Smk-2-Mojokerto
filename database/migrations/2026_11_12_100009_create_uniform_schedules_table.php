<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jadwal seragam harian Senin sampai Jumat, satu baris per hari.
     */
    public function up(): void
    {
        Schema::create('uniform_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('day', 10)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uniform_schedules');
    }
};
