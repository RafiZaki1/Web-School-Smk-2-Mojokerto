<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum UploadDirectoryEnum: string
{
    use HasValues;

    case ACHIEVEMENTS = 'achievements';
    case ACHIEVEMENT_STUDENTS = 'achievements/students';
    case ACHIEVEMENT_DOCUMENTS = 'achievements/documents';
    case ACHIEVEMENT_GALLERY = 'achievements/gallery';
    case ALUMNI = 'alumni';
    case ARTICLES = 'articles';
    case ARTICLE_GALLERY = 'articles/gallery';
    case DOCUMENTS = 'documents';
    case EVENTS = 'events';
    case EXTRACURRICULARS = 'extracurriculars';
    case EXTRACURRICULAR_GALLERY = 'extracurriculars/gallery';
    case GALLERIES = 'galleries';
    case HEROES = 'heroes';
    case GRADUATION_IMPORTS = 'graduation-imports';
    case INDUSTRY_PARTNERS = 'industry-partners';
    case INTERNSHIP_DOCUMENTATIONS = 'internship-documentations';
    case JOBS = 'jobs';
    case MAJORS = 'majors';
    case MAJOR_FACILITIES = 'majors/facilities';
    case MAJOR_PARTNERS = 'majors/partners';
    case ROOMS = 'rooms';
    case SCHOOL_PROFILES = 'school-profiles';
    case SITE_CONTENTS = 'site-contents';
    case TEACHERS = 'teachers';
    case UNIFORMS = 'uniforms';
}
