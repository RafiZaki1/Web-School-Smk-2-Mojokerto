<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('company');
            $table->string('location')->nullable();
            $table->string('category', 80)->nullable();
            $table->string('employment_type', 30)->default('Full-time');
            $table->date('closes_at')->nullable();
            $table->string('status', 20)->default('open');
            $table->string('poster')->nullable();
            $table->string('banner_color', 20)->nullable();
            $table->string('banner_headline')->nullable();
            $table->string('banner_subtitle')->nullable();
            $table->longText('description')->nullable();
            $table->json('responsibilities')->nullable();
            $table->json('qualifications')->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->string('contact_email')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_vacancies');
    }
};
