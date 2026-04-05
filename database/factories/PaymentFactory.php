<?php

namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'amount' => $this->faker->randomElement([299.99, 499.99, 899.99]),
            'method' => $this->faker->randomElement(['stripe', 'cash', 'check']),
            'installment_number' => $this->faker->numberBetween(1, 3),
            'status' => $this->faker->randomElement(['completed', 'pending', 'failed']),
            'paid_at' => $this->faker->optional(0.8)->dateTimeThisYear(),
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
