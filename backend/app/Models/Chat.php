<?php

namespace App\Models;

use App\Models\User;
use App\Models\Travel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'travel_id', 'name', 'active',
    ];

    /**
     * Get the users that belong to the chat.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'lobby');
    }

    /**
     * Get the messages for the chat.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function travel(): BelongsTo
    {
        return $this->belongsTo(Travel::class);
    }

    public function addUsersFromTravel(Travel $travel)
    {
        $users = $travel->users()->pluck('user_id')->toArray();
        $this->users()->syncWithoutDetaching($users);
    }

    /**
     * Boot the model.
     */
    protected static function booted()
    {
        static::created(function ($chat) {
            if ($chat->travel_id) {
                $travel = Travel::find($chat->travel_id);
                if ($travel) {
                    $chat->users()->attach($travel->users->pluck('id')->toArray());
                }
            }
        });

        static::deleting(function ($chat) {
            $chat->users()->detach();
            $chat->messages()->delete();
        });

        
    }

}

