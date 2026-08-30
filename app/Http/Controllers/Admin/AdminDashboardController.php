<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\GetDashboardAttention;
use App\Actions\Admin\GetDashboardStats;
use App\Enums\SalesPeriod;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request, GetDashboardStats $stats, GetDashboardAttention $attention): Response
    {
        $period = SalesPeriod::tryFrom((string) $request->query('sales', SalesPeriod::Weekly->value))
            ?? SalesPeriod::Weekly;

        return Inertia::render('admin/dashboard', [
            'stats' => $stats($period),
            'attention' => $attention(),
        ]);
    }
}
