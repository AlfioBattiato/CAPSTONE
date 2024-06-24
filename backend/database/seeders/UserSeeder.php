<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Chat;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user1 = User::factory()->create([
            'username' => 'admin',
            'email' => 'a@a.a',
            'role' => 'admin',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);

        $user2 = User::factory()->create([
            'username' => 'guest',
            'email' => 'g@g.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);
        $user5 = User::factory()->create([
            'username' => 'guestw',
            'email' => 'g@w.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);$user6 = User::factory()->create([
            'username' => 'guestq',
            'email' => 'g@q.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);$user7 = User::factory()->create([
            'username' => 'guestr',
            'email' => 'g@r.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);$user8 = User::factory()->create([
            'username' => 'guestt',
            'email' => 'g@t.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);$user9 = User::factory()->create([
            'username' => 'guesty',
            'email' => 'g@y.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);$user0 = User::factory()->create([
            'username' => 'guesta',
            'email' => 'g@a.g',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);
        $user3 = User::factory()->create([
            'username' => 'PincorPancor',
            'email' => 'pincor@pancor.com',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);

    }
}

