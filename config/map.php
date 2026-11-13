<?php

return [

    'width_meters' => (float) env('MAP_WIDTH_METERS', 200),

    'image_aspect' => 752 / 1540,

    'walking_speed' => (float) env('MAP_WALKING_SPEED', 1.2),

    'entry_tolerance_meters' => 6.5,

    'landmark_tolerance_meters' => 4.0,
];
