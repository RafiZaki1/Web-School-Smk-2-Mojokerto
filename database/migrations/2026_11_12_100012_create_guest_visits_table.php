<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Buku tamu: jadwal kunjungan tamu instansi.
     */
    public function up(): void
    {
        Schema::create('guest_visits', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_name');
            $table->string('institution');
            $table->string('phone', 20)->nullable();
            $table->text('purpose');
            $table->date('visit_date')->index();
            $table->time('visit_time')->nullable();
            $table->unsignedSmallInteger('participants')->default(1);
            $table->string('person_to_meet')->nullable();
            $table->string('status', 20)->default('scheduled');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_visits');
    }
};
