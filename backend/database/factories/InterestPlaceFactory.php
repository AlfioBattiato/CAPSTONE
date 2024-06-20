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
            'location_img' => 'https://images.unsplash.com/photo-1714572877812-7b416fbd4314?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fHw%3D',
            'rating' => rand(0, 5),
            'lat' => fake()->randomFloat(6, 0, 5), // Assicurati che le coordinate siano numeri in virgola mobile
            'lon' => fake()->randomFloat(6, 0, 5),
        ];
    }
}
