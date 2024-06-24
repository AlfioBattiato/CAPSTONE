<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Meta extends Model
{
    use HasFactory;

    protected $fillable = [
        'travel_id',
        'name_location',
        'lat',
        'lon',
    ];

    public function travel(): BelongsTo
    {
        return $this->belongsTo(Travel::class);
    }
}
