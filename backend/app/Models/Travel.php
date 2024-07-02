<?php

namespace App\Models;

use Illuminate\Support\Carbon;
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
        return $this->belongsToMany(User::class, 'travel_user')->withPivot('role', 'active');
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
            Log::info('Travel created with ID: ' . $travel->id);

            // Se c'è un utente autenticato, impostalo come creatore
            if (auth()->check()) {
                $creatorUser = auth()->user();
            } else {
                // Altrimenti, prendi il primo utente come creatore (utile nei seed)
                $creatorUser = User::first();
            }

            if ($creatorUser) {
                $creatorUserId = $creatorUser->id;
                $creatorUsername = $creatorUser->username;
                $travelId = $travel->id;
                $travel->users()->syncWithoutDetaching([$creatorUserId => ['role' => 'creator_travel', 'active' => true]]);
                Log::info('Users associated with travel: ' . json_encode([$creatorUserId]));

                // Determina l'immagine in base al tipo di moto
                $chatImage = $travel->getImageSource($travel->type_moto);

                // Crea la chat per il viaggio con il nome desiderato
                $chatName = 'viaggio ' . $travelId;
                $chat = Chat::create([
                    'name' => $chatName,
                    'travel_id' => $travel->id,
                    'active' => true,
                    'type' => 'travel',
                    'image' => $chatImage,
                ]);

                if ($chat) {
                    Log::info('Chat created for travel with ID: ' . $travel->id);
                    $chat->addUsersFromTravel($travel);
                    Log::info('Chat users after adding from travel: ' . json_encode($chat->users->pluck('id')->toArray()));
                } else {
                    Log::error('Failed to create chat for travel with ID: ' . $travel->id);
                }
            } else {
                Log::error('No users found to assign as creator for travel ID: ' . $travel->id);
            }
        });

        static::updated(function ($travel) {
            if ($travel->isDirty('users')) {
                try {
                    $chat = $travel->chat()->first();
                    if ($chat) {
                        Log::info('Updating users in chat for travel with ID: ' . $travel->id);
                        $chat->addUsersFromTravel($travel);
                        Log::info('Chat users after updating: ' . json_encode($chat->users->pluck('id')->toArray()));
                    }
                } catch (\Exception $e) {
                    Log::error('Exception while updating users in chat for travel with ID: ' . $travel->id . ' - ' . $e->getMessage());
                }
            }
        });
    }

    public function setDepartureDateAttribute($value)
    {
        $this->attributes['departure_date'] = Carbon::parse($value)->format('Y-m-d H:i:s');
    }

    public function setExpirationDateAttribute($value)
    {
        $this->attributes['expiration_date'] = Carbon::parse($value)->format('Y-m-d H:i:s');
    }

    public function getImageSource($vehicleType)
    {
        switch ($vehicleType) {
            case "Race Bikes":
                return "/assets/moto/moto3.png";
            case "Motocross":
                return "/assets/moto/motocross3.png";
            case "Scooter":
                return "/assets/moto/vespa3.png";
            case "Off Road":
                return "/assets/moto/offroad3.png";
            case "Harley":
                return "/assets/moto/harley3.png";
            default:
                return "/assets/moto/moto.png";
        }
    }
}
