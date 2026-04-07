<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\SystemBroadcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function unpaid(Request $request)
    {
        $query = User::role('client')->with(['coach', 'payments' => function ($q) {
            // Order payments so the modal shows newest first!
            $q->orderBy('paid_at', 'desc');
        }]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $status = $request->input('status', 'all');

        // 🔥 SQLITE COMPATIBLE QUERIES WITH NEW 'PAID THIS MONTH' FILTER
        if ($status === 'active') {
            $query->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months") >= ?', [now()]);
            });
        } elseif ($status === 'paid_this_month') {
            // NEW: Shows only users who have a completed payment in the current month/year
            $query->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereMonth('paid_at', now()->month)
                    ->whereYear('paid_at', now()->year);
            });
        } elseif ($status === 'grace') {
            $query->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months") < ?', [now()])
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months", "+10 days") >= ?', [now()]);
            });
        } elseif ($status === 'locked') {
            $query->whereDoesntHave('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months", "+10 days") >= ?', [now()]);
            });
        }

        $stats = Cache::remember('admin:financial_stats', 300, function () {
            $allClients = User::role('client')->count();

            $active = User::role('client')->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months") >= ?', [now()]);
            })->count();

            $grace = User::role('client')->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months") < ?', [now()])
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months", "+10 days") >= ?', [now()]);
            })->count();

            $locked = $allClients - $active - $grace;

            return [
                'total_clients' => $allClients,
                'active_clients' => $active,
                'grace_clients' => $grace,
                'locked_clients' => $locked,
                'estimated_revenue' => $locked * 300,
                // Ensure we only sum revenue collected in the current month
                'collected_revenue' => Payment::where('status', 'completed')
                    ->whereMonth('paid_at', now()->month)
                    ->whereYear('paid_at', now()->year)
                    ->sum('amount'),
            ];
        });

        return Inertia::render('Admin/Payments/Unpaid', [
            'users' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function sendReminder(User $user)
    {
        $user->notify(new SystemBroadcast(
            'Payment Required',
            'Your gym subscription requires immediate attention. Please process your payment online to avoid being locked out of the facility and dashboard.',
            'payment',
            route('client.payments.index'),
            'View Billing'
        ));

        return back()->with('success', "Automated reminder successfully queued for {$user->name}.");
    }

    public function markAsPaid(User $user, Request $request)
    {
        $months = $request->input('months', 1);
        $amount = $months === 12 ? 3000 : ($months === 3 ? 800 : 300);

        $user->payments()->create([
            'amount' => $amount,
            'method' => 'cash',
            'status' => 'completed',
            'installment_number' => $months,
            'paid_at' => now(),
        ]);

        Cache::forget('admin:financial_stats');

        return back()->with('success', "Payment logged successfully. Account is now Active for {$months} month(s).");
    }
}
