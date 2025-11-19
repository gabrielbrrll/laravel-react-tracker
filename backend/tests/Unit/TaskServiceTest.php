<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    private TaskService $service;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new TaskService;
        $this->user = User::factory()->create();
    }

    public function test_get_all_tasks_returns_only_user_tasks(): void
    {
        Task::factory(3)->create(['user_id' => $this->user->id]);
        Task::factory(2)->create(); // Other user's tasks

        $result = $this->service->getAllTasks($this->user);

        $this->assertCount(3, $result);
    }

    public function test_get_all_tasks_filters_by_status(): void
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
        ]);

        $result = $this->service->getAllTasks($this->user, ['status' => 'pending']);

        $this->assertCount(1, $result);
        $this->assertEquals('pending', $result->first()->status);
    }

    public function test_get_all_tasks_filters_by_priority(): void
    {
        Task::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 2,
        ]);
        Task::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 0,
        ]);

        $result = $this->service->getAllTasks($this->user, ['priority' => 2]);

        $this->assertCount(1, $result);
        $this->assertEquals(2, $result->first()->priority);
    }

    public function test_create_task_assigns_user_id(): void
    {
        $taskData = [
            'title' => 'New Task',
            'description' => 'Test description',
            'status' => 'pending',
            'priority' => 1,
        ];

        $task = $this->service->createTask($this->user, $taskData);

        $this->assertEquals($this->user->id, $task->user_id);
        $this->assertEquals('New Task', $task->title);
        $this->assertDatabaseHas('tasks', [
            'title' => 'New Task',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_update_task_modifies_task(): void
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $updated = $this->service->updateTask($task, ['status' => 'completed']);

        $this->assertEquals('completed', $updated->status);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    }

    public function test_delete_task_soft_deletes(): void
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $result = $this->service->deleteTask($task);

        $this->assertTrue($result);
        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }

    public function test_get_task_statistics_calculates_correctly(): void
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
        Task::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
            'due_date' => now()->subDays(1),
        ]);

        $stats = $this->service->getTaskStatistics($this->user);

        $this->assertEquals(4, $stats['total']);
        $this->assertEquals(2, $stats['pending']);
        $this->assertEquals(1, $stats['in_progress']);
        $this->assertEquals(1, $stats['completed']);
        $this->assertEquals(1, $stats['overdue']);
    }

    public function test_get_all_tasks_sorts_by_created_at_desc_by_default(): void
    {
        $older = Task::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now()->subDays(2),
        ]);
        $newer = Task::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now(),
        ]);

        $result = $this->service->getAllTasks($this->user);

        $this->assertEquals($newer->id, $result->first()->id);
        $this->assertEquals($older->id, $result->last()->id);
    }
}
