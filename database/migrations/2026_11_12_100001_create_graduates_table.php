<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Data kelulusan kelas XII. Satu baris per siswa (NISN unik nasional).
     * Baris dengan is_archived = true tampil di Direktori Lulusan publik.
     */
    public function up(): void
    {
        Schema::create('graduates', function (Blueprint $table) {
            $table->id();
            $table->string('nisn', 20)->unique();
            $table->string('full_name');
            $table->date('birth_date');
            $table->string('class_name', 30)->index();
            $table->string('major_code', 20)->index();
            $table->unsignedSmallInteger('graduation_year')->index();
            $table->string('status', 20)->default('passed');
            $table->string('administration_status', 20)->default('pending');
            $table->text('note')->nullable();
            $table->boolean('is_archived')->default(false)->index();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->index(['nisn', 'birth_date']);
            $table->index('updated_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('graduates');
    }
};
