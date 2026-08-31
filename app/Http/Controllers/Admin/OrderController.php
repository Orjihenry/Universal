<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/orders/index', [
            'summary' => [
                'total' => Order::query()->count(),
                'pending' => Order::query()->pending()->count(),
                'readyForPickup' => Order::query()->readyForPickup()->count(),
                'completed' => Order::query()->completed()->count(),
            ],
            'orders' => Order::query()
                ->select(['id', 'user_id', 'status', 'total', 'created_at'])
                ->with('user:id,name,email')
                ->latest()
                ->get()
                ->map(fn (Order $order): array => $this->orderPayload($order)),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('user:id,name,email');

        return Inertia::render('admin/orders/show', [
            'order' => $this->orderPayload($order),
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     customerName: string,
     *     customerEmail: string,
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
            'customerName' => $order->user->name,
            'customerEmail' => $order->user->email,
            'total' => $order->total,
            'status' => $order->status->value,
            'statusLabel' => Str::headline($order->status->value),
            'placedAt' => $order->created_at?->format('M j, Y g:i A') ?? '',
        ];
    }
}
