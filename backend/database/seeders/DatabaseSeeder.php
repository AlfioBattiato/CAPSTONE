<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Travel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UserSeeder::class,
            // InterestPlaceSeeder::class,
            // TravelSeeder::class,
            // MetaSeeder::class,
            ChatSeeder::class,
        ]);
        
        $travels = Travel::all();
        $users = User::all();

        foreach ($travels as $travel) {
            $randomUsers = $users->random(rand(1, $users->count()));
            $userIds = $randomUsers->pluck('id')->toArray();
            $travel->users()->sync($userIds);

            if ($travel->chat) {
                $travel->chat->addUsersFromTravel($travel);
            }
        }
    }
}
