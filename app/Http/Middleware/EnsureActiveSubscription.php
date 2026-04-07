<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;

class EnsureActiveSubscription
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Only apply these rules to Clients
        if ($user && $user->hasRole('client')) {

            // 1. Let them access the billing page so they can pay, and allow them to log out!
            if ($request->routeIs('client.payments.*') || $request->routeIs('logout')) {
                return $next($request);
            }

            // 2. Find their latest completed payment
            $latestPayment = $user->payments()->where('status', 'completed')->latest('paid_at')->first();

            // 3. New Account (Never paid) -> Lock out
            if (! $latestPayment) {
                return redirect()->route('client.payments.index')
                    ->with('error', 'Welcome! You must purchase a subscription plan to unlock your dashboard.');
            }

            // 4. Calculate exact expiration and grace period
            // We use 'installment_number' as the amount of months they paid for (1, 3, or 12)
            $expiresAt = Carbon::parse($latestPayment->paid_at)->addMonths($latestPayment->installment_number);
            $gracePeriodEnd = $expiresAt->copy()->addDays(10);

            // 5. If past grace period -> Lock out
            if (now()->greaterThan($gracePeriodEnd)) {
                return redirect()->route('client.payments.index')
                    ->with('error', 'Account Locked. Your grace period has ended. Please renew to regain access.');
            }
        }

        return $next($request);
    }
}
