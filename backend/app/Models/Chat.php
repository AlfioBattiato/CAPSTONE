<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'travel_id', 
        'name', 
        'active', 
        'image',
        'type',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'lobby');
    }

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
        $users = $travel->users()->pluck('users.id')->toArray();
        Log::info('Users being added to chat: ', $users);
        try {
            $this->users()->syncWithoutDetaching($users);
            Log::info('Users successfully added to chat.');
        } catch (\Exception $e) {
            Log::error('Error adding users to chat: ' . $e->getMessage());
        }
    }

    protected static function booted()
    {
        static::creating(function ($chat) {
            if (is_null($chat->image)) {
                $chat->image = url('/assets/profiles/group-of-people.svg');
            }
        });

        static::created(function ($chat) {
            if ($chat->travel_id) {
                $travel = Travel::find($chat->travel_id);
                if ($travel) {
                    $chat->addUsersFromTravel($travel);
                }
            }
        });

        static::updating(function ($chat) {
            if (is_null($chat->image)) {
                $chat->image = url('/assets/profiles/group-of-people.svg');
            }
        });

        static::deleting(function ($chat) {
            $chat->users()->detach();
            $chat->messages()->delete();
        });
    }
}
