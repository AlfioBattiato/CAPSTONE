<?php

namespace App\Http\Controllers\Api;

use App\Models\Chat;
use App\Models\Message;
use App\Events\MessageRead;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use App\Events\MessageDeleted;
use App\Events\NotificationsUpdated;
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
    
        try {
            $data = $request->all();
            $data['user_id'] = Auth::id();
    
            $message = Message::create($data);
    
            if ($request->hasFile('file')) {
                $message->setFileAttribute($request->file('file'));
                $message->save();
            }
    
            // Associa il messaggio agli utenti della chat
            $chat = Chat::find($message->chat_id);
            $users = $chat->users;
    
            foreach ($users as $user) {
                $message->users()->syncWithoutDetaching([$user->id => [
                    'is_read' => ($user->id === auth()->id()),
                    'sender' => ($user->id === auth()->id())
                ]]);
            }
    
            // Trigger the MessageSent event
            broadcast(new MessageSent($message))->toOthers();
    
            return response()->json($message, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
        $chatId = $message->chat_id;
        $messageId = $message->id;

        $wasUnreadByAnyUser = $message->users()->where('is_read', false)->exists();

        if ($message->file_path) {
            Storage::delete($message->file_path);
        }

        $message->delete();

        broadcast(new MessageDeleted($chatId, $messageId, $wasUnreadByAnyUser))->toOthers();

        return response()->json(null, 204);
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'messageIds' => 'required|array',
            'messageIds.*' => 'exists:messages,id',
        ]);

        $user = Auth::user();
        $messageIds = $request->input('messageIds');

        foreach ($messageIds as $messageId) {
            $message = Message::find($messageId);
            $message->users()->updateExistingPivot($user->id, ['is_read' => true]);
        }

        // Trigger the MessageRead event
        broadcast(new MessageRead($messageIds, $user->id))->toOthers();

        return response()->json(['message' => 'Messages marked as read']);
    }


    public function getMessagesByChat(Chat $chat)
    {
        $user = Auth::user();
        $messages = $chat->messages()
            ->with(['users' => function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->withPivot('is_read', 'sender');
            }])
            ->get();

        return response()->json($messages);
    }
}
