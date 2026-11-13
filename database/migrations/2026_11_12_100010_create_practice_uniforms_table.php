<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Seragam praktik produktif, satu baris per jurusan.
     */
    public function up(): void
    {
        Schema::create('practice_uniforms', function (Blueprint $table) {
            $table->id();
            $table->string('major_code', 20)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practice_uniforms');
    }
};
