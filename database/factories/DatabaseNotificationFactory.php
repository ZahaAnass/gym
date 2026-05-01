<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

class DatabaseNotificationFactory extends Factory
{
    protected $model = DatabaseNotification::class;

    public function definition(): array
    {
        $notifications = [
            ['title' => 'Programme IA Généré', 'message' => 'L\'assistant Gemini a finalisé la création de votre programme personnalisé de 4 semaines.', 'type' => 'success'],
            ['title' => 'Facture acquittée', 'message' => 'Votre paiement via Stripe a bien été reçu. Votre accès Premium est prolongé.', 'type' => 'payment'],
            ['title' => 'Rappel de Séance', 'message' => 'N\'oubliez pas votre séance "Haut du corps" planifiée demain matin. N\'oubliez pas votre serviette !', 'type' => 'info'],
            ['title' => 'Nouveau Bilan Requis', 'message' => 'Cela fait 4 semaines que vous n\'avez pas mis à jour votre poids. Pensez à faire une pesée.', 'type' => 'alert'],
            ['title' => 'Mise à jour du système', 'message' => 'De nouvelles fonctionnalités IA sont maintenant disponibles sur votre tableau de bord.', 'type' => 'info'],
        ];

        $notif = $this->faker->randomElement($notifications);

        return [
            'id' => Str::uuid()->toString(),
            'type' => 'App\Notifications\SystemBroadcast',
            'notifiable_type' => User::class,
            'notifiable_id' => 1, // Sera écrasé par le Seeder
            'data' => [
                'title' => $notif['title'],
                'message' => $notif['message'],
                'type' => $notif['type'],
                'action_url' => '/dashboard',
                'action_text' => 'Voir',
            ],
            'read_at' => $this->faker->optional(0.6)->dateTimeThisMonth(), // 60% sont lues
            'created_at' => $this->faker->dateTimeBetween('-2 weeks', 'now'),
            'updated_at' => now(),
        ];
    }
}
