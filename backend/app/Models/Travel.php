<?php

namespace App\Models;

use App\Models\Chat;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Travel extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_location',
        'lat',
        'lon',
        'type_moto',
        'cc_moto',
        'departure_date',
        'expiration_date',
        'days',
    ];
    protected $attributes = [
        'active' => true,
    ];
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'travel_user')->withPivot('role','active');
    }

    public function metas(): HasMany
    {
        return $this->hasMany(Meta::class);
    }

    public function chat(): HasOne
    {
        return $this->hasOne(Chat::class);
    }

    protected static function booted()
    {
        static::created(function ($travel) {
            $chat = Chat::create([
                'name' => 'Chat for travel ' . $travel->id,
                'travel_id' => $travel->id,
                'active' => true,
            ]);

            $chat->addUsersFromTravel($travel);
        });

        static::updated(function ($travel) {
            if ($travel->isDirty('users')) {
                $chat = $travel->chat()->first();
                $chat->addUsersFromTravel($travel);
            }
        });


    }


}