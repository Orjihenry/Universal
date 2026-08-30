<?php

namespace App\Actions\Admin;

use App\Enums\SalesPeriod;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class GetDashboardStats
{
    /**
     * @return array{
     *     todaysOrders: int,
     *     todaysRevenue: string,
     *     pendingOrders: int,
     *     ordersReadyForPickup: int,
     *     totalCustomers: int,
     *     productsAvailable: int,
     *     salesPeriod: string,
     *     salesPeriodLabel: string,
     *     salesOverview: list<array{date: string, label: string, revenue: string}>
     * }
     */
    public function __invoke(SalesPeriod $period = SalesPeriod::Weekly): array
    {
        return [
            'todaysOrders' => Order::query()->placedToday()->count(),
            'todaysRevenue' => number_format((float) Order::query()->placedToday()->billable()->sum('total'), 2, '.', ''),
            'pendingOrders' => Order::query()->pending()->count(),
            'ordersReadyForPickup' => Order::query()->readyForPickup()->count(),
            'totalCustomers' => User::query()->role('user')->count(),
            'productsAvailable' => Product::query()->available()->count(),
            'salesPeriod' => $period->value,
            'salesPeriodLabel' => $period->label(),
            'salesOverview' => $this->salesOverview($period),
        ];
    }

    /**
     * @return list<array{date: string, label: string, revenue: string}>
     */
    private function salesOverview(SalesPeriod $period): array
    {
        $buckets = $this->buckets($period);

        $totals = Order::query()
            ->billable()
            ->where('created_at', '>=', $buckets->first()['start'])
            ->get(['total', 'created_at'])
            ->groupBy(fn (Order $order): string => $this->bucketKey($order->created_at, $period))
            ->map(fn (Collection $orders): float => (float) $orders->sum('total'));

        return $buckets
            ->map(fn (array $bucket): array => [
                'date' => $bucket['key'],
                'label' => $bucket['label'],
                'revenue' => number_format((float) ($totals->get($bucket['key']) ?? 0), 2, '.', ''),
            ])
            ->values()
            ->all();
    }

    /**
     * @return Collection<int, array{key: string, label: string, start: CarbonInterface}>
     */
    private function buckets(SalesPeriod $period): Collection
    {
        return match ($period) {
            SalesPeriod::Weekly => collect(range(6, 0))->map(function (int $daysAgo): array {
                $day = now()->subDays($daysAgo)->startOfDay();

                return [
                    'key' => $day->toDateString(),
                    'label' => $day->format('D'),
                    'start' => $day,
                ];
            }),
            SalesPeriod::Monthly => collect(range(11, 0))->map(function (int $monthsAgo): array {
                $month = now()->subMonths($monthsAgo)->startOfMonth();

                return [
                    'key' => $month->format('Y-m'),
                    'label' => $month->format('M'),
                    'start' => $month,
                ];
            }),
            SalesPeriod::Quarterly => collect(range(3, 0))->map(function (int $quartersAgo): array {
                $quarter = now()->startOfQuarter()->subQuarters($quartersAgo);

                return [
                    'key' => $quarter->year.'-Q'.$quarter->quarter,
                    'label' => 'Q'.$quarter->quarter,
                    'start' => $quarter,
                ];
            }),
            SalesPeriod::Yearly => collect(range(4, 0))->map(function (int $yearsAgo): array {
                $year = now()->subYears($yearsAgo)->startOfYear();

                return [
                    'key' => (string) $year->year,
                    'label' => (string) $year->year,
                    'start' => $year,
                ];
            }),
        };
    }

    private function bucketKey(CarbonInterface $date, SalesPeriod $period): string
    {
        return match ($period) {
            SalesPeriod::Weekly => $date->toDateString(),
            SalesPeriod::Monthly => $date->format('Y-m'),
            SalesPeriod::Quarterly => $date->year.'-Q'.$date->quarter,
            SalesPeriod::Yearly => (string) $date->year,
        };
    }
}
