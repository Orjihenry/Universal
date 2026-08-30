<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BusinessStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBusinessRequest;
use App\Models\Business;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BusinessController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/businesses/index', [
            'summary' => [
                'total' => Business::query()->count(),
                'pending' => Business::query()->pending()->count(),
                'approved' => Business::query()->approved()->count(),
                'suspended' => Business::query()->suspended()->count(),
            ],
            'businesses' => Business::query()
                ->active()
                ->latest()
                ->get()
                ->map(fn (Business $business): array => $this->businessPayload($business)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/businesses/create', [
            'types' => collect(Business::TYPES)
                ->map(fn (string $type): array => [
                    'value' => $type,
                    'label' => Str::headline($type),
                ])
                ->all(),
        ]);
    }

    public function store(StoreBusinessRequest $request): RedirectResponse
    {
        $business = new Business($request->validated());
        $business->createdBy()->associate($request->user());
        $business->status = BusinessStatus::Approved;
        $business->approvedBy()->associate($request->user());
        $business->approved_at = now();
        $business->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business created.')]);

        return to_route('admin-businesses');
    }

    public function show(Business $business): Response
    {
        return Inertia::render('admin/businesses/show', [
            'business' => $this->businessPayload($business),
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     email: string,
     *     phone: string,
     *     type: string,
     *     typeLabel: string,
     *     status: string,
     *     statusLabel: string
     * }
     */
    private function businessPayload(Business $business): array
    {
        return [
            'id' => $business->id,
            'name' => $business->name,
            'email' => $business->email,
            'phone' => $business->phone,
            'type' => $business->business_type,
            'typeLabel' => Str::headline($business->business_type),
            'status' => $business->status->value,
            'statusLabel' => Str::headline($business->status->value),
        ];
    }
}
