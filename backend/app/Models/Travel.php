<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Travel extends Model
{
    use HasFactory;
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'travel_user');
    }

    public function metas(): HasMany
    {
        return $this->hasMany(Meta::class);
    }
}
