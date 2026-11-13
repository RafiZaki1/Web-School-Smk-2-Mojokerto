<?php

namespace App\Services\LandingPage\Map;

use SplPriorityQueue;

class MapPathFinder
{
    /**
     * Cari jalur terpendek dengan Dijkstra (priority queue) dari kandidat masuk asal ke kandidat masuk tujuan.
     * Jalan langsung di dalam satu ruas koridor yang sama diprioritaskan bila lebih pendek.
     *
     * @param  array<int, array<int, float>>  $graph
     * @param  array<int, array<string, mixed>>  $starts
     * @param  array<int, array<string, mixed>>  $ends
     * @return array{nodes: array<int, int>, start: int, end: int, direct: bool}|null
     */
    public function shortestPath(array $graph, array $starts, array $ends): ?array
    {
        $endLinks = $this->endLinks($ends);
        [$best, $bestEnd] = $this->directRoute($starts, $ends);

        $search = $this->search($graph, $starts, $endLinks, $best, $bestEnd);
        $chosen = $search['bestEnd'];

        if ($chosen === null) {
            return null;
        }

        if ($chosen['direct']) {
            return ['nodes' => [], 'start' => $chosen['start'], 'end' => $chosen['end'], 'direct' => true];
        }

        $path = [];

        for ($node = $chosen['node']; $node !== null; $node = $search['prev'][$node]) {
            array_unshift($path, $node);
        }

        return ['nodes' => $path, 'start' => $search['startOf'][$path[0]], 'end' => $chosen['end'], 'direct' => false];
    }

    /**
     * Biaya terbaik dari setiap node ke titik masuk tujuan.
     *
     * @param  array<int, array<string, mixed>>  $ends
     * @return array<int, array{0: float, 1: int}>
     */
    private function endLinks(array $ends): array
    {
        $endLinks = [];

        foreach ($ends as $index => $candidate) {
            foreach ($candidate['links'] as $node => $cost) {
                if ($cost < ($endLinks[$node][0] ?? INF)) {
                    $endLinks[$node] = [$cost, $index];
                }
            }
        }

        return $endLinks;
    }

    /**
     * Cari jalan langsung di ruas koridor yang sama antara kandidat asal dan tujuan.
     *
     * @param  array<int, array<string, mixed>>  $starts
     * @param  array<int, array<string, mixed>>  $ends
     * @return array{0: float, 1: array<string, mixed>|null}
     */
    private function directRoute(array $starts, array $ends): array
    {
        $best = INF;
        $bestEnd = null;

        foreach ($starts as $si => $start) {
            foreach ($ends as $ei => $end) {
                if ($start['edge'] && $end['edge'] && $start['edge']['id'] === $end['edge']['id']) {
                    $cost = $start['leg_cost'] + abs($start['t'] - $end['t']) * $start['edge']['weight'] + $end['leg_cost'];

                    if ($cost < $best) {
                        $best = $cost;
                        $bestEnd = ['direct' => true, 'start' => $si, 'end' => $ei, 'node' => null];
                    }
                }
            }
        }

        return [$best, $bestEnd];
    }

    /**
     * Jalankan Dijkstra dari seluruh kandidat asal sampai ditemukan titik tujuan dengan biaya terkecil.
     *
     * @param  array<int, array<int, float>>  $graph
     * @param  array<int, array<string, mixed>>  $starts
     * @param  array<int, array{0: float, 1: int}>  $endLinks
     * @param  array<string, mixed>|null  $bestEnd
     * @return array{bestEnd: array<string, mixed>|null, prev: array<int, int|null>, startOf: array<int, int>}
     */
    private function search(array $graph, array $starts, array $endLinks, float $best, ?array $bestEnd): array
    {
        [$dist, $prev, $startOf, $queue] = $this->seed($starts);

        while (! $queue->isEmpty()) {
            ['data' => $node, 'priority' => $priority] = $queue->extract();
            $d = -$priority;

            if ($d > ($dist[$node] ?? INF) + MapGeometry::EPS) {
                continue;
            }

            if ($d >= $best) {
                break;
            }

            if (isset($endLinks[$node]) && $d + $endLinks[$node][0] < $best) {
                $best = $d + $endLinks[$node][0];
                $bestEnd = ['direct' => false, 'start' => null, 'end' => $endLinks[$node][1], 'node' => $node];
            }

            foreach ($graph[$node] ?? [] as $neighbor => $weight) {
                $next = $d + $weight;

                if ($next < ($dist[$neighbor] ?? INF) - MapGeometry::EPS) {
                    $dist[$neighbor] = $next;
                    $prev[$neighbor] = $node;
                    $queue->insert($neighbor, -$next);
                }
            }
        }

        return ['bestEnd' => $bestEnd, 'prev' => $prev, 'startOf' => $startOf];
    }

    /**
     * Siapkan jarak awal, jejak node sebelumnya, asal kandidat, dan antrean dari seluruh node masuk asal.
     *
     * @param  array<int, array<string, mixed>>  $starts
     * @return array{0: array<int|string, float>, 1: array<int, int|null>, 2: array<int, int>, 3: SplPriorityQueue}
     */
    private function seed(array $starts): array
    {
        $dist = [];
        $prev = [];
        $startOf = [];

        $queue = new SplPriorityQueue;
        $queue->setExtractFlags(SplPriorityQueue::EXTR_BOTH);

        foreach ($starts as $index => $candidate) {
            foreach ($candidate['links'] as $node => $cost) {
                if ($cost < ($dist[$node] ?? INF)) {
                    $dist[$node] = $cost;
                    $prev[$node] = null;
                    $startOf[$node] = $index;
                    $queue->insert($node, -$cost);
                }
            }
        }

        return [$dist, $prev, $startOf, $queue];
    }
}
