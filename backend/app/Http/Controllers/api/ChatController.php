<?php

namespace App\Http\Controllers\Api;

use App\Models\Chat;
use App\Events\ChatCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
            'image' => 'nullable|string|max:255',
            'type' => 'required|in:private,group,travel',
        ]);

        try {
            $chat = Chat::create($request->all());
            $chat->users()->sync($request->user_ids ?? []);

            Log::info('Chat created: ', ['chat' => $chat]);

            // Invia evento di creazione chat
            broadcast(new ChatCreated($chat))->toOthers();

            Log::info('ChatCreated event broadcasted for chat: ', ['chat' => $chat]);

            return response()->json($chat, 201);
        } catch (\Exception $e) {
            Log::error('Error creating chat: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function createPrivateChat(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $loggedInUserId = Auth::id();
        $otherUserId = $request->user_id;

        // Controlla se esiste già una chat privata tra i due utenti
        $existingChat = Chat::whereHas('users', function($query) use ($loggedInUserId) {
                $query->where('users.id', $loggedInUserId);
            })
            ->whereHas('users', function($query) use ($otherUserId) {
                $query->where('users.id', $otherUserId);
            })
            ->where('type', 'private')
            ->first();

        if ($existingChat) {
            return response()->json($existingChat);
        }

        // Crea una nuova chat privata
        $chat = Chat::create([
            'name' => null,
            'active' => true,
            'type' => 'private',
        ]);

        // Aggiungi gli utenti alla chat
        $chat->users()->attach([$loggedInUserId, $otherUserId]);

        Log::info('Private chat created: ', ['chat' => $chat]);

        broadcast(new ChatCreated($chat))->toOthers();

        Log::info('ChatCreated event broadcasted for private chat: ', ['chat' => $chat]);

        return response()->json($chat, 201);
    }

    public function createGroupChat(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'user_ids' => 'required|array',
        'user_ids.*' => 'exists:users,id',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $imagePath = null;

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('public/profiles');
        $imagePath = Storage::url($imagePath);
    } else {
        $imagePath = url('/assets/profiles/group-of-people.svg');
    }

    $chat = Chat::create([
        'name' => $request->name,
        'active' => true,
        'type' => 'group',
        'image' => $imagePath,
    ]);

    // Aggiungi gli utenti alla chat
    $chat->users()->attach($request->user_ids);

    // Invia evento di creazione chat
    broadcast(new ChatCreated($chat))->toOthers();

    return response()->json($chat, 201);
}

    

    public function update(Request $request, Chat $chat)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'active' => 'boolean',
            'travel_id' => 'nullable|exists:travels,id',
            'image' => 'nullable|string|max:255',
        ]);

        $chat->update($request->all());
        return response()->json($chat);
    }

    public function updateGroupChat(Request $request, Chat $chat)
{
    $request->validate([
        'name' => 'nullable|string|max:255',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'user_ids' => 'nullable|array',
        'user_ids.*' => 'exists:users,id',
    ]);

    if ($request->has('name')) {
        $chat->name = $request->name;
    }

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('public/profiles');
        $chat->image = Storage::url($imagePath);
    }

    if ($request->has('user_ids')) {
        $userIds = $request->input('user_ids');
        $chat->users()->attach($userIds);
    }

    $chat->save();

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
