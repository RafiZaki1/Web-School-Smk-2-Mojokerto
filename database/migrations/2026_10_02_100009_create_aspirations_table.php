<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aspirations', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50);
            $table->string('title');
            $table->text('detail');
            $table->json('photos')->nullable();
            $table->boolean('is_anonymous')->default(true);
            $table->string('sender_name')->nullable();
            $table->string('status', 20)->default('new');
            $table->text('admin_note')->nullable();
            $table->string('public_response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aspirations');
    }
};
