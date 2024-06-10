<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'profile_img' => ['nullable', 'image', 'max:1024'],
        ]);

        // $file_path = $request["profile_img"] ? Storage::put('/profiles', $request['profile_img']) : 'profiles/Missing_photo.svg';
        $file_path = $request->file('profile_img') ? $request->file('profile_img')->store('profiles', 'public') : '/profiles/Missing_photo.svg';

        $data = $request->all();
        $user = new User();
        $user->username = $data['username'];
        $user->email = $data['email'];
        $user->password = $data['password'];
        $user->role = 'guest';
        $user->active = true;
        $user->rating = 0;
        $user->profile_img = 'http://localhost:8000/storage/' . $file_path;
        $user->save();


      
        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
