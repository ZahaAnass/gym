<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $hasActiveSubscription = true; // Default to true for admins/coaches

        // Check subscription status if it's a client
        if ($user && $user->hasRole('client')) {
            $latestPayment = $user->payments()->where('status', 'completed')->latest('paid_at')->first();
            if ($latestPayment) {
                $expiresAt = Carbon::parse($latestPayment->paid_at)->addMonths($latestPayment->installment_number);
                $gracePeriodEnd = $expiresAt->copy()->addDays(10);
                $hasActiveSubscription = now()->lessThanOrEqualTo($gracePeriodEnd);
            } else {
                $hasActiveSubscription = false;
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    // Add this line to send the roles to React!
                    'roles' => $request->user()->roles->pluck('name'),
                    'has_active_subscription' => $hasActiveSubscription,
                ]) : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
