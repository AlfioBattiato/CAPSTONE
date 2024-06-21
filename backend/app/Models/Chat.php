<?php

namespace App\Models;

use App\Models\User;
use App\Models\Travel;
use Illuminate\Support\Facades\Log;
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
        'travel_id', 'name', 'active', 'group_chat', 'image',
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
        $users = $travel->users()->pluck('users.id')->toArray();
        Log::info('Users being added to chat: ', $users); // Log per debugging
        $this->users()->syncWithoutDetaching($users);
        $this->updateGroupChatStatus();
    }

    public function updateGroupChatStatus()
    {
        $this->group_chat = ($this->users()->count() > 2 || $this->travel_id !== null);
        $this->save();
    }

    /**
     * Boot the model.
     */
    protected static function booted()
    {


        static::creating(function ($chat) {
            if ($chat->group_chat && is_null($chat->image)) {
                $chat->image = 'http://localhost:8000/storage/profiles/group-of-people.svg';
            }
        });

        static::created(function ($chat) {
            if ($chat->travel_id) {
                $travel = Travel::find($chat->travel_id);
                if ($travel) {
                    $chat->users()->attach($travel->users->pluck('id')->toArray());
                }
                $chat->updateGroupChatStatus();
            }
        });


        static::updating(function ($chat) {
            if ($chat->group_chat && is_null($chat->image)) {
                $chat->image = 'http://localhost:8000/storage/profiles/group-of-people.svg';
            }
        });


        static::deleting(function ($chat) {
            $chat->users()->detach();
            $chat->messages()->delete();
        });

        
    }

}

