<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function unpaid(Request $request)
    {
        // Base query: All clients
        $query = User::role('client')->with(['coach', 'payments' => function ($q) {
            $q->latest();
        }]);

        // 1. Advanced Search Filtering
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 2. Financial Status Filtering
        $status = $request->input('status', 'all');

        if ($status === 'paid') {
            // Has a completed payment in the last 30 days
            $query->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays(30));
            });
        } elseif ($status === 'unpaid') {
            // Does NOT have a completed payment in the last 30 days
            $query->whereDoesntHave('payments', function ($q) {
                $q->where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays(30));
            });
        }

        // 3. Global Dashboard Statistics (Calculated independently of search filters)
        $allClientsCount = User::role('client')->count();
        $paidClientsCount = User::role('client')->whereHas('payments', function ($q) {
            $q->where('status', 'completed')
                ->where('created_at', '>=', now()->subDays(30));
        })->count();
        $unpaidClientsCount = $allClientsCount - $paidClientsCount;

        return Inertia::render('Admin/Payments/Unpaid', [
            'users' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total_clients' => $allClientsCount,
                'paid_clients' => $paidClientsCount,
                'unpaid_clients' => $unpaidClientsCount,
                'estimated_revenue' => $unpaidClientsCount * 300, // Assuming 300 MAD/month
                'collected_revenue' => $paidClientsCount * 300,
            ],
        ]);
    }
}
