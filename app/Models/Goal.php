<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{use HasFactory;
    protected $fillable = ['user_id', 'title', 'target_value', 'current_value', 'deadline', 'ai_strategy_advice', 'status'];

    protected $casts = ['deadline' => 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
