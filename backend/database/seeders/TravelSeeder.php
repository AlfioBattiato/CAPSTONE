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
            
            $randomUsers = $users->random(rand(2, $users->count()))->pluck('id')->toArray();   
            $travel->users()->attach($randomUsers);
            
        });
    }
}
