<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Galeri foto dokumentasi kegiatan PKL siswa.
     */
    public function up(): void
    {
        Schema::create('internship_documentations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image');
            $table->string('major_code', 20)->nullable()->index();
            $table->foreignId('industry_partner_id')->nullable()->constrained()->nullOnDelete();
            $table->date('activity_date')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internship_documentations');
    }
};
