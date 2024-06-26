<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'profile_img',
        'rating',
        'active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relazione molti-a-molti con Message per lo stato di lettura dei messaggi
    public function messages(): BelongsToMany
    {
        return $this->belongsToMany(Message::class, 'message_user')->withPivot('is_read', 'sender')->withTimestamps();
    }

    // Relazione molti-a-molti con Travel
    public function travels(): BelongsToMany
    {
        return $this->belongsToMany(Travel::class, 'travel_user')->withPivot('role');
    }

    // Relazione uno-a-molti con InterestPlace
    public function interestplaces(): HasMany
    {
        return $this->hasMany(InterestPlace::class);
    }

    // Relazione molti-a-molti con Chat
    public function chats(): BelongsToMany
    {
        return $this->belongsToMany(Chat::class, 'lobby')->withPivot('type');
    }

    protected static function booted()
    {
        static::deleting(function ($user) {
            $user->chats()->detach();
            $user->messages()->detach();
            // Add other necessary detachments if needed
        });
    }
}
