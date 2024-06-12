<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\User;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $chats = $user->chats()->with('users')->get();
        return response()->json($chats);
    }

    public function show(Chat $chat)
    {
        return response()->json($chat->load('users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'active' => 'boolean',
            'travel_id' => 'nullable|exists:travels,id',
        ]);

        $chat = Chat::create($request->all());

        return response()->json($chat, 201);
    }

    public function update(Request $request, Chat $chat)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'active' => 'boolean',
            'travel_id' => 'nullable|exists:travels,id',
        ]);

        $chat->update($request->all());

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
