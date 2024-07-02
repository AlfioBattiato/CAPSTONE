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

        Travel::factory(50)->create()->each(function ($travel) use ($users) {
            // Seleziona un utente casuale come creatore
            $creatorUser = $users->random();

            // Associa l'utente creatore al viaggio
            $travel->users()->syncWithoutDetaching([$creatorUser->id => ['role' => 'creator_travel', 'active' => true]]);
            Log::info('Creator associated with travel: ' . json_encode([$creatorUser->id]));

            // Aggiungi altri utenti al viaggio come partecipanti
            $travelUsers = $users->where('id', '!=', $creatorUser->id)->random(rand(0, 2))->pluck('id')->toArray();
            $participants = array_fill_keys($travelUsers, ['role' => 'guest', 'active' => true]);

            // Associa gli altri utenti come partecipanti
            $travel->users()->syncWithoutDetaching($participants);

            Log::info('Participants associated with travel: ' . json_encode($travelUsers));
        });
    }
}
