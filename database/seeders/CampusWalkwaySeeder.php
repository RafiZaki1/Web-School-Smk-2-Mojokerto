<?php

namespace Database\Seeders;

use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Seeder;

/**
 * Jaringan jalur pejalan kaki SMKN 2 Kota Mojokerto, ditelusuri dari
 * gambar denah (frontend-next/public/denah-map.png, 1024x584).
 * Koordinat dalam persen gambar; semua ruas lurus horizontal/vertikal
 * mengikuti koridor & area berpaving sehingga rute tidak menembus gedung.
 */
class CampusWalkwaySeeder extends Seeder
{
    /** kode => [nama, x, y] */
    public const NODES = [
        // Koridor utara (antara deret Lab APHP/Kantin/Kelas XI dan deret Kolam/Kelas XII)
        'nw' => ['Pojok Barat Laut', 16.3, 10.3],
        'n_aphp' => ['Depan Lab APHP', 22.6, 10.3],
        'n_kantin' => ['Depan Kantin', 32.05, 10.3],
        'n_pastri' => ['Depan Lab Pastri Kuliner', 42.6, 10.3],
        'n_blvd' => ['Ujung Utara Boulevard', 53.0, 10.3],
        'n_xikul' => ['Depan Kelas XI Kuliner', 66.25, 10.3],
        'n_xirpl' => ['Depan Kelas XI RPL', 81.5, 10.3],
        'ne' => ['Pojok Timur Laut', 88.6, 10.3],

        // Lorong y=19.5 (belakang kolam & depan Lab RPL)
        'c_w' => ['Taman Barat Gedung APHP', 22.6, 19.5],
        'c_blvd' => ['Tengah Boulevard', 53.0, 19.5],
        'c_rpl1' => ['Depan Lab RPL 1', 65.75, 19.5],
        'c_rpl2' => ['Depan Lab RPL 2', 76.4, 19.5],
        'c_e' => ['Pintu Masuk Lapangan Olahraga', 88.6, 19.5],

        // Koridor tengah y=33.2 (depan Gedung APHP, Aula)
        'm_w' => ['Persimpangan Jalur Parkiran', 16.3, 33.2],
        'm_nw' => ['Persimpangan Taman Barat', 22.6, 33.2],
        'm_plw' => ['Sudut Barat Laut Lapangan Tengah', 29.3, 33.2],
        'm_ple' => ['Sudut Timur Laut Lapangan Tengah', 47.6, 33.2],
        'm_blvd' => ['Persimpangan Boulevard', 53.0, 33.2],
        'm_mid' => ['Sudut Barat Laut Plaza Timur', 58.3, 33.2],
        'm_east' => ['Persimpangan Gedung Timur', 74.3, 33.2],
        'm_e' => ['Sudut Lapangan Olahraga', 88.6, 33.2],

        // Jalur parkiran (sisi barat)
        'w_mid' => ['Jalur Parkiran Tengah', 16.3, 52.0],
        's_w' => ['Ujung Selatan Jalur Parkiran', 16.3, 73.3],

        // Lapangan tengah (plaza antara Gedung DKV-LPS dan Gedung RPL)
        'p_w' => ['Sisi Barat Lapangan Tengah', 29.3, 52.0],
        'p_e' => ['Sisi Timur Lapangan Tengah', 47.6, 52.0],
        's_plw' => ['Sudut Barat Daya Lapangan Tengah', 29.3, 71.2],
        's_ple' => ['Sudut Tenggara Lapangan Tengah', 47.6, 71.2],
        's_e' => ['Persimpangan Samping Musholla', 58.3, 71.2],

        // Area depan: BKK, Kantor, Pos Satpam, Musholla
        's_bkk' => ['Depan Taman BKK', 22.4, 73.3],
        's_wr' => ['Ujung Jalan Depan Kelas LPS', 29.3, 73.3],
        'bkk' => ['Depan Koperasi Siswa', 22.4, 79.8],
        'bkk_w' => ['Depan BKK', 19.4, 79.8],
        'bkk_e' => ['Depan Mini Bank', 25.3, 79.8],
        'pos' => ['Samping Pos Satpam', 47.6, 84.25],
        'pos_s' => ['Depan Gerbang Pos Satpam', 47.6, 89.3],
        'gate' => ['Depan Pintu Utama Kantor', 37.75, 89.3],
        'mus_w' => ['Pojok Depan Musholla', 58.3, 89.3],
        'mus_door' => ['Depan Pintu Musholla', 64.0, 89.3],

        // Plaza timur & gedung timur
        'e_mid' => ['Sisi Barat Plaza Timur', 58.3, 47.0],
        'e_tree' => ['Sisi Timur Plaza Timur', 74.3, 47.0],
        'e_sw' => ['Sudut Barat Daya Plaza Timur', 58.3, 60.5],
        'e_ups' => ['Depan Kelas XII UPS 1', 70.3, 60.5],
        'court' => ['Halaman Gedung Timur', 74.3, 60.5],
        'uks' => ['Depan Lab UKS', 80.35, 60.5],
        'lps1' => ['Depan Kelas XII LPS 1', 80.35, 52.0],
        'e_s' => ['Pojok Belakang Praktik Resto', 70.3, 76.3],
        'dkv' => ['Belakang Lab DKV', 80.35, 76.3],
        'bk' => ['Depan Ruang BK', 88.6, 68.25],
        'se' => ['Pojok Tenggara', 88.6, 76.3],
    ];

