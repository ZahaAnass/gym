<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{use HasFactory;
    protected $fillable = ['client_id', 'coach_id', 'height', 'weight', 'ideal_weight_ai', 'blood_pressure', 'allergies'];
    public function client() { return $this->belongsTo(User::class, 'client_id'); }
    public function coach() { return $this->belongsTo(User::class, 'coach_id'); }
}
