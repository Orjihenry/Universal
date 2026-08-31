<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);

        $orders = $request->user()
            ->orders()
            ->select(['id', 'user_id', 'status', 'total', 'created_at'])
            ->latest()
            ->get();

        return Inertia::render('orders/index', [
            'summary' => [
                'total' => $orders->count(),
                'pending' => $orders->where('status', OrderStatus::Pending)->count(),
                'readyForPickup' => $orders->where('status', OrderStatus::ReadyForPickup)->count(),
                'completed' => $orders->where('status', OrderStatus::Completed)->count(),
            ],
            'orders' => $orders
                ->map(fn (Order $order): array => $this->orderPayload($order))
                ->values(),
        ]);
    }

    public function show(Order $order): Response
    {
        Gate::authorize('view', $order);

        return Inertia::render('orders/show', [
            'order' => $this->orderPayload($order),
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     total: string,
     *     status: string,
     *     statusLabel: string,
     *     placedAt: string
     * }
     */
    private function orderPayload(Order $order): array
    {
        return [
            'id' => $order->id,
            'total' => $order->total,
            'status' => $order->status->value,
            'statusLabel' => Str::headline($order->status->value),
            'placedAt' => $order->created_at?->format('M j, Y g:i A') ?? '',
        ];
    }
}
