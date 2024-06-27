<?php

namespace App\Models;

use Illuminate\Support\Collection;
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
        return $this->belongsToMany(Chat::class, 'lobby');
    }

    // Relazioni di amicizia

    // Questo metodo restituisce tutti gli utenti che hanno ricevuto una richiesta di amicizia dall'utente corrente e l'hanno accettata.
    public function friendsOfMine(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friendships', 'requester_id', 'addressee_id')
                    ->withPivot('status')
                    ->wherePivot('status', 'accepted');
    }

    // Questo metodo restituisce tutti gli utenti che hanno inviato una richiesta di amicizia all'utente corrente e l'hanno accettata.
    public function friendOf(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friendships', 'addressee_id', 'requester_id')
                    ->withPivot('status')
                    ->wherePivot('status', 'accepted');
    }

    // Questo metodo combina (merge) i risultati di friendsOfMine e friendOf. 
    // Restituisce tutti gli amici dell'utente corrente, sia quelli che hanno ricevuto una richiesta dall'utente corrente sia quelli che hanno inviato una richiesta all'utente corrente
    /**
     * Ottiene tutti gli amici dell'utente.
     *
     * @return \Illuminate\Support\Collection
     */
    public function friends(): Collection
    {
        return $this->friendsOfMine()->get()->merge($this->friendOf()->get());
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
