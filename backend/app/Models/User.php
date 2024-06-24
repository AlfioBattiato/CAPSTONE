<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Chat;

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
    public function travels(): BelongsToMany
    {
        return $this->belongsToMany(Travel::class, 'travel_user');
    }
    public function interestplaces(): HasMany
    {
        return $this->hasMany(InterestPlace::class);
    }



    //  ********************************************************CHATS********************************************************************



    /**
     * Get the related chats.
     */
    public function chats(): BelongsToMany
    {
        return $this->belongsToMany(Chat::class, 'lobby')->withPivot('type');
    }

    /**
     * Handle the User "deleting" event.
     */
    protected static function booted()
    {
        static::deleting(function ($user) {
            $user->chats()->detach();
            $user->messages()->delete();
            // Add other necessary detachments if needed
        });
    }
}
