<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Penautan akun wali kelas (users.role = wali_kelas) ke satu kelas. Satu kelas punya
     * satu wali kelas dan satu akun hanya memegang satu kelas. teacher_id opsional,
     * menautkan ke data guru yang tampil di web sekolah.
     */
    public function up(): void
    {
        Schema::create('wali_kelas', function (Blueprint $table) {
            $table->id();
            $table->string('kelas', 30)->unique();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wali_kelas');
    }
};
