<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {

            $table->unsignedInteger('student_count')->nullable()->after('established_year');
            $table->unsignedInteger('teacher_count')->nullable()->after('student_count');
            $table->unsignedInteger('alumni_count')->nullable()->after('teacher_count');
        });
    }

    public function down(): void
    {
        Schema::table('school_profiles', function (Blueprint $table) {
            $table->dropColumn(['student_count', 'teacher_count', 'alumni_count']);
        });
    }
};
