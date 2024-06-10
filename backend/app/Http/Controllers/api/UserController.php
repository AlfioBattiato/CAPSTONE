<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'username' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
            'role' => 'sometimes|string|max:255',
            'profile_img' => 'sometimes|string|max:255',
            'rating' => 'sometimes|integer',
            'active' => 'sometimes|boolean',
        ]);

        if ($request->has('username')) {
            $user->username = $request->input('username');
        }

        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        if ($request->has('role')) {
            $user->role = $request->input('role');
        }

        if ($request->has('profile_img')) {
            $user->profile_img = $request->input('profile_img');
        }

        if ($request->has('rating')) {
            $user->rating = $request->input('rating');
        }

        if ($request->has('active')) {
            $user->active = $request->input('active');
        }

        $user->save();

        return response()->json($user);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->chats()->detach();
        // Optionally detach other relationships here
        $user->delete();

        return response()->json(null, 204);
    }
}
