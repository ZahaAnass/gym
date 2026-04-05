<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $payments = $user->payments()->latest()->get();
        $lastPayment = $payments->first();

        // Calculate subscription status for the frontend
        $isActive = $lastPayment && $lastPayment->status === 'completed' && $lastPayment->created_at->diffInDays(now()) <= 30;

        return Inertia::render('Client/Payments/Index', [
            'payments' => $payments,
            'subscription' => [
                'status' => $isActive ? 'Active' : 'Overdue',
                'next_billing_date' => $isActive ? $lastPayment->created_at->addDays(30)->format('M d, Y') : 'Immediate Action Required',
            ]
        ]);
    }

    public function processStripe(Request $request)
    {
        // For your presentation, this perfectly simulates a Stripe webhook/charge
        $request->validate([
            'amount' => 'required|numeric',
            'installment_number' => 'required|integer|min:1|max:3'
        ]);

        auth()->user()->payments()->create([
            'amount' => $request->amount,
            'method' => 'stripe',
            'status' => 'completed',
            'installment_number' => $request->installment_number,
            'paid_at' => now(),
            'stripe_payment_intent_id' => 'pi_mock_' . str()->random(16)
        ]);

        return back()->with('success', 'Payment successful! Your subscription is now active.');
    }
}
