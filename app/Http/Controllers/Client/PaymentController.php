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
        $lastPayment = $payments->first();

        $isActive = $lastPayment && $lastPayment->status === 'completed' && $lastPayment->created_at->diffInDays(now()) <= 30;

        return Inertia::render('Client/Payments/Index', [
            'payments' => $payments,
            'subscription' => [
                'status' => $isActive ? 'Active' : 'Overdue',
                'next_billing_date' => $isActive ? $lastPayment->created_at->addDays(30)->format('M d, Y') : 'Immediate Action Required',
            ],
        ]);
    }

    /**
     * Redirect to REAL Stripe Checkout
     */
    public function processStripe(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'installment_number' => 'required|integer|min:1|max:3',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        // 1. Create a "Pending" payment in your database
        $payment = $request->user()->payments()->create([
            'amount' => $validated['amount'],
            'method' => 'stripe',
            'status' => 'pending',
            'installment_number' => $validated['installment_number'],
            'paid_at' => null,
        ]);

        // 2. Create the Real Stripe Checkout Session
        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'mad', // Moroccan Dirham!
                    'product_data' => [
                        'name' => 'AI Gym Membership - Installment '.$validated['installment_number'],
                        'description' => 'Premium gym access and AI workout generation.',
                    ],
                    'unit_amount' => $validated['amount'] * 100, // Stripe needs the amount in cents/centimes
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            // Tell Stripe where to send the user after they pay (or cancel)
            'success_url' => route('client.payments.success').'?session_id={CHECKOUT_SESSION_ID}&payment_id='.$payment->id,
            'cancel_url' => route('client.payments.cancel').'?payment_id='.$payment->id,
        ]);

        // Save the Stripe Session ID to verify it later
        $payment->update(['stripe_payment_intent_id' => $session->id]);

        // 3. Tell Inertia to safely redirect out of your React app into Stripe's hosted page
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
