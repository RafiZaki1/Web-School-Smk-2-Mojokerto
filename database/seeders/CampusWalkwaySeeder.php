<?php

namespace Database\Seeders;

use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Seeder;

/**
 * Jaringan jalur pejalan kaki SMKN 2 Kota Mojokerto, ditelusuri dari
 * gambar denah terbaru (frontend-next/public/denah-2026.webp, 1540x752,
 * berlaku mulai 5 Oktober 2026).
 * Koordinat dalam persen gambar; semua ruas lurus horizontal/vertikal
 * mengikuti koridor & area berpaving sehingga rute tidak menembus gedung.
 */
class CampusWalkwaySeeder extends Seeder
{
    /** kode => [nama, x, y] */
    public const NODES = [

        'wb_n' => ['Ujung Utara Lorong Gedung Barat', 10.4, 22.0],
        'wb_s' => ['Ujung Selatan Lorong Gedung Barat', 10.4, 46.6],
        'w_court' => ['Halaman Lab Kuliner', 16.3, 35.5],
        'w_s' => ['Sudut Barat Laut Lapangan Olahraga', 16.3, 46.6],
        'w_lib' => ['Pojok Barat Perpustakaan', 16.3, 59.0],
        'w_kul' => ['Pojok Barat Kelas Kuliner', 16.3, 78.6],

        'n_w' => ['Pojok Barat Jalan Parkir Motor', 22.8, 21.6],
        'w_gap' => ['Samping UKS', 22.8, 35.5],
        'mus_w' => ['Pojok Barat Daya Musholla', 22.8, 46.6],
        'mus_door' => ['Depan Musholla', 28.6, 46.6],
        'mus_e' => ['Pojok Tenggara Musholla', 38.7, 46.6],

        'n_rplw' => ['Pertigaan Barat Gedung RPL', 38.7, 21.6],
        'gate' => ['Depan Pos Satpam', 50.3, 21.6],
        'n_e' => ['Ujung Timur Jalan Parkir Motor', 51.6, 21.6],
        'rpl_nw' => ['Pojok Barat Laut Gedung RPL', 38.7, 27.2],
        'rpl_n' => ['Pintu Utara Gedung RPL', 47.2, 27.2],
        'rpl_ne' => ['Pojok Timur Laut Gedung RPL', 51.6, 27.2],
        'rpl_sw' => ['Pojok Barat Daya Gedung RPL', 38.7, 55.0],
        'c_sw' => ['Pertigaan Timur Aula', 44.3, 55.0],
        'rpl_s' => ['Pintu Selatan Gedung RPL', 47.2, 55.0],
        'c_w' => ['Samping Gazebo', 52.2, 55.0],

        'lib_door' => ['Depan Perpustakaan', 28.6, 59.0],
        'lib_e' => ['Pojok Timur Perpustakaan', 38.7, 59.0],
        'aula_ne' => ['Pojok Timur Laut Aula', 44.3, 59.0],
        'kul_e' => ['Pojok Timur Kelas Kuliner', 44.3, 78.6],

        'gu_w' => ['Sisi Barat Plaza Gedung Utama', 54.8, 36.3],
        'gu_door' => ['Depan Tangga Gedung Utama', 59.6, 36.3],
        'gu_e' => ['Sisi Timur Plaza Gedung Utama', 73.0, 36.3],
        'pl_sw' => ['Ujung Selatan Plaza Gedung Utama', 54.8, 46.2],
        'c_n' => ['Utara Gazebo', 52.2, 46.2],
        'aphp_w' => ['Pintu Barat Gedung APHP-DKV', 52.2, 59.0],
        'aphp_e' => ['Pintu Timur Gedung APHP-DKV', 73.0, 59.0],

        'gu_bw' => ['Belakang Gedung Utama Sisi Barat', 51.6, 17.0],
        'gu_be' => ['Belakang Gedung Utama Sisi Timur', 66.3, 17.0],
        'gu_ne' => ['Pojok Timur Laut Gedung Utama', 66.3, 21.6],
        'bkk_w' => ['Samping R. BKK', 68.0, 21.6],

        'ne_bkk' => ['Depan R. BKK', 68.0, 23.2],
        'ne_x' => ['Depan Toko Sekolah', 73.0, 23.2],
        'ne_e' => ['Depan Parkir Mobil', 87.4, 23.2],
        'lps_nw' => ['Pojok Barat Laut Gedung LPS', 73.0, 28.4],
        'lps_n' => ['Pintu Utara Gedung LPS', 80.3, 28.4],
        'lps_ne' => ['Pojok Timur Laut Gedung LPS', 87.4, 28.4],
        'lps_sw' => ['Pojok Barat Daya Gedung LPS', 73.0, 55.5],
        'lps_s' => ['Pintu Selatan Gedung LPS', 80.3, 55.5],
        'lps_se' => ['Pojok Tenggara Gedung LPS', 87.4, 55.5],

        's_w' => ['Pertigaan Selatan Aula', 44.3, 70.0],
        's_c' => ['Pojok Barat Daya Gedung APHP-DKV', 52.2, 70.0],
        's_pond' => ['Pojok Taman Kolam', 56.5, 70.0],
        's_e1' => ['Pojok Tenggara Gedung APHP-DKV', 73.0, 70.0],
        's_e2' => ['Depan Taman TEFA', 80.0, 70.0],
        's_e3' => ['Ujung Selatan Parkir Motor Siswa', 87.4, 70.0],
        'b_pastry' => ['Depan Lab Pastry', 56.5, 89.6],
        'b_aphp' => ['Depan APHP Lab', 80.0, 89.6],
        'tefa_door' => ['Depan TEFA Laboratory', 88.3, 89.6],
    ];

