<?php

namespace App\Contracts\Interfaces;

use App\Models\Major;
use Illuminate\Support\Collection;

interface MajorQuizMatcherInterface
{
    /**
     * Nilai tiap jawaban teks bebas terhadap tiap jurusan: 2 = sangat berkaitan,
     * 1 = sedikit berkaitan, 0 = tidak berkaitan. Persentase dihitung dari poin ini.
     *
     * @param  array<int, array{question_id:int, question:string, answer:string}>  $answers
     * @param  Collection<int, Major>  $majors
     * @return array{method:string, answer_points:array<int,array<string,int>>, reasons:array<string,?string>, analysis:?string}
     */
    public function match(array $answers, Collection $majors): array;
}
