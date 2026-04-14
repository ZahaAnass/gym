<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'coach_id', 'stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at'];

    protected $hidden = ['password', 'remember_token', 'two_factor_recovery_codes', 'two_factor_secret'];

    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    // Relationships
    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function clients()
    {
        return $this->hasMany(User::class, 'coach_id');
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'client_id');
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function programs()
    {
        return $this->hasMany(Program::class, 'coach_id');
    }

    public function sessionsAsCoach()
    {
        return $this->hasMany(Session::class, 'coach_id');
    }

    public function sessionsAsClient(): BelongsToMany
    {
        return $this->belongsToMany(Session::class, 'session_user')
            ->withPivot('attended', 'notes')
            ->withTimestamps();
    }

    public function assignedPrograms(): BelongsToMany
    {
        return $this->belongsToMany(Program::class, 'program_user');
    }

    public function attendedSessions(): BelongsToMany
    {
        return $this->belongsToMany(Session::class, 'session_user')
            ->withPivot(['attended', 'notes'])
            ->withTimestamps();
    }
}
