<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Poin tata tertib siswa, dikelompokkan per bagian (Kehadiran, Sikap, dst).
     */
    public function up(): void
    {
        Schema::create('school_rules', function (Blueprint $table) {
            $table->id();
            $table->string('section');
            $table->text('content');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['section', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_rules');
    }
};
