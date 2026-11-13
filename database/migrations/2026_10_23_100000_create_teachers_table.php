<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');

            $table->string('position')->nullable();

            $table->string('group', 20)->default('guru');

            $table->string('subject')->nullable();
            $table->string('photo')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'group']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
