<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\SystemBroadcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentController extends Controller
{

    // 🔥 ENHANCEMENT 2: Export to CSV
    public function exportCsv(Request $request)
    {
        // Rebuild the same query without pagination
        $query = Payment::with('user:id,name,email')->latest('paid_at');

        if ($search = $request->input('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($status = $request->input('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        if ($method = $request->input('method') && $request->input('method') !== 'all') {
            $query->where('method', $request->input('method'));
        }

        $payments = $query->get();

        // Generate CSV Stream
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=financial_report_" . date('Y-m-d') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Transaction ID', 'Date', 'Client Name', 'Client Email', 'Amount', 'Payment Method', 'Status', 'Months Credited'];

        $callback = function () use ($payments, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($payments as $payment) {
                fputcsv($file, [
                    $payment->id,
                    $payment->paid_at ? \Carbon\Carbon::parse($payment->paid_at)->format('Y-m-d H:i') : 'N/A',
                    $payment->user->name ?? 'Deleted User',
                    $payment->user->email ?? 'N/A',
                    $payment->amount, // Export raw number for Excel sums
                    strtoupper($payment->method),
                    strtoupper($payment->status),
                    $payment->installment_number ?? 1
                ]);
            }
            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }

    // ... [KEEP YOUR EXISTING unpaid(), sendReminder(), and markAsPaid() METHODS HERE] ...

    public function unpaid(Request $request)
    {
        $query = User::role('client')->with(['coach', 'payments' => function ($q) {
            $q->orderBy('paid_at', 'desc');
        }]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $status = $request->input('status', 'all');

        if ($status === 'active') {
            $query->whereHas('payments', function ($q) {
                $q->where('status', 'completed')
                    ->whereRaw('datetime(paid_at, "+" || installment_number || " months") >= ?', [now()]);
            });
        } elseif ($status === 'paid_this_month') {
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
        Cache::forget('admin:payments:all_stats'); // Clear the new cache too

        return back()->with('success', "Payment logged successfully. Account is now Active for {$months} month(s).");
    }
}
