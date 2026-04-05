<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramFactory extends Factory
{
    protected $model = Program::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement(['Programme Force', 'HIIT Extrême', 'Remise en forme', 'Yoga & Flexibilité']),
            'description' => $this->faker->paragraph(),
            'is_ai_generated' => $this->faker->boolean(40), // 40% chance it was made by Gemini
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
