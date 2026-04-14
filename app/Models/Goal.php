<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'coach_id', 'title', 'type', 'target_value',
        'current_value', 'unit', 'direction', 'deadline',
        'ai_strategy_advice', 'status',
    ];

    protected $casts = ['deadline' => 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }
}
