<?php

namespace Database\Factories;

use App\Models\Goal;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoalFactory extends Factory
{
    protected $model = Goal::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement(['Perdre du poids', 'Prendre de la masse', 'Améliorer le cardio', 'Préparation Marathon']),
            'target_value' => $this->faker->randomFloat(2, 60, 100),
            'current_value' => $this->faker->randomFloat(2, 60, 100),
            'deadline' => $this->faker->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'ai_strategy_advice' => $this->faker->optional(0.7)->paragraph(),
            'status' => $this->faker->randomElement(['active', 'reached', 'failed']),
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
