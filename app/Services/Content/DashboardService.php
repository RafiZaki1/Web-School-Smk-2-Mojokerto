<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Contracts\Interfaces\AspirationRepositoryInterface;
use App\Contracts\Interfaces\BaseRepositoryInterface;
use App\Contracts\Interfaces\DashboardServiceInterface;
use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Models\JobVacancy;
use Illuminate\Database\Eloquent\Model;

class DashboardService implements DashboardServiceInterface
{
    public function __construct(
        protected MajorRepositoryInterface $majors,
        protected AchievementRepositoryInterface $achievements,
        protected ExtracurricularRepositoryInterface $extracurriculars,
        protected ArticleRepositoryInterface $articles,
        protected JobVacancyRepositoryInterface $jobs,
        protected AspirationRepositoryInterface $aspirations,
    ) {}

    public function summary(): array
    {
        return [
            'stats' => [
                'majors' => $this->majors->count(),
                'achievements' => $this->achievements->count(),
                'extracurriculars' => $this->extracurriculars->count(),
                'articles' => $this->articles->count(),
                'jobs' => $this->jobs->count(['status' => JobVacancy::STATUS_OPEN]),
            ],
            'drafts' => [
                'majors' => $this->majors->count(['is_published' => false]),
                'achievements' => $this->achievements->count(['is_published' => false]),
                'extracurriculars' => $this->extracurriculars->count(['is_published' => false]),
                'articles' => $this->articles->count(['is_published' => false]),
            ],
            'aspirations' => $this->aspirations->countByStatus(),
            'activities' => $this->activities(),
        ];
    }

    /** Gabungan perubahan terbaru dari semua modul, terbaru di atas. */
    protected function activities(int $limit = 6): array
    {
        $sources = [
            ['repo' => $this->achievements, 'module' => 'Prestasi', 'icon' => 'trophy', 'label' => fn (Model $m) => "Prestasi \"{$m->title}\""],
            ['repo' => $this->articles, 'module' => 'Berita & Artikel', 'icon' => 'news', 'label' => fn (Model $m) => "Berita \"{$m->title}\""],
            ['repo' => $this->jobs, 'module' => 'Loker & BKK', 'icon' => 'briefcase', 'label' => fn (Model $m) => "Lowongan {$m->title} — {$m->company}"],
            ['repo' => $this->majors, 'module' => 'Jurusan', 'icon' => 'graduation', 'label' => fn (Model $m) => "Data jurusan {$m->code}"],
            ['repo' => $this->extracurriculars, 'module' => 'Ekstrakurikuler', 'icon' => 'run', 'label' => fn (Model $m) => "Ekstrakurikuler {$m->name}"],
        ];

        return collect($sources)
            ->flatMap(fn (array $source) => $this->mapActivities($source['repo'], $source, $limit))
            ->sortByDesc('timestamp')
            ->take($limit)
            ->map(fn (array $item) => collect($item)->except('timestamp')->all())
            ->values()
            ->all();
    }

    protected function mapActivities(BaseRepositoryInterface $repository, array $source, int $limit): array
    {
        return $repository->latestUpdated($limit)->map(function (Model $model) use ($source) {
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
