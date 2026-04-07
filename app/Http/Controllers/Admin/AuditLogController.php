<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        // 1. Advanced Search (By URL or Username)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('url', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // 2. Status Filtering
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // 3. HTTP Method Filtering
        if ($request->has('method') && $request->method !== 'all') {
            $query->where('http_method', $request->method);
        }

        // 🔥 ENTERPRISE UPGRADE: Cache system health metrics for 5 minutes
        $stats = Cache::remember('admin:logs:metrics', 300, function () {
            $today = now()->startOfDay();

            return [
                'total_today' => AuditLog::where('created_at', '>=', $today)->count(),
                'errors_today' => AuditLog::where('created_at', '>=', $today)->where('status', 'error')->count(),
                'total_all_time' => AuditLog::count(),
            ];
        });

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $query->latest()->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'method']),
            'stats' => $stats,
        ]);
    }
}
