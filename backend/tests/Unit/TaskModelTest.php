<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_by_status_scope_filters_correctly(): void
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
        Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $pending = Task::byStatus('pending')->get();
        $completed = Task::byStatus('completed')->get();

        $this->assertCount(1, $pending);
        $this->assertCount(1, $completed);
        $this->assertEquals('pending', $pending->first()->status);
        $this->assertEquals('completed', $completed->first()->status);
    }

    public function test_for_user_scope_filters_by_user_id(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Task::factory(3)->create(['user_id' => $user1->id]);
        Task::factory(2)->create(['user_id' => $user2->id]);

        $user1Tasks = Task::forUser($user1->id)->get();
        $user2Tasks = Task::forUser($user2->id)->get();

        $this->assertCount(3, $user1Tasks);
        $this->assertCount(2, $user2Tasks);
    }

    public function test_due_soon_scope_returns_tasks_due_within_days(): void
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'due_date' => now()->addDays(3),
        ]);
        Task::factory()->create([
            'user_id' => $user->id,
            'due_date' => now()->addDays(10),
        ]);

        $dueSoon = Task::dueSoon(7)->get();

        $this->assertCount(1, $dueSoon);
    }

    public function test_is_overdue_accessor_returns_true_for_past_due_date(): void
    {
        $task = Task::factory()->create([
            'due_date' => now()->subDays(1),
            'status' => 'pending',
        ]);

        $this->assertTrue($task->is_overdue);
    }

    public function test_is_overdue_accessor_returns_false_for_future_due_date(): void
    {
        $task = Task::factory()->create([
            'due_date' => now()->addDays(1),
            'status' => 'pending',
        ]);

        $this->assertFalse($task->is_overdue);
    }

    public function test_is_overdue_accessor_returns_false_for_completed_tasks(): void
    {
        $task = Task::factory()->create([
            'due_date' => now()->subDays(1),
            'status' => 'completed',
        ]);

        $this->assertFalse($task->is_overdue);
    }

    public function test_is_overdue_accessor_returns_false_when_no_due_date(): void
    {
        $task = Task::factory()->create([
            'due_date' => null,
            'status' => 'pending',
        ]);

        $this->assertFalse($task->is_overdue);
    }

    public function test_task_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
    }

    public function test_user_has_many_tasks(): void
    {
        $user = User::factory()->create();
        Task::factory(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->tasks);
        $this->assertInstanceOf(Task::class, $user->tasks->first());
    }
}
