<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function stats()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
                'active_clients' => User::role('client')->count(),
                'active_coaches' => User::role('coach')->count(),
                'system_errors' => AuditLog::where('status', 'error')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->count(),
            ],
            'recent_logs' => AuditLog::with('user')->latest()->take(5)->get(),
        ]);
    }
}
