<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Akun siswa untuk portal Bank Mini (guard "siswa"). Bila tabel siswa sudah ada
     * dari modul lain, migrasi ini hanya menambahkan kolom password dan remember_token.
     * Password null berarti siswa belum pernah login dan masih memakai NISN.
     */
    public function up(): void
    {
        if (! Schema::hasTable('siswa')) {
            Schema::create('siswa', function (Blueprint $table) {
                $table->id();
                $table->string('nisn', 20)->unique();
                $table->string('nama');
                $table->string('kelas', 30)->index();
                $table->string('jurusan', 20)->nullable()->index();
                $table->string('password')->nullable();
                $table->rememberToken();
                $table->timestamp('password_changed_at')->nullable();
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
            });

            return;
        }

        Schema::table('siswa', function (Blueprint $table) {
            if (! Schema::hasColumn('siswa', 'password')) {
                $table->string('password')->nullable();
            }
            if (! Schema::hasColumn('siswa', 'remember_token')) {
                $table->rememberToken();
            }
            if (! Schema::hasColumn('siswa', 'password_changed_at')) {
                $table->timestamp('password_changed_at')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
