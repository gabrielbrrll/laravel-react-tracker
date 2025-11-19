<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_user_can_list_their_tasks(): void
    {
        Task::factory(3)->create(['user_id' => $this->user->id]);
        Task::factory(2)->create(); // Other user's tasks

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_create_task_with_valid_data(): void
    {
        $taskData = [
            'title' => 'New Task',
            'description' => 'Task description',
            'status' => 'pending',
            'priority' => 1,
            'due_date' => now()->addDays(7)->format('Y-m-d'),
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Task created successfully',
                'data' => [
                    'title' => 'New Task',
                    'status' => 'pending',
                    'priority' => 1,
                ],
            ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_task_creation_fails_with_invalid_data(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/tasks', [
                'description' => 'Missing required fields',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'status', 'priority']);
    }

    public function test_user_can_view_their_own_task(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $task->id,
                    'title' => $task->title,
                ],
            ]);
    }

    public function test_user_cannot_view_other_users_task(): void
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Unauthorized action',
            ]);
    }

    public function test_user_can_update_their_own_task(): void
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/{$task->id}", [
                'status' => 'completed',
                'priority' => 2,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Task updated successfully',
                'data' => [
                    'status' => 'completed',
                    'priority' => 2,
                ],
            ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    }

    public function test_user_cannot_update_other_users_task(): void
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson("/api/tasks/{$task->id}", [
                'status' => 'completed',
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_their_own_task(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(204);

        $this->assertSoftDeleted('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_task(): void
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_can_filter_tasks_by_status(): void
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/tasks?status=pending');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'pending');
    }

    public function test_can_filter_tasks_by_priority(): void
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 2,
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 0,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/tasks?priority=2');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.priority', 2);
    }

    public function test_can_get_task_statistics(): void
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'in_progress',
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/tasks/statistics');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'total' => 3,
                    'pending' => 1,
                    'in_progress' => 1,
                    'completed' => 1,
                ],
            ]);
    }
}
