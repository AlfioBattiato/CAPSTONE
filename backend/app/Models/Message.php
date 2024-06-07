<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'user_id',
        'message',
        'send_at',
        'file',
        'file_type',
    ];

    protected $dates = [
        'send_at',
    ];

    // Chat relation
    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    // User relation
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Method to set the file and file type.
     * setFileAttribute is a mutator in Laravel that allows modifying the value of an attribute before it is saved to the database.
     * It is used to handle the upload and storage of binary files.
     */
    public function setFileAttribute($file) 
    {
        if ($file) {
            // Checks if the file is uploaded
            $this->attributes['file'] = file_get_contents($file);
            // Reads the uploaded file and returns it as a binary string, then assigns it to 'file'
            $this->attributes['file_type'] = $file->getClientMimeType();
            // The MIME type is important because it indicates the type of content of the file (e.g., image/jpeg, audio/mpeg)
            // This method is provided by the UploadedFile object in Laravel and returns the MIME type of the uploaded file
        }
    }

    /**
     * Method to get the decoded file.
     * Converts the content previously assigned to 'file' and 'file_type'.
     * Saving a file in base64 allows converting the binary code into a string for use in a JSON file for API requests.
     * Doing so increases the file size by about 33%.
     * Considering that the size of a photo taken by an average phone and a 5-minute voice message is about 5MB,
     * even with a one-third increase in size, it can still fit within the 16MB capacity of a MEDIUMBLOB.
     */
    public function getFileAttribute($file)
    {
        return base64_encode($file);
    }
}
