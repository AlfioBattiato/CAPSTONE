<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Chat;

class MessageController extends Controller
{
    /**
     * Display a listing of the messages.
     */
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    /**
     * Store a newly created message in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'chat_id' => 'required|exists:chats,id',  // Checks that chat_id is provided and exists in the chats table
        'message' => 'nullable|string',  // message is optional and must be a string if provided
        'file' => 'nullable|file',  // file is optional and must be a file if provided
    ]);

    $message = new Message();
    $message->chat_id = $request->input('chat_id');  // Sets chat_id from the value provided in the request
    $message->user_id = Auth::id();  // Sets user_id with the authenticated user's ID
    $message->message = $request->input('message');  // Sets message from the value provided in the request, if present
    
    if ($request->hasFile('file')) {
        $message->file = $request->file('file');  // Sets the file attribute if a file was uploaded
    }

    $message->send_at = now();  // Sets send_at with the current time
    $message->save();  // Saves the new message to the database

    $message->load('user');

    return response()->json($message, 201);  // Returns the JSON response with the created message and the 201 (Created) status code
}


    /**
     * Display the specified message.
     */
    public function show(Message $message)
    {
        return response()->json($message);
    }

    /**
     * Update the specified message in storage.
     */
    public function update(Request $request, Message $message)
    {
        $request->validate([
            'message' => 'nullable|string',
            'file' => 'nullable|file',
        ]);

        if ($request->filled('message')) {
            $message->message = $request->input('message');
        }

        if ($request->hasFile('file')) {
            $message->file = $request->file('file');
        }

        $message->save();

        return response()->json($message);
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(null, 204); //Returns the JSON response with the created message and the 204 (No Content) status code
    }

    public function getMessagesByChat(Chat $chat)
    {
        $messages = $chat->messages()->with('user')->get();
        return response()->json($messages);
    }
}
