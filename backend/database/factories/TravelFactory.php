<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Travel>
 */
class TravelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // $user_id = User::all()->pluck('id')->all();
        $citys = ['milano', 'roma', 'catania', 'napoli', 'brindisi', 'la spezia'];
        $type_moto = ['race bikes', 'motocross', 'scooter', 'off road', 'harley'];
        $cc_moto = [150, 300, 600, 1200];
        $departure_date = fake()->dateTimeBetween('now', '+1 week');
        $expiration_date = (clone $departure_date)->modify('+'.fake()->numberBetween(0, 3).' days');

        return [
            // 'user_id' => fake()->randomElement($user_id),
            'start_location' => fake()->randomElement($citys),
            'lat' => fake()->randomFloat(6, 0, 5), // Assicurati che le coordinate siano numeri in virgola mobile
            'lon' => fake()->randomFloat(6, 0, 5),
            'type_moto' => fake()->randomElement($type_moto),
            'cc_moto' => fake()->randomElement($cc_moto),
            'departure_date' => $departure_date->format('Y-m-d'), 
            'expiration_date' => $expiration_date->format('Y-m-d'),
            'active' => true,
        ];
    }
}
