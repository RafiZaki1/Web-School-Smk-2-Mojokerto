<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Mitra DU/DI. Satu mitra bisa melayani beberapa jurusan, jadi major_codes berupa
     * array JSON. Array kosong berarti mitra umum (semua jurusan).
     */
    public function up(): void
    {
        Schema::create('industry_partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->json('major_codes');
            $table->string('city')->nullable();
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('industry_partners');
    }
};
