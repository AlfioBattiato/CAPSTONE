<?php

namespace App\Http\Controllers\Api;

use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\Request;
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

        $message->send_at = now();
        $message->save();

        $message->load('user');

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

    public function destroy(Message $message)
    {
        if ($message->file_path) {
            Storage::delete($message->file_path);
        }

        $message->delete();
        return response()->json(null, 204);
    }

    public function getMessagesByChat(Chat $chat)
    {
        $messages = $chat->messages()->with('user')->get();
        return response()->json($messages);
    }
}
