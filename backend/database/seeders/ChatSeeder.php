<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Chat;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user1 = User::where('email', 'a@a.a')->first();
        $user2 = User::where('email', 'g@g.g')->first();
        $user3 = User::where('email', 'pincor@pancor.com')->first();

        if ($user1 && $user2 && $user3) {

            $chat1 = Chat::create(['name' => 'Chat between admin and guest']);
            $chat1->users()->attach([$user1->id, $user2->id]);

            $chat2 = Chat::create(['name' => 'Chat between admin and user3']);
            $chat2->users()->attach([$user1->id, $user3->id]);

            $chat3 = Chat::create(['name' => 'Chat between guest and user3']);
            $chat3->users()->attach([$user2->id, $user3->id]);


            $groupChat = Chat::create(['name' => 'Group Chat']);
            $groupChat->users()->attach([$user1->id, $user2->id, $user3->id]);
        } else {

            $this->command->error('Gli utenti non sono stati trovati. Assicurati di eseguire UserSeeder prima di ChatSeeder.');
        }
    }
}
