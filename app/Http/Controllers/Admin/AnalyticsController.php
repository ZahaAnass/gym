<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        // 🚀 WOW FACTOR: Using Redis to cache heavy analytics queries for 10 minutes
        $stats = Cache::remember('admin:analytics:stats', 600, function () {

            // 1. Calculate Total Revenue (Completed Payments)
            $totalRevenue = Payment::where('status', 'completed')->sum('amount');

            // 2. Active Clients (Has a completed payment in the last 30 days)
            $activeClients = User::role('client')->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays(30));
            })->count();

            // 3. Generate Chart Data (Revenue over the last 6 months)
            $chartData = collect(range(5, 0))->map(function ($monthsAgo) {
                $date = now()->subMonths($monthsAgo);
                $monthStart = $date->copy()->startOfMonth();
                $monthEnd = $date->copy()->endOfMonth();

                $revenue = Payment::where('status', 'completed')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->sum('amount');

                return [
                    'name' => $date->format('M Y'),
                    'revenue' => (float) $revenue,
                ];
            })->values()->toArray();

            return [
                'total_revenue' => $totalRevenue,
                'active_clients' => $activeClients,
                'total_users' => User::count(),
                'chart_data' => $chartData,
            ];
        });

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => $stats,
        ]);
    }
}
