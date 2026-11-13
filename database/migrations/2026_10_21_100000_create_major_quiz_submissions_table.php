<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('major_quiz_submissions', function (Blueprint $table) {
            $table->id();

            $table->string('code', 12)->unique();
            $table->string('name', 100)->nullable();
            $table->string('email', 150)->nullable();

            $table->json('answers');

            $table->json('scores');
            $table->unsignedTinyInteger('total_answered');

            $table->text('analysis')->nullable();

            $table->string('match_method', 20);
            $table->string('recommended_major', 50);
            $table->string('alternative_major', 50)->nullable();

            $table->string('final_major', 50)->nullable();
            $table->text('public_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->string('status', 20)->default('new');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('recommended_major');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('major_quiz_submissions');
    }
};
