<?php

namespace Database\Seeders;

use App\Models\Travel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class TravelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        Travel::factory(10)->create()->each(function ($travel) use ($users) {
            // Seleziona un utente casuale come creatore
            $creatorUser = $users->random();
            
            // Associa l'utente creatore al viaggio
            $travel->users()->syncWithoutDetaching([$creatorUser->id => ['role' => 'creator_travel', 'active' => true]]);
            Log::info('Users associated with travel: ' . json_encode([$creatorUser->id]));

            // Aggiungi altri utenti al viaggio
            $travelUsers = $users->where('id', '!=', $creatorUser->id)->random(rand(0, 2))->pluck('id')->toArray();
            $travel->users()->syncWithoutDetaching($travelUsers);
        });
    }
}
