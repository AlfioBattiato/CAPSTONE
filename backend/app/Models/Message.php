<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'user_id',
        'message',
        'send_at',
        'file_path',
        'file_type',
    ];

    protected $dates = ['send_at'];
    protected $appends = ['file_url']; 

    public function setFileAttribute($file)
    {
        if ($file) {
            // Salva il file nel filesystem locale
            $path = $file->store('files');
            $this->attributes['file_path'] = $path;
            $this->attributes['file_type'] = $file->getClientMimeType();
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
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    // Relazione con User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
