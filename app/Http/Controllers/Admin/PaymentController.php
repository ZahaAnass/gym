<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SystemBroadcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function unpaid(Request $request)
    {
        // Base query: All clients with their coach and LATEST payment history
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

        // 2. Bulletproof Financial Status Filtering
        $status = $request->input('status', 'all');

        if ($status === 'paid') {
            // Has a completed payment within the last 30 days
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

        // 3. Global Dashboard Statistics (Cached via Redis for Performance)
        $stats = Cache::remember('admin:financial_stats', 300, function () {
            $allClientsCount = User::role('client')->count();

            $paidClientsCount = User::role('client')->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays(30));
            })->count();

            $unpaidClientsCount = $allClientsCount - $paidClientsCount;

            return [
                'total_clients' => $allClientsCount,
                'paid_clients' => $paidClientsCount,
                'unpaid_clients' => $unpaidClientsCount,
                'estimated_revenue' => $unpaidClientsCount * 300, // Assuming 300 MAD/month
                'collected_revenue' => $paidClientsCount * 300,
            ];
        });

        return Inertia::render('Admin/Payments/Unpaid', [
            'users' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Send an automated reminder to a delinquent user via system notifications.
     */
    public function sendReminder(User $user)
    {
        $user->notify(new SystemBroadcast(
            'Payment Overdue Notice',
            'Your gym subscription is currently overdue. Please process your payment to maintain access to the facility and your AI programs.',
            'payment',
            route('client.payments.index'),
            'Pay Now'
        ));

        return back()->with('success', "Automated reminder successfully queued for {$user->name}.");
    }

    /**
     * Manually mark a delinquent user as paid (e.g. if they paid cash at the desk).
     */
    public function markAsPaid(User $user)
    {
        $user->payments()->create([
            'amount' => 300.00,
            'method' => 'cash',
            'status' => 'completed',
            'installment_number' => 1,
            'paid_at' => now(),
        ]);

        Cache::forget('admin:financial_stats');

        return back()->with('success', "Payment of 300 MAD manually logged for {$user->name}. Their account is now Active.");
    }
}
