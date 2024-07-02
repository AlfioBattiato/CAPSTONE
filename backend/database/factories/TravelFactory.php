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
        $citys = [
            ['name' => 'Milano', 'lat' => 45.4642, 'lon' => 9.1900],
            ['name' => 'Roma', 'lat' => 41.9028, 'lon' => 12.4964],
            ['name' => 'Catania', 'lat' => 37.5079, 'lon' => 15.0830],
            ['name' => 'Napoli', 'lat' => 40.8518, 'lon' => 14.2681],
            ['name' => 'Brindisi', 'lat' => 40.6320, 'lon' => 17.9365],
            ['name' => 'La Spezia', 'lat' => 44.1025, 'lon' => 9.8241],
            ['name' => 'Barcellona', 'lat' => 41.3851, 'lon' => 2.1734],
            ['name' => 'Lisbona', 'lat' => 38.7223, 'lon' => -9.1393],
            ['name' => 'Amsterdam', 'lat' => 52.3676, 'lon' => 4.9041],
            ['name' => 'Bruxelles', 'lat' => 50.8503, 'lon' => 4.3517],
            ['name' => 'Stoccolma', 'lat' => 59.3293, 'lon' => 18.0686],
            ['name' => 'Copenaghen', 'lat' => 55.6761, 'lon' => 12.5683],
            ['name' => 'Oslo', 'lat' => 59.9139, 'lon' => 10.7522],
            ['name' => 'Helsinki', 'lat' => 60.1695, 'lon' => 24.9354],
            ['name' => 'Praga', 'lat' => 50.0755, 'lon' => 14.4378],
            ['name' => 'Budapest', 'lat' => 47.4979, 'lon' => 19.0402],
            ['name' => 'Atene', 'lat' => 37.9838, 'lon' => 23.7275],
            ['name' => 'Dublino', 'lat' => 53.3498, 'lon' => -6.2603],
            ['name' => 'Varsavia', 'lat' => 52.2297, 'lon' => 21.0122],
            ['name' => 'Bucarest', 'lat' => 44.4268, 'lon' => 26.1025],
            ['name' => 'Sofia', 'lat' => 42.6977, 'lon' => 23.3219],
            ['name' => 'Zagabria', 'lat' => 45.8150, 'lon' => 15.9819],
            ['name' => 'Belgrado', 'lat' => 44.7866, 'lon' => 20.4489],
            ['name' => 'Lubiana', 'lat' => 46.0569, 'lon' => 14.5058],
            ['name' => 'Bratislava', 'lat' => 48.1486, 'lon' => 17.1077],
            ['name' => 'Riga', 'lat' => 56.9496, 'lon' => 24.1052]
        ];
        

        $type_moto = ['Race Bikes', 'Motocross', 'Scooter', 'Off Road', 'Harley'];
        $cc_moto = [150, 300, 600, 1200];
        $departure_date = $this->faker->dateTimeBetween('now', '+1 week');
        $days = $this->faker->numberBetween(1, 10);
        $expiration_date = (clone $departure_date)->modify('+' . $days . ' days');

        // Scegli una città casuale dalla lista
        $city = $this->faker->randomElement($citys);

        return [
            'start_location' => $city['name'],
            'lat' => $city['lat'],
            'lon' => $city['lon'],
            'type_moto' => $this->faker->randomElement($type_moto),
            'cc_moto' => $this->faker->randomElement($cc_moto),
            'departure_date' => $departure_date->format('Y-m-d H:i:s'),
            'expiration_date' => $expiration_date->format('Y-m-d H:i:s'),
            'days' => $days,
            'active' => true,
        ];
    }
}
