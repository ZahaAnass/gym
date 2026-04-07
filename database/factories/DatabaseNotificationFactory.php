<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

class DatabaseNotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     * We explicitly point this to Laravel's built-in notification model.
     */
    protected $model = DatabaseNotification::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\SystemBroadcast',
            'notifiable_type' => User::class,
            'notifiable_id' => User::factory(), // Will be overridden in the seeder
            'data' => [
                'title' => fake()->randomElement([
                    'System Update', 'Schedule Change', 'Payment Received', 'New AI Program', 'Dietary Advice',
                ]),
                'message' => fake()->paragraph(2),
                'type' => fake()->randomElement(['info', 'alert', 'success', 'payment', 'ai_assessment']),
                'action_url' => null,
                'action_text' => null,
            ],
            // 40% chance the notification has already been read
            'read_at' => fake()->optional(0.4)->dateTimeThisMonth(),
            'created_at' => fake()->dateTimeThisMonth(),
            'updated_at' => now(),
        ];
    }
}
