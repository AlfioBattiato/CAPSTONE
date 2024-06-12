<?php

namespace Database\Seeders;

use App\Models\Travel;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TravelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        
        Travel::factory(10)->create()->each(function ($travel) use ($users) {

            $travelUsers = $users->random(rand(1, 3))->pluck('id')->toArray();
            $travel->users()->attach($travelUsers);
        });
    }
}
