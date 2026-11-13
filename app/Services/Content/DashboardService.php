<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Contracts\Interfaces\BaseRepositoryInterface;
use App\Contracts\Interfaces\DashboardServiceInterface;
use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Contracts\Interfaces\MajorQuizSubmissionRepositoryInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Enums\JobVacancyStatusEnum;
use Illuminate\Database\Eloquent\Model;

class DashboardService implements DashboardServiceInterface
{
    /**
     * Inisialisasi DashboardService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MajorRepositoryInterface $majors,
        protected AchievementRepositoryInterface $achievements,
        protected ExtracurricularRepositoryInterface $extracurriculars,
        protected ArticleRepositoryInterface $articles,
        protected JobVacancyRepositoryInterface $jobs,
        protected MajorQuizSubmissionRepositoryInterface $quizSubmissions,
    ) {}

    /**
     * Susun ringkasan dashboard admin: jumlah konten, draf, kuis, dan aktivitas terbaru.
     * Menggunakan agregasi tunggal per tabel agar hemat query dan ringan.
     *
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $majors = $this->majors->countPublishSummary();
        $achievements = $this->achievements->countPublishSummary();
        $extracurriculars = $this->extracurriculars->countPublishSummary();
        $articles = $this->articles->countPublishSummary();

        return [
            'stats' => [
                'majors' => $majors['total'],
                'achievements' => $achievements['total'],
                'extracurriculars' => $extracurriculars['total'],
                'articles' => $articles['total'],
                'jobs' => $this->jobs->count(['status' => JobVacancyStatusEnum::OPEN->value]),
            ],
            'drafts' => [
                'majors' => $majors['drafts'],
                'achievements' => $achievements['drafts'],
                'extracurriculars' => $extracurriculars['drafts'],
                'articles' => $articles['drafts'],
            ],
            'major_quiz' => $this->quizSubmissions->countByStatus(),
            'activities' => $this->activities(),
        ];
    }

    /**
     * Gabungkan perubahan terbaru dari seluruh modul, terbaru di atas.
     * Hanya mengambil kolom ringkas tanpa memuat kolom teks besar/JSON.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function activities(int $limit = 6): array
    {
        $sources = [
            [
                'repo' => $this->achievements,
                'module' => 'Prestasi',
                'icon' => 'trophy',
                'columns' => ['id', 'title', 'created_at', 'updated_at'],
                'label' => fn (Model $m) => "Prestasi \"{$m->title}\"",
            ],
            [
                'repo' => $this->articles,
                'module' => 'Berita & Artikel',
                'icon' => 'news',
                'columns' => ['id', 'title', 'created_at', 'updated_at'],
                'label' => fn (Model $m) => "Berita \"{$m->title}\"",
            ],
            [
                'repo' => $this->jobs,
                'module' => 'Loker & BKK',
                'icon' => 'briefcase',
                'columns' => ['id', 'title', 'company', 'created_at', 'updated_at'],
                'label' => fn (Model $m) => "Lowongan {$m->title} — {$m->company}",
            ],
            [
                'repo' => $this->majors,
                'module' => 'Jurusan',
                'icon' => 'graduation',
                'columns' => ['id', 'code', 'created_at', 'updated_at'],
                'label' => fn (Model $m) => "Data jurusan {$m->code}",
            ],
            [
                'repo' => $this->extracurriculars,
                'module' => 'Ekstrakurikuler',
                'icon' => 'run',
                'columns' => ['id', 'name', 'created_at', 'updated_at'],
                'label' => fn (Model $m) => "Ekstrakurikuler {$m->name}",
            ],
        ];

        return collect($sources)
            ->flatMap(fn (array $source) => $this->mapActivities($source['repo'], $source, $limit))
            ->sortByDesc('timestamp')
            ->take($limit)
            ->map(fn (array $item) => collect($item)->except('timestamp')->all())
            ->values()
            ->all();
    }

    /**
     * Ubah model terbaru dari satu modul menjadi item aktivitas.
     *
     * @param  array<string, mixed>  $source
     * @return array<int, array<string, mixed>>
     */
    protected function mapActivities(BaseRepositoryInterface $repository, array $source, int $limit): array
    {
        $columns = $source['columns'] ?? ['*'];

        return $repository->latestUpdated($limit, $columns)->map(function (Model $model) use ($source) {
            $isNew = $model->created_at?->equalTo($model->updated_at);

            return [
                'icon' => $source['icon'],
                'module' => $source['module'],
                'text' => $source['label']($model).($isNew ? ' ditambahkan' : ' diperbarui'),
                'time' => $model->updated_at?->locale('id')->diffForHumans(),
                'timestamp' => $model->updated_at?->getTimestamp() ?? 0,
            ];
        })->all();
    }
}
