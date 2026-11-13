<?php

namespace Database\Seeders;

use App\Enums\PortalLinkKeyEnum;
use App\Models\PortalLink;
use Illuminate\Database\Seeder;

/**
 * Pintasan navbar ke domain eksternal (E-Learning, domain resmi). Ubah lewat dashboard TU.
 */
class PortalLinkSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            PortalLinkKeyEnum::ELEARNING->value => ['E-Learning', 'http://smkn2mojokerto.my.id'],
        ];

        $order = 0;
        foreach ($rows as $key => [$label, $url]) {
            PortalLink::query()->updateOrCreate(['key' => $key], [
                'label' => $label,
                'url' => $url,
                'is_active' => true,
                'sort_order' => ++$order,
            ]);
        }
    }
}
