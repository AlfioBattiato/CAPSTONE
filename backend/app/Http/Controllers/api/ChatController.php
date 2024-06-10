<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateChatRequest;
use App\Http\Requests\StoreChatRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\User;
class ChatController extends Controller
{
    public function index()
    {
        $chats = Chat::all();
        return response()->json($chats);
    }

    public function show(Chat $chat)
    {
        return response()->json($chat);
    }

    public function store(StoreChatRequest $request)
    {
        $chat = Chat::create($request->validated());

        return response()->json($chat, 201);
    }

    public function update(UpdateChatRequest $request, Chat $chat)
    {
        $chat->update($request->validated());

        return response()->json($chat);
    }

    public function destroy(Chat $chat)
    {
        $chat->users()->detach();
        $chat->delete();

        return response()->json(null, 204);
    }

    public function addUserToChat(Request $request, Chat $chat)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->input('user_id'));
        $chat->users()->attach($user);

        return response()->json(['message' => 'User added to chat successfully'], 200);
    }

    public function removeUserFromChat(Request $request, Chat $chat)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->input('user_id'));
        $chat->users()->detach($user);

        return response()->json(['message' => 'User removed from chat successfully'], 200);
    }
}
