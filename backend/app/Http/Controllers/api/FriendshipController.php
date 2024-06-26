<?php

namespace App\Http\Controllers\Api;

use App\Models\Friendship;
use App\Models\User;
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

        $friendship->update(['status' => 'declined']);

        return response()->json($friendship);
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
}
