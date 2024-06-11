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
            InterestPlaceSeeder::class,
            TravelSeeder::class,
            MetaSeeder::class,

        ]);
        $travels = Travel::all();
        $users = User::all();

        foreach ($travels as $travel) {
            foreach ($users as $user) {
                $travel->users()->attach($user->id);
            }
        }



    }
}
