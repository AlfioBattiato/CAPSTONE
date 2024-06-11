<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'active',
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

    /**
     * Boot the model.
     */
    protected static function booted()
    {
        static::deleting(function ($chat) {
            $chat->users()->detach();
            $chat->messages()->delete();
        });
    }
}

