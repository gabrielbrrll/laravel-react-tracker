<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update the test user
        $user = User::updateOrCreate(
            ['email' => 'user@hello.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('Password$123!'),
            ]
        );

        // Delete existing tasks for this user to ensure clean state
        Task::where('user_id', $user->id)->delete();

        // Create 5 test tasks
        $tasks = [
            [
                'title' => 'Complete project documentation',
                'description' => 'Write comprehensive documentation for the task tracker application including setup instructions and API endpoints.',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(7),
            ],
            [
                'title' => 'Review pull requests',
                'description' => 'Review and merge pending pull requests from the development team.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now()->addDays(3),
            ],
            [
                'title' => 'Fix authentication bug',
                'description' => 'Investigate and fix the login issue reported by users on mobile devices.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
            ],
            [
                'title' => 'Update dependencies',
                'description' => 'Update all project dependencies to their latest stable versions and test for compatibility.',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(14),
            ],
            [
                'title' => 'Deploy to production',
                'description' => 'Deploy the latest version to production environment after all tests pass.',
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => now()->subDays(1),
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create([
                'user_id' => $user->id,
                'title' => $taskData['title'],
                'description' => $taskData['description'],
                'status' => $taskData['status'],
                'priority' => $taskData['priority'],
                'due_date' => $taskData['due_date'],
            ]);
        }

        $this->command->info("Created test user: {$user->email}");
        $this->command->info('Created 5 tasks for test user');
    }
}
