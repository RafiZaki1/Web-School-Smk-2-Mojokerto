<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum DocumentExtensionEnum: string
{
    use HasValues;

    case PDF = 'pdf';
    case DOC = 'doc';
    case DOCX = 'docx';
    case XLS = 'xls';
    case XLSX = 'xlsx';
    case PPT = 'ppt';
    case PPTX = 'pptx';
    case ZIP = 'zip';
    case JPG = 'jpg';
    case JPEG = 'jpeg';
    case PNG = 'png';
    case WEBP = 'webp';
}
