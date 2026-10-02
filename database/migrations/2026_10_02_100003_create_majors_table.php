<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('code', 30);
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->string('accreditation')->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->string('image')->nullable();
            $table->string('accent_color', 20)->nullable();
            $table->json('competencies')->nullable();
            $table->json('careers')->nullable();
            $table->string('facility_title')->nullable();
            $table->json('facilities')->nullable();
            $table->json('partners')->nullable();
            $table->string('lab_room_slug')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('majors');
    }
};
