<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\GetDashboardStats;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(GetDashboardStats $stats): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => $stats(),
        ]);
    }
}
