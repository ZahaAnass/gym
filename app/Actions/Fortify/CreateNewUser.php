<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        // 1. Find the coach with the lowest number of assigned clients
        $availableCoach = User::role('coach')
            ->withCount('clients')
            ->orderBy('clients_count', 'asc')
            ->first();

        // 2. Create the user and assign them to the selected coach
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            // Assign the coach ID, or leave null if no coaches exist in the database yet
            'coach_id' => $availableCoach ? $availableCoach->id : null,
        ]);

        // 3. Assign the default 'client' role using Spatie
        $user->assignRole('client');

        return $user;
    }
}
