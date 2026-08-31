<?php

namespace App\Actions\Admin;

use App\Models\Business;
use App\Models\Order;
use App\Models\Product;
use App\Support\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GetDashboardAttention
{
    private const ITEM_LIMIT = 5;

    /**
     * @return array{
     *     pendingBusinesses: array{count: int, items: list<array<string, mixed>>},
     *     unavailableProducts: array{count: int, items: list<array<string, mixed>>},
     *     pendingOrders: array{count: int, items: list<array<string, mixed>>}
     * }
     */
    public function __invoke(): array
    {
        return [
            'pendingBusinesses' => $this->queue(
                Business::query()->awaitingApproval()->latest(),
                fn (Business $business): array => [
                    'id' => $business->id,
                    'title' => $business->name,
                ],
            ),
            'unavailableProducts' => $this->queue(
                Product::query()->unavailable()->latest(),
                fn (Product $product): array => [
                    'id' => $product->id,
                    'title' => $product->name,
                ],
            ),
            'pendingOrders' => $this->queue(
                Order::query()->pending()->with('user:id,name')->latest(),
                fn (Order $order): array => [
                    'id' => $order->id,
                    'title' => $order->user->name,
                    'meta' => Money::format($order->total),
                ],
            ),
        ];
    }

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     * @param  callable(TModel): array<string, mixed>  $map
     * @return array{count: int, items: list<array<string, mixed>>}
     */
    private function queue(Builder $query, callable $map): array
    {
        return [
            'count' => (clone $query)->count(),
            'items' => $query->limit(self::ITEM_LIMIT)->get()->map($map)->values()->all(),
        ];
    }
}
