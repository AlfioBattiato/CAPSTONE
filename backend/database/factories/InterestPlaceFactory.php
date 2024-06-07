<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InterestPlace>
 */
class InterestPlaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user_id = User::all()->pluck('id')->all();

        return [
            'user_id' => fake()->randomElement($user_id),
            'name_location' => fake()->name(),
            'description' => fake()->words(rand(10, 10), true),
            'location_img' => 'img_percorso',
            'rating' => rand(0, 5),
            'lat' => fake()->randomFloat(6, 0, 5), // Assicurati che le coordinate siano numeri in virgola mobile
            'lon' => fake()->randomFloat(6, 0, 5),
        ];
    }
}
