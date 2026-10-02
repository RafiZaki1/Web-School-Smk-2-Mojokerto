<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('card_title')->nullable();
            $table->string('rank', 50);
            $table->string('level', 50);
            $table->string('category', 50)->nullable();
            $table->string('subtitle')->nullable();
            $table->string('student_name');
            $table->string('student_class')->nullable();
            $table->string('student_photo')->nullable();
            $table->string('cover_image')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('location')->nullable();
            $table->string('organizer')->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->string('document')->nullable();
            $table->json('testimonial')->nullable();
            $table->string('gallery_title')->nullable();
            $table->text('gallery_description')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
