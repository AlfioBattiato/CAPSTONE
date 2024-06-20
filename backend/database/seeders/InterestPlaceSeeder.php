<?php

namespace Database\Seeders;

use App\Models\InterestPlace;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InterestPlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InterestPlace::factory(25)->create();
    }
}
