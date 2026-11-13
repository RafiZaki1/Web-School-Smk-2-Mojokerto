<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pengaturan pengumuman kelulusan. Hanya satu baris (lihat GraduationSetting::current()).
     * release_at disimpan dalam zona waktu aplikasi (UTC); tampilan mengonversi ke WIB.
     */
    public function up(): void
    {
        Schema::create('graduation_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('active_year');
            $table->string('release_mode', 20)->default('draft');
            $table->dateTime('release_at')->nullable();
            $table->text('closed_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('graduation_settings');
    }
};
