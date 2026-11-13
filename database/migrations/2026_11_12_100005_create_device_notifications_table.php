<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Isi ikon lonceng di landing page. Hanya pesan milik device_token yang sama
     * yang ditampilkan ke perangkat tersebut.
     */
    public function up(): void
    {
        Schema::create('device_notifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('device_token');
            $table->foreignId('alumni_service_request_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('body');
            $table->string('url')->nullable();
            $table->timestamp('pushed_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['device_token', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_notifications');
    }
};
