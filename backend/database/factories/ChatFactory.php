<?php

namespace Database\Factories;

use App\Models\Chat;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChatFactory extends Factory
{
    protected $model = Chat::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence,
            'active' => true,
            'type' => 'group',
            'image' => '/assets/profiles/group-of-people.svg',
        ];
    }
}
