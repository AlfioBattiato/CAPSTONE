<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'addressee_id',
        'status',
    ];

    // Relazione con il modello User per il richiedente (requester)
    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    // Relazione con il modello User per il destinatario (addressee)
    public function addressee()
    {
        return $this->belongsTo(User::class, 'addressee_id');
    }
}
