<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Antrean layanan berkas alumni (ambil ijazah, cap tiga jari, legalisir).
     * device_token adalah UUID acak yang disimpan di localStorage perangkat pengaju,
     * dipakai untuk lonceng notifikasi dan Web Push tanpa login.
     */
    public function up(): void
    {
        Schema::create('alumni_service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code', 20)->unique();
            $table->uuid('device_token')->index();
            $table->string('nisn', 20)->index();
            $table->string('full_name');
            $table->unsignedSmallInteger('graduation_year');
            $table->string('class_name', 30)->index();
            $table->string('major_code', 20)->index();
            $table->string('service_type', 30);
            $table->text('purpose');
            $table->string('phone', 20)->nullable();
            $table->string('status', 20)->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'class_name']);
            $table->index('updated_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni_service_requests');
    }
};
