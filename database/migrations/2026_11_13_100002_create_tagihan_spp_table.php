<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Satu baris per siswa per bulan per tahun ajaran. Kolom bulan memakai nomor
     * bulan kalender (7 = Juli ... 6 = Juni); urutan tampil diatur kolom urutan.
     */
    public function up(): void
    {
        Schema::create('tagihan_spp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->string('tahun_ajaran', 9)->index();
            $table->unsignedTinyInteger('bulan');
            $table->unsignedTinyInteger('urutan');
            $table->string('nama_bulan', 20);
            $table->unsignedInteger('nominal_spp');
            $table->unsignedInteger('nominal_tabungan');
            $table->string('status', 20)->default('belum_lunas')->index();
            $table->date('jatuh_tempo')->index();
            $table->timestamp('lunas_at')->nullable();
            $table->timestamps();

            $table->unique(['siswa_id', 'tahun_ajaran', 'bulan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihan_spp');
    }
};
