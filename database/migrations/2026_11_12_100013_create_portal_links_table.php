<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tombol pintasan navbar ke domain eksternal (E-Learning).
     */
    public function up(): void
    {
        Schema::create('portal_links', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique();
            $table->string('label');
            $table->string('url');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portal_links');
    }
};
