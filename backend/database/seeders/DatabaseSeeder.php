<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed test user with credentials: user@hello.com / Password$123!
        $this->call(TestUserSeeder::class);

        // Seed additional random users for testing
        $users = User::factory(5)->create();

        $users->each(function (User $user) {
            Task::factory(5)->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
