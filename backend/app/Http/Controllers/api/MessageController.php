<?php

namespace App\Http\Controllers\Api;

use App\Models\Chat;
use App\Models\Message;
use App\Events\MessageRead;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use App\Events\MessageDeleted;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    public function store(Request $request)
{
    $request->validate([
        'chat_id' => 'required|exists:chats,id',
        'message' => 'nullable|string',
        'file' => 'nullable|file',
    ]);

    $message = new Message();
    $message->chat_id = $request->input('chat_id');
    $message->user_id = Auth::id();
    $message->message = $request->input('message');

    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $message->file = $file;
    }

    $message->is_unread = true;
    $message->send_at = now();
    $message->save();

    $message->load('user');

    broadcast(new MessageSent($message))->toOthers();

    return response()->json($message, 201);
}

    public function show(Message $message)
    {
        return response()->json($message);
    }

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

    // App\Http\Controllers\MessageController.php
public function destroy(Message $message)
{
    $wasUnread = $message->is_unread;
    $userId = $message->user_id;
    $chatId = $message->chat_id;
    $messageId = $message->id;

    if ($message->file_path) {
        Storage::delete($message->file_path);
    }

    $message->delete();

    broadcast(new MessageDeleted($chatId, $messageId, $userId, $wasUnread))->toOthers();

    return response()->json(null, 204);
}


    public function markAsRead(Request $request)
{
    $messageIds = $request->input('messageIds', []);

    // Assicurati che solo i destinatari dei messaggi possano contrassegnarli come letti
    $messages = Message::whereIn('id', $messageIds)->where('user_id', '!=', Auth::id())->get();

    foreach ($messages as $message) {
        $message->is_unread = false;
        $message->save();
    }

    if ($messages->isNotEmpty()) {
        $chatId = $messages->first()->chat_id;
        broadcast(new MessageRead($messageIds, $chatId))->toOthers();
    }

    return response()->json(['message' => 'Messages marked as read']);
}

 

    public function getMessagesByChat(Chat $chat)
    {
        $messages = $chat->messages()->with('user')->get();
        return response()->json($messages);
    }
}
