<?php

namespace App\Services\LandingPage\Map;

use App\Models\Room;

class MapDirectionsBuilder
{
    /**
     * Inisialisasi MapDirectionsBuilder dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapGeometry $geometry,
        protected MapLandmarkFinder $landmarks,
        protected MapPhrases $phrases,
        protected MapPolylineBuilder $polyline,
    ) {}

    /**
     * Ringkas leg menjadi petunjuk arah: keluar ruangan, belokan di sepanjang koridor, lalu tiba.
     *
     * @param  array<int, array<string, mixed>>  $legs
     * @return array<int, array<string, mixed>>
     */
    public function build(array $legs, Room $origin, Room $destination, MapGraph $graph): array
    {
        $rooms = $this->landmarks->landmarkRooms([$origin->id, $destination->id]);
        $originCenter = $legs[0]['from'];
        $destinationCenter = end($legs)['to'];
        $arrivalIndex = count($legs);

        $legs = $this->polyline->collapseJogs($legs);
        $corridorLegs = array_keys(array_filter($legs, fn (array $leg) => $leg['corridor']));

        $steps = $corridorLegs
            ? $this->corridorSteps($legs, $corridorLegs, $origin, $originCenter, $rooms, $graph)
            : [$this->step('depart', "Keluar dari {$origin->name}", $this->phrases->sentence([$this->walkPhrase($legs[0], [])]), $legs[0]['length'], $originCenter, 0)];

        $last = $corridorLegs ? $legs[end($corridorLegs)] : $legs[0];
        $side = $this->turnBetween($last['dir'], $this->geometry->vector($last['to'], $destinationCenter));
        $steps[] = $this->step(
            'arrive',
            "Tiba di {$destination->name}",
            "{$destination->name} ada {$this->phrases->sidePhrase($side)}.",
            0,
            $destinationCenter,
            $arrivalIndex
        );

        return array_map(fn (array $step, int $i) => ['index' => $i + 1, ...$step], $steps, array_keys($steps));
    }

    /**
     * Langkah keluar ruangan lalu belokan di setiap persimpangan sepanjang koridor.
     *
     * @param  array<int, array<string, mixed>>  $legs
     * @param  array<int, int>  $corridorLegs
     * @param  array{x: float, y: float}  $originCenter
     * @param  array<int, array<string, mixed>>  $rooms
     * @return array<int, array<string, mixed>>
     */
    private function corridorSteps(array $legs, array $corridorLegs, Room $origin, array $originCenter, array $rooms, MapGraph $graph): array
    {
        $first = $corridorLegs[0];
        $lastCorridor = end($corridorLegs);
        $steps = [$this->departureStep($legs, $first, $origin, $originCenter, $rooms)];

        for ($i = $first + 1; $i <= $lastCorridor; $i++) {
            $steps[] = $this->turnStep($legs, $i, $rooms, $graph);
        }

        return $steps;
    }

    /**
     * Langkah keluar dari ruangan asal, termasuk belokan pertama menuju koridor.
     *
     * @param  array<int, array<string, mixed>>  $legs
     * @param  array{x: float, y: float}  $originCenter
     * @param  array<int, array<string, mixed>>  $rooms
     * @return array<string, mixed>
     */
    private function departureStep(array $legs, int $first, Room $origin, array $originCenter, array $rooms): array
    {
        $exitLength = array_sum(array_column(array_slice($legs, 0, $first), 'length'));
        $corridor = $legs[$first];
        $turn = $first > 0 ? $this->turnBetween($this->geometry->vector($originCenter, $corridor['from']), $corridor['dir']) : 'straight';

        $description = $turn === 'straight'
            ? $this->phrases->sentence([$this->walkPhrase($corridor, $rooms, true)])
            : $this->phrases->sentence([$this->phrases->turnPhrase($turn, $corridor), 'lalu '.$this->walkPhrase($corridor, $rooms)]);

        return $this->step('depart', "Keluar dari {$origin->name}", $description, $exitLength + $corridor['length'], $originCenter, 0);
    }

    /**
     * Langkah belokan di sebuah persimpangan sepanjang koridor.
     *
     * @param  array<int, array<string, mixed>>  $legs
     * @param  array<int, array<string, mixed>>  $rooms
     * @return array<string, mixed>
     */
    private function turnStep(array $legs, int $i, array $rooms, MapGraph $graph): array
    {
        $leg = $legs[$i];
        $turn = $this->turnBetween($legs[$i - 1]['dir'], $leg['dir']);
        $marker = $leg['marker'] ?? $leg['from'];
        $landmark = $this->landmarks->landmarkAt($marker, $graph);
        $walk = $this->walkPhrase($leg, $rooms);

        return [
            ...$this->step(
                $turn,
                $this->phrases->turnTitle($turn, $leg),
                $this->phrases->sentence([$landmark ? "Dari {$landmark}, {$walk}" : ucfirst($walk)]),
                $leg['length'],
                $marker,
                $leg['index']
            ),
            'landmark' => $landmark,
        ];
    }

    /**
     * Bentuk satu langkah petunjuk arah.
     *
     * @param  array{x: float, y: float}  $point
     * @return array<string, mixed>
     */
    private function step(string $type, string $title, string $description, float $distance, array $point, int $pathIndex): array
    {
        return [
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'distance' => (int) round($distance),
            'point' => $this->geometry->publicPoint($point),
            'path_index' => $pathIndex,
        ];
    }

    /**
     * Klasifikasi belokan dari vektor arah sebelumnya ke vektor arah berikutnya.
     *
     * @param  array{0: float, 1: float}  $v1
     * @param  array{0: float, 1: float}  $v2
     */
    private function turnBetween(array $v1, array $v2): string
    {
        $cross = $v1[0] * $v2[1] - $v1[1] * $v2[0];
        $dot = $v1[0] * $v2[0] + $v1[1] * $v2[1];
        $angle = rad2deg(atan2($cross, $dot));
        $abs = abs($angle);

        return match (true) {
            $abs < 30 => 'straight',
            $abs > 150 => 'u-turn',
            $abs < 60 => $angle > 0 ? 'slight-right' : 'slight-left',
            default => $angle > 0 ? 'turn-right' : 'turn-left',
        };
    }

    /**
     * Kalimat satu leg: jarak, arah mata angin, jalur yang disusuri, dan ruangan yang dilewati.
     *
     * @param  array<string, mixed>  $leg
     * @param  array<int, array<string, mixed>>  $rooms
     */
    private function walkPhrase(array $leg, array $rooms, bool $withFirstName = false): string
    {
        $phrase = 'jalan lurus '.$this->phrases->formatDistance($leg['length']).' ke arah '.$this->phrases->compass($leg);

        $names = $withFirstName ? $leg['names'] : array_slice($leg['names'], 1);

        if ($names) {
            $phrase .= ' menyusuri '.$this->phrases->joinNames(array_slice($names, 0, 2));
        }

        $passes = $this->landmarks->passingRooms($leg, $rooms);

        if ($passes) {
            $phrase .= ', melewati '.$this->phrases->joinNames($passes);
        }

        return $phrase;
    }
}
