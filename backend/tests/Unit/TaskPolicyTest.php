<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    use RefreshDatabase;

    private TaskPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new TaskPolicy;
    }

    public function test_any_user_can_view_any_tasks(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($this->policy->viewAny($user));
    }

    public function test_user_can_view_their_own_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->policy->view($user, $task));
    }

    public function test_user_cannot_view_other_users_task(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($this->policy->view($user, $task));
    }

    public function test_any_user_can_create_tasks(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($this->policy->create($user));
    }

    public function test_user_can_update_their_own_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->policy->update($user, $task));
    }

    public function test_user_cannot_update_other_users_task(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($this->policy->update($user, $task));
    }

    public function test_user_can_delete_their_own_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->policy->delete($user, $task));
    }

    public function test_user_cannot_delete_other_users_task(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $this->assertFalse($this->policy->delete($user, $task));
    }
}
