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

        $user3 = User::factory()->create([
            'username' => 'PincorPancor',
            'email' => 'pincor@pancor.com',
            'role' => 'guest',
            'active' => true,
            'rating' => 0,
            'profile_img' => 'http://localhost:8000/storage/profiles/Missing_photo.svg',
        ]);

        $chat1 = Chat::create();
        $chat1->users()->attach([$user1->id, $user2->id]);

        $chat2 = Chat::create();
        $chat2->users()->attach([$user1->id, $user3->id]);

        $chat3 = Chat::create();
        $chat3->users()->attach([$user2->id, $user3->id]);


        $groupChat = Chat::create(['name' => 'Group Chat']);
        $groupChat->users()->attach([$user1->id, $user2->id, $user3->id]);
    }
}

