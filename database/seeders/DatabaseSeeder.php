<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\AuditLog;
use App\Models\Goal;
use App\Models\Payment;
use App\Models\Program;
use App\Models\Session;
use App\Models\User;
use App\Notifications\SystemBroadcast;
use Database\Factories\DatabaseNotificationFactory;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Création des Rôles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $coachRole = Role::firstOrCreate(['name' => 'coach', 'guard_name' => 'web']);
        $clientRole = Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);

        // 2. Création de l'Admin (Vous)
        $admin = User::firstOrCreate(
            ['email' => 'admin@gym.com'],
            ['name' => 'Anass Admin', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $admin->assignRole($adminRole);

        // 3. 🔥 Création du Coach de Test (Pour la démo)
        $testCoach = User::firstOrCreate(
            ['email' => 'coach@gym.com'],
            ['name' => 'Coach Principal', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        $testCoach->assignRole($coachRole);
        // On donne beaucoup de programmes au coach de test pour remplir sa bibliothèque
        Program::factory(8)->create(['coach_id' => $testCoach->id]);

        // Création de 4 autres Coachs aléatoires
        $randomCoaches = User::factory(4)->create()->each(function ($user) use ($coachRole) {
            $user->assignRole($coachRole);
            Program::factory(rand(2, 5))->create(['coach_id' => $user->id]);
        });

        $coaches = collect([$testCoach])->merge($randomCoaches);

        // 4. 🔥 Création du Client de Test (LA STAR DE LA PRÉSENTATION)
        $testClient = User::firstOrCreate(
            ['email' => 'client@gym.com'],
            ['name' => 'Client Démo', 'password' => bcrypt('password'), 'email_verified_at' => now(), 'coach_id' => $testCoach->id]
        );
        $testClient->assignRole($clientRole);

        // 🌟 Données massives pour le Client de Test (Pour des graphiques parfaits)
        // 10 Bilan biométriques étalés dans le temps pour la courbe de poids
        Assessment::factory(10)->create(['client_id' => $testClient->id, 'coach_id' => $testCoach->id]);
        // Un paiement complété très récent pour débloquer le dashboard + 3 anciens
        Payment::factory()->create(['user_id' => $testClient->id, 'status' => 'completed', 'paid_at' => now()->subDays(2)]);
        Payment::factory(3)->create(['user_id' => $testClient->id]);
        // 4 Objectifs différents
        Goal::factory(4)->create(['user_id' => $testClient->id, 'coach_id' => $testCoach->id]);


        // 5. Création de 40 Clients aléatoires pour simuler un vrai business
        User::factory(40)->create()->each(function ($client) use ($clientRole, $coaches) {
            $client->assignRole($clientRole);

            $coach = $coaches->random();
            $client->update(['coach_id' => $coach->id]);

            // Données basiques pour les autres clients
            Assessment::factory(rand(1, 4))->create(['client_id' => $client->id, 'coach_id' => $coach->id]);
            Payment::factory(rand(1, 3))->create(['user_id' => $client->id]);
            Goal::factory(rand(1, 2))->create(['user_id' => $client->id, 'coach_id' => $coach->id]);
        });

        // 6. Création des Séances (Sessions) et assignation
        $programs = Program::all();
        foreach ($programs as $program) {
            // Sélectionner 4 à 10 clients du coach propriétaire de ce programme
            // 🔥 On force l'inclusion du testClient si c'est un programme du testCoach
            $programClientsQuery = User::role('client')
                ->where('coach_id', $program->coach_id)
                ->inRandomOrder()
                ->take(rand(4, 10));

            $programClients = $programClientsQuery->pluck('id')->toArray();

            if ($program->coach_id === $testCoach->id && !in_array($testClient->id, $programClients)) {
                $programClients[] = $testClient->id; // Assure que le client démo a plein de programmes
            }

            // Assigner le programme aux clients
            $program->clients()->syncWithoutDetaching($programClients);

            // Générer 8 à 15 séances par programme pour remplir le calendrier
            Session::factory(rand(8, 15))->create([
                'program_id' => $program->id,
                'coach_id' => $program->coach_id,
            ])->each(function ($session) use ($programClients) {

                $pivotData = [];
                foreach ($programClients as $clientId) {
                    // Si la séance est dans le passé, on génère une présence (80% de chance d'être présent)
                    // Si elle est dans le futur, 'attended' reste false
                    $isPast = $session->scheduled_at < now();
                    $pivotData[$clientId] = [
                        'attended' => $isPast ? fake()->boolean(85) : false,
                        'notes' => $isPast ? fake()->optional(0.6)->sentence() : null,
                    ];
                }
                $session->clients()->syncWithoutDetaching($pivotData);
            });
        }

        // 7. Génération des Logs Système (Pour le Dashboard Admin)
        AuditLog::factory(250)->create([
            'user_id' => fn () => User::inRandomOrder()->first()->id,
        ]);

        // 8. Génération des Notifications
        $admin->notify(new SystemBroadcast(
            'Initialisation terminée',
            'La base de données de production a été générée avec succès.',
            'success'
        ));

        // Notifications pour tout le monde
        $allUsers = User::all();
        foreach ($allUsers as $user) {
            DatabaseNotificationFactory::new()->count(rand(3, 8))->create([
                'notifiable_id' => $user->id,
                'notifiable_type' => User::class,
            ]);
        }
    }
}
