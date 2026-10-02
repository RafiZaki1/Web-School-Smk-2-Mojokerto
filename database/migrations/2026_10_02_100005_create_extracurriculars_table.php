<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('cover_image')->nullable();
            $table->text('summary')->nullable();
            $table->string('schedule')->nullable();
            $table->string('location')->nullable();
            $table->string('members')->nullable();
            $table->string('about_title')->nullable();
            $table->longText('about')->nullable();
            $table->string('gallery_title')->nullable();
            $table->json('gallery')->nullable();
            $table->json('achievements')->nullable();
            $table->json('testimonials')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extracurriculars');
    }
};
