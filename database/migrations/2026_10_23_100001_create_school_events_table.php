<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_events', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category')->nullable();
            $table->longText('description')->nullable();
            $table->string('location')->nullable();
            $table->date('starts_on');

            $table->date('ends_on')->nullable();

            $table->string('time_label')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'starts_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_events');
    }
};
