<?php

// App\Models\Message.php

namespace App\Models;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'message',
        'send_at',
        'file_path',
        'file_type',
        'file_size',
    ];

    protected $dates = ['send_at'];
    protected $appends = ['file_url'];

    public function setFileAttribute($file)
    {
        if ($file) {
            $path = $file->store('files');
            $this->attributes['file_path'] = $path;
            $this->attributes['file_type'] = $file->getClientMimeType();
            $this->attributes['file_size'] = $file->getSize();
        }
    }

    public function getFileUrlAttribute()
    {
        if ($this->file_path) {
            return Storage::url($this->file_path);
        }
        return null;
    }

    // Relazione con Chat
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class);
    }

    // Relazione molti-a-molti con User per lo stato di lettura dei messaggi
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'message_user')->withPivot('is_read', 'sender')->withTimestamps();
    }

    protected static function booted()
    {
        static::created(function ($message) {
            $chat = Chat::find($message->chat_id);
            $users = $chat->users;

            foreach ($users as $user) {
                $message->users()->attach($user->id, [
                    'is_read' => ($user->id === auth()->id()),
                    'sender' => ($user->id === auth()->id())
                ]);
            }
        });
    }
}
