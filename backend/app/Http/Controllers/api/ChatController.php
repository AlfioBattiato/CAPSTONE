<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateChatRequest;
use App\Http\Requests\StoreChatRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chat;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreChatRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Chat $chat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateChatRequest $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
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

        $user = User::find($request->input('user_id'));
        $chat->users()->attach($user);

        return response()->json(['message' => 'User added to chat successfully'], 200);
    }

    public function removeUserFromChat(Request $request, Chat $chat)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->input('user_id'));
        $chat->users()->detach($user);

        return response()->json(['message' => 'User removed from chat successfully'], 200);
    }

}

/**
 * DA INSERIRE IN USERCONTROLLER
 * 
 * public function destroy(User $user)
 * {
 *    $user->chats()->detach();
 *    $user->delete();
 * 
 *    return response()->json(null, 204);
 * }
 */