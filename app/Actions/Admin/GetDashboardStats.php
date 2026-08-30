<?php

namespace App\Actions\Admin;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class GetDashboardStats
{
    /**
     * @return array{
     *     todaysOrders: int,
     *     todaysRevenue: string,
     *     pendingOrders: int,
     *     ordersReadyForPickup: int,
     *     totalCustomers: int,
     *     productsAvailable: int
     * }
     */
    public function __invoke(): array
    {
        return [
            'todaysOrders' => Order::query()->placedToday()->count(),
            'todaysRevenue' => number_format((float) Order::query()->placedToday()->billable()->sum('total'), 2, '.', ''),
            'pendingOrders' => Order::query()->pending()->count(),
            'ordersReadyForPickup' => Order::query()->readyForPickup()->count(),
            'totalCustomers' => User::query()->role('user')->count(),
            'productsAvailable' => Product::query()->available()->count(),
        ];
    }
}