    /** [nama jalur, ...kode node berurutan] — tiap pasangan berurutan menjadi satu ruas. */
    public const PATHS = [
        ['Jalan Depan Parkir Motor', 'n_w', 'n_rplw', 'gate', 'n_e'],
        ['Jalan Samping Pos Satpam', 'n_e', 'rpl_ne'],
        ['Halaman Depan Gedung RPL', 'rpl_nw', 'rpl_n', 'rpl_ne'],
        ['Lorong Gedung RPL', 'rpl_n', 'rpl_s'],
        ['Jalan Barat Gedung RPL', 'n_rplw', 'rpl_nw', 'mus_e', 'rpl_sw', 'lib_e'],
        ['Jalan Selatan Gedung RPL', 'rpl_sw', 'c_sw', 'rpl_s', 'c_w'],
        ['Jalan Barat Musholla', 'n_w', 'w_gap', 'mus_w'],
        ['Jalan Depan Musholla', 'wb_s', 'w_s', 'mus_w', 'mus_door', 'mus_e'],
        ['Lorong Gedung Barat', 'wb_n', 'wb_s'],
        ['Halaman Lab Kuliner', 'w_gap', 'w_court', 'w_s'],
        ['Jalan Samping Lapangan Olahraga', 'w_s', 'w_lib', 'w_kul'],
        ['Jalan Depan Perpustakaan', 'w_lib', 'lib_door', 'lib_e', 'aula_ne'],
        ['Jalan Timur Aula', 'c_sw', 'aula_ne', 's_w', 'kul_e'],
        ['Jalan Depan Kelas Kuliner', 'w_kul', 'kul_e'],
        ['Plaza Gedung Utama', 'gu_w', 'gu_door', 'gu_e'],
        ['Jalan Barat Plaza', 'gu_w', 'pl_sw'],
        ['Jalan Selatan Plaza', 'c_n', 'pl_sw'],
        ['Jalan Barat Gedung APHP-DKV', 'c_n', 'c_w', 'aphp_w', 's_c'],
        ['Lorong Gedung APHP-DKV', 'aphp_w', 'aphp_e'],
        ['Jalan Timur Gedung APHP-DKV', 'ne_x', 'lps_nw', 'gu_e', 'lps_sw', 'aphp_e', 's_e1'],
        ['Jalan Belakang Gedung Utama', 'n_e', 'gu_bw', 'gu_be', 'gu_ne', 'bkk_w', 'ne_bkk'],
        ['Jalan Depan BKK & Toko Sekolah', 'ne_bkk', 'ne_x', 'ne_e'],
        ['Halaman Depan Gedung LPS', 'lps_nw', 'lps_n', 'lps_ne'],
        ['Lorong Gedung LPS-DKV', 'lps_n', 'lps_s'],
        ['Jalan Selatan Gedung LPS', 'lps_sw', 'lps_s', 'lps_se'],
        ['Jalan Parkir Motor Siswa', 'ne_e', 'lps_ne', 'lps_se', 's_e3'],
        ['Jalan Tengah Selatan', 's_w', 's_c', 's_pond', 's_e1', 's_e2', 's_e3'],
        ['Jalan Barat Lab Pastry', 's_pond', 'b_pastry'],
        ['Jalan Barat TEFA Laboratory', 's_e2', 'b_aphp'],
        ['Jalan Depan Kantin', 'b_pastry', 'b_aphp', 'tefa_door'],
    ];

    /**
     * Ruangan yang pintunya harus lewat node tertentu (bukan sembarang sisi terdekat).
     * slug ruangan => kode node.
     */
    public const DOORS = [
        'gerbang-utama' => 'gate',
        'kantor-pusat' => 'gu_door',
        'bkk' => 'bkk_w',
        'musholla' => 'mus_door',
        'perpustakaan' => 'lib_door',
        'x-rpl-1' => 'lib_door',
        'lab-tefa' => 'tefa_door',
    ];

    /** @var array<string, int> kode node => id */
    public array $nodeIds = [];

    public function run(): void
    {
        $width = (float) config('map.width_meters', 200);
        $metersPerX = $width / 100;
        $metersPerY = $width * (float) config('map.image_aspect', 752 / 1540) / 100;

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
