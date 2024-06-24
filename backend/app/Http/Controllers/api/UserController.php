<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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

    public function getUserTravels($id)
    {
        $user = User::findOrFail($id);

        $travels = $user->travels;

        return response()->json($travels);
    }

    public function updateProfileImage(Request $request, $id)
    {
        $request->validate([
            'profile_img' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = User::findOrFail($id);

        if ($request->hasFile('profile_img')) {
            // Elimina l'immagine esistente se presente
            if ($user->profile_img) {
                Storage::delete(str_replace('/storage', 'public', $user->profile_img));
            }

            // Carica la nuova immagine
            $path = $request->file('profile_img')->store('public/profile_images');

            // Ottieni l'URL completo
            $url = Storage::url($path);

            // Aggiorna il percorso dell'immagine nel modello utente
            $user->profile_img = url($url);
            $user->save();

            return response()->json($user);
        } else {
            Log::error('Profile image not found in request.');
            return response()->json(['error' => 'Profile image not found'], 422);
        }
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

    // UserController.php

    public function search(Request $request)
{
    
    $query = $request->input('q');
    Log::info("Search query: $query");
    $users = User::where('username', 'LIKE', "%$query%")->get();
    Log::info("Found users: " . $users->count());

    if ($users->isEmpty()) {
        return response()->json([], 200);
    }

    return response()->json($users);
}


}
