<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{use HasFactory;
    // Tell Laravel to use our custom table, NOT the default browser sessions table
    protected $table = 'gym_sessions';

    protected $fillable = ['program_id', 'coach_id', 'title', 'scheduled_at', 'duration_minutes', 'max_participants'];
    protected $casts = ['scheduled_at' => 'datetime'];

    public function program() { return $this->belongsTo(Program::class); }
    public function coach() { return $this->belongsTo(User::class, 'coach_id'); }
    public function clients() {
        return $this->belongsToMany(User::class, 'session_client')
            ->withPivot('is_attended', 'client_realizations', 'coach_remarks')
            ->withTimestamps();
    }
}
