<?php

namespace App\Http\Controllers\Api;

use App\Models\Friendship;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class FriendshipController extends Controller
{
    public function sendRequest(Request $request)
    {
        $request->validate([
            'addressee_id' => 'required|exists:users,id',
        ]);

        $existingFriendship = Friendship::where('requester_id', Auth::id())
            ->where('addressee_id', $request->addressee_id)
            ->first();

        if ($existingFriendship) {
            return response()->json(['error' => 'Friendship request already exists'], 409);
        }

        $friendship = Friendship::create([
            'requester_id' => Auth::id(),
            'addressee_id' => $request->addressee_id,
            'status' => 'pending',
        ]);

        return response()->json($friendship, 201);
    }

    public function acceptRequest($friendshipId)
    {
        $friendship = Friendship::findOrFail($friendshipId);
        if ($friendship->addressee_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $friendship->update(['status' => 'accepted']);

        return response()->json($friendship);
    }

    public function declineRequest($friendshipId)
    {
        $friendship = Friendship::findOrFail($friendshipId);
        if ($friendship->addressee_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $friendship->delete();

        return response()->json(['message' => 'Friendship request declined']);
    }

    public function getPendingRequests()
    {
        $user = Auth::user();
        $pendingRequests = Friendship::where('addressee_id', $user->id)
            ->where('status', 'pending')
            ->with('requester')
            ->get();

        return response()->json($pendingRequests);
    }

    public function checkFriendshipStatus(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'friend_id' => 'required|exists:users,id',
        ]);

        $status = Friendship::where(function ($query) use ($request) {
                $query->where('requester_id', $request->user_id)
                      ->where('addressee_id', $request->friend_id);
            })
            ->orWhere(function ($query) use ($request) {
                $query->where('requester_id', $request->friend_id)
                      ->where('addressee_id', $request->user_id);
            })
            ->value('status');

        return response()->json(['status' => $status]);
    }
}
