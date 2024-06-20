<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterestPlace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_location',
        'description',
        'location_img',
        'lat',
        'lon',
        'user_id',
        'rating',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
