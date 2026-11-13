<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_name',
        'school_logo',
        'principal_name',
        'principal_position',
        'principal_photo',
        'welcome_message',
        'background_image',
        'established_year',
        'student_count',
        'teacher_count',
        'alumni_count',
    ];

    protected $casts = [
        'established_year' => 'integer',
        'student_count' => 'integer',
        'teacher_count' => 'integer',
        'alumni_count' => 'integer',
    ];
}
