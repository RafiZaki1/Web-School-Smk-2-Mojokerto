<?php

return [
   
    'width_meters' => (float) env('MAP_WIDTH_METERS', 200),

    'image_aspect' => 584 / 1024,

    // Kecepatan jalan kaki rata-rata (meter/detik)
    'walking_speed' => (float) env('MAP_WALKING_SPEED', 1.2),

    // Jarak maksimum (meter) dari tepi ruangan ke koridor agar dianggap pintu masuk
    'entry_tolerance_meters' => 6.5,

    // Jarak maksimum (meter) dari jalur agar sebuah ruangan disebut "dilewati"
    'landmark_tolerance_meters' => 4.0,
];
