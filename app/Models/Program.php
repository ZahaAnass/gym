<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = ['coach_id', 'title', 'description', 'is_ai_generated'];

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }

    // 🔥 NEW: Connects Programs to Clients
    public function clients()
    {
        return $this->belongsToMany(User::class, 'program_user')->withTimestamps();
    }
}
