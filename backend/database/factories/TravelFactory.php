<?php

namespace Database\Factories;

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
        $citys = ['Milano', 'Roma', 'Catania', 'Napoli', 'Brindisi', 'La Spezia'];
        $type_moto = ['Race Bikes', 'Motocross', 'Scooter', 'Off Road', 'Harley'];
        $cc_moto = [150, 300, 600, 1200];
        $departure_date = $this->faker->dateTimeBetween('now', '+1 week');
        $days = $this->faker->numberBetween(1, 10);
        $expiration_date = (clone $departure_date)->modify('+' . $days . ' days');

        return [
            'start_location' => $this->faker->randomElement($citys),
            'lat' => $this->faker->latitude,
            'lon' => $this->faker->longitude,
            'type_moto' => $this->faker->randomElement($type_moto),
            'cc_moto' => $this->faker->randomElement($cc_moto),
            'departure_date' => $departure_date->format('Y-m-d H:i:s'),
            'expiration_date' => $expiration_date->format('Y-m-d H:i:s'),
            'days' => $days,
            'active' => true,
        ];
    }
}
