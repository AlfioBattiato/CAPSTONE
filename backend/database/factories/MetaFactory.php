<?php

namespace Database\Factories;

use App\Models\Travel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Meta>
 */
class MetaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $travel_id = Travel::all()->pluck('id')->all();

        return [
            'travel_id' => fake()->randomElement($travel_id),
            'name_location' => fake()->name(),
            'lat' => fake()->randomFloat(6, 0, 5), // Assicurati che le coordinate siano numeri in virgola mobile
            'lon' => fake()->randomFloat(6, 0, 5),
        ];
    }
}
