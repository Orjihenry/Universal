<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserAudience;
use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(UserAudience $audience): Response
    {
        return Inertia::render('admin/users/index', [
            'audience' => $audience->value,
            'audienceLabel' => $audience->label(),
            'description' => $audience->description(),
            'emptyTitle' => $audience->emptyTitle(),
            'emptyDescription' => $audience->emptyDescription(),
            'summary' => [
                'customers' => User::query()->customers()->count(),
                'staff' => User::query()->staff()->count(),
                'admins' => User::query()->admins()->count(),
            ],
            'users' => User::query()
                ->select(['id', 'name', 'email', 'phone', 'created_at'])
                ->role($audience->roleNames())
                ->with('roles')
                ->withCount(['businesses', 'orders'])
                ->latest()
                ->get()
                ->map(fn (User $user): array => $this->userPayload($user)),
        ]);
    }

    public function show(UserAudience $audience, User $user): Response
    {
        abort_unless($user->hasAnyRole($audience->roleNames()), 404);

        $user->load([
            'roles',
            'businesses' => fn ($query) => $query
                ->latest()
                ->select(['id', 'name', 'status', 'created_by']),
        ]);
        $user->loadCount('orders');

        return Inertia::render('admin/users/show', [
            'audience' => $audience->value,
            'audienceLabel' => $audience->label(),
            'user' => [
                ...$this->userPayload($user),
                'businesses' => $user->businesses
                    ->map(fn (Business $business): array => [
                        'id' => $business->id,
                        'name' => $business->name,
                        'status' => $business->status->value,
                        'statusLabel' => Str::headline($business->status->value),
                    ])
                    ->values()
                    ->all(),
            ],
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     email: string,
     *     phone: string,
     *     role: string,
     *     roleLabel: string,
     *     businessesCount: int,
     *     ordersCount: int,
     *     joinedAt: string
     * }
     */
    private function userPayload(User $user): array
    {
        $role = $this->primaryRole($user);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $role,
            'roleLabel' => $this->roleLabel($role),
            'businessesCount' => $user->businesses_count ?? $user->businesses->count(),
            'ordersCount' => $user->orders_count ?? 0,
            'joinedAt' => $user->created_at?->format('M j, Y') ?? '',
        ];
    }

    private function primaryRole(User $user): string
    {
        $roles = $user->getRoleNames();

        foreach (['super_admin', 'admin', 'staff', 'user'] as $role) {
            if ($roles->contains($role)) {
                return $role;
            }
        }

        return $roles->first() ?? 'user';
    }

    private function roleLabel(string $role): string
    {
        return match ($role) {
            'user' => 'Customer',
            'staff' => 'Staff',
            'admin' => 'Admin',
            'super_admin' => 'Super Admin',
            default => Str::headline($role),
        };
    }
}
