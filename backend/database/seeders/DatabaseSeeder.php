<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Travel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TravelSeeder::class,
            MetaSeeder::class,
            ChatSeeder::class,
        ]);

        $travels = Travel::all();
        $users = User::all();

        foreach ($travels as $travel) {
            // Seleziona un utente casuale come creatore
            $creatorUser = $users->random();

            // Associa l'utente creatore al viaggio
            $travel->users()->syncWithoutDetaching([$creatorUser->id => ['role' => 'creator_travel', 'active' => true]]);

            // Aggiungi altri utenti al viaggio come partecipanti
            $otherUsers = $users->where('id', '!=', $creatorUser->id)->random(rand(0, $users->count() - 1));
            $otherUserIds = $otherUsers->pluck('id')->toArray();
            $travel->users()->syncWithoutDetaching(array_fill_keys($otherUserIds, ['role' => 'guest', 'active' => true]));

            if ($travel->chat) {
                $travel->chat->addUsersFromTravel($travel);
            }
        }
    }
}
