<?php

namespace Database\Factories;

use App\Models\Goal;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoalFactory extends Factory
{
    protected $model = Goal::class;

    public function definition(): array
    {
        $isNumeric = $this->faker->boolean(70); // 70% of goals will be numeric

        return [
            'title' => $this->faker->randomElement(['Perdre du poids', 'Prendre de la masse', 'Améliorer le cardio', 'Préparation Marathon']),
            'type' => $isNumeric ? 'numeric' : 'text',
            'target_value' => $isNumeric ? $this->faker->randomFloat(2, 60, 100) : null,
            'current_value' => $isNumeric ? $this->faker->randomFloat(2, 50, 90) : null,
            'unit' => $isNumeric ? $this->faker->randomElement(['kg', 'km']) : null,
            'direction' => $isNumeric ? $this->faker->randomElement(['asc', 'desc']) : null,
            'deadline' => $this->faker->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'ai_strategy_advice' => $this->faker->optional(0.7)->paragraph(),
            'status' => $this->faker->randomElement(['active', 'reached', 'failed']),
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
