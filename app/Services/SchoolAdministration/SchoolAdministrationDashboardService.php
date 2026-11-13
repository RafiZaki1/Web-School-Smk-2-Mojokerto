<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\AlumniServiceRequestRepositoryInterface;
use App\Contracts\Interfaces\GraduateRepositoryInterface;
use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Contracts\Interfaces\GuestMessageRepositoryInterface;
use App\Contracts\Interfaces\GuestVisitRepositoryInterface;
use App\Contracts\Interfaces\IndustryPartnerRepositoryInterface;
use App\Contracts\Interfaces\SchoolAdministrationDashboardServiceInterface;
use App\Enums\GuestMessageStatusEnum;
use App\Enums\GuestVisitStatusEnum;

class SchoolAdministrationDashboardService implements SchoolAdministrationDashboardServiceInterface
{
    /**
     * Inisialisasi SchoolAdministrationDashboardService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduationServiceInterface  $graduation
     * @param  GraduateRepositoryInterface  $graduates
     * @param  AlumniServiceRequestRepositoryInterface  $services
     * @param  GuestMessageRepositoryInterface  $messages
     * @param  GuestVisitRepositoryInterface  $visits
     * @param  IndustryPartnerRepositoryInterface  $partners
     */
    public function __construct(
        protected GraduationServiceInterface $graduation,
        protected GraduateRepositoryInterface $graduates,
        protected AlumniServiceRequestRepositoryInterface $services,
        protected GuestMessageRepositoryInterface $messages,
        protected GuestVisitRepositoryInterface $visits,
        protected IndustryPartnerRepositoryInterface $partners,
    ) {}

    /**
     * Kumpulkan angka kelulusan angkatan aktif, antrean layanan, buku tamu, dan mitra.
     *
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $status = $this->graduation->publicStatus();

        return [
            'graduation' => [
                ...$this->graduates->statusSummary((int) $status['active_year']),
                'active_year' => $status['active_year'],
                'mode' => $status['mode'],
                'is_open' => $status['is_open'],
                'release_at' => $status['release_at'],
            ],
            'alumni_services' => $this->services->statusCounts(),
            'guest_messages_new' => $this->messages->count(['status' => GuestMessageStatusEnum::NEW->value]),
            'guest_visits_upcoming' => $this->visits->filtered(['when' => 'upcoming', 'status' => GuestVisitStatusEnum::SCHEDULED->value])->count(),
            'industry_partners' => $this->partners->count(['is_active' => true]),
        ];
    }
}