    /** [nama jalur, ...kode node berurutan] — tiap pasangan berurutan menjadi satu ruas. */
    public const PATHS = [
        ['Koridor Depan Kantin', 'nw', 'n_aphp', 'n_kantin', 'n_pastri', 'n_blvd'],
        ['Lorong Kelas XI', 'n_blvd', 'n_xikul', 'n_xirpl', 'ne'],
        ['Lorong Belakang Kolam', 'c_w', 'c_blvd'],
        ['Koridor Depan Lab RPL', 'c_blvd', 'c_rpl1', 'c_rpl2', 'c_e'],
        ['Koridor Depan Gedung APHP', 'm_w', 'm_nw', 'm_plw', 'm_ple'],
        ['Koridor Tengah', 'm_ple', 'm_blvd', 'm_mid'],
        ['Koridor Depan Aula', 'm_mid', 'm_east', 'm_e'],
        ['Taman Barat', 'n_aphp', 'c_w', 'm_nw'],
        ['Boulevard Tengah', 'n_blvd', 'c_blvd', 'm_blvd'],
        ['Jalur Parkiran', 'nw', 'm_w', 'w_mid', 's_w'],
        ['Lorong Tengah Gedung DKV-LPS', 'w_mid', 'p_w'],
        ['Sisi Barat Lapangan Tengah', 'm_plw', 'p_w', 's_plw', 's_wr'],
        ['Lapangan Tengah', 'p_w', 'p_e'],
        ['Sisi Timur Lapangan Tengah', 'm_ple', 'p_e', 's_ple'],
        ['Jalan Depan Air Mancur', 's_plw', 's_ple'],
        ['Jalan Selatan Gedung RPL', 's_ple', 's_e'],
        ['Jalan Depan Kelas LPS', 's_w', 's_bkk', 's_wr'],
        ['Jalan Menuju BKK', 's_bkk', 'bkk'],
        ['Teras BKK, Koperasi & Bank', 'bkk_w', 'bkk', 'bkk_e'],
        ['Jalan Samping Pos Satpam', 's_ple', 'pos', 'pos_s'],
        ['Jalan Depan Kantor', 'gate', 'pos_s'],
        ['Jalan Depan Pos Satpam', 'pos_s', 'mus_w'],
        ['Halaman Depan Musholla', 'mus_w', 'mus_door'],
        ['Jalan Samping Musholla', 's_e', 'mus_w'],
        ['Sisi Barat Plaza Timur', 'm_mid', 'e_mid', 'e_sw'],
        ['Lorong Antara Gedung RPL & Musholla', 'e_sw', 's_e'],
        ['Plaza Timur', 'e_mid', 'e_tree'],
        ['Lorong Gedung Percetakan', 'm_east', 'e_tree', 'court'],
        ['Sisi Selatan Plaza Timur', 'e_sw', 'e_ups', 'court'],
        ['Halaman Gedung Timur', 'court', 'uks', 'lps1'],
        ['Lorong Timur Musholla', 'e_ups', 'e_s'],
        ['Jalan Belakang Lab DKV', 'e_s', 'dkv', 'se'],
        ['Jalur Timur Sisi Lapangan', 'ne', 'c_e', 'm_e'],
        ['Jalur Timur Gedung DKV', 'm_e', 'bk', 'se'],
    ];

    /**
     * Ruangan yang pintunya harus lewat node tertentu (bukan sembarang sisi terdekat).
     * slug ruangan => kode node.
     */
    public const DOORS = [
        'kantor-pusat' => 'gate',
        'musholla' => 'mus_door',
    ];

    /** @var array<string, int> kode node => id */
    public array $nodeIds = [];

    public function run(): void
    {
        $width = (float) config('map.width_meters', 200);
        $metersPerX = $width / 100;
        $metersPerY = $width * (float) config('map.image_aspect', 584 / 1024) / 100;

        foreach (self::NODES as $code => [$name, $x, $y]) {
            $this->nodeIds[$code] = MapNode::create([
                'name' => $name,
                'x' => $x,
                'y' => $y,
                'is_walkable' => true,
            ])->id;
        }

        foreach (self::PATHS as $path) {
            $name = array_shift($path);
            for ($i = 1; $i < count($path); $i++) {
                [, $x1, $y1] = self::NODES[$path[$i - 1]];
                [, $x2, $y2] = self::NODES[$path[$i]];

                MapEdge::create([
                    'from_node_id' => $this->nodeIds[$path[$i - 1]],
                    'to_node_id' => $this->nodeIds[$path[$i]],
                    'name' => $name,
                    'distance' => round(hypot(($x2 - $x1) * $metersPerX, ($y2 - $y1) * $metersPerY), 1),
                    'is_walkable' => true,
                ]);
            }
        }
    }
}
