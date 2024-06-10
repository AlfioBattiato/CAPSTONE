<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'profile_img',
        'rating',
        'active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

// inserire le relazioni molti a molti e uno a molti per i viaggi

    /**
     * Get the related chats.
     */
    public function chats(): BelongsToMany
    {
        return $this->belongsToMany(Chat::class, 'lobby');
    }

    /**
     * Handle the User "deleting" event.
     */
    protected static function booted()
    {
        static::deleting(function ($user) {
            $user->chats()->detach();
            // Add other necessary detachments if needed
        });
    }
}
