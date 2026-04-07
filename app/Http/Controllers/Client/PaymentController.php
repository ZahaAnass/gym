<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $payments = $user->payments()->latest()->get();
        $latestPayment = $payments->where('status', 'completed')->first();

        // Default to Locked for brand new users
        $status = 'Locked';
        $expiresAt = null;
        $graceEndsAt = null;

        if ($latestPayment) {
            $expiresAt = Carbon::parse($latestPayment->paid_at)->addMonths($latestPayment->installment_number);
            $graceEndsAt = $expiresAt->copy()->addDays(10);

            if (now()->lessThanOrEqualTo($expiresAt)) {
                $status = 'Active';
            } elseif (now()->lessThanOrEqualTo($graceEndsAt)) {
                $status = 'Grace Period';
            }
        }

        return Inertia::render('Client/Payments/Index', [
            'payments' => $payments,
            'subscription' => [
                'status' => $status,
                'expires_at' => $expiresAt ? $expiresAt->format('M d, Y') : 'Never',
                'grace_ends_at' => $graceEndsAt ? $graceEndsAt->format('M d, Y') : null,
                'days_left_in_grace' => $status === 'Grace Period' ? now()->diffInDays($graceEndsAt) : 0,
            ],
        ]);
    }

    public function processStripe(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'months' => 'required|integer|in:1,3,12',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        // 🔥 Changed 'status' => 'pending' to 'failed' because pending was removed from DB
        $payment = $request->user()->payments()->create([
            'amount' => $validated['amount'],
            'method' => 'stripe',
            'status' => 'failed',
            'installment_number' => $validated['months'],
            'paid_at' => null,
        ]);

        $planName = $validated['months'] === 12 ? 'Annual Plan' : ($validated['months'] === 3 ? 'Quarterly Plan' : 'Monthly Plan');

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => 'AI Gym Membership - '.$planName,
                        'description' => $validated['months'].' month(s) of premium gym access.',
                    ],
                    'unit_amount' => $validated['amount'] * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('client.payments.success').'?session_id={CHECKOUT_SESSION_ID}&payment_id='.$payment->id,
            'cancel_url' => route('client.payments.cancel').'?payment_id='.$payment->id,
        ]);

        $payment->update(['stripe_payment_intent_id' => $session->id]);

        return Inertia::location($session->url);
    }

    /**
     * User returns here AFTER successfully paying on Stripe
     */
    public function success(Request $request)
    {
        $payment = Payment::findOrFail($request->payment_id);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        // Verify with Stripe that they actually paid
        $session = Session::retrieve($request->session_id);

        if ($session->payment_status === 'paid') {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            Cache::forget('admin:financial_stats');

            return redirect()->route('client.payments.index')->with('success', 'Stripe Payment successful! Your subscription is now active.');
        }

        return redirect()->route('client.payments.index')->with('error', 'Payment could not be verified.');
    }

    /**
     * User clicked the "Back" button on the Stripe page
     */
    public function cancel(Request $request)
    {
        $payment = Payment::findOrFail($request->payment_id);
        $payment->update(['status' => 'failed']);

        return redirect()->route('client.payments.index')->with('error', 'Stripe checkout was cancelled.');
    }

    public function downloadInvoice(Payment $payment, Request $request)
    {
        abort_if($payment->user_id !== $request->user()->id, 403, 'Unauthorized access to this invoice.');

        return view('invoices.template', [
            'payment' => $payment,
            'user' => $request->user(),
            'date' => $payment->paid_at ? Carbon::parse($payment->paid_at)->format('F d, Y') : 'Pending',
            'invoice_number' => 'INV-'.str_pad($payment->id, 6, '0', STR_PAD_LEFT),
        ]);
    }
}
