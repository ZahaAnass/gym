<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(['completed', 'completed', 'completed', 'failed']); // Majoritairement complétés

        return [
            'stripe_payment_intent_id' => 'pi_' . $this->faker->lexify('?????????????????'), // Simulation d'ID Stripe
            'amount' => $this->faker->randomElement([29.99, 49.99, 99.00, 299.00]), // Forfaits Basique, Pro, Premium, Annuel
            'method' => $this->faker->randomElement(['stripe', 'stripe', 'cash']),
            'installment_number' => $this->faker->randomElement([1, 3, 12]), // 1 mois, 3 mois, ou 1 an
            'status' => $status,
            'paid_at' => $status === 'completed' ? $this->faker->dateTimeBetween('-4 months', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-5 months', 'now'),
        ];
    }
}
